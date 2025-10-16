#pragma once

#include <string>
#include <vector>

#include "pylite/lexer.hpp"

namespace pylite {

class Parser {
public:
    [[nodiscard]] std::string parse(const std::vector<Token> &tokens) const;
};

}  // namespace pylite
