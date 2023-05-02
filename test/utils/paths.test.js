import { Location } from '../../dist/src/lib.js'
import { getMissionBrickPath, getMissionTemplatePath, getTemplateFactoryPath } from '../../dist/src/utils/paths.js'
import assert from 'assert'

describe('Path Utilities', () => {
  it('should get temp\'s and tblu\'s of a path', () => {
    const path = getTemplateFactoryPath('[assembly:/_pro/something.entitytemplate].')

    assert.strictEqual(
      path.factory,
      '[assembly:/_pro/something.entitytemplate].pc_entitytype'
    )
    assert.strictEqual(
      path.blueprint,
      '[assembly:/_pro/something.entitytemplate].pc_entityblueprint'
    )
  })

  it('should get a mission brick path', () => {
    assert.deepStrictEqual(
      getMissionBrickPath(Location.Safehouse, 'test'),
      {
        factory: '[assembly:/_pro/scenes/missions/snug/test.brick].pc_entitytype',
        blueprint: '[assembly:/_pro/scenes/missions/snug/test.brick].pc_entityblueprint'
      }
    )
  })

  it('should get a mission template path', () => {
    assert.deepStrictEqual(
      getMissionTemplatePath(Location.Safehouse, 'test'),
      {
        factory: '[assembly:/_pro/scenes/missions/snug/test.entitytemplate].pc_entitytype',
        blueprint: '[assembly:/_pro/scenes/missions/snug/test.entitytemplate].pc_entityblueprint'
      }
    )
  })
})
