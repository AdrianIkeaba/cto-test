#pragma once

#include <cstddef>
#include <stdexcept>
#include <vector>

#include "pylite/ast.hpp"
#include "pylite/lexer.hpp"

namespace pylite {

class ParserError : public std::runtime_error {
public:
    ParserError(std::string message, std::size_t line, std::size_t column);

    [[nodiscard]] std::size_t line() const noexcept { return line_; }
    [[nodiscard]] std::size_t column() const noexcept { return column_; }

private:
    std::size_t line_;
    std::size_t column_;
};

class Parser {
public:
    [[nodiscard]] ast::BlockStmt::Ptr parse(const std::vector<Token> &tokens) const;
};

}  // namespace pylite
