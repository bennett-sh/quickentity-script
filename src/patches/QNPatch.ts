import { deepEnsureID, ensureID, generateRandomEntityID, generateRandomEntityName } from '../utils/entities.js'
import { PatchAction, PatchAction_AddEntityData, PatchAction_AddEventConnectionData, PatchAction_AddExternalSceneData, PatchAction_AddExtraBlueprintDependencyData, PatchAction_AddExtraFactoryDependencyData, PatchAction_AddInputCopyConnectionData, PatchAction_AddPropertyData, PatchAction_AddPropertyOverrideData, PatchAction_AddPropertyOverrideConnectionData, PatchAction_CustomPatch, PatchAction_RemoveEntityByIDData, PatchAction_RemoveEventConnectionData, PatchAction_RemoveExternalSceneData, PatchAction_RemoveExtraBlueprintDependencyData, PatchAction_RemoveExtraFactoryDependencyData, PatchAction_RemovePropertyOverrideData, PatchAction_RemovePropertyOverrideConnectionData, PatchAction_SetBlueprintData, PatchAction_SetFactoryData, PatchAction_SetNameData, PatchAction_SetParentData, PatchAction_SetPropertyPostInitData, PatchAction_SetPropertyTypeData, PatchAction_SetPropertyValueData, PatchAction_SetRootEntityData, PatchAction_SetSubTypeData, PatchAction_AddOverrideDeleteData, PatchAction_RemoveOverrideDeleteData, PatchAction_RemovePropertyByNameData, PatchAction_RemoveInputCopyConnectionData, PatchAction_RemoveSubsetData, PatchAction_SetFactoryFlagData, PatchAction_AddOutputCopyConnectionData, PatchAction_SetPSPropertyPostInitData, PatchAction_SetPSPropertyValueData, PatchAction_SetPSPropertyTypeData, PatchAction_AddPSPropertyData, PatchAction_RemovePSPropertyByNameData, PatchAction_RemovePSPropertiesForPlatform, PatchAction_PatchPSArrayPropertyValue, PatchAction_PatchArrayPropertyValue } from './PatchActions.js'
import { buildJSON } from '../utils/json.js'
import SinglePatch from './SinglePatch.js'
import { writeFile } from 'fs/promises'
import { ICreateEntity, IPropertyOverride, IPropertyOverrideConnection, TDependency, TRef, TSubType } from '../types.js'
import { Entity } from './Entity.js'
import { Constants } from './Constants.js'

export interface QNPatchSaveOptions {
  spaces: number,
  includeSchema: boolean
}

export const QNPatchSaveDefaultOptions: QNPatchSaveOptions = {
  spaces: 2,
  includeSchema: true
}

export class QNPatch {
  public __constants: Constants = new Constants()
  private _patches: SinglePatch[] = []

  constructor(
    private templateHash: string,
    private blueprintHash: string
  ) {}

  public static get patchVersion(): any {
    return 6;
  }

  public addEntity(entityConfig: ICreateEntity): Entity {
    // Replace all entity class refs with their respective ids
    entityConfig.events = Object.fromEntries(
      Object.entries(entityConfig.events ?? {})
        .map(inpin => [inpin[0], Object.fromEntries(Object.entries(inpin[1] ?? {})
          .map(outpin => [outpin[0], outpin[1].map(out => out instanceof Entity ? out.id : out)])
        )])
    )

    const name = entityConfig.name ?? generateRandomEntityName()
    const id = entityConfig.id ?? generateRandomEntityID()
    const entity = new Entity(this, id)

    this.addPatch<PatchAction_AddEntityData>(PatchAction.ADD_ENTITY, { ...entityConfig, name, id })

    return entity
  }

  public getEntity(id: string): Entity {
    return new Entity(this, id)
  }

  public setRootEntity(entity: string | Entity): this {
    this.addPatch<PatchAction_SetRootEntityData>(PatchAction.SET_ROOT_ENTITY, entity)
    return this
  }

  public removeEntityByID(entity: string | Entity): this {
    this.addPatch<PatchAction_RemoveEntityByIDData>(PatchAction.REMOVE_ENTITY_BY_ID, entity)
    return this
  }

  public setSubType(subType: TSubType): this {
    this.addPatch<PatchAction_SetSubTypeData>(PatchAction.SET_SUB_TYPE, subType)
    return this
  }

  public addExtraBlueprintDependency(dependency: TDependency): this {
    this.addPatch<PatchAction_AddExtraBlueprintDependencyData>(PatchAction.ADD_EXTRA_BLUEPRINT_DEPENDENCY, dependency)
    return this
  }

  public removeExtraBlueprintDependency(dependency: TDependency): this {
    this.addPatch<PatchAction_RemoveExtraBlueprintDependencyData>(PatchAction.REMOVE_EXTRA_BLUEPRINT_DEPENDENCY, dependency)
    return this
  }

