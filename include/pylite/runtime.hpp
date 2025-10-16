#pragma once

#include <cstdint>
#include <memory>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <variant>
#include <vector>

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

class Environment;

class FunctionValue {
public:
    using Ptr = std::shared_ptr<FunctionValue>;

    FunctionValue(std::string name,
                  std::vector<std::string> parameters,
                  ast::BlockStmt::Ptr body,
                  std::shared_ptr<Environment> closure,
                  ast::SourceLocation location);

    [[nodiscard]] const std::string &name() const noexcept { return name_; }
    [[nodiscard]] const std::vector<std::string> &parameters() const noexcept { return parameters_; }
    [[nodiscard]] const ast::BlockStmt::Ptr &body() const noexcept { return body_; }
    [[nodiscard]] const std::shared_ptr<Environment> &closure() const noexcept { return closure_; }
    [[nodiscard]] ast::SourceLocation location() const noexcept { return location_; }

private:
    std::string name_;
    std::vector<std::string> parameters_;
    ast::BlockStmt::Ptr body_;
    std::shared_ptr<Environment> closure_;
    ast::SourceLocation location_;
};

class Value {
public:
    using Variant =
        std::variant<std::monostate, bool, std::int64_t, double, std::string, FunctionValue::Ptr, FunctionPlaceholder,
                     ObjectPlaceholder>;

    Value();
    explicit Value(Variant value);

    static Value none();
    static Value boolean(bool value);
    static Value integer(std::int64_t value);
    static Value floating(double value);
    static Value string(std::string value);
    static Value function(FunctionPlaceholder placeholder);
    static Value function(FunctionValue::Ptr function);
    static Value object(ObjectPlaceholder placeholder);

    [[nodiscard]] const Variant &data() const noexcept { return value_; }
    [[nodiscard]] bool isNumeric() const noexcept;
    [[nodiscard]] bool isString() const noexcept;
    [[nodiscard]] bool isNone() const noexcept;
    [[nodiscard]] bool truthy() const;
    [[nodiscard]] bool isFunction() const noexcept;
    [[nodiscard]] std::string typeName() const;
    [[nodiscard]] std::string toRepr() const;

    [[nodiscard]] double asNumber(const ast::SourceLocation &location) const;
    [[nodiscard]] std::int64_t asInteger(const ast::SourceLocation &location) const;
    [[nodiscard]] FunctionValue::Ptr asFunction(const ast::SourceLocation &location) const;

    bool equals(const Value &other) const;

private:
    Variant value_;
};

class Environment : public std::enable_shared_from_this<Environment> {
public:
    using Ptr = std::shared_ptr<Environment>;

    explicit Environment(Ptr parent = nullptr);

    void define(std::string name, Value value);
    void assign(const std::string &name, const Value &value);
    [[nodiscard]] Value get(const std::string &name, const ast::SourceLocation &location) const;
    [[nodiscard]] bool containsLocal(const std::string &name) const noexcept;
    [[nodiscard]] const Ptr &parent() const noexcept { return parent_; }

private:
    std::unordered_map<std::string, Value> values_;
    Ptr parent_;
};

}  // namespace pylite
