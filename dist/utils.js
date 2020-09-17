"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.panic = void 0;
function panic(message) {
    console.error(message);
    process.exit(-1);
}
exports.panic = panic;