  public addExtraFactoryDependency(dependency: TDependency): this {
    this.addPatch<PatchAction_AddExtraFactoryDependencyData>(PatchAction.ADD_EXTRA_FACTORY_DEPENDENCY, dependency)
    return this
  }

  public removeExtraFactoryDependency(dependency: TDependency): this {
    this.addPatch<PatchAction_RemoveExtraFactoryDependencyData>(PatchAction.REMOVE_EXTRA_FACTORY_DEPENDENCY, dependency)
    return this
  }

  public addExternalScene(scene: string): this {
    this.addPatch<PatchAction_AddExternalSceneData>(PatchAction.ADD_EXTERNAL_SCENE, scene)
    return this
  }

  public removeExternalScene(scene: string): this {
    this.addPatch<PatchAction_RemoveExternalSceneData>(PatchAction.REMOVE_EXTERNAL_SCENE, scene)
    return this
  }

  public addPropertyOverride(override: IPropertyOverride): this {
    this.addPatch<PatchAction_AddPropertyOverrideData>(PatchAction.ADD_PROPERTY_OVERRIDE, override)
    return this
  }

  public removePropertyOverride(override: IPropertyOverride): this {
    this.addPatch<PatchAction_RemovePropertyOverrideData>(PatchAction.REMOVE_PROPERTY_OVERRIDE, override)
    return this
  }

  public addPropertyOverrideConnection(connection: IPropertyOverrideConnection): this {
    this.addPatch<PatchAction_AddPropertyOverrideConnectionData>(PatchAction.ADD_EXTERNAL_SCENE, connection)
    return this
  }

  public removePropertyOverrideConnection(connection: IPropertyOverrideConnection): this {
    this.addPatch<PatchAction_RemovePropertyOverrideConnectionData>(PatchAction.REMOVE_EXTERNAL_SCENE, connection)
    return this
  }

  public addOverrideDelete(ref: TRef | TRef[]): this {
    this.addPatch<PatchAction_AddOverrideDeleteData>(PatchAction.ADD_OVERRIDE_DELETE, ref)
    return this
  }

  public removeOverrideDelete(ref: TRef | TRef[]): this {
    this.addPatch<PatchAction_RemoveOverrideDeleteData>(PatchAction.REMOVE_OVERRIDE_DELETE, ref)
    return this
  }

  public buildPatch(options: Partial<QNPatchSaveOptions> = {}) {
    options = { ...QNPatchSaveDefaultOptions, ...options }

    return buildJSON({
      'tempHash': this.templateHash,
      'tbluHash': this.blueprintHash,
      'patch': this.buildQNPatches().flat(Infinity),
      'patchVersion': QNPatch.patchVersion,
    })
      .setIf(options.includeSchema, '$schema', 'https://raw.githubusercontent.com/atampy25/simple-mod-framework/main/Mod%20Manager/src/lib/entity-patch-schema.json')
      .build()
  }

  public async save(path: string, options: Partial<QNPatchSaveOptions> = {}) {
    options = { ...QNPatchSaveDefaultOptions, ...options }

    await writeFile(
      path,
      JSON.stringify(this.buildPatch(options), null, options.spaces)
    )
  }

  public addPatch<T>(action: PatchAction, data: T) {
    this._patches.push(new SinglePatch(action, data))
  }

  public addCustomPatch(patch: {[key: string]: any}) {
    this.addPatch<PatchAction_CustomPatch>(PatchAction.CUSTOM_PATCH, patch)
    return this
  }

  private buildQNPatches() {
    return this._patches.map(patch => {
      switch(patch.action) {
        case PatchAction.ADD_ENTITY: {
          const data = patch.data as PatchAction_AddEntityData
          return [{
            "AddEntity": [
              data.id,
              buildJSON(data)
                .strip('id')
                .build()
            ]
          }]
        }

        case PatchAction.ADD_EVENT_CONNECTION: {
          const data = patch.data as PatchAction_AddEventConnectionData
          if(data.on instanceof Array) {
            return data.on.map(on => ({
              "SubEntityOperation": [
                data.target,
                {
                  "AddEventConnection": [
                    data.when,
                    data.do,
                    ensureID(on)
                  ]
                }
              ]
            }))
          } else {
            return [{
              "SubEntityOperation": [
                data.target,
                {
                  "AddEventConnection": [
                    data.when,
                    data.do,
                    ensureID(data.on)
                  ]
                }
              ]
            }]
          }
        }


        case PatchAction.ADD_PLATFORM_SPECIFIC_PROPERTY: {
          const data = patch.data as PatchAction_AddPSPropertyData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "AddPlatformSpecificProperty": [
                  data.platform,
                  data.name,
                  data.property
                ]
              }
            ]
          }]
        }

