import { CommonPaths, getClassPath } from '../../lib.js'
import { IEventTriggers } from '../../types.js'
import { scope } from '../../utils/common.js'
import { buildJSON } from '../../utils/json.js'
import { Entity } from './base.js'

export interface IConditionalEventTriggers {
  condition: Entity | string
  triggers: IEventTriggers
}

declare module './_index.js' {
  interface Entity {
    randomAction(options: (IEventTriggers | IConditionalEventTriggers)[]): Entity
  }
}

Entity.prototype.randomAction = function(options) {
  const root = (this as Entity).addChild({
    ...CommonPaths.Entity
  })

  const optionEntities = options.map(option => {
    const isConditional = scope(option as IConditionalEventTriggers, [x => x.hasOwnProperty('condition'), x => x.hasOwnProperty('triggers')]).allTrue
    return root.addChild({
        ...getClassPath('RandomSelectorChoice'),
        properties:
          buildJSON({})
            .addIf(isConditional, {
              m_Condition: {
                type: 'SEntityTemplateReference',
                value: (option as IConditionalEventTriggers).condition,
                postInit: true
              }
            })
            .build(),
        events: {
          OnPicked: buildJSON({})
            .addIf(isConditional, (option as IConditionalEventTriggers).triggers)
            .addIf(!isConditional, option)
            .build()
        }
    })
  })

  return root.addChild({
    ...getClassPath('RandomSelector'),
    properties: {
      m_Seed: {
        type: 'SEntityTemplateReference',
        value: "null"
      },
      m_Choices: {
        type: 'TArray<SEntityTemplateReference>',
        value: optionEntities
      }
    }
  })
}
