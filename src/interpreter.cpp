#include "pylite/interpreter.hpp"

#include <iostream>
#include <string>
#include <vector>

namespace pylite {

Interpreter::Interpreter() = default;

void Interpreter::runSource(const std::string &source) {
    auto tokens = lexer_.tokenize(source);
    auto astRepresentation = parser_.parse(tokens);
    execute(astRepresentation);
}

void Interpreter::runReplLine(const std::string &line) {
    auto tokens = lexer_.tokenize(line);
    auto astRepresentation = parser_.parse(tokens);
    execute(astRepresentation);
}

void Interpreter::execute(const std::string &astRepresentation) {
    std::cout << "[PyLite] Executing " << astRepresentation << std::endl;
}

}  // namespace pylite
