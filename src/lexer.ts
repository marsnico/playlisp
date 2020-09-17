import { panic } from "./utils"

export enum TokenType {
  TTIDEN,
  TTLITERAL,
  TTNUM,
  TTLBRK,
  TTRBRK,
  TTLB,
  TTRB,
  TTQUOTE,
  TTDOT,
  TTEOF,
  TTSTART
}



function isAlpha(c: string): boolean {
  if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
    return true
  }
  switch (c) {
    case '+': case '-': case '*': case '/': case '>': case '<': case '!': case '?': case '=': case '~': case '.': case '_':
      return true
  }
  return false
}

function isNum(c: string): boolean {
  return c >= '0' && c <= '9'
}

function isAlphanum(c: string): boolean {
  return isAlpha(c) || isNum(c)
}

function isSpace(c: string): boolean {
  return c == ' ' || c == '\r' || c == '\n' || c == '\t'
}

export default class Lexer {
  private token = ''
  private tokenType: TokenType = TokenType.TTSTART
  private cc = ''
  private pc = 0
  private source = ''
  private sourceLen = 0

  getTokenType() :TokenType{
    return this.tokenType
  }
  getToken():string {
    return this.token
  }
  constructor(source: string) {
    this.source = source
    this.sourceLen = this.source.length
    this.cc = ''
    this.pc = 0
    this.nextChar()
  }

  nextChar(): void {
    if (this.pc < this.sourceLen) {
      this.cc = this.source[this.pc]
      this.pc++
    } else {
      this.cc = ''
    }
  }

  NextToken(): void {
    while (this.cc == ';' || isSpace(this.cc)) {
      if (isSpace(this.cc)) {
        while (isSpace(this.cc)) {
          this.nextChar()
        }
      } else {
        while (this.cc != '' && this.cc != '\r' && this.cc != '\n') {
          this.nextChar()
        }
      }
    }

    if (isAlpha(this.cc)) {
      let token = this.cc

      this.nextChar()
      while (isAlphanum(this.cc)) {
        token += this.cc
        this.nextChar()

      }
      this.token = token
      this.tokenType = TokenType.TTIDEN
    } else if (isNum(this.cc)) {

      let token = this.cc
      this.nextChar()

      while (isNum(this.cc)) {
        token += this.cc
        this.nextChar()
      }
      this.token = token
      this.tokenType = TokenType.TTNUM
    } else if (this.cc == '') {
      // eof
      this.token = ""
      this.tokenType = TokenType.TTEOF

    } else if (this.cc == '"') {
      let token = ""
      this.nextChar()

      //todo add escape char support
      while (this.cc != '"' && this.cc !== '' && this.cc != '\r' && this.cc != '\n') {
        token += this.cc
        this.nextChar()
      }
      if (this.cc == '"') {
        this.nextChar()
      } else {
        panic("string literal require right quote")
      }
      this.token = token
      this.tokenType = TokenType.TTLITERAL
    } else if (this.cc == '\'') {
      // syntax sugar for quote
      this.nextChar()
      this.token = "'"
      this.tokenType = TokenType.TTQUOTE
    } else {
      switch (this.cc) {
        case '(':
          this.token = "("
          this.tokenType = TokenType.TTLBRK
          this.nextChar()
          break;
        case ')':
          this.token = ")"
          this.tokenType = TokenType.TTRBRK
          this.nextChar()
          break;
        case '[':
          this.token = "["
          this.tokenType = TokenType.TTLB
          this.nextChar()
          break;
        case ']':
          this.token = "]"
          this.tokenType = TokenType.TTRB
          this.nextChar()
          break;
        case '.':
          this.token = "."
          this.tokenType = TokenType.TTDOT
          this.nextChar()
          break;
        default:
          panic("unknown char: " + this.cc)
      }
    }
  }

}

