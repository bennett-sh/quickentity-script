import { PatchEntity } from './patches/entity/_index.js'
import { Entity } from './entities/entity/_index.js'
import { PatchAction } from './lib.js'

export type TSubType = 'brick' | 'scene' | 'template'

export type TRoomBehaviour = 'ROOM_DYNAMIC' | 'ROOM_STATIC' | 'ROOM_STATIC_OUTSIDE_CLIENT'
export interface ITransform {
  rotation: {
    x: number
    y: number
    z: number
  }
  position: {
    x: number
    y: number
    z: number
  }
}

export type TPropertyType = 'SEntityTemplateReference' | 'ZGuid' | 'ZString' | string
export interface ISimpleProperty {
  type:   TPropertyType
  value:  IFullRef | any
}
export interface IProperty extends ISimpleProperty { postInit?: boolean }
export type ICommonProperties = Partial<{
  m_mTransform: {
    type: 'SMatrix43'
    value: ITransform
  },
  m_eidParent: {
    type: 'SEntityTemplateReference',
    value: TRef
  },
  m_eRoomBehaviour: {
    type: 'ZSpatialEntity.ERoomBehaviour',
    value: TRoomBehaviour
  },
  m_RepositoryId: {
    type: 'ZGuid',
    value: string
  }
}>
export type TProperties = ICommonProperties & Record<string, IProperty>

export interface IFullRef {
  exposedEntity?:  string
  externalScene:   string
  ref:             string | Entity | PatchEntity
}
export type TRef = IFullRef | string | null | Entity | PatchEntity
export interface IRefWithConstantValue {
  ref:    TRef
  value:  IProperty
}
export type TRefMaybeConstantValue = IFullRef | IRefWithConstantValue | string

export interface IPropertyAlias {
  originalEntity:    TRef
  originalProperty:  string
}

export interface IExposedEntity {
  isArray   :  boolean
  refersTo  :  TRef[]
}

export interface IPropertyOverrideConnection {
  entity            :  TRef
  propertyName      :  string
  propertyOverride  :  IOverridenProperty
}

export interface IOverridenProperty {
  type    :  string
  value   :  any
}
export interface IPropertyOverride {
  entities    :  TRef[]
  properties  :  {[key: string]: IOverridenProperty}
}

export interface IDependencyWithFlag {
  flag      :  string
  resource  :  string
}
export type TDependency = string | IDependencyWithFlag

export type TArrayPatchOperation = { RemoveItemByValue: string } | { AddItem: any } | { AddItemBefore: [string, string] } | { AddItemAfter: [string, string] }

export type IEventTriggers = {[key: string]: TRef | TRef[] | IRefWithConstantValue | IRefWithConstantValue[]}

export interface IBaseEntity {
  factory: string
  blueprint: string
  factoryFlag?: string
  editorOnly?: boolean
  subsets?: {[ key: string ]: string[]}
  properties?: TProperties
  exposedInterfaces?: {[key: string]: string}
  exposedEntities?: {[key: string]: IExposedEntity}
  propertyAliases?: {[ key: string ]: IPropertyAlias}
  events?: {[ key: string ]: IEventTriggers}
  inputCopying?: {[ key: string ]: IEventTriggers}
  outputCopying?: {[ key: string ]: IEventTriggers}
  platformSpecificProperties?: {[key: string]: {[key: string]: string}}
}
export interface IEntity extends IBaseEntity {
  id      :  string
  name    :  string
  parent  :  TRef
}

export interface IEntityNoID extends IBaseEntity {
  parent  :  TRef
  name   ?:  string
}

export interface ICreateEntity extends IBaseEntity {
  parent  :  TRef
  name   ?:  string
  id     ?:  string
}

export interface ICreateChildEntity extends IBaseEntity {
  parent  ?:  TRef
  name    ?:  string
  id      ?:  string
}

export interface IRootEntity extends IBaseEntity {
  name   ?:  string
  id     ?:  string
}

export interface IPinConnectionOverride {
  fromEntity : TRef
  toEntity   : TRef
  fromPin    : string
  toPin      : string
  value      : any
}
export type IPinConnectionOverrideDelete = IPinConnectionOverride

export interface IExposedEntity {
  isArray  : boolean
  refersTo : TRef[]
}

export interface IPropertyAlias {
  originalEntity    : TRef
  originalProperty  : string
}

export interface ICommentEntity {
  name    :  string
  text    :  string
  parent  :  TRef
}

export interface ISinglePatch<T> {
  action: PatchAction,
  data: T
}

export interface IPath {
  factory    :  string
  blueprint  :  string
}

export type TLocation = 'golden' | 'ancestral' | 'edgy' | 'elegant' | 'wet' | 'trapped' | 'opulent' | 'caged' | 'greedy' | 'salty' | 'hawk' | 'theark' | 'skunk' | 'mumbai' | 'colombia' | 'miami' | 'sheep' | 'hokkaido' | 'colorado' | 'bangkok' | 'marrakesh' | 'coastaltown' | 'paris' | 'rocky' | 'snug'
export type TLocationKey = 'Dubai' | 'Dartmoor' | 'Berlin' | 'Mendoza' | 'Chongqing' | 'Romania' | 'HavenIsland' | 'Siberia' | 'NewYork' | 'HantuPort' | 'Himmelstein' | 'IsleOfSgail' | 'WhittletonCreek' | 'Mumbai' | 'SantaFortuna' | 'Miami' | 'HawkesBay' | 'Hokkaido' | 'Colorado' | 'Bangkok' | 'Marrakesh' | 'Sapienza' | 'Paris' | 'AmbroseIsland' | 'Safehouse';

export interface IQNEntity {
  tempHash: string
  tbluHash: string
  rootEntity: string
  entities: {[id: string]: IEntityNoID}
  propertyOverrides: IPropertyOverride[]
  overrideDeletes: TRef[]
  pinConnectionOverrides: IPinConnectionOverride[]
  pinConnectionOverrideDeletes: IPinConnectionOverrideDelete[]
  externalScenes: string[]
  subType: TSubType
  quickEntityVersion: number
  extraFactoryDependencies: TDependency[]
  extraBlueprintDependencies: TDependency[]
  comments: ICommentEntity[]
}
