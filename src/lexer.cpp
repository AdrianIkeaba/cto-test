#include "pylite/lexer.hpp"

#include <algorithm>
#include <array>
#include <cctype>
#include <cstddef>
#include <cstdint>
#include <string>
#include <string_view>
#include <unordered_set>
#include <utility>

namespace pylite {
namespace {

std::string normalizeLineEndings(const std::string &input) {
    std::string result;
    result.reserve(input.size());

    for (std::size_t i = 0; i < input.size(); ++i) {
        char ch = input[i];
        if (ch == '\r') {
            if (i + 1 < input.size() && input[i + 1] == '\n') {
                ++i;
            }
            result.push_back('\n');
        } else {
            result.push_back(ch);
        }
    }

    return result;
}

const std::unordered_set<std::string> kKeywords = {
    "False", "None",  "True",    "and",   "as",     "assert", "async", "await", "break",  "class",
    "continue", "def",  "del",     "elif",  "else",   "except", "finally", "for",   "from",   "global",
    "if",     "import", "in",     "is",    "lambda", "nonlocal", "not",   "or",    "pass",   "raise",
    "return", "try",   "while",   "with",  "yield"};

const std::array<std::string_view, 22> kOperators = {
    "<<=", ">>=", "**=", "//=", "...", "->", ":=", "==", "!=", "<=", ">=", "<<", ">>",
    "**",  "//",  "+=",  "-=",  "*=",  "/=", "%=", "&=", "|=", "^="};

const std::unordered_set<char> kSingleCharOperators = {
    '+', '-', '*', '/', '%', '&', '|', '^', '~', '@', '=', '<', '>', '!',
};

const std::unordered_set<char> kPunctuation = {
    '(', ')', '[', ']', '{', '}', ',', ':', ';', '.',
};

char decodeEscape(char escape) {
    switch (escape) {
        case '\\':
            return '\\';
        case '\'':
            return '\'';
        case '"':
            return '"';
        case 'n':
            return '\n';
        case 'r':
            return '\r';
        case 't':
            return '\t';
        case '0':
            return '\0';
        default:
            return escape;
    }
}

bool isIdentifierStart(char ch) {
    return std::isalpha(static_cast<unsigned char>(ch)) || ch == '_';
}

bool isIdentifierPart(char ch) {
    return std::isalnum(static_cast<unsigned char>(ch)) || ch == '_';
}

TokenLiteral makeStringLiteral(std::string value) {
    return TokenLiteral(std::move(value));
}

TokenLiteral makeIntegerLiteral(const std::string &text, std::size_t line, std::size_t column) {
    try {
        std::size_t idx = 0;
        long long val = std::stoll(text, &idx, 10);
        if (idx != text.size()) {
            throw LexerError("Invalid integer literal", line, column);
        }
        return TokenLiteral(static_cast<std::int64_t>(val));
    } catch (const std::invalid_argument &) {
        throw LexerError("Invalid integer literal", line, column);
    } catch (const std::out_of_range &) {
        throw LexerError("Integer literal out of range", line, column);
    }
}

TokenLiteral makeFloatLiteral(const std::string &text, std::size_t line, std::size_t column) {
    try {
        std::size_t idx = 0;
        double val = std::stod(text, &idx);
        if (idx != text.size()) {
            throw LexerError("Invalid float literal", line, column);
        }
        return TokenLiteral(val);
    } catch (const std::invalid_argument &) {
        throw LexerError("Invalid float literal", line, column);
    } catch (const std::out_of_range &) {
        throw LexerError("Float literal out of range", line, column);
    }
}

class LexerImpl {
public:
    explicit LexerImpl(std::string source) : source_(std::move(source)) {}

    std::vector<Token> run() {
        while (pos_ < source_.size()) {
            if (atLineStart_ && openBrackets_ == 0) {
                if (handleIndentationAndBlankLines()) {
                    continue;
                }
            }

            char ch = peek();

            if (ch == '\0') {
                break;
            }

            if (ch == ' ' || ch == '\t' || ch == '\f') {
                advance();
                continue;
            }

            if (ch == '#') {
                skipComment();
                continue;
            }

            if (ch == '\n') {
                std::size_t tokenLine = line_;
                std::size_t tokenColumn = column_;
                advance();
                if (openBrackets_ == 0) {
                    emit(TokenType::Newline, "\n", TokenLiteral{}, tokenLine, tokenColumn);
                }
                atLineStart_ = true;
                continue;
            }

            atLineStart_ = false;

            if (ch == '\'' || ch == '"') {
                scanString();
                continue;
            }

            if (std::isdigit(static_cast<unsigned char>(ch)) ||
                (ch == '.' && std::isdigit(static_cast<unsigned char>(peek(1))))) {
                scanNumber();
                continue;
            }

            if (isIdentifierStart(ch)) {
                scanIdentifierOrKeyword();
                continue;
            }

            if (scanOperatorOrPunctuation()) {
                continue;
            }

            throw LexerError(std::string("Invalid character '") + ch + "'", line_, column_);
        }

        finalize();
        return std::move(tokens_);
    }

private:
    char peek(std::size_t offset = 0) const {
        if (pos_ + offset >= source_.size()) {
            return '\0';
        }
        return source_[pos_ + offset];
    }

