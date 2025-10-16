#pragma once

#include <memory>
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
    void executeBlock(const ast::BlockStmt &block, const Environment::Ptr &environment);
    void executeStatement(const ast::Statement::Ptr &statement, const Environment::Ptr &environment);
    Value evaluateExpression(const ast::Expression::Ptr &expression, const Environment::Ptr &environment);
    Value evaluateLiteral(const ast::LiteralExpr &literal) const;
    Value evaluateUnary(const ast::UnaryExpr &expr, const Environment::Ptr &environment);
    Value evaluateBinary(const ast::BinaryExpr &expr, const Environment::Ptr &environment);
    Value evaluateCall(const ast::CallExpr &expr, const Environment::Ptr &environment);
    Value evaluateVariable(const ast::VariableExpr &expr, const Environment::Ptr &environment);
    Value callUserFunction(const FunctionValue::Ptr &function, const std::vector<Value> &arguments,
                           const ast::CallExpr &expr);
    void defineFunction(const ast::FunctionStmt &function, const Environment::Ptr &environment);

    Lexer lexer_;
    Parser parser_;
    Environment::Ptr globals_;
    std::vector<Value> results_;
    std::vector<std::string> callStack_;
};

}  // namespace pylite
