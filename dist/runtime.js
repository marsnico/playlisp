"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval = exports.nilp = exports.el = void 0;
var ast_1 = require("./ast");
var utils_1 = require("./utils");
var lambda_1 = require("./lambda");
var preload_1 = require("./preload");
var module_1 = require("./module");
function el(node, n) {
    if (node.nodeType == ast_1.NodeType.NodeTypeVec && n < (node.vec.length)) {
        return node.vec[n];
    }
    utils_1.panic("el: out of range");
}
exports.el = el;
function elExt(node, env) {
    var theNode = Eval(el(node, 1), env);
    var nth = Eval(el(node, 2), env);
    if (numberp(nth)) {
        return el(theNode, Math.floor(nth.nval));
    }
    utils_1.panic("el require a numberic index");
}
function numberp(n) {
    return n.nodeType == ast_1.NodeType.NodeTypeNum;
}
function nilp(node) {
    return node.nodeType == ast_1.NodeType.NodeTypeVec && node.vec.length == 0;
}
exports.nilp = nilp;
function symbolp(node, sym) {
    return node.nodeType == ast_1.NodeType.NodeTypeSym && node.sval == sym;
}
function progn(node, env) {
    var lastVal = undefined;
    for (var x = 1; x < node.vec.length; x++) {
        var param = node.vec[x];
        lastVal = Eval(param, env);
    }
    if (!lastVal) {
        utils_1.panic("progn require at lease one form");
    }
    return lastVal;
}
function define(node, env) {
    var varName = el(node, 1);
    var varVal = Eval(el(node, 2), env);
    env.setq(varName.sval, varVal);
    return new ast_1.VecNode();
}
function print(node, env) {
    var strs = [];
    for (var x = 1; x < node.vec.length; x++) {
        var param = node.vec[x];
        strs.push(stringify(Eval(param, env)));
    }
    var ret = strs.join(" ");
    console.log(ret);
    return new ast_1.LiteralNode(ret);
}
function list(node, env) {
    var nodes = [];
    for (var x = 1; x < node.vec.length; x++) {
        var param = node.vec[x];
        nodes.push(Eval(param, env));
    }
    var ret = new ast_1.VecNode(nodes);
    return ret;
}
function stringify(node) {
    switch (node.nodeType) {
        case ast_1.NodeType.NodeTypeTrue:
            return "true";
        case ast_1.NodeType.NodeTypeFalse:
            return "false";
        case ast_1.NodeType.NodeTypeNum:
            return '' + node.nval;
        case ast_1.NodeType.NodeTypeSym:
            return "`" + node.sval + "`";
        case ast_1.NodeType.NodeTypeLiteral:
            return node.sval;
        case ast_1.NodeType.NodeTypeVec:
            // todo print cons has bug
            if (nilp(node)) {
                return "nil";
            }
            else {
                var strs = [];
                for (var x = 0; x < node.vec.length; x++) {
                    var param = node.vec[x];
                    strs.push(stringify(param));
                }
                return "(" + strs.join(" ") + ")";
            }
        case ast_1.NodeType.NodeTypeLambda:
            return "<lambda>";
    }
    //todo
    return "<unsupport>";
}
function toBool(node) {
    switch (node.nodeType) {
        case ast_1.NodeType.NodeTypeTrue:
            return true;
        case ast_1.NodeType.NodeTypeFalse:
            return false;
        case ast_1.NodeType.NodeTypeNum:
            return node.nval != 0;
        case ast_1.NodeType.NodeTypeSym:
            return true;
        case ast_1.NodeType.NodeTypeLiteral:
            return node.sval != "";
        case ast_1.NodeType.NodeTypeVec:
            return !nilp(node);
        case ast_1.NodeType.NodeTypeLambda:
            return true;
    }
    //todo
    utils_1.panic("tobool error");
    return false;
}
function ifform(node, env) {
    // (if con true-part false-part)
    if (node.vec.length != 4) {
        utils_1.panic("if syntax error");
    }
    var cond = Eval(el(node, 1), env);
    var truePart = el(node, 2);
    var falsePart = el(node, 3);
    if (toBool(cond)) {
        return Eval(truePart, env);
    }
    else {
        return Eval(falsePart, env);
    }
}
function loopForm(node, env) {
    if (node.vec.length < 3) {
        utils_1.panic("loop syntax error");
    }
    var cond = el(node, 1);
    var lastValue = new ast_1.VecNode();
    while (toBool(Eval(cond, env))) {
        for (var _i = 0, _a = node.vec.slice(2); _i < _a.length; _i++) {
            var n = _a[_i];
            lastValue = Eval(n, env);
        }
    }
    return lastValue;
}
function mem(node, env) {
    if (node.vec.length != 3) {
        utils_1.panic(". op error");
    }
    var rec = Eval(el(node, 1), env);
    var field = el(node, 2);
    if (rec.nodeType != ast_1.NodeType.NodeTypeRecord || field.nodeType != ast_1.NodeType.NodeTypeSym) {
        utils_1.panic(". op require rec and sym");
    }
    var retNode = rec.rec.get(field.sval);
    if (retNode) {
        return retNode;
    }
    else {
        utils_1.panic("mem not found");
    }
}
function Eval(node, env) {
    switch (node.nodeType) {
        case ast_1.NodeType.NodeTypeTrue, ast_1.NodeType.NodeTypeFalse, ast_1.NodeType.NodeTypeNum:
            return node;
        case ast_1.NodeType.NodeTypeLiteral:
            return node;
        case ast_1.NodeType.NodeTypeLambda:
            return node;
        case ast_1.NodeType.NodeTypeSym:
            {
                var val = env.find(node.sval);
                if (val) {
                    return val;
                }
                else {
                    utils_1.panic("undefined var:" + node.sval);
                }
            }
            break;
        case ast_1.NodeType.NodeTypeVec:
            {
                if (nilp(node)) {
                    utils_1.panic("cannot eval empty node");
                }
                var firstEl = el(node, 0);
                // temporary implementation
                if (firstEl.nodeType == ast_1.NodeType.NodeTypeSym) {
                    switch (firstEl.sval) {
                        case "do":
                            return progn(node, env);
                        case "let":
                            return define(node, env);
                        case "print":
                            return print(node, env);
                        case "el":
                            return elExt(node, env);
                        case "quote":
                            return el(node, 1);
                        case "list":
                            return list(node, env);
                        case "fn":
                            return lambda_1.defLambda(node, env);
                        case "+":
                            return preload_1.add(node, env);
                        case "-":
                            return preload_1.sub(node, env);
                        case "*":
                            return preload_1.mul(node, env);
                        case "/":
                            return preload_1.div(node, env);
                        case "if":
                            return ifform(node, env);
                        case "loop":
                            return loopForm(node, env);
                        case ">":
                        case ">=":
                        case "<":
                        case "<=":
                        case "=":
                        case "!=":
                            {
                                var ret = preload_1.compare(node, env, firstEl.sval);
                                if (ret) {
                                    return new ast_1.TrueNode();
                                }
                                return new ast_1.FalseNode();
                            }
                        case "module":
                            return module_1.defineModule(node, env);
                        case "import":
                            return module_1.importModule(node, env);
                        case "export":
                            return module_1.exportFn(node, env);
                        case ".":
                            return mem(node, env);
                    }
                }
                var lambdaNode = Eval(firstEl, env);
                if (lambdaNode.nodeType == ast_1.NodeType.NodeTypeLambda) {
                    return lambda_1.callLambda(lambdaNode, node.vec.slice(1), env);
                }
                else {
                    utils_1.panic("not callable");
                }
            }
    }
    utils_1.panic("not support yet");
}
exports.Eval = Eval;
