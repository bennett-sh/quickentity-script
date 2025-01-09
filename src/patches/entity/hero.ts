import { generateRandomEntityID } from '../../utils/entities.js'
import { CommonPaths, getClassPath } from '../../lib.js'
import type { ICreateChildEntity, IEventTriggers } from '../../types.js'
import { PatchEntity } from './base.js'
import { deepMerge } from '../../utils/json.js'

declare module './_index.js' {
  interface PatchEntity {
    getHero(triggers: IEventTriggers, entityConfig?: Partial<ICreateChildEntity>): PatchEntity
    setHeroOutfit(outfitRepositoryID: string, onHero?: (root: PatchEntity) => IEventTriggers): PatchEntity
  }
}

PatchEntity.prototype.getHero = function(triggers: IEventTriggers, entityConfig?: Partial<ICreateChildEntity>) {
  const heroStandIn = (this as PatchEntity).addChild({
    ...entityConfig ?? {},
    ...getClassPath('HeroStandIn'),
    events: {
      Hero: {
        ...triggers
      }
    }
  })

  heroStandIn.addOnGameStartListener({
    In: heroStandIn.addTimer({
      time: { seconds: 1 },
      outputs: {
        GetHero: heroStandIn
      }
    })
  })

  return heroStandIn
}

PatchEntity.prototype.setHeroOutfit = function(outfitRepositoryID: string, onHero?: (root: PatchEntity) => IEventTriggers) {
  const heroOutfitModifierRef = generateRandomEntityID()
  const heroStandInRef = generateRandomEntityID()
  const root = (this as PatchEntity).addChild({
    ...CommonPaths.Entity,
    events: {
      SetOutfit: {
        GiveOutfit: heroOutfitModifierRef
      }
    }
  })

  root.addChild({
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

  let onHeroTriggers = {}
  if(onHero) onHeroTriggers = onHero(root)
  if(onHeroTriggers?.hasOwnProperty('SetHero')) console.warn('WARN: you can\'t use SetHero on setHeroOutfit->onHero')

  root.getHero(deepMerge(
    onHeroTriggers,
    {
      SetHero: heroStandInRef
    }
  ), { id: heroStandInRef })

  return root
}
