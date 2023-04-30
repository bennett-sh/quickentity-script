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
  ref:             string
}
export type TRef = IFullRef | string | null
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

export interface IEntity {
  id: string
  name: string
  parent: string
  factory: string
  blueprint: string
  factoryFlag?: string
  editorOnly?: boolean
  subsets?: {[ key: string ]: string[]}
  properties?: {[ key: string ]: IProperty}
  exposedInterfaces?: {[key: string]: string}
  exposedEntities?: {[key: string]: IExposedEntity}
  propertyAliases?: {[ key: string ]: IPropertyAlias}
  events?: {[ key: string ]: {[ key: string ]: (string | Entity)[]}}
  inputCopying?: {[key: string]: TRefMaybeConstantValue[]}
  outputCopying?: {[key: string]: TRefMaybeConstantValue[]}
  platformSpecificProperties?: {[key: string]: {[key: string]: string}}
}
