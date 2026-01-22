import { IPath, TLocation } from "../lib";

export function getPath(basePath: string): IPath {
  return {
    factory: basePath + ".pc_entitytype",
    blueprint: basePath + ".pc_entityblueprint",
  };
}

export const getClassPath = (clazz: string) =>
  getPath(`[modules:/z${clazz.toLowerCase()}.class]`);

export function getMissionBrickPath(location: TLocation, sub: string): IPath {
  return getPath(`[assembly:/_pro/scenes/missions/${location}/${sub}.brick]`);
}

export function getMissionTemplatePath(
  location: TLocation,
  sub: string,
): IPath {
  return getPath(
    `[assembly:/_pro/scenes/missions/${location}/${sub}.entitytemplate]`,
  );
}
