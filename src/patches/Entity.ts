import { PatchAction, PatchAction_AddEntityData, PatchAction_AddEventConnectionData, PatchAction_AddInputCopyConnectionData, PatchAction_AddOutputCopyConnectionData, PatchAction_AddPropertyData, PatchAction_RemoveEventConnectionData, PatchAction_RemoveInputCopyConnectionData, PatchAction_RemoveSubsetData, PatchAction_SetBlueprintData, PatchAction_SetFactoryData, PatchAction_SetFactoryFlagData, PatchAction_SetNameData, PatchAction_SetParentData, PatchAction_SetPropertyPostInitData, PatchAction_SetPropertyTypeData, PatchAction_SetPropertyValueData } from './PatchActions.js'
import { QNPatch } from './QNPatch.js'
import { ICreateChildEntity, IEntity, IProperty, TRef } from '../types.js'
import { deepEnsureID, ensureID, generateRandomEntityID, generateRandomEntityName } from '../utils/entities.js'

export class Entity {
  constructor(
    private patch: QNPatch,
    private _id: string
  ) {}

  public get id() {
    return this._id
  }

  public addEvent(event: PatchAction_AddEventConnectionData): this {
    if(event.on instanceof Array) {
      event.on = event.on.map(x => x instanceof Entity ? x.id : x)
    }
    if(event.on instanceof Entity) {
      event.on = event.on.id
    }

    this.patch.addPatch(PatchAction.ADD_EVENT_CONNECTION, { ...event, target: this._id })
    return this
  }

  public addProperty(name: string, property: IProperty): this {
    this.patch.addPatch<PatchAction_AddPropertyData>(PatchAction.ADD_PROPERTY, { name, property, target: this._id })
    return this
  }
  public setPropertyValue(name: string, value: any): this {
    this.patch.addPatch<PatchAction_SetPropertyValueData>(PatchAction.SET_PROPERTY_VALUE, { name, value, target: this._id })
    return this
  }
  public setPropertyType(name: string, type: string): this {
    this.patch.addPatch<PatchAction_SetPropertyTypeData>(PatchAction.SET_PROPERTY_TYPE, { name, type, target: this._id })
    return this
  }
  public setPropertyPostinit(name: string, postInit: boolean): this {
    this.patch.addPatch<PatchAction_SetPropertyPostInitData>(PatchAction.SET_PROPERTY_POSTINIT, { name, postInit, target: this._id })
    return this
  }

  public setName(name: string): this {
    this.patch.addPatch<PatchAction_SetNameData>(PatchAction.SET_NAME, { name, target: this._id })
    return this
  }
  public setParent(parent: string): this {
    this.patch.addPatch<PatchAction_SetParentData>(PatchAction.SET_PARENT, { parent, target: this._id })
    return this
  }
  public setFactory(factory: string): this {
    this.patch.addPatch<PatchAction_SetFactoryData>(PatchAction.SET_FACTORY, { factory, target: this._id })
    return this
  }
  public setFactoryFlag(flag: string): this {
    this.patch.addPatch<PatchAction_SetFactoryFlagData>(PatchAction.SET_FACTORY_FLAG, { flag, target: this._id })
    return this
  }
  public setBlueprint(blueprint: string): this {
    this.patch.addPatch<PatchAction_SetBlueprintData>(PatchAction.SET_BLUEPRINT, { blueprint, target: this._id })
    return this
  }
  public removeEventConnection(data: PatchAction_RemoveEventConnectionData): this {
    this.patch.addPatch(PatchAction.REMOVE_EVENT_CONNECTION, { ...data, target: this._id })
    return this
  }
  public addInputCopyConnection(data: PatchAction_AddInputCopyConnectionData): this {
    this.patch.addPatch(PatchAction.ADD_INPUT_COPY_CONNECTION, { ...data, target: this._id })
    return this
  }
  public removeSubset(data: PatchAction_RemoveSubsetData): this {
    this.patch.addPatch(PatchAction.REMOVE_SUBSET, { ...data, target: this._id })
    return this
  }
  public removeInputCopyConnection(data: PatchAction_RemoveInputCopyConnectionData): this {
    this.patch.addPatch(PatchAction.REMOVE_INPUT_COPY_CONNECTION, { ...data, target: this._id })
    return this
  }
  public removePropertyByName(name: string): this {
    this.patch.addPatch(PatchAction.REMOVE_PROPERTY_BY_NAME, { name, target: this._id })
    return this
  }
  public addOutputCopyConnection(data: PatchAction_AddOutputCopyConnectionData): this {
    this.patch.addPatch(PatchAction.ADD_OUTPUT_COPY_CONNECTION, { data, target: this._id })
    return this
  }

  public addChild(entityConfig: ICreateChildEntity): Entity {
    // Replace all entity class refs with their respective ids
    entityConfig.events = Object.fromEntries(
      Object.entries(entityConfig.events ?? {})
        .map(inpin => [inpin[0], Object.fromEntries(Object.entries(inpin[1] ?? {})
          .map(outpin => [outpin[0], outpin[1]?.map(out => out instanceof Entity ? out.id : out)])
        )])
    )

    const parent = entityConfig.parent ?? this._id
    const name = entityConfig.name ?? generateRandomEntityName()
    const id = entityConfig.id ?? generateRandomEntityID()
    const entity = new Entity(this.patch, id)

    this.patch.addPatch<PatchAction_AddEntityData>(PatchAction.ADD_ENTITY, { ...entityConfig, name, id, parent })

    return entity
  }

  public getConstantBool(value: boolean): Entity {
    if(value) {
      const id = this.patch.__constants.BOOL_TRUE
      if(!id) {
        return this.addChild({
          name: 'Constant TRUE',
          factory: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entitytype',
          blueprint: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entityblueprint',
          properties: {
            m_bValue: {
              type: 'bool',
              value: true
            }
          }
        })
      }
      return new Entity(this.patch, id)
    } else {
      const id = this.patch.__constants.BOOL_FALSE
      if(!id) {
        return this.addChild({
          name: 'Constant FALSE',
          factory: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entitytype',
          blueprint: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entityblueprint',
          properties: {
            m_bValue: {
              type: 'bool',
              value: false
            }
          }
        })
      }
      return new Entity(this.patch, id)
    }
  }

  public getConstantInt(value: number): Entity {
    const id = this.patch.__constants.INTS[value]
    if(!id) {
      return this.addChild({
        name: `Constant ${value}`,
        factory: '[modules:/zvalueint_basic.class].pc_entitytype',
        blueprint: '[modules:/zvalueint_basic.class].pc_entityblueprint',
        properties: {
          m_nValue: {
            type: 'int32',
            value
          }
        }
      })
    }
    return new Entity(this.patch, id)
  }

  public addInt(value: number, name = 'Int ' + generateRandomEntityName()) {
    return this.addChild({
      name,
      factory: '[modules:/zvalueint_basic.class].pc_entitytype',
      blueprint: '[modules:/zvalueint_basic.class].pc_entityblueprint',
      properties: {
        m_nValue: {
          type: 'int32',
          value
        }
      }
    })
  }

  public addBool(value: boolean, name = 'Bool ' + generateRandomEntityName()) {
    return this.addChild({
      name,
      factory: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entitytype',
      blueprint: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entityblueprint',
      properties: {
        m_bValue: {
          type: 'bool',
          value
        }
      }
    })
  }

  public addTimer(timeMS: number, outputs: {[key: string]: TRef[]}, name = 'Timer ' + generateRandomEntityName()) {
    return this.addChild({
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
        Out: Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, value.map(x => ensureID(x))]))
      }
    })
  }
}
