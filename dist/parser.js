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
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = __importStar(require("./lexer"));
var ast_1 = require("./ast");
var utils_1 = require("./utils");
var Parser = /** @class */ (function () {
    function Parser(source) {
        this.lexer = undefined;
        this.lexer = new lexer_1.default(source);
        this.lexer.NextToken();
    }
    Parser.prototype.Parse = function () {
        return this.ParseForm();
    };
    Parser.prototype.ParseForm = function () {
        var _a, _b;
        switch ((_a = this.lexer) === null || _a === void 0 ? void 0 : _a.getTokenType()) {
            case lexer_1.TokenType.TTIDEN:
                {
                    var node = undefined;
                    switch (this.lexer.getToken()) {
                        case "true":
                            node = new ast_1.TrueNode();
                            break;
                        case "false":
                            node = new ast_1.FalseNode();
                            break;
                        default:
                            node = new ast_1.SymbolNode(this.lexer.getToken());
                    }
                    this.lexer.NextToken();
                    return node;
                }
            case lexer_1.TokenType.TTNUM:
                {
                    var num = parseFloat(this.lexer.getToken());
                    if (isNaN(num)) {
                        utils_1.panic('' + num + 'is not a number');
                    }
                    var node = new ast_1.NumberNode(num);
                    this.lexer.NextToken();
                    return node;
                }
            case lexer_1.TokenType.TTLITERAL:
                {
                    var node = new ast_1.LiteralNode(this.lexer.getToken());
                    this.lexer.NextToken();
                    return node;
                }
            case lexer_1.TokenType.TTLBRK:
                return this.ParseSExpr();
            case lexer_1.TokenType.TTLB:
                return this.ParseVec();
            case lexer_1.TokenType.TTQUOTE:
                {
                    this.lexer.NextToken();
                    var quoteNode = this.ParseForm();
                    var nodes = [];
                    nodes.push(new ast_1.SymbolNode('quote'));
                    if (quoteNode !== undefined) {
                        nodes.push(quoteNode);
                    }
                    else {
                        utils_1.panic("internal error quote");
                    }
                    return new ast_1.VecNode(nodes);
                }
            default:
                utils_1.panic("unknown token:" + ((_b = this.lexer) === null || _b === void 0 ? void 0 : _b.getToken));
        }
    };
    Parser.prototype.ParseSExpr = function () {
        var _a;
        if (((_a = this.lexer) === null || _a === void 0 ? void 0 : _a.getTokenType()) == lexer_1.TokenType.TTLBRK) {
            this.lexer.NextToken();
            var nodes = [];
            while (this.lexer.getTokenType() != lexer_1.TokenType.TTEOF && this.lexer.getTokenType() != lexer_1.TokenType.TTRBRK) {
                var node = this.ParseForm();
                if (node) {
                    nodes.push(node);
                }
            }
            var cdrNode = new ast_1.VecNode(nodes);
            if (this.lexer.getTokenType() == lexer_1.TokenType.TTRBRK) {
                this.lexer.NextToken();
                return cdrNode;
            }
            else {
                utils_1.panic("require )");
            }
        }
        else {
            // error
            utils_1.panic("require (");
        }
    };
    Parser.prototype.ParseVec = function () {
        var _a;
        if (((_a = this.lexer) === null || _a === void 0 ? void 0 : _a.getTokenType()) == lexer_1.TokenType.TTLB) {
            this.lexer.NextToken();
            var nodes = [];
            nodes.push(new ast_1.SymbolNode('list'));
            while (this.lexer.getTokenType() != lexer_1.TokenType.TTEOF && this.lexer.getTokenType() != lexer_1.TokenType.TTRB) {
                var node = this.ParseForm();
                if (node !== undefined) {
                    nodes.push(node);
                }
            }
            var vecExp = new ast_1.VecNode(nodes);
            if (this.lexer.getTokenType() == lexer_1.TokenType.TTRB) {
                this.lexer.NextToken();
                return vecExp;
            }
            else {
                utils_1.panic("require ]");
            }
        }
        else {
            // error
            utils_1.panic("require [");
        }
    };
    return Parser;
}());
exports.default = Parser;
