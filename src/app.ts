import { RunModule } from "./module"


function main() {
	console.log("golisp v0.0.2 by nicolasxiao")
	console.log()

	let fileName = "./tests/base.scm"

	if (process.argv.length > 2) {
		fileName = process.argv[2]
	}

	RunModule(".", fileName)

	//nolisp.LoadWrap()

}

main()