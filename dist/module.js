"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportFn = exports.defineModule = exports.importModule = exports.RunModule = void 0;
var ast_1 = require("./ast");
var path = __importStar(require("path"));
var io_1 = require("./io");
var parser_1 = __importDefault(require("./parser"));
var env_1 = __importDefault(require("./env"));
var runtime_1 = require("./runtime");
var utils_1 = require("./utils");
var moduleIndex = "~~@module";
var rootPathIndex = "~~@root";
function RunModule(rootPath, fileName) {
    if (!path.isAbsolute(fileName)) {
        fileName = path.resolve(rootPath, fileName);
    }
    //fmt.Println(fileName)
    var code = io_1.loadFile(fileName);
    var parser = new parser_1.default(code);
    var node = parser.Parse();
    var globalEnv = new env_1.default(undefined);
    globalEnv.setq(rootPathIndex, new ast_1.LiteralNode(path.dirname(fileName)));
    if (!node) {
        utils_1.panic("parse failed");
    }
    runtime_1.Eval(node, globalEnv);
    //export module
    var mod = globalEnv.find(moduleIndex);
    if (mod) {
        return mod;
    }
    else {
        return new ast_1.VecNode();
    }
}
exports.RunModule = RunModule;
function importModule(node, env) {
    if (env.getUpEnv()) {
        utils_1.panic("import module must be root env");
    }
    var rootDir = env.find(rootPathIndex);
    if (!rootDir || rootDir.nodeType != ast_1.NodeType.NodeTypeLiteral) {
        utils_1.panic("internal error: root path");
    }
    var modName = runtime_1.el(node, 1);
    if (modName.nodeType != ast_1.NodeType.NodeTypeSym) {
        utils_1.panic("module name must be symbol");
    }
    var mod = RunModule(rootDir.sval, modName.sval + ".scm");
    if (!runtime_1.nilp(mod)) {
        env.setq(modName.sval, mod);
    }
    else {
        utils_1.panic("load module failed");
    }
    return new ast_1.VecNode();
}
exports.importModule = importModule;
function defineModule(node, env) {
    // must be root env
    if (env.getUpEnv()) {
        utils_1.panic("module must be root env");
    }
    var _mod = env.find(moduleIndex);
    if (_mod) {
        utils_1.panic("only one module in each file");
    }
    // module
    var mod = new ast_1.RecordNode();
    env.setq(moduleIndex, mod);
    for (var _i = 0, _a = node.vec.slice(1); _i < _a.length; _i++) {
        var subNode = _a[_i];
        runtime_1.Eval(subNode, env);
    }
    return new ast_1.VecNode();
}
exports.defineModule = defineModule;
function exportFn(node, env) {
    // must be root env
    if (env.getUpEnv()) {
        utils_1.panic("module must be root env");
    }
    var mod = env.find(moduleIndex);
    if (!mod) {
        utils_1.panic("not in module define");
    }
    var varName = runtime_1.el(node, 1);
    var varVal = runtime_1.Eval(runtime_1.el(node, 2), env);
    mod.rec.set(varName.sval, varVal);
    return new ast_1.VecNode();
}
exports.exportFn = exportFn;
