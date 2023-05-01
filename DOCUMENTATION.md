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
const cameraEntity = patch.getEntity('51ab3ac12b6d0ef0');

cameraEntity.setPropertyValue('m_mTransform', {
  rotation: {
    x: 0,
    y: 90,
    z: 0
  },
  position: {
    x: 1,
    y: 1,
    z: 0.5
  }
});
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
