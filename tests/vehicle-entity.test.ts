import { describe, expect, it } from "vitest";
import { ZSettings } from "../src/data/ZSettingsData";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { VehicleEntity } from "../src/simulation/entities/VehicleEntity";
import {
  MAX_UNIT_HEALTH,
  RobotType,
  TeamType,
} from "../src/simulation/SimulationConstants";

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
});
