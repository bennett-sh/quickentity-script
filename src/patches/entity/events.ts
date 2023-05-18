import type { IEventTriggers } from '../../types.js'
import { CommonPaths, getPath } from '../../lib.js'
import { PatchEntity } from './base.js'

declare module './_index.js' {
  interface PatchEntity {
    addOnGameStartListener(outputs: IEventTriggers): PatchEntity
  }
}

function createQNSEventListeners(entity: PatchEntity) {
  function createGameStartListener(root: PatchEntity) {
    root.addChild({
      ...CommonPaths.GameEventListener,
      properties: {
        m_eEvent: {
          type: 'EGameEventType',
          value: 'GET_IntroCutEnd'
        }
      },
      events: {
        EventOccurred: {
          OnGameStart: root
        }
      }
    })
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
