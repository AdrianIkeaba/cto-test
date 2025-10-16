#include <catch2/catch_test_macros.hpp>

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <memory>
#include <string>
#include <utility>
#include <variant>
#include <vector>

#include "pylite/ast.hpp"
#include "pylite/interpreter.hpp"
#include "pylite/lexer.hpp"
#include "pylite/parser.hpp"

namespace {

std::vector<std::pair<pylite::TokenType, std::string>> summary(const std::vector<pylite::Token> &tokens) {
    std::vector<std::pair<pylite::TokenType, std::string>> result;
    result.reserve(tokens.size());
    for (const auto &token : tokens) {
        result.emplace_back(token.type, token.lexeme);
    }
    return result;
}

}  // namespace

TEST_CASE("Lexer tokenizes Python-like blocks with indentation") {
    const std::string source =
        "if x:\n"
        "    return y\n"
        "else:\n"
        "    pass\n";

    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    std::vector<std::pair<pylite::TokenType, std::string>> expected = {
        {pylite::TokenType::Keyword, "if"},
        {pylite::TokenType::Identifier, "x"},
        {pylite::TokenType::Punctuation, ":"},
        {pylite::TokenType::Newline, "\n"},
        {pylite::TokenType::Indent, ""},
        {pylite::TokenType::Keyword, "return"},
        {pylite::TokenType::Identifier, "y"},
        {pylite::TokenType::Newline, "\n"},
        {pylite::TokenType::Dedent, ""},
        {pylite::TokenType::Keyword, "else"},
        {pylite::TokenType::Punctuation, ":"},
        {pylite::TokenType::Newline, "\n"},
        {pylite::TokenType::Indent, ""},
        {pylite::TokenType::Keyword, "pass"},
        {pylite::TokenType::Newline, "\n"},
        {pylite::TokenType::Dedent, ""},
        {pylite::TokenType::EndOfFile, ""},
    };

    REQUIRE(summary(tokens) == expected);
}

TEST_CASE("Lexer parses numeric literals") {
    const std::string source =
        "a = 123\n"
        "b = 3.14\n"
        "c = .5\n"
        "d = 1e-3\n";

    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    std::vector<std::int64_t> ints;
    std::vector<double> floats;

    for (const auto &token : tokens) {
        if (token.type == pylite::TokenType::Integer) {
            ints.push_back(std::get<std::int64_t>(token.literal));
        }
        if (token.type == pylite::TokenType::Float) {
            floats.push_back(std::get<double>(token.literal));
        }
    }

    REQUIRE(std::find(ints.begin(), ints.end(), 123) != ints.end());
    REQUIRE(std::any_of(floats.begin(), floats.end(), [](double value) { return std::abs(value - 3.14) < 1e-9; }));
    REQUIRE(std::any_of(floats.begin(), floats.end(), [](double value) { return std::abs(value - 0.5) < 1e-9; }));
    REQUIRE(std::any_of(floats.begin(), floats.end(), [](double value) { return std::abs(value - 1e-3) < 1e-12; }));
}

TEST_CASE("Lexer parses string literals") {
    const std::string source =
        "s = \"hello\"\n"
        "t = 'world'\n"
        "u = \"\"\"multi\nline\"\"\"\n";

    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    std::vector<std::string> strings;
    for (const auto &token : tokens) {
        if (token.type == pylite::TokenType::String) {
            strings.push_back(std::get<std::string>(token.literal));
        }
    }

    REQUIRE(std::find(strings.begin(), strings.end(), "hello") != strings.end());
    REQUIRE(std::find(strings.begin(), strings.end(), "world") != strings.end());
    REQUIRE(std::find(strings.begin(), strings.end(), std::string{"multi\nline"}) != strings.end());
}

