import { describe, expect, it } from "vitest";
import { CursorType } from "../src/input/CursorTiming";
import {
  CraneRepairWaypointStage,
  EnterFortWaypointStage,
  UnitRepairWaypointStage,
  Waypoint,
  WaypointMode,
} from "../src/simulation/entities/EntityTypes";
import {
  GameEntity,
  isObjectBeforeByRenderDepth,
} from "../src/simulation/entities/GameEntity";
import { DamageMissile } from "../src/simulation/ProjectileConstants";
import {
  BuildingType,
  CannonType,
  ItemType,
  MAX_UNIT_HEALTH,
  RobotType,
  TeamType,
  VehicleType,
} from "../src/simulation/SimulationConstants";
import { ZSettings } from "../src/data/ZSettingsData";
import { MapObjectType, type MapZoneInfo } from "../src/world/MapFormat";
import type { GameMap } from "../src/world/GameMap";
import { PathFindingResponse } from "../src/world/navigation/PathFindingEngine";
import { PathFindingPoint } from "../src/world/navigation/AStar";
import { BuildList } from "../src/simulation/entities/BuildList";
import { PortraitAnimationType } from "../src/simulation/PortraitAnimation";

describe("GameEntity", () => {
  it("sorts objects by bottom pixel render depth", () => {
    const front = new GameEntity({
      id: "front",
      kind: "robot",
      position: { x: 0, y: 24 },
    });
    front.pixelHeight = 8;
    const back = new GameEntity({
      id: "back",
      kind: "robot",
      position: { x: 0, y: 30 },
    });
    back.pixelHeight = 12;

    expect(isObjectBeforeByRenderDepth(front, back)).toBe(true);
    expect(isObjectBeforeByRenderDepth(back, front)).toBe(false);
  });

  it("keeps the base selected sound hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-selected",
      kind: "robot",
      position: { x: 2, y: 3 },
    });

    entity.playSelectedWav();

    expect(entity.position).toEqual({ x: 2, y: 3 });
    expect(entity.target).toBeNull();
  });

  it("ports ZObject PlaySelectedAnim as selection portrait animation choice", () => {
    const entity = new GameEntity({
      id: "robot-selected-anim",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const startedAnimations: PortraitAnimationType[] = [];

    for (const randomValue of [0, 1, 2, 3]) {
      entity.playSelectedAnim(
        {
          startAnim(animation) {
            startedAnimations.push(animation);
          },
        },
        () => randomValue,
      );
    }

    expect(startedAnimations).toEqual([
      PortraitAnimationType.YesSir,
      PortraitAnimationType.YesSir3,
      PortraitAnimationType.UnitReporting1,
      PortraitAnimationType.UnitReporting2,
    ]);
  });

  it("keeps the base acknowledge sound hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-acknowledge",
      kind: "robot",
      position: { x: 2, y: 3 },
    });

    entity.playAcknowledgeWav();

    expect(entity.position).toEqual({ x: 2, y: 3 });
    expect(entity.target).toBeNull();
  });

  it("keeps the base missile firing hook as a no-op", () => {
    const entity = new GameEntity({
      id: "cannon-fire",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    entity.fireMissile(12, 34);

    expect(entity.serverFlags.firedMissile).toBe(false);
    expect(entity.serverFlags.missileX).toBe(0);
    expect(entity.serverFlags.missileY).toBe(0);
  });

  it("keeps the base turret missile firing hook as a no-op", () => {
    const entity = new GameEntity({
      id: "turret-fire",
      kind: "turret",
      position: { x: 3, y: 4 },
    });

    entity.fireTurrentMissile(12, 34, 0.5);

    expect(entity.position).toEqual({ x: 3, y: 4 });
    expect(entity.serverFlags.firedMissile).toBe(false);
  });

  it("ports ZObject SetMap as map reference assignment", () => {
    const entity = new GameEntity({
      id: "robot-map",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const zmap = { marker: "map-reference" } as unknown as GameMap;

    entity.setMap(zmap);
    expect(entity.zmap).toBe(zmap);

    entity.setMap(null);
    expect(entity.zmap).toBeNull();
  });

  it("keeps the base map impassable clearing hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-unset-map-impassables",
      kind: "robot",
      position: { x: 2, y: 3 },
    });
    const zmap = { marker: "map-reference" } as unknown as GameMap;

    entity.unsetMapImpassables(zmap);

    expect(entity.position).toEqual({ x: 2, y: 3 });
    expect(entity.zmap).toBeNull();
  });

  it("keeps the base map impassable marking hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-set-map-impassables",
      kind: "robot",
      position: { x: 4, y: 5 },
    });
    const zmap = { marker: "map-reference" } as unknown as GameMap;

    entity.setMapImpassables(zmap);

    expect(entity.position).toEqual({ x: 4, y: 5 });
    expect(entity.zmap).toBeNull();
  });

  it("keeps the base destroy map impassable marking hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-set-destroy-map-impassables",
      kind: "robot",
      position: { x: 6, y: 7 },
    });
    const zmap = { marker: "map-reference" } as unknown as GameMap;

    entity.setDestroyMapImpassables(zmap);

    expect(entity.position).toEqual({ x: 6, y: 7 });
    expect(entity.zmap).toBeNull();
  });

  it("keeps the base destroy map impassable clearing hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-unset-destroy-map-impassables",
      kind: "robot",
      position: { x: 8, y: 9 },
    });
    const zmap = { marker: "map-reference" } as unknown as GameMap;

    entity.unsetDestroyMapImpassables(zmap);

    expect(entity.position).toEqual({ x: 8, y: 9 });
    expect(entity.zmap).toBeNull();
  });

  it("keeps the base creation map effects hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-creation-map-effects",
      kind: "robot",
      position: { x: 10, y: 11 },
    });
    const zmap = { marker: "map-reference" } as unknown as GameMap;

    entity.creationMapEffects(zmap);

    expect(entity.position).toEqual({ x: 10, y: 11 });
    expect(entity.zmap).toBeNull();
  });

  it("keeps the base death map effects hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-death-map-effects",
      kind: "robot",
      position: { x: 12, y: 13 },
    });
    const zmap = { marker: "map-reference" } as unknown as GameMap;

    entity.deathMapEffects(zmap);

    expect(entity.position).toEqual({ x: 12, y: 13 });
    expect(entity.zmap).toBeNull();
  });

  it("ports ZObject SetBuildList as build-list reference assignment", () => {
    const entity = new GameEntity({
      id: "robot-build-list",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const buildList = new BuildList();

    entity.setBuildList(buildList);
    expect(entity.buildList).toBe(buildList);

    entity.setBuildList(null);
    expect(entity.buildList).toBeNull();
  });

  it("keeps the base after-effects hook as a no-op", () => {
    const entity = new GameEntity({
      id: "robot-after-effects",
      kind: "robot",
      position: { x: 16, y: 17 },
    });

    entity.doAfterEffects({ map: true }, { destination: true }, 4, 8);

    expect(entity.position).toEqual({ x: 16, y: 17 });
    expect(entity.target).toBeNull();
  });

  it("does not estimate a missile target without missile speed", () => {
    const entity = new GameEntity({
      id: "cannon-estimate-no-speed",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target-estimate-no-speed",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.locationDeltaX = 1;

    expect(entity.estimateMissileTarget(target)).toBeNull();
  });

  it("does not estimate a missile target for a stopped target", () => {
    const entity = new GameEntity({
      id: "cannon-estimate-stopped",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target-estimate-stopped",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.missileSpeed = 10;

    expect(entity.estimateMissileTarget(target)).toBeNull();
  });

  it("estimates a moving missile target intercept point", () => {
    const entity = new GameEntity({
      id: "cannon-estimate-moving",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target-estimate-moving",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 0;
    entity.centerY = 0;
    entity.missileSpeed = 10;
    target.centerX = 100;
    target.centerY = 50;
    target.locationDeltaX = 1;
    target.locationDeltaY = 0;

    expect(entity.estimateMissileTarget(target)).toEqual({ x: 112, y: 50 });
  });

  it("returns zero from the base process hook", () => {
    const entity = new GameEntity({
      id: "robot-process",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.process()).toBe(0);
  });

  it("does not restart running when already running", () => {
    const entity = new GameEntity({
      id: "robot-run-already",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.isRunning = true;
    entity.stamina = 1;

    entity.attemptStartRun(() => 1);

    expect(entity.isRunning).toBe(true);
  });

  it("keeps running stopped when the random gate blocks it", () => {
    const entity = new GameEntity({
      id: "robot-run-random",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.stamina = 1;

    entity.attemptStartRun(() => 10);

    expect(entity.isRunning).toBe(false);
  });

  it("keeps running stopped below minimum stamina", () => {
    const entity = new GameEntity({
      id: "robot-run-stamina",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.stamina = 0.29;

    entity.attemptStartRun(() => 1);

    expect(entity.isRunning).toBe(false);
  });

  it("starts running when stamina and random gate allow it", () => {
    const entity = new GameEntity({
      id: "robot-run-start",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.stamina = 0.3;

    entity.attemptStartRun(() => 1);

    expect(entity.isRunning).toBe(true);
  });

  it("starts running toward reachable targets only", () => {
    const entity = new GameEntity({
      id: "robot-run-target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 10;
    entity.centerY = 20;
    entity.moveSpeed = 8;
    entity.stamina = 1;

    entity.attemptStartRunTo(30, 20, () => 1);
    expect(entity.isRunning).toBe(false);

    entity.attemptStartRunTo(16, 20, () => 1);
    expect(entity.isRunning).toBe(true);
  });

  it("ports ZObject InitRealMoveSpeed as terrain-adjusted center speed", () => {
    const entity = new GameEntity({
      id: "robot-real-move-speed",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const calls: Array<{ x: number; y: number }> = [];
    entity.centerX = 24;
    entity.centerY = 40;
    entity.moveSpeed = 8;

    entity.initRealMoveSpeed({
      getTileWalkSpeed(x, y) {
        calls.push({ x, y });
        return 0.75;
      },
    });

    expect(calls).toEqual([{ x: 24, y: 40 }]);
    expect(entity.realMoveSpeed).toBe(6);
  });

  it("drains running stamina and stops when depleted", () => {
    const entity = new GameEntity({
      id: "robot-run-drain",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.isRunning = true;
    entity.stamina = 1;

    entity.processRunStamina(0.25, 0.3);

    expect(entity.stamina).toBe(0.75);
    expect(entity.isRunning).toBe(true);

    entity.processRunStamina(1, 0.3);

    expect(entity.stamina).toBe(0);
    expect(entity.isRunning).toBe(false);
  });

  it("recharges running stamina up to maximum stamina", () => {
    const entity = new GameEntity({
      id: "robot-run-recharge",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.maxStamina = 1;
    entity.stamina = 0.5;

    entity.processRunStamina(1, 0.3);

    expect(entity.stamina).toBeCloseTo(0.8);

    entity.processRunStamina(1, 0.3);

    expect(entity.stamina).toBe(1);
    expect(entity.isRunning).toBe(false);
  });

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

  it("gets the current health", () => {
    const entity = new GameEntity({
      id: "tank-health",
      kind: "tank",
      position: { x: 0, y: 0 },
    });
    entity.health = 85;

    expect(entity.getHealth()).toBe(85);
  });

  it("keeps the base revive effect hook as a no-op", () => {
    const entity = new GameEntity({
      id: "tank-revive-effect",
      kind: "tank",
      position: { x: 4, y: 5 },
    });
    entity.health = 10;

    entity.doReviveEffect();

    expect(entity.getHealth()).toBe(10);
    expect(entity.position).toEqual({ x: 4, y: 5 });
  });

  it("gets the maximum health", () => {
    const entity = new GameEntity({
      id: "tank-2",
      kind: "tank",
      position: { x: 0, y: 0 },
    });
    entity.maxHealth = 120;

    expect(entity.getMaxHealth()).toBe(120);
  });

  it("does not recalculate build time for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-2",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.recalcBuildTime()).toBe(false);
  });

  it("does not reset build time for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-reset-build-time",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.resetBuildTime(0.5)).toBe(false);
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

  it("sets its facing direction", () => {
    const entity = new GameEntity({
      id: "robot-34",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.setDirection(6);

    expect(entity.direction).toBe(6);
  });

  it("converts movement deltas to facing directions", () => {
    const entity = new GameEntity({
      id: "robot-41",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.directionFromLocation(0, 0)).toBe(-1);
    expect(entity.directionFromLocation(0.000001, -0.000001)).toBe(-1);
    expect(entity.directionFromLocation(1, 0)).toBe(0);
    expect(entity.directionFromLocation(0, 1)).toBe(6);
    expect(entity.directionFromLocation(-1, 0)).toBe(4);
    expect(entity.directionFromLocation(0, -1)).toBe(2);
  });

  it("recalculates facing direction from velocity", () => {
    const entity = new GameEntity({
      id: "robot-42",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.direction = 3;
    entity.locationDeltaX = 0;
    entity.locationDeltaY = 1;

    entity.recalcDirection();

    expect(entity.direction).toBe(6);

    entity.locationDeltaX = 0;
    entity.locationDeltaY = 0;
    entity.recalcDirection();

    expect(entity.direction).toBe(6);
  });

  it("measures distance from its coordinates", () => {
    const entity = new GameEntity({
      id: "robot-20",
      kind: "robot",
      position: { x: 7, y: 9 },
    });

    expect(entity.distanceFromCoordinates(4, 5)).toBe(5);
  });

  it("measures distance from another object's center", () => {
    const entity = new GameEntity({
      id: "robot-25",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const other = new GameEntity({
      id: "robot-26",
      kind: "robot",
      position: { x: 100, y: 100 },
    });
    entity.centerX = 7;
    entity.centerY = 9;
    other.centerX = 4;
    other.centerY = 5;

    expect(entity.distanceFromObject(other)).toBe(5);
  });

  it("returns no nearest object for an empty list", () => {
    const entity = new GameEntity({
      id: "robot-27",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.nearestObjectFromList([])).toBeNull();
  });

  it("finds the nearest object by center distance", () => {
    const entity = new GameEntity({
      id: "robot-28",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const far = new GameEntity({
      id: "robot-29",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const near = new GameEntity({
      id: "robot-30",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 0;
    entity.centerY = 0;
    far.centerX = 12;
    far.centerY = 5;
    near.centerX = 3;
    near.centerY = 4;

    expect(entity.nearestObjectFromList([far, near])).toBe(near);
  });

  it("keeps the first nearest object when distances tie", () => {
    const entity = new GameEntity({
      id: "robot-31",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const first = new GameEntity({
      id: "robot-32",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const second = new GameEntity({
      id: "robot-33",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 0;
    entity.centerY = 0;
    first.centerX = 3;
    first.centerY = 4;
    second.centerX = -3;
    second.centerY = -4;

    expect(entity.nearestObjectFromList([first, second])).toBe(first);
  });

  it("returns no nearest object to coordinates for an empty list", () => {
    const entity = new GameEntity({
      id: "robot-nearest-coords-empty",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.nearestObjectToCoordinates([], 10, 20)).toBeNull();
  });

  it("finds the nearest object to coordinates", () => {
    const entity = new GameEntity({
      id: "robot-nearest-coords",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const far = new GameEntity({
      id: "robot-nearest-coords-far",
      kind: "robot",
      position: { x: 20, y: 30 },
    });
    const near = new GameEntity({
      id: "robot-nearest-coords-near",
      kind: "robot",
      position: { x: 13, y: 24 },
    });

    expect(entity.nearestObjectToCoordinates([far, near], 10, 20)).toBe(near);
  });

  it("keeps the first nearest object to coordinates when distances tie", () => {
    const entity = new GameEntity({
      id: "robot-nearest-coords-tie",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const first = new GameEntity({
      id: "robot-nearest-coords-first",
      kind: "robot",
      position: { x: 13, y: 24 },
    });
    const second = new GameEntity({
      id: "robot-nearest-coords-second",
      kind: "robot",
      position: { x: 7, y: 16 },
    });

    expect(entity.nearestObjectToCoordinates([first, second], 10, 20)).toBe(first);
  });

  it("finds the nearest selectable object by owner and object type", () => {
    const entity = new GameEntity({
      id: "selector-1",
      kind: "selector",
      position: { x: 0, y: 0 },
    });
    const wrongOwner = new GameEntity({
      id: "selector-wrong-owner",
      kind: "robot",
      position: { x: 1, y: 1 },
      owner: TeamType.Red,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
    });
    const minion = new GameEntity({
      id: "selector-minion",
      kind: "robot",
      position: { x: 2, y: 2 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
    });
    const wrongType = new GameEntity({
      id: "selector-wrong-type",
      kind: "vehicle",
      position: { x: 3, y: 3 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Vehicle,
      objectId: VehicleType.Jeep,
    });
    const far = new GameEntity({
      id: "selector-far",
      kind: "robot",
      position: { x: 10, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
    });
    const near = new GameEntity({
      id: "selector-near",
      kind: "robot",
      position: { x: 4, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Sniper,
    });
    minion.leaderObject = entity;

    expect(
      entity.nearestSelectableObject(
        [null, wrongOwner, minion, wrongType, far, near],
        MapObjectType.Robot,
        TeamType.Blue,
        0,
        0,
      ),
    ).toBe(near);
  });

  it("finds the next selectable object above a reference id", () => {
    const entity = new GameEntity({
      id: "selector-next",
      kind: "selector",
      position: { x: 0, y: 0 },
    });
    const belowThreshold = new GameEntity({
      id: "selector-next-below",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
      refId: 4,
    });
    const wrongOwner = new GameEntity({
      id: "selector-next-owner",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Red,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
      refId: 6,
    });
    const minion = new GameEntity({
      id: "selector-next-minion",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
      refId: 7,
    });
    const wrongType = new GameEntity({
      id: "selector-next-type",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Vehicle,
      objectId: VehicleType.Jeep,
      refId: 8,
    });
    const match = new GameEntity({
      id: "selector-next-match",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Sniper,
      refId: 9,
    });
    minion.leaderObject = entity;

    expect(
      entity.nextSelectableObjectAboveId(
        [null, belowThreshold, wrongOwner, minion, wrongType, match],
        MapObjectType.Robot,
        TeamType.Blue,
        5,
      ),
    ).toBe(match);
    expect(
      entity.nextSelectableObjectAboveId(
        [belowThreshold, wrongOwner, minion, wrongType],
        MapObjectType.Robot,
        TeamType.Blue,
        5,
      ),
    ).toBeNull();
  });

  it("sets coordinates and refreshes center coordinates", () => {
    const entity = new GameEntity({
      id: "robot-21",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.pixelWidth = 11;
    entity.pixelHeight = 8;

    entity.setCoordinates(20, 30);

    expect(entity.position).toEqual({ x: 20, y: 30 });
    expect(entity.centerX).toBe(25);
    expect(entity.centerY).toBe(34);
  });

  it("smoothly estimates position from last location and velocity", () => {
    const entity = new GameEntity({
      id: "vehicle-6",
      kind: "vehicle",
      position: { x: 10, y: 20 },
    });
    entity.lastLocation = { x: 10, y: 20 };
    entity.lastLocationSetTime = 5;
    entity.locationDeltaX = 2.5;
    entity.locationDeltaY = -1.25;
    entity.pixelWidth = 11;
    entity.pixelHeight = 8;

    entity.smoothMove(7);

    expect(entity.position).toEqual({ x: 15, y: 17 });
    expect(entity.centerX).toBe(20);
    expect(entity.centerY).toBe(21);
  });

  it("reports whether it can move from non-zero speed", () => {
    const entity = new GameEntity({
      id: "vehicle-4",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.canMove()).toBe(true);

    entity.speedTilesPerSecond = 0;
    expect(entity.canMove()).toBe(false);
  });

  it("reports whether death processing has already run", () => {
    const entity = new GameEntity({
      id: "vehicle-death-processed",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.hasProcessedDeath()).toBe(false);

    entity.setHasProcessedDeath(true);
    expect(entity.hasProcessedDeath()).toBe(true);

    entity.setHasProcessedDeath(false);
    expect(entity.hasProcessedDeath()).toBe(false);
  });

  it("allows waypoint overwrite when there is no active waypoint", () => {
    const entity = new GameEntity({
      id: "robot-22",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canOverwriteWaypoint()).toBe(true);
  });

  it("blocks waypoint overwrite for forced movement", () => {
    const entity = new GameEntity({
      id: "robot-23",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const waypoint = new Waypoint();
    waypoint.mode = WaypointMode.ForceMove;
    entity.waypointList.push(waypoint);

    expect(entity.canOverwriteWaypoint()).toBe(false);
  });

  it("checks staged waypoint modes before allowing overwrite", () => {
    const entity = new GameEntity({
      id: "robot-24",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const waypoint = new Waypoint();
    entity.waypointList.push(waypoint);

    waypoint.mode = WaypointMode.CraneRepair;
    entity.currentWaypointInfo.stage = CraneRepairWaypointStage.EnterBuilding;
    expect(entity.canOverwriteWaypoint()).toBe(false);
    entity.currentWaypointInfo.stage = CraneRepairWaypointStage.GoToEntrance;
    expect(entity.canOverwriteWaypoint()).toBe(true);

    waypoint.mode = WaypointMode.UnitRepair;
    entity.currentWaypointInfo.stage = UnitRepairWaypointStage.ExitBuilding;
    expect(entity.canOverwriteWaypoint()).toBe(false);
    entity.currentWaypointInfo.stage = UnitRepairWaypointStage.Wait;
    expect(entity.canOverwriteWaypoint()).toBe(true);

    waypoint.mode = WaypointMode.EnterFort;
    entity.currentWaypointInfo.stage = EnterFortWaypointStage.ExitBuilding;
    expect(entity.canOverwriteWaypoint()).toBe(false);
    entity.currentWaypointInfo.stage = EnterFortWaypointStage.GoToEntrance;
    expect(entity.canOverwriteWaypoint()).toBe(true);
  });

  it("kills a waypoint and clears movement state", () => {
    const entity = new GameEntity({
      id: "robot-kill-waypoint",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const first = new Waypoint();
    first.mode = WaypointMode.Move;
    const second = new Waypoint();
    second.mode = WaypointMode.Attack;
    entity.waypointList.push(first, second);
    entity.locationDeltaX = 3;
    entity.locationDeltaY = 4;
    entity.lastWaypoint.mode = WaypointMode.Move;
    entity.lastWaypoint.refId = 12;

    entity.killWaypoint(0);

    expect(entity.waypointList).toEqual([second]);
    expect(entity.serverFlags.updatedWaypoints).toBe(true);
    expect(entity.locationDeltaX).toBe(0);
    expect(entity.locationDeltaY).toBe(0);
    expect(entity.serverFlags.updatedVelocity).toBe(true);
    expect(entity.lastWaypoint).toEqual(new Waypoint());
  });

  it("does not allow base entity waypoint orders", () => {
    const entity = new GameEntity({
      id: "waypoint-base",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetWaypoints()).toBe(false);
  });

  it("reports whether location deltas indicate movement", () => {
    const entity = new GameEntity({
      id: "vehicle-8",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.isMoving()).toBe(false);

    entity.locationDeltaX = 0.000009;
    entity.locationDeltaY = 0;
    expect(entity.isMoving()).toBe(false);

    entity.locationDeltaX = 0;
    entity.locationDeltaY = -0.000011;
    expect(entity.isMoving()).toBe(true);
  });

  it("stops active movement and marks velocity for update", () => {
    const entity = new GameEntity({
      id: "vehicle-9",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.locationDeltaX = 0.2;
    entity.locationDeltaY = -0.1;

    expect(entity.stopMove()).toBe(true);
    expect(entity.locationDeltaX).toBe(0);
    expect(entity.locationDeltaY).toBe(0);
    expect(entity.serverFlags.updatedVelocity).toBe(true);
  });

  it("does not stop movement when velocity is already within epsilon", () => {
    const entity = new GameEntity({
      id: "vehicle-10",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.locationDeltaX = 0.000009;
    entity.locationDeltaY = 0;

    expect(entity.stopMove()).toBe(false);
    expect(entity.locationDeltaX).toBe(0.000009);
    expect(entity.locationDeltaY).toBe(0);
    expect(entity.serverFlags.updatedVelocity).toBe(false);
  });

  it("calculates movement speed offset percentage", () => {
    const entity = new GameEntity({
      id: "vehicle-speed-offset",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.speedOffsetPercent()).toBe(1);
    expect(entity.speedOffsetPercentInv()).toBe(1);

    entity.moveSpeed = 10;
    expect(entity.speedOffsetPercent()).toBe(1);

    entity.locationDeltaX = 3;
    entity.locationDeltaY = 4;
    expect(entity.speedOffsetPercent()).toBe(0.5);
    expect(entity.speedOffsetPercentInv()).toBe(2);
  });

  it("estimates whether running stamina can reach a target", () => {
    const entity = new GameEntity({
      id: "robot-running-reach",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 10;
    entity.centerY = 20;
    entity.moveSpeed = 8;
    entity.stamina = 2;

    expect(entity.canReachTargetRunning(22, 20)).toBe(true);
    expect(entity.canReachTargetRunning(27, 20)).toBe(false);
  });

  it("sets velocity toward the current waypoint target", () => {
    const entity = new GameEntity({
      id: "vehicle-12",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 10;
    entity.centerY = 20;
    entity.currentWaypointInfo.x = 13;
    entity.currentWaypointInfo.y = 24;
    entity.realMoveSpeed = 2;
    entity.waypointList.push(new Waypoint());

    entity.setVelocity();

    expect(entity.locationDeltaX).toBeCloseTo(1.2);
    expect(entity.locationDeltaY).toBeCloseTo(1.6);
    expect(entity.serverFlags.updatedVelocity).toBe(true);
  });

  it("inserts a dodge waypoint when missile dodging is allowed", () => {
    const entity = new GameEntity({
      id: "vehicle-dodge-missile",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Vehicle,
      objectId: VehicleType.Jeep,
    });
    entity.centerX = 100;
    entity.centerY = 50;
    entity.moveSpeed = 10;
    entity.realMoveSpeed = 10;
    entity.stamina = 1;
    const randomValues = [3, 500];

    expect(
      entity.dodgeMissile(0, 0, 2, { runUnitSpeed: 2 }, () =>
        randomValues.shift() ?? 1,
      ),
    ).toBe(true);

    expect(entity.waypointList).toHaveLength(1);
    expect(entity.waypointList[0].mode).toBe(WaypointMode.Dodge);
    expect(entity.waypointList[0].refId).toBe(-1);
    expect(entity.waypointList[0].x).toBeGreaterThan(entity.centerX);
    expect(Math.abs(entity.waypointList[0].y - entity.centerY)).toBeLessThanOrEqual(
      1,
    );
  });

  it("does not dodge missiles for neutral entities", () => {
    const entity = new GameEntity({
      id: "vehicle-dodge-neutral",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Vehicle,
      objectId: VehicleType.Jeep,
    });
    entity.moveSpeed = 10;
    entity.realMoveSpeed = 10;

    expect(entity.dodgeMissile(0, 0, 2)).toBe(false);
    expect(entity.waypointList).toEqual([]);
  });

  it("stops velocity when there are no waypoints", () => {
    const entity = new GameEntity({
      id: "vehicle-13",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.locationDeltaX = 0.2;
    entity.locationDeltaY = -0.3;

    entity.setVelocity();

    expect(entity.locationDeltaX).toBe(0);
    expect(entity.locationDeltaY).toBe(0);
    expect(entity.serverFlags.updatedVelocity).toBe(true);
  });

  it("keeps small velocity changes from jittering", () => {
    const entity = new GameEntity({
      id: "vehicle-14",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 0;
    entity.centerY = 0;
    entity.currentWaypointInfo.x = 1;
    entity.currentWaypointInfo.y = 0;
    entity.realMoveSpeed = 1;
    entity.locationDeltaX = 0.95;
    entity.locationDeltaY = 0;
    entity.waypointList.push(new Waypoint());

    entity.setVelocity();

    expect(entity.locationDeltaX).toBe(0.95);
    expect(entity.locationDeltaY).toBe(0);
    expect(entity.serverFlags.updatedVelocity).toBe(false);
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

  it("gets hover names for combat object ids", () => {
    const entity = new GameEntity({
      id: "hover-1",
      kind: "ui",
      position: { x: 0, y: 0 },
    });

    expect(entity.getHoverName(MapObjectType.Cannon, CannonType.Howitzer)).toBe(
      "Howitzer",
    );
    expect(entity.getHoverName(MapObjectType.Vehicle, VehicleType.MissileLauncher)).toBe(
      "M Missile",
    );
    expect(entity.getHoverName(MapObjectType.Robot, RobotType.Psycho)).toBe("Psychos");
    expect(entity.getHoverName(MapObjectType.Building, 0)).toBe("");
    expect(entity.getHoverName(MapObjectType.Robot, RobotType.Max)).toBe("");
  });

  it("gets its configured object name", () => {
    const entity = new GameEntity({
      id: "object-name",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.getObjectName()).toBe("");

    entity.objectName = "Sniper squad";
    expect(entity.getObjectName()).toBe("Sniper squad");
  });

  it("gets its object type and object id pair", () => {
    const entity = new GameEntity({
      id: "robot-object-id",
      kind: "robot",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Robot,
      objectId: RobotType.Laser,
    });

    expect(entity.getObjectId()).toEqual({
      objectType: MapObjectType.Robot,
      objectId: RobotType.Laser,
    });
  });

  it("initializes type and id without settings", () => {
    const entity = new GameEntity({
      id: "robot-init-type-no-settings",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.initTypeId(MapObjectType.Robot, RobotType.Grunt);

    expect(entity.getObjectId()).toEqual({
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
    });
    expect(entity.health).toBe(0);
    expect(entity.stamina).toBe(0);
  });

  it("initializes building and map item health from settings", () => {
    const settings = new ZSettings();
    settings.robotBuildingHealth = 0.42;
    settings.mapItemHealth = 0.13;

    const building = new GameEntity({
      id: "building-init-type",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.initTypeId(
      MapObjectType.Building,
      BuildingType.RobotFactory,
      settings,
    );

    expect(building.maxHealth).toBe(0.42 * MAX_UNIT_HEALTH);
    expect(building.health).toBe(building.maxHealth);
    expect(building.stamina).toBe(0);

    const mapItem = new GameEntity({
      id: "map-item-init-type",
      kind: "map-item",
      position: { x: 0, y: 0 },
    });
    mapItem.initTypeId(MapObjectType.MapItem, ItemType.Map0, settings);

    expect(mapItem.maxHealth).toBe(0.13 * MAX_UNIT_HEALTH);
    expect(mapItem.health).toBe(mapItem.maxHealth);
  });

  it("initializes unit combat and stamina stats from settings", () => {
    const settings = new ZSettings();
    const robotSettings = settings.robotSettings[RobotType.Sniper];
    robotSettings.moveSpeed = 12;
    robotSettings.attackRadius = 34;
    robotSettings.attackDamage = 0.25;
    robotSettings.attackDamageChance = 0.5;
    robotSettings.attackDamageRadius = 6;
    robotSettings.attackMissileSpeed = 78;
    robotSettings.attackSnipeChance = 0.9;
    robotSettings.attackSpeed = 1.25;
    robotSettings.health = 0.75;
    robotSettings.maxRunTime = 8.5;
    const entity = new GameEntity({
      id: "robot-init-type",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.initTypeId(MapObjectType.Robot, RobotType.Sniper, settings);

    expect(entity.moveSpeed).toBe(12);
    expect(entity.attackRadius).toBe(34);
    expect(entity.damage).toBe(0.25 * MAX_UNIT_HEALTH);
    expect(entity.damageChance).toBe(0.5);
    expect(entity.damageRadius).toBe(6);
    expect(entity.missileSpeed).toBe(78);
    expect(entity.snipeChance).toBe(0.9);
    expect(entity.damageIntTime).toBe(1.25);
    expect(entity.maxHealth).toBe(0.75 * MAX_UNIT_HEALTH);
    expect(entity.health).toBe(entity.maxHealth);
    expect(entity.maxStamina).toBe(8.5);
    expect(entity.stamina).toBe(8.5);
  });

  it("sets and gets its reference id", () => {
    const entity = new GameEntity({
      id: "robot-ref-id",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.setRefId(77);

    expect(entity.refId).toBe(77);
    expect(entity.getRefId()).toBe(77);
  });

  it("checks whether coordinates are within attack radius", () => {
    const entity = new GameEntity({
      id: "cannon-2",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 10;
    entity.centerY = 20;
    entity.attackRadius = 5;

    expect(entity.withinAttackRadius(13, 24)).toBe(true);
    expect(entity.withinAttackRadius(16, 20)).toBe(false);
  });

  it("checks whether coordinates are within aggro radius", () => {
    const entity = new GameEntity({
      id: "cannon-agro-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 10;
    entity.centerY = 20;
    entity.attackRadius = 5;

    expect(entity.withinAgroRadius(18, 20, 3)).toBe(true);
    expect(entity.withinAgroRadius(19, 20, 3)).toBe(false);
  });

  it("checks whether another object in a list can attack coordinates", () => {
    const entity = new GameEntity({
      id: "cannon-5",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    const other = new GameEntity({
      id: "cannon-6",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 100;
    entity.centerY = 100;
    entity.attackRadius = 200;
    other.centerX = 10;
    other.centerY = 20;
    other.attackRadius = 5;

    expect(entity.withinAttackRadiusOf([null, entity], 13, 24)).toBe(false);
    expect(entity.withinAttackRadiusOf([null, entity, other], 13, 24)).toBe(true);
  });

  it("gets the attack object by reference", () => {
    const entity = new GameEntity({
      id: "cannon-3",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target-1",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    expect(entity.getAttackObject()).toBeNull();

    entity.setAttackObject(target);
    expect(entity.getAttackObject()).toBe(target);

    entity.setAttackObject(null);
    expect(entity.getAttackObject()).toBeNull();
  });

  it("ports ZObject Disengage as attack target clearing with update flag", () => {
    class LidClosingEntity extends GameEntity {
      lidCloseSignals = 0;

      override signalLidShouldClose(): void {
        this.lidCloseSignals += 1;
      }
    }

    const entity = new LidClosingEntity({
      id: "cannon-disengage",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target-disengage",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    expect(entity.disengage()).toBe(false);
    expect(entity.serverFlags.updatedAttackObject).toBe(false);
    expect(entity.lidCloseSignals).toBe(0);

    entity.setAttackObject(target);

    expect(entity.disengage()).toBe(true);
    expect(entity.getAttackObject()).toBeNull();
    expect(entity.serverFlags.updatedAttackObject).toBe(true);
    expect(entity.lidCloseSignals).toBe(1);
  });

  it("ports ZObject Engage as attack target assignment with optional lid open", () => {
    class LidOpeningEntity extends GameEntity {
      lidOpenSignals = 0;

      override signalLidShouldOpen(): void {
        this.lidOpenSignals += 1;
      }
    }

    const entity = new LidOpeningEntity({
      id: "cannon-engage",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target-engage",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    target.canSnipeFlag = true;

    entity.engage(target);
    expect(entity.getAttackObject()).toBe(target);
    expect(entity.serverFlags.updatedAttackObject).toBe(true);
    expect(entity.lidOpenSignals).toBe(1);

    entity.serverFlags.updatedAttackObject = false;
    entity.engage(target);
    expect(entity.serverFlags.updatedAttackObject).toBe(false);
    expect(entity.lidOpenSignals).toBe(1);

    entity.engage(null);
    expect(entity.getAttackObject()).toBeNull();
    expect(entity.serverFlags.updatedAttackObject).toBe(true);
  });

  it("adds bidirectional AI list links", () => {
    const entity = new GameEntity({
      id: "ai-list-1",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const other = new GameEntity({
      id: "ai-list-2",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    expect(entity.getAiList()).toBe(entity.aiList);

    entity.addToAiList(other);

    expect(entity.aiList).toEqual([other]);
    expect(other.aiList).toEqual([entity]);
  });

  it("creates attack object data from entity references", () => {
    const entity = new GameEntity({
      id: "cannon-4",
      kind: "cannon",
      position: { x: 0, y: 0 },
      refId: 12,
    });
    const target = new GameEntity({
      id: "target-2",
      kind: "robot",
      position: { x: 1, y: 1 },
      refId: 34,
    });

    expect(entity.createAttackObjectData()).toEqual({
      packet: { refId: 12, attackObjectRefId: -1 },
      size: 8,
    });

    entity.attackObject = target;
    expect(entity.createAttackObjectData()).toEqual({
      packet: { refId: 12, attackObjectRefId: 34 },
      size: 8,
    });
  });

  it("creates team data from ownership and drivers", () => {
    const entity = new GameEntity({
      id: "vehicle-team-data",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Red,
      refId: 42,
    });
    entity.driverType = RobotType.Grunt;
    entity.driverInfo.push(
      { health: 30, nextAttackTime: 1.5 },
      { health: 20, nextAttackTime: 2.5 },
    );

    const teamData = entity.createTeamData();

    expect(teamData).toEqual({
      packet: {
        refId: 42,
        owner: TeamType.Red,
        driverType: RobotType.Grunt,
        driverAmount: 2,
      },
      driverInfo: [
        { health: 30, nextAttackTime: 1.5 },
        { health: 20, nextAttackTime: 2.5 },
      ],
      size: 31,
    });
    expect(teamData.driverInfo).not.toBe(entity.driverInfo);
  });

  it("gets the last fire damage time", () => {
    const entity = new GameEntity({
      id: "vehicle-11",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.getDamagedByFireTime()).toBe(0);

    entity.setDamagedByFireTime(21.25);
    expect(entity.getDamagedByFireTime()).toBe(21.25);
  });

  it("gets the last missile damage time", () => {
    const entity = new GameEntity({
      id: "vehicle-7",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.getDamagedByMissileTime()).toBe(0);

    entity.setDamagedByMissileTime(42.5);
    expect(entity.getDamagedByMissileTime()).toBe(42.5);
  });

  it("checks auto-enter radius from its center using settings distance", () => {
    const entity = new GameEntity({
      id: "vehicle-0",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      settings: { autoGrabVehicleDistance: 10, autoGrabFlagDistance: 0 },
    });
    entity.centerX = 20;
    entity.centerY = 30;

    expect(entity.withinAutoEnterRadius(26, 38)).toBe(true);
    expect(entity.withinAutoEnterRadius(31, 30)).toBe(false);
  });

  it("checks auto-grab flag radius from its center using settings distance", () => {
    const entity = new GameEntity({
      id: "robot-12",
      kind: "robot",
      position: { x: 0, y: 0 },
      settings: { autoGrabVehicleDistance: 0, autoGrabFlagDistance: 15 },
    });
    entity.centerX = 50;
    entity.centerY = 70;

    expect(entity.withinAutoGrabFlagRadius(59, 82)).toBe(true);
    expect(entity.withinAutoGrabFlagRadius(66, 70)).toBe(false);
  });

  it("checks overlap with a selection rectangle using exclusive edges", () => {
    const entity = new GameEntity({
      id: "robot-0",
      kind: "robot",
      position: { x: 10, y: 20 },
    });
    entity.pixelWidth = 12;
    entity.pixelHeight = 8;

    expect(
      entity.withinSelection({ left: 21, right: 30, top: 27, bottom: 40 }),
    ).toBe(true);
    expect(
      entity.withinSelection({ left: 22, right: 30, top: 27, bottom: 40 }),
    ).toBe(false);
    expect(
      entity.withinSelection({ left: 0, right: 10, top: 20, bottom: 28 }),
    ).toBe(false);
  });

  it("checks object bounds intersection using exclusive edges", () => {
    const entity = new GameEntity({
      id: "robot-39",
      kind: "robot",
      position: { x: 10, y: 20 },
    });
    const other = new GameEntity({
      id: "robot-40",
      kind: "robot",
      position: { x: 21, y: 27 },
    });
    entity.pixelWidth = 12;
    entity.pixelHeight = 8;
    other.pixelWidth = 4;
    other.pixelHeight = 4;

    expect(entity.intersectsObject(other)).toBe(true);

    other.position.x = 22;
    expect(entity.intersectsObject(other)).toBe(false);

    other.position.x = 6;
    other.position.y = 20;
    other.pixelWidth = 4;
    expect(entity.intersectsObject(other)).toBe(false);
  });

  it("reports cannon placement blocked when its bounds overlap the rectangle", () => {
    const entity = new GameEntity({
      id: "vehicle-5",
      kind: "vehicle",
      position: { x: 10, y: 20 },
    });
    entity.pixelWidth = 12;
    entity.pixelHeight = 8;

    expect(
      entity.cannonNotPlacable({ left: 15, right: 18, top: 24, bottom: 26 }),
    ).toBe(true);
    expect(
      entity.cannonNotPlacable({ left: 22, right: 30, top: 24, bottom: 26 }),
    ).toBe(false);
  });

  it("gets whether it can be destroyed", () => {
    const entity = new GameEntity({
      id: "flag-1",
      kind: "flag",
      position: { x: 0, y: 0 },
    });

    expect(entity.canBeDestroyed()).toBe(true);

    entity.canBeDestroyedFlag = false;
    expect(entity.canBeDestroyed()).toBe(false);
  });

  it("calculates destroyed state from health and maximum health", () => {
    const entity = new GameEntity({
      id: "wreck-health",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    entity.health = 0;
    entity.maxHealth = 100;
    expect(entity.isDestroyed()).toBe(true);

    entity.health = 1;
    expect(entity.isDestroyed()).toBe(false);

    entity.health = 0;
    entity.maxHealth = 0;
    expect(entity.isDestroyed()).toBe(false);
  });

  it("sets whether it is destroyed", () => {
    const entity = new GameEntity({
      id: "wreck-1",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.destroyed).toBe(false);

    entity.setDestroyed(true);
    expect(entity.destroyed).toBe(true);

    entity.setDestroyed(false);
    expect(entity.destroyed).toBe(false);
  });

  it("sets whether it should skip map stamping", () => {
    const entity = new GameEntity({
      id: "object-1",
      kind: "object",
      position: { x: 0, y: 0 },
    });

    expect(entity.dontStampFlag).toBe(false);

    entity.dontStamp(true);
    expect(entity.dontStampFlag).toBe(true);

    entity.dontStamp(false);
    expect(entity.dontStampFlag).toBe(false);
  });

  it("reports whether scheduled kill time has been reached", () => {
    const entity = new GameEntity({
      id: "unit-1",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.doKillMe(12.5);
    entity.doKillMe(20);

    expect(entity.shouldKillAt(12.49)).toBe(false);
    expect(entity.shouldKillAt(12.5)).toBe(true);
    expect(entity.killMeTime).toBe(12.5);

    entity.killMeFlag = false;
    expect(entity.shouldKillAt(20)).toBe(false);
  });

  it("checks whether map coordinates are under the entity bounds", () => {
    const entity = new GameEntity({
      id: "cursor-bounds",
      kind: "robot",
      position: { x: 10, y: 20 },
    });
    entity.pixelWidth = 8;
    entity.pixelHeight = 6;

    expect(entity.underCursor(10, 20)).toBe(true);
    expect(entity.underCursor(18, 26)).toBe(true);
    expect(entity.underCursor(9, 20)).toBe(false);
    expect(entity.underCursor(10, 19)).toBe(false);
    expect(entity.underCursor(19, 26)).toBe(false);
    expect(entity.underCursor(18, 27)).toBe(false);
  });

  it("allows base under-cursor attack targeting", () => {
    const entity = new GameEntity({
      id: "cannon-2",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(entity.underCursorCanAttack(12, 18)).toBe(true);
  });

  it("checks whether it can attack from damage and destroyed state", () => {
    const entity = new GameEntity({
      id: "attacker-can-attack",
      kind: "unit",
      position: { x: 0, y: 0 },
    });
    entity.health = 10;
    entity.maxHealth = 100;

    expect(entity.canAttack()).toBe(false);

    entity.damage = 5;
    expect(entity.canAttack()).toBe(true);

    entity.health = 0;
    expect(entity.canAttack()).toBe(false);
  });

  it("checks whether it can attack another object", () => {
    const attacker = new GameEntity({
      id: "attacker-object",
      kind: "unit",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    const target = new GameEntity({
      id: "target-object",
      kind: "unit",
      position: { x: 1, y: 1 },
      owner: TeamType.Red,
    });
    attacker.health = 10;
    attacker.maxHealth = 100;
    attacker.damage = 5;
    target.health = 10;
    target.maxHealth = 100;

    expect(attacker.canAttackObject(null)).toBe(false);
    expect(attacker.canAttackObject(target)).toBe(true);

    target.owner = TeamType.Blue;
    expect(attacker.canAttackObject(target)).toBe(false);

    target.owner = TeamType.Red;
    target.health = 0;
    expect(attacker.canAttackObject(target)).toBe(false);

    target.health = 10;
    target.attackedByExplosivesFlag = true;
    expect(attacker.canAttackObject(target)).toBe(false);

    attacker.hasExplosivesFlag = true;
    expect(attacker.canAttackObject(target)).toBe(true);

    attacker.damage = 0;
    expect(attacker.canAttackObject(target)).toBe(false);
  });

  it("rejects base under-cursor fort entry targeting", () => {
    const entity = new GameEntity({
      id: "fort-1",
      kind: "fort",
      position: { x: 0, y: 0 },
    });

    expect(entity.underCursorFortCanEnter(12, 18)).toBe(false);
  });

  it("does not allow base entity fort entry", () => {
    const entity = new GameEntity({
      id: "fort-2",
      kind: "fort",
      position: { x: 0, y: 0 },
    });

    expect(entity.canEnterFort(TeamType.Blue)).toBe(false);
  });

  it("checks whether an unowned vehicle or cannon can be entered", () => {
    const entity = new GameEntity({
      id: "enterable-vehicle",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Vehicle,
      objectId: VehicleType.Jeep,
    });
    entity.health = 10;
    entity.maxHealth = 100;

    expect(entity.canBeEntered()).toBe(true);

    entity.objectType = MapObjectType.Cannon;
    entity.objectId = CannonType.Gun;
    expect(entity.canBeEntered()).toBe(true);

    entity.owner = TeamType.Blue;
    expect(entity.canBeEntered()).toBe(false);

    entity.owner = TeamType.Null;
    entity.health = 0;
    expect(entity.canBeEntered()).toBe(false);

    entity.health = 10;
    entity.objectType = MapObjectType.Robot;
    entity.objectId = RobotType.Grunt;
    expect(entity.canBeEntered()).toBe(false);
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

  it("reports explosive capability from flags, grenades, or group leader grenades", () => {
    const entity = new GameEntity({
      id: "robot-31",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const leader = new GameEntity({
      id: "robot-32",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    expect(entity.hasExplosives()).toBe(false);

    entity.hasExplosivesFlag = true;
    expect(entity.hasExplosives()).toBe(true);

    entity.hasExplosivesFlag = false;
    entity.getGrenadeAmount = () => 1;
    expect(entity.hasExplosives()).toBe(true);

    entity.getGrenadeAmount = () => 0;
    entity.leaderObject = leader;
    leader.getGrenadeAmount = () => 1;
    expect(entity.hasExplosives()).toBe(true);
  });

  it("reports whether it is attacked only by explosives", () => {
    const entity = new GameEntity({
      id: "explosive-only-target",
      kind: "object",
      position: { x: 0, y: 0 },
    });

    expect(entity.attackedOnlyByExplosives()).toBe(false);

    entity.attackedByExplosivesFlag = true;
    expect(entity.attackedOnlyByExplosives()).toBe(true);
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

  it("ports ZObject RunSpeed from local running state", () => {
    const entity = new GameEntity({
      id: "runner-1",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.runSpeed({ runUnitSpeed: 1.8 })).toBe(1.0);

    entity.isRunning = true;
    expect(entity.runSpeed({ runUnitSpeed: 1.8 })).toBe(1.8);
  });

  it("ports ZObject RunSpeed from leader running state", () => {
    const entity = new GameEntity({
      id: "runner-minion",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const leader = new GameEntity({
      id: "runner-leader",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.setGroupLeader(leader);

    expect(entity.runSpeed({ runUnitSpeed: 1.8 })).toBe(1.0);

    leader.isRunning = true;
    expect(entity.runSpeed({ runUnitSpeed: 1.8 })).toBe(1.8);
  });

  it("ports ZObject DamagedSpeed from partial and heavy damage states", () => {
    class DamagedSpeedEntity extends GameEntity {
      constructor(
        private readonly partiallyDamaged: boolean,
        private readonly damaged: boolean,
      ) {
        super({
          id: "damaged-speed",
          kind: "robot",
          position: { x: 0, y: 0 },
        });
      }

      override showPartiallyDamaged(): boolean {
        return this.partiallyDamaged;
      }

      override showDamaged(): boolean {
        return this.damaged;
      }
    }
    const settings = {
      partiallyDamagedUnitSpeed: 0.9,
      damagedUnitSpeed: 0.8,
    };

    expect(new DamagedSpeedEntity(true, true).damagedSpeed(settings)).toBe(0.9);
    expect(new DamagedSpeedEntity(false, true).damagedSpeed(settings)).toBe(0.8);
    expect(new DamagedSpeedEntity(false, false).damagedSpeed(settings)).toBe(1.0);
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

  it("reports no building state for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-build-state",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.getBuildState()).toBe(-1);
  });

  it("keeps building state data processing empty for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-14",
      kind: "factory",
      position: { x: 5, y: 6 },
    });
    const data = new Uint8Array([4, 5, 6]);

    entity.processSetBuildingStateData(data, data.byteLength);

    expect(Array.from(data)).toEqual([4, 5, 6]);
    expect(entity.getCoordinates()).toEqual({ x: 5, y: 6 });
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

  it("keeps repair-building animation as a base entity no-op", () => {
    const entity = new GameEntity({
      id: "factory-10",
      kind: "factory",
      position: { x: 5, y: 7 },
    });
    entity.refId = 12;

    entity.doRepairBuildingAnim(true, 4.5);

    expect(entity.refId).toBe(12);
    expect(entity.position).toEqual({ x: 5, y: 7 });
  });

  it("does not allow base entity repair", () => {
    const entity = new GameEntity({
      id: "factory-10",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.canBeRepaired()).toBe(false);
  });

  it("checks whether a destroyed building can be repaired by crane", () => {
    const entity = new GameEntity({
      id: "factory-crane-repair",
      kind: "factory",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Building,
      objectId: BuildingType.RobotFactory,
      owner: TeamType.Blue,
    });
    entity.health = 0;
    entity.maxHealth = 100;

    expect(entity.canBeRepairedByCrane(TeamType.Red)).toBe(false);
    expect(entity.canBeRepairedByCrane(TeamType.Blue)).toBe(true);

    entity.health = 1;
    expect(entity.canBeRepairedByCrane(TeamType.Blue)).toBe(false);

    entity.health = 0;
    entity.objectId = BuildingType.FortFront;
    expect(entity.canBeRepairedByCrane(TeamType.Blue)).toBe(false);

    entity.objectId = BuildingType.FortBack;
    expect(entity.canBeRepairedByCrane(TeamType.Blue)).toBe(false);

    entity.objectType = MapObjectType.Vehicle;
    entity.objectId = VehicleType.Jeep;
    expect(entity.canBeRepairedByCrane(TeamType.Blue)).toBe(false);
  });

  it("reports that the base entity is not repairing a unit", () => {
    const entity = new GameEntity({
      id: "repair-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.repairingAUnit()).toBe(false);
  });

  it("does not allow base entity unit repair", () => {
    const entity = new GameEntity({
      id: "repair-can-unit",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.canRepairUnit(TeamType.Blue)).toBe(false);
  });

  it("does not assign a repair unit for the base entity", () => {
    const entity = new GameEntity({
      id: "repair-setter-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const unit = new GameEntity({
      id: "repair-setter-unit",
      kind: "vehicle",
      position: { x: 1, y: 1 },
    });

    expect(entity.setRepairUnit(unit)).toBe(false);
    expect(entity.setRepairUnit(null)).toBe(false);
    expect(entity.position).toEqual({ x: 0, y: 0 });
  });

  it("does not complete unit repair output for the base entity", () => {
    const entity = new GameEntity({
      id: "repair-unit-base",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const waypoint = new Waypoint();
    waypoint.x = 9;
    const output = {
      time: 12.5,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
      driverType: 3,
      driverInfo: [{ health: 20, nextAttackTime: 4 }],
      waypointList: [waypoint],
    };

    expect(entity.repairUnit(output)).toBe(false);
    expect(output).toEqual({
      time: 12.5,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
      driverType: 3,
      driverInfo: [{ health: 20, nextAttackTime: 4 }],
      waypointList: [waypoint],
    });
  });

  it("reports no repair entrance for the base entity", () => {
    const entity = new GameEntity({
      id: "repair-entrance-base",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.getRepairEntrance()).toBeNull();
  });

  it("keeps rock render setup as a base entity no-op", () => {
    const entity = new GameEntity({
      id: "rock-render-base",
      kind: "rock",
      position: { x: 0, y: 0 },
    });
    const rockList = [
      [false, true],
      [true, false],
    ];

    entity.setupRockRender(rockList, 2, 2);

    expect(rockList).toEqual([
      [false, true],
      [true, false],
    ]);
  });

  it("stops automatic repair without changing the network flag", () => {
    const entity = new GameEntity({
      id: "repair-2",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    entity.doAutoRepair = true;
    entity.serverFlags.autoRepair = true;

    entity.stopAutoRepair();

    expect(entity.doAutoRepair).toBe(false);
    expect(entity.serverFlags.autoRepair).toBe(true);
  });

  it("ports ZObject ProcessKillObject as non-fort building auto-repair scheduling", () => {
    const entity = new GameEntity({
      id: "repair-3",
      kind: "building",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Building,
      objectId: BuildingType.Radar,
    });

    entity.processKillObject(
      12,
      {
        buildingAutoRepairTime: 30,
        buildingAutoRepairRandomAdditionalTime: 10,
      },
      () => 17,
    );

    expect(entity.doAutoRepair).toBe(true);
    expect(entity.nextAutoRepairTime).toBe(48);
  });

  it("ports ZObject ProcessKillObject fort exclusion from auto-repair scheduling", () => {
    const entity = new GameEntity({
      id: "repair-4",
      kind: "building",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Building,
      objectId: BuildingType.FortFront,
    });

    entity.processKillObject(
      12,
      {
        buildingAutoRepairTime: 30,
        buildingAutoRepairRandomAdditionalTime: 10,
      },
      () => 17,
    );

    expect(entity.doAutoRepair).toBe(false);
    expect(entity.nextAutoRepairTime).toBe(0);
  });

  it("ports ZObject ProcessKillObject as producer production stop", () => {
    class ProducingEntity extends GameEntity {
      stopped = false;

      override producesUnits(): boolean {
        return true;
      }

      override stopBuildingProduction(): boolean {
        this.stopped = true;
        return true;
      }
    }

    const entity = new ProducingEntity({
      id: "producer-1",
      kind: "building",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Building,
      objectId: BuildingType.RobotFactory,
    });

    entity.processKillObject(12, {
      buildingAutoRepairTime: 30,
      buildingAutoRepairRandomAdditionalTime: 0,
    });

    expect(entity.stopped).toBe(true);
  });

  it("reports no extra links for the base entity", () => {
    const entity = new GameEntity({
      id: "bridge-1",
      kind: "bridge",
      position: { x: 0, y: 0 },
    });

    expect(entity.getExtraLinks()).toBe(0);
  });

  it("reports a closed lid state for the base entity", () => {
    const entity = new GameEntity({
      id: "vehicle-1",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.getLidState()).toBe(false);

    entity.setLidState(true);
    expect(entity.getLidState()).toBe(false);
  });

  it("ignores lid open and close signals for the base entity", () => {
    const entity = new GameEntity({
      id: "vehicle-lid-signal",
      kind: "vehicle",
      position: { x: 2, y: 3 },
    });
    entity.hasLidFlag = true;

    entity.signalLidShouldOpen();
    entity.signalLidShouldClose();

    expect(entity.position).toEqual({ x: 2, y: 3 });
    expect(entity.hasLid()).toBe(true);
    expect(entity.getLidState()).toBe(false);
  });

  it("reports whether the entity has a lid", () => {
    const entity = new GameEntity({
      id: "vehicle-has-lid",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.hasLid()).toBe(false);

    entity.hasLidFlag = true;
    expect(entity.hasLid()).toBe(true);
  });

  it("reports no crane entrance for the base entity", () => {
    const entity = new GameEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.getCraneEntrance()).toEqual({
      canEnter: false,
      x: 0,
      y: 0,
      exitX: 0,
      exitY: 0,
    });
  });

  it("reports no crane center for the base entity", () => {
    const entity = new GameEntity({
      id: "building-4",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.getCraneCenter()).toEqual({
      hasCenter: false,
      x: 0,
      y: 0,
    });
  });

  it("reports no repair center for the base entity", () => {
    const entity = new GameEntity({
      id: "building-5",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.getRepairCenter()).toEqual({
      hasCenter: false,
      x: 0,
      y: 0,
    });
  });

  it("keeps crane animation as a base entity no-op", () => {
    const entity = new GameEntity({
      id: "crane-1",
      kind: "vehicle",
      position: { x: 3, y: 4 },
    });
    const repairObject = new GameEntity({
      id: "repair-target-1",
      kind: "vehicle",
      position: { x: 5, y: 6 },
    });
    entity.refId = 9;

    entity.doCraneAnim(true, repairObject);
    entity.doCraneAnim(false);

    expect(entity.refId).toBe(9);
    expect(entity.position).toEqual({ x: 3, y: 4 });
  });

  it("schedules a hit effect", () => {
    const entity = new GameEntity({
      id: "vehicle-8",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.doHitEffectFlag).toBe(false);

    entity.doHitEffect();

    expect(entity.doHitEffectFlag).toBe(true);
  });

  it("keeps the base death effect hook as a no-op", () => {
    const entity = new GameEntity({
      id: "vehicle-15",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    entity.doDeathEffect(true, true);

    expect(entity.doHitEffectFlag).toBe(false);
    expect(entity.doDriverHitEffectFlag).toBe(false);
  });

  it("schedules a driver-hit effect", () => {
    const entity = new GameEntity({
      id: "vehicle-2",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.doDriverHitEffectFlag).toBe(false);

    entity.doDriverHitEffect();

    expect(entity.doDriverHitEffectFlag).toBe(true);
  });

  it("reports no building creation point for the base entity", () => {
    const entity = new GameEntity({
      id: "building-6",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.getBuildingCreationPoint()).toEqual({
      hasPoint: false,
      x: 0,
      y: 0,
    });
  });

  it("reports no building creation move point for the base entity", () => {
    const entity = new GameEntity({
      id: "building-2",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.getBuildingCreationMovePoint()).toEqual({
      hasPoint: false,
      x: 0,
      y: 0,
    });
  });

  it("reports level zero for the base entity", () => {
    const entity = new GameEntity({
      id: "building-3",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(entity.getLevel()).toBe(0);

    entity.setLevel(3);
    expect(entity.getLevel()).toBe(0);
  });

  it("reports selectable state unless the entity is a minion", () => {
    const entity = new GameEntity({
      id: "robot-7",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const leader = new GameEntity({
      id: "leader-1",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.selectable()).toBe(false);

    entity.selectableFlag = true;
    expect(entity.selectable()).toBe(true);

    entity.leaderObject = leader;
    expect(entity.selectable()).toBe(false);
  });

  it("reports whether it is part of a group", () => {
    const entity = new GameEntity({
      id: "robot-13",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const other = new GameEntity({
      id: "robot-14",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    expect(entity.isApartOfAGroup()).toBe(false);

    entity.leaderObject = other;
    expect(entity.isApartOfAGroup()).toBe(true);

    entity.leaderObject = null;
    entity.minionList.push(other);
    expect(entity.isApartOfAGroup()).toBe(true);
  });

  it("reports whether it is a minion", () => {
    const entity = new GameEntity({
      id: "robot-37",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const leader = new GameEntity({
      id: "robot-38",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    expect(entity.isMinion()).toBe(false);

    entity.leaderObject = leader;
    expect(entity.isMinion()).toBe(true);
  });

  it("sets the quick-selection group number", () => {
    const entity = new GameEntity({
      id: "robot-30",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.groupNumber).toBe(-1);

    entity.setGroup(4);
    expect(entity.groupNumber).toBe(4);
  });

  it("adds valid group minions only", () => {
    const entity = new GameEntity({
      id: "robot-17",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const minion = new GameEntity({
      id: "robot-18",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    entity.addGroupMinion(null);
    entity.addGroupMinion(entity);
    expect(entity.minionList).toEqual([]);

    entity.addGroupMinion(minion);
    expect(entity.minionList).toEqual([minion]);
  });

  it("removes matching group minions and null entries", () => {
    const entity = new GameEntity({
      id: "robot-27",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const minion = new GameEntity({
      id: "robot-28",
      kind: "robot",
      position: { x: 1, y: 1 },
    });
    const other = new GameEntity({
      id: "robot-29",
      kind: "robot",
      position: { x: 2, y: 2 },
    });
    entity.minionList.push(minion, null, other, minion);

    entity.removeGroupMinion(minion);

    expect(entity.minionList).toEqual([other]);
  });

  it("clones waypoint orders to minions and refreshes their velocity", () => {
    const entity = new GameEntity({
      id: "robot-35",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const minion = new GameEntity({
      id: "robot-36",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const waypoint = new Waypoint();
    waypoint.mode = WaypointMode.Move;
    waypoint.refId = 17;
    waypoint.x = 30;
    waypoint.y = 40;
    waypoint.attackTo = true;
    waypoint.playerGiven = true;
    entity.waypointList.push(waypoint);
    entity.justLeftCannon = true;
    entity.minionList.push(null, minion);
    minion.centerX = 0;
    minion.centerY = 0;
    minion.currentWaypointInfo.x = 3;
    minion.currentWaypointInfo.y = 4;
    minion.realMoveSpeed = 2;

    entity.cloneMinionWaypoints();

    expect(minion.waypointList).toHaveLength(1);
    expect(minion.waypointList[0]).not.toBe(waypoint);
    expect(minion.waypointList[0]).toEqual(waypoint);
    expect(minion.locationDeltaX).toBeCloseTo(1.2);
    expect(minion.locationDeltaY).toBeCloseTo(1.6);
    expect(minion.justLeftCannon).toBe(true);
  });

  it("gets the group leader by reference", () => {
    const entity = new GameEntity({
      id: "robot-19",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const leader = new GameEntity({
      id: "robot-20",
      kind: "robot",
      position: { x: 1, y: 1 },
    });

    expect(entity.getGroupLeader()).toBeNull();

    entity.setGroupLeader(entity);
    expect(entity.getGroupLeader()).toBeNull();

    entity.setGroupLeader(leader);
    expect(entity.getGroupLeader()).toBe(leader);

    entity.setGroupLeader(null);
    expect(entity.getGroupLeader()).toBeNull();
  });

  it("clears group info", () => {
    const entity = new GameEntity({
      id: "robot-25",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const other = new GameEntity({
      id: "robot-26",
      kind: "robot",
      position: { x: 1, y: 1 },
    });
    const minionList = entity.minionList;
    entity.leaderObject = other;
    entity.minionList.push(other);

    entity.clearGroupInfo();

    expect(entity.leaderObject).toBeNull();
    expect(entity.minionList).toBe(minionList);
    expect(entity.minionList).toEqual([]);
  });

  it("creates group info data only for robots", () => {
    const building = new GameEntity({
      id: "building-group-info",
      kind: "building",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Building,
      refId: 10,
    });

    expect(building.createGroupInfoData()).toEqual({ packet: null, size: 0 });

    const robot = new GameEntity({
      id: "robot-group-info",
      kind: "robot",
      position: { x: 0, y: 0 },
      objectType: MapObjectType.Robot,
      refId: 20,
    });
    const leader = new GameEntity({
      id: "robot-group-info-leader",
      kind: "robot",
      position: { x: 1, y: 1 },
      refId: 30,
    });
    const minion = new GameEntity({
      id: "robot-group-info-minion",
      kind: "robot",
      position: { x: 2, y: 2 },
      refId: 40,
    });
    robot.leaderObject = leader;
    robot.minionList.push(minion, null);

    expect(robot.createGroupInfoData()).toEqual({
      packet: {
        refId: 20,
        leaderRefId: 30,
        minionRefIds: [40, -1],
      },
      size: 20,
    });
  });

  it("processes group info data into leader and minion references", () => {
    const robot = new GameEntity({
      id: "robot-process-group-info",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 20,
    });
    const staleLeader = new GameEntity({
      id: "robot-process-group-info-stale",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 25,
    });
    const leader = new GameEntity({
      id: "robot-process-group-info-leader",
      kind: "robot",
      position: { x: 1, y: 1 },
      refId: 30,
    });
    const minion = new GameEntity({
      id: "robot-process-group-info-minion",
      kind: "robot",
      position: { x: 2, y: 2 },
      refId: 40,
    });
    robot.leaderObject = staleLeader;
    robot.minionList.push(staleLeader);

    robot.processGroupInfoData(
      {
        refId: 20,
        leaderRefId: 30,
        minionRefIds: [40, 999],
      },
      20,
      [robot, staleLeader, leader, minion],
    );

    expect(robot.leaderObject).toBe(leader);
    expect(robot.minionList).toEqual([minion]);
  });

  it("ignores invalid group info data without clearing existing group state", () => {
    const robot = new GameEntity({
      id: "robot-invalid-group-info",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 20,
    });
    const leader = new GameEntity({
      id: "robot-invalid-group-info-leader",
      kind: "robot",
      position: { x: 1, y: 1 },
      refId: 30,
    });
    robot.leaderObject = leader;
    robot.minionList.push(leader);

    robot.processGroupInfoData(null, 12, [robot, leader]);
    robot.processGroupInfoData({ refId: 21, leaderRefId: -1, minionRefIds: [] }, 12, [
      robot,
      leader,
    ]);
    robot.processGroupInfoData({ refId: 20, leaderRefId: -1, minionRefIds: [] }, 8, [
      robot,
      leader,
    ]);
    robot.processGroupInfoData({ refId: 20, leaderRefId: -1, minionRefIds: [30] }, 12, [
      robot,
      leader,
    ]);

    expect(robot.leaderObject).toBe(leader);
    expect(robot.minionList).toEqual([leader]);
  });

  it("requires both snipeable flag and driver info to be sniped", () => {
    const entity = new GameEntity({
      id: "vehicle-3",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.canBeSniped()).toBe(false);

    entity.canBeSnipedFlag = true;
    expect(entity.canBeSniped()).toBe(false);

    entity.driverInfo.push({ health: 20, nextAttackTime: 5 });
    expect(entity.canBeSniped()).toBe(true);
  });

  it("gets whether it can snipe", () => {
    const entity = new GameEntity({
      id: "robot-24",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSnipe()).toBe(false);

    entity.canSnipeFlag = true;
    expect(entity.canSnipe()).toBe(true);
  });

  it("reports that base entities cannot eject drivers", () => {
    const entity = new GameEntity({
      id: "vehicle-eject-drivers",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.canEjectDrivers()).toBe(false);
  });

  it("adds a driver from health and resets damage info", () => {
    const entity = new GameEntity({
      id: "vehicle-17",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    let resetCount = 0;
    entity.resetDamageInfo = () => {
      resetCount += 1;
    };

    entity.addDriver(35);

    expect(entity.driverInfo).toEqual([{ health: 35, nextAttackTime: 0 }]);
    expect(resetCount).toBe(1);
  });

  it("adds structured driver info and clears next attack time", () => {
    const entity = new GameEntity({
      id: "vehicle-18",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    const driver = { health: 40, nextAttackTime: 9 };

    entity.addDriver(driver);

    expect(entity.driverInfo).toEqual([{ health: 40, nextAttackTime: 0 }]);
    expect(driver.nextAttackTime).toBe(9);
  });

  it("ports ZObject ClearDrivers as driver removal with damage reset", () => {
    const entity = new GameEntity({
      id: "vehicle-clear-drivers",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    let resetCount = 0;
    entity.driverInfo.push(
      { health: 40, nextAttackTime: 9 },
      { health: 20, nextAttackTime: 3 },
    );
    entity.resetDamageInfo = () => {
      resetCount += 1;
    };

    entity.clearDrivers();

    expect(entity.driverInfo).toEqual([]);
    expect(resetCount).toBe(1);
  });

  it("ports ZObject SetInitialDrivers as grunt driver reset", () => {
    const entity = new GameEntity({
      id: "vehicle-initial-drivers",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    let resetCount = 0;
    entity.driverType = RobotType.Psycho;
    entity.driverInfo.push({ health: 40, nextAttackTime: 9 });
    entity.resetDamageInfo = () => {
      resetCount += 1;
    };

    entity.setInitialDrivers();

    expect(entity.driverType).toBe(RobotType.Grunt);
    expect(entity.driverInfo).toEqual([]);
    expect(resetCount).toBe(1);
  });

  it("ports ZObject SetDriverType as clamped driver type assignment", () => {
    const entity = new GameEntity({
      id: "vehicle-set-driver-type",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    let resetCount = 0;
    entity.resetDamageInfo = () => {
      resetCount += 1;
    };

    entity.setDriverType(RobotType.Sniper);
    expect(entity.driverType).toBe(RobotType.Sniper);

    entity.setDriverType(-3);
    expect(entity.driverType).toBe(0);

    entity.setDriverType(RobotType.Max + 5);
    expect(entity.driverType).toBe(RobotType.Max - 1);
    expect(resetCount).toBe(3);
  });

  it("gets the first driver health", () => {
    const entity = new GameEntity({
      id: "vehicle-driver-health",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.getDriverHealth()).toBe(0);

    entity.driverInfo.push({ health: 40, nextAttackTime: 9 });
    entity.driverInfo.push({ health: 20, nextAttackTime: 3 });
    expect(entity.getDriverHealth()).toBe(40);
  });

  it("gets the driver type", () => {
    const entity = new GameEntity({
      id: "vehicle-6",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.getDriverType()).toBe(0);

    entity.driverType = 3;
    expect(entity.getDriverType()).toBe(3);
  });

  it("keeps reset damage info as a base entity no-op", () => {
    const entity = new GameEntity({
      id: "vehicle-16",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    entity.driverInfo.push({ health: 20, nextAttackTime: 5 });

    entity.resetDamageInfo();

    expect(entity.driverInfo).toEqual([{ health: 20, nextAttackTime: 5 }]);
  });

  it("creates empty built-cannon data for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-11",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.createBuiltCannonData()).toEqual({ data: null, size: 0 });
  });

  it("does not store built cannons for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-13",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.storeBuiltCannon(2)).toBe(false);
  });

  it("does not remove stored cannons for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-remove-cannon",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.removeStoredCannon(2)).toBe(false);
  });

  it("ignores ejectable cannon updates for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-ejectable-cannon",
      kind: "factory",
      position: { x: 1, y: 2 },
    });

    entity.setEjectableCannon(true);

    expect(entity.position).toEqual({ x: 1, y: 2 });
    expect(entity.haveStoredCannon(2)).toBe(false);
  });

  it("reports no stored cannon for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-18",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.haveStoredCannon(2)).toBe(false);
  });

  it("processes built-cannon data as a base entity no-op", () => {
    const entity = new GameEntity({
      id: "factory-12",
      kind: "factory",
      position: { x: 3, y: 4 },
    });
    entity.pixelHeight = 18;

    entity.processSetBuiltCannonData(new Uint8Array([1, 2, 3]), 3);

    expect(entity.position).toEqual({ x: 3, y: 4 });
    expect(entity.pixelHeight).toBe(18);
  });

  it("creates location data from reference id and object location", () => {
    const entity = new GameEntity({
      id: "unit-11",
      kind: "robot",
      position: { x: 12.25, y: 8.75 },
      refId: 42,
    });

    expect(entity.createLocationData()).toEqual({
      refId: 42,
      location: {
        x: 12,
        y: 8,
        deltaX: 0.25,
        deltaY: 0.75,
      },
      size: 20,
    });
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

  it("reports zero production percentage for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-19",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.percentageProduced(42.5)).toBe(0);
  });

  it("reports zero total production time for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-15",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.productionTimeTotal()).toBe(0);
  });

  it("keeps reset production as a base entity no-op", () => {
    const entity = new GameEntity({
      id: "factory-17",
      kind: "factory",
      position: { x: 4, y: 5 },
    });

    entity.resetProduction();

    expect(entity.position).toEqual({ x: 4, y: 5 });
    expect(entity.productionTimeTotal()).toBe(0);
  });

  it("reports no completed build unit for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-16",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.getBuildUnit()).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });
  });

  it("does not build units for the base entity", () => {
    const entity = new GameEntity({
      id: "factory-build-unit",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.buildUnit(42.5)).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });
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

    entity.setOwner(TeamType.Red);
    expect(entity.getOwner()).toBe(TeamType.Red);
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

  it("sets the connected map zone by reference", () => {
    const entity = new GameEntity({
      id: "robot-16",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const zone: MapZoneInfo = {
      owner: TeamType.Blue,
      tiles: [],
      x: 1,
      y: 2,
      width: 3,
      height: 4,
      id: 5,
    };

    entity.setConnectedZone(zone);
    expect(entity.connectedZone).toBe(zone);

    entity.setConnectedZone(null);
    expect(entity.connectedZone).toBeNull();
  });

  it("ports ZObject SetConnectedZone from map as current-location zone lookup", () => {
    const entity = new GameEntity({
      id: "robot-connected-zone-map",
      kind: "robot",
      position: { x: 14, y: 15 },
    });
    const zone: MapZoneInfo = {
      owner: TeamType.Red,
      tiles: [],
      x: 10,
      y: 12,
      width: 8,
      height: 6,
      id: 9,
    };
    const calls: Array<{ x: number; y: number }> = [];

    entity.setConnectedZoneFromMap({
      getZone(x, y) {
        calls.push({ x, y });
        return zone;
      },
    });

    expect(calls).toEqual([{ x: 14, y: 15 }]);
    expect(entity.connectedZone).toBe(zone);
  });

  it("sets the shared damage missile list by reference", () => {
    const missiles = [
      new DamageMissile({ x: 1, y: 2, damage: 10, radius: 3, explodeTime: 4 }),
      new DamageMissile({ x: 5, y: 6, damage: 20, radius: 7, explodeTime: 8 }),
    ];

    GameEntity.setDamageMissileList(missiles);

    expect(GameEntity.damageMissileList).toBe(missiles);
  });

  it("sets the shared unit limit reached list by reference", () => {
    const unitLimitReached = [false, true, false];

    GameEntity.setUnitLimitReachedList(unitLimitReached);

    expect(GameEntity.unitLimitReachedList).toBe(unitLimitReached);

    GameEntity.setUnitLimitReachedList(null);
    expect(GameEntity.unitLimitReachedList).toBeNull();
  });

  it("initializes shared group tag labels", () => {
    GameEntity.groupTags = [];

    GameEntity.initGroupTags();

    expect(GameEntity.groupTags).toHaveLength(10);
    expect(GameEntity.groupTags.map((tag) => tag.label)).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    expect(GameEntity.groupTags[0].color).toEqual({ r: 200, g: 200, b: 200 });
    expect(GameEntity.groupTags[9].color).toEqual({ r: 200, g: 200, b: 200 });
  });

  it("clears object lists in place", () => {
    const entity = new GameEntity({
      id: "robot-15",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const list: Array<GameEntity | null> = [entity, null];

    GameEntity.clearAndDeleteList(list);

    expect(list).toEqual([]);
  });

  it("finds an object by reference id in a sorted list", () => {
    const first = new GameEntity({
      id: "robot-ref-search-1",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 10,
    });
    const second = new GameEntity({
      id: "robot-ref-search-2",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 20,
    });
    const third = new GameEntity({
      id: "robot-ref-search-3",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 30,
    });
    const list = [first, second, third];

    expect(GameEntity.getObjectFromIdBinarySearch(10, list)).toBe(first);
    expect(GameEntity.getObjectFromIdBinarySearch(20, list)).toBe(second);
    expect(GameEntity.getObjectFromIdBinarySearch(30, list)).toBe(third);
    expect(GameEntity.getObjectFromIdBinarySearch(25, list)).toBeNull();
    expect(GameEntity.getObjectFromIdBinarySearch(20, [])).toBeNull();
    expect(GameEntity.getObjectFromId(20, list)).toBe(second);
  });

  it("removes all matching object references from a list in place", () => {
    const target = new GameEntity({
      id: "robot-22",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const other = new GameEntity({
      id: "robot-23",
      kind: "robot",
      position: { x: 1, y: 1 },
    });
    const list: Array<GameEntity | null> = [target, other, target, null];

    GameEntity.removeObjectFromList(target, list);

    expect(list).toEqual([other, null]);
  });

  it("ports ZObject RemoveObject as attack, minion, and leader reference cleanup", () => {
    class LidEntity extends GameEntity {
      lidCloseSignals = 0;

      override signalLidShouldClose(): void {
        this.lidCloseSignals += 1;
      }
    }

    const entity = new LidEntity({
      id: "remove-owner",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const removed = new GameEntity({
      id: "removed-object",
      kind: "robot",
      position: { x: 1, y: 1 },
    });
    const other = new GameEntity({
      id: "kept-object",
      kind: "robot",
      position: { x: 2, y: 2 },
    });
    entity.setAttackObject(removed);
    entity.minionList = [removed, other, removed];
    entity.leaderObject = removed;

    entity.removeObject(removed);

    expect(entity.getAttackObject()).toBeNull();
    expect(entity.lidCloseSignals).toBe(1);
    expect(entity.minionList).toEqual([null, other, null]);
    expect(entity.leaderObject).toBeNull();
  });

  it("ports ZObject RemoveObject as no-op for unrelated references", () => {
    class LidEntity extends GameEntity {
      lidCloseSignals = 0;

      override signalLidShouldClose(): void {
        this.lidCloseSignals += 1;
      }
    }

    const entity = new LidEntity({
      id: "remove-owner-noop",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const removed = new GameEntity({
      id: "removed-object-noop",
      kind: "robot",
      position: { x: 1, y: 1 },
    });
    const other = new GameEntity({
      id: "kept-object-noop",
      kind: "robot",
      position: { x: 2, y: 2 },
    });
    entity.setAttackObject(other);
    entity.minionList = [other];
    entity.leaderObject = other;

    entity.removeObject(removed);

    expect(entity.getAttackObject()).toBe(other);
    expect(entity.lidCloseSignals).toBe(0);
    expect(entity.minionList).toEqual([other]);
    expect(entity.leaderObject).toBe(other);
  });

  it("sets waypoint target travel information", () => {
    const entity = new GameEntity({
      id: "robot-4",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 10;
    entity.centerY = 20;

    entity.setTarget(4, 35);

    expect(entity.currentWaypointInfo.x).toBe(4);
    expect(entity.currentWaypointInfo.y).toBe(35);
    expect(entity.currentWaypointInfo.sx).toBe(10);
    expect(entity.currentWaypointInfo.sy).toBe(20);
    expect(entity.currentWaypointInfo.adx).toBe(6);
    expect(entity.currentWaypointInfo.ady).toBe(15);
  });

  it("sets waypoint target from the current waypoint information", () => {
    const entity = new GameEntity({
      id: "robot-5",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 3;
    entity.centerY = 9;
    entity.currentWaypointInfo.x = 12;
    entity.currentWaypointInfo.y = 34;

    entity.setTargetFromCurrentWaypoint();

    expect(entity.currentWaypointInfo.sx).toBe(3);
    expect(entity.currentWaypointInfo.sy).toBe(9);
    expect(entity.currentWaypointInfo.adx).toBe(9);
    expect(entity.currentWaypointInfo.ady).toBe(25);
  });

  it("applies matching pathfinding responses to the current waypoint", () => {
    const entity = new GameEntity({
      id: "robot-path-response",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 10;
    entity.centerY = 10;
    entity.realMoveSpeed = 5;
    entity.currentWaypointInfo.pathFindingId = 42;
    entity.waypointList.push(new Waypoint());
    const response = new PathFindingResponse();
    response.threadId = 42;
    response.pathFindingPointList = [
      new PathFindingPoint(13, 14),
      new PathFindingPoint(30, 40),
    ];

    entity.postPathFindingResult(response);

    expect(entity.currentWaypointInfo.gotPathfindingResponse).toBe(true);
    expect(entity.currentWaypointInfo.pathFindingId).toBe(0);
    expect(entity.currentWaypointInfo.x).toBe(13);
    expect(entity.currentWaypointInfo.y).toBe(14);
    expect(entity.currentWaypointInfo.pathfindingPointList).toEqual([
      expect.objectContaining({ x: 30, y: 40 }),
    ]);
    expect(response.pathFindingPointList).toHaveLength(2);
    expect(entity.locationDeltaX).toBeCloseTo(3);
    expect(entity.locationDeltaY).toBeCloseTo(4);

    response.dispose();
  });

  it("ignores null or stale pathfinding responses", () => {
    const entity = new GameEntity({
      id: "robot-path-response-stale",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.currentWaypointInfo.pathFindingId = 42;
    const response = new PathFindingResponse();
    response.threadId = 7;
    response.pathFindingPointList = [new PathFindingPoint(13, 14)];

    entity.postPathFindingResult(null);
    entity.postPathFindingResult(response);

    expect(entity.currentWaypointInfo.gotPathfindingResponse).toBe(false);
    expect(entity.currentWaypointInfo.pathFindingId).toBe(42);
    expect(entity.currentWaypointInfo.pathfindingPointList).toEqual([]);
    expect(entity.target).toBeNull();

    response.dispose();
  });

  it("reaches the current waypoint when centered on the target", () => {
    const entity = new GameEntity({
      id: "robot-reached-target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 12;
    entity.centerY = 34;
    entity.xOver = 2;
    entity.yOver = 3;
    entity.currentWaypointInfo.x = 12;
    entity.currentWaypointInfo.y = 34;

    expect(entity.reachedTarget()).toBe(true);
    expect(entity.xOver).toBe(0);
    expect(entity.yOver).toBe(0);
  });

  it("snaps to the current waypoint after passing the target", () => {
    const entity = new GameEntity({
      id: "robot-reached-target-passed",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.pixelWidth = 10;
    entity.pixelHeight = 8;
    entity.centerX = 20;
    entity.centerY = 35;
    entity.xOver = 2;
    entity.yOver = 3;
    entity.currentWaypointInfo.sx = 10;
    entity.currentWaypointInfo.sy = 20;
    entity.currentWaypointInfo.x = 18;
    entity.currentWaypointInfo.y = 32;
    entity.currentWaypointInfo.adx = 8;
    entity.currentWaypointInfo.ady = 12;

    expect(entity.reachedTarget()).toBe(true);
    expect(entity.position).toEqual({ x: 13, y: 28 });
    expect(entity.centerX).toBe(18);
    expect(entity.centerY).toBe(32);
    expect(entity.xOver).toBe(0);
    expect(entity.yOver).toBe(0);
  });

  it("does not reach the current waypoint before passing both axes", () => {
    const entity = new GameEntity({
      id: "robot-reached-target-not-yet",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.centerX = 17;
    entity.centerY = 31;
    entity.xOver = 2;
    entity.yOver = 3;
    entity.currentWaypointInfo.sx = 10;
    entity.currentWaypointInfo.sy = 20;
    entity.currentWaypointInfo.x = 18;
    entity.currentWaypointInfo.y = 32;
    entity.currentWaypointInfo.adx = 8;
    entity.currentWaypointInfo.ady = 12;

    expect(entity.reachedTarget()).toBe(false);
    expect(entity.position).toEqual({ x: 0, y: 0 });
    expect(entity.xOver).toBe(2);
    expect(entity.yOver).toBe(3);
  });

  it("ports ZObject ShowWaypoints without waypoints as placed cursor display", () => {
    const entity = new GameEntity({
      id: "robot-show-waypoints-empty",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.showWaypoints(12.5);

    expect(entity.renderDeathTime).toBe(15.5);
    expect(entity.showWaypointsFlag).toBe(true);
    expect(entity.waypointCursorType).toBe(CursorType.Placed);
  });

  it("ports ZObject ShowWaypoints cursor selection from the last waypoint mode", () => {
    const entity = new GameEntity({
      id: "robot-show-waypoints",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const moveWaypoint = new Waypoint();
    moveWaypoint.mode = WaypointMode.Move;
    const finalWaypoint = new Waypoint();
    finalWaypoint.mode = WaypointMode.Attack;
    entity.waypointList.push(moveWaypoint, finalWaypoint);

    entity.showWaypoints(4);
    expect(entity.waypointCursorType).toBe(CursorType.Attacked);

    finalWaypoint.mode = WaypointMode.PickupGrenades;
    entity.showWaypoints(5);
    expect(entity.waypointCursorType).toBe(CursorType.Grabbed);

    finalWaypoint.mode = WaypointMode.Enter;
    entity.showWaypoints(6);
    expect(entity.waypointCursorType).toBe(CursorType.Entered);

    finalWaypoint.mode = WaypointMode.UnitRepair;
    entity.showWaypoints(7);
    expect(entity.waypointCursorType).toBe(CursorType.Repaired);
  });
});
