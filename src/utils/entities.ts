import { Entity } from '../patches/entity/_index.js'
import { QNPatch } from '../patches/QNPatch.js'
import { ICreateChildEntity, ICreateEntity, IEventTriggers, IFullRef, IRefWithConstantValue, TRef } from '../types.js'

export const ENTITY_ID_PREFIX = 'faad'

if(ENTITY_ID_PREFIX.length > 6) throw new Error('ERR: the entity id prefix should be less than 7 characters to allow for more ids')

export const generateRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
export const generateRandomEntityID = () => ENTITY_ID_PREFIX + generateRandomHex(16 - ENTITY_ID_PREFIX.length)
export const generateRandomEntityName = () => "Generated by QNS_" + generateRandomHex(16)

export function ensureID(entity: TRef | IRefWithConstantValue): TRef | IRefWithConstantValue {
  if(entity instanceof Entity) return entity.id
  if(entity.hasOwnProperty('value')) {
    entity = entity as IRefWithConstantValue
    return {
      ...entity,
      ref: entity.ref instanceof Entity ? entity.ref.id : entity.ref,
      value: {
        ...entity.value,
        value: entity.value.value instanceof Entity ? entity.value.value.id : entity.value.value
      }
    }
  }
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
      if(value?.[Symbol.iterator]) {
        result[key] = [...value].map(x => deepEnsureID(x))
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

export const outputsToEvent = (outputs: IEventTriggers) => Object.fromEntries(Object.entries(outputs).map(([key, value]) => [key, value instanceof Array ? value.map(x => ensureID(x)) : ensureID(value)]))

export function ensureEventIDs<T extends ICreateEntity | ICreateChildEntity>(entityConfig: T): T {
  entityConfig.events = Object.fromEntries(
    Object.entries(entityConfig.events ?? {})
      .map(inpin => [inpin[0], Object.fromEntries(Object.entries(inpin[1] ?? {})
        .map(outpin => [outpin[0], outpin[1] instanceof Array ? outpin[1].map(out => ensureID(out)) : [ensureID(outpin[1])]])
      )])
  ) as any
  entityConfig.outputCopying = Object.fromEntries(
    Object.entries(entityConfig.outputCopying ?? {})
      .map(inpin => [inpin[0], Object.fromEntries(Object.entries(inpin[1] ?? {})
        .map(outpin => [outpin[0], outpin[1] instanceof Array ? outpin[1].map(out => ensureID(out)) : [ensureID(outpin[1])]])
      )])
  ) as any
  entityConfig.inputCopying = Object.fromEntries(
    Object.entries(entityConfig.inputCopying ?? {})
      .map(inpin => [inpin[0], Object.fromEntries(Object.entries(inpin[1] ?? {})
        .map(outpin => [outpin[0], outpin[1] instanceof Array ? outpin[1].map(out => ensureID(out)) : [ensureID(outpin[1])]])
      )])
  ) as any

  return entityConfig
}
