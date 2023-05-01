
import { createPatch } from '../src/lib.js'

async function main() {
  // these paths will automatically be hashed
  const patch = createPatch(
    '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entitytype',
    '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entityblueprint'
  )

  // create a new entity with a random id & name
  // note: fill in parent, factory & blueprint
  const myEntity0 = patch.addEntity({ parent: '', factory: '', blueprint: '' })

  // create another entity with an event to the previous entity & a property added later
  const myEntity1 = patch.addEntity({
    id: undefined, // or string to specify, otherwise random
    factory: '',
    blueprint: '',
    name: null,
    parent: '',
    events: {
      'In': {
        'Out': myEntity0
      }
    }
  }) // returns an entity object
    .addProperty('m_sUseThisThing', { type: 'SEntityTemplateReference', value: myEntity0.id })

  const aChild = myEntity1.addChild({ factory: '', blueprint: '' })

  // get a few constants
  // note: each constant will be generated once per patch. after that it'll get reused so don't change it's value
  const two = myEntity0.getConstantInt(2)
  const no = myEntity0.getConstantBool(false)
  const yes = myEntity0.getConstantBool(true)

  const thisWillBeSeven = myEntity0.addInt(0)
  const thisWillBeNFive = myEntity0.addInt(0)

  // add two + 5 and store it in thisWillBeSeven
  two.addToConstantNumber('OnValue', 5, {
    SetValue: [thisWillBeSeven]
  })

  // sub two - thisWillBeSeven
  two.subtractFromVariableNumber('OnValue', 'OnValue', thisWillBeSeven, {
    SetValue: [thisWillBeNFive]
  })

  // this will be added everytime it's called so you can modify it's value
  const myChangingBool = aChild.addBool(false)
  const myChangingInt = aChild.addInt(0, 'A cool counter')
  const myTimer = aChild.addTimer(250, { SetTrue: [myChangingBool] })

  // get an existing entity
  // note: my_entity_id is neither a valid entity id nor existing in the agent47_default.entitytemplate
  const existingEntity = patch.getEntity('my_entity_id')

  // chaining works
  existingEntity
    .addEvent({ when: 'EventOccured', do: 'SetTrue', on: [ myEntity0 ] })
    .addProperty('test', { type: 'int32', value: 16 })

  // remove multiple connections at once
  existingEntity.removeEventConnection({ when: 'test', do: 'asd', on: [ myEntity0, myEntity1, 'new' ] })

  patch.addOverrideDelete('testid')
  patch.addOverrideDelete({ externalScene: 'somescene', ref: two })

  patch.addCustomPatch({
    test: existingEntity
  })

  // save the patch
  await patch.save('./example.entity.patch.json')
}

main()
