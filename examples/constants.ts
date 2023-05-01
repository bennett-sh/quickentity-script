
import { createPatch } from '../src/lib.js'

async function main() {
  const patch = createPatch(
    '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entitytype',
    '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entityblueprint'
  )

  const entity = patch.addEntity({ parent: '', factory: '', blueprint: '' });

  console.log(`

TRUE: ${entity.getConstantBool(true).id}
FALSE: ${entity.getConstantBool(false).id}
0: ${entity.getConstantInt(0).id}
1: ${entity.getConstantInt(1).id}

`.trim())
}

main()
