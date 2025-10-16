#pragma once

#include <cstddef>
#include <memory>
#include <string>
#include <utility>
#include <vector>

#include "pylite/lexer.hpp"

namespace pylite::ast {

struct SourceLocation {
    std::size_t line{0};
    std::size_t column{0};
};

class Node {
public:
    explicit Node(SourceLocation location) : location_(location) {}
    virtual ~Node() = default;

    [[nodiscard]] SourceLocation location() const noexcept { return location_; }

private:
    SourceLocation location_;
};

enum class ExpressionKind {
    Literal,
    Variable,
    Unary,
    Binary,
    Call,
};

class Expression : public Node {
public:
    using Ptr = std::shared_ptr<Expression>;
    using ConstPtr = std::shared_ptr<const Expression>;

    Expression(ExpressionKind kind, SourceLocation location) : Node(location), kind_(kind) {}
    ~Expression() override = default;

    [[nodiscard]] ExpressionKind kind() const noexcept { return kind_; }

private:
    ExpressionKind kind_;
};

class LiteralExpr : public Expression {
public:
    LiteralExpr(TokenLiteral value, SourceLocation location)
        : Expression(ExpressionKind::Literal, location), value_(std::move(value)) {}

    [[nodiscard]] const TokenLiteral &value() const noexcept { return value_; }

private:
    TokenLiteral value_;
};

class VariableExpr : public Expression {
public:
    VariableExpr(std::string name, SourceLocation location)
        : Expression(ExpressionKind::Variable, location), name_(std::move(name)) {}

    [[nodiscard]] const std::string &name() const noexcept { return name_; }

private:
    std::string name_;
};

class UnaryExpr : public Expression {
public:
    UnaryExpr(std::string op, Expression::Ptr operand, SourceLocation location)
        : Expression(ExpressionKind::Unary, location), op_(std::move(op)), operand_(std::move(operand)) {}

    [[nodiscard]] const std::string &op() const noexcept { return op_; }
    [[nodiscard]] const Expression::Ptr &operand() const noexcept { return operand_; }

private:
    std::string op_;
    Expression::Ptr operand_;
};

class BinaryExpr : public Expression {
public:
    BinaryExpr(std::string op, Expression::Ptr left, Expression::Ptr right, SourceLocation location)
        : Expression(ExpressionKind::Binary, location), op_(std::move(op)), left_(std::move(left)), right_(std::move(right)) {}

    [[nodiscard]] const std::string &op() const noexcept { return op_; }
    [[nodiscard]] const Expression::Ptr &left() const noexcept { return left_; }
    [[nodiscard]] const Expression::Ptr &right() const noexcept { return right_; }

private:
    std::string op_;
    Expression::Ptr left_;
    Expression::Ptr right_;
};

class CallExpr : public Expression {
public:
    CallExpr(Expression::Ptr callee, std::vector<Expression::Ptr> arguments, SourceLocation location)
        : Expression(ExpressionKind::Call, location), callee_(std::move(callee)), arguments_(std::move(arguments)) {}

    [[nodiscard]] const Expression::Ptr &callee() const noexcept { return callee_; }
    [[nodiscard]] const std::vector<Expression::Ptr> &arguments() const noexcept { return arguments_; }

private:
    Expression::Ptr callee_;
    std::vector<Expression::Ptr> arguments_;
};

enum class StatementKind {
    Expression,
    Assignment,
    Block,
};

class Statement : public Node {
public:
    using Ptr = std::shared_ptr<Statement>;
    using ConstPtr = std::shared_ptr<const Statement>;

    Statement(StatementKind kind, SourceLocation location) : Node(location), kind_(kind) {}
    ~Statement() override = default;

    [[nodiscard]] StatementKind kind() const noexcept { return kind_; }

private:
    StatementKind kind_;
};

class ExpressionStmt : public Statement {
public:
    ExpressionStmt(Expression::Ptr expression, SourceLocation location)
        : Statement(StatementKind::Expression, location), expression_(std::move(expression)) {}

    [[nodiscard]] const Expression::Ptr &expression() const noexcept { return expression_; }

private:
    Expression::Ptr expression_;
};

class AssignmentStmt : public Statement {
public:
    AssignmentStmt(std::string target, Expression::Ptr value, SourceLocation location)
        : Statement(StatementKind::Assignment, location), target_(std::move(target)), value_(std::move(value)) {}

    [[nodiscard]] const std::string &target() const noexcept { return target_; }
    [[nodiscard]] const Expression::Ptr &value() const noexcept { return value_; }

private:
    std::string target_;
    Expression::Ptr value_;
};

class BlockStmt : public Statement {
public:
    using Ptr = std::shared_ptr<BlockStmt>;

    BlockStmt(std::vector<Statement::Ptr> statements, SourceLocation location)
        : Statement(StatementKind::Block, location), statements_(std::move(statements)) {}

    [[nodiscard]] const std::vector<Statement::Ptr> &statements() const noexcept { return statements_; }

private:
    std::vector<Statement::Ptr> statements_;
};

}  // namespace pylite::ast
