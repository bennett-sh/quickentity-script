import { ensureEntity, outputsToEvent } from '../../utils/entities.js'
import { IEventTriggers, TRef } from '../../types.js'
import { Entity } from './_index.js'

declare module './_index.js' {
  interface Entity {
    addToConstantNumber(when: string, add: number, outputs: IEventTriggers): Entity
    addToVariableNumber(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity

    subtractFromConstantNumber(when: string, add: number, outputs: IEventTriggers): Entity
    subtractFromVariableNumber(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity

    multiplyWithConstantNumber(when: string, mul: number, outputs: IEventTriggers): Entity
    multiplyWithVariableNumber(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity

    divideByConstantNumber(when: string, div: number, outputs: IEventTriggers): Entity
    divideByVariableNumber(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity
  }
}

Entity.prototype.addToConstantNumber = function(when: string, add: number, outputs: IEventTriggers): Entity {
  const addEntity = this.addChild({
    factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
    blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
    properties: {
      m_fA: {
        type: 'float32',
        value: add
      },
      m_bSubtract: {
        type: 'bool',
        value: false
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when, do: 'B', on: addEntity })

  return addEntity
}

Entity.prototype.addToVariableNumber = function(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity {
  const addEntity = this.addChild({
    factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
    blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
    properties: {
      m_bSubtract: {
        type: 'bool',
        value: false
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when: whenA, do: 'A', on: addEntity })
  ensureEntity(this.patch, b).addEvent({ when: whenB, do: 'B', on: addEntity })

  return addEntity
}

Entity.prototype.subtractFromConstantNumber = function(when: string, add: number, outputs: IEventTriggers): Entity {
  const addEntity = this.addChild({
    factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
    blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
    properties: {
      m_fA: {
        type: 'float32',
        value: add
      },
      m_bSubtract: {
        type: 'bool',
        value: true
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when, do: 'B', on: addEntity })

  return addEntity
}

Entity.prototype.subtractFromVariableNumber = function(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity {
  const addEntity = this.addChild({
    factory: '[modules:/zmathaddsubstract.class].pc_entitytype',
    blueprint: '[modules:/zmathaddsubstract.class].pc_entityblueprint',
    properties: {
      m_bSubtract: {
        type: 'bool',
        value: true
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when: whenA, do: 'A', on: addEntity })
  ensureEntity(this.patch, b).addEvent({ when: whenB, do: 'B', on: addEntity })

  return addEntity
}

Entity.prototype.multiplyWithConstantNumber = function(when: string, mul: number, outputs: IEventTriggers): Entity {
  const mulEntity = this.addChild({
    factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
    blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
    properties: {
      m_fA: {
        type: 'float32',
        value: mul
      },
      m_bDivide: {
        type: 'bool',
        value: false
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when, do: 'B', on: mulEntity })

  return mulEntity
}

Entity.prototype.multiplyWithVariableNumber = function(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity {
  const mulEntity = this.addChild({
    factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
    blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
    properties: {
      m_bDivide: {
        type: 'bool',
        value: false
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when: whenA, do: 'A', on: mulEntity })
  ensureEntity(this.patch, b).addEvent({ when: whenB, do: 'B', on: mulEntity })

  return mulEntity
}

Entity.prototype.divideByConstantNumber = function(when: string, div: number, outputs: IEventTriggers): Entity {
  const divEntity = this.addChild({
    factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
    blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
    properties: {
      m_fA: {
        type: 'float32',
        value: div
      },
      m_bDivide: {
        type: 'bool',
        value: true
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when, do: 'B', on: divEntity })

  return divEntity
}

Entity.prototype.divideByVariableNumber = function(whenA: string, whenB: string, b: TRef, outputs: IEventTriggers): Entity {
  const divEntity = this.addChild({
    factory: '[modules:/zmathmultiplydivide.class].pc_entitytype',
    blueprint: '[modules:/zmathmultiplydivide.class].pc_entityblueprint',
    properties: {
      m_bDivide: {
        type: 'bool',
        value: true
      }
    },
    events: {
      Out: outputsToEvent(outputs)
    }
  })

  this.addEvent({ when: whenA, do: 'A', on: divEntity })
  ensureEntity(this.patch, b).addEvent({ when: whenB, do: 'B', on: divEntity })

  return divEntity
}
