
import { CommonPaths, createPatch } from '../src/lib.js'

async function main() {
  const patch = createPatch(CommonPaths.Agent47)
  const root = patch.addEntity({ parent: '158cb860b1fce56d', ...CommonPaths.Entity });

  // spawn a ICA 19 when the game starts & add it to 47's inventory
  root.spawnItem('73875794-5a86-410e-84a4-1b5b2f7e5a54', { pickupAfterSpawn: true, spawnAfterIntroCutEnd: true })

  await patch.save('./example.entity.patch.json')
}

main()
