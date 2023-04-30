import { normalizeToHash } from '../utils/hash.js'
import { QNPatch } from './QNPatch.js'

export function createPatch(
  template: string,
  blueprint: string
): QNPatch {
  return new QNPatch(normalizeToHash(template), normalizeToHash(blueprint))
}
