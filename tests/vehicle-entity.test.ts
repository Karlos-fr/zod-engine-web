import { describe, expect, it } from "vitest";
import { ZSettings } from "../src/data/ZSettingsData";
import {
  DeathEffectObject,
  type DeathEffectSpawn,
} from "../src/simulation/DeathEffect";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  doApcVehicleDeathEffect,
  doCraneVehicleDeathEffect,
  doHeavyVehicleDeathEffect,
  doJeepVehicleDeathEffect,
  doLightVehicleDeathEffect,
  doMediumVehicleDeathEffect,
  doMissileLauncherVehicleDeathEffect,
  fireHeavyVehicleMissile,
  fireLightVehicleMissile,
  fireMediumVehicleMissile,
  fireMissileLauncherMissile,
  fireHeavyVehicleTurrentMissile,
  fireLightVehicleTurrentMissile,
  fireMediumVehicleTurrentMissile,
  type VehicleRestrictedSoundCommand,
  VehicleEntity,
} from "../src/simulation/entities/VehicleEntity";
import {
  MAX_UNIT_HEALTH,
  RobotType,
  TeamType,
} from "../src/simulation/SimulationConstants";
import {
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
} from "../src/simulation/TurretMissileEffect";
import type { MobileMissileRocketsEffectSpawn } from "../src/simulation/MobileMissileRocketsEffect";
import type { LightRocketEffectSpawn } from "../src/simulation/LightRocketEffect";
import { SoundEngineSound } from "../src/audio/AudioService";

