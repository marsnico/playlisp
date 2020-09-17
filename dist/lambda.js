"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLambda = exports.defLambda = void 0;
var ast_1 = require("./ast");
var env_1 = __importDefault(require("./env"));
var utils_1 = require("./utils");
var runtime_1 = require("./runtime");
//fixme define a lambda should remember its syntax upper scope
function defLambda(node, env) {
    //el 1 is args
    //el 2.. is body
    if (node.vec.length < 3 || node.vec[1].nodeType != ast_1.NodeType.NodeTypeVec) {
        utils_1.panic("lambda define error");
    }
    return new ast_1.LambdaNode(node.vec.slice(1), env);
}
exports.defLambda = defLambda;
function callLambda(lambda, params, callEnv) {
    var paramValues = [];
    for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
        var p = params_1[_i];
        paramValues.push(runtime_1.Eval(p, callEnv));
    }
    //pass params
    var localEnv = new env_1.default(lambda.upper);
    var paramNames = lambda.vec[0];
    if (paramNames.nodeType == ast_1.NodeType.NodeTypeVec) {
        var valueLen_1 = paramValues.length;
        paramNames.vec.forEach(function (pnNode, idx) {
            if (pnNode.nodeType == ast_1.NodeType.NodeTypeSym) {
                if (idx < valueLen_1) {
                    localEnv.setq(pnNode.sval, paramValues[idx]);
                }
                else {
                    localEnv.setq(pnNode.sval, new ast_1.VecNode());
                }
            }
            else {
                utils_1.panic("lambda param name must be symbol");
            }
        });
    }
    else {
        utils_1.panic("lambda param list must be symbol list");
    }
    var lastValue = new ast_1.VecNode();
    for (var _a = 0, _b = lambda.vec.slice(1); _a < _b.length; _a++) {
        var stmt = _b[_a];
        lastValue = runtime_1.Eval(stmt, localEnv);
    }
    return lastValue;
}
exports.callLambda = callLambda;
