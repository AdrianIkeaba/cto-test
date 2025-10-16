#include "pylite/lexer.hpp"

#include <sstream>
#include <string>
#include <vector>

namespace pylite {

std::vector<std::string> Lexer::tokenize(const std::string &source) const {
    std::vector<std::string> tokens;
    std::istringstream stream(source);
    std::string token;

    while (stream >> token) {
        tokens.push_back(token);
    }

    return tokens;
}

}  // namespace pylite
