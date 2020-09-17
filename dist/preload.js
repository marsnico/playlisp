"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.div = exports.mul = exports.sub = exports.add = void 0;
var ast_1 = require("./ast");
var utils_1 = require("./utils");
var runtime_1 = require("./runtime");
function add(node, env) {
    var sum = 0;
    for (var x = 1; x < node.vec.length; x++) {
        var param = node.vec[x];
        var nodeVal = runtime_1.Eval(param, env);
        if (nodeVal.nodeType == ast_1.NodeType.NodeTypeNum) {
            sum += nodeVal.nval;
        }
        else {
            utils_1.panic("+ operand can only be number");
        }
    }
    return new ast_1.NumberNode(sum);
}
exports.add = add;
/*
bug: todo (- 100) will return 100
*/
function sub(node, env) {
    var ret = 0;
    var first = true;
    for (var x = 1; x < node.vec.length; x++) {
        var param = node.vec[x];
        var nodeVal = runtime_1.Eval(param, env);
        if (nodeVal.nodeType == ast_1.NodeType.NodeTypeNum) {
            if (first) {
                ret = nodeVal.nval;
                first = false;
            }
            else {
                ret -= nodeVal.nval;
            }
        }
        else {
            utils_1.panic("+ operand can only be number");
        }
    }
    return new ast_1.NumberNode(ret);
}
exports.sub = sub;
function mul(node, env) {
    var ret = 1;
    for (var x = 1; x < node.vec.length; x++) {
        var param = node.vec[x];
        var nodeVal = runtime_1.Eval(param, env);
        if (nodeVal.nodeType == ast_1.NodeType.NodeTypeNum) {
            ret *= nodeVal.nval;
        }
        else {
            utils_1.panic("+ operand can only be number");
        }
    }
    return new ast_1.NumberNode(ret);
}
exports.mul = mul;
function div(node, env) {
    var ret = 0;
    var first = true;
    for (var x = 1; x < node.vec.length; x++) {
        var param = node.vec[x];
        var nodeVal = runtime_1.Eval(param, env);
        if (nodeVal.nodeType == ast_1.NodeType.NodeTypeNum) {
            if (first) {
                ret = nodeVal.nval;
                first = false;
            }
            else {
                ret /= nodeVal.nval;
            }
        }
        else {
            utils_1.panic("+ operand can only be number");
        }
    }
    return new ast_1.NumberNode(ret);
}
exports.div = div;
function compare(node, env, op) {
    if (node.vec.length != 3) {
        utils_1.panic("compare syntax failed");
    }
    var v1 = runtime_1.Eval(runtime_1.el(node, 1), env);
    var v2 = runtime_1.Eval(runtime_1.el(node, 2), env);
    //only number can compare
    if (v1.nodeType == ast_1.NodeType.NodeTypeNum && v2.nodeType == ast_1.NodeType.NodeTypeNum) {
        var ret = v1.nval - v2.nval;
        switch (op) {
            case ">":
                return ret > 0;
            case ">=":
                return ret >= 0;
            case "<":
                return ret < 0;
            case "<=":
                return ret <= 0;
            case "=":
                return ret == 0;
            case "!=":
                return ret != 0;
        }
    }
    utils_1.panic("only number can be compared");
}
exports.compare = compare;
