import { createPatch } from '../dist/src/lib.js'
import { readFile, rm } from 'fs/promises'
import assert from 'assert'

describe('Simple Patch', () => {
  const patch = createPatch('00C175B9C0F1B6A8', 'b')

  it('should not hash factory', () => {
    assert(patch.buildPatch().tempHash, '00C175B9C0F1B6A8')
  })
  it('should hash blueprint', () => {
    assert(patch.buildPatch().tbluHash, '00EB5FFEE6AE2FEC')
  })

  const root = patch.addEntity({ factory: '[modules:/zentity.class].pc_entitytype', blueprint: '[modules:/zentity.class].pc_entityblueprint', id: 'faabe06eb9659c2d', name: 'Root', parent: 'ffffffffffffffff' })

  it('should create root entity', () => {
    const build = patch.buildPatch()

    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('AddEntity')
          && x.AddEntity[0] === 'faabe06eb9659c2d'
          && x.AddEntity[1].name === 'Root'
      )
    )
  })

  const CONSTANT_ONE = root.getConstantInt(1)
  const CONSTANT_TRUE = root.getConstantBool(true)

  it('should create constants', () => {
    const build = patch.buildPatch()

    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('AddEntity')
          && x.AddEntity[0] === CONSTANT_ONE.id
          && x.AddEntity[1]?.properties?.m_nValue?.value === 1
      )
    )
    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('AddEntity')
          && x.AddEntity[0] === CONSTANT_TRUE.id
          && x.AddEntity[1]?.properties?.m_bValue?.value === true
      )
    )
  })

  const result = root.addInt(0)
  const onePlusTwo = CONSTANT_ONE.addToConstantNumber('OnValue', 2, { SetValue: result })

  it('should add calculations', () => {
    const build = patch.buildPatch()

    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('AddEntity')
          && x.AddEntity?.[0] === onePlusTwo.id
          && x.AddEntity?.[1]?.properties?.m_fA?.value === 2
          && x.AddEntity?.[1]?.properties?.m_bSubtract?.value === false
          && x.AddEntity?.[1]?.events?.Out?.SetValue?.[0] === result.id
      )
    )
    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('AddEntity')
          && x.AddEntity?.[0] === result.id
          && x.AddEntity?.[1]?.properties?.m_nValue?.value === 0
      )
    )
  })

  const someBool = root.addBool(false)
  const timer = root.addTimer(1250, { SetTrue: someBool })

  it('should add timers', () => {
    const build = patch.buildPatch()

    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('AddEntity')
          && x.AddEntity?.[0] === someBool.id
          && x.AddEntity?.[1]?.properties?.m_bValue?.value === false
      )
    )
    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('AddEntity')
          && x.AddEntity?.[0] === timer.id
          && x.AddEntity?.[1]?.properties?.['Delay time (ms)']?.value === 1250
          && x.AddEntity?.[1]?.properties?.m_bEnabled?.value === true
      )
    )
  })

  timer.addEvent({ when: 'Some', do: 'Other', on: someBool })

  it('should add events', () => {
    const build = patch.buildPatch()

    assert.ok(
      build.patch.some(
        x =>
          x.hasOwnProperty('SubEntityOperation')
          && x.SubEntityOperation?.[0] === timer.id
          && x.SubEntityOperation?.[1]?.hasOwnProperty('AddEventConnection')
          && x.SubEntityOperation[1].AddEventConnection[0] === 'Some'
          && x.SubEntityOperation[1].AddEventConnection[1] === 'Other'
          && x.SubEntityOperation[1].AddEventConnection[2] === someBool.id
      )
    )
  })

  it('should save', async () => {
    await patch.save('./_test.entity.patch.json', { spaces: 0, includeSchema: false })

    assert.ok(
      JSON.parse(await readFile('./_test.entity.patch.json', { encoding: 'utf-8' }))
    )

    await rm('./_test.entity.patch.json')
  })
})
