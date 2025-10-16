#include "pylite/parser.hpp"

#include <memory>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

namespace pylite {
namespace {

using ast::AssignmentStmt;
using ast::BinaryExpr;
using ast::BlockStmt;
using ast::CallExpr;
using ast::Expression;
using ast::ExpressionStmt;
using ast::FunctionStmt;
using ast::IfStmt;
using ast::LiteralExpr;
using ast::Parameter;
using ast::ReturnStmt;
using ast::SourceLocation;
using ast::Statement;
using ast::UnaryExpr;
using ast::VariableExpr;
using ast::WhileStmt;

class ParserImpl {
public:
    explicit ParserImpl(const std::vector<Token> &tokens) : tokens_(tokens) {}

    BlockStmt::Ptr parse() {
        skipNewlines();
        auto program = parseBlock(false);
        skipNewlines();
        consume(TokenType::EndOfFile, "Expected end of input");
        return program;
    }

private:
    const std::vector<Token> &tokens_;
    std::size_t current_ = 0;
    const Token *previous_ = nullptr;

    BlockStmt::Ptr parseBlock(bool expectIndent) {
        SourceLocation blockLocation = locationForCurrent();
        if (expectIndent) {
            const Token &indentToken = consume(TokenType::Indent, "Expected indentation to start block");
            blockLocation = toLocation(indentToken);
        }

        std::vector<Statement::Ptr> statements;

        while (true) {
            skipNewlines();

            if (expectIndent && check(TokenType::Dedent)) {
                advance();
                break;
            }

            if (!expectIndent) {
                if (check(TokenType::EndOfFile)) {
                    break;
                }
            } else if (check(TokenType::EndOfFile)) {
                throw makeError(peek(), "Unexpected end of input inside block");
            }

            if (!expectIndent && check(TokenType::Dedent)) {
                throw makeError(peek(), "Unexpected dedent");
            }

            if (check(TokenType::Indent)) {
                auto nested = parseBlock(true);
                statements.push_back(nested);
                continue;
            }

            if (check(TokenType::EndOfFile)) {
                break;
            }

            if (check(TokenType::Dedent)) {
                break;
            }

            auto statement = parseStatement();
            statements.push_back(statement);

            if (match(TokenType::Newline)) {
                continue;
            }

            if (expectIndent && check(TokenType::Dedent)) {
                continue;
            }

            if (check(TokenType::EndOfFile)) {
                break;
            }

            if (!check(TokenType::Newline)) {
                throw makeError(peek(), "Expected newline after statement");
            }
        }

        SourceLocation location = blockLocation;
        if (!statements.empty()) {
            location = statements.front()->location();
        }

        return std::make_shared<BlockStmt>(std::move(statements), location);
    }

    Statement::Ptr parseStatement() {
        if (check(TokenType::Keyword)) {
            const Token &keyword = peek();
            if (keyword.lexeme == "if") {
                advance();
                return parseIfStatement(toLocation(keyword));
            }
            if (keyword.lexeme == "while") {
                advance();
                return parseWhileStatement(toLocation(keyword));
            }
            if (keyword.lexeme == "def") {
                advance();
                return parseFunctionStatement(toLocation(keyword));
            }
            if (keyword.lexeme == "return") {
                advance();
                return parseReturnStatement(toLocation(keyword));
            }
            if (keyword.lexeme == "elif" || keyword.lexeme == "else") {
                throw makeError(keyword, "Unexpected '" + keyword.lexeme + "' without preceding 'if'");
            }
        }

        if (check(TokenType::Identifier) && check(TokenType::Operator, "=", 1)) {
            const Token &identifier = advance();
            SourceLocation location = toLocation(identifier);
            advance();  // consume '='
            auto value = parseExpression();
            return std::make_shared<AssignmentStmt>(identifier.lexeme, std::move(value), location);
        }

        auto expression = parseExpression();
        SourceLocation location = expression->location();
        return std::make_shared<ExpressionStmt>(std::move(expression), location);
    }

    Statement::Ptr parseFunctionStatement(SourceLocation location) {
        const Token &nameToken = consume(TokenType::Identifier, "Expected function name after 'def'");
        consume(TokenType::Punctuation, "(", "Expected '(' after function name");
        auto parameters = parseParameterList();
        consume(TokenType::Punctuation, ")", "Expected ')' after parameter list");
        consume(TokenType::Punctuation, ":", "Expected ':' after function signature");
        consume(TokenType::Newline, "Expected newline after ':' in function definition");
        auto body = parseBlock(true);
        skipNewlines();
        return std::make_shared<FunctionStmt>(nameToken.lexeme, std::move(parameters), std::move(body), location);
    }

