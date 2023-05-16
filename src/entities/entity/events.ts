import { CommonPaths, getPath } from '../../lib.js'
import { IEventTriggers, TRef } from '../../types.js'
import { Entity } from './base.js'

declare module './_index.js' {
  interface Entity {
    addOnGameStartListener(outputs: IEventTriggers): Entity
  }
}

function createQNSEventListeners(entity: Entity) {
  function createGameStartListener(root: Entity) {
    const signal = root.addChild({
      ...CommonPaths.SignalOnce_Void,
      outputCopying: {
        Out: {
          OnGameStart: root
        }
      },
      properties: {
        m_fExpireInterval: {
          type: "float32",
          value: 5
        },
        m_bSignaling: {
          type: "bool",
          value: true
        }
      }
    })
    root.addChild({ ...CommonPaths.GameEventListener, events: { EventOccurred: { Signal: signal } } })
  }

  const root = entity.addChild({
    name: 'QNS Event Listeners',
    ...getPath('[modules:/zentity.class]')
  })
  createGameStartListener(root)
  return root
}

Entity.prototype.addOnGameStartListener = function(outputs) {
  const id = this.patch.__constants.EVENT_LISTENERS
  let listener = new Entity(this.patch, id)
  if(!id) {
    listener = createQNSEventListeners(this)
    this.patch.__constants.EVENT_LISTENERS = listener.id
  }
  Object.entries(outputs).forEach(([k, v]) => listener.addEvent({ when: 'OnGameStart', do: k, on: v }))
  return listener
}
