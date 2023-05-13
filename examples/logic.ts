
import { createPatch } from '../src/lib.js'

async function main() {
  const patch = createPatch(
    '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entitytype',
    '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entityblueprint'
  )

  const entity = patch.addEntity({ parent: '', factory: '', blueprint: '' });

  entity.if('OnValue', {
    Pick: entity.randomAction([
      {
        SetTrue: entity
      },
      {
        SetFalse: entity
      }
    ])
  })

  await patch.save('./example.entity.patch.json')
}

main()