    std::vector<Parameter::Ptr> parseParameterList() {
        std::vector<Parameter::Ptr> parameters;
        if (check(TokenType::Punctuation, ")")) {
            return parameters;
        }
        do {
            const Token &paramToken = consume(TokenType::Identifier, "Expected parameter name");
            parameters.push_back(std::make_shared<Parameter>(paramToken.lexeme, toLocation(paramToken)));
        } while (match(TokenType::Punctuation, ","));
        return parameters;
    }

    Statement::Ptr parseReturnStatement(SourceLocation location) {
        if (check(TokenType::Newline) || check(TokenType::Dedent) || check(TokenType::EndOfFile)) {
            return std::make_shared<ReturnStmt>(nullptr, location);
        }
        auto value = parseExpression();
        return std::make_shared<ReturnStmt>(std::move(value), location);
    }

    Statement::Ptr parseIfStatement(SourceLocation location) {
        auto condition = parseExpression();
        consume(TokenType::Punctuation, ":", "Expected ':' after condition");
        consume(TokenType::Newline, "Expected newline after ':' in if statement");
        auto thenBranch = parseBlock(true);
        skipNewlines();

        Statement::Ptr elseBranch;

        if (matchKeyword("elif")) {
            SourceLocation elifLocation = toLocation(previous());
            elseBranch = parseIfStatement(elifLocation);
        } else if (matchKeyword("else")) {
            consume(TokenType::Punctuation, ":", "Expected ':' after else");
            consume(TokenType::Newline, "Expected newline after ':' in else clause");
            auto elseBlock = parseBlock(true);
            elseBranch = elseBlock;
            skipNewlines();
        }

        return std::make_shared<IfStmt>(std::move(condition), std::move(thenBranch), std::move(elseBranch), location);
    }

    Statement::Ptr parseWhileStatement(SourceLocation location) {
        auto condition = parseExpression();
        consume(TokenType::Punctuation, ":", "Expected ':' after while condition");
        consume(TokenType::Newline, "Expected newline after ':' in while statement");
        auto body = parseBlock(true);
        skipNewlines();
        return std::make_shared<WhileStmt>(std::move(condition), std::move(body), location);
    }

    Expression::Ptr parseExpression(int minPrecedence = 0) {
        auto left = parseUnary();

        while (true) {
            const Token &opToken = peek();
            int prec = precedence(opToken);
            if (prec < minPrecedence) {
                break;
            }

            bool rightAssociative = isRightAssociative(opToken);
            advance();
            int nextMin = rightAssociative ? prec : prec + 1;
            auto right = parseExpression(nextMin);
            SourceLocation location = toLocation(opToken);
            left = std::make_shared<BinaryExpr>(opToken.lexeme, std::move(left), std::move(right), location);
        }

        return left;
    }

    Expression::Ptr parseUnary() {
        if (match(TokenType::Operator, "+") || match(TokenType::Operator, "-")) {
            const Token &op = previous();
            auto operand = parseUnary();
            return std::make_shared<UnaryExpr>(op.lexeme, std::move(operand), toLocation(op));
        }

        if (matchKeyword("not")) {
            const Token &op = previous();
            auto operand = parseUnary();
            return std::make_shared<UnaryExpr>(op.lexeme, std::move(operand), toLocation(op));
        }

        return parseCall();
    }

    Expression::Ptr parseCall() {
        auto expression = parsePrimary();

        while (true) {
            if (match(TokenType::Punctuation, "(")) {
                SourceLocation callLocation = toLocation(previous());
                std::vector<Expression::Ptr> arguments;
                if (!check(TokenType::Punctuation, ")")) {
                    do {
                        arguments.push_back(parseExpression());
                    } while (match(TokenType::Punctuation, ","));
                }
                consume(TokenType::Punctuation, ")", "Expected ')' after call arguments");
                expression = std::make_shared<CallExpr>(std::move(expression), std::move(arguments), callLocation);
                continue;
            }

            break;
        }

        return expression;
    }

