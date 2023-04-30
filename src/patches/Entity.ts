import { PatchAction, PatchAction_AddEventConnectionData, PatchAction_AddInputCopyConnectionData, PatchAction_AddPropertyData, PatchAction_RemoveEventConnectionData, PatchAction_RemoveSubsetData, PatchAction_SetBlueprintData, PatchAction_SetBlueprintFlagData, PatchAction_SetFactoryData, PatchAction_SetFactoryFlagData, PatchAction_SetNameData, PatchAction_SetParentData, PatchAction_SetPropertyPostInitData, PatchAction_SetPropertyTypeData, PatchAction_SetPropertyValueData } from './patchActions.js'
import { QNPatch } from './QNPatch.js'
import { IProperty } from '../types.js'

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
  public setBlueprintFlag(flag: string): this {
    this.patch.addPatch<PatchAction_SetBlueprintFlagData>(PatchAction.SET_BLUEPRINT_FLAG, { flag, target: this._id })
    return this
  }
  public removeEventConnection(event: PatchAction_RemoveEventConnectionData): this {
    this.patch.addPatch(PatchAction.REMOVE_EVENT_CONNECTION, { ...event, target: this._id })
    return this
  }
  public addInputCopyConnection(event: PatchAction_AddInputCopyConnectionData): this {
    this.patch.addPatch(PatchAction.ADD_INPUT_COPY_CONNECTION, { ...event, target: this._id })
    return this
  }
  public removeSubset(event: PatchAction_RemoveSubsetData): this {
    this.patch.addPatch(PatchAction.REMOVE_SUBSET, { ...event, target: this._id })
    return this
  }
}
