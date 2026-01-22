import { Location } from "./game.js";
import { getClassPath, getMissionBrickPath, getPath } from "./utils/paths.js";

export const CommonPaths = {
  GlobalData: getPath("[assembly:/_pro/scenes/bricks/globaldata.brick]"),
  GlobalData_Base: getPath(
    "[assembly:/_pro/scenes/bricks/globaldatabase.brick]",
  ),
  GlobalData_S2: getPath("[assembly:/_pro/scenes/bricks/globaldata_s2.brick]"),
  GlobalData_S3: getPath("[assembly:/_pro/scenes/bricks/globaldata_s3.brick]"),

  Agent47: getPath(
    "[assembly:/_pro/characters/templates/hero/agent47/agent47.template?/agent47_default.entitytemplate]",
  ),
  NPC: getPath(
    "[assembly:/templates/gameplay/ai2/actors.template?/npcactor.entitytemplate]",
  ),

  Safehouse: getMissionBrickPath(Location.Safehouse, "mission_vanilla"),
  EvergreenSetup: getPath(
    "[assembly:/_pro/scenes/bricks/evergreen_setup.brick]",
  ),

  GameEventListener: getClassPath("GameEventListenerEntity"),
  SignalOnce_Void: getClassPath("VoidSignalOnceEntity"),

  Entity: getClassPath("Entity"),
  SpatialEntity: getClassPath("SpatialEntity"),
  CompositeEntity: getClassPath("CompositeEntity"),
  TokenIdentity: getClassPath("TokenIdentity"),
  CameraEntity: getClassPath("CameraEntity"),
};
