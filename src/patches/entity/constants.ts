import { getClassPath } from "../../lib.js";
import { PatchEntity } from "./base.js";

declare module "./_index.js" {
  interface PatchEntity {
    getConstantInt(value: number): PatchEntity;
    getConstantBool(value: boolean): PatchEntity;
  }
}

PatchEntity.prototype.getConstantBool = function (value: boolean): PatchEntity {
  if (value) {
    const id = this.patch.__constants.BOOL_TRUE;
    if (!id) {
      const child = this.addChild({
        name: "Constant TRUE",
        factory:
          "[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entitytype",
        blueprint:
          "[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entityblueprint",
        properties: {
          m_bValue: {
            type: "bool",
            value: true,
          },
        },
      });
      this.patch.__constants.BOOL_TRUE = child.id;
      return child;
    }
    return new PatchEntity(this.patch, id);
  } else {
    const id = this.patch.__constants.BOOL_FALSE;
    if (!id) {
      const child = this.addChild({
        name: "Constant FALSE",
        factory:
          "[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entitytype",
        blueprint:
          "[assembly:/_pro/design/logic/valuebool.template?/valuebool_basic.entitytemplate].pc_entityblueprint",
        properties: {
          m_bValue: {
            type: "bool",
            value: false,
          },
        },
      });
      this.patch.__constants.BOOL_FALSE = child.id;
      return child;
    }
    return new PatchEntity(this.patch, id);
  }
};

PatchEntity.prototype.getConstantInt = function (value: number): PatchEntity {
  const id = this.patch.__constants.INTS[value];
  if (!id) {
    const child = this.addChild({
      name: `Constant ${value}`,
      ...getClassPath("ValueInt_Basic"),
      properties: {
        m_nValue: {
          type: "int32",
          value,
        },
      },
    });
    this.patch.__constants.INTS[value] = child.id;
    return child;
  }
  return new PatchEntity(this.patch, id);
};
