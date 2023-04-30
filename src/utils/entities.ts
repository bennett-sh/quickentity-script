import { QNPatch } from '../patches/QNPatch.js'
import { Entity } from '../patches/Entity.js'
import { IFullRef, TRef } from '../types.js'

const ENTITY_ID_PREFIX = 'faad'

if(ENTITY_ID_PREFIX.length > 6) throw new Error('ERR: the entity id prefix should be less than 7 characters to allow for more ids')

export const generateRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
export const generateRandomEntityID = () => ENTITY_ID_PREFIX + generateRandomHex(16 - ENTITY_ID_PREFIX.length)
export const generateRandomEntityName = () => "Generated by QES_" + generateRandomHex(16)

export function ensureID(entity: TRef) {
  if(entity instanceof Entity) return entity.id
  if(entity.hasOwnProperty('ref') && (entity as IFullRef).ref instanceof Entity) {
    return {
      ...(entity as IFullRef),
      ref: ((entity as IFullRef).ref as Entity).id,
    } satisfies IFullRef
  }
  return entity
}

export function deepEnsureID<T>(obj: T): T {
  const result: { [key: string]: any } = {}
  for(const key of Object.keys(obj ?? {})) {
    if(obj.hasOwnProperty(key)) {
      const value = obj[key]
      if(value instanceof Entity || typeof value !== 'object') {
        result[key] = ensureID(value)
        continue
      }
      result[key] = deepEnsureID(value)
    }
  }
  return result as T
}

export function ensureEntity(patch: QNPatch, ref: TRef) {
  if(ref instanceof Entity) return ref
  if(typeof ref === 'string') return new Entity(patch, ref)

  throw new Error('the option to use full refs in math hasn\'t been added yet!')
}
