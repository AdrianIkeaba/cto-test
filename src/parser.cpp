#include "pylite/parser.hpp"

#include <sstream>
#include <string>
#include <vector>

#include "pylite/lexer.hpp"

namespace pylite {

std::string Parser::parse(const std::vector<Token> &tokens) const {
    std::ostringstream oss;
    oss << "AST(tokens=" << tokens.size() << ")";
    return oss.str();
}

}  // namespace pylite