TEST_CASE("Lexer recognizes operators") {
    const std::string source =
        "a+=1\n"
        "b==2\n"
        "c!=3\n"
        "d<=4\n"
        "e>=5\n"
        "f//=2\n"
        "g**=2\n"
        "h**2\n"
        "i//2\n"
        "j->k\n"
        "k:=1\n"
        "l<<=2\n"
        "m>>=3\n"
        "n&=1\n"
        "o|=1\n"
        "p^=1\n";

    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    std::vector<std::string> operators;
    for (const auto &token : tokens) {
        if (token.type == pylite::TokenType::Operator) {
            operators.push_back(token.lexeme);
        }
    }

    std::vector<std::string> expected = {
        "+=", "==", "!=", "<=", ">=", "//=", "**=", "**", "//", "->", ":=", "<<=", ">>=", "&=", "|=", "^="};

    for (const auto &op : expected) {
        INFO("Missing operator: " << op);
        REQUIRE(std::find(operators.begin(), operators.end(), op) != operators.end());
    }
}

TEST_CASE("Parentheses suppress indentation handling") {
    const std::string source =
        "func(\n"
        "    x,\n"
        "    y\n"
        ")\n";

    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    REQUIRE(std::none_of(tokens.begin(), tokens.end(), [](const pylite::Token &token) {
        return token.type == pylite::TokenType::Indent || token.type == pylite::TokenType::Dedent;
    }));
}

TEST_CASE("Invalid character raises an error") {
    const std::string source = "a = `bad`\n";
    pylite::Lexer lexer;

    REQUIRE_THROWS_AS(lexer.tokenize(source), pylite::LexerError);
}

TEST_CASE("Unterminated string raises an error") {
    const std::string source = "\"unterminated";
    pylite::Lexer lexer;

    REQUIRE_THROWS_AS(lexer.tokenize(source), pylite::LexerError);
}

TEST_CASE("Parser and interpreter integrate with lexer tokens") {
    const std::string source = "print(42)\n";
    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    pylite::Parser parser;
    auto program = parser.parse(tokens);

    REQUIRE(program);
    REQUIRE(program->statements().size() == 1);
    REQUIRE(program->statements()[0]->kind() == pylite::ast::StatementKind::Expression);

    auto exprStmt = std::dynamic_pointer_cast<pylite::ast::ExpressionStmt>(program->statements()[0]);
    REQUIRE(exprStmt);
    auto call = std::dynamic_pointer_cast<pylite::ast::CallExpr>(exprStmt->expression());
    REQUIRE(call);
    REQUIRE(call->arguments().size() == 1);

    pylite::Interpreter interpreter;
    REQUIRE_NOTHROW(interpreter.runSource(source));
}

TEST_CASE("Parser respects operator precedence when building expressions") {
    const std::string source = "1 + 2 * 3\n";
    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    pylite::Parser parser;
    auto program = parser.parse(tokens);

    REQUIRE(program);
    REQUIRE(program->statements().size() == 1);

    auto expressionStmt = std::dynamic_pointer_cast<pylite::ast::ExpressionStmt>(program->statements()[0]);
    REQUIRE(expressionStmt);

    auto sum = std::dynamic_pointer_cast<pylite::ast::BinaryExpr>(expressionStmt->expression());
    REQUIRE(sum);
    REQUIRE(sum->op() == "+");

    auto leftLiteral = std::dynamic_pointer_cast<pylite::ast::LiteralExpr>(sum->left());
    REQUIRE(leftLiteral);
    REQUIRE(std::get<std::int64_t>(leftLiteral->value()) == 1);

    auto product = std::dynamic_pointer_cast<pylite::ast::BinaryExpr>(sum->right());
    REQUIRE(product);
    REQUIRE(product->op() == "*");

    auto productLeft = std::dynamic_pointer_cast<pylite::ast::LiteralExpr>(product->left());
    REQUIRE(productLeft);
    REQUIRE(std::get<std::int64_t>(productLeft->value()) == 2);

    auto productRight = std::dynamic_pointer_cast<pylite::ast::LiteralExpr>(product->right());
    REQUIRE(productRight);
    REQUIRE(std::get<std::int64_t>(productRight->value()) == 3);
}

