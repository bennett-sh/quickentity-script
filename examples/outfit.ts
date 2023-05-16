
import { CommonPaths, CommonRoots, createPatch } from '../src/lib.js'

async function main() {
  const patch = createPatch(CommonPaths.Agent47)

  const entity = patch.addEntity({ parent: CommonRoots.Agent47, ...CommonPaths.Entity })

  entity.addOnGameStartListener({
    In: entity.addTimer(1000, {
      Set: entity.setHeroOutfit('4d561409-84d4-4dae-abd2-852cf93471bb')
    })
  })

  await patch.save('./example.entity.patch.json')
}

main()