        case PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_TYPE: {
          const data = patch.data as PatchAction_SetPSPropertyTypeData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetPlatformSpecificPropertyType": [
                  data.platform,
                  data.name,
                  data.type
                ]
              }
            ]
          }]
        }

        case PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_VALUE: {
          const data = patch.data as PatchAction_SetPSPropertyValueData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetPlatformSpecificPropertyValue": {
                  "platform": data.platform,
                  "property_name": data.name,
                  "value": data.value
                }
              }
            ]
          }]
        }

        case PatchAction.SET_PLATFORM_SPECIFIC_PROPERTY_POSTINIT: {
          const data = patch.data as PatchAction_SetPSPropertyPostInitData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetPlatformSpecificPropertyPostInit": [
                  data.platform,
                  data.name,
                  data.postInit
                ]
              }
            ]
          }]
        }

        case PatchAction.REMOVE_PLATFORM_SPECIFIC_PROPERTY_BY_NAME: {
          const data = patch.data as PatchAction_RemovePSPropertyByNameData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "RemovePlatformSpecificPropertyByName": [
                  data.platform,
                  data.name
                ]
              }
            ]
          }]
        }

        case PatchAction.REMOVE_PLATFORM_SPECIFIC_PROPERTIES_FOR_PLATFORM: {
          const data = patch.data as PatchAction_RemovePSPropertiesForPlatform
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "RemovePlatformSpecificPropertiesForPlatform": [
                  data.platform
                ]
              }
            ]
          }]
        }

        case PatchAction.PATCH_PLATFORM_SPECIFIC_ARRAY_PROPERTY_VALUE: {
          const data = patch.data as PatchAction_PatchPSArrayPropertyValue
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "PatchPlatformSpecificArrayPropertyValue": [
                  data.platform,
                  data.name,
                  data.operations
                ]
              }
            ]
          }]
        }


        case PatchAction.ADD_PROPERTY: {
          const data = patch.data as PatchAction_AddPropertyData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "AddProperty": [
                  data.name,
                  data.property
                ]
              }
            ]
          }]
        }

        case PatchAction.SET_PROPERTY_TYPE: {
          const data = patch.data as PatchAction_SetPropertyTypeData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetPropertyType": [
                  data.name,
                  data.type
                ]
              }
            ]
          }]
        }

        case PatchAction.SET_PROPERTY_VALUE: {
          const data = patch.data as PatchAction_SetPropertyValueData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetPropertyValue": {
                  "property_name": data.name,
                  "value": data.value
                }
              }
            ]
          }]
        }

        case PatchAction.SET_PROPERTY_POSTINIT: {
          const data = patch.data as PatchAction_SetPropertyPostInitData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetPropertyPostInit": [
                  data.name,
                  data.postInit
                ]
              }
            ]
          }]
        }

        case PatchAction.PATCH_ARRAY_PROPERTY_VALUE: {
          const data = patch.data as PatchAction_PatchArrayPropertyValue
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "PatchArrayPropertyValue": [
                  data.name,
                  data.operations
                ]
              }
            ]
          }]
        }

        case PatchAction.SET_ROOT_ENTITY: {
          return [{
            "SetRootEntity": ensureID(patch.data as PatchAction_SetRootEntityData)
          }]
        }

        case PatchAction.REMOVE_ENTITY_BY_ID: {
          return [{
            "RemoveEntityByID": ensureID(patch.data as PatchAction_RemoveEntityByIDData)
          }]
        }

        case PatchAction.SET_SUB_TYPE: {
          return [{
            "SetSubType": patch.data as PatchAction_SetSubTypeData
          }]
        }

        case PatchAction.SET_NAME: {
          const data = patch.data as PatchAction_SetNameData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetName": data.name
              }
            ]
          }]
        }

        case PatchAction.SET_PARENT: {
          const data = patch.data as PatchAction_SetParentData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetParent": data.parent
              }
            ]
          }]
        }

        case PatchAction.SET_FACTORY: {
          const data = patch.data as PatchAction_SetFactoryData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetFactory": data.factory
              }
            ]
          }]
        }

        case PatchAction.SET_BLUEPRINT: {
          const data = patch.data as PatchAction_SetBlueprintData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetBlueprint": data.blueprint
              }
            ]
          }]
        }

        case PatchAction.ADD_INPUT_COPY_CONNECTION: {
          const data = patch.data as PatchAction_AddInputCopyConnectionData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "AddInputCopyConnection": [
                  data.a,
                  data.b,
                  ensureID(data.to)
                ]
              }
            ]
          }]
        }

        case PatchAction.REMOVE_PROPERTY_BY_NAME: {
          const data = patch.data as PatchAction_RemovePropertyByNameData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "RemovePropertyByName": data.name
              }
            ]
          }]
        }

        case PatchAction.REMOVE_EVENT_CONNECTION: {
          const data = patch.data as PatchAction_RemoveEventConnectionData
          if(data.on instanceof Array) {
            return data.on.map(on => ({
              "SubEntityOperation": [
                data.target,
                {
                  "RemoveEventConnection": [
                    data.when,
                    data.do,
                    ensureID(on)
                  ]
                }
              ]
            }))
          } else {
            return [{
              "SubEntityOperation": [
                data.target,
                {
                  "RemoveEventConnection": [
                    data.when,
                    data.do,
                    ensureID(data.on)
                  ]
                }
              ]
            }]
          }
        }

        case PatchAction.ADD_EXTRA_BLUEPRINT_DEPENDENCY: {
          const data = patch.data as PatchAction_AddExtraBlueprintDependencyData
          return [{
            "AddExtraBlueprintDependency": data
          }]
        }

        case PatchAction.REMOVE_EXTRA_BLUEPRINT_DEPENDENCY: {
          const data = patch.data as PatchAction_RemoveExtraBlueprintDependencyData
          return [{
            "RemoveExtraBlueprintDependency": data
          }]
        }

        case PatchAction.ADD_EXTRA_FACTORY_DEPENDENCY: {
          const data = patch.data as PatchAction_AddExtraFactoryDependencyData
          return [{
            "AddExtraFactoryDependency": data
          }]
        }

        case PatchAction.REMOVE_EXTRA_FACTORY_DEPENDENCY: {
          const data = patch.data as PatchAction_RemoveExtraFactoryDependencyData
          return [{
            "RemoveExtraFactoryDependency": data
          }]
        }

        case PatchAction.ADD_EXTERNAL_SCENE: {
          return [{
            "AddExternalScene": patch.data
          }]
        }

        case PatchAction.REMOVE_EXTERNAL_SCENE: {
          return [{
            "RemoveExternalScene": patch.data
          }]
        }

        case PatchAction.ADD_PROPERTY_OVERRIDE: {
          return [{
            "AddPropertyOverride": patch.data
          }]
        }

        case PatchAction.REMOVE_PROPERTY_OVERRIDE: {
          return [{
            "RemovePropertyOverride": patch.data
          }]
        }

        case PatchAction.ADD_PROPERTY_OVERRIDE_CONNECTION: {
          return [{
            "AddPropertyOverrideConnection": patch.data
          }]
        }

        case PatchAction.REMOVE_PROPERTY_OVERRIDE_CONNECTION: {
          return [{
            "RemovePropertyOverrideConnection": patch.data
          }]
        }

        case PatchAction.ADD_OVERRIDE_DELETE: {
          const data = patch.data as PatchAction_AddOverrideDeleteData
          if(data instanceof Array) {
            return data.map(x => ({
              "AddOverrideDelete": ensureID(x)
            }))
          } else {
            return [{
              "AddOverrideDelete": ensureID(data)
            }]
          }
        }

        case PatchAction.REMOVE_OVERRIDE_DELETE: {
          const data = patch.data as PatchAction_RemoveOverrideDeleteData
          if(data instanceof Array) {
            return data.map(x => ({
              "RemoveOverrideDelete": ensureID(x)
            }))
          } else {
            return [{
              "RemoveOverrideDelete": ensureID(data)
            }]
          }
        }

        case PatchAction.REMOVE_INPUT_COPY_CONNECTION: {
          const data = patch.data as PatchAction_RemoveInputCopyConnectionData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "RemoveInputCopyConnection": [
                  data.a,
                  data.b,
                  ensureID(data.to)
                ]
              }
            ]
          }]
        }

        case PatchAction.REMOVE_SUBSET: {
          const data = patch.data as PatchAction_RemoveSubsetData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "RemoveSubset": [
                  data.a,
                  data.b
                ]
              }
            ]
          }]
        }

        case PatchAction.SET_FACTORY_FLAG: {
          const data = patch.data as PatchAction_SetFactoryFlagData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "SetFactoryFlag": data.flag
              }
            ]
          }]
        }

        case PatchAction.ADD_OUTPUT_COPY_CONNECTION: {
          const data = patch.data as PatchAction_AddOutputCopyConnectionData
          return [{
            "SubEntityOperation": [
              data.target,
              {
                "AddOutputCopyConnection": [
                  data.a,
                  data.b,
                  ensureID(data.to)
                ]
              }
            ]
          }]
        }

        case PatchAction.CUSTOM_PATCH: {
          return [deepEnsureID(patch.data)]
        }

        default:
          throw new Error(`patch ${PatchAction[patch.action]} has not been implemented yet! please use custom patches until then`)
      }
    })
  }
}

