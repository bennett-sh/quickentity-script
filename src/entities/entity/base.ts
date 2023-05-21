import { getClassPath, getPath } from '../../lib.js'
import type { PatchAction_AddEventConnectionData } from '../../patches/PatchActions.js'
import type { ICreateChildEntity, IEntityNoID, IEventTriggers, IQNEntity } from '../../types.js'
import { generateRandomEntityID, generateRandomEntityName, outputsToEvent } from '../../utils/entities.js'
import { deepMerge } from '../../utils/json.js'
import { QNEntity } from '../QNEntity.js'

export class Entity {
  constructor(
    private entity: QNEntity,
    private _id: string
  ) {}

  public get id() {
    return this._id
  }

  public get data() {
    return this.entity.__data.entities[this._id]
  }

  public set data(data: IEntityNoID) {
    this.entity.__data.entities[this._id] = data
  }

  public set(data: Partial<IEntityNoID>): void {
    this.data = deepMerge(data, this.data)
  }

  public getEntity(id: string) {
    return new Entity(this.entity, id)
  }

  public addChild(entityConfig: ICreateChildEntity): Entity {
    return this.entity.addEntity({ ...entityConfig, parent: this._id })
  }

  public addEvent(data: PatchAction_AddEventConnectionData): Entity {
    this.set({ events: { [data.when]: { [data.do]: data.on } } })
    return this
  }

  public addInt(value: number, entityConfig: Partial<ICreateChildEntity> = {}) {
    let { name } = entityConfig
    if(!name) name = 'Int ' + generateRandomEntityName()
    return this.addChild({
      name,
      ...getClassPath('ValueInt_Basic'),
      properties: {
        m_nValue: {
          type: 'int32',
          value
        }
      }
    })
  }

  public addBool(value: boolean, entityConfig: Partial<ICreateChildEntity> = {}) {
    let { name } = entityConfig
    if(!name) name = 'Bool ' + generateRandomEntityName()
    return this.addChild({
      name,
      ...getPath('[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate]'),
      properties: {
        m_bValue: {
          type: 'bool',
          value
        }
      }
    })
  }

  public addTimer(timeMS: number, outputs: IEventTriggers, recursive = false, entityConfig: Partial<ICreateChildEntity> = {}) {
    let { name, id } = entityConfig
    if(!name) name = 'Bool ' + generateRandomEntityName()
    if(!id) id = generateRandomEntityID()
    return this.addChild({
      id,
      name,
      factory: '[assembly:/_pro/design/logic.template?/timersimple.entitytemplate].pc_entitytype',
      blueprint: '[assembly:/_pro/design/logic.template?/timersimple.entitytemplate].pc_entityblueprint',
      properties: {
        'Delay time (ms)': {
          type: 'int32',
          value: timeMS
        },
        m_bEnabled: {
          type: 'bool',
          value: true
        }
      },
      events: {
        Out: {
          ...outputsToEvent(outputs),
          In: recursive ? id : []
        }
      }
    })
  }
}
