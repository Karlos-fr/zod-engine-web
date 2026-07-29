import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  canCannonSetWaypoints,
  CannonEntity,
  CGATLING_HEADER_GUARD_PORTED,
  CGUN_HEADER_GUARD_PORTED,
  CHOWITZER_HEADER_GUARD_PORTED,
  CMISSILECANNON_HEADER_GUARD_PORTED,
  GATLING_CANNON_UNIT_X_PIXELS,
  GATLING_CANNON_UNIT_Y_PIXELS,
  GatlingCannonEntity,
  GUN_CANNON_UNIT_X_PIXELS,
  GUN_CANNON_UNIT_Y_PIXELS,
  HowitzerCannonEntity,
  HOWITZER_CANNON_UNIT_X_PIXELS,
  HOWITZER_CANNON_UNIT_Y_PIXELS,
  initCannonPlacementImages,
  MissileCannonEntity,
  MISSILE_CANNON_UNIT_X_PIXELS,
  MISSILE_CANNON_UNIT_Y_PIXELS,
  ZCANNON_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/CannonTypes";

describe("cannon types", () => {
  it("adapts the cgatling header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CGATLING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CGATLING_HEADER_GUARD_PORTED).toBe(
      firstImport.CGATLING_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the cgun header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CGUN_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CGUN_HEADER_GUARD_PORTED).toBe(
      firstImport.CGUN_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the chowitzer header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CHOWITZER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CHOWITZER_HEADER_GUARD_PORTED).toBe(
      firstImport.CHOWITZER_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the cmissilecannon header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CMISSILECANNON_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CMISSILECANNON_HEADER_GUARD_PORTED).toBe(
      firstImport.CMISSILECANNON_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the zcannon header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(ZCANNON_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCANNON_HEADER_GUARD_PORTED).toBe(
      firstImport.ZCANNON_HEADER_GUARD_PORTED,
    );
  });

  it("ports ZCannon CanSetWaypoints as enabled waypoint orders", () => {
    expect(canCannonSetWaypoints()).toBe(true);
  });

  it("ports ZCannon Init as cannon placement image loading", () => {
    const loadedFilenames = Array.from({ length: 3 }, () => "");
    const placementImages = loadedFilenames.map((_, index) => ({
      loadBaseImage(filename: string) {
        loadedFilenames[index] = filename;
      },
    }));

    initCannonPlacementImages(placementImages);

    expect(loadedFilenames).toEqual([
      "assets/units/cannons/init-place_n00.png",
      "assets/units/cannons/init-place_n01.png",
      "assets/units/cannons/init-place_n02.png",
    ]);
  });

  it("ports ZCannon SetEjectableCannon as cannon ejection state", () => {
    const cannon = new CannonEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(cannon.ejectableCannon).toBe(true);

    cannon.setEjectableCannon(false);

    expect(cannon.ejectableCannon).toBe(false);
  });

  it("ports ZCannon CanEjectDrivers as the ejectable cannon state", () => {
    const cannon = new CannonEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(cannon.canEjectDrivers()).toBe(true);

    cannon.setEjectableCannon(false);

    expect(cannon.canEjectDrivers()).toBe(false);
  });

  it("ports ZCannon CanBeSniped as sniped flag, driver, and ejectable checks", () => {
    const cannon = new CannonEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(cannon.canBeSniped()).toBe(false);

    cannon.canBeSnipedFlag = true;
    expect(cannon.canBeSniped()).toBe(false);

    cannon.driverInfo.push({ health: 20, nextAttackTime: 0 });
    expect(cannon.canBeSniped()).toBe(true);

    cannon.setEjectableCannon(false);
    expect(cannon.canBeSniped()).toBe(false);
  });

  it("ports ZCannon SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new CannonEntity({
      id: "cannon-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 20;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(6);
  });

  it("ports ZCannon SetAttackObject null and zero-vector direction handling", () => {
    const cannon = new CannonEntity({
      id: "cannon-attack-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 2;

    cannon.setAttackObject(null);
    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(2);

    const target = new GameEntity({
      id: "target-same",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 10;

    cannon.setAttackObject(target);
    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(2);
  });

  it("ports CGatling SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new GatlingCannonEntity({
      id: "gatling-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 20;
    target.centerY = 10;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(0);
  });

  it("ports CGatling SetAttackObject null handling as fire-render reset", () => {
    const cannon = new GatlingCannonEntity({
      id: "gatling-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 6;
    cannon.renderFire = true;

    cannon.setAttackObject(null);

    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(6);
    expect(cannon.renderFire).toBe(false);
  });

  it("ports CHowitzer SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new HowitzerCannonEntity({
      id: "howitzer-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 0;
    target.centerY = 10;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(4);
  });

  it("ports CHowitzer SetAttackObject null handling as fire-render reset", () => {
    const cannon = new HowitzerCannonEntity({
      id: "howitzer-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 6;
    cannon.renderFire = true;

    cannon.setAttackObject(null);

    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(6);
    expect(cannon.renderFire).toBe(false);
  });

  it("ports CMissileCannon SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new MissileCannonEntity({
      id: "missile-cannon-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 0;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(2);
  });

  it("ports CMissileCannon SetAttackObject null handling as fire-render reset", () => {
    const cannon = new MissileCannonEntity({
      id: "missile-cannon-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 6;
    cannon.renderFire = true;

    cannon.setAttackObject(null);

    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(6);
    expect(cannon.renderFire).toBe(false);
  });

  it("ports the gatling cannon unit x offset", () => {
    expect(GATLING_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the gun cannon unit x offset", () => {
    expect(GUN_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the gun cannon unit y offset", () => {
    expect(GUN_CANNON_UNIT_Y_PIXELS).toBe(0);
  });

  it("ports the howitzer cannon unit x offset", () => {
    expect(HOWITZER_CANNON_UNIT_X_PIXELS).toBe(-2);
  });

  it("ports the howitzer cannon unit y offset", () => {
    expect(HOWITZER_CANNON_UNIT_Y_PIXELS).toBe(-12);
  });

  it("ports the missile cannon unit x offset", () => {
    expect(MISSILE_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the missile cannon unit y offset", () => {
    expect(MISSILE_CANNON_UNIT_Y_PIXELS).toBe(-8);
  });

  it("ports the gatling cannon unit y offset", () => {
    expect(GATLING_CANNON_UNIT_Y_PIXELS).toBe(-7);
  });
});
