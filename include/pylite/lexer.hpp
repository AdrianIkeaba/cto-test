#pragma once

#include <cstddef>
#include <cstdint>
#include <stdexcept>
#include <string>
#include <variant>
#include <vector>

namespace pylite {

enum class TokenType {
    Identifier,
    Keyword,
    Integer,
    Float,
    String,
    Operator,
    Punctuation,
    Newline,
    Indent,
    Dedent,
    EndOfFile,
};

using TokenLiteral = std::variant<std::monostate, std::string, std::int64_t, double>;

struct Token {
    TokenType type;
    std::string lexeme;
    TokenLiteral literal;
    std::size_t line;
    std::size_t column;
};

class LexerError : public std::runtime_error {
public:
    LexerError(std::string message, std::size_t line, std::size_t column);

    [[nodiscard]] std::size_t line() const noexcept { return line_; }
    [[nodiscard]] std::size_t column() const noexcept { return column_; }

private:
    std::size_t line_;
    std::size_t column_;
};

class Lexer {
public:
    [[nodiscard]] std::vector<Token> tokenize(const std::string &source) const;
};

}  // namespace pylite
