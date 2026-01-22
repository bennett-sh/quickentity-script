import { CommonPaths, getClassPath } from "../../lib.js";
import type {
  IEventTriggers,
  ITransform,
  TRef,
  TRoomBehaviour,
} from "../../types.js";
import { PatchEntity } from "./base.js";

export interface IItemSpawnerConfig {
  // built-in item spawner props
  transform: ITransform;
  parent: TRef;
  usePlacementAttach: boolean;
  spawnOnStart: boolean;
  roomBehaviour: TRoomBehaviour;
  visible: boolean;
  isPrivate: boolean;
  visibleInBoxReflection: boolean;
  onItem: IEventTriggers;
  onItemReady: IEventTriggers;

  // custom options
  spawnAfterIntroCutEnd: boolean;
  pickupAfterSpawn: boolean;
}

declare module "./_index.js" {
  interface PatchEntity {
    spawnItem(repositoryID: string, config?: Partial<IItemSpawnerConfig>);
    getItemKey(repositoryID: string): PatchEntity;
  }
}

PatchEntity.prototype.getItemKey = function (repositoryID) {
  return (this as PatchEntity).addChild({
    ...getClassPath("ItemRepositoryKeyEntity"),
    properties: {
      m_RepositoryId: {
        type: "ZGuid",
        value: repositoryID,
      },
    },
  });
};

PatchEntity.prototype.spawnItem = function (repositoryID, config = {}) {
  const root = (this as PatchEntity).addChild({ ...CommonPaths.Entity });
  const itemKey = root.getItemKey(repositoryID);
  const spawner = root.addChild({
    ...getClassPath("ItemSpawner"),
    properties: {
      m_mTransform: {
        type: "SMatrix43",
        value: config.transform ?? {
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
        },
      },
      m_eidParent: {
        type: "SEntityTemplateReference",
        value: config.parent ?? this.id,
      },
      m_bUsePlacementAttach: {
        type: "bool",
        value: config.usePlacementAttach ?? false,
      },
      m_rMainItemKey: {
        type: "SEntityTemplateReference",
        value: itemKey,
      },
      m_bSpawnOnStart: {
        type: "bool",
        value: config.spawnOnStart ?? false,
      },
      m_eRoomBehaviour: {
        type: "ZSpatialEntity.ERoomBehaviour",
        value: config.roomBehaviour ?? "ROOM_STATIC",
      },
      m_bVisible: {
        type: "bool",
        value: config.visible ?? true,
      },
      m_bIsPrivate: {
        type: "bool",
        value: config.isPrivate ?? false,
      },
      m_bVisibleInBoxReflection: {
        type: "bool",
        value: config.visibleInBoxReflection ?? true,
      },
    },
    events: {
      Item: config.onItem ?? {},
      ItemReady: config.onItemReady ?? {},
    },
  });

  if (config.pickupAfterSpawn) {
    const itemAction = root.addChild({
      ...getClassPath("HeroItemAction"),
      properties: {
        m_rKeywordsToFind: {
          type: "SEntityTemplateReference",
          value: itemKey,
        },
      },
    });

    spawner.addEvent({ when: "Item", do: "SetItem", on: itemAction });
    spawner.addEvent({
      when: "ItemReady",
      do: "PickupIntoPocket",
      on: itemAction,
    });
  }

  if (config.spawnAfterIntroCutEnd) {
    root.addOnGameStartListener({ SpawnItem: spawner });
  }
};
