#include "pylite/interpreter.hpp"

#include <cstdint>
#include <iostream>
#include <memory>
#include <sstream>
#include <string>
#include <variant>
#include <vector>

namespace pylite {
namespace {

std::string describeExpression(const ast::Expression::Ptr &expression);
std::string describeStatement(const ast::Statement::Ptr &statement);

std::string describeExpression(const ast::Expression::Ptr &expression) {
    if (!expression) {
        return "<null expr>";
    }

    switch (expression->kind()) {
        case ast::ExpressionKind::Literal: {
            const auto literal = std::dynamic_pointer_cast<const ast::LiteralExpr>(expression);
            if (!literal) {
                return "literal";
            }
            std::ostringstream oss;
            oss << "literal(";
            if (std::holds_alternative<std::int64_t>(literal->value())) {
                oss << std::get<std::int64_t>(literal->value());
            } else if (std::holds_alternative<double>(literal->value())) {
                oss << std::get<double>(literal->value());
            } else if (std::holds_alternative<std::string>(literal->value())) {
                oss << '"' << std::get<std::string>(literal->value()) << '"';
            } else {
                oss << "None";
            }
            oss << ')';
            return oss.str();
        }
        case ast::ExpressionKind::Variable: {
            const auto variable = std::dynamic_pointer_cast<const ast::VariableExpr>(expression);
            return variable ? "var(" + variable->name() + ")" : "var";
        }
        case ast::ExpressionKind::Unary: {
            const auto unary = std::dynamic_pointer_cast<const ast::UnaryExpr>(expression);
            if (!unary) {
                return "unary";
            }
            return "(" + unary->op() + ' ' + describeExpression(unary->operand()) + ')';
        }
        case ast::ExpressionKind::Binary: {
            const auto binary = std::dynamic_pointer_cast<const ast::BinaryExpr>(expression);
            if (!binary) {
                return "binary";
            }
            return '(' + describeExpression(binary->left()) + ' ' + binary->op() + ' ' +
                   describeExpression(binary->right()) + ')';
        }
        case ast::ExpressionKind::Call: {
            const auto call = std::dynamic_pointer_cast<const ast::CallExpr>(expression);
            if (!call) {
                return "call";
            }
            std::ostringstream oss;
            oss << "call(" << describeExpression(call->callee());
            for (const auto &argument : call->arguments()) {
                oss << ", " << describeExpression(argument);
            }
            oss << ')';
            return oss.str();
        }
    }

    return "<expr>";
}

std::string describeStatement(const ast::Statement::Ptr &statement) {
    if (!statement) {
        return "<null stmt>";
    }

    switch (statement->kind()) {
        case ast::StatementKind::Expression: {
            const auto exprStmt = std::dynamic_pointer_cast<const ast::ExpressionStmt>(statement);
            return exprStmt ? "expr " + describeExpression(exprStmt->expression()) : "expr";
        }
        case ast::StatementKind::Assignment: {
            const auto assign = std::dynamic_pointer_cast<const ast::AssignmentStmt>(statement);
            if (!assign) {
                return "assign";
            }
            return assign->target() + " = " + describeExpression(assign->value());
        }
        case ast::StatementKind::Block: {
            const auto block = std::dynamic_pointer_cast<const ast::BlockStmt>(statement);
            if (!block) {
                return "block";
            }
            std::ostringstream oss;
            oss << "block{";
            bool first = true;
            for (const auto &inner : block->statements()) {
                if (!first) {
                    oss << ", ";
                }
                first = false;
                oss << describeStatement(inner);
            }
            oss << '}';
            return oss.str();
        }
    }

    return "<stmt>";
}

std::string describeBlock(const ast::BlockStmt &block) {
    std::ostringstream oss;
    oss << "block{";
    bool first = true;
    for (const auto &statement : block.statements()) {
        if (!first) {
            oss << ", ";
        }
        first = false;
        oss << describeStatement(statement);
    }
    oss << '}';
    return oss.str();
}

}  // namespace

Interpreter::Interpreter() = default;

void Interpreter::runSource(const std::string &source) {
    auto tokens = lexer_.tokenize(source);
    auto program = parser_.parse(tokens);
    execute(program);
}

void Interpreter::runReplLine(const std::string &line) {
    auto tokens = lexer_.tokenize(line);
    auto program = parser_.parse(tokens);
    execute(program);
}

void Interpreter::execute(const ast::BlockStmt::Ptr &program) {
    if (!program) {
        std::cout << "[PyLite] Executing <null program>" << std::endl;
        return;
    }

    std::cout << "[PyLite] Executing " << describeBlock(*program) << std::endl;
}

}  // namespace pylite
