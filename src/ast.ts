import Env from './env'

export enum NodeType {
  NodeTypeVec,
  NodeTypeNum,
  NodeTypeLiteral,
  NodeTypeSym,
  NodeTypeLambda,
  NodeTypeTrue,
  NodeTypeFalse,
  NodeTypeRecord
}
	


export default class AstNode {
  public nodeType: NodeType = NodeType.NodeTypeVec
  public sval = ''
  public nval = 0
  vec: AstNode[] = []
  rec: Map<string, AstNode> = new Map<string, AstNode>()
  upper: Env | undefined = undefined
}

export class LambdaNode extends AstNode {
  constructor(args:AstNode[]=[], up: Env) {
    super()
    this.nodeType=NodeType.NodeTypeLambda
    this.vec=args
    this.upper = up
  }
}

export class VecNode extends AstNode {
  constructor(vec:AstNode[]=[]) {
    super()
    this.nodeType=NodeType.NodeTypeVec
    this.vec=vec
  }
}

export class RecordNode extends AstNode {
  constructor(rec: Map<string, AstNode> = new Map<string, AstNode>()) {
    super()
    this.nodeType=NodeType.NodeTypeRecord
    this.rec=rec
  }
}

export class TrueNode extends AstNode {
  constructor() {
    super()
    this.nodeType=NodeType.NodeTypeTrue
  }
}

export class FalseNode extends AstNode {
  constructor() {
    super()
    this.nodeType=NodeType.NodeTypeFalse
  }
}

export class SymbolNode extends AstNode {
  constructor(sym:string) {
    super()
    this.nodeType=NodeType.NodeTypeSym
    this.sval=sym
  }
}

export class NumberNode extends AstNode {
  constructor(num:number) {
    super()
    this.nodeType=NodeType.NodeTypeNum
    this.nval=num
  }
}

export class LiteralNode extends AstNode {
  constructor(lit:string) {
    super()
    this.nodeType=NodeType.NodeTypeLiteral
    this.sval=lit
  }
}