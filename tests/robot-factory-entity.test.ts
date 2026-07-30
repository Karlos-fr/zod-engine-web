import { describe, expect, it } from "vitest";
import { RobotFactoryEntity } from "../src/simulation/entities/RobotFactoryEntity";
import type { GameMap } from "../src/world/GameMap";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

describe("robot factory entity", () => {
  it("ports BRobot SetMapImpassables as full footprint blockage", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-0",
      kind: "robot-factory",
      position: { x: 64, y: 80 },
    });
    entity.width = 4;
    entity.height = 5;
    const calls: ImpassableCall[] = [];
    const map = {
      setImpassable(
        x: number,
        y: number,
        impassable?: boolean,
        destroyable?: boolean,
      ) {
        calls.push({ x, y, impassable, destroyable });
      },
    } as GameMap;

    entity.setMapImpassables(map);

    expect(calls).toEqual([
      { x: 4, y: 5, impassable: undefined, destroyable: undefined },
      { x: 4, y: 6, impassable: undefined, destroyable: undefined },
      { x: 4, y: 7, impassable: undefined, destroyable: undefined },
      { x: 4, y: 8, impassable: undefined, destroyable: undefined },
      { x: 4, y: 9, impassable: undefined, destroyable: undefined },
      { x: 5, y: 5, impassable: undefined, destroyable: undefined },
      { x: 5, y: 6, impassable: undefined, destroyable: undefined },
      { x: 5, y: 7, impassable: undefined, destroyable: undefined },
      { x: 5, y: 8, impassable: undefined, destroyable: undefined },
      { x: 5, y: 9, impassable: undefined, destroyable: undefined },
      { x: 6, y: 5, impassable: undefined, destroyable: undefined },
      { x: 6, y: 6, impassable: undefined, destroyable: undefined },
      { x: 6, y: 7, impassable: undefined, destroyable: undefined },
      { x: 6, y: 8, impassable: undefined, destroyable: undefined },
      { x: 6, y: 9, impassable: undefined, destroyable: undefined },
      { x: 7, y: 5, impassable: undefined, destroyable: undefined },
      { x: 7, y: 6, impassable: undefined, destroyable: undefined },
      { x: 7, y: 7, impassable: undefined, destroyable: undefined },
      { x: 7, y: 8, impassable: undefined, destroyable: undefined },
      { x: 7, y: 9, impassable: undefined, destroyable: undefined },
    ]);
  });

  it("ports BRobot CanSetRallypoints as enabled rally points", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-1",
      kind: "robot-factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetRallypoints()).toBe(true);
  });

  it("ports BRobot ProducesUnits as enabled unit production", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-2",
      kind: "robot-factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.producesUnits()).toBe(true);
  });

  it("ports BRobot GetCraneEntrance as the fixed point below the building", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-3",
      kind: "robot-factory",
      position: { x: 96, y: 128 },
    });
    entity.pixelHeight = 64;

    expect(entity.getCraneEntrance()).toEqual({
      canEnter: true,
      x: 131,
      y: 224,
      exitX: 131,
      exitY: 224,
    });
  });

  it("ports BRobot GetCraneCenter as the fixed crane interaction point", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-4",
      kind: "robot-factory",
      position: { x: 96, y: 128 },
    });

    expect(entity.getCraneCenter()).toEqual({
      hasCenter: true,
      x: 131,
      y: 160,
    });
  });
});
