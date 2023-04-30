import { PatchAction, PatchAction_AddEntityData, PatchAction_AddEventConnectionData, PatchAction_AddInputCopyConnectionData, PatchAction_AddOutputCopyConnectionData, PatchAction_AddPSPropertyData, PatchAction_AddPinConnectionOverrideData, PatchAction_AddPinConnectionOverrideDeleteData, PatchAction_AddPropertyAliasConnectionData, PatchAction_AddPropertyData, PatchAction_AddSubsetData, PatchAction_PatchArrayPropertyValueData, PatchAction_PatchPSArrayPropertyValueData, PatchAction_RemoveConnectionForPropertyAliasData, PatchAction_RemoveEventConnectionData, PatchAction_RemoveExposedEntityData, PatchAction_RemoveExposedInterfaceData, PatchAction_RemoveInputCopyConnectionData, PatchAction_RemovePSPropertiesForPlatformData, PatchAction_RemovePSPropertyByNameData as PatchAction_RemovePSPropertyByNameData, PatchAction_RemovePinConnectionOverrideData, PatchAction_RemovePinConnectionOverrideDeleteData, PatchAction_RemovePropertyAliasData, PatchAction_RemoveSubsetData, PatchAction_SetBlueprintData, PatchAction_SetEditorOnlyData, PatchAction_SetExposedEntityData, PatchAction_SetExposedInterfaceData, PatchAction_SetFactoryData, PatchAction_SetFactoryFlagData, PatchAction_SetNameData, PatchAction_SetPSPropertyPostInitData, PatchAction_SetPSPropertyTypeData, PatchAction_SetPSPropertyValueData, PatchAction_SetParentData, PatchAction_SetPropertyPostInitData, PatchAction_SetPropertyTypeData, PatchAction_SetPropertyValueData } from './PatchActions.js'
import { QNPatch } from './QNPatch.js'
import { ICreateChildEntity, IEntity, IExposedEntity, IPinConnectionOverride, IPinConnectionOverrideDelete, IProperty, IPropertyAlias, TArrayPatchOperation, TRef } from '../types.js'
import { deepEnsureID, ensureID, generateRandomEntityID, generateRandomEntityName } from '../utils/entities.js'

