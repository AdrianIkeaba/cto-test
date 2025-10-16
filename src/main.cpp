#include <filesystem>
#include <fstream>
#include <iostream>
#include <iterator>
#include <stdexcept>
#include <string>

#include "pylite/interpreter.hpp"

namespace {

std::string readFile(const std::filesystem::path &path) {
    std::ifstream file(path, std::ios::in | std::ios::binary);
    if (!file.is_open()) {
        throw std::runtime_error("Unable to open source file: " + path.string());
    }

    return std::string(std::istreambuf_iterator<char>(file), std::istreambuf_iterator<char>());
}

}  // namespace

int main(int argc, char *argv[]) {
    pylite::Interpreter interpreter;

    try {
        if (argc > 1) {
            std::filesystem::path sourcePath = argv[1];
            auto source = readFile(sourcePath);
            interpreter.runSource(source);
        } else {
            std::cout << "PyLite REPL (stub) - type 'exit' to quit" << std::endl;
            std::string line;
            while (true) {
                std::cout << "> " << std::flush;
                if (!std::getline(std::cin, line)) {
                    break;
                }

                if (line == "exit") {
                    break;
                }

                interpreter.runReplLine(line);
            }
        }
    } catch (const std::exception &ex) {
        std::cerr << "Error: " << ex.what() << std::endl;
        return 1;
    }

    return 0;
}
