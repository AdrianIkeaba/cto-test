#include "pylite/interpreter.hpp"

#include <cmath>
#include <iostream>
#include <memory>
#include <sstream>
#include <string>
#include <utility>
#include <vector>

namespace pylite {
namespace {

bool useFloatResult(const Value &lhs, const Value &rhs) {
    return std::holds_alternative<double>(lhs.data()) || std::holds_alternative<double>(rhs.data());
}

double ensureNonZero(double value, const std::string &operation, const ast::SourceLocation &location) {
    if (value == 0.0) {
        throw RuntimeError("Division by zero in '" + operation + "'", location);
    }
    return value;
}


bool isEffectivelyInteger(double value) {
    return std::floor(value) == value;
}

std::string formatForPrint(const Value &value) {
    if (value.isNone()) {
        return "None";
    }

    const auto &data = value.data();

    if (const auto *boolValue = std::get_if<bool>(&data)) {
        return *boolValue ? "True" : "False";
    }
    if (const auto *intValue = std::get_if<std::int64_t>(&data)) {
        return std::to_string(*intValue);
    }
    if (const auto *doubleValue = std::get_if<double>(&data)) {
        std::ostringstream oss;
        oss << *doubleValue;
        return oss.str();
    }
    if (const auto *stringValue = std::get_if<std::string>(&data)) {
        return *stringValue;
    }
    if (const auto *functionValue = std::get_if<FunctionPlaceholder>(&data)) {
        return "<function " + functionValue->name + ">";
    }
    const auto &objectValue = std::get<ObjectPlaceholder>(data);
    return "<object " + objectValue.description + ">";
}

}  // namespace

Interpreter::Interpreter() { reset(); }

void Interpreter::reset() {
    globals_ = Environment{};
    results_.clear();
    globals_.define("print", Value::function(FunctionPlaceholder{"print"}));
}

void Interpreter::runSource(const std::string &source) {
    reset();
    auto tokens = lexer_.tokenize(source);
    auto program = parser_.parse(tokens);
    execute(program);
}

void Interpreter::runReplLine(const std::string &line) {
    auto tokens = lexer_.tokenize(line);
    auto program = parser_.parse(tokens);
    results_.clear();
    execute(program);
    if (!results_.empty()) {
        const Value &value = results_.back();
        if (!value.isNone()) {
            std::cout << value.toRepr() << std::endl;
        }
    }
}

void Interpreter::execute(const ast::BlockStmt::Ptr &program) {
    if (!program) {
        return;
    }
    executeBlock(*program, globals_);
}

void Interpreter::executeBlock(const ast::BlockStmt &block, Environment &environment) {
    for (const auto &statement : block.statements()) {
        executeStatement(statement, environment);
    }
}

void Interpreter::executeStatement(const ast::Statement::Ptr &statement, Environment &environment) {
    switch (statement->kind()) {
        case ast::StatementKind::Expression: {
            auto exprStmt = std::dynamic_pointer_cast<ast::ExpressionStmt>(statement);
            if (!exprStmt) {
                throw RuntimeError("Invalid expression statement", statement->location());
            }
            Value result = evaluateExpression(exprStmt->expression(), environment);
            results_.push_back(result);
            break;
        }
        case ast::StatementKind::Assignment: {
            auto assign = std::dynamic_pointer_cast<ast::AssignmentStmt>(statement);
            if (!assign) {
                throw RuntimeError("Invalid assignment statement", statement->location());
            }
            Value value = evaluateExpression(assign->value(), environment);
            environment.assign(assign->target(), value);
            break;
        }
        case ast::StatementKind::Block: {
            auto block = std::dynamic_pointer_cast<ast::BlockStmt>(statement);
            if (!block) {
                throw RuntimeError("Invalid block statement", statement->location());
            }
            Environment child(&environment);
            executeBlock(*block, child);
            break;
        }
    }
}

Value Interpreter::evaluateExpression(const ast::Expression::Ptr &expression, Environment &environment) {
    if (!expression) {
        return Value::none();
    }

    switch (expression->kind()) {
        case ast::ExpressionKind::Literal: {
            auto literal = std::dynamic_pointer_cast<ast::LiteralExpr>(expression);
            if (!literal) {
                throw RuntimeError("Malformed literal expression", expression->location());
            }
            return evaluateLiteral(*literal);
        }
        case ast::ExpressionKind::Variable: {
            auto variable = std::dynamic_pointer_cast<ast::VariableExpr>(expression);
            if (!variable) {
                throw RuntimeError("Malformed variable expression", expression->location());
            }
            return evaluateVariable(*variable, environment);
        }
        case ast::ExpressionKind::Unary: {
            auto unary = std::dynamic_pointer_cast<ast::UnaryExpr>(expression);
            if (!unary) {
                throw RuntimeError("Malformed unary expression", expression->location());
            }
            return evaluateUnary(*unary, environment);
        }
        case ast::ExpressionKind::Binary: {
            auto binary = std::dynamic_pointer_cast<ast::BinaryExpr>(expression);
            if (!binary) {
                throw RuntimeError("Malformed binary expression", expression->location());
            }
            return evaluateBinary(*binary, environment);
        }
        case ast::ExpressionKind::Call: {
            auto call = std::dynamic_pointer_cast<ast::CallExpr>(expression);
            if (!call) {
                throw RuntimeError("Malformed call expression", expression->location());
            }
            return evaluateCall(*call, environment);
        }
    }

    throw RuntimeError("Unsupported expression", expression->location());
}

Value Interpreter::evaluateLiteral(const ast::LiteralExpr &literal) const {
    const auto &value = literal.value();
    switch (literal.tokenType()) {
        case TokenType::Integer:
            if (!std::holds_alternative<std::int64_t>(value)) {
                throw RuntimeError("Invalid integer literal", literal.location());
            }
            return Value::integer(std::get<std::int64_t>(value));
        case TokenType::Float:
            if (!std::holds_alternative<double>(value)) {
                throw RuntimeError("Invalid float literal", literal.location());
            }
            return Value::floating(std::get<double>(value));
        case TokenType::String:
            if (!std::holds_alternative<std::string>(value)) {
                throw RuntimeError("Invalid string literal", literal.location());
            }
            return Value::string(std::get<std::string>(value));
        case TokenType::Keyword: {
            if (!std::holds_alternative<std::string>(value)) {
                throw RuntimeError("Invalid keyword literal", literal.location());
            }
            const std::string &lexeme = std::get<std::string>(value);
            if (lexeme == "True") {
                return Value::boolean(true);
            }
            if (lexeme == "False") {
                return Value::boolean(false);
            }
            if (lexeme == "None") {
                return Value::none();
            }
            throw RuntimeError("Unsupported literal keyword '" + lexeme + "'", literal.location());
        }
        default:
            break;
    }

    throw RuntimeError("Unsupported literal", literal.location());
}

Value Interpreter::evaluateUnary(const ast::UnaryExpr &expr, Environment &environment) {
    Value operand = evaluateExpression(expr.operand(), environment);
    const std::string &op = expr.op();

    if (op == "+") {
        if (!operand.isNumeric()) {
            throw RuntimeError("Unary '+' requires a numeric operand, got '" + operand.typeName() + "'",
                               expr.location());
        }
        if (std::holds_alternative<double>(operand.data())) {
            return Value::floating(operand.asNumber(expr.location()));
        }
        return Value::integer(operand.asInteger(expr.location()));
    }

    if (op == "-") {
        if (!operand.isNumeric()) {
            throw RuntimeError("Unary '-' requires a numeric operand, got '" + operand.typeName() + "'",
                               expr.location());
        }
        if (std::holds_alternative<double>(operand.data())) {
            return Value::floating(-operand.asNumber(expr.location()));
        }
        return Value::integer(-operand.asInteger(expr.location()));
    }

    if (op == "not") {
        return Value::boolean(!operand.truthy());
    }

    throw RuntimeError("Unsupported unary operator '" + op + "'", expr.location());
}

Value Interpreter::evaluateBinary(const ast::BinaryExpr &expr, Environment &environment) {
    const std::string &op = expr.op();

    if (op == "and") {
        Value left = evaluateExpression(expr.left(), environment);
        if (!left.truthy()) {
            return left;
        }
        return evaluateExpression(expr.right(), environment);
    }

    if (op == "or") {
        Value left = evaluateExpression(expr.left(), environment);
        if (left.truthy()) {
            return left;
        }
        return evaluateExpression(expr.right(), environment);
    }

    Value left = evaluateExpression(expr.left(), environment);
    Value right = evaluateExpression(expr.right(), environment);

    if (op == "+") {
        if (left.isNumeric() && right.isNumeric()) {
            if (useFloatResult(left, right)) {
                return Value::floating(left.asNumber(expr.location()) + right.asNumber(expr.location()));
            }
            return Value::integer(left.asInteger(expr.location()) + right.asInteger(expr.location()));
        }
        if (left.isString() && right.isString()) {
            return Value::string(std::get<std::string>(left.data()) + std::get<std::string>(right.data()));
        }
        throw RuntimeError("Unsupported operand types for '+': '" + left.typeName() + "' and '" + right.typeName() + "'",
                           expr.location());
    }

    if (op == "-") {
        if (!left.isNumeric() || !right.isNumeric()) {
            throw RuntimeError("Unsupported operand types for '-': '" + left.typeName() + "' and '" + right.typeName() + "'",
                               expr.location());
        }
        if (useFloatResult(left, right)) {
            return Value::floating(left.asNumber(expr.location()) - right.asNumber(expr.location()));
        }
        return Value::integer(left.asInteger(expr.location()) - right.asInteger(expr.location()));
    }

    if (op == "*") {
        if (!left.isNumeric() || !right.isNumeric()) {
            throw RuntimeError("Unsupported operand types for '*': '" + left.typeName() + "' and '" + right.typeName() + "'",
                               expr.location());
        }
        if (useFloatResult(left, right)) {
            return Value::floating(left.asNumber(expr.location()) * right.asNumber(expr.location()));
        }
        return Value::integer(left.asInteger(expr.location()) * right.asInteger(expr.location()));
    }

    if (op == "/") {
        if (!left.isNumeric() || !right.isNumeric()) {
            throw RuntimeError("Unsupported operand types for '/': '" + left.typeName() + "' and '" + right.typeName() + "'",
                               expr.location());
        }
        double divisor = ensureNonZero(right.asNumber(expr.location()), "/", expr.location());
        return Value::floating(left.asNumber(expr.location()) / divisor);
    }

    if (op == "//") {
        if (!left.isNumeric() || !right.isNumeric()) {
            throw RuntimeError(
                "Unsupported operand types for '//': '" + left.typeName() + "' and '" + right.typeName() + "'",
                expr.location());
        }
        double divisor = ensureNonZero(right.asNumber(expr.location()), "//", expr.location());
        double dividend = left.asNumber(expr.location());
        double quotient = std::floor(dividend / divisor);
        if (useFloatResult(left, right)) {
            return Value::floating(quotient);
        }
        return Value::integer(static_cast<std::int64_t>(quotient));
    }

    if (op == "%") {
        if (!left.isNumeric() || !right.isNumeric()) {
            throw RuntimeError(
                "Unsupported operand types for '%': '" + left.typeName() + "' and '" + right.typeName() + "'",
                expr.location());
        }
        double divisor = ensureNonZero(right.asNumber(expr.location()), "%", expr.location());
        double dividend = left.asNumber(expr.location());
        double quotient = std::floor(dividend / divisor);
        double remainder = dividend - quotient * divisor;
        if (useFloatResult(left, right)) {
            return Value::floating(remainder);
        }
        return Value::integer(static_cast<std::int64_t>(remainder));
    }

    if (op == "**") {
        if (!left.isNumeric() || !right.isNumeric()) {
            throw RuntimeError(
                "Unsupported operand types for '**': '" + left.typeName() + "' and '" + right.typeName() + "'",
                expr.location());
        }
        double result = std::pow(left.asNumber(expr.location()), right.asNumber(expr.location()));
        if (!useFloatResult(left, right) && isEffectivelyInteger(result)) {
            return Value::integer(static_cast<std::int64_t>(result));
        }
        return Value::floating(result);
    }

    if (op == "==") {
        return Value::boolean(left.equals(right));
    }

    if (op == "!=") {
        return Value::boolean(!left.equals(right));
    }

    if (op == "<" || op == "<=" || op == ">" || op == ">=") {
        if (left.isNumeric() && right.isNumeric()) {
            double lhs = left.asNumber(expr.location());
            double rhs = right.asNumber(expr.location());
            if (op == "<") {
                return Value::boolean(lhs < rhs);
            }
            if (op == "<=") {
                return Value::boolean(lhs <= rhs);
            }
            if (op == ">") {
                return Value::boolean(lhs > rhs);
            }
            return Value::boolean(lhs >= rhs);
        }
        if (left.isString() && right.isString()) {
            const auto &lhs = std::get<std::string>(left.data());
            const auto &rhs = std::get<std::string>(right.data());
            if (op == "<") {
                return Value::boolean(lhs < rhs);
            }
            if (op == "<=") {
                return Value::boolean(lhs <= rhs);
            }
            if (op == ">") {
                return Value::boolean(lhs > rhs);
            }
            return Value::boolean(lhs >= rhs);
        }
        throw RuntimeError("Unsupported operand types for '" + op + "': '" + left.typeName() + "' and '" + right.typeName() + "'",
                           expr.location());
    }

    throw RuntimeError("Unsupported binary operator '" + op + "'", expr.location());
}

Value Interpreter::evaluateCall(const ast::CallExpr &expr, Environment &environment) {
    Value callee = evaluateExpression(expr.callee(), environment);
    std::vector<Value> arguments;
    arguments.reserve(expr.arguments().size());

    for (const auto &argument : expr.arguments()) {
        arguments.push_back(evaluateExpression(argument, environment));
    }

    if (std::holds_alternative<FunctionPlaceholder>(callee.data())) {
        const auto &function = std::get<FunctionPlaceholder>(callee.data());
        if (function.name == "print") {
            for (std::size_t i = 0; i < arguments.size(); ++i) {
                if (i != 0) {
                    std::cout << ' ';
                }
                std::cout << formatForPrint(arguments[i]);
            }
            std::cout << std::endl;
            return Value::none();
        }
        return Value::none();
    }

    throw RuntimeError("Attempted to call non-function value of type '" + callee.typeName() + "'", expr.location());
}

Value Interpreter::evaluateVariable(const ast::VariableExpr &expr, Environment &environment) {
    return environment.get(expr.name(), expr.location());
}

}  // namespace pylite
