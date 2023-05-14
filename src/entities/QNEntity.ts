import type {  ICreateChildEntity, IEntityNoID, IPath, IQNEntity, IRootEntity, TSubType } from '../types.js'
import { ensureEntityIDs, generateRandomEntityID, generateRandomEntityName } from '../utils/entities.js'
import { Constants } from '../Constants.js'
import { Entity } from './entity/_index.js'
import { buildJSON, deepMerge } from '../utils/json.js'
import { normalizeToHash } from '../utils/hash.js'
import { QNSaveOptions } from '../lib.js'
import { writeFileSync } from 'fs'

export class IncompleteEntityError extends Error {}
export class DuplicateEntityIDError extends Error {}

export class QNEntity {
  public __constants: Constants = new Constants()
  public __data: IQNEntity

  constructor(
    pathOrData: IPath & { subType: TSubType } | IQNEntity
  ) {
    if(pathOrData.hasOwnProperty('entities')) {
      this.__data = pathOrData as IQNEntity
    } else {
      const path = pathOrData as IPath & { subType: TSubType }
      this.__data = {
        tempHash: normalizeToHash(path.factory),
        tbluHash: normalizeToHash(path.blueprint),
        quickEntityVersion: 3.1,
        entities: {},
        comments: [],
        externalScenes: [],
        extraBlueprintDependencies: [],
        extraFactoryDependencies: [],
        overrideDeletes: [],
        pinConnectionOverrideDeletes: [],
        pinConnectionOverrides: [],
        propertyOverrides: [],
        rootEntity: null,
        subType: path.subType
      }
    }
  }

  public set(data: Partial<IQNEntity>): void {
    this.__data = deepMerge(data, this.__data)
  }

  public addRoot(entityConfig: IRootEntity): Entity {
    if(this.__data.rootEntity) console.warn('WARN: multiple root entites are not allowed; overriding previous root entity')
    let { id, name } = entityConfig
    if(!id) id = 'fffffffffffffffe'
    if(!name) name = this.__data.subType.replace(/^(\w)/g, (_, m) => m.toUpperCase())
    this.__data.rootEntity = id
    return this.addEntity({ ...entityConfig, id, name, parent: null })
  }

  public addEntity(entityConfig: ICreateChildEntity): Entity {
    let { id, name } = entityConfig as any
    if(!name) name = generateRandomEntityName()
    if(!id) id = generateRandomEntityID()
    if(this.__data.entities.hasOwnProperty(id)) throw new DuplicateEntityIDError(`an entity with the id ${id} already exists!`)
    entityConfig = buildJSON({...entityConfig, name})
      .strip('id')
      .addIf(!entityConfig.parent, { parent: null })
      .build() as ICreateChildEntity
    this.__data.entities[id] = entityConfig as IEntityNoID
    return new Entity(this, id)
  }

  public build() {
    let data = this.__data
    data.entities = Object.fromEntries(Object.entries(data.entities).map(([id, entity]) => [id, ensureEntityIDs(entity)]))
    return data
  }

  public async save(path: string, options: Partial<QNSaveOptions> = {}): Promise<void> {
    await writeFileSync(
      path,
      buildJSON(this.build())
        .addIf(options.includeSchema ?? true, { $schema: 'https://raw.githubusercontent.com/atampy25/simple-mod-framework/main/Mod%20Manager/src/lib/entity-schema.json' })
        .stringify(null, options.spaces ?? 2)
    )
  }
}

