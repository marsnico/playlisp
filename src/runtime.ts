import AstNode, { NodeType, VecNode, LiteralNode, TrueNode, FalseNode } from "./ast"
import { panic } from "./utils"
import Env from "./env"
import { defLambda, callLambda } from "./lambda"
import { compare, div, add, sub, mul } from "./preload"
import { defineModule, importModule, exportFn } from "./module"


export function el(node: AstNode, n: number): AstNode {
  if (node.nodeType == NodeType.NodeTypeVec && n < (node.vec.length)) {
    return node.vec[n]
  }
  panic("el: out of range")
}

function elExt(node: AstNode, env: Env): AstNode {
  const theNode = Eval(el(node, 1), env)
  const nth = Eval(el(node, 2), env)
  if (numberp(nth)) {
    return el(theNode, Math.floor(nth.nval))
  }
  panic("el require a numberic index")
}

function numberp(n: AstNode): boolean {
  return n.nodeType == NodeType.NodeTypeNum
}

export function nilp(node: AstNode): boolean {
  return node.nodeType == NodeType.NodeTypeVec && node.vec.length == 0
}

function symbolp(node: AstNode, sym: string): boolean {
  return node.nodeType == NodeType.NodeTypeSym && node.sval == sym
}

function progn(node: AstNode, env: Env): AstNode {
  let lastVal: AstNode | undefined = undefined
  for (let x = 1; x < node.vec.length; x++) {
    const param = node.vec[x]
    lastVal = Eval(param, env)
  }
  if (!lastVal) {
    panic("progn require at lease one form")
  }
  return lastVal
}

function define(node: AstNode, env: Env): AstNode {
  const varName = el(node, 1)
  const varVal = Eval(el(node, 2), env)
  env.setq(varName.sval, varVal)
  return new VecNode()
}

function print(node: AstNode, env: Env): AstNode {

  const strs: string[] = []
  for (let x = 1; x < node.vec.length; x++) {
    const param = node.vec[x]
    strs.push(stringify(Eval(param, env)))
  }
  const ret = strs.join(" ")
  console.log(ret)
  return new LiteralNode(ret)
}
function list(node: AstNode, env: Env): AstNode {

  const nodes: AstNode[] = []
  for (let x = 1; x < node.vec.length; x++) {
    const param = node.vec[x]
    nodes.push(Eval(param, env))
  }
  const ret = new VecNode(nodes)
  return ret
}

function stringify(node: AstNode): string {
  switch (node.nodeType) {
    case NodeType.NodeTypeTrue:
      return "true"
    case NodeType.NodeTypeFalse:
      return "false"
    case NodeType.NodeTypeNum:
      return '' + node.nval
    case NodeType.NodeTypeSym:
      return "`" + node.sval + "`"
    case NodeType.NodeTypeLiteral:
      return node.sval
    case NodeType.NodeTypeVec:
      // todo print cons has bug
      if (nilp(node)) {
        return "nil"
      } else {
        const strs: string[] = []
        for (let x = 0; x < node.vec.length; x++) {
          const param = node.vec[x]
          strs.push(stringify(param))
        }
        return "(" + strs.join(" ") + ")"
      }
    case NodeType.NodeTypeLambda:
      return "<lambda>"
  }
  //todo
  return "<unsupport>"
}

function toBool(node: AstNode): boolean {
  switch (node.nodeType) {
    case NodeType.NodeTypeTrue:
      return true
    case NodeType.NodeTypeFalse:
      return false
    case NodeType.NodeTypeNum:
      return node.nval != 0
    case NodeType.NodeTypeSym:
      return true
    case NodeType.NodeTypeLiteral:
      return node.sval != ""
    case NodeType.NodeTypeVec:
      return !nilp(node)
    case NodeType.NodeTypeLambda:
      return true
  }
  //todo
  panic("tobool error")
  return false
}

function ifform(node: AstNode, env: Env): AstNode {
  // (if con true-part false-part)
  if (node.vec.length != 4) {
    panic("if syntax error")
  }
  const cond = Eval(el(node, 1), env)
  const truePart = el(node, 2)
  const falsePart = el(node, 3)

  if (toBool(cond)) {
    return Eval(truePart, env)
  } else {
    return Eval(falsePart, env)
  }
}

function loopForm(node: AstNode, env: Env): AstNode {
  if (node.vec.length < 3) {
    panic("loop syntax error")
  }
  const cond = el(node, 1)

  let lastValue = new VecNode()

  while (toBool(Eval(cond, env))) {
    for (const n of node.vec.slice(2)) {
      lastValue = Eval(n, env)
    }
  }
  return lastValue
}

function mem(node: AstNode, env: Env): AstNode {
  if (node.vec.length != 3) {
    panic(". op error")
  }
  const rec = Eval(el(node, 1), env)
  const field = el(node, 2)
  if (rec.nodeType != NodeType.NodeTypeRecord || field.nodeType != NodeType.NodeTypeSym) {
    panic(". op require rec and sym")
  }
  const retNode = rec.rec.get(field.sval)
  if (retNode) {
    return retNode
  } else {
    panic("mem not found")
  }
}

export function Eval(node: AstNode, env: Env): AstNode {
  switch (node.nodeType) {
    case NodeType.NodeTypeTrue, NodeType.NodeTypeFalse, NodeType.NodeTypeNum:
      return node
    case NodeType.NodeTypeLiteral:
      return node
    case NodeType.NodeTypeLambda:
      return node
    case NodeType.NodeTypeSym:
      {
        const val = env.find(node.sval)
        if (val) {
          return val
        } else {
          panic("undefined var:" + node.sval)
        }
      }
      break;
    case NodeType.NodeTypeVec:
      {
        if (nilp(node)) {
          panic("cannot eval empty node")
        }
        const firstEl = el(node, 0)
        // temporary implementation
        if (firstEl.nodeType == NodeType.NodeTypeSym) {
          switch (firstEl.sval) {
            case "do":
              return progn(node, env)
            case "let":
              return define(node, env)
            case "print":
              return print(node, env)
            case "el":
              return elExt(node, env)
            case "quote":
              return el(node, 1)
            case "list":
              return list(node, env)
            case "fn":
              return defLambda(node, env)
            case "+":
              return add(node, env)
            case "-":
              return sub(node, env)
            case "*":
              return mul(node, env)
            case "/":
              return div(node, env)
            case "if":
              return ifform(node, env)
            case "loop":
              return loopForm(node, env)
            case ">": case ">=": case "<": case "<=": case "=": case "!=":
              {
                const ret = compare(node, env, firstEl.sval)
                if (ret) {
                  return new TrueNode()
                }
                return new FalseNode()
              }

            case "module":
              return defineModule(node, env)
            case "import":
              return importModule(node, env)
            case "export":
              return exportFn(node, env)
            case ".":
              return mem(node, env)

          }

        }

        const lambdaNode = Eval(firstEl, env)
        if (lambdaNode.nodeType == NodeType.NodeTypeLambda) {
          return callLambda(lambdaNode, node.vec.slice(1), env)
        } else {
          panic("not callable")
        }
      }


  }
  panic("not support yet")
}
