"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Env = /** @class */ (function () {
    function Env(up) {
        this.data = new Map();
        this.up = up;
    }
    Env.prototype.find = function (varName) {
        var val = this.data.get(varName);
        if (val === undefined && this.up !== undefined) {
            return this.up.find(varName);
        }
        return val;
    };
    Env.prototype.setq = function (varName, val) {
        this.data.set(varName, val);
    };
    Env.prototype.getUpEnv = function () {
        return this.up;
    };
    return Env;
}());
exports.default = Env;
