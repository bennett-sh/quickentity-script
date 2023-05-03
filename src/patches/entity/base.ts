import { PatchAction, PatchAction_AddCommentData, PatchAction_AddEntityData, PatchAction_AddEventConnectionData, PatchAction_AddInputCopyConnectionData, PatchAction_AddOutputCopyConnectionData, PatchAction_AddPSPropertyData, PatchAction_AddPinConnectionOverrideData, PatchAction_AddPinConnectionOverrideDeleteData, PatchAction_AddPropertyAliasConnectionData, PatchAction_AddPropertyData, PatchAction_AddSubsetData, PatchAction_PatchArrayPropertyValueData, PatchAction_PatchPSArrayPropertyValueData, PatchAction_RemoveAllEventConnectionsForEventData, PatchAction_RemoveAllEventConnectionsForTriggerData, PatchAction_RemoveAllInputCopyConnectionsForInputData, PatchAction_RemoveAllInputCopyConnectionsForTriggerData, PatchAction_RemoveAllOutputCopyConnectionsForOutput, PatchAction_RemoveAllOutputCopyConnectionsForPropagate, PatchAction_RemoveAllSubsetsForData, PatchAction_RemoveCommentData, PatchAction_RemoveConnectionForPropertyAliasData, PatchAction_RemoveEventConnectionData, PatchAction_RemoveExposedEntityData, PatchAction_RemoveExposedInterfaceData, PatchAction_RemoveInputCopyConnectionData, PatchAction_RemoveOutputCopyConnectionData, PatchAction_RemovePSPropertiesForPlatformData, PatchAction_RemovePSPropertyByNameData as PatchAction_RemovePSPropertyByNameData, PatchAction_RemovePinConnectionOverrideData, PatchAction_RemovePinConnectionOverrideDeleteData, PatchAction_RemovePropertyAliasData, PatchAction_RemoveSubsetData, PatchAction_SetBlueprintData, PatchAction_SetEditorOnlyData, PatchAction_SetExposedEntityData, PatchAction_SetExposedInterfaceData, PatchAction_SetFactoryData, PatchAction_SetFactoryFlagData, PatchAction_SetNameData, PatchAction_SetPSPropertyPostInitData, PatchAction_SetPSPropertyTypeData, PatchAction_SetPSPropertyValueData, PatchAction_SetParentData, PatchAction_SetPropertyPostInitData, PatchAction_SetPropertyTypeData, PatchAction_SetPropertyValueData } from '../PatchActions.js'
import { ICreateChildEntity, IExposedEntity, IPinConnectionOverride, IPinConnectionOverrideDelete, IProperty, IPropertyAlias, TArrayPatchOperation, TRef } from '../../types.js'
import { ensureEventIDs, generateRandomEntityID, generateRandomEntityName, outputsToEvent } from '../../utils/entities.js'
import { QNPatch } from '../QNPatch.js'

export class Entity {
  constructor(
    private patch: QNPatch,
    private _id: string
  ) {}

  public get id() {
    return this._id
  }

  public addEvent(event: PatchAction_AddEventConnectionData): Entity {
    if(event.on instanceof Array) {
      event.on = event.on.map(x => x instanceof Entity ? x.id : x)
    }
    if(event.on instanceof Entity) {
      event.on = event.on.id
    }

    this.patch.addPatch(PatchAction.ADD_EVENT_CONNECTION, { ...event, target: this._id })
    return this
  }

  public addProperty(name: string, property: IProperty): Entity {
    this.patch.addPatch<PatchAction_AddPropertyData>(PatchAction.ADD_PROPERTY, { name, property, target: this._id })
    return this
  }
  public setPropertyValue(name: string, value: any): Entity {
    this.patch.addPatch<PatchAction_SetPropertyValueData>(PatchAction.SET_PROPERTY_VALUE, { name, value, target: this._id })
    return this
  }
  public setPropertyType(name: string, type: string): Entity {
    this.patch.addPatch<PatchAction_SetPropertyTypeData>(PatchAction.SET_PROPERTY_TYPE, { name, type, target: this._id })
    return this
  }
  public setPropertyPostinit(name: string, postInit: boolean): Entity {
    this.patch.addPatch<PatchAction_SetPropertyPostInitData>(PatchAction.SET_PROPERTY_POSTINIT, { name, postInit, target: this._id })
    return this
  }
  public patchArrayPropertyValue(name: string, operations: TArrayPatchOperation[]): Entity {
    this.patch.addPatch<PatchAction_PatchArrayPropertyValueData>(PatchAction.PATCH_ARRAY_PROPERTY_VALUE, { name, operations, target: this._id })
    return this
  }