    Expression::Ptr parsePrimary() {
        const Token &token = peek();
        switch (token.type) {
            case TokenType::Integer:
            case TokenType::Float:
            case TokenType::String: {
                advance();
                return std::make_shared<LiteralExpr>(token.literal, token.type, toLocation(token));
            }
            case TokenType::Identifier: {
                advance();
                return std::make_shared<VariableExpr>(token.lexeme, toLocation(token));
            }
            case TokenType::Keyword: {
                if (token.lexeme == "True" || token.lexeme == "False" || token.lexeme == "None") {
                    advance();
                    return std::make_shared<LiteralExpr>(token.literal, token.type, toLocation(token));
                }
                advance();
                return std::make_shared<VariableExpr>(token.lexeme, toLocation(token));
            }
            case TokenType::Punctuation: {
                if (token.lexeme == "(") {
                    advance();
                    auto expr = parseExpression();
                    consume(TokenType::Punctuation, ")", "Expected ')' after expression");
                    return expr;
                }
                break;
            }
            default:
                break;
        }

        throw makeError(token, "Unexpected token '" + token.lexeme + "'");
    }

    int precedence(const Token &token) const {
        if (token.type == TokenType::Keyword) {
            if (token.lexeme == "or") {
                return 1;
            }
            if (token.lexeme == "and") {
                return 2;
            }
            return -1;
        }

        if (token.type != TokenType::Operator) {
            return -1;
        }

        if (token.lexeme == "==" || token.lexeme == "!=" || token.lexeme == "<" || token.lexeme == "<=" ||
            token.lexeme == ">" || token.lexeme == ">=") {
            return 3;
        }

        if (token.lexeme == "+" || token.lexeme == "-") {
            return 4;
        }

        if (token.lexeme == "*" || token.lexeme == "/" || token.lexeme == "//" || token.lexeme == "%") {
            return 5;
        }

        if (token.lexeme == "**") {
            return 6;
        }

        return -1;
    }

    bool isRightAssociative(const Token &token) const {
        return token.type == TokenType::Operator && token.lexeme == "**";
    }

    void skipNewlines() {
        while (match(TokenType::Newline)) {
        }
    }

    bool match(TokenType type) {
        if (!check(type)) {
            return false;
        }
        advance();
        return true;
    }

    bool match(TokenType type, const std::string &lexeme) {
        if (!check(type) || peek().lexeme != lexeme) {
            return false;
        }
        advance();
        return true;
    }

    bool matchKeyword(std::string_view keyword) {
        if (!check(TokenType::Keyword)) {
            return false;
        }
        if (peek().lexeme != keyword) {
            return false;
        }
        advance();
        return true;
    }

    bool check(TokenType type, std::size_t offset = 0) const {
        if (current_ + offset >= tokens_.size()) {
            return false;
        }
        return tokens_[current_ + offset].type == type;
    }

    bool check(TokenType type, const std::string &lexeme, std::size_t offset = 0) const {
        if (!check(type, offset)) {
            return false;
        }
        return tokens_[current_ + offset].lexeme == lexeme;
    }

    const Token &advance() {
        if (!isAtEnd()) {
            previous_ = &tokens_[current_];
            ++current_;
        } else {
            previous_ = &tokens_[current_];
        }
        return *previous_;
    }

    bool isAtEnd() const { return tokens_[current_].type == TokenType::EndOfFile; }

    const Token &peek(std::size_t offset = 0) const {
        if (current_ + offset >= tokens_.size()) {
            return tokens_.back();
        }
        return tokens_[current_ + offset];
    }

    const Token &previous() const {
        if (previous_ == nullptr) {
            return tokens_.front();
        }
        return *previous_;
    }

    const Token &consume(TokenType type, const std::string &message) {
        if (!check(type)) {
            throw makeError(peek(), message);
        }
        return advance();
    }

    const Token &consume(TokenType type, const std::string &lexeme, const std::string &message) {
        if (!check(type) || peek().lexeme != lexeme) {
            throw makeError(peek(), message);
        }
        return advance();
    }

    ParserError makeError(const Token &token, std::string message) const {
        return ParserError(std::move(message), token.line, token.column);
    }

    SourceLocation locationForCurrent() const {
        if (current_ < tokens_.size()) {
            return toLocation(tokens_[current_]);
        }
        if (!tokens_.empty()) {
            return toLocation(tokens_.back());
        }
        return SourceLocation{};
    }

    static SourceLocation toLocation(const Token &token) { return SourceLocation{token.line, token.column}; }
};

}  // namespace

ParserError::ParserError(std::string message, std::size_t line, std::size_t column)
    : std::runtime_error(std::move(message) + " at line " + std::to_string(line) + ", column " + std::to_string(column)),
      line_(line),
      column_(column) {}

BlockStmt::Ptr Parser::parse(const std::vector<Token> &tokens) const {
    ParserImpl impl(tokens);
    return impl.parse();
}

}  // namespace pylite