TEST_CASE("Parser creates assignment statements for simple bindings") {
    const std::string source = "answer = 42\n";
    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    pylite::Parser parser;
    auto program = parser.parse(tokens);

    REQUIRE(program);
    REQUIRE(program->statements().size() == 1);

    auto assignment = std::dynamic_pointer_cast<pylite::ast::AssignmentStmt>(program->statements()[0]);
    REQUIRE(assignment);
    REQUIRE(assignment->target() == "answer");

    auto value = std::dynamic_pointer_cast<pylite::ast::LiteralExpr>(assignment->value());
    REQUIRE(value);
    REQUIRE(std::get<std::int64_t>(value->value()) == 42);
}

TEST_CASE("Parser builds call expressions with positional arguments") {
    const std::string source = "print(1, x)\n";
    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    pylite::Parser parser;
    auto program = parser.parse(tokens);

    REQUIRE(program);
    REQUIRE(program->statements().size() == 1);

    auto expressionStmt = std::dynamic_pointer_cast<pylite::ast::ExpressionStmt>(program->statements()[0]);
    REQUIRE(expressionStmt);

    auto call = std::dynamic_pointer_cast<pylite::ast::CallExpr>(expressionStmt->expression());
    REQUIRE(call);

    auto callee = std::dynamic_pointer_cast<pylite::ast::VariableExpr>(call->callee());
    REQUIRE(callee);
    REQUIRE(callee->name() == "print");

    REQUIRE(call->arguments().size() == 2);

    auto firstArg = std::dynamic_pointer_cast<pylite::ast::LiteralExpr>(call->arguments()[0]);
    REQUIRE(firstArg);
    REQUIRE(std::get<std::int64_t>(firstArg->value()) == 1);

    auto secondArg = std::dynamic_pointer_cast<pylite::ast::VariableExpr>(call->arguments()[1]);
    REQUIRE(secondArg);
    REQUIRE(secondArg->name() == "x");
}

TEST_CASE("Parser groups indented statements into block nodes") {
    const std::string source =
        "x = 1\n"
        "    y = x\n";
    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    pylite::Parser parser;
    auto program = parser.parse(tokens);

    REQUIRE(program);
    REQUIRE(program->statements().size() == 2);

    auto rootAssignment = std::dynamic_pointer_cast<pylite::ast::AssignmentStmt>(program->statements()[0]);
    REQUIRE(rootAssignment);
    REQUIRE(rootAssignment->target() == "x");

    auto block = std::dynamic_pointer_cast<pylite::ast::BlockStmt>(program->statements()[1]);
    REQUIRE(block);
    REQUIRE(block->statements().size() == 1);

    auto nestedAssignment = std::dynamic_pointer_cast<pylite::ast::AssignmentStmt>(block->statements()[0]);
    REQUIRE(nestedAssignment);
    REQUIRE(nestedAssignment->target() == "y");

    auto nestedValue = std::dynamic_pointer_cast<pylite::ast::VariableExpr>(nestedAssignment->value());
    REQUIRE(nestedValue);
    REQUIRE(nestedValue->name() == "x");
}

