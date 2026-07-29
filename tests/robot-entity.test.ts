import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { RobotEntity } from "../src/simulation/entities/RobotEntity";
import { RobotObjectMode } from "../src/simulation/entities/RobotEntity";

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

  it("ports ZRobot SetGrenadeAmount as bounded grenade inventory assignment", () => {
    const entity = new RobotEntity({
      id: "robot-set-grenades",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.setGrenadeAmount(99);
    expect(entity.grenadeAmount).toBe(99);

    entity.setGrenadeAmount(-1);
    expect(entity.grenadeAmount).toBe(0);

    entity.setGrenadeAmount(100);
    expect(entity.grenadeAmount).toBe(0);
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

  it("ports ZRobot CanThrowGrenades when the robot carries grenades", () => {
    const entity = new RobotEntity({
      id: "robot-4",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.grenadeAmount = 1;

    expect(entity.canThrowGrenades()).toBe(true);
  });

  it("ports ZRobot CanThrowGrenades through group leader inventory", () => {
    const entity = new RobotEntity({
      id: "robot-5",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const leader = new RobotEntity({
      id: "robot-leader",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    leader.grenadeAmount = 2;
    entity.setGroupLeader(leader);

    expect(entity.canThrowGrenades()).toBe(true);
  });

  it("ports robot object modes used by ZRobot attack state", () => {
    expect(RobotObjectMode.Walking).toBe(4);
    expect(RobotObjectMode.Standing).toBe(5);
    expect(RobotObjectMode.Attacking).toBe(10);
    expect(RobotObjectMode.PickupUpGrenades).toBe(11);
    expect(RobotObjectMode.PickupDownGrenades).toBe(12);
  });

  it("ports ZRobot DoPickupGrenadeAnim guard exits", () => {
    class NoGrenadeRobotEntity extends RobotEntity {
      override canHaveGrenades(): boolean {
        return false;
      }
    }
    const noGrenadeEntity = new NoGrenadeRobotEntity({
      id: "robot-no-grenades",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    noGrenadeEntity.actionIndex = 5;

    noGrenadeEntity.doPickupGrenadeAnim();

    expect(noGrenadeEntity.mode).toBe(RobotObjectMode.Standing);
    expect(noGrenadeEntity.actionIndex).toBe(5);

    const attackingEntity = new RobotEntity({
      id: "robot-attacking",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    attackingEntity.mode = RobotObjectMode.Attacking;
    attackingEntity.actionIndex = 5;

    attackingEntity.doPickupGrenadeAnim();

    expect(attackingEntity.mode).toBe(RobotObjectMode.Attacking);
    expect(attackingEntity.actionIndex).toBe(5);
  });

  it("ports ZRobot DoPickupGrenadeAnim as directional pickup animation start", () => {
    const upEntity = new RobotEntity({
      id: "robot-pickup-up",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    upEntity.direction = 3;
    upEntity.actionIndex = 5;

    upEntity.doPickupGrenadeAnim();

    expect(upEntity.mode).toBe(RobotObjectMode.PickupUpGrenades);
    expect(upEntity.actionIndex).toBe(0);

    const downEntity = new RobotEntity({
      id: "robot-pickup-down",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    downEntity.direction = 4;
    downEntity.actionIndex = 5;

    downEntity.doPickupGrenadeAnim();

    expect(downEntity.mode).toBe(RobotObjectMode.PickupDownGrenades);
    expect(downEntity.actionIndex).toBe(0);
  });

  it("ports ZRobot SetAttackObject as attack mode and timing update", () => {
    const entity = new RobotEntity({
      id: "robot-attacker",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target",
      kind: "vehicle",
      position: { x: 10, y: 0 },
    });
    entity.actionIndex = 5;

    entity.setAttackObject(target, 12);

    expect(entity.getAttackObject()).toBe(target);
    expect(entity.mode).toBe(RobotObjectMode.Attacking);
    expect(entity.actionIndex).toBe(0);
    expect(entity.nextAttackTime).toBeCloseTo(12.1);
  });

  it("ports ZRobot SetAttackObject null target as conditional standing fallback", () => {
    const entity = new RobotEntity({
      id: "robot-clear-attack",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.mode = RobotObjectMode.Attacking;
    entity.setAttackObject(null);
    expect(entity.mode).toBe(RobotObjectMode.Standing);

    entity.mode = RobotObjectMode.Walking;
    entity.setAttackObject(null);
    expect(entity.mode).toBe(RobotObjectMode.Walking);

    entity.mode = RobotObjectMode.Standing;
    entity.setAttackObject(null);
    expect(entity.mode).toBe(RobotObjectMode.Standing);
  });
});
