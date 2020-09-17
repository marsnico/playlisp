"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var module_1 = require("./module");
function main() {
    console.log("golisp v0.0.2 by nicolasxiao");
    console.log();
    var fileName = "./tests/base.scm";
    if (process.argv.length > 2) {
        fileName = process.argv[2];
    }
    module_1.RunModule(".", fileName);
    //nolisp.LoadWrap()
}
main();
