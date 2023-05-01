# 📝Documentation

### Getting started with a patch
To write a patch you'll first need to import the ```createPatch(...)``` function from the package root like so:
```ts
import { createPatch } from 'quickentity-script';
```
Then call it with the template & blueprint values. Unlike QuickEntity itself, it also supports entering a path instead of a hash.
```ts
const myPatch = createPatch(
  '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entitytype',
  '[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].pc_entityblueprint'
);
```
After you're done building everything you can use the following code to save the file.
```ts
myPatch.save('./my.entity.patch.json', { spaces: 2 /* use spaces = 0 to not format at all */ });
// or use QNPatch::buildPatch to get everything as an object if you need to do more with it
const myBuiltQNPatch = myPatch.buildPatch();
```
By default this will save the file with a 2-space indentation and the QN patch schema included. You can pass an object as the second argument to change this.

### Adding an entity
To add an entity to a patch, simply call `QNPatch::addEntity`. An ID and a name will automatically get generated so you only need to pass the factory, the blueprint and the parent to it.
```ts
const myEntity = patch.addEntity({
  parent: '158cb860b1fce56d',
  factory: '[modules:/zentity.class].pc_entitytype',
  blueprint: '[modules:/zentity.class].pc_entityblueprint'
});
```
If you now want to add a child to the entity above you can use ```Entity::addChild``` to skip the parent property.
```ts
myEntity.addChild({
  factory: '[modules:/zentity.class].pc_entitytype',
  blueprint: '[modules:/zentity.class].pc_entityblueprint'
});
```

### Changing a property on an existing entity
To change a property on an existing object, you'll first need to get the existing object using ```QNPatch::getEntity```. After that you can call ```Entity::setPropertyValue``` with the new value.
```ts
const myEntity = patch.getEntity('51ab3ac12b6d0ef0');

myEntity.setPropertyValue('m_nValue', 10);
```

### Constants
You can use constants to if you want to enter a fixed value into a property that requires a reference. When calling a constant function for the first time, an entity with the given value will be added to the patch. When you then call the function again, that entity will be reused so don't change it's value to prevent issues. If you do want to change the value, you can use ```Entity::addInt```/```Entity::addBool```/... to create a dynamic variable.
```ts
const myEntity = patch.getEntity('facf1234567890AB');

myEntity.setPropertyValue('enabled', myEntity.getConstantBool(true));
myEntity.setPropertyValue('someInt', myEntity.getConstantInt(16));
```

### Variables
Unlike constants, variables will always be freshly added each time you request one, so you're allowed to modify them. If you however do not modify them, it's recommended to use constants instead.
```ts
const myRootEntity = patch.getEntity('facf1234567890AB');
const myDynamicNumber = myEntity.addInt(2); // initialize with 2

myRootEntity.addEvent({ when: 'OnValue', do: 'SetValue', on: myDynamicNumber });
```

### Math
QuickEntity Script also has pre-built functions for quickly doing math operations at runtime.
```ts
const myRootEntity = patch.getEntity('facf1234567890AB');
const myNumber = patch.getEntity('faab202ebba161af');
const result = myEntity.addInt(0); // the result of the math operation will be stored here

// when OnValue on myNumber triggers, add 5 to it and store it in result
myNumber.addToConstantNumber('OnValue', 5, { SetValue: [result] });

// when OnValue on result & myNumber triggers, subtract myNumber from result and store it in result
result.subtractFromVariableNumber('OnValue', 'OnValue', myNumber, { SetValue: [result] });
```

### Conditions
You can use ```Entity::if``` to do an if check.
```ts
const myBool = myEntity.addBool(true)
const myThing = patch.getEntity('faaba1a56ed6c03f')

// if OnValue triggers with true: triggeryes on mything else triggerno on mything
myBool.if('OnValue', { TriggerYes: [myThing] }, { TriggerNo: [myThing] })
```

### Timers
There're a handful of other utility functions in QNS. For example, timers.
```ts
const myRootEntity = patch.getEntity('facf1234567890AB');
// Add a timer triggering 1s after receiving In and then triggering DoSomething on myRootEntity
// Note: you'll still need to manually trigger the In pin of myTimer
const myTimer = myRootEntity.addTimer(1000, { DoSomething: [myRootEntity] });
```

### Custom Patches
*These are currently useless but when QN adds new patch options and this library hasn't implemented them yet, they'll have a use.*

It's not recommended to use this but when you ever need to make a custom patch you can use ```QNPatch::addCustomPatch```. The function requires an object, which will get appended to the patch's ```patch``` array.
```ts
patch.addCustomPatch({
  'SubEntityOperation': [
    '51ab3ac12b6d0ef0': {
      'SetEditorOnly': false
    }
  ]
});
```
*Note: SetEditorOnly is available as ```Entity::setEditorOnly``` so please don't use this example*

## As this was a lot of dull writing down, some patch APIs will still have erros
### Please report them!
