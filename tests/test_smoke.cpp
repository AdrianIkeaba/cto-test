#include <catch2/catch_test_macros.hpp>

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <string>
#include <utility>
#include <vector>

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
    auto ast = parser.parse(tokens);

    REQUIRE(ast == "AST(tokens=" + std::to_string(tokens.size()) + ")");

    pylite::Interpreter interpreter;
    REQUIRE_NOTHROW(interpreter.runSource(source));
}
