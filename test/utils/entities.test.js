import { generateRandomEntityID, ENTITY_ID_PREFIX, deepEnsureID, outputsToEvent } from '../../dist/src/utils/entities.js'
import { createPatch } from '../../dist/src/lib.js'
import assert from 'assert'
import sinon from 'sinon'

describe('Generate Entity Data', () => {
  beforeEach(() => {
    sinon.stub(Math, 'random').returns(0.5)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should generate a random entity id', () => {
    assert.equal(
      generateRandomEntityID(),
      `${ENTITY_ID_PREFIX}${'8'.repeat(16 - ENTITY_ID_PREFIX.length)}`
    )
  })
})

describe('Deep Ensure ID', () => {
  it('should replace all entities with their id', () => {
    const patch = createPatch('', '')
    const testEntity1 = patch.addEntity({ parent: '', factory: '', blueprint: '' })
    const testEntity2 = patch.addEntity({ parent: '', factory: '', blueprint: '' })

    assert.equal(
      JSON.stringify(deepEnsureID({
        a: testEntity1,
        test: {
          asd: testEntity2,
        }
      })),
      JSON.stringify({
        a: testEntity1.id,
        test: {
          asd: testEntity2.id,
        }
      })
    )
  })
})

describe('Ensure Event Output ID', () => {
  it('should replace everything with their id', () => {
    const patch = createPatch('', '')
    const testEntity1 = patch.addEntity({ parent: '', factory: '', blueprint: '' })
    const testEntity2 = patch.addEntity({ parent: '', factory: '', blueprint: '' })

    assert(
      JSON.stringify(outputsToEvent({
        In: [testEntity1, testEntity2],
        Test: testEntity2
      })),
      JSON.stringify({
        In: [testEntity1.id, testEntity2.id],
        Test: [testEntity2.id]
      })
    )
  })
})
