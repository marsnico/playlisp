import AstNode, { LiteralNode, VecNode, NodeType, RecordNode } from "./ast"
import * as path from 'path'
import { loadFile } from "./io"
import Parser from "./parser"
import Env from "./env"
import { Eval, el, nilp } from "./runtime"
import { panic } from "./utils"

const moduleIndex = "~~@module"
const rootPathIndex = "~~@root"

export function RunModule(rootPath: string, fileName: string) :AstNode {

	if (!path.isAbsolute(fileName)) {
		fileName = path.resolve(rootPath, fileName)
	}
	//fmt.Println(fileName)

	const code = loadFile(fileName)

	const parser = new Parser(code)

	const node = parser.Parse()

	const globalEnv = new Env(undefined)

  globalEnv.setq(rootPathIndex, new LiteralNode(path.dirname(fileName)))
  
  if (!node) {
    panic("parse failed")
  }

	Eval(node, globalEnv)

	//export module
	const mod= globalEnv.find(moduleIndex)
	if (mod) {
		return mod
	} else {
		return new VecNode()
	}
}

export function importModule(node :AstNode, env :Env) :AstNode {

	if (env.getUpEnv()) {
		panic("import module must be root env")
	}

	const rootDir = env.find(rootPathIndex)
	if (!rootDir || rootDir.nodeType != NodeType. NodeTypeLiteral) {
		panic("internal error: root path")
	}
	const modName = el(node, 1)
	if (modName.nodeType != NodeType. NodeTypeSym) {
		panic("module name must be symbol")
	}

	const mod = RunModule(rootDir.sval, modName.sval+".scm")

	if (!nilp(mod)) {
		env.setq(modName.sval, mod)
	} else {
		panic("load module failed")
	}
	return new VecNode()
}

export function defineModule(node :AstNode, env :Env) :AstNode {
	// must be root env
	if (env.getUpEnv()) {
		panic("module must be root env")
	}
	const _mod = env.find(moduleIndex)
	if (_mod) {
		panic("only one module in each file")
	}

	// module
	const mod = new RecordNode() 

	env.setq(moduleIndex, mod)

	for (const  subNode of node.vec.slice(1)) {
		Eval(subNode, env)
	}

	return new VecNode()
}

export function exportFn(node :AstNode, env :Env) :AstNode {
	// must be root env
	if (env.getUpEnv()) {
		panic("module must be root env")
	}
	const mod = env.find(moduleIndex)
	if (!mod) {
		panic("not in module define")
	}

	const varName = el(node, 1)
	const varVal = Eval(el(node, 2), env)
	mod.rec.set(varName.sval, varVal)
	return new VecNode()
}
