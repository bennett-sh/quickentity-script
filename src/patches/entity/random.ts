import { CommonPaths, getClassPath } from '../../lib.js'
import { ICreateChildEntity, IEventTriggers } from '../../types.js'
import { scope } from '../../utils/common.js'
import { buildJSON } from '../../utils/json.js'
import { PatchEntity } from './base.js'

export interface IPatchConditionalEventTriggers {
  condition: PatchEntity | string
  triggers: IEventTriggers
}

declare module './_index.js' {
  interface PatchEntity {
    randomAction(
      actions: (IEventTriggers | IPatchConditionalEventTriggers)[],
      options?: Partial<{
        root: Partial<ICreateChildEntity>,
        selector: Partial<ICreateChildEntity>,
        action: Partial<ICreateChildEntity>
      }>
    ): PatchEntity;
  }
}

PatchEntity.prototype.randomAction = function(actions, options = {}) {
  const root = (this as PatchEntity).addChild({
    ...CommonPaths.Entity,
    ...options.root
  })

  const optionEntities = actions.map(option => {
    const isConditional = scope(option as IPatchConditionalEventTriggers, [x => x.hasOwnProperty('condition'), x => x.hasOwnProperty('triggers')]).allTrue
    return root.addChild({
        ...getClassPath('RandomSelectorChoice'),
        ...options.action,
        properties:
          buildJSON(options.action?.properties ?? {})
            .addIf(isConditional, {
              m_Condition: {
                type: 'SEntityTemplateReference',
                value: (option as IPatchConditionalEventTriggers).condition,
                postInit: true
              }
            })
            .build(),
        events: {
          ...options.action?.events,
          OnPicked: buildJSON(options.action?.events?.OnPicked ?? {})
            .addIf(isConditional, (option as IPatchConditionalEventTriggers).triggers)
            .addIf(!isConditional, option)
            .build(),
        }
    })
  })

  return root.addChild({
    ...getClassPath('RandomSelector'),
    ...options.selector,
    properties: {
      m_Seed: {
        type: 'SEntityTemplateReference',
        value: "null"
      },
      m_Choices: {
        type: 'TArray<SEntityTemplateReference>',
        value: optionEntities
      },
      ...options.selector?.properties
    }
  })
}
