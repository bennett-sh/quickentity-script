import { getMissionBrickPath, getTemplateFactoryPath } from './utils/paths.js'
import { Location } from './game.js'

export const CommonPaths = {
  GlobalData: getTemplateFactoryPath('[assembly:/_pro/scenes/bricks/globaldata.brick].'),
  GlobalData_Base: getTemplateFactoryPath('[assembly:/_pro/scenes/bricks/globaldatabase.brick].'),
  GlobalData_S2: getTemplateFactoryPath('[assembly:/_pro/scenes/bricks/globaldata_s2.brick].'),
  GlobalData_S3: getTemplateFactoryPath('[assembly:/_pro/scenes/bricks/globaldata_s3.brick].'),

  Agent47_Default: getTemplateFactoryPath('[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate].'),

  Safehouse: getMissionBrickPath(Location.Safehouse, 'mission_vanilla')
}