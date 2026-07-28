import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { DamageMissile } from "../src/simulation/ProjectileConstants";
import { TeamType } from "../src/simulation/SimulationConstants";

describe("GameEntity", () => {
  it("sets the last AI build time", () => {
    const entity = new GameEntity({
      id: "factory-1",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    entity.setLastAiBuildTime(12.5);

    expect(entity.getLastAiBuildTime()).toBe(12.5);
  });

  it("gets the initial health percentage", () => {
    const entity = new GameEntity({
      id: "tank-1",
      kind: "tank",
      position: { x: 0, y: 0 },
    });
    entity.initialHealthPercent = 75;

    expect(entity.getInitialHealthPercent()).toBe(75);
  });

  it("returns a copy of its coordinates", () => {
    const entity = new GameEntity({
      id: "robot-1",
      kind: "robot",
      position: { x: 4, y: 9 },
    });

    const coordinates = entity.getCoordinates();
    coordinates.x = 100;

    expect(entity.position).toEqual({ x: 4, y: 9 });
  });

  it("gets its attack radius", () => {
    const entity = new GameEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    entity.attackRadius = 160;

    expect(entity.getAttackRadius()).toBe(160);
  });

  it("allows base under-cursor attack targeting", () => {
    const entity = new GameEntity({
      id: "cannon-2",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(entity.underCursorCanAttack(12, 18)).toBe(true);
  });

  it("rejects base under-cursor fort entry targeting", () => {
    const entity = new GameEntity({
      id: "fort-1",
      kind: "fort",
      position: { x: 0, y: 0 },
    });

    expect(entity.underCursorFortCanEnter(12, 18)).toBe(false);
  });

  it("gets the base grenade amount", () => {
    const entity = new GameEntity({
      id: "robot-5",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.getGrenadeAmount()).toBe(0);
  });

  it("keeps grenade amount unchanged for the base entity", () => {
    const entity = new GameEntity({
      id: "robot-11",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.setGrenadeAmount(3);

    expect(entity.getGrenadeAmount()).toBe(0);
  });

  it("reports the base grenade attack capability", () => {
    const entity = new GameEntity({
      id: "robot-7",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canThrowGrenades()).toBe(false);
  });

  it("reports the base grenade inventory capability", () => {
    const entity = new GameEntity({
      id: "robot-8",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canHaveGrenades()).toBe(false);
  });

  it("reports the base grenade pickup capability", () => {
    const entity = new GameEntity({
      id: "robot-10",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canPickupGrenades()).toBe(false);
  });

  it("keeps the base grenade pickup animation hook empty", () => {
    const entity = new GameEntity({
      id: "robot-9",
      kind: "robot",
      position: { x: 3, y: 4 },
    });

    entity.doPickupGrenadeAnim();

    expect(entity.getCoordinates()).toEqual({ x: 3, y: 4 });
  });

  it("keeps the base track-drop hook empty", () => {
    const entity = new GameEntity({
      id: "vehicle-1",
      kind: "vehicle",
      position: { x: 8, y: 9 },
    });

    entity.tryDropTracks();

    expect(entity.getCoordinates()).toEqual({ x: 8, y: 9 });
  });

  it("reports the base damaged state", () => {
    const entity = new GameEntity({
      id: "robot-6",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.showDamaged()).toBe(false);
  });

  it("reports the base partially damaged state", () => {
    const entity = new GameEntity({
      id: "robot-9",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.showPartiallyDamaged()).toBe(false);
  });

  it("reports the base destroyable impassable state", () => {
    const entity = new GameEntity({
      id: "barrier-1",
      kind: "barrier",
      position: { x: 0, y: 0 },
    });

    expect(entity.isDestroyableImpassable()).toBe(false);
  });

  it("reports that the base entity does not cause impassability at coordinates", () => {
    const entity = new GameEntity({
      id: "barrier-2",
      kind: "barrier",
      position: { x: 0, y: 0 },
    });

    expect(entity.causesImpassAtCoord(4, 7)).toBe(false);
  });

  it("reports the base unit production capability", () => {
    const entity = new GameEntity({
      id: "factory-4",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.producesUnits()).toBe(false);
  });

  it("reports the base rally point capability", () => {
    const entity = new GameEntity({
      id: "factory-13",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetRallypoints()).toBe(false);
  });

  it("does not add building queue entries for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-5",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.addBuildingQueue(1, 2)).toBe(false);
    expect(entity.addBuildingQueue(1, 2, false)).toBe(false);
  });

  it("does not cancel building queue entries for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-7",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.cancelBuildingQueue(0, 1, 2)).toBe(false);
  });

  it("creates empty building queue data for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-2",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.createBuildingQueueData()).toEqual({ data: null, size: 0 });
  });

  it("keeps building queue data processing empty for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-10",
      kind: "factory",
      position: { x: 5, y: 6 },
    });
    const data = new Uint8Array([1, 2, 3]);

    entity.processBuildingQueueData(data, data.byteLength);

    expect(Array.from(data)).toEqual([1, 2, 3]);
    expect(entity.getCoordinates()).toEqual({ x: 5, y: 6 });
  });

  it("creates empty building state data for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-8",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.createBuildingStateData()).toEqual({ data: null, size: 0 });
  });

  it("creates empty repair animation data for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-9",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.createRepairAnimData()).toEqual({ data: null, size: 0 });
    expect(entity.createRepairAnimData(false)).toEqual({ data: null, size: 0 });
  });

  it("creates empty built-cannon data for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-11",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.createBuiltCannonData()).toEqual({ data: null, size: 0 });
  });

  it("does not set default building production for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-3",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.setBuildingDefaultProduction()).toBe(false);
  });

  it("does not set explicit building production for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-6",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.setBuildingProduction(1, 2)).toBe(false);
  });

  it("does not stop building production for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-12",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.stopBuildingProduction()).toBe(false);
    expect(entity.stopBuildingProduction(false)).toBe(false);
  });

  it("records whether it just left a cannon", () => {
    const entity = new GameEntity({
      id: "robot-2",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.setJustLeftCannon(true);

    expect(entity.justLeftCannon).toBe(true);
  });

  it("returns its tile-space dimensions", () => {
    const entity = new GameEntity({
      id: "building-2",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    entity.width = 3;
    entity.height = 2;

    expect(entity.getDimensions()).toEqual({ width: 3, height: 2 });
  });

  it("returns its pixel dimensions", () => {
    const entity = new GameEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    entity.pixelWidth = 64;
    entity.pixelHeight = 48;

    expect(entity.getPixelDimensions()).toEqual({ width: 64, height: 48 });
  });

  it("gets its owner team", () => {
    const entity = new GameEntity({
      id: "robot-3",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });

    expect(entity.getOwner()).toBe(TeamType.Blue);
  });

  it("keeps zone ownership updates empty for the base entity", () => {
    const entity = new GameEntity({
      id: "robot-12",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Red,
    });

    entity.setZoneOwnage(0.75);

    expect(entity.getOwner()).toBe(TeamType.Red);
  });

  it("sets the shared damage missile list by reference", () => {
    const missiles = [
      new DamageMissile({ x: 1, y: 2, damage: 10, radius: 3, explodeTime: 4 }),
      new DamageMissile({ x: 5, y: 6, damage: 20, radius: 7, explodeTime: 8 }),
    ];

    GameEntity.setDamageMissileList(missiles);

    expect(GameEntity.damageMissileList).toBe(missiles);
  });

  it("sets the target from the current waypoint", () => {
    const entity = new GameEntity({
      id: "robot-4",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.currentWaypoint.x = 12;
    entity.currentWaypoint.y = 34;

    entity.setTargetFromCurrentWaypoint();
    entity.currentWaypoint.x = 99;

    expect(entity.target).toEqual({ x: 12, y: 34 });
  });
});
