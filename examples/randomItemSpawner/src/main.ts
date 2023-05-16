import { CommonPaths, createEntity, getClassPath, getPath } from '../../../dist/src/lib.js'
import { RepositoryGroup } from 'repository-script'

// NOTE: this is incomplete/not working

async function main() {
  const entity = createEntity(getPath('[assembly:/_pro/bsh/random_item_spawner?/all.entitytemplate]'), 'template')
  const root = entity.addRoot({ ...CommonPaths.SpatialEntity, name: 'Random Item Spawner' })
  const itemsContainer = root.addChild({ ...CommonPaths.Entity, name: 'Items' })

  const repositoryItems = [
    ...RepositoryGroup.AssaultRifles
  ]

  const itemKeys = repositoryItems.map(item => itemsContainer.addChild({
    ...getClassPath('ItemRepositoryKeyEntity'),
    properties: {
      m_RepositoryId: {
        type: 'ZGuid',
        value: item
      }
    }
  }))

  const itemSpawners = itemKeys.map(item => item.addChild({
    ...getClassPath('ItemSpawner'),
    properties: {
      m_eidParent: {
        type: 'SEntityTemplateReference',
        value: root
      },
      m_rMainItemKey: {
        type: 'SEntityTemplateReference',
        value: item
      },
      m_bVisible: {
        type: 'bool',
        value: false
      },
      m_bSpawnOnStart: {
        type: 'bool',
        value: false
      }
    }
  }))

  root.randomAction(
    itemSpawners.map(spawner => ({
      SpawnItem: spawner
    }))
  )

  await entity.save('random_item_spawner.entity.json')
}

main()
