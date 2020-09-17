import AstNode from './ast'
export default class Env {
  private data: Map<string, AstNode>
  private up: Env | undefined

  constructor(up: Env|undefined) {

    this.data = new Map<string, AstNode>()
    this.up = up

  }
  find(varName: string): AstNode | undefined {
    const val = this.data.get(varName)
    if (val === undefined && this.up !== undefined) {
      return this.up.find(varName)
    }
    return val
  }

  setq(varName: string, val: AstNode):void {
    this.data.set(varName, val)
  }

  getUpEnv() : Env | undefined {
    return this.up
  }
}

