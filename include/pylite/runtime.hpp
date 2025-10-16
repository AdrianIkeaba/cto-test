#pragma once

#include <cstdint>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <variant>

#include "pylite/ast.hpp"

namespace pylite {

struct FunctionPlaceholder {
    std::string name;
};

struct ObjectPlaceholder {
    std::string description;
};

class RuntimeError : public std::runtime_error {
public:
    RuntimeError(std::string message, ast::SourceLocation location);

    [[nodiscard]] ast::SourceLocation location() const noexcept { return location_; }

private:
    static std::string formatMessage(const std::string &message, ast::SourceLocation location);

    ast::SourceLocation location_;
};

class Value {
public:
    using Variant = std::variant<std::monostate, bool, std::int64_t, double, std::string, FunctionPlaceholder, ObjectPlaceholder>;

    Value();
    explicit Value(Variant value);

    static Value none();
    static Value boolean(bool value);
    static Value integer(std::int64_t value);
    static Value floating(double value);
    static Value string(std::string value);
    static Value function(FunctionPlaceholder placeholder);
    static Value object(ObjectPlaceholder placeholder);

    [[nodiscard]] const Variant &data() const noexcept { return value_; }
    [[nodiscard]] bool isNumeric() const noexcept;
    [[nodiscard]] bool isString() const noexcept;
    [[nodiscard]] bool isNone() const noexcept;
    [[nodiscard]] bool truthy() const;
    [[nodiscard]] std::string typeName() const;
    [[nodiscard]] std::string toRepr() const;

    [[nodiscard]] double asNumber(const ast::SourceLocation &location) const;
    [[nodiscard]] std::int64_t asInteger(const ast::SourceLocation &location) const;

    bool equals(const Value &other) const;

private:
    Variant value_;
};

class Environment {
public:
    explicit Environment(Environment *parent = nullptr);

    void define(std::string name, Value value);
    void assign(const std::string &name, const Value &value);
    [[nodiscard]] Value get(const std::string &name, const ast::SourceLocation &location) const;
    [[nodiscard]] bool containsLocal(const std::string &name) const noexcept;
    [[nodiscard]] Environment *parent() const noexcept { return parent_; }

private:
    std::unordered_map<std::string, Value> values_;
    Environment *parent_;
};

}  // namespace pylite
