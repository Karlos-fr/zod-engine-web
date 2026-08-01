import { describe, expect, it } from "vitest";
import { ZSettings } from "../src/data/ZSettingsData";
import {
  type CannonDeathEffectSpawn,
  CannonDeathObject,
} from "../src/simulation/CannonDeathEffect";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  canCannonSetWaypoints,
  CannonEntity,
  CGATLING_HEADER_GUARD_PORTED,
  CGUN_HEADER_GUARD_PORTED,
  CHOWITZER_HEADER_GUARD_PORTED,
  CMISSILECANNON_HEADER_GUARD_PORTED,
  doGatlingCannonDeathEffect,
  doGunCannonDeathEffect,
  doHowitzerCannonDeathEffect,
  doMissileCannonDeathEffect,
  fireGatlingCannonTurrentMissile,
  fireGunCannonMissile,
  GATLING_CANNON_UNIT_X_PIXELS,
  GATLING_CANNON_UNIT_Y_PIXELS,
  fireHowitzerCannonTurrentMissile,
  GatlingCannonEntity,
  fireGunCannonTurrentMissile,
  GUN_CANNON_UNIT_X_PIXELS,
  GUN_CANNON_UNIT_Y_PIXELS,
  HowitzerCannonEntity,
  HOWITZER_CANNON_UNIT_X_PIXELS,
  HOWITZER_CANNON_UNIT_Y_PIXELS,
  initCannonPlacementImages,
  fireMissileCannonTurrentMissile,
  MissileCannonEntity,
  MISSILE_CANNON_UNIT_X_PIXELS,
  MISSILE_CANNON_UNIT_Y_PIXELS,
  ZCANNON_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/CannonTypes";
