import { IEntity, IProperty, IPropertyOverride, IPropertyOverrideConnection, TArrayPatchOperation, TDependency, TRef, TSubType } from '../types.js'
import { Entity } from './Entity.js'

export enum PatchAction {
  ADD_OVERRIDE_DELETE,
  REMOVE_OVERRIDE_DELETE,
  ADD_ENTITY,
  ADD_EVENT_CONNECTION,
  ADD_INPUT_COPY_CONNECTION,
  ADD_PROPERTY,
  SET_PROPERTY_VALUE,
  SET_PROPERTY_TYPE,
  SET_PROPERTY_POSTINIT,
  SET_ROOT_ENTITY,
  SET_SUB_TYPE,
  SET_NAME,
  SET_PARENT,
  SET_FACTORY,
  SET_FACTORY_FLAG,
  SET_BLUEPRINT,
  REMOVE_EVENT_CONNECTION,
  REMOVE_INPUT_COPY_CONNECTION,
  REMOVE_ENTITY_BY_ID,
  REMOVE_SUBSET,
  REMOVE_EXTRA_BLUEPRINT_DEPENDENCY,
  ADD_EXTRA_BLUEPRINT_DEPENDENCY,
  REMOVE_EXTRA_FACTORY_DEPENDENCY,
  ADD_EXTRA_FACTORY_DEPENDENCY,
  ADD_EXTERNAL_SCENE,
  REMOVE_EXTERNAL_SCENE,
  ADD_PROPERTY_OVERRIDE,
  REMOVE_PROPERTY_OVERRIDE,
  ADD_PROPERTY_OVERRIDE_CONNECTION,
  REMOVE_PROPERTY_OVERRIDE_CONNECTION,
  REMOVE_PROPERTY_BY_NAME,
  ADD_OUTPUT_COPY_CONNECTION,
  SET_PLATFORM_SPECIFIC_PROPERTY_TYPE,
  SET_PLATFORM_SPECIFIC_PROPERTY_VALUE,
  SET_PLATFORM_SPECIFIC_PROPERTY_POSTINIT,
  ADD_PLATFORM_SPECIFIC_PROPERTY,
  REMOVE_PLATFORM_SPECIFIC_PROPERTY_BY_NAME,
  REMOVE_PLATFORM_SPECIFIC_PROPERTIES_FOR_PLATFORM,
  PATCH_PLATFORM_SPECIFIC_ARRAY_PROPERTY_VALUE,

  CUSTOM_PATCH
}

interface ISubEntityOperation {
  target?: string
}

export type PatchAction_CustomPatch = {[key: string]: any}

export type PatchAction_AddOverrideDeleteData = TRef | TRef[]
export type PatchAction_RemoveOverrideDeleteData = TRef | TRef[]
export type PatchAction_AddPropertyOverrideData = IPropertyOverride
export type PatchAction_RemovePropertyOverrideData = IPropertyOverride
export type PatchAction_AddPropertyOverrideConnectionData = IPropertyOverrideConnection
export type PatchAction_RemovePropertyOverrideConnectionData = IPropertyOverrideConnection
export type PatchAction_AddExternalSceneData = string
export type PatchAction_RemoveExternalSceneData = string
export type PatchAction_AddExtraBlueprintDependencyData = TDependency
export type PatchAction_RemoveExtraBlueprintDependencyData = TDependency
export type PatchAction_AddExtraFactoryDependencyData = TDependency
export type PatchAction_RemoveExtraFactoryDependencyData = TDependency
export type PatchAction_AddEntityData = IEntity
export type PatchAction_SetSubTypeData = TSubType
export type PatchAction_SetRootEntityData = string | Entity
export type PatchAction_RemoveEntityByIDData = string | Entity

export interface PatchAction_RemovePropertyByNameData extends ISubEntityOperation { name: string }
export interface PatchAction_RemoveEventConnectionData extends ISubEntityOperation {
  when:      string
  do:        string
  on:        string | Entity | (string | Entity)[]
}
export interface PatchAction_RemoveInputCopyConnectionData extends ISubEntityOperation {
  a:        string
  b:        string
  to:       string | Entity
}
export interface PatchAction_AddInputCopyConnectionData extends ISubEntityOperation {
  a:   string,
  b:   string,
  to:  string | Entity
}
export interface PatchAction_AddOutputCopyConnectionData extends ISubEntityOperation {
  a:   string,
  b:   string,
  to:  string | Entity
}
export interface PatchAction_RemoveSubsetData extends ISubEntityOperation {
  a: string,
  b: string
}
export interface PatchAction_SetNameData extends ISubEntityOperation {
  name: string
}
export interface PatchAction_SetFactoryData extends ISubEntityOperation {
  factory: string
}
export interface PatchAction_SetFactoryFlagData extends ISubEntityOperation {
  flag: string
}
export interface PatchAction_SetBlueprintData extends ISubEntityOperation {
  blueprint: string
}
export interface PatchAction_SetParentData extends ISubEntityOperation {
  parent: string
}
export interface PatchAction_AddEventConnectionData extends ISubEntityOperation {
  when:      string
  do:        string
  on:        string | Entity | (string | Entity)[]
}
export interface PatchAction_AddPropertyData extends ISubEntityOperation {
  name:      string
  property:  IProperty
}
export interface PatchAction_SetPropertyValueData extends ISubEntityOperation {
  name:      string
  value:     any
}
export interface PatchAction_SetPropertyTypeData extends ISubEntityOperation {
  name:      string
  type:      string
}
export interface PatchAction_SetPropertyPostInitData extends ISubEntityOperation {
  name:      string
  postInit:  boolean
}
export interface PatchAction_AddPSPropertyData extends ISubEntityOperation {
  platform:  string
  name:      string
  property:  IProperty
}
export interface PatchAction_SetPSPropertyValueData extends ISubEntityOperation {
  platform:  string
  name:      string
  value:     any
}
export interface PatchAction_SetPSPropertyTypeData extends ISubEntityOperation {
  platform:  string
  name:      string
  type:      string
}
export interface PatchAction_SetPSPropertyPostInitData extends ISubEntityOperation {
  platform:  string
  name:      string
  postInit:  boolean
}
export interface PatchAction_RemovePSPropertyByNameData extends ISubEntityOperation {
  platform:  string
  name:      string
}
export interface PatchAction_RemovePSPropertiesForPlatform extends ISubEntityOperation {
  platform:  string
}
export interface PatchAction_PatchPSArrayPropertyValue extends ISubEntityOperation {
  platform:    string
  name:        string
  operations:  TArrayPatchOperation[]
}