  public removeAllOutputCopyConnectionsForPropagate(a: string, b: string): Entity {
    this.patch.addPatch<PatchAction_RemoveAllOutputCopyConnectionsForPropagate>(PatchAction.REMOVE_ALL_OUTPUT_COPY_CONNECTIONS_FOR_PROPAGATE, { a, b, target: this._id })
    return this
  }
  public removeAllOutputCopyConnectionsForOutput(a: string): Entity {
    this.patch.addPatch<PatchAction_RemoveAllOutputCopyConnectionsForOutput>(PatchAction.REMOVE_ALL_OUTPUT_COPY_CONNECTIONS_FOR_OUTPUT, { a, target: this._id })
    return this
  }
  public addPlatformSpecificProperty(platform: string, name: string, property: IProperty): Entity {
    this.patch.addPatch<PatchAction_AddPSPropertyData>(PatchAction.ADD_PLATFORM_SPECIFIC_PROPERTY, { name, platform, property, target: this._id })
    return this
  }
  public setPlatformSpecificPropertyValue(platform: string, name: string, value: any): Entity {
    this.patch.addPatch<PatchAction_SetPSPropertyValueData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_VALUE, { name, platform, value, target: this._id })
    return this
  }
  public setPlatformSpecificPropertyType(platform: string, name: string, type: string): Entity {
    this.patch.addPatch<PatchAction_SetPSPropertyTypeData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_TYPE, { name, platform, type, target: this._id })
    return this
  }
  public setPlatformSpecificPropertyPostinit(platform: string, name: string, postInit: boolean): Entity {
    this.patch.addPatch<PatchAction_SetPSPropertyPostInitData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_POSTINIT, { name, platform, postInit, target: this._id })
    return this
  }
  public removePlatformSpecficPropertyByName(platform: string, name: string): Entity {
    this.patch.addPatch<PatchAction_RemovePSPropertyByNameData>(PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_POSTINIT, { name, platform, target: this._id })
    return this
  }
  public removePlatformSpecficPropertiesForPlatform(platform: string): Entity {
    this.patch.addPatch<PatchAction_RemovePSPropertiesForPlatformData>(PatchAction.REMOVE_PLATFORM_SPECIFIC_PROPERTIES_FOR_PLATFORM, { platform, target: this._id })
    return this
  }
  public patchPlatformSpecificArrayPropertyValue(platform: string, name: string, operations: TArrayPatchOperation[]): Entity {
    this.patch.addPatch<PatchAction_PatchPSArrayPropertyValueData>(PatchAction.PATCH_PLATFORM_SPECIFIC_ARRAY_PROPERTY_VALUE, { platform, name, operations, target: this._id })
    return this
  }

  public removeOutputCopyConnection(a: string, b: string, to: TRef): Entity {
    this.patch.addPatch<PatchAction_RemoveOutputCopyConnectionData>(PatchAction.REMOVE_OUTPUT_COPY_CONNECTION, { a, b, to, target: this._id })
    return this
  }
  public removeAllInputCopyConnectionsForTrigger(a: string, b: string): Entity {
    this.patch.addPatch<PatchAction_RemoveAllInputCopyConnectionsForTriggerData>(PatchAction.REMOVE_ALL_INPUT_COPY_CONNECTIONS_FOR_TRIGGER, { a, b, target: this._id })
    return this
  }
  public removeAllInputCopyConnectionsForInput(input: string): Entity {
    this.patch.addPatch<PatchAction_RemoveAllInputCopyConnectionsForInputData>(PatchAction.REMOVE_ALL_INPUT_COPY_CONNECTIONS_FOR_INPUT, { input, target: this._id })
    return this
  }
  public removeAllEventConnectionsForTrigger(a: string, b: string): Entity {
    this.patch.addPatch<PatchAction_RemoveAllEventConnectionsForTriggerData>(PatchAction.REMOVE_ALL_EVENT_CONNECTIONS_FOR_TRIGGER, { a, b, target: this._id })
    return this
  }
  public removeAllEventConnectionsForEvent(event: string): Entity {
    this.patch.addPatch<PatchAction_RemoveAllEventConnectionsForEventData>(PatchAction.REMOVE_ALL_EVENT_CONNECTIONS_FOR_EVENT, { event, target: this._id })
    return this
  }
  public removeAllSubsetsFor(forThing: string): Entity {
    this.patch.addPatch<PatchAction_RemoveAllSubsetsForData>(PatchAction.REMOVE_ALL_SUBSETS_FOR, { forThing, target: this._id })
    return this
  }
  public setEditorOnly(editorOnly: boolean): Entity {
    this.patch.addPatch<PatchAction_SetEditorOnlyData>(PatchAction.SET_EDITOR_ONLY, { editorOnly, target: this._id })
    return this
  }
  public setName(name: string): Entity {
    this.patch.addPatch<PatchAction_SetNameData>(PatchAction.SET_NAME, { name, target: this._id })
    return this
  }
  public setParent(parent: TRef): Entity {
    this.patch.addPatch<PatchAction_SetParentData>(PatchAction.SET_PARENT, { parent, target: this._id })
    return this
  }
  public setFactory(factory: string): Entity {
    this.patch.addPatch<PatchAction_SetFactoryData>(PatchAction.SET_FACTORY, { factory, target: this._id })
    return this
  }
  public setFactoryFlag(flag: string): Entity {
    this.patch.addPatch<PatchAction_SetFactoryFlagData>(PatchAction.SET_FACTORY_FLAG, { flag, target: this._id })
    return this
  }
  public setBlueprint(blueprint: string): Entity {
    this.patch.addPatch<PatchAction_SetBlueprintData>(PatchAction.SET_BLUEPRINT, { blueprint, target: this._id })
    return this
  }
  public addSubset(a: string, b: string): Entity {
    this.patch.addPatch<PatchAction_AddSubsetData>(PatchAction.ADD_SUBSET, { a, b, target: this._id })
    return this
  }
  public addPropertyAliasConnection(name: string, alias: IPropertyAlias): Entity {
    this.patch.addPatch<PatchAction_AddPropertyAliasConnectionData>(PatchAction.ADD_PROPERTY_ALIAS_CONNECTION, { name, alias, target: this._id })
    return this
  }
  public removePropertyAlias(name: string): Entity {
    this.patch.addPatch<PatchAction_RemovePropertyAliasData>(PatchAction.REMOVE_PROPERTY_ALIAS, { name, target: this._id })
    return this
  }
  public removeConnectionForPropertyAlias(name: string, alias: IPropertyAlias): Entity {
    this.patch.addPatch<PatchAction_RemoveConnectionForPropertyAliasData>(PatchAction.REMOVE_CONNECTION_FOR_PROPERTY_ALIAS, { name, alias, target: this._id })
    return this
  }
  public setExposedEntity(name: string, entity: IExposedEntity): Entity {
    this.patch.addPatch<PatchAction_SetExposedEntityData>(PatchAction.SET_EXPOSED_ENTITY, { name, entity, target: this._id })
    return this
  }
  public removeExposedEntity(name: string): Entity {
    this.patch.addPatch<PatchAction_RemoveExposedEntityData>(PatchAction.REMOVE_EXPOSED_ENTITY, { name, target: this._id })
    return this
  }
  public setExposedInterface(name: string, inf: string): Entity {
    this.patch.addPatch<PatchAction_SetExposedInterfaceData>(PatchAction.SET_EXPOSED_INTERFACE, { name, inf, target: this._id })
    return this
  }
  public removeExposedInterface(name: string): Entity {
    this.patch.addPatch<PatchAction_RemoveExposedInterfaceData>(PatchAction.REMOVE_EXPOSED_INTERFACE, { name, target: this._id })
    return this
  }
  public addPinConnectionOverride(override: IPinConnectionOverride): Entity {
    this.patch.addPatch<PatchAction_AddPinConnectionOverrideData>(PatchAction.ADD_PIN_CONNECTION_OVERRIDE, { override, target: this._id })
    return this
  }
  public removePinConnectionOverride(override: IPinConnectionOverride): Entity {
    this.patch.addPatch<PatchAction_RemovePinConnectionOverrideData>(PatchAction.REMOVE_PIN_CONNECTION_OVERRIDE, { override, target: this._id })
    return this
  }
  public addPinConnectionOverrideDelete(override: IPinConnectionOverrideDelete): Entity {
    this.patch.addPatch<PatchAction_AddPinConnectionOverrideDeleteData>(PatchAction.ADD_PIN_CONNECTION_OVERRIDE_DELETE, { override, target: this._id })
    return this
  }
  public removePinConnectionOverrideDelete(override: IPinConnectionOverrideDelete): Entity {
    this.patch.addPatch<PatchAction_RemovePinConnectionOverrideDeleteData>(PatchAction.REMOVE_PIN_CONNECTION_OVERRIDE_DELETE, { override, target: this._id })
    return this
  }
  public removeEventConnection(data: PatchAction_RemoveEventConnectionData): Entity {
    this.patch.addPatch(PatchAction.REMOVE_EVENT_CONNECTION, { ...data, target: this._id })
    return this
  }
  public addInputCopyConnection(data: PatchAction_AddInputCopyConnectionData): Entity {
    this.patch.addPatch(PatchAction.ADD_INPUT_COPY_CONNECTION, { ...data, target: this._id })
    return this
  }
  public removeSubset(data: PatchAction_RemoveSubsetData): Entity {
    this.patch.addPatch(PatchAction.REMOVE_SUBSET, { ...data, target: this._id })
    return this
  }
  public removeInputCopyConnection(data: PatchAction_RemoveInputCopyConnectionData): Entity {
    this.patch.addPatch(PatchAction.REMOVE_INPUT_COPY_CONNECTION, { ...data, target: this._id })
    return this
  }
  public removePropertyByName(name: string): Entity {
    this.patch.addPatch(PatchAction.REMOVE_PROPERTY_BY_NAME, { name, target: this._id })
    return this
  }
  public addOutputCopyConnection(data: PatchAction_AddOutputCopyConnectionData): Entity {
    this.patch.addPatch(PatchAction.ADD_OUTPUT_COPY_CONNECTION, { data, target: this._id })
    return this
  }

  public addComment(name: string, text: string): Entity {
    this.patch.addPatch<PatchAction_AddCommentData>(PatchAction.ADD_COMMENT, { name, text, parent: this._id })
    return this
  }

  public removeComment(name: string, text: string): Entity {
    this.patch.addPatch<PatchAction_RemoveCommentData>(PatchAction.REMOVE_COMMENT, { name, text, parent: this._id })
    return this
  }

  public addChild(entityConfig: ICreateChildEntity): Entity {
    entityConfig = ensureEventIDs(entityConfig)

    const parent = entityConfig.parent ?? this._id
    const name = entityConfig.name ?? generateRandomEntityName()
    const id = entityConfig.id ?? generateRandomEntityID()
    const entity = new Entity(this.patch, id)

    this.patch.addPatch<PatchAction_AddEntityData>(PatchAction.ADD_ENTITY, { ...entityConfig, name, id, parent })

    return entity
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

  public addTimer(timeMS: number, outputs: {[key: string]: TRef | TRef[]}, recursive = false, name = 'Timer ' + generateRandomEntityName()) {
    const id = generateRandomEntityID()
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
          In: id
        }
      }
    })
  }
}
