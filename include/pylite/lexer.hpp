#pragma once

#include <string>
#include <vector>

namespace pylite {

class Lexer {
public:
    [[nodiscard]] std::vector<std::string> tokenize(const std::string &source) const;
};

}  // namespace pylite
