import unittest

from pylex import Lexer, TokenType, LexerError


def token_summary(tokens):
    return [(t.type, t.value) for t in tokens]


class TestLexerBasics(unittest.TestCase):
    def test_keywords_identifiers_indentation(self):
        src = (
            "if x:\n"
            "    return y\n"
            "else:\n"
            "    pass\n"
        )
        lexer = Lexer(src)
        tokens = lexer.tokenize()

        # Extract types and values for relevant tokens
        tv = [(t.type, t.value) for t in tokens]

        # Expected sequence (simplified)
        expected = [
            (TokenType.KEYWORD, "if"),
            (TokenType.IDENTIFIER, "x"),
            (TokenType.PUNCTUATION, ":"),
            (TokenType.NEWLINE, None),
            (TokenType.INDENT, None),
            (TokenType.KEYWORD, "return"),
            (TokenType.IDENTIFIER, "y"),
            (TokenType.NEWLINE, None),
            (TokenType.DEDENT, None),
            (TokenType.KEYWORD, "else"),
            (TokenType.PUNCTUATION, ":"),
            (TokenType.NEWLINE, None),
            (TokenType.INDENT, None),
            (TokenType.KEYWORD, "pass"),
            (TokenType.NEWLINE, None),
            (TokenType.DEDENT, None),
            (TokenType.EOF, None),
        ]

        # Filter tv to the same number of expected tokens
        self.assertEqual(tv[: len(expected)], expected)

    def test_numbers(self):
        src = (
            "a = 123\n"
            "b = 3.14\n"
            "c = .5\n"
            "d = 1e-3\n"
        )
        tokens = Lexer(src).tokenize()

        # Helper to find values by type
        ints = [t.value for t in tokens if t.type == TokenType.INT]
        floats = [t.value for t in tokens if t.type == TokenType.FLOAT]

        self.assertIn(123, ints)
        self.assertTrue(any(abs(f - 3.14) < 1e-9 for f in floats))
        self.assertTrue(any(abs(f - 0.5) < 1e-9 for f in floats))
        self.assertTrue(any(abs(f - 1e-3) < 1e-12 for f in floats))

    def test_strings(self):
        src = (
            's = "hello"\n'
            "t = 'world'\n"
            'u = """multi\nline"""\n'
        )
        tokens = Lexer(src).tokenize()
        strings = [t.value for t in tokens if t.type == TokenType.STRING]
        self.assertIn("hello", strings)
        self.assertIn("world", strings)
        self.assertIn("multi\nline", strings)

    def test_operators(self):
        src = (
            "a+=1\n"
            "b==2\n"
            "c!=3\n"
            "d<=4\n"
            "e>=5\n"
            "f//=2\n"
            "g**=2\n"
            "h**2\n"
            "i//2\n"
            "j->k\n"
            "k:=1\n"
            "l<<=2\n"
            "m>>=3\n"
            "n&=1\n"
            "o|=1\n"
            "p^=1\n"
        )
        tokens = Lexer(src).tokenize()
        ops = [t.value for t in tokens if t.type == TokenType.OP]
        expected_ops = {"+=", "==", "!=", "<=", ">=", "//=", "**=", "**", "//", "->", ":=", "<<=", ">>=", "&=", "|=", "^="}
        for e in expected_ops:
            self.assertIn(e, ops)

    def test_parentheses_do_not_indent(self):
        src = (
            "func(\n"
            "    x,\n"
            "    y\n"
            ")\n"
        )
        tokens = Lexer(src).tokenize()
        # Ensure no INDENT or DEDENT produced inside parentheses
        types = [t.type for t in tokens]
        self.assertNotIn(TokenType.INDENT, types)
        self.assertNotIn(TokenType.DEDENT, types)

    def test_invalid_character(self):
        src = "a = `bad`\n"
        with self.assertRaises(LexerError):
            Lexer(src).tokenize()

    def test_unterminated_string(self):
        src = '"unterminated'  # no closing quote
        with self.assertRaises(LexerError):
            Lexer(src).tokenize()


if __name__ == "__main__":
    unittest.main()
