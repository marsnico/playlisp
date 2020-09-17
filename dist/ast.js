"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralNode = exports.NumberNode = exports.SymbolNode = exports.FalseNode = exports.TrueNode = exports.RecordNode = exports.VecNode = exports.LambdaNode = exports.NodeType = void 0;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["NodeTypeVec"] = 0] = "NodeTypeVec";
    NodeType[NodeType["NodeTypeNum"] = 1] = "NodeTypeNum";
    NodeType[NodeType["NodeTypeLiteral"] = 2] = "NodeTypeLiteral";
    NodeType[NodeType["NodeTypeSym"] = 3] = "NodeTypeSym";
    NodeType[NodeType["NodeTypeLambda"] = 4] = "NodeTypeLambda";
    NodeType[NodeType["NodeTypeTrue"] = 5] = "NodeTypeTrue";
    NodeType[NodeType["NodeTypeFalse"] = 6] = "NodeTypeFalse";
    NodeType[NodeType["NodeTypeRecord"] = 7] = "NodeTypeRecord";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
var AstNode = /** @class */ (function () {
    function AstNode() {
        this.nodeType = NodeType.NodeTypeVec;
        this.sval = '';
        this.nval = 0;
        this.vec = [];
        this.rec = new Map();
        this.upper = undefined;
    }
    return AstNode;
}());
exports.default = AstNode;
var LambdaNode = /** @class */ (function (_super) {
    __extends(LambdaNode, _super);
    function LambdaNode(args, up) {
        if (args === void 0) { args = []; }
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeLambda;
        _this.vec = args;
        _this.upper = up;
        return _this;
    }
    return LambdaNode;
}(AstNode));
exports.LambdaNode = LambdaNode;
var VecNode = /** @class */ (function (_super) {
    __extends(VecNode, _super);
    function VecNode(vec) {
        if (vec === void 0) { vec = []; }
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeVec;
        _this.vec = vec;
        return _this;
    }
    return VecNode;
}(AstNode));
exports.VecNode = VecNode;
var RecordNode = /** @class */ (function (_super) {
    __extends(RecordNode, _super);
    function RecordNode(rec) {
        if (rec === void 0) { rec = new Map(); }
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeRecord;
        _this.rec = rec;
        return _this;
    }
    return RecordNode;
}(AstNode));
exports.RecordNode = RecordNode;
var TrueNode = /** @class */ (function (_super) {
    __extends(TrueNode, _super);
    function TrueNode() {
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeTrue;
        return _this;
    }
    return TrueNode;
}(AstNode));
exports.TrueNode = TrueNode;
var FalseNode = /** @class */ (function (_super) {
    __extends(FalseNode, _super);
    function FalseNode() {
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeFalse;
        return _this;
    }
    return FalseNode;
}(AstNode));
exports.FalseNode = FalseNode;
var SymbolNode = /** @class */ (function (_super) {
    __extends(SymbolNode, _super);
    function SymbolNode(sym) {
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeSym;
        _this.sval = sym;
        return _this;
    }
    return SymbolNode;
}(AstNode));
exports.SymbolNode = SymbolNode;
var NumberNode = /** @class */ (function (_super) {
    __extends(NumberNode, _super);
    function NumberNode(num) {
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeNum;
        _this.nval = num;
        return _this;
    }
    return NumberNode;
}(AstNode));
exports.NumberNode = NumberNode;
var LiteralNode = /** @class */ (function (_super) {
    __extends(LiteralNode, _super);
    function LiteralNode(lit) {
        var _this = _super.call(this) || this;
        _this.nodeType = NodeType.NodeTypeLiteral;
        _this.sval = lit;
        return _this;
    }
    return LiteralNode;
}(AstNode));
exports.LiteralNode = LiteralNode;