    char advance() {
        if (pos_ >= source_.size()) {
            return '\0';
        }
        char ch = source_[pos_++];
        if (ch == '\n') {
            ++line_;
            column_ = 1;
        } else {
            ++column_;
        }
        return ch;
    }

    bool match(std::string_view text) {
        if (text.empty()) {
            return false;
        }
        if (pos_ + text.size() > source_.size()) {
            return false;
        }
        if (source_.compare(pos_, text.size(), text) != 0) {
            return false;
        }
        for (char ch : text) {
            (void)ch;
            advance();
        }
        return true;
    }

    void emit(TokenType type, std::string lexeme, TokenLiteral literal, std::size_t line, std::size_t column) {
        tokens_.push_back(Token{type, std::move(lexeme), std::move(literal), line, column});
    }

    void emitSimple(TokenType type, const std::string &lexeme, std::size_t line, std::size_t column) {
        emit(type, lexeme, TokenLiteral{}, line, column);
    }

    void emitSimple(TokenType type, char lexeme, std::size_t line, std::size_t column) {
        emit(type, std::string(1, lexeme), TokenLiteral{}, line, column);
    }

    bool handleIndentationAndBlankLines() {
        std::size_t indentLine = line_;
        std::size_t indentColumn = column_;
        std::size_t indentCount = 0;

        while (true) {
            char ch = peek();
            if (ch == ' ') {
                advance();
                ++indentCount;
            } else if (ch == '\t') {
                advance();
                indentCount += 4;
            } else {
                break;
            }
        }

        char ch = peek();
        if (ch == '\0') {
            return false;
        }

        if (ch == '\n') {
            std::size_t tokenLine = line_;
            std::size_t tokenColumn = column_;
            advance();
            emit(TokenType::Newline, "\n", TokenLiteral{}, tokenLine, tokenColumn);
            atLineStart_ = true;
            return true;
        }

        if (ch == '#') {
            skipComment();
            if (peek() == '\n') {
                std::size_t tokenLine = line_;
                std::size_t tokenColumn = column_;
                advance();
                emit(TokenType::Newline, "\n", TokenLiteral{}, tokenLine, tokenColumn);
                atLineStart_ = true;
                return true;
            }
            return false;
        }

        int currentIndent = indentStack_.back();
        int indentValue = static_cast<int>(indentCount);
        if (indentValue > currentIndent) {
            indentStack_.push_back(indentValue);
            emit(TokenType::Indent, "", TokenLiteral{}, indentLine, indentColumn);
        } else if (indentValue < currentIndent) {
            while (indentValue < indentStack_.back()) {
                indentStack_.pop_back();
                emit(TokenType::Dedent, "", TokenLiteral{}, indentLine, indentColumn);
            }
            if (indentValue != indentStack_.back()) {
                throw LexerError("Inconsistent dedent level", indentLine, indentColumn);
            }
        }

        atLineStart_ = false;
        return false;
    }

    void skipComment() {
        while (true) {
            char ch = peek();
            if (ch == '\0' || ch == '\n') {
                break;
            }
            advance();
        }
    }

    void scanIdentifierOrKeyword() {
        std::size_t tokenLine = line_;
        std::size_t tokenColumn = column_;
        std::size_t start = pos_;
        advance();
        while (isIdentifierPart(peek())) {
            advance();
        }
        std::string text = source_.substr(start, pos_ - start);
        if (kKeywords.find(text) != kKeywords.end()) {
            emit(TokenType::Keyword, text, makeStringLiteral(text), tokenLine, tokenColumn);
        } else {
            emit(TokenType::Identifier, text, makeStringLiteral(text), tokenLine, tokenColumn);
        }
    }

