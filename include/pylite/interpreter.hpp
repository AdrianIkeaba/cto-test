#pragma once

#include <string>

#include "pylite/lexer.hpp"
#include "pylite/parser.hpp"

namespace pylite {

class Interpreter {
public:
    Interpreter();

    void runSource(const std::string &source);
    void runReplLine(const std::string &line);

private:
    void execute(const std::string &astRepresentation);

    Lexer lexer_;
    Parser parser_;
};

}  // namespace pylite
