
import { createEntity, getClassPath, getPath } from '../src/lib.js'

async function main() {
  const entity = createEntity(getPath('[assembly:/pro/bsh/my_cool_entity.entitytemplate]'), 'template')

  const root = entity.addRoot({
    ...getClassPath('SpatialCompositeEntity')
  })

  entity.addEntity({
    parent: null,
    ...getClassPath('entity'),
  })

  const child1 = root.addChild({
    ...getClassPath('Entity'),
    properties: {
      m_rRoot: {
        type: 'SEntityTemplateReference',
        value: root
      }
    },
    events: {
      Test: {
        Test: root
      }
    }
  })

  const bool = root.addBool(true)

  bool.if('OnValue', { Test: child1 })

  await entity.save('./example.entity.json')
}

main()
