# PyLite - Python-like Interpreter (Scaffolding)

PyLite is a pedagogical, Python-inspired interpreter implemented in modern C++. This repository currently contains the initial project scaffolding, including build tooling, placeholder components, and a smoke test to validate the environment.

## Project Structure

```
.
├── CMakeLists.txt
├── include/
│   └── pylite/
│       ├── interpreter.hpp
│       ├── lexer.hpp
│       └── parser.hpp
├── src/
│   ├── interpreter.cpp
│   ├── lexer.cpp
│   ├── main.cpp
│   └── parser.cpp
└── tests/
    └── test_smoke.cpp
```

- **src/** — Implementation files for the interpreter entry point and placeholder components.
- **include/** — Public headers that define the lexer, parser, and interpreter interfaces.
- **tests/** — Unit tests powered by [Catch2](https://github.com/catchorg/Catch2).

## Build Instructions

The project uses CMake and requires a C++20 compliant compiler (e.g., GCC 11+, Clang 13+, MSVC 2019+).

```bash
# Configure the project
cmake -S . -B build

# Build the main executable and tests
cmake --build build

# Run the interpreter (REPL mode)
./build/pylite

# Run the interpreter with a source file
./build/pylite path/to/program.pyl

# Execute the unit test suite
ctest --test-dir build
```

The first configure step will automatically download Catch2 using CMake's `FetchContent` mechanism.

## High-Level Architecture Plan

The interpreter will evolve through the following layered components:

1. **Lexer** — Converts raw source text into a token stream. Currently implemented as a whitespace-based splitter for scaffolding purposes.
2. **Parser** — Transforms tokens into an abstract syntax tree (AST). Today it returns a placeholder representation to demonstrate the pipeline.
3. **Interpreter** — Evaluates the AST and manages runtime state. The stub implementation prints the AST description to standard output.
4. **Front-end Interfaces** — Command-line entry point that supports REPL interaction and executing `.pyl` files. This is wired up via `src/main.cpp`.

Future work will flesh out each stage, introduce concrete AST nodes, runtime environments, and error handling.

## Testing Strategy

The repository is configured with Catch2 and currently includes a simple smoke test that exercises the lexer, parser, and interpreter stubs. Additional unit tests and integration tests should be added alongside new features to maintain correctness.
