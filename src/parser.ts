import Lexer, { TokenType } from "./lexer"
import AstNode, { TrueNode, FalseNode, SymbolNode, NumberNode, LiteralNode, VecNode } from "./ast"
import { panic } from "./utils"


export default class Parser {
  private lexer: Lexer | undefined = undefined


  constructor(source: string) {


    this.lexer = new Lexer(source)
    this.lexer.NextToken()

  }

  Parse(): AstNode | undefined {

    return this.ParseForm()

  }

  ParseForm(): AstNode | undefined {
    switch (this.lexer?.getTokenType()) {
      case TokenType.TTIDEN:
        {
          let node: AstNode | undefined = undefined
          switch (this.lexer.getToken()) {
            case "true":
              node = new TrueNode()
              break;
            case "false":
              node = new FalseNode()
              break;
            default:
              node = new SymbolNode(this.lexer.getToken())
          }

          this.lexer.NextToken()
          return node
        }

      case TokenType.TTNUM:
        {
          const num = parseFloat(this.lexer.getToken())
          if (isNaN(num)) {
            panic('' + num + 'is not a number')
          }
          const node = new NumberNode(num)
          this.lexer.NextToken()
          return node
        }

      case TokenType.TTLITERAL:
        {
          const node = new LiteralNode(this.lexer.getToken())
          this.lexer.NextToken()
          return node
        }

      case TokenType.TTLBRK:
        return this.ParseSExpr()
      case TokenType.TTLB:
        return this.ParseVec()
      case TokenType.TTQUOTE:
        {
          this.lexer.NextToken()
          const quoteNode = this.ParseForm()
          const nodes: AstNode[] = []
          nodes.push(new SymbolNode('quote'))
          if (quoteNode !== undefined) {
            nodes.push(quoteNode)
          } else {
            panic("internal error quote")
          }


          return new VecNode(nodes)
        }

      default:
        panic("unknown token:" + this.lexer?.getToken)
    }
  }
  ParseSExpr(): AstNode {
    if (this.lexer?.getTokenType() == TokenType.TTLBRK) {
      this.lexer.NextToken()

      const nodes: AstNode[] = []

      while (this.lexer.getTokenType() != TokenType.TTEOF && this.lexer.getTokenType() != TokenType.TTRBRK) {
        const node = this.ParseForm()
        if (node) {
          nodes.push(node)
        }
      }

      const cdrNode = new VecNode(nodes)

      if (this.lexer.getTokenType() == TokenType.TTRBRK) {
        this.lexer.NextToken()
        return cdrNode
      } else {
        panic("require )")
      }

    } else {
      // error
      panic("require (")
    }
  }

  ParseVec(): AstNode {
    if (this.lexer?.getTokenType() == TokenType.TTLB) {
      this.lexer.NextToken()

      const nodes: AstNode[] = []

      nodes.push(new SymbolNode('list'))

      while (this.lexer.getTokenType() != TokenType.TTEOF && this.lexer.getTokenType() != TokenType.TTRB) {
        const node = this.ParseForm()
        if (node !== undefined) {
          nodes.push(node)
        }
      }

      const vecExp = new VecNode(nodes)

      if (this.lexer.getTokenType() == TokenType.TTRB) {
        this.lexer.NextToken()
        return vecExp
      } else {
        panic("require ]")
      }

    } else {
      // error
      panic("require [")
    }
  }

}
