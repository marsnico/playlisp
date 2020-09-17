import * as fs from 'fs'

export function loadFile(filepath :string) :string {
  const code = fs.readFileSync(filepath, 'utf-8')
	return code
}
