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
