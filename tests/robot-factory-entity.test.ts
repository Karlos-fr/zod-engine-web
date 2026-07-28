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
});
