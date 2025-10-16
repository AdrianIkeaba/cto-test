#include "pylite/runtime.hpp"

#include <cmath>
#include <sstream>
#include <utility>

namespace pylite {

RuntimeError::RuntimeError(std::string message, ast::SourceLocation location)
    : std::runtime_error(formatMessage(message, location)), location_(location) {}

std::string RuntimeError::formatMessage(const std::string &message, ast::SourceLocation location) {
    std::ostringstream oss;
    oss << "Runtime error";
    if (location.line != 0 || location.column != 0) {
        oss << " at line " << location.line << ", column " << location.column;
    }
    oss << ": " << message;
    return oss.str();
}

Value::Value() : value_(std::monostate{}) {}

Value::Value(Variant value) : value_(std::move(value)) {}

Value Value::none() { return Value(std::monostate{}); }

Value Value::boolean(bool value) { return Value(value); }

Value Value::integer(std::int64_t value) { return Value(value); }

Value Value::floating(double value) { return Value(value); }

Value Value::string(std::string value) { return Value(std::move(value)); }

Value Value::function(FunctionPlaceholder placeholder) { return Value(std::move(placeholder)); }

Value Value::object(ObjectPlaceholder placeholder) { return Value(std::move(placeholder)); }

bool Value::isNumeric() const noexcept {
    return std::holds_alternative<bool>(value_) || std::holds_alternative<std::int64_t>(value_) ||
           std::holds_alternative<double>(value_);
}

bool Value::isString() const noexcept { return std::holds_alternative<std::string>(value_); }

bool Value::isNone() const noexcept { return std::holds_alternative<std::monostate>(value_); }

bool Value::truthy() const {
    if (std::holds_alternative<std::monostate>(value_)) {
        return false;
    }
    if (const auto *boolValue = std::get_if<bool>(&value_)) {
        return *boolValue;
    }
    if (const auto *intValue = std::get_if<std::int64_t>(&value_)) {
        return *intValue != 0;
    }
    if (const auto *doubleValue = std::get_if<double>(&value_)) {
        return *doubleValue != 0.0;
    }
    if (const auto *stringValue = std::get_if<std::string>(&value_)) {
        return !stringValue->empty();
    }
    return true;
}

std::string Value::typeName() const {
    if (std::holds_alternative<std::monostate>(value_)) {
        return "None";
    }
    if (std::holds_alternative<bool>(value_)) {
        return "bool";
    }
    if (std::holds_alternative<std::int64_t>(value_)) {
        return "int";
    }
    if (std::holds_alternative<double>(value_)) {
        return "float";
    }
    if (std::holds_alternative<std::string>(value_)) {
        return "str";
    }
    if (std::holds_alternative<FunctionPlaceholder>(value_)) {
        return "function";
    }
    return "object";
}

std::string Value::toRepr() const {
    if (std::holds_alternative<std::monostate>(value_)) {
        return "None";
    }
    if (const auto *boolValue = std::get_if<bool>(&value_)) {
        return *boolValue ? "True" : "False";
    }
    if (const auto *intValue = std::get_if<std::int64_t>(&value_)) {
        return std::to_string(*intValue);
    }
    if (const auto *doubleValue = std::get_if<double>(&value_)) {
        std::ostringstream oss;
        oss << *doubleValue;
        return oss.str();
    }
    if (const auto *stringValue = std::get_if<std::string>(&value_)) {
        std::ostringstream oss;
        oss << '"' << *stringValue << '"';
        return oss.str();
    }
    if (const auto *functionValue = std::get_if<FunctionPlaceholder>(&value_)) {
        return "<function " + functionValue->name + ">";
    }
    const auto &objectValue = std::get<ObjectPlaceholder>(value_);
    return "<object " + objectValue.description + ">";
}

double Value::asNumber(const ast::SourceLocation &location) const {
    if (const auto *boolValue = std::get_if<bool>(&value_)) {
        return *boolValue ? 1.0 : 0.0;
    }
    if (const auto *intValue = std::get_if<std::int64_t>(&value_)) {
        return static_cast<double>(*intValue);
    }
    if (const auto *doubleValue = std::get_if<double>(&value_)) {
        return *doubleValue;
    }
    throw RuntimeError("Expected a numeric value, got '" + typeName() + "'", location);
}

std::int64_t Value::asInteger(const ast::SourceLocation &location) const {
    if (const auto *boolValue = std::get_if<bool>(&value_)) {
        return *boolValue ? 1 : 0;
    }
    if (const auto *intValue = std::get_if<std::int64_t>(&value_)) {
        return *intValue;
    }
    if (const auto *doubleValue = std::get_if<double>(&value_)) {
        return static_cast<std::int64_t>(*doubleValue);
    }
    throw RuntimeError("Expected an integer value, got '" + typeName() + "'", location);
}

bool Value::equals(const Value &other) const {
    if (isNumeric() && other.isNumeric()) {
        return asNumber(ast::SourceLocation{}) == other.asNumber(ast::SourceLocation{});
    }
    if (std::holds_alternative<std::string>(value_) && std::holds_alternative<std::string>(other.value_)) {
        return std::get<std::string>(value_) == std::get<std::string>(other.value_);
    }
    if (std::holds_alternative<std::monostate>(value_) && std::holds_alternative<std::monostate>(other.value_)) {
        return true;
    }
    if (std::holds_alternative<FunctionPlaceholder>(value_) &&
        std::holds_alternative<FunctionPlaceholder>(other.value_)) {
        return std::get<FunctionPlaceholder>(value_).name == std::get<FunctionPlaceholder>(other.value_).name;
    }
    if (std::holds_alternative<ObjectPlaceholder>(value_) &&
        std::holds_alternative<ObjectPlaceholder>(other.value_)) {
        return std::get<ObjectPlaceholder>(value_).description ==
               std::get<ObjectPlaceholder>(other.value_).description;
    }
    return false;
}

Environment::Environment(Environment *parent) : parent_(parent) {}

void Environment::define(std::string name, Value value) {
    values_.insert_or_assign(std::move(name), std::move(value));
}

void Environment::assign(const std::string &name, const Value &value) {
    auto it = values_.find(name);
    if (it != values_.end()) {
        it->second = value;
        return;
    }
    if (parent_ != nullptr) {
        parent_->assign(name, value);
        return;
    }
    values_.insert_or_assign(name, value);
}

Value Environment::get(const std::string &name, const ast::SourceLocation &location) const {
    auto it = values_.find(name);
    if (it != values_.end()) {
        return it->second;
    }
    if (parent_ != nullptr) {
        return parent_->get(name, location);
    }
    throw RuntimeError("Undefined variable '" + name + "'", location);
}

bool Environment::containsLocal(const std::string &name) const noexcept {
    return values_.find(name) != values_.end();
}

}  // namespace pylite