describe("vehicle entity", () => {
  it("ports ZVehicle CanSetWaypoints as enabled waypoint orders", () => {
    const entity = new VehicleEntity({
      id: "vehicle-1",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetWaypoints()).toBe(true);
  });

  it("ports ZVehicle ShowDamaged as health ratio below forty percent", () => {
    const entity = new VehicleEntity({
      id: "vehicle-damaged",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.maxHealth = 100;

    entity.health = 39;
    expect(entity.showDamaged()).toBe(true);

    entity.health = 40;
    expect(entity.showDamaged()).toBe(false);
  });

  it("ports ZVehicle ShowPartiallyDamaged as health ratio between forty and seventy percent", () => {
    const entity = new VehicleEntity({
      id: "vehicle-partially-damaged",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.maxHealth = 100;

    entity.health = 70;
    expect(entity.showPartiallyDamaged()).toBe(false);

    entity.health = 69;
    expect(entity.showPartiallyDamaged()).toBe(true);

    entity.health = 41;
    expect(entity.showPartiallyDamaged()).toBe(true);

    entity.health = 40;
    expect(entity.showPartiallyDamaged()).toBe(false);
  });

  it("ports ZVehicle CanBeRepaired as damaged and not destroyed", () => {
    const entity = new VehicleEntity({
      id: "vehicle-repairable",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.maxHealth = 100;

    entity.health = 100;
    expect(entity.canBeRepaired()).toBe(false);

    entity.health = 50;
    expect(entity.canBeRepaired()).toBe(true);

    entity.health = 0;
    expect(entity.canBeRepaired()).toBe(false);
  });

  it("ports ZVehicle CanBeSniped as driver exposure with optional lid check", () => {
    const entity = new VehicleEntity({
      id: "vehicle-sniped",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.canBeSniped()).toBe(false);

    entity.canBeSnipedFlag = true;
    expect(entity.canBeSniped()).toBe(false);

    entity.driverInfo.push({ health: 20, nextAttackTime: 0 });
    expect(entity.canBeSniped()).toBe(true);

    entity.hasLidFlag = true;
    expect(entity.canBeSniped()).toBe(false);

    entity.setLidState(true);
    expect(entity.canBeSniped()).toBe(true);
  });

  it("ports ZVehicle SetInitialDrivers as no drivers for neutral vehicles", () => {
    const entity = new VehicleEntity({
      id: "vehicle-initial-drivers-neutral",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Null,
    });
    let resetCount = 0;
    entity.driverType = RobotType.Psycho;
    entity.driverInfo.push({ health: 10, nextAttackTime: 5 });
    entity.resetDamageInfo = () => {
      resetCount += 1;
    };

    entity.setInitialDrivers(new ZSettings());

    expect(entity.driverType).toBe(RobotType.Grunt);
    expect(entity.driverInfo).toEqual([]);
    expect(resetCount).toBe(1);
  });

  it("ports ZVehicle SetInitialDrivers as grunt driver for owned vehicles", () => {
    const entity = new VehicleEntity({
      id: "vehicle-initial-drivers-owned",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Red,
    });
    const settings = new ZSettings();
    settings.robotSettings[RobotType.Grunt].health = 0.42;

    entity.setInitialDrivers(settings);

    expect(entity.driverType).toBe(RobotType.Grunt);
    expect(entity.driverInfo).toEqual([
      { health: 0.42 * MAX_UNIT_HEALTH, nextAttackTime: 0 },
    ]);
  });

  it("ports ZVehicle SetAttackObject as target assignment and direction refresh", () => {
    const entity = new VehicleEntity({
      id: "vehicle-attack",
      kind: "vehicle",
      position: { x: 10, y: 10 },
    });
    entity.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 20;
    target.centerY = 10;

    entity.setAttackObject(target);

    expect(entity.attackObject).toBe(target);
    expect(entity.direction).toBe(0);
  });

  it("ports ZVehicle SetAttackObject null and zero-vector direction handling", () => {
    const entity = new VehicleEntity({
      id: "vehicle-attack-null",
      kind: "vehicle",
      position: { x: 10, y: 10 },
    });
    entity.direction = 6;

    entity.setAttackObject(null);
    expect(entity.attackObject).toBeNull();
    expect(entity.direction).toBe(6);

    const target = new GameEntity({
      id: "target-same",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 10;

    entity.setAttackObject(target);
    expect(entity.attackObject).toBe(target);
    expect(entity.direction).toBe(6);
  });

  it("ports ZVehicle RecalcDirection as moving direction refresh", () => {
    const entity = new VehicleEntity({
      id: "vehicle-recalc-direction",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.locationDeltaX = 1;
    entity.locationDeltaY = 0;
    entity.direction = 4;
    entity.moving = false;
    entity.moveIndex = 3;

    entity.recalcDirection();

    expect(entity.moving).toBe(true);
    expect(entity.direction).toBe(0);
    expect(entity.moveIndex).toBe(0);
  });

  it("ports ZVehicle RecalcDirection zero-vector handling as stopped movement", () => {
    const entity = new VehicleEntity({
      id: "vehicle-recalc-direction-stopped",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.locationDeltaX = 0;
    entity.locationDeltaY = 0;
    entity.direction = 6;
    entity.moving = true;
    entity.moveIndex = 3;

    entity.recalcDirection();

    expect(entity.moving).toBe(false);
    expect(entity.direction).toBe(6);
    expect(entity.moveIndex).toBe(3);
  });

  it("keeps ZObject RunSpeed at walking speed when a vehicle is damaged", () => {
    const entity = new VehicleEntity({
      id: "vehicle-damaged-running",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.maxHealth = 100;
    entity.health = 39;
    entity.isRunning = true;

    expect(entity.runSpeed({ runUnitSpeed: 1.8 })).toBe(1.0);
  });

  it("ports ZVehicle lid state accessors", () => {
    const entity = new VehicleEntity({
      id: "vehicle-2",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.getLidState()).toBe(false);

    entity.setLidState(true);
    expect(entity.getLidState()).toBe(true);

    entity.setLidState(false);
    expect(entity.getLidState()).toBe(false);
  });

  it("ports ZVehicle SignalLidShouldOpen as gated lid open update", () => {
    const entity = new VehicleEntity({
      id: "vehicle-lid-open",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    entity.signalLidShouldOpen(1);
    expect(entity.lidOpen).toBe(false);
    expect(entity.serverFlags.updatedOpenLid).toBe(false);

    entity.hasLidFlag = true;
    entity.signalLidShouldOpen(0);
    expect(entity.lidOpen).toBe(false);
    expect(entity.serverFlags.updatedOpenLid).toBe(false);

    entity.signalLidShouldOpen(3);
    expect(entity.lidOpen).toBe(true);
    expect(entity.serverFlags.updatedOpenLid).toBe(true);
  });

  it("ports ZVehicle SignalLidShouldClose as delayed lid close scheduling", () => {
    const entity = new VehicleEntity({
      id: "vehicle-lid-close",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    entity.signalLidShouldClose(10, 4);
    expect(entity.doCloseLid).toBe(false);
    expect(entity.nextCloseLidTime).toBe(0);

    entity.hasLidFlag = true;
    entity.signalLidShouldClose(10, 4);
    expect(entity.doCloseLid).toBe(false);
    expect(entity.nextCloseLidTime).toBe(0);

    entity.lidOpen = true;
    entity.signalLidShouldClose(10, 4);
    expect(entity.doCloseLid).toBe(true);
    expect(entity.nextCloseLidTime).toBeCloseTo(10.4);

    entity.signalLidShouldClose(20, 6);
    expect(entity.nextCloseLidTime).toBeCloseTo(10.4);
  });

  it("ports ZVehicle ProcessLid as timed opening and robot reveal", () => {
    const entity = new VehicleEntity({
      id: "vehicle-process-lid-open",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.lidOpen = true;
    entity.nextLidTime = 5;

    entity.processLid(4.9);
    expect(entity.lidI).toBe(0);
    expect(entity.showRobot).toBe(false);
    expect(entity.nextLidTime).toBe(5);

    entity.processLid(5);
    expect(entity.lidI).toBe(1);
    expect(entity.showRobot).toBe(false);
    expect(entity.nextLidTime).toBeCloseTo(5.2);

    entity.processLid(5.2);
    expect(entity.lidI).toBe(2);
    expect(entity.showRobot).toBe(false);

    entity.processLid(5.4);
    expect(entity.lidI).toBe(2);
    expect(entity.showRobot).toBe(true);
  });

  it("ports ZVehicle ProcessLid as timed closing and robot hide", () => {
    const entity = new VehicleEntity({
      id: "vehicle-process-lid-close",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.lidOpen = false;
    entity.lidI = 2;
    entity.showRobot = true;
    entity.nextLidTime = 8;

    entity.processLid(8);
    expect(entity.lidI).toBe(1);
    expect(entity.showRobot).toBe(false);
    expect(entity.nextLidTime).toBeCloseTo(8.2);

    entity.processLid(8.2);
    expect(entity.lidI).toBe(0);
    expect(entity.showRobot).toBe(false);

    entity.processLid(8.4);
    expect(entity.lidI).toBe(0);
    expect(entity.showRobot).toBe(false);
  });

  it("ports VAPC DoDeathEffect as no effect without an effect list", () => {
    expect(() =>
      doApcVehicleDeathEffect(
        { ztime: { now: 12 }, position: { x: 40, y: 60 } },
        null,
        true,
        true,
      ),
    ).not.toThrow();
  });

  it("ports VAPC DoDeathEffect as a front-inserted APC death effect", () => {
    const ztime = { now: 12 };
    const existing = {
      ztime,
      x: 1,
      y: 2,
      object: DeathEffectObject.Jeep,
    };
    const effects: DeathEffectSpawn<typeof ztime>[] = [existing];

    doApcVehicleDeathEffect(
      {
        ztime,
        position: { x: 40, y: 60 },
      },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([
      {
        ztime,
        x: 40,
        y: 60,
        object: DeathEffectObject.Apc,
      },
      existing,
    ]);
  });

  it("ports VCrane DoDeathEffect as no effect without an effect list", () => {
    expect(() =>
      doCraneVehicleDeathEffect(
        { ztime: { now: 12 }, position: { x: 44, y: 66 } },
        null,
        true,
        true,
      ),
    ).not.toThrow();
  });

  it("ports VCrane DoDeathEffect as a front-inserted crane death effect", () => {
    const ztime = { now: 14 };
    const existing = {
      ztime,
      x: 5,
      y: 6,
      object: DeathEffectObject.Apc,
    };
    const effects: DeathEffectSpawn<typeof ztime>[] = [existing];

    doCraneVehicleDeathEffect(
      {
        ztime,
        position: { x: 44, y: 66 },
      },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([
      {
        ztime,
        x: 44,
        y: 66,
        object: DeathEffectObject.Crane,
      },
      existing,
    ]);
  });

  it("ports VJeep DoDeathEffect as no effect without an effect list", () => {
    expect(() =>
      doJeepVehicleDeathEffect(
        { ztime: { now: 12 }, position: { x: 48, y: 72 } },
        null,
        true,
        true,
      ),
    ).not.toThrow();
  });

  it("ports VJeep DoDeathEffect as a front-inserted jeep death effect", () => {
    const ztime = { now: 15 };
    const existing = {
      ztime,
      x: 7,
      y: 8,
      object: DeathEffectObject.Crane,
    };
    const effects: DeathEffectSpawn<typeof ztime>[] = [existing];

    doJeepVehicleDeathEffect(
      {
        ztime,
        position: { x: 48, y: 72 },
      },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([
      {
        ztime,
        x: 48,
        y: 72,
        object: DeathEffectObject.Jeep,
      },
      existing,
    ]);
  });

  it("ports VMissileLauncher DoDeathEffect as no effect without an effect list", () => {
    expect(() =>
      doMissileLauncherVehicleDeathEffect(
        { ztime: { now: 12 }, position: { x: 52, y: 76 } },
        null,
        true,
        true,
      ),
    ).not.toThrow();
  });

  it("ports VMissileLauncher DoDeathEffect as a front-inserted mobile-missile death effect", () => {
    const ztime = { now: 16 };
    const existing = {
      ztime,
      x: 9,
      y: 10,
      object: DeathEffectObject.Jeep,
    };
    const effects: DeathEffectSpawn<typeof ztime>[] = [existing];

    doMissileLauncherVehicleDeathEffect(
      {
        ztime,
        position: { x: 52, y: 76 },
      },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([
      {
        ztime,
        x: 52,
        y: 76,
        object: DeathEffectObject.MobileMissile,
      },
      existing,
    ]);
  });

  it("ports VHeavy DoDeathEffect as no effect for null owner", () => {
    const effects: DeathEffectSpawn<{ now: number }>[] = [];

    doHeavyVehicleDeathEffect(
      {
        ztime: { now: 17 },
        position: { x: 56, y: 80 },
        owner: TeamType.Null,
        direction: 1,
        moveIndex: 2,
        baseDamaged: [],
      },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports VHeavy DoDeathEffect as no effect without an effect list", () => {
    expect(() =>
      doHeavyVehicleDeathEffect(
        {
          ztime: { now: 17 },
          position: { x: 56, y: 80 },
          owner: TeamType.Red,
          direction: 1,
          moveIndex: 2,
          baseDamaged: [],
        },
        null,
        true,
        true,
      ),
    ).not.toThrow();
  });

  it("ports VHeavy DoDeathEffect as a front-inserted tank death effect", () => {
    const ztime = { now: 17 };
    const tankImage = { id: "red-east-moving-heavy" };
    const existing = {
      ztime,
      x: 11,
      y: 12,
      object: DeathEffectObject.Jeep,
    };
    const effects: DeathEffectSpawn<typeof ztime>[] = [existing];
    const baseDamaged = [
      [],
      [],
      [[], [undefined, undefined, tankImage]],
    ];

    doHeavyVehicleDeathEffect(
      {
        ztime,
        position: { x: 56, y: 80 },
        owner: TeamType.Red,
        direction: 1,
        moveIndex: 2,
        baseDamaged,
      },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([
      {
        ztime,
        x: 56,
        y: 80,
        object: DeathEffectObject.Tank,
        baseImage: tankImage,
      },
      existing,
    ]);
  });

  it("ports VLight DoDeathEffect as no effect for null owner", () => {
    const effects: DeathEffectSpawn<{ now: number }>[] = [];

    doLightVehicleDeathEffect(
      {
        ztime: { now: 18 },
        position: { x: 60, y: 84 },
        owner: TeamType.Null,
        direction: 0,
        moveIndex: 1,
        baseDamaged: [],
      },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports VLight DoDeathEffect as no effect without an effect list", () => {
    expect(() =>
      doLightVehicleDeathEffect(
        {
          ztime: { now: 18 },
          position: { x: 60, y: 84 },
          owner: TeamType.Blue,
          direction: 0,
          moveIndex: 1,
          baseDamaged: [],
        },
        null,
        true,
        true,
      ),
    ).not.toThrow();
  });

  it("ports VLight DoDeathEffect as a front-inserted tank death effect", () => {
    const ztime = { now: 18 };
    const tankImage = { id: "blue-north-moving-light" };
    const existing = {
      ztime,
      x: 13,
      y: 14,
      object: DeathEffectObject.Crane,
    };
    const effects: DeathEffectSpawn<typeof ztime>[] = [existing];
    const baseDamaged = [
      [],
      [[], [undefined, tankImage]],
    ];

    doLightVehicleDeathEffect(
      {
        ztime,
        position: { x: 60, y: 84 },
        owner: TeamType.Blue,
        direction: 1,
        moveIndex: 1,
        baseDamaged,
      },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([
      {
        ztime,
        x: 60,
        y: 84,
        object: DeathEffectObject.Tank,
        baseImage: tankImage,
      },
      existing,
    ]);
  });

  it("ports VMedium DoDeathEffect as no effect for null owner", () => {
    const effects: DeathEffectSpawn<{ now: number }>[] = [];

    doMediumVehicleDeathEffect(
      {
        ztime: { now: 19 },
        position: { x: 64, y: 88 },
        owner: TeamType.Null,
        direction: 2,
        moveIndex: 0,
        baseDamaged: [],
      },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports VMedium DoDeathEffect as no effect without an effect list", () => {
    expect(() =>
      doMediumVehicleDeathEffect(
        {
          ztime: { now: 19 },
          position: { x: 64, y: 88 },
          owner: TeamType.Green,
          direction: 2,
          moveIndex: 0,
          baseDamaged: [],
        },
        null,
        true,
        true,
      ),
    ).not.toThrow();
  });

  it("ports VMedium DoDeathEffect as a front-inserted tank death effect", () => {
    const ztime = { now: 19 };
    const tankImage = { id: "green-south-idle-medium" };
    const existing = {
      ztime,
      x: 15,
      y: 16,
      object: DeathEffectObject.Apc,
    };
    const effects: DeathEffectSpawn<typeof ztime>[] = [existing];
    const baseDamaged = [
      [],
      [],
      [],
      [[tankImage]],
    ];

    doMediumVehicleDeathEffect(
      {
        ztime,
        position: { x: 64, y: 88 },
        owner: TeamType.Green,
        direction: 0,
        moveIndex: 0,
        baseDamaged,
      },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([
      {
        ztime,
        x: 64,
        y: 88,
        object: DeathEffectObject.Tank,
        baseImage: tankImage,
      },
      existing,
    ]);
  });

  it("ports VHeavy FireTurrentMissile as no effect without an effect list", () => {
    const state = {
      ztime: { now: 12 },
      position: { x: 40, y: 60 },
      owner: TeamType.Blue,
    };

    expect(() =>
      fireHeavyVehicleTurrentMissile(state, null, 100, 120, 3.25),
    ).not.toThrow();
  });

  it("ports VHeavy FireTurrentMissile as a heavy turret missile spawn", () => {
    const ztime = { now: 12 };
    const effects: TurretMissileEffectSpawn<typeof ztime>[] = [];

    fireHeavyVehicleTurrentMissile(
      {
        ztime,
        position: { x: 40, y: 60 },
        owner: TeamType.Blue,
      },
      effects,
      100,
      120,
      3.25,
    );

    expect(effects).toEqual([
      {
        ztime,
        startX: 48,
        startY: 68,
        targetX: 100,
        targetY: 120,
        offsetTime: 3.25,
        type: TurretMissileEffectType.Heavy,
        owner: TeamType.Blue,
      },
    ]);
  });

  it("ports VLight FireTurrentMissile as no effect without an effect list", () => {
    const state = {
      ztime: { now: 12 },
      position: { x: 40, y: 60 },
    };

    expect(() =>
      fireLightVehicleTurrentMissile(state, null, 100, 120, 3.25),
    ).not.toThrow();
  });

  it("ports VLight FireTurrentMissile as a light turret missile spawn", () => {
    const ztime = { now: 12 };
    const effects: TurretMissileEffectSpawn<typeof ztime>[] = [];

    fireLightVehicleTurrentMissile(
      {
        ztime,
        position: { x: 40, y: 60 },
      },
      effects,
      100,
      120,
      3.25,
    );

    expect(effects).toEqual([
      {
        ztime,
        startX: 48,
        startY: 68,
        targetX: 100,
        targetY: 120,
        offsetTime: 3.25,
        type: TurretMissileEffectType.Light,
      },
    ]);
  });

  it("ports VMedium FireTurrentMissile as no effect without an effect list", () => {
    const state = {
      ztime: { now: 12 },
      position: { x: 40, y: 60 },
    };

    expect(() =>
      fireMediumVehicleTurrentMissile(state, null, 100, 120, 3.25),
    ).not.toThrow();
  });

  it("ports VMedium FireTurrentMissile as a medium turret missile spawn", () => {
    const ztime = { now: 12 };
    const effects: TurretMissileEffectSpawn<typeof ztime>[] = [];

    fireMediumVehicleTurrentMissile(
      {
        ztime,
        position: { x: 40, y: 60 },
      },
      effects,
      100,
      120,
      3.25,
    );

    expect(effects).toEqual([
      {
        ztime,
        startX: 48,
        startY: 68,
        targetX: 100,
        targetY: 120,
        offsetTime: 3.25,
        type: TurretMissileEffectType.Medium,
      },
    ]);
  });

  it("ports VMissileLauncher FireMissile as restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireMissileLauncherMissile(
      {
        ztime: { now: 12 },
        position: { x: 40, y: 60 },
        turretDirection: 0,
        pixelWidth: 32,
        pixelHeight: 32,
      },
      null,
      100,
      120,
      sounds,
    );

    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.MomissileFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 32,
      },
    ]);
  });

  it("ports VMissileLauncher FireMissile as mobile missile rocket spawning", () => {
    const ztime = { now: 12 };
    const effects: MobileMissileRocketsEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireMissileLauncherMissile(
      {
        ztime,
        position: { x: 40, y: 60 },
        turretDirection: 1,
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
        startX: 69,
        startY: 62,
        targetX: 100,
        targetY: 120,
      },
    ]);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.MomissileFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports VHeavy FireMissile as restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireHeavyVehicleMissile(
      {
        ztime: { now: 12 },
        position: { x: 40, y: 60 },
        turretDirection: 0,
        missileSpeed: 88,
        pixelWidth: 32,
        pixelHeight: 32,
      },
      null,
      100,
      120,
      sounds,
    );

    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.HeavyFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 32,
      },
    ]);
  });

  it("ports VHeavy FireMissile as light rocket spawning with heavy flags", () => {
    const ztime = { now: 12 };
    const effects: LightRocketEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireHeavyVehicleMissile(
      {
        ztime,
        position: { x: 40, y: 60 },
        turretDirection: 1,
        missileSpeed: 88,
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
        startX: 69,
        startY: 62,
        targetX: 100,
        targetY: 120,
        speed: 88,
        extraSmall: 0,
        extraLarge: 1,
        extraExtraLarge: 1,
      },
    ]);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.HeavyFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports VLight FireMissile as restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireLightVehicleMissile(
      {
        ztime: { now: 12 },
        position: { x: 40, y: 60 },
        turretDirection: 0,
        missileSpeed: 72,
        pixelWidth: 32,
        pixelHeight: 32,
      },
      null,
      100,
      120,
      sounds,
    );

    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.LightFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 32,
      },
    ]);
  });

  it("ports VLight FireMissile as light rocket spawning with default flags", () => {
    const ztime = { now: 12 };
    const effects: LightRocketEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireLightVehicleMissile(
      {
        ztime,
        position: { x: 40, y: 60 },
        turretDirection: 1,
        missileSpeed: 72,
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
        startX: 69,
        startY: 62,
        targetX: 100,
        targetY: 120,
        speed: 72,
        extraSmall: 0,
        extraLarge: 0,
        extraExtraLarge: 0,
      },
    ]);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.LightFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports VMedium FireMissile as restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireMediumVehicleMissile(
      {
        ztime: { now: 12 },
        position: { x: 40, y: 60 },
        turretDirection: 0,
        missileSpeed: 80,
        pixelWidth: 32,
        pixelHeight: 32,
      },
      null,
      100,
      120,
      sounds,
    );

    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.MediumFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 32,
      },
    ]);
  });

  it("ports VMedium FireMissile as light rocket spawning with medium flags", () => {
    const ztime = { now: 12 };
    const effects: LightRocketEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireMediumVehicleMissile(
      {
        ztime,
        position: { x: 40, y: 60 },
        turretDirection: 1,
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
        startX: 69,
        startY: 62,
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
        sound: SoundEngineSound.MediumFireSnd,
        x: 40,
        y: 60,
        width: 32,
        height: 48,
      },
    ]);
  });
});
