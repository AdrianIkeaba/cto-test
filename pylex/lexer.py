from __future__ import annotations

from dataclasses import dataclass
from enum import Enum, auto
from typing import List, Optional, Tuple, Union


class LexerError(Exception):
    def __init__(self, message: str, line: int, column: int):
        super().__init__(f"{message} at line {line}, column {column}")
        self.message = message
        self.line = line
        self.column = column


class TokenType(Enum):
    IDENTIFIER = auto()
    KEYWORD = auto()

    INT = auto()
    FLOAT = auto()
    STRING = auto()

    OP = auto()  # Operators like ==, !=, <=, >=, +, -, **, //, ...
    PUNCTUATION = auto()  # Punctuation like (, ), {, }, [, ], :, ,, .

    NEWLINE = auto()
    INDENT = auto()
    DEDENT = auto()

    EOF = auto()


@dataclass
class Token:
    type: TokenType
    value: Optional[Union[str, int, float]]
    line: int
    column: int

    def __repr__(self) -> str:
        return f"Token(type={self.type}, value={self.value!r}, line={self.line}, column={self.column})"


KEYWORDS = {
    "False",
    "None",
    "True",
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
}


# Operators, ordered by descending length for longest-match scanning
OPERATORS = [
    # 3-char operators
    "<<=",
    ">>=",
    "**=",
    "//=",
    "...",
    "->",
    ":=",
    # 2-char operators
    "==",
    "!=",
    "<=",
    ">=",
    "<<",
    ">>",
    "**",
    "//",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "&=",
    "|=",
    "^=",
]

# Single-char operators
SINGLE_CHAR_OPERATORS = set("+-*/%&|^~@=<>!")

# Punctuation
PUNCTUATION = {
    "(", ")", "{", "}", "[", "]",
    ",", ":", ";", ".",
}


