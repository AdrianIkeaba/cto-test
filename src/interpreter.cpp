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

bool isEffectivelyInteger(double value) { return std::floor(value) == value; }

class CallStackGuard {
public:
    CallStackGuard(std::vector<std::string> &stack, std::string name) : stack_(stack) {
        stack_.push_back(std::move(name));
    }

    ~CallStackGuard() {
        if (!stack_.empty()) {
            stack_.pop_back();
        }
    }

private:
    std::vector<std::string> &stack_;
};

class ReturnJump : public std::exception {
public:
    ReturnJump(Value value, ast::SourceLocation location)
        : value_(std::move(value)), location_(location) {}

    [[nodiscard]] const Value &value() const noexcept { return value_; }
    [[nodiscard]] ast::SourceLocation location() const noexcept { return location_; }

    const char *what() const noexcept override { return "Function return"; }

private:
    Value value_;
    ast::SourceLocation location_;
};

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
    if (const auto *functionPtr = std::get_if<FunctionValue::Ptr>(&data)) {
        if (*functionPtr && !(*functionPtr)->name().empty()) {
            return "<function " + (*functionPtr)->name() + ">";
        }
        return "<function>";
    }
    if (const auto *functionValue = std::get_if<FunctionPlaceholder>(&data)) {
        return "<function " + functionValue->name + ">";
    }
    const auto &objectValue = std::get<ObjectPlaceholder>(data);
    return "<object " + objectValue.description + ">";
}

std::string describeFunctionName(const FunctionValue::Ptr &function) {
    if (function && !function->name().empty()) {
        return function->name();
    }
    return std::string{"<anonymous>"};
}

}  // namespace

Interpreter::Interpreter() { reset(); }

void Interpreter::reset() {
    globals_ = std::make_shared<Environment>();
    results_.clear();
    callStack_.clear();
    globals_->define("print", Value::function(FunctionPlaceholder{"print"}));
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
    callStack_.clear();
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
    try {
        executeBlock(*program, globals_);
    } catch (const ReturnJump &jump) {
        throw RuntimeError("Return statement outside function", jump.location());
    }
}

void Interpreter::executeBlock(const ast::BlockStmt &block, const Environment::Ptr &environment) {
    if (!environment) {
        throw RuntimeError("Invalid execution environment", block.location());
    }
    for (const auto &statement : block.statements()) {
        executeStatement(statement, environment);
    }
}

void Interpreter::executeStatement(const ast::Statement::Ptr &statement, const Environment::Ptr &environment) {
    if (!environment) {
        throw RuntimeError("Invalid execution environment", statement->location());
    }

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
            environment->assign(assign->target(), value);
            break;
        }
        case ast::StatementKind::If: {
            auto ifStmt = std::dynamic_pointer_cast<ast::IfStmt>(statement);
            if (!ifStmt) {
                throw RuntimeError("Invalid if statement", statement->location());
            }
            if (!ifStmt->thenBranch()) {
                throw RuntimeError("Missing body in if statement", statement->location());
            }
            Value condition = evaluateExpression(ifStmt->condition(), environment);
            if (condition.truthy()) {
                executeBlock(*ifStmt->thenBranch(), environment);
            } else if (ifStmt->elseBranch()) {
                if (ifStmt->elseBranch()->kind() == ast::StatementKind::Block) {
                    auto elseBlock = std::dynamic_pointer_cast<ast::BlockStmt>(ifStmt->elseBranch());
                    if (!elseBlock) {
                        throw RuntimeError("Invalid else block", ifStmt->elseBranch()->location());
                    }
                    executeBlock(*elseBlock, environment);
                } else {
                    executeStatement(ifStmt->elseBranch(), environment);
                }
            }
            break;
        }
        case ast::StatementKind::While: {
            auto whileStmt = std::dynamic_pointer_cast<ast::WhileStmt>(statement);
            if (!whileStmt) {
                throw RuntimeError("Invalid while statement", statement->location());
            }
            if (!whileStmt->body()) {
                throw RuntimeError("Missing body in while statement", statement->location());
            }
            while (evaluateExpression(whileStmt->condition(), environment).truthy()) {
                executeBlock(*whileStmt->body(), environment);
            }
            break;
        }
        case ast::StatementKind::Block: {
            auto block = std::dynamic_pointer_cast<ast::BlockStmt>(statement);
            if (!block) {
                throw RuntimeError("Invalid block statement", statement->location());
            }
            auto child = std::make_shared<Environment>(environment);
            executeBlock(*block, child);
            break;
        }
        case ast::StatementKind::Function: {
            auto functionStmt = std::dynamic_pointer_cast<ast::FunctionStmt>(statement);
            if (!functionStmt) {
                throw RuntimeError("Invalid function definition", statement->location());
            }
            defineFunction(*functionStmt, environment);
            break;
        }
        case ast::StatementKind::Return: {
            auto returnStmt = std::dynamic_pointer_cast<ast::ReturnStmt>(statement);
            if (!returnStmt) {
                throw RuntimeError("Invalid return statement", statement->location());
            }
            Value value = Value::none();
            if (returnStmt->hasValue()) {
                value = evaluateExpression(returnStmt->value(), environment);
            }
            throw ReturnJump(std::move(value), returnStmt->location());
        }
    }
}

