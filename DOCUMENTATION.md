# 📝Documentation

### Getting started with a patch
To write a patch you'll first need to import the ```createPatch(...)``` function from the package root like so:
```ts
import { createPatch } from 'quickentity-script';
```
Then call it with the template & blueprint values. Unlike QuickEntity itself, it also supports entering a path instead of a hash.
```ts
const myPatch = createPatch(
  '[modules:/zentity.class].pc_entitytype',
  '[modules:/zentity.class].pc_entityblueprint'
);
```
After you're done building everything you can use the following code to save the file.
```ts
myPatch.save('./my.entity.patch.json', { spaces: 0 /* use spaces = 0 to not format at all */ });
// or use QNPatch::buildPatch to get everything as an object if you need to do more with it
const myBuiltQNPatch = myPatch.buildPatch(buildPatch);
```
By default this will save the file with a 2-space indentation and the QN patch schema included. You can pass an object as the second argument to change this.

### Adding an entity
To add an entity to a patch, simply call `QNPatch::addEntity`. An ID and a name will automatically get generated so you only need to pass the factory, the blueprint and the parent to it.
```ts
const myEntity = patch.addEntity({
  parent: 'feed1234567890AB',
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
const myEntity = patch.getEntity('facf1234567890AB');

myEntity.setPropertyValue('m_nValue', 10);
```

### How to use patch options that aren't yet implemented?
A few patch options aren't implemented yet so if you're project depends on these APIs, you can use custom patches.
```ts
patch.addCustomPatch({
  'SubEntityOperation': [
    'someid': {
      'SetEditorOnly': false
    }
  ]
});
```
*Note: SetEditorOnly is available (```Entity::setEditorOnly```) so please don't use this example*

## As this was a lot of dull writing down, some patch APIs will still have erros
### Please report them!
