import { IPath, TLocation } from '../lib'

export function getTemplateFactoryPath(basePath: string): IPath {
  return {
    factory: basePath + 'pc_entitytype',
    blueprint: basePath + 'pc_entityblueprint'
  }
}

export function getMissionBrickPath(location: TLocation, sub: string): IPath {
  return getTemplateFactoryPath(
    `[assembly:/_pro/scenes/missions/${location}/${sub}.brick].`
  )
}

export function getMissionTemplatePath(location: TLocation, sub: string): IPath {
  return getTemplateFactoryPath(
    `[assembly:/_pro/scenes/missions/${location}/${sub}.entitytemplate].`
  )
}