const outputsToEvent = (outputs: {[key: string]: TRef[]}) => Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, value.map(x => ensureID(x))]))

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
  public patchArrayPropertyValue(name: string, operations: TArrayPatchOperation[]): this {
    this.patch.addPatch<PatchAction_PatchArrayPropertyValueData>(PatchAction.PATCH_ARRAY_PROPERTY_VALUE, { name, operations, target: this._id })
    return this
  }

  public addPlatformSpecificProperty(platform: string, name: string, property: IProperty): this {
    this.patch.addPatch<PatchAction_AddPSPropertyData>(PatchAction.ADD_PLATFORM_SPECIFIC_PROPERTY, { name, platform, property, target: this._id })
    return this
  }
  public setPlatformSpecificPropertyValue(platform: string, name: string, value: any): this {
    this.patch.addPatch<PatchAction_SetPSPropertyValueData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_VALUE, { name, platform, value, target: this._id })
    return this
  }
  public setPlatformSpecificPropertyType(platform: string, name: string, type: string): this {
    this.patch.addPatch<PatchAction_SetPSPropertyTypeData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_TYPE, { name, platform, type, target: this._id })
    return this
  }
  public setPlatformSpecificPropertyPostinit(platform: string, name: string, postInit: boolean): this {
    this.patch.addPatch<PatchAction_SetPSPropertyPostInitData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_POSTINIT, { name, platform, postInit, target: this._id })
    return this
  }
  public removePlatformSpecficPropertyByName(platform: string, name: string): this {
    this.patch.addPatch<PatchAction_RemovePSPropertyByNameData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_POSTINIT, { name, platform, target: this._id })
    return this
  }
  public removePlatformSpecficPropertiesForPlatform(platform: string): this {
    this.patch.addPatch<PatchAction_RemovePSPropertiesForPlatformData>(PatchAction.REMOVE_PLATFORM_SPECIFIC_PROPERTIES_FOR_PLATFORM, { platform, target: this._id })
    return this
  }
  public patchPlatformSpecificArrayPropertyValue(platform: string, name: string, operations: TArrayPatchOperation[]): this {
    this.patch.addPatch<PatchAction_PatchPSArrayPropertyValueData>(PatchAction.PATCH_PLATFORM_SPECIFIC_ARRAY_PROPERTY_VALUE, { platform, name, operations, target: this._id })
    return this
  }

  public setEditorOnly(editorOnly: boolean): this {
    this.patch.addPatch<PatchAction_SetEditorOnlyData>(PatchAction.SET_EDITOR_ONLY, { editorOnly, target: this.id })
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
  public addSubset(a: string, b: string): this {
    this.patch.addPatch<PatchAction_AddSubsetData>(PatchAction.ADD_SUBSET, { a, b, target: this._id })
    return this
  }
  public addPropertyAliasConnection(name: string, alias: IPropertyAlias): this {
    this.patch.addPatch<PatchAction_AddPropertyAliasConnectionData>(PatchAction.ADD_PROPERTY_ALIAS_CONNECTION, { name, alias, target: this._id })
    return this
  }
  public removePropertyAlias(name: string): this {
    this.patch.addPatch<PatchAction_RemovePropertyAliasData>(PatchAction.REMOVE_PROPERTY_ALIAS, { name, target: this._id })
    return this
  }
  public removeConnectionForPropertyAlias(name: string, alias: IPropertyAlias): this {
    this.patch.addPatch<PatchAction_RemoveConnectionForPropertyAliasData>(PatchAction.REMOVE_CONNECTION_FOR_PROPERTY_ALIAS, { name, alias, target: this._id })
    return this
  }
  public setExposedEntity(name: string, entity: IExposedEntity): this {
    this.patch.addPatch<PatchAction_SetExposedEntityData>(PatchAction.SET_EXPOSED_ENTITY, { name, entity, target: this._id })
    return this
  }
  public removeExposedEntity(name: string): this {
    this.patch.addPatch<PatchAction_RemoveExposedEntityData>(PatchAction.REMOVE_EXPOSED_ENTITY, { name, target: this._id })
    return this
  }
  public setExposedInterface(name: string, inf: string): this {
    this.patch.addPatch<PatchAction_SetExposedInterfaceData>(PatchAction.SET_EXPOSED_INTERFACE, { name, inf, target: this._id })
    return this
  }
  public removeExposedInterface(name: string): this {
    this.patch.addPatch<PatchAction_RemoveExposedInterfaceData>(PatchAction.REMOVE_EXPOSED_INTERFACE, { name, target: this._id })
    return this
  }
  public addPinConnectionOverride(override: IPinConnectionOverride): this {
    this.patch.addPatch<PatchAction_AddPinConnectionOverrideData>(PatchAction.ADD_PIN_CONNECTION_OVERRIDE, { override, target: this._id })
    return this
  }
  public removePinConnectionOverride(override: IPinConnectionOverride): this {
    this.patch.addPatch<PatchAction_RemovePinConnectionOverrideData>(PatchAction.REMOVE_PIN_CONNECTION_OVERRIDE, { override, target: this._id })
    return this
  }
  public addPinConnectionOverrideDelete(override: IPinConnectionOverrideDelete): this {
    this.patch.addPatch<PatchAction_AddPinConnectionOverrideDeleteData>(PatchAction.ADD_PIN_CONNECTION_OVERRIDE_DELETE, { override, target: this._id })
    return this
  }
  public removePinConnectionOverrideDelete(override: IPinConnectionOverrideDelete): this {
    this.patch.addPatch<PatchAction_RemovePinConnectionOverrideDeleteData>(PatchAction.REMOVE_PIN_CONNECTION_OVERRIDE_DELETE, { override, target: this._id })
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
        Out: outputsToEvent(outputs)
      }
    })
  }

  public addToConstantNumber(when: string, add: number, outputs: {[key: string]: TRef[]}): Entity {
    const addEntity = this.addChild({
      factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
      blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
      properties: {
        m_fA: {
          type: 'float32',
          value: add
        },
        m_bSubtract: {
          type: 'bool',
          value: false
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when, do: 'B', on: addEntity })

    return addEntity
  }

  public addToVariableNumber(whenA: string, whenB: string, b: TRef, outputs: {[key: string]: TRef[]}): Entity {
    const addEntity = this.addChild({
      factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
      blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
      properties: {
        m_bSubtract: {
          type: 'bool',
          value: false
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when: whenA, do: 'A', on: addEntity })
    this.addEvent({ when: whenB, do: 'B', on: addEntity })

    return addEntity
  }

  public subtractFromConstantNumber(when: string, add: number, outputs: {[key: string]: TRef[]}): Entity {
    const addEntity = this.addChild({
      factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
      blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
      properties: {
        m_fA: {
          type: 'float32',
          value: add
        },
        m_bSubtract: {
          type: 'bool',
          value: true
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when, do: 'B', on: addEntity })

    return addEntity
  }

  public subtractFromVariableNumber(whenA: string, whenB: string, b: TRef, outputs: {[key: string]: TRef[]}): Entity {
    const addEntity = this.addChild({
      factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
      blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
      properties: {
        m_bSubtract: {
          type: 'bool',
          value: true
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when: whenA, do: 'A', on: addEntity })
    this.addEvent({ when: whenB, do: 'B', on: addEntity })

    return addEntity
  }

  public multiplyWithConstantNumber(when: string, mul: number, outputs: {[key: string]: TRef[]}): Entity {
    const mulEntity = this.addChild({
      factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
      blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
      properties: {
        m_fA: {
          type: 'float32',
          value: mul
        },
        m_bDivide: {
          type: 'bool',
          value: false
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when, do: 'B', on: mulEntity })

    return mulEntity
  }

  public mutiplyWithVariableNumber(whenA: string, whenB: string, b: TRef, outputs: {[key: string]: TRef[]}): Entity {
    const mulEntity = this.addChild({
      factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
      blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
      properties: {
        m_bDivide: {
          type: 'bool',
          value: false
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when: whenA, do: 'A', on: mulEntity })
    this.addEvent({ when: whenB, do: 'B', on: mulEntity })

    return mulEntity
  }

  public divideByConstantNumber(when: string, div: number, outputs: {[key: string]: TRef[]}): Entity {
    const divEntity = this.addChild({
      factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
      blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
      properties: {
        m_fA: {
          type: 'float32',
          value: div
        },
        m_bDivide: {
          type: 'bool',
          value: true
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when, do: 'B', on: divEntity })

    return divEntity
  }

  public divideByVariableNumber(whenA: string, whenB: string, b: TRef, outputs: {[key: string]: TRef[]}): Entity {
    const divEntity = this.addChild({
      factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
      blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
      properties: {
        m_bDivide: {
          type: 'bool',
          value: true
        }
      },
      events: {
        Out: outputsToEvent(outputs)
      }
    })

    this.addEvent({ when: whenA, do: 'A', on: divEntity })
    this.addEvent({ when: whenB, do: 'B', on: divEntity })

    return divEntity
  }
}