Value Interpreter::evaluateExpression(const ast::Expression::Ptr &expression, const Environment::Ptr &environment) {
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

Value Interpreter::evaluateUnary(const ast::UnaryExpr &expr, const Environment::Ptr &environment) {
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

Value Interpreter::evaluateBinary(const ast::BinaryExpr &expr, const Environment::Ptr &environment) {
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

Value Interpreter::evaluateCall(const ast::CallExpr &expr, const Environment::Ptr &environment) {
    Value callee = evaluateExpression(expr.callee(), environment);
    std::vector<Value> arguments;
    arguments.reserve(expr.arguments().size());

    for (const auto &argument : expr.arguments()) {
        arguments.push_back(evaluateExpression(argument, environment));
    }

    if (const auto *placeholder = std::get_if<FunctionPlaceholder>(&callee.data())) {
        if (placeholder->name == "print") {
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

    if (const auto *functionPtr = std::get_if<FunctionValue::Ptr>(&callee.data())) {
        return callUserFunction(*functionPtr, arguments, expr);
    }

    throw RuntimeError("Attempted to call non-function value of type '" + callee.typeName() + "'", expr.location());
}

Value Interpreter::evaluateVariable(const ast::VariableExpr &expr, const Environment::Ptr &environment) {
    if (!environment) {
        throw RuntimeError("Invalid environment for variable lookup", expr.location());
    }
    return environment->get(expr.name(), expr.location());
}

Value Interpreter::callUserFunction(const FunctionValue::Ptr &function, const std::vector<Value> &arguments,
                                    const ast::CallExpr &expr) {
    if (!function) {
        throw RuntimeError("Attempted to call an undefined function", expr.location());
    }
    if (!function->body()) {
        throw RuntimeError("Function '" + describeFunctionName(function) + "' has no body", function->location());
    }

    const auto &parameters = function->parameters();
    if (parameters.size() != arguments.size()) {
        throw RuntimeError("Function '" + describeFunctionName(function) + "' expected " +
                               std::to_string(parameters.size()) + " arguments but got " +
                               std::to_string(arguments.size()),
                           expr.location());
    }

    auto closure = function->closure();
    auto callEnvironment = std::make_shared<Environment>(closure);

    for (std::size_t i = 0; i < parameters.size(); ++i) {
        callEnvironment->define(parameters[i], arguments[i]);
    }

    CallStackGuard guard(callStack_, describeFunctionName(function));

    try {
        executeBlock(*function->body(), callEnvironment);
    } catch (const ReturnJump &jump) {
        return jump.value();
    }

    return Value::none();
}

void Interpreter::defineFunction(const ast::FunctionStmt &function, const Environment::Ptr &environment) {
    if (!environment) {
        throw RuntimeError("Invalid environment for function definition", function.location());
    }
    if (!function.body()) {
        throw RuntimeError("Function '" + function.name() + "' missing body", function.location());
    }

    std::vector<std::string> parameterNames;
    parameterNames.reserve(function.parameters().size());
    for (const auto &parameter : function.parameters()) {
        if (!parameter) {
            throw RuntimeError("Invalid parameter in function definition", function.location());
        }
        parameterNames.push_back(parameter->name());
    }

    auto functionValue = std::make_shared<FunctionValue>(function.name(), std::move(parameterNames), function.body(),
                                                         environment, function.location());
    environment->define(function.name(), Value::function(functionValue));
}

}  // namespace pylite
