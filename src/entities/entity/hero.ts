import { CommonPaths, getClassPath } from '../../lib.js'
import { IEventTriggers } from '../../types.js'
import { generateRandomEntityID } from '../../utils/entities.js'
import { normalizeToHash } from '../../utils/hash.js'
import { Entity } from './base.js'

declare module './_index.js' {
  interface Entity {
    getHero(triggers: IEventTriggers): Entity
    setHeroOutfit(outfitRepositoryID: string): Entity
  }
}

Entity.prototype.getHero = function(triggers) {
  const root = (this as Entity).addChild({
    ...CommonPaths.Entity
  })

  root.addOnGameStartListener({
    GetHero: root.addChild({
      ...getClassPath('HeroStandIn'),
      events: {
        Hero: {
          Hero: root
        }
      }
    })
  })

  return root
}

Entity.prototype.setHeroOutfit = function(outfitRepositoryID: string) {
  const heroOutfitModifierRef = generateRandomEntityID()
  const root = (this as Entity).addChild({
    ...CommonPaths.Entity,
    events: {
      SetOutfit: {
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
