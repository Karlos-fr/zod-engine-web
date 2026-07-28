import { describe, expect, it } from "vitest";
import { RobotEntity } from "../src/simulation/entities/RobotEntity";

describe("robot entity", () => {
  it("ports ZRobot CanSetWaypoints as enabled waypoint orders", () => {
    const entity = new RobotEntity({
      id: "robot-waypoint",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetWaypoints()).toBe(true);
  });

  it("ports ZRobot GetGrenadeAmount from the robot inventory", () => {
    const entity = new RobotEntity({
      id: "robot-0",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.grenadeAmount = 4;

    expect(entity.getGrenadeAmount()).toBe(4);
  });

  it("ports ZRobot CanHaveGrenades as enabled grenade inventory", () => {
    const entity = new RobotEntity({
      id: "robot-3",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canHaveGrenades()).toBe(true);
  });

  it("ports ZRobot CanPickupGrenades when no grenades are carried", () => {
    const entity = new RobotEntity({
      id: "robot-1",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canPickupGrenades()).toBe(true);
  });

  it("ports ZRobot CanPickupGrenades when grenades are already carried", () => {
    const entity = new RobotEntity({
      id: "robot-2",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.grenadeAmount = 2;

    expect(entity.canPickupGrenades()).toBe(false);
  });
});
