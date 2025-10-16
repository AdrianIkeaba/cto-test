#pragma once

#include <string>
#include <vector>

#include "pylite/lexer.hpp"
#include "pylite/parser.hpp"
#include "pylite/runtime.hpp"

namespace pylite {

class Interpreter {
public:
    Interpreter();

    void runSource(const std::string &source);
    void runReplLine(const std::string &line);

    [[nodiscard]] const std::vector<Value> &results() const noexcept { return results_; }
    void reset();

private:
    void execute(const ast::BlockStmt::Ptr &program);
    void executeBlock(const ast::BlockStmt &block, Environment &environment);
    void executeStatement(const ast::Statement::Ptr &statement, Environment &environment);
    Value evaluateExpression(const ast::Expression::Ptr &expression, Environment &environment);
    Value evaluateLiteral(const ast::LiteralExpr &literal) const;
    Value evaluateUnary(const ast::UnaryExpr &expr, Environment &environment);
    Value evaluateBinary(const ast::BinaryExpr &expr, Environment &environment);
    Value evaluateCall(const ast::CallExpr &expr, Environment &environment);
    Value evaluateVariable(const ast::VariableExpr &expr, Environment &environment);

    Lexer lexer_;
    Parser parser_;
    Environment globals_;
    std::vector<Value> results_;
};

}  // namespace pylite
