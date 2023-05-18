
import { CommonPaths, CommonRoots, createPatch } from '../src/lib.js'

async function main() {
  const patch = createPatch(CommonPaths.Agent47)

  const entity = patch.addEntity({ parent: CommonRoots.Agent47, ...CommonPaths.Entity })

  entity.setHeroOutfit('4d561409-84d4-4dae-abd2-852cf93471bb', modifier => ({
    In: entity.addTimer(100, {
      SetOutfit: modifier
    })
  }))

  await patch.save('./example.entity.patch.json')
}

main()
