import AstNode, { NodeType, LambdaNode, VecNode } from "./ast"
import Env from "./env"
import { panic } from "./utils"
import { Eval } from "./runtime"


//fixme define a lambda should remember its syntax upper scope
export function defLambda(node :AstNode, env :Env) :AstNode {
	//el 1 is args
	//el 2.. is body
	if (node.vec.length < 3 || node.vec[1].nodeType != NodeType. NodeTypeVec) {
		panic("lambda define error")
	}

	return new LambdaNode(node.vec.slice(1), env)
}

export function callLambda(lambda :AstNode, params :AstNode[], callEnv :Env) :AstNode {
	const paramValues :AstNode[]=[]
	for (const p of params) {
		paramValues.push( Eval(p, callEnv))
	}

	//pass params
	const localEnv = new Env(lambda.upper)
	const paramNames = lambda.vec[0]
	if (paramNames.nodeType ==NodeType. NodeTypeVec) {
		const valueLen = paramValues.length
		paramNames.vec.forEach((pnNode, idx) => {
			if (pnNode.nodeType ==NodeType. NodeTypeSym) {
				if (idx < valueLen) {
					localEnv.setq(pnNode.sval, paramValues[idx])
				} else {
					localEnv.setq(pnNode.sval, new VecNode())
				}

			} else {
				panic("lambda param name must be symbol")
			}
		})
	} else {
		panic("lambda param list must be symbol list")
	}
	let lastValue = new VecNode()
	for (const stmt of lambda.vec.slice(1)) {
		lastValue = Eval(stmt, localEnv)
	}
	return lastValue
}
