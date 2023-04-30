import { Entity } from './patches/Entity.js'

export type TSubType = 'brick' | 'scene' | 'template'

export type TPropertyType = 'SEntityTemplateReference' | any
export interface ISimpleProperty {
  type:   TPropertyType,
  value:  any
}
export interface IProperty extends ISimpleProperty { postInit?: boolean }

export interface IFullRef {
  exposedEntity?:  string
  externalScene:   string
  ref:             string | Entity
}
export type TRef = IFullRef | string | null | Entity
export interface IRefWithConstantValue {
  ref:    TRef,
  value:  IProperty
}
export type TRefMaybeConstantValue = IFullRef | IRefWithConstantValue | string

export interface IPropertyAlias {
  originalEntity:    TRef,
  originalProperty:  string
}

export interface IExposedEntity {
  isArray:   boolean,
  refersTo:  TRef[]
}

export interface IPropertyOverrideConnection {
  entity:             TRef,
  propertyName:       string
  propertyOverride:   IOverridenProperty
}

export interface IOverridenProperty {
  type:   string
  value:  {}
}
export interface IPropertyOverride {
  entities: TRef[],
  properties: {[key: string]: IOverridenProperty}
}

export interface IDependencyWithFlag {
  flag:      string
  resource:  string
}
export type TDependency = string | IDependencyWithFlag

export type TArrayPatchOperation = { RemoveItemByValue: string } | { AddItem: any } | { AddItemBefore: [string, string] } | { AddItemAfter: [string, string] }

export interface IBaseEntity {
  factory: string
  blueprint: string
  factoryFlag?: string
  editorOnly?: boolean
  subsets?: {[ key: string ]: string[]}
  properties?: {[ key: string ]: IProperty}
  exposedInterfaces?: {[key: string]: string}
  exposedEntities?: {[key: string]: IExposedEntity}
  propertyAliases?: {[ key: string ]: IPropertyAlias}
  events?: {[ key: string ]: {[ key: string ]: TRef[]}}
  inputCopying?: {[key: string]: TRefMaybeConstantValue[]}
  outputCopying?: {[key: string]: TRefMaybeConstantValue[]}
  platformSpecificProperties?: {[key: string]: {[key: string]: string}}
}
export interface IEntity extends IBaseEntity {
  id:      string
  name:    string
  parent:  string
}

export interface ICreateEntity extends IBaseEntity {
  parent:   string
  name?:    string
  id?:      string
}

export interface ICreateChildEntity extends IBaseEntity {
  parent?:  string
  name?:    string
  id?:      string
}

export interface IPinConnectionOverride {
  fromEntity:  TRef
  fromPin:     string
  toEntity:    TRef
  toPin:       string
  value:       any
}
export type IPinConnectionOverrideDelete = IPinConnectionOverride

export interface IExposedEntity {
  isArray:   boolean
  refersTo:  TRef[]
}
