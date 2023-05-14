import { getClassPath } from '../../lib.js'
import type { TRef } from '../../types.js'
import { PatchEntity } from './base.js'

declare module './_index.js' {
  interface PatchEntity {
    if(trigger: string, then: {[key: string]: TRef | TRef[]}, elseThen?: {[key: string]: TRef | TRef[]}): PatchEntity;
  }
}

PatchEntity.prototype.if = function(trigger: string, then: {[key: string]: TRef | TRef[]}, elseThen: {[key: string]: TRef | TRef[]} = {}) {
  const ifEntity = this.addChild({
    ...getClassPath('LogicIfEntity'),
    events: {
      Then: then,
      Else: elseThen
    }
  })

  this.addEvent({ when: trigger, do: 'If', on: ifEntity })

  return ifEntity
}
