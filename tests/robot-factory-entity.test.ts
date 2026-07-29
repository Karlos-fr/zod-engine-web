import { describe, expect, it } from "vitest";
import { RobotFactoryEntity } from "../src/simulation/entities/RobotFactoryEntity";

describe("robot factory entity", () => {
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
