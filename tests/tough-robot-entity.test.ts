import { describe, expect, it } from "vitest";
import {
  processToughRobot,
  ToughRobotEntity,
} from "../src/simulation/entities/ToughRobotEntity";
import { RobotObjectMode } from "../src/simulation/entities/RobotEntity";

describe("tough robot entity", () => {
  it("ports RTough CanPickupGrenades as disabled grenade pickup", () => {
    const entity = new ToughRobotEntity({
      id: "tough-0",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canPickupGrenades()).toBe(false);
  });

  it("ports RTough CanHaveGrenades as disabled grenade inventory", () => {
    const entity = new ToughRobotEntity({
      id: "tough-1",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canHaveGrenades()).toBe(false);
  });

  it("ports RTough CanThrowGrenades as disabled grenade attacks", () => {
    const entity = new ToughRobotEntity({
      id: "tough-2",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canThrowGrenades()).toBe(false);
  });

  it("ports RTough Process as common processing without attack advancement", () => {
    const calls: number[] = [];
    const state = {
      mode: RobotObjectMode.Attacking,
      actionIndex: 1,
      nextAttackTime: 12,
    };

    expect(
      processToughRobot(state, 10, (currentTime) => calls.push(currentTime)),
    ).toBe(1);

    expect(calls).toEqual([10]);
    expect(state).toEqual({
      mode: RobotObjectMode.Attacking,
      actionIndex: 1,
      nextAttackTime: 12,
    });

    state.nextAttackTime = 9;
    state.actionIndex = 0;
    processToughRobot(state, 10, (currentTime) => calls.push(currentTime));
    expect(state.actionIndex).toBe(0);
    expect(state.nextAttackTime).toBe(9);
  });

  it("ports RTough Process as short attack frame timing", () => {
    const state = {
      mode: RobotObjectMode.Attacking,
      actionIndex: 1,
      nextAttackTime: 10,
    };

    processToughRobot(state, 10, () => undefined, () => 50);

    expect(state.actionIndex).toBe(2);
    expect(state.nextAttackTime).toBeCloseTo(10.065);
  });

  it("ports RTough Process as attack wrap and long cooldown timing", () => {
    const state = {
      mode: RobotObjectMode.Attacking,
      actionIndex: 2,
      nextAttackTime: 10,
    };

    processToughRobot(state, 10, () => undefined, () => 50);

    expect(state.actionIndex).toBe(0);
    expect(state.nextAttackTime).toBeCloseTo(10.85);
  });
});
