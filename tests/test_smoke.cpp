#include <catch2/catch_test_macros.hpp>

#include "pylite/lexer.hpp"
#include "pylite/parser.hpp"
#include "pylite/interpreter.hpp"

TEST_CASE("Lexer tokenizes whitespace separated input") {
    pylite::Lexer lexer;
    auto tokens = lexer.tokenize("print 42");

    REQUIRE(tokens.size() == 2);
    CHECK(tokens[0] == "print");
    CHECK(tokens[1] == "42");
}

TEST_CASE("Parser returns placeholder AST description") {
    pylite::Parser parser;
    auto ast = parser.parse({"token1", "token2"});

    REQUIRE(ast == "AST(tokens=2)");
}

TEST_CASE("Interpreter runs source without throwing") {
    pylite::Interpreter interpreter;

    REQUIRE_NOTHROW(interpreter.runSource("print 1"));
}
