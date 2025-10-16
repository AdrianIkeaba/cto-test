#include "pylite/parser.hpp"

#include <sstream>
#include <string>
#include <vector>

namespace pylite {

std::string Parser::parse(const std::vector<std::string> &tokens) const {
    std::ostringstream oss;
    oss << "AST(tokens=" << tokens.size() << ")";
    return oss.str();
}

}  // namespace pylite
