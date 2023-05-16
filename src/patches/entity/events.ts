import { CommonPaths, getPath } from '../../lib.js'
import type { IEventTriggers } from '../../types.js'
import { PatchEntity } from './base.js'

declare module './_index.js' {
  interface PatchEntity {
    addOnGameStartListener(outputs: IEventTriggers): PatchEntity
  }
}

function createQNSEventListeners(entity: PatchEntity) {
  function createGameStartListener(root: PatchEntity) {
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

PatchEntity.prototype.addOnGameStartListener = function(outputs) {
  const id = this.patch.__constants.EVENT_LISTENERS
  let listener = new PatchEntity(this.patch, id)
  if(!id) {
    listener = createQNSEventListeners(this)
    this.patch.__constants.EVENT_LISTENERS = listener.id
  }
  Object.entries(outputs).forEach(([k, v]) => listener.addEvent({ when: 'OnGameStart', do: k, on: v }))
  return listener
}
