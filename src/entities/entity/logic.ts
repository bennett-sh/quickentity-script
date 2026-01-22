import { getClassPath } from "../../lib.js";
import { TRef } from "../../types.js";
import { Entity } from "./base.js";

declare module "./_index.js" {
  interface Entity {
    if(
      trigger: string,
      then: { [key: string]: TRef | TRef[] },
      elseThen?: { [key: string]: TRef | TRef[] },
    ): Entity;
  }
}

Entity.prototype.if = function (
  trigger: string,
  then: { [key: string]: TRef | TRef[] },
  elseThen: { [key: string]: TRef | TRef[] } = {},
) {
  const ifEntity = this.addChild({
    ...getClassPath("LogicIfEntity"),
    events: {
      Then: then,
      Else: elseThen,
    },
  });

  this.addEvent({ when: trigger, do: "If", on: ifEntity });

  return ifEntity;
};