TEST_CASE("Interpreter evaluates arithmetic expressions") {
    pylite::Interpreter interpreter;
    interpreter.runSource("1 + 2 * 3\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 1);
    REQUIRE(std::holds_alternative<std::int64_t>(results[0].data()));
    REQUIRE(std::get<std::int64_t>(results[0].data()) == 7);
}

TEST_CASE("Interpreter updates variables across statements") {
    pylite::Interpreter interpreter;
    interpreter.runSource("a = 10\n"
                          "b = a + 5\n"
                          "a\n"
                          "b\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 2);
    REQUIRE(std::holds_alternative<std::int64_t>(results[0].data()));
    REQUIRE(std::get<std::int64_t>(results[0].data()) == 10);
    REQUIRE(std::holds_alternative<std::int64_t>(results[1].data()));
    REQUIRE(std::get<std::int64_t>(results[1].data()) == 15);
}

TEST_CASE("Interpreter evaluates boolean logic and comparisons") {
    pylite::Interpreter interpreter;
    interpreter.runSource("True and False\n"
                          "True or False\n"
                          "not False\n"
                          "1 < 2\n"
                          "\"a\" < \"b\"\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 5);

    REQUIRE(std::holds_alternative<bool>(results[0].data()));
    REQUIRE_FALSE(std::get<bool>(results[0].data()));

    REQUIRE(std::holds_alternative<bool>(results[1].data()));
    REQUIRE(std::get<bool>(results[1].data()));

    REQUIRE(std::holds_alternative<bool>(results[2].data()));
    REQUIRE(std::get<bool>(results[2].data()));

    REQUIRE(std::holds_alternative<bool>(results[3].data()));
    REQUIRE(std::get<bool>(results[3].data()));

    REQUIRE(std::holds_alternative<bool>(results[4].data()));
    REQUIRE(std::get<bool>(results[4].data()));
}

TEST_CASE("Interpreter raises runtime error for undefined variables") {
    pylite::Interpreter interpreter;
    REQUIRE_THROWS_AS(interpreter.runSource("missing\n"), pylite::RuntimeError);
}

TEST_CASE("Interpreter raises runtime error on type mismatches") {
    pylite::Interpreter interpreter;
    REQUIRE_THROWS_AS(interpreter.runSource("1 + \"two\"\n"), pylite::RuntimeError);
}

TEST_CASE("Parser builds if/elif/else statements with nested bodies") {
    const std::string source =
        "if flag:\n"
        "    value = 1\n"
        "elif other:\n"
        "    value = 2\n"
        "else:\n"
        "    value = 3\n";

    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    pylite::Parser parser;
    auto program = parser.parse(tokens);

    REQUIRE(program);
    REQUIRE(program->statements().size() == 1);

    auto ifStmt = std::dynamic_pointer_cast<pylite::ast::IfStmt>(program->statements()[0]);
    REQUIRE(ifStmt);
    REQUIRE(ifStmt->thenBranch());
    REQUIRE(ifStmt->thenBranch()->statements().size() == 1);
    auto thenAssign = std::dynamic_pointer_cast<pylite::ast::AssignmentStmt>(ifStmt->thenBranch()->statements()[0]);
    REQUIRE(thenAssign);
    REQUIRE(thenAssign->target() == "value");

    auto elifStmt = std::dynamic_pointer_cast<pylite::ast::IfStmt>(ifStmt->elseBranch());
    REQUIRE(elifStmt);
    REQUIRE(elifStmt->thenBranch());
    REQUIRE(elifStmt->thenBranch()->statements().size() == 1);
    auto elifAssign = std::dynamic_pointer_cast<pylite::ast::AssignmentStmt>(elifStmt->thenBranch()->statements()[0]);
    REQUIRE(elifAssign);
    REQUIRE(elifAssign->target() == "value");

    auto elseNode = elifStmt->elseBranch();
    REQUIRE(elseNode);
    auto elseBlock = std::dynamic_pointer_cast<pylite::ast::BlockStmt>(elseNode);
    REQUIRE(elseBlock);
    REQUIRE(elseBlock->statements().size() == 1);
    auto elseAssign = std::dynamic_pointer_cast<pylite::ast::AssignmentStmt>(elseBlock->statements()[0]);
    REQUIRE(elseAssign);
    REQUIRE(elseAssign->target() == "value");
}

TEST_CASE("Interpreter executes nested control flow with elif and else branches") {
    pylite::Interpreter interpreter;
    interpreter.runSource("flag = 2\n"
                          "value = 0\n"
                          "if flag == 1:\n"
                          "    value = 100\n"
                          "elif flag == 2:\n"
                          "    value = value + 1\n"
                          "    if False:\n"
                          "        value = 999\n"
                          "    else:\n"
                          "        value = value + 9\n"
                          "else:\n"
                          "    value = -1\n"
                          "value\n"
                          "flag = 3\n"
                          "other = 0\n"
                          "if flag == 1:\n"
                          "    other = 1\n"
                          "elif flag == 2:\n"
                          "    other = 2\n"
                          "else:\n"
                          "    other = 3\n"
                          "other\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 2);
    REQUIRE(std::holds_alternative<std::int64_t>(results[0].data()));
    REQUIRE(std::get<std::int64_t>(results[0].data()) == 10);
    REQUIRE(std::holds_alternative<std::int64_t>(results[1].data()));
    REQUIRE(std::get<std::int64_t>(results[1].data()) == 3);
}

TEST_CASE("Interpreter executes while loops until condition is false") {
    pylite::Interpreter interpreter;
    interpreter.runSource("i = 0\n"
                          "accum = 0\n"
                          "while i < 4:\n"
                          "    accum = accum + i\n"
                          "    i = i + 1\n"
                          "accum\n"
                          "i\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 2);
    REQUIRE(std::holds_alternative<std::int64_t>(results[0].data()));
    REQUIRE(std::get<std::int64_t>(results[0].data()) == 6);
    REQUIRE(std::holds_alternative<std::int64_t>(results[1].data()));
    REQUIRE(std::get<std::int64_t>(results[1].data()) == 4);
}

TEST_CASE("Parser builds function definitions with parameters and return statements") {
    const std::string source =
        "def add(a, b):\n"
        "    return a + b\n";

    pylite::Lexer lexer;
    auto tokens = lexer.tokenize(source);

    pylite::Parser parser;
    auto program = parser.parse(tokens);

    REQUIRE(program);
    REQUIRE(program->statements().size() == 1);

    auto functionStmt = std::dynamic_pointer_cast<pylite::ast::FunctionStmt>(program->statements()[0]);
    REQUIRE(functionStmt);
    REQUIRE(functionStmt->name() == "add");
    REQUIRE(functionStmt->parameters().size() == 2);
    REQUIRE(functionStmt->parameters()[0]->name() == "a");
    REQUIRE(functionStmt->parameters()[1]->name() == "b");
    REQUIRE(functionStmt->body());
    REQUIRE(functionStmt->body()->statements().size() == 1);

    auto returnStmt = std::dynamic_pointer_cast<pylite::ast::ReturnStmt>(functionStmt->body()->statements()[0]);
    REQUIRE(returnStmt);
    REQUIRE(returnStmt->hasValue());
}

TEST_CASE("Interpreter supports functions with parameters and return values") {
    pylite::Interpreter interpreter;
    interpreter.runSource("def add(a, b):\n"
                          "    return a + b\n"
                          "add(2, 3)\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 1);
    REQUIRE(std::holds_alternative<std::int64_t>(results[0].data()));
    REQUIRE(std::get<std::int64_t>(results[0].data()) == 5);
}

TEST_CASE("Interpreter supports recursive functions") {
    pylite::Interpreter interpreter;
    interpreter.runSource("def fact(n):\n"
                          "    if n == 0:\n"
                          "        return 1\n"
                          "    return n * fact(n - 1)\n"
                          "fact(5)\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 1);
    REQUIRE(std::holds_alternative<std::int64_t>(results[0].data()));
    REQUIRE(std::get<std::int64_t>(results[0].data()) == 120);
}

TEST_CASE("Interpreter supports closures capturing outer variables") {
    pylite::Interpreter interpreter;
    interpreter.runSource("def make_adder(x):\n"
                          "    def inner(y):\n"
                          "        return x + y\n"
                          "    return inner\n"
                          "fn = make_adder(10)\n"
                          "fn(5)\n");

    const auto &results = interpreter.results();
    REQUIRE(results.size() == 1);
    REQUIRE(std::holds_alternative<std::int64_t>(results.back().data()));
    REQUIRE(std::get<std::int64_t>(results.back().data()) == 15);
}
