import { TLocation, TLocationKey } from './types'

export const Game = {
  // h3 often uses 33ms/30FPS to measure when a frame happened
  ONE_FRAME_MS: 33
}

export const Location: Record<TLocationKey, TLocation> = {
  Dubai: 'golden',
  Dartmoor: 'ancestral',
  Berlin: 'edgy',
  Mendoza: 'elegant',
  Chongqing: 'wet',
  Romania: 'trapped',
  HavenIsland: 'opulent',
  Siberia: 'caged',
  NewYork: 'greedy',
  HantuPort: 'salty',
  Himmelstein: 'hawk',
  IsleOfSgail: 'theark',
  WhittletonCreek: 'skunk',
  Mumbai: 'mumbai',
  SantaFortuna: 'colombia',
  Miami: 'miami',
  HawkesBay: 'sheep',
  Hokkaido: 'hokkaido',
  Colorado: 'colorado',
  Bangkok: 'bangkok',
  Marrakesh: 'marrakesh',
  Sapienza: 'coastaltown',
  Paris: 'paris',
  AmbroseIsland: 'rocky',
  Safehouse: 'snug'
}
