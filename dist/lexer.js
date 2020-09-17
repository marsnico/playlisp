"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
var utils_1 = require("./utils");
var TokenType;
(function (TokenType) {
    TokenType[TokenType["TTIDEN"] = 0] = "TTIDEN";
    TokenType[TokenType["TTLITERAL"] = 1] = "TTLITERAL";
    TokenType[TokenType["TTNUM"] = 2] = "TTNUM";
    TokenType[TokenType["TTLBRK"] = 3] = "TTLBRK";
    TokenType[TokenType["TTRBRK"] = 4] = "TTRBRK";
    TokenType[TokenType["TTLB"] = 5] = "TTLB";
    TokenType[TokenType["TTRB"] = 6] = "TTRB";
    TokenType[TokenType["TTQUOTE"] = 7] = "TTQUOTE";
    TokenType[TokenType["TTDOT"] = 8] = "TTDOT";
    TokenType[TokenType["TTEOF"] = 9] = "TTEOF";
    TokenType[TokenType["TTSTART"] = 10] = "TTSTART";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
function isAlpha(c) {
    if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
        return true;
    }
    switch (c) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '>':
        case '<':
        case '!':
        case '?':
        case '=':
        case '~':
        case '.':
        case '_':
            return true;
    }
    return false;
}
function isNum(c) {
    return c >= '0' && c <= '9';
}
function isAlphanum(c) {
    return isAlpha(c) || isNum(c);
}
function isSpace(c) {
    return c == ' ' || c == '\r' || c == '\n' || c == '\t';
}
var Lexer = /** @class */ (function () {
    function Lexer(source) {
        this.token = '';
        this.tokenType = TokenType.TTSTART;
        this.cc = '';
        this.pc = 0;
        this.source = '';
        this.sourceLen = 0;
        this.source = source;
        this.sourceLen = this.source.length;
        this.cc = '';
        this.pc = 0;
        this.nextChar();
    }
    Lexer.prototype.getTokenType = function () {
        return this.tokenType;
    };
    Lexer.prototype.getToken = function () {
        return this.token;
    };
    Lexer.prototype.nextChar = function () {
        if (this.pc < this.sourceLen) {
            this.cc = this.source[this.pc];
            this.pc++;
        }
        else {
            this.cc = '';
        }
    };
    Lexer.prototype.NextToken = function () {
        while (this.cc == ';' || isSpace(this.cc)) {
            if (isSpace(this.cc)) {
                while (isSpace(this.cc)) {
                    this.nextChar();
                }
            }
            else {
                while (this.cc != '' && this.cc != '\r' && this.cc != '\n') {
                    this.nextChar();
                }
            }
        }
        if (isAlpha(this.cc)) {
            var token = this.cc;
            this.nextChar();
            while (isAlphanum(this.cc)) {
                token += this.cc;
                this.nextChar();
            }
            this.token = token;
            this.tokenType = TokenType.TTIDEN;
        }
        else if (isNum(this.cc)) {
            var token = this.cc;
            this.nextChar();
            while (isNum(this.cc)) {
                token += this.cc;
                this.nextChar();
            }
            this.token = token;
            this.tokenType = TokenType.TTNUM;
        }
        else if (this.cc == '') {
            // eof
            this.token = "";
            this.tokenType = TokenType.TTEOF;
        }
        else if (this.cc == '"') {
            var token = "";
            this.nextChar();
            //todo add escape char support
            while (this.cc != '"' && this.cc != '' && this.cc != '\r' && this.cc != '\n') {
                token += this.cc;
                this.nextChar();
            }
            if (this.cc == '"') {
                this.nextChar();
            }
            else {
                utils_1.panic("string literal require right quote");
            }
            this.token = token;
            this.tokenType = TokenType.TTLITERAL;
        }
        else if (this.cc == '\'') {
            // syntax sugar for quote
            this.nextChar();
            this.token = "'";
            this.tokenType = TokenType.TTQUOTE;
        }
        else {
            switch (this.cc) {
                case '(':
                    this.token = "(";
                    this.tokenType = TokenType.TTLBRK;
                    this.nextChar();
                    break;
                case ')':
                    this.token = ")";
                    this.tokenType = TokenType.TTRBRK;
                    this.nextChar();
                    break;
                case '[':
                    this.token = "[";
                    this.tokenType = TokenType.TTLB;
                    this.nextChar();
                    break;
                case ']':
                    this.token = "]";
                    this.tokenType = TokenType.TTRB;
                    this.nextChar();
                    break;
                case '.':
                    this.token = ".";
                    this.tokenType = TokenType.TTDOT;
                    this.nextChar();
                    break;
                default:
                    utils_1.panic("unknown char: " + this.cc);
            }
        }
    };
    return Lexer;
}());
exports.default = Lexer;
