import { TRef } from '../../types'
import { Entity } from './base.js'

declare module './_index.js' {
  interface Entity {
    if(trigger: string, then: {[key: string]: TRef[]}, elseThen?: {[key: string]: TRef[]}): Entity;
  }
}

Entity.prototype.if = function(trigger: string, then: {[key: string]: TRef[]}, elseThen: {[key: string]: TRef[]} = {}) {
  const ifEntity = this.addChild({
    factory: "[modules:/zlogicifentity.class].pc_entitytype",
    blueprint: "[modules:/zlogicifentity.class].pc_entityblueprint",
    events: {
      Then: then,
      Else: elseThen
    }
  })

  this.addEvent({ when: trigger, do: 'If', on: ifEntity })

  return ifEntity
}
