import { CommonPaths, getClassPath } from '../../lib.js'
import { IEventTriggers } from '../../types.js'
import { generateRandomEntityID } from '../../utils/entities.js'
import { PatchEntity } from './base.js'

declare module './_index.js' {
  interface PatchEntity {
    getHero(triggers: IEventTriggers): PatchEntity
    setHeroOutfit(outfitRepositoryID: string): PatchEntity
  }
}

PatchEntity.prototype.getHero = function(triggers) {
  const root = (this as PatchEntity).addChild({
    ...CommonPaths.Entity
  })

  root.addOnGameStartListener({
    GetHero: root.addChild({
      ...getClassPath('HeroStandIn'),
      events: {
        Hero: triggers
      }
    })
  })

  return root
}

PatchEntity.prototype.setHeroOutfit = function(outfitRepositoryID: string) {
  const heroOutfitModifierRef = generateRandomEntityID()
  const root = (this as PatchEntity).addChild({
    ...CommonPaths.Entity,
    events: {
      Set: {
        GiveOutfit: heroOutfitModifierRef
      }
    }
  })

  root.getHero({
    SetHero: root.addChild({
      ...getClassPath('HeroOutfitModifier'),
      id: heroOutfitModifierRef,
      properties: {
        m_bIgnoreOutifChange: { // IOI typo
          type: 'bool',
          value: true
        },
        m_RepositoryId: {
          type: 'ZGuid',
          value: outfitRepositoryID
        }
      }
    })
  })

  return root
}