class Lexer:
    def __init__(self, source: str):
        self.source = source
        self.length = len(source)
        self.pos = 0
        self.line = 1
        self.col = 1

        self.indents: List[int] = [0]
        self.open_brackets = 0
        self.at_line_start = True

        self.tokens: List[Token] = []

    def tokenize(self) -> List[Token]:
        while self.pos < self.length:
            if self.at_line_start and self.open_brackets == 0:
                if self._handle_indentation_and_blank_lines():
                    # A NEWLINE for a blank/comment-only line was emitted; continue.
                    continue

            c = self._peek()
            if c in " \t\r":
                self._advance()
                continue

            if c == "#":
                # Comment: consume until newline
                while self.pos < self.length and self._peek() not in "\n\r":
                    self._advance()
                # Do not emit a token here; newline will be handled in next iteration
                continue

            if c == "\n":
                # Newline handling
                self._advance_newline()
                if self.open_brackets == 0:
                    self._emit(TokenType.NEWLINE, None)
                    self.at_line_start = True
                else:
                    # Inside brackets: newline is ignored (implicit line-joining)
                    self.at_line_start = True
                continue

            # Not whitespace/comment/newline: we are no longer at line start
            self.at_line_start = False

            # Strings
            if c in ("'", '"'):
                self._scan_string()
                continue

            # Numbers (including leading . for floats like .5)
            if c.isdigit() or (c == "." and self._peek_next().isdigit()):
                self._scan_number()
                continue

            # Identifiers and keywords
            if c == "_" or c.isalpha():
                self._scan_identifier_or_keyword()
                continue

            # Operators or punctuation
            if self._scan_operator_or_punct():
                continue

            # Anything else is an error
            raise LexerError(f"Invalid character {c!r}", self.line, self.col)

        # End of input: emit a trailing NEWLINE (if last token isn't NEWLINE) and DEDENTs, then EOF
        if not self.tokens or self.tokens[-1].type != TokenType.NEWLINE:
            self._emit(TokenType.NEWLINE, None)

        while len(self.indents) > 1:
            self.indents.pop()
            self._emit(TokenType.DEDENT, None)

        self._emit(TokenType.EOF, None)
        return self.tokens

    # Internal helpers

    def _emit(self, ttype: TokenType, value: Optional[Union[str, int, float]]):
        self.tokens.append(Token(ttype, value, self.line, self.col))

    def _peek(self, n: int = 0) -> str:
        idx = self.pos + n
        if idx >= self.length:
            return "\0"
        return self.source[idx]

    def _peek_next(self) -> str:
        return self._peek(1)

    def _advance(self) -> str:
        ch = self._peek()
        self.pos += 1
        if ch == "\n":
            self.line += 1
            self.col = 1
        else:
            self.col += 1
        return ch

    def _advance_newline(self):
        # Normalize CRLF and CR newlines to a single newline
        ch = self._peek()
        if ch == "\r":
            self._advance()
            if self._peek() == "\n":
                self._advance()
        else:
            self._advance()
        # After consuming newline, line/col have been updated by _advance()

    def _handle_indentation_and_blank_lines(self) -> bool:
        # Count indentation spaces (treat tab as 4 spaces)
        start_pos = self.pos
        start_col = self.col
        indent = 0
        while True:
            c = self._peek()
            if c == " ":
                indent += 1
                self._advance()
            elif c == "\t":
                indent += 4
                self._advance()
            else:
                break

        # If line is blank or comment-only, consume rest of line and emit NEWLINE
        c = self._peek()
        if c in ("\n", "\r"):
            self._advance_newline()
            self._emit(TokenType.NEWLINE, None)
            self.at_line_start = True
            return True
        if c == "#":
            while self.pos < self.length and self._peek() not in "\n\r":
                self._advance()
            if self._peek() in ("\n", "\r"):
                self._advance_newline()
            self._emit(TokenType.NEWLINE, None)
            self.at_line_start = True
            return True

        # Non-blank line: compare indentation levels
        current_indent = self.indents[-1]
        if indent > current_indent:
            self.indents.append(indent)
            self._emit(TokenType.INDENT, None)
        elif indent < current_indent:
            # Dedent to a matching level
            while len(self.indents) > 1 and indent < self.indents[-1]:
                self.indents.pop()
                self._emit(TokenType.DEDENT, None)
            if indent != self.indents[-1]:
                raise LexerError("Inconsistent dedent level", self.line, start_col)
        # else equal: nothing to emit

        self.at_line_start = False
        return False

    def _scan_identifier_or_keyword(self):
        start_line, start_col = self.line, self.col
        start = self.pos
        self._advance()  # first char
        while True:
            c = self._peek()
            if c == "_" or c.isalnum():
                self._advance()
            else:
                break
        text = self.source[start:self.pos]
        if text in KEYWORDS:
            self.tokens.append(Token(TokenType.KEYWORD, text, start_line, start_col))
        else:
            self.tokens.append(Token(TokenType.IDENTIFIER, text, start_line, start_col))

    def _scan_number(self):
        start_line, start_col = self.line, self.col
        start = self.pos

        def consume_digits():
            while self._peek().isdigit():
                self._advance()

        saw_digits = False
        # Integer part
        if self._peek().isdigit():
            consume_digits()
            saw_digits = True

        # Fractional part
        is_float = False
        if self._peek() == "." and self._peek_next().isdigit():
            is_float = True
            self._advance()  # consume '.'
            consume_digits()

        # Exponent part
        if self._peek() in "eE":
            is_float = True
            self._advance()  # e or E
            if self._peek() in "+-":
                self._advance()
            if not self._peek().isdigit():
                raise LexerError("Invalid float literal exponent", self.line, self.col)
            consume_digits()

        text = self.source[start:self.pos]
        if is_float:
            try:
                val = float(text)
            except ValueError:
                raise LexerError("Invalid float literal", start_line, start_col)
            self.tokens.append(Token(TokenType.FLOAT, val, start_line, start_col))
        else:
            try:
                val = int(text)
            except ValueError:
                raise LexerError("Invalid integer literal", start_line, start_col)
            self.tokens.append(Token(TokenType.INT, val, start_line, start_col))

    def _scan_string(self):
        quote = self._peek()
        start_line, start_col = self.line, self.col
        self._advance()  # consume opening quote

        is_triple = False
        if self._peek() == quote and self._peek_next() == quote:
            # Triple-quoted string
            is_triple = True
            self._advance()  # second quote
            self._advance()  # third quote

        chars: List[str] = []
        while True:
            c = self._peek()
            if c == "\0":
                raise LexerError("Unterminated string literal", start_line, start_col)
            if is_triple:
                if c == quote and self._peek(1) == quote and self._peek(2) == quote:
                    # End of triple-quoted string
                    self._advance()
                    self._advance()
                    self._advance()
                    break
                else:
                    ch = self._advance()
                    chars.append(ch)
                    continue
            else:
                if c == "\n" or c == "\r":
                    raise LexerError("Unterminated string literal", start_line, start_col)
                if c == "\\":
                    self._advance()  # consume backslash
                    esc = self._peek()
                    if esc == "\0":
                        raise LexerError("Unterminated string literal", start_line, start_col)
                    # Simple escape handling; keep as-is
                    chars.append(self._advance())
                    continue
                if c == quote:
                    self._advance()  # consume closing quote
                    break
                chars.append(self._advance())

        self.tokens.append(Token(TokenType.STRING, "".join(chars), start_line, start_col))

    def _scan_operator_or_punct(self) -> bool:
        # Try multi-char operators first
        for op in OPERATORS:
            if self._match(op):
                self._emit_operator(op)
                return True

        c = self._peek()
        # Punctuation that can also be part of multi-char ops: handle remaining here
        if c in PUNCTUATION:
            # Ellipsis '...' already handled above as operator; here only single '.' case remains
            if c in "([{":
                self.open_brackets += 1
            elif c in ")]}":
                if self.open_brackets > 0:
                    self.open_brackets -= 1
            self._advance()
            self._emit(TokenType.PUNCTUATION, c)
            return True

        # Single-char operators (not covered above)
        if c in SINGLE_CHAR_OPERATORS:
            self._advance()
            self._emit(TokenType.OP, c)
            return True

        return False

    def _emit_operator(self, op: str):
        # Adjust bracket count for operators that are actually punctuation-like
        if op == "...":
            # treated as punctuation-like but keep as operator
            pass
        self._emit(TokenType.OP, op)

    def _match(self, text: str) -> bool:
        end = self.pos + len(text)
        if self.source[self.pos:end] == text:
            # Special-case: distinguish ':=' operator from ':' punctuation
            # Already handled by ordering; just advance and emit
            self.pos = end
            # update line/col positions accordingly
            for ch in text:
                if ch == "\n":
                    self.line += 1
                    self.col = 1
                else:
                    self.col += 1
            return True
        return False
