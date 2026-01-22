import { getClassPath } from "../../lib.js";
import { IEventTriggers, TRef } from "../../types.js";
import { ensurePatchEntity, outputsToEvent } from "../../utils/entities.js";
import { PatchEntity } from "./_index.js";

declare module "./_index.js" {
  interface PatchEntity {
    addToConstantNumber(
      when: string,
      add: number,
      outputs: IEventTriggers,
    ): PatchEntity;
    addToVariableNumber(
      whenA: string,
      whenB: string,
      b: TRef,
      outputs: IEventTriggers,
    ): PatchEntity;

    subtractFromConstantNumber(
      when: string,
      add: number,
      outputs: IEventTriggers,
    ): PatchEntity;
    subtractFromVariableNumber(
      whenA: string,
      whenB: string,
      b: TRef,
      outputs: IEventTriggers,
    ): PatchEntity;

    multiplyWithConstantNumber(
      when: string,
      mul: number,
      outputs: IEventTriggers,
    ): PatchEntity;
    multiplyWithVariableNumber(
      whenA: string,
      whenB: string,
      b: TRef,
      outputs: IEventTriggers,
    ): PatchEntity;

    divideByConstantNumber(
      when: string,
      div: number,
      outputs: IEventTriggers,
    ): PatchEntity;
    divideByVariableNumber(
      whenA: string,
      whenB: string,
      b: TRef,
      outputs: IEventTriggers,
    ): PatchEntity;
  }
}

PatchEntity.prototype.addToConstantNumber = function (
  when: string,
  add: number,
  outputs: IEventTriggers,
): PatchEntity {
  const addEntity = this.addChild({
    ...getClassPath("MathAddSubtract"),
    properties: {
      m_fA: {
        type: "float32",
        value: add,
      },
      m_bSubtract: {
        type: "bool",
        value: false,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when, do: "B", on: addEntity });

  return addEntity;
};

PatchEntity.prototype.addToVariableNumber = function (
  whenA: string,
  whenB: string,
  b: TRef,
  outputs: IEventTriggers,
): PatchEntity {
  const addEntity = this.addChild({
    ...getClassPath("MathAddSubtract"),
    properties: {
      m_bSubtract: {
        type: "bool",
        value: false,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when: whenA, do: "A", on: addEntity });
  ensurePatchEntity(this.patch, b).addEvent({
    when: whenB,
    do: "B",
    on: addEntity,
  });

  return addEntity;
};

PatchEntity.prototype.subtractFromConstantNumber = function (
  when: string,
  add: number,
  outputs: IEventTriggers,
): PatchEntity {
  const addEntity = this.addChild({
    ...getClassPath("MathAddSubtract"),
    properties: {
      m_fA: {
        type: "float32",
        value: add,
      },
      m_bSubtract: {
        type: "bool",
        value: true,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when, do: "B", on: addEntity });

  return addEntity;
};

PatchEntity.prototype.subtractFromVariableNumber = function (
  whenA: string,
  whenB: string,
  b: TRef,
  outputs: IEventTriggers,
): PatchEntity {
  const addEntity = this.addChild({
    ...getClassPath("MathAddSubtract"),
    properties: {
      m_bSubtract: {
        type: "bool",
        value: true,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when: whenA, do: "A", on: addEntity });
  ensurePatchEntity(this.patch, b).addEvent({
    when: whenB,
    do: "B",
    on: addEntity,
  });

  return addEntity;
};

PatchEntity.prototype.multiplyWithConstantNumber = function (
  when: string,
  mul: number,
  outputs: IEventTriggers,
): PatchEntity {
  const mulEntity = this.addChild({
    ...getClassPath("MathMultiplyDivide"),
    properties: {
      m_fA: {
        type: "float32",
        value: mul,
      },
      m_bDivide: {
        type: "bool",
        value: false,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when, do: "B", on: mulEntity });

  return mulEntity;
};

PatchEntity.prototype.multiplyWithVariableNumber = function (
  whenA: string,
  whenB: string,
  b: TRef,
  outputs: IEventTriggers,
): PatchEntity {
  const mulEntity = this.addChild({
    ...getClassPath("MathMultiplyDivide"),
    properties: {
      m_bDivide: {
        type: "bool",
        value: false,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when: whenA, do: "A", on: mulEntity });
  ensurePatchEntity(this.patch, b).addEvent({
    when: whenB,
    do: "B",
    on: mulEntity,
  });

  return mulEntity;
};

PatchEntity.prototype.divideByConstantNumber = function (
  when: string,
  div: number,
  outputs: IEventTriggers,
): PatchEntity {
  const divEntity = this.addChild({
    ...getClassPath("MathMultiplyDivide"),
    properties: {
      m_fA: {
        type: "float32",
        value: div,
      },
      m_bDivide: {
        type: "bool",
        value: true,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when, do: "B", on: divEntity });

  return divEntity;
};

PatchEntity.prototype.divideByVariableNumber = function (
  whenA: string,
  whenB: string,
  b: TRef,
  outputs: IEventTriggers,
): PatchEntity {
  const divEntity = this.addChild({
    ...getClassPath("MathMultiplyDivide"),
    properties: {
      m_bDivide: {
        type: "bool",
        value: true,
      },
    },
    events: {
      Out: outputsToEvent(outputs),
    },
  });

  this.addEvent({ when: whenA, do: "A", on: divEntity });
  ensurePatchEntity(this.patch, b).addEvent({
    when: whenB,
    do: "B",
    on: divEntity,
  });

  return divEntity;
};
