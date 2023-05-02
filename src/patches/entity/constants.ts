import { Entity } from './base.js'

declare module './_index.js' {
  interface Entity {
    getConstantInt(value: number): Entity
    getConstantBool(value: boolean): Entity
  }
}

Entity.prototype.getConstantBool = function(value: boolean): Entity {
  if(value) {
    const id = this.patch.__constants.BOOL_TRUE
    if(!id) {
      const child = this.addChild({
        name: 'Constant TRUE',
        factory: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entitytype',
        blueprint: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entityblueprint',
        properties: {
          m_bValue: {
            type: 'bool',
            value: true
          }
        }
      })
      this.patch.__constants.BOOL_TRUE = child.id
      return child
    }
    return new Entity(this.patch, id)
  } else {
    const id = this.patch.__constants.BOOL_FALSE
    if(!id) {
      const child = this.addChild({
        name: 'Constant FALSE',
        factory: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entitytype',
        blueprint: '[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entityblueprint',
        properties: {
          m_bValue: {
            type: 'bool',
            value: false
          }
        }
      })
      this.patch.__constants.BOOL_FALSE = child.id
      return child
    }
    return new Entity(this.patch, id)
  }
}

Entity.prototype.getConstantInt = function(value: number): Entity {
  const id = this.patch.__constants.INTS[value]
  if(!id) {
    const child = this.addChild({
      name: `Constant ${value}`,
      factory: '[modules:/zvalueint_basic.class].pc_entitytype',
      blueprint: '[modules:/zvalueint_basic.class].pc_entityblueprint',
      properties: {
        m_nValue: {
          type: 'int32',
          value
        }
      }
    })
    this.patch.__constants.INTS[value] = child.id
    return child
  }
  return new Entity(this.patch, id)
}