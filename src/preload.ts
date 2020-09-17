import AstNode, { NodeType, NumberNode } from "./ast";
import Env from "./env";
import { panic } from "./utils";
import { Eval, el } from "./runtime";

export function add(node :AstNode, env :Env) :AstNode {
	let sum  = 0
	for (let x = 1; x < node.vec.length; x++) {
		const param = node.vec[x]
		const nodeVal = Eval(param, env)
		if (nodeVal.nodeType ==NodeType. NodeTypeNum) {
			sum += nodeVal.nval
		} else {
			panic("+ operand can only be number")
		}
	}
	return new NumberNode(sum)
}

/*
bug: todo (- 100) will return 100
*/
export function sub(node :AstNode, env :Env) :AstNode {
	let ret  = 0
	let first = true
	for (let x = 1; x < node.vec.length; x++) {
		const param = node.vec[x]
		const nodeVal = Eval(param, env)
		if (nodeVal.nodeType ==NodeType. NodeTypeNum ){
			if (first) {
				ret = nodeVal.nval
				first = false
			} else {
				ret -= nodeVal.nval
			}
		} else {
			panic("+ operand can only be number")
		}
	}
	return new NumberNode(ret)
}

export function mul(node :AstNode, env :Env) :AstNode {

	let  ret  = 1
	for (let x = 1; x < node.vec.length; x++) {
		const param = node.vec[x]
		const nodeVal = Eval(param, env)
		if (nodeVal.nodeType ==NodeType. NodeTypeNum) {
			ret *= nodeVal.nval
		} else {
			panic("+ operand can only be number")
		}

	}
	return new NumberNode(ret) 
}

export function div(node :AstNode, env :Env) :AstNode {

	let ret = 0
	let first = true
	for (let x = 1; x < node.vec.length; x++) {
		const param = node.vec[x]
		const nodeVal = Eval(param, env)
		if (nodeVal.nodeType ==NodeType. NodeTypeNum) {
			if (first) {
				ret = nodeVal.nval
				first = false
			} else {
				ret /= nodeVal.nval
			}
		} else {
			panic("+ operand can only be number")
		}
	}
	return new NumberNode(ret)
}

export function compare(node :AstNode, env :Env, op :string): boolean {
	if (node.vec.length != 3) {
		panic("compare syntax failed")
	}
	const v1 = Eval(el(node, 1), env)
	const v2 = Eval(el(node, 2), env)

	//only number can compare
	if (v1.nodeType ==NodeType. NodeTypeNum && v2.nodeType == NodeType. NodeTypeNum) {

		const ret = v1.nval - v2.nval
		switch (op ){
		case ">":
			return ret > 0
		case ">=":
			return ret >= 0
		case "<":
			return ret < 0
		case "<=":
			return ret <= 0
		case "=":
			return ret == 0
		case "!=":
			return ret != 0
		}
	}
	panic("only number can be compared")

}
