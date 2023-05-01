import { ICommentEntity, IEntity, IExposedEntity, IPinConnectionOverride, IPinConnectionOverrideDelete, IProperty, IPropertyAlias, IPropertyOverride, IPropertyOverrideConnection, TArrayPatchOperation, TDependency, TRef, TSubType } from '../types.js'
import { Entity } from './entity/_index.js'

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
  PATCH_ARRAY_PROPERTY_VALUE,
  ADD_SUBSET,
  ADD_PIN_CONNECTION_OVERRIDE,
  ADD_PIN_CONNECTION_OVERRIDE_DELETE,
  REMOVE_PIN_CONNECTION_OVERRIDE,
  REMOVE_PIN_CONNECTION_OVERRIDE_DELETE,
  SET_EXPOSED_INTERFACE,
  REMOVE_EXPOSED_INTERFACE,
  SET_EXPOSED_ENTITY,
  REMOVE_EXPOSED_ENTITY,
  REMOVE_PROPERTY_ALIAS,
  ADD_PROPERTY_ALIAS_CONNECTION,
  REMOVE_CONNECTION_FOR_PROPERTY_ALIAS,
  SET_EDITOR_ONLY,
  REMOVE_ALL_SUBSETS_FOR,
  REMOVE_ALL_EVENT_CONNECTIONS_FOR_TRIGGER,
  REMOVE_ALL_EVENT_CONNECTIONS_FOR_EVENT,
  REMOVE_ALL_INPUT_COPY_CONNECTIONS_FOR_INPUT,
  REMOVE_ALL_INPUT_COPY_CONNECTIONS_FOR_TRIGGER,
  REMOVE_OUTPUT_COPY_CONNECTION,
  REMOVE_ALL_OUTPUT_COPY_CONNECTIONS_FOR_PROPAGATE,
  REMOVE_ALL_OUTPUT_COPY_CONNECTIONS_FOR_OUTPUT,

  ADD_COMMENT,
  REMOVE_COMMENT,

  CUSTOM_PATCH
}

interface ISubEntityOperation {
  target?: string
}

export type PatchAction_CustomPatch = {[key: string]: any}

export type PatchAction_AddCommentData = ICommentEntity
export type PatchAction_RemoveCommentData = ICommentEntity
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

export interface PatchAction_RemoveAllOutputCopyConnectionsForPropagate extends ISubEntityOperation { a: string, b: string }
export interface PatchAction_RemoveAllOutputCopyConnectionsForOutput extends ISubEntityOperation { a: string }
export interface PatchAction_RemoveOutputCopyConnectionData extends ISubEntityOperation { a: string, b: string, to: TRef }
export interface PatchAction_RemoveAllInputCopyConnectionsForTriggerData extends ISubEntityOperation { a: string, b: string }
export interface PatchAction_RemoveAllInputCopyConnectionsForInputData extends ISubEntityOperation { input: string }
export interface PatchAction_RemoveAllEventConnectionsForTriggerData extends ISubEntityOperation { a: string, b: string }
export interface PatchAction_RemoveAllEventConnectionsForEventData extends ISubEntityOperation { event: string }
export interface PatchAction_RemoveAllSubsetsForData extends ISubEntityOperation { forThing: string }
export interface PatchAction_SetEditorOnlyData extends ISubEntityOperation { editorOnly: boolean }
export interface PatchAction_AddPropertyAliasConnectionData extends ISubEntityOperation { name: string, alias: IPropertyAlias }
export interface PatchAction_RemovePropertyAliasData extends ISubEntityOperation { name: string }
export interface PatchAction_RemoveConnectionForPropertyAliasData extends ISubEntityOperation { name: string, alias: IPropertyAlias }
export interface PatchAction_SetExposedInterfaceData extends ISubEntityOperation { name: string, inf: string }
export interface PatchAction_RemoveExposedInterfaceData extends ISubEntityOperation { name: string }
export interface PatchAction_SetExposedEntityData extends ISubEntityOperation { name: string, entity: IExposedEntity }
export interface PatchAction_RemoveExposedEntityData extends ISubEntityOperation { name: string }
export interface PatchAction_AddPinConnectionOverrideData extends ISubEntityOperation { override: IPinConnectionOverride }
export interface PatchAction_RemovePinConnectionOverrideData extends ISubEntityOperation { override: IPinConnectionOverride }
export interface PatchAction_AddPinConnectionOverrideDeleteData extends ISubEntityOperation { override: IPinConnectionOverrideDelete }
export interface PatchAction_RemovePinConnectionOverrideDeleteData extends ISubEntityOperation { override: IPinConnectionOverrideDelete }
export interface PatchAction_RemovePropertyByNameData extends ISubEntityOperation { name: string }
export interface PatchAction_RemoveEventConnectionData extends ISubEntityOperation {
  when:      string
  do:        string
  on:        string | Entity | (string | Entity)[]
}
export interface PatchAction_RemoveInputCopyConnectionData extends ISubEntityOperation {
  a:        string
  b:        string
  to:       TRef
}
export interface PatchAction_AddInputCopyConnectionData extends ISubEntityOperation {
  a:   string,
  b:   string,
  to:  TRef
}
export interface PatchAction_AddOutputCopyConnectionData extends ISubEntityOperation {
  a:   string,
  b:   string,
  to:  TRef
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
  parent: TRef
}
export interface PatchAction_AddEventConnectionData extends ISubEntityOperation {
  when:      string
  do:        string
  on:        TRef | TRef[]
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
export interface PatchAction_RemovePSPropertiesForPlatformData extends ISubEntityOperation {
  platform:  string
}
export interface PatchAction_PatchPSArrayPropertyValueData extends ISubEntityOperation {
  platform:    string
  name:        string
  operations:  TArrayPatchOperation[]
}
export interface PatchAction_PatchArrayPropertyValueData extends ISubEntityOperation {
  name:        string
  operations:  TArrayPatchOperation[]
}
export interface PatchAction_AddSubsetData extends ISubEntityOperation {
  a:  string
  b:  string
}
