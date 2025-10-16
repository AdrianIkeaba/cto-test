#pragma once

#include <string>
#include <vector>

namespace pylite {

class Parser {
public:
    [[nodiscard]] std::string parse(const std::vector<std::string> &tokens) const;
};

}  // namespace pylite
