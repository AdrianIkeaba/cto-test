cmake_minimum_required(VERSION 3.20)

project(PyLite VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)

FetchContent_Declare(
    Catch2
    GIT_REPOSITORY https://github.com/catchorg/Catch2.git
    GIT_TAG v3.5.2
)

FetchContent_MakeAvailable(Catch2)

list(APPEND CMAKE_MODULE_PATH ${Catch2_SOURCE_DIR}/extras)
include(Catch)

add_library(pylite_core
    src/lexer.cpp
    src/parser.cpp
    src/interpreter.cpp
)

target_include_directories(pylite_core
    PUBLIC
        ${PROJECT_SOURCE_DIR}/include
)

target_compile_features(pylite_core PUBLIC cxx_std_20)

add_executable(pylite src/main.cpp)

target_link_libraries(pylite
    PRIVATE
        pylite_core
)

include(CTest)
enable_testing()

add_executable(pylite_tests tests/test_smoke.cpp)

target_link_libraries(pylite_tests
    PRIVATE
        pylite_core
        Catch2::Catch2WithMain
)

catch_discover_tests(pylite_tests)