import type { VehicleRestrictedSoundCommand } from "../src/simulation/entities/VehicleEntity";
import {
  MAX_UNIT_HEALTH,
  RobotType,
  TeamType,
} from "../src/simulation/SimulationConstants";
import type { LightRocketEffectSpawn } from "../src/simulation/LightRocketEffect";
import { SoundEngineSound } from "../src/audio/AudioService";

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

  it("ports ZCannon SetInitialDrivers as no drivers for neutral cannons", () => {
    const cannon = new CannonEntity({
      id: "cannon-initial-drivers-neutral",
      kind: "cannon",
      position: { x: 0, y: 0 },
      owner: TeamType.Null,
    });
    let resetCount = 0;
    cannon.driverType = RobotType.Psycho;
    cannon.driverInfo.push({ health: 10, nextAttackTime: 5 });
    cannon.resetDamageInfo = () => {
      resetCount += 1;
    };

    cannon.setInitialDrivers(new ZSettings());

    expect(cannon.driverType).toBe(RobotType.Grunt);
    expect(cannon.driverInfo).toEqual([]);
    expect(resetCount).toBe(1);
  });

  it("ports ZCannon SetInitialDrivers as grunt driver for owned cannons", () => {
    const cannon = new CannonEntity({
      id: "cannon-initial-drivers-owned",
      kind: "cannon",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    const settings = new ZSettings();
    settings.robotSettings[RobotType.Grunt].health = 0.35;

    cannon.setInitialDrivers(settings);

    expect(cannon.driverType).toBe(RobotType.Grunt);
    expect(cannon.driverInfo).toEqual([
      { health: 0.35 * MAX_UNIT_HEALTH, nextAttackTime: 0 },
    ]);
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

  it("ports CGatling FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 55 };
    const state = {
      ztime,
      position: { x: 18, y: 26 },
    };

    expect(() =>
      fireGatlingCannonTurrentMissile(state, null, 100, 120, 3.25),
    ).not.toThrow();
  });

  it("ports CGatling FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 55 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Howitzer,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 18, y: 26 },
    };

    fireGatlingCannonTurrentMissile(state, effects, 100, 120, 3.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 18,
        startY: 26,
        targetX: 100,
        targetY: 120,
        offsetTime: 3.25,
        object: CannonDeathObject.Gatling,
      },
      existing,
    ]);
  });

  it("ports CHowitzer FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 56 };
    const state = {
      ztime,
      position: { x: 20, y: 28 },
    };

    expect(() =>
      fireHowitzerCannonTurrentMissile(state, null, 110, 130, 4.25),
    ).not.toThrow();
  });

  it("ports CHowitzer FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 56 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Gun,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 20, y: 28 },
    };

    fireHowitzerCannonTurrentMissile(state, effects, 110, 130, 4.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 20,
        startY: 28,
        targetX: 110,
        targetY: 130,
        offsetTime: 4.25,
        object: CannonDeathObject.Howitzer,
      },
      existing,
    ]);
  });

  it("ports CMissileCannon FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 57 };
    const state = {
      ztime,
      position: { x: 22, y: 30 },
    };

    expect(() =>
      fireMissileCannonTurrentMissile(state, null, 120, 140, 5.25),
    ).not.toThrow();
  });

  it("ports CMissileCannon FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 57 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Gatling,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 22, y: 30 },
    };

    fireMissileCannonTurrentMissile(state, effects, 120, 140, 5.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 22,
        startY: 30,
        targetX: 120,
        targetY: 140,
        offsetTime: 5.25,
        object: CannonDeathObject.Missile,
      },
      existing,
    ]);
  });

  it("ports CGatling DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doGatlingCannonDeathEffect(
      { owner: TeamType.Null },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports CGatling DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 58 };
    const existing = {
      ztime,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Gun,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doGatlingCannonDeathEffect(
      { owner: TeamType.Blue },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([existing]);
  });

  it("ports CGun DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doGunCannonDeathEffect({ owner: TeamType.Null }, effects, true, true);

    expect(effects).toEqual([]);
  });

  it("ports CGun DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 59 };
    const existing = {
      ztime,
      startX: 6,
      startY: 7,
      targetX: 8,
      targetY: 9,
      offsetTime: 10,
      object: CannonDeathObject.Gatling,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doGunCannonDeathEffect({ owner: TeamType.Red }, effects, false, false);

    expect(effects).toEqual([existing]);
  });

  it("ports CHowitzer DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doHowitzerCannonDeathEffect(
      { owner: TeamType.Null },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports CHowitzer DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 60 };
    const existing = {
      ztime,
      startX: 11,
      startY: 12,
      targetX: 13,
      targetY: 14,
      offsetTime: 15,
      object: CannonDeathObject.Missile,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doHowitzerCannonDeathEffect({ owner: TeamType.Green }, effects, false, false);

    expect(effects).toEqual([existing]);
  });

  it("ports CMissileCannon DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doMissileCannonDeathEffect(
      { owner: TeamType.Null },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports CMissileCannon DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 61 };
    const existing = {
      ztime,
      startX: 16,
      startY: 17,
      targetX: 18,
      targetY: 19,
      offsetTime: 20,
      object: CannonDeathObject.Howitzer,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doMissileCannonDeathEffect(
      { owner: TeamType.Yellow },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([existing]);
  });

  it("ports CGun FireMissile as restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireGunCannonMissile(
      {
        ztime: { tick: 55 },
        position: { x: 16, y: 24 },
        direction: 0,
        missileSpeed: 80,
        pixelWidth: 32,
        pixelHeight: 48,
      },
      null,
      100,
      120,
      sounds,
    );

    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.GunFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CGun FireMissile as light rocket spawning with gun flags", () => {
    const ztime = { tick: 55 };
    const effects: LightRocketEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireGunCannonMissile(
      {
        ztime,
        position: { x: 16, y: 24 },
        direction: 1,
        missileSpeed: 80,
        pixelWidth: 32,
        pixelHeight: 48,
      },
      effects,
      100,
      120,
      sounds,
    );

    expect(effects).toEqual([
      {
        ztime,
        startX: 45,
        startY: 26,
        targetX: 100,
        targetY: 120,
        speed: 80,
        extraSmall: 0,
        extraLarge: 1,
        extraExtraLarge: 0,
      },
    ]);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.GunFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CGun FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 55 };
    const state = {
      ztime,
      position: { x: 16, y: 24 },
    };

    expect(() =>
      fireGunCannonTurrentMissile(state, null, 100, 120, 3.25),
    ).not.toThrow();
  });

  it("ports CGun FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 55 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Howitzer,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 16, y: 24 },
    };

    fireGunCannonTurrentMissile(state, effects, 100, 120, 3.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 16,
        startY: 24,
        targetX: 100,
        targetY: 120,
        offsetTime: 3.25,
        object: CannonDeathObject.Gun,
      },
      existing,
    ]);
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
