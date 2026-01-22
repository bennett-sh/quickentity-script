import { IPath } from "../types.js";
import { normalizeToHash } from "../utils/hash.js";
import { QNPatch } from "./QNPatch.js";

export function createPatch(path: IPath): QNPatch;
export function createPatch(factory: string, blueprint: string): QNPatch;
export function createPatch(
  template: string | IPath,
  blueprint?: string,
): QNPatch {
  if ((template as IPath)?.factory && (template as IPath)?.blueprint) {
    template = template as IPath;
    return new QNPatch(
      normalizeToHash(template.factory),
      normalizeToHash(template.blueprint),
    );
  }

  return new QNPatch(
    normalizeToHash(template as string),
    normalizeToHash(blueprint),
  );
}
