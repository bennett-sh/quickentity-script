
import { createPatch, CommonPaths } from '../src/lib.js'

async function main() {
  const patch = createPatch(CommonPaths.Agent47_Default)

  const entity = patch.addEntity({ parent: '', factory: '', blueprint: '' });

  console.log(`

TRUE: ${entity.getConstantBool(true).id}
FALSE: ${entity.getConstantBool(false).id}
0: ${entity.getConstantInt(0).id}
1: ${entity.getConstantInt(1).id}

`.trim())
}

main()
