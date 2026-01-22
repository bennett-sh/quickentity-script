import { IPath, IQNEntity, TSubType } from "../types.js";
import { QNEntity } from "./QNEntity.js";

export function createEntity(path: IPath, subType: TSubType): QNEntity {
  return new QNEntity({
    ...path,
    subType,
  });
}

export function loadEntity(entity: IQNEntity): QNEntity {
  return new QNEntity(entity);
}