    void scanNumber() {
        std::size_t tokenLine = line_;
        std::size_t tokenColumn = column_;
        std::size_t start = pos_;
        bool sawDigits = false;

        auto consumeDigits = [this](bool &flag) {
            while (std::isdigit(static_cast<unsigned char>(peek()))) {
                advance();
                flag = true;
            }
        };

        consumeDigits(sawDigits);

        bool isFloat = false;

        if (peek() == '.' && std::isdigit(static_cast<unsigned char>(peek(1)))) {
            isFloat = true;
            advance();
            consumeDigits(sawDigits);
        }

        if (!sawDigits && peek() == '.' && std::isdigit(static_cast<unsigned char>(peek(1)))) {
            // Leading dot handled above, but ensure we mark as float
            isFloat = true;
        }

        if (peek() == 'e' || peek() == 'E') {
            isFloat = true;
            advance();
            if (peek() == '+' || peek() == '-') {
                advance();
            }
            if (!std::isdigit(static_cast<unsigned char>(peek()))) {
                throw LexerError("Invalid float literal exponent", line_, column_);
            }
            bool dummy = false;
            consumeDigits(dummy);
        }

        std::string text = source_.substr(start, pos_ - start);
        if (isFloat || text.find('.') != std::string::npos || text.find('e') != std::string::npos ||
            text.find('E') != std::string::npos) {
            emit(TokenType::Float, text, makeFloatLiteral(text, tokenLine, tokenColumn), tokenLine, tokenColumn);
        } else {
            emit(TokenType::Integer, text, makeIntegerLiteral(text, tokenLine, tokenColumn), tokenLine, tokenColumn);
        }
    }

    void scanString() {
        std::size_t tokenLine = line_;
        std::size_t tokenColumn = column_;
        std::size_t start = pos_;
        char quote = advance();
        bool isTriple = false;

        if (peek() == quote && peek(1) == quote) {
            isTriple = true;
            advance();
            advance();
        }

        std::string value;

        while (true) {
            char ch = peek();
            if (ch == '\0') {
                throw LexerError("Unterminated string literal", tokenLine, tokenColumn);
            }
            if (!isTriple && ch == '\n') {
                throw LexerError("Unterminated string literal", tokenLine, tokenColumn);
            }
            if (isTriple && ch == quote && peek(1) == quote && peek(2) == quote) {
                advance();
                advance();
                advance();
                break;
            }
            if (!isTriple && ch == quote) {
                advance();
                break;
            }
            if (ch == '\\') {
                advance();
                char esc = peek();
                if (esc == '\0') {
                    throw LexerError("Unterminated string literal", tokenLine, tokenColumn);
                }
                char decoded = decodeEscape(advance());
                value.push_back(decoded);
                continue;
            }
            value.push_back(advance());
        }

        std::string lexeme = source_.substr(start, pos_ - start);
        emit(TokenType::String, lexeme, makeStringLiteral(value), tokenLine, tokenColumn);
    }

    bool scanOperatorOrPunctuation() {
        std::size_t tokenLine = line_;
        std::size_t tokenColumn = column_;

        for (std::string_view op : kOperators) {
            if (match(op)) {
                emit(TokenType::Operator, std::string(op), TokenLiteral{}, tokenLine, tokenColumn);
                return true;
            }
        }

        char ch = peek();
        if (kPunctuation.find(ch) != kPunctuation.end()) {
            advance();
            if (ch == '(' || ch == '[' || ch == '{') {
                ++openBrackets_;
            } else if ((ch == ')' || ch == ']' || ch == '}') && openBrackets_ > 0) {
                --openBrackets_;
            }
            emitSimple(TokenType::Punctuation, ch, tokenLine, tokenColumn);
            return true;
        }

        if (kSingleCharOperators.find(ch) != kSingleCharOperators.end()) {
            advance();
            emitSimple(TokenType::Operator, ch, tokenLine, tokenColumn);
            return true;
        }

        return false;
    }

    void finalize() {
        if (tokens_.empty() || tokens_.back().type != TokenType::Newline) {
            emit(TokenType::Newline, "\n", TokenLiteral{}, line_, column_);
        }
        while (indentStack_.size() > 1) {
            indentStack_.pop_back();
            emit(TokenType::Dedent, "", TokenLiteral{}, line_, column_);
        }
        emit(TokenType::EndOfFile, "", TokenLiteral{}, line_, column_);
    }

private:
    std::string source_;
    std::size_t pos_ = 0;
    std::size_t line_ = 1;
    std::size_t column_ = 1;
    std::vector<int> indentStack_{0};
    int openBrackets_ = 0;
    bool atLineStart_ = true;
    std::vector<Token> tokens_;
};

}  // namespace

LexerError::LexerError(std::string message, std::size_t line, std::size_t column)
    : std::runtime_error(message + " at line " + std::to_string(line) + ", column " + std::to_string(column)),
      line_(line),
      column_(column) {}

std::vector<Token> Lexer::tokenize(const std::string &source) const {
    LexerImpl impl(normalizeLineEndings(source));
    return impl.run();
}

}  // namespace pylite
