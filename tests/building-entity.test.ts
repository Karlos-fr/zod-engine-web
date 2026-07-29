import { describe, expect, it } from "vitest";
import {
  BuildingType,
  MAX_STORED_CANNONS,
  PlanetType,
  TeamType,
} from "../src/simulation/SimulationConstants";
import { BuildList, BuildListObject } from "../src/simulation/entities/BuildList";
import {
  BuildingEntity,
  BuildingState,
  SET_BUILDING_STATE_PACKET_SIZE_BYTES,
  ZBProductionUnit,
  getBuildingPercentageProduced,
  getBuildingProductionTimeLeft,
} from "../src/simulation/entities/BuildingTypes";
import { GameEntity } from "../src/simulation/entities/GameEntity";

describe("building entity", () => {
  it("ports ZBuilding level accessors as building-level state", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(building.getLevel()).toBe(0);

    building.setLevel(3);
    expect(building.level).toBe(3);
    expect(building.getLevel()).toBe(3);
  });

  it("ports ZBuilding ChangePalette as palette assignment", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    building.changePalette(PlanetType.Arctic);

    expect(building.palette).toBe(PlanetType.Arctic);
  });

  it("ports ZBuilding GetBuildUnit as selected production unit read", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.buildObjectType = 3;
    building.buildObjectId = 5;

    expect(building.getBuildUnit()).toEqual({
      hasUnit: true,
      objectType: 3,
      objectId: 5,
    });
  });

  it("ports ZBuilding GetBuildState as production state with unit-cap pause", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.owner = TeamType.Blue;
    building.buildState = BuildingState.Building;

    GameEntity.unitLimitReachedList = null;
    expect(building.getBuildState()).toBe(BuildingState.Building);

    GameEntity.unitLimitReachedList = [];
    GameEntity.unitLimitReachedList[TeamType.Blue] = true;
    expect(building.getBuildState()).toBe(BuildingState.Paused);

    GameEntity.unitLimitReachedList = null;
  });

  it("ports ZBuilding BuildUnit guard exits", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(building.buildUnit(20)).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });

    building.bot = 3;
    building.boid = 4;
    building.buildState = BuildingState.Select;
    expect(building.buildUnit(20)).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });

    building.buildState = BuildingState.Building;
    expect(building.buildUnit(20)).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });
  });

  it("ports ZBuilding BuildUnit as completed production unit read", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    building.bot = 3;
    building.boid = 4;
    building.buildState = BuildingState.Building;
    building.finalProductionTime = 20;

    expect(building.buildUnit(19.9)).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });

    GameEntity.unitLimitReachedList = [];
    GameEntity.unitLimitReachedList[TeamType.Blue] = true;
    expect(building.buildUnit(20)).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });

    GameEntity.unitLimitReachedList = null;
    expect(building.buildUnit(20)).toEqual({
      hasUnit: true,
      objectType: 3,
      objectId: 4,
    });
  });

  it("ports ZBuilding GetBuildingCreationPoint as building-relative spawn point", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 100, y: 200 },
    });
    building.unitCreateX = 12;
    building.unitCreateY = 16;

    expect(building.getBuildingCreationPoint()).toEqual({
      hasPoint: true,
      x: 112,
      y: 216,
    });
  });

  it("ports ZBuilding GetBuildingCreationMovePoint as building-relative rally point", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 100, y: 200 },
    });
    building.unitMoveX = 30;
    building.unitMoveY = 40;

    expect(building.getBuildingCreationMovePoint()).toEqual({
      hasPoint: true,
      x: 130,
      y: 240,
    });
  });

  it("ports ZBuilding DoDeathEffect as base rerender invalidation", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    building.doDeathEffect(true, true);

    expect(building.doBaseRerender).toBe(true);
  });

  it("ports ZBuilding DoReviveEffect as base rerender invalidation and effect cleanup", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const effect = { id: "effect" };
    building.doBaseRerender = false;
    building.extraEffects = [effect];

    building.doReviveEffect();

    expect(building.doBaseRerender).toBe(true);
    expect(building.extraEffects).toEqual([]);
  });

  it("ports ZBuilding SetOwner as ownership plus base rerender invalidation", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    building.doBaseRerender = false;
    building.setOwner(TeamType.Blue);

    expect(building.owner).toBe(TeamType.Blue);
    expect(building.doBaseRerender).toBe(true);
  });

  it("ports ZBuilding SetBuildingDefaultProduction guard exits", () => {
    class TestBuilding extends BuildingEntity {
      productionCalls: Array<{ objectType: number; objectId: number }> = [];

      override setBuildingProduction(objectType: number, objectId: number): boolean {
        this.productionCalls.push({ objectType, objectId });
        return true;
      }
    }
    const building = new TestBuilding({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      objectId: BuildingType.RobotFactory,
    });

    expect(building.setBuildingDefaultProduction()).toBe(false);

    building.buildState = BuildingState.Select;
    expect(building.setBuildingDefaultProduction()).toBe(false);

    const buildList = new BuildList();
    building.buildList = buildList;
    expect(building.setBuildingDefaultProduction()).toBe(false);

    building.buildState = BuildingState.Building;
    expect(building.setBuildingDefaultProduction()).toBe(false);

    building.buildState = BuildingState.Select;
    building.bot = 1;
    expect(building.setBuildingDefaultProduction()).toBe(false);

    building.bot = -1;
    building.boid = 1;
    expect(building.setBuildingDefaultProduction()).toBe(false);

    expect(building.productionCalls).toEqual([]);
  });

  it("ports ZBuilding SetBuildingDefaultProduction as first build-list unit delegation", () => {
    class TestBuilding extends BuildingEntity {
      productionCalls: Array<{ objectType: number; objectId: number }> = [];

      override setBuildingProduction(objectType: number, objectId: number): boolean {
        this.productionCalls.push({ objectType, objectId });
        return objectType === 3 && objectId === 7;
      }
    }
    const building = new TestBuilding({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      objectId: BuildingType.RobotFactory,
    });
    const buildList = new BuildList();
    buildList.buildlistData[BuildingType.RobotFactory][0].push(
      new BuildListObject(3, 7),
      new BuildListObject(4, 8),
    );
    building.buildState = BuildingState.Select;
    building.buildList = buildList;

    expect(building.setBuildingDefaultProduction()).toBe(true);
    expect(building.productionCalls).toEqual([{ objectType: 3, objectId: 7 }]);
  });

  it("ports ZBuilding BuildTimeModified as zone and health adjusted build time", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.zoneOwnage = 0.5;
    building.maxHealth = 100;
    building.health = 80;

    expect(building.buildTimeModified(100)).toBeCloseTo(93.75);
  });

  it("ports ZBuilding ResetBuildTime as no-op for unchanged zone ownership", () => {
    class TestBuilding extends BuildingEntity {
      recalcCalls = 0;

      override recalcBuildTime(): boolean {
        this.recalcCalls++;
        return true;
      }
    }
    const building = new TestBuilding({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.zoneOwnage = 0.5;

    expect(building.resetBuildTime(0.5)).toBe(false);
    expect(building.zoneOwnage).toBe(0.5);
    expect(building.recalcCalls).toBe(0);
  });

  it("ports ZBuilding ResetBuildTime as clamped zone update and recalculation", () => {
    class TestBuilding extends BuildingEntity {
      recalcCalls = 0;

      override recalcBuildTime(): boolean {
        this.recalcCalls++;
        return this.zoneOwnage === 1;
      }
    }
    const building = new TestBuilding({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(building.resetBuildTime(1.5)).toBe(true);
    expect(building.zoneOwnage).toBe(1);
    expect(building.recalcCalls).toBe(1);

    expect(building.resetBuildTime(-0.25)).toBe(false);
    expect(building.zoneOwnage).toBe(0);
    expect(building.recalcCalls).toBe(2);
  });

  it("ports ZBuilding CancelBuildingQueue guard exits", () => {
    class ProducingBuilding extends BuildingEntity {
      override producesUnits(): boolean {
        return true;
      }
    }
    const building = new ProducingBuilding({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const queuedUnit = new ZBProductionUnit(1, 2);
    building.queueList = [queuedUnit];

    expect(building.cancelBuildingQueue(0, 1, 2)).toBe(false);

    building.owner = TeamType.Red;
    expect(building.cancelBuildingQueue(-1, 1, 2)).toBe(false);
    expect(building.cancelBuildingQueue(1, 1, 2)).toBe(false);
    expect(building.cancelBuildingQueue(0, 9, 2)).toBe(false);
    expect(building.cancelBuildingQueue(0, 1, 9)).toBe(false);
    expect(building.queueList).toEqual([queuedUnit]);
  });

  it("ports ZBuilding CancelBuildingQueue as matching queued unit removal", () => {
    class ProducingBuilding extends BuildingEntity {
      override producesUnits(): boolean {
        return true;
      }
    }
    const building = new ProducingBuilding({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    const queuedUnitA = new ZBProductionUnit(1, 2);
    const queuedUnitB = new ZBProductionUnit(3, 4);
    building.queueList = [queuedUnitA, queuedUnitB];

    expect(building.cancelBuildingQueue(0, 1, 2)).toBe(true);
    expect(building.queueList).toEqual([queuedUnitB]);
  });

  it("ports ZBuilding ProductionTimeLeft as remaining build time clamp", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.finalProductionTime = 25;

    expect(building.productionTimeLeft(10)).toBe(15);
    expect(building.productionTimeLeft(25)).toBe(0);
    expect(building.productionTimeLeft(30)).toBe(0);
    expect(
      getBuildingProductionTimeLeft({ finalProductionTime: 12.5 }, 10),
    ).toBe(2.5);
  });

  it("ports ZBuilding PercentageProduced as clamped build progress ratio", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.initialProductionTime = 10;
    building.finalProductionTime = 30;

    expect(building.percentageProduced(5)).toBe(0);
    expect(building.percentageProduced(20)).toBe(0.5);
    expect(building.percentageProduced(35)).toBe(1);
    expect(
      getBuildingPercentageProduced(
        { initialProductionTime: 4, finalProductionTime: 12 },
        6,
      ),
    ).toBe(0.25);
  });

  it("ports ZBuilding HaveStoredCannon as built cannon id lookup", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(building.haveStoredCannon(2)).toBe(false);

    building.builtCannonList = [1, 3, 5];

    expect(building.haveStoredCannon(3)).toBe(true);
    expect(building.haveStoredCannon(2)).toBe(false);
  });

  it("ports ZBuilding StoreBuiltCannon as capped built cannon storage", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    for (let i = 0; i < MAX_STORED_CANNONS; i += 1) {
      expect(building.storeBuiltCannon(i)).toBe(true);
    }

    expect(building.builtCannonList).toEqual([0, 1, 2, 3]);
    expect(building.storeBuiltCannon(4)).toBe(false);
    expect(building.builtCannonList).toEqual([0, 1, 2, 3]);
  });

  it("ports ZBuilding RemoveStoredCannon as first matching built cannon removal", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.builtCannonList = [1, 3, 3, 5];

    expect(building.removeStoredCannon(3)).toBe(true);
    expect(building.builtCannonList).toEqual([1, 3, 5]);

    expect(building.removeStoredCannon(2)).toBe(false);
    expect(building.builtCannonList).toEqual([1, 3, 5]);
  });

  it("ports ZBuilding ProcessSetBuiltCannonData guard exits", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.builtCannonList = [9];

    building.processSetBuiltCannonData(null, 8);
    building.processSetBuiltCannonData(new Uint8Array(7), 7);

    const badCount = new Uint8Array(10);
    new DataView(badCount.buffer).setInt32(4, 3, true);
    building.processSetBuiltCannonData(badCount, badCount.length);

    expect(building.builtCannonList).toEqual([9]);
  });

  it("ports ZBuilding ProcessSetBuiltCannonData as built cannon list replacement", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.builtCannonList = [9];
    const data = new Uint8Array([0, 0, 0, 0, 3, 0, 0, 0, 4, 5, 255]);

    building.processSetBuiltCannonData(data, data.length);

    expect(building.builtCannonList).toEqual([4, 5, 255]);
  });

  it("ports ZBuilding ProcessSetBuildingStateData guard exits", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      refId: 42,
    });
    building.buildState = BuildingState.Select;

    building.processSetBuildingStateData(null, SET_BUILDING_STATE_PACKET_SIZE_BYTES);
    building.processSetBuildingStateData(
      {
        refId: 42,
        state: BuildingState.Building,
        initOffset: 1,
        productionTime: 5,
        objectType: 2,
        objectId: 3,
      },
      SET_BUILDING_STATE_PACKET_SIZE_BYTES - 1,
    );
    building.processSetBuildingStateData(
      {
        refId: 7,
        state: BuildingState.Building,
        initOffset: 1,
        productionTime: 5,
        objectType: 2,
        objectId: 3,
      },
      SET_BUILDING_STATE_PACKET_SIZE_BYTES,
    );

    expect(building.buildState).toBe(BuildingState.Select);
    expect(building.bot).toBe(-1);
    expect(building.boid).toBe(-1);
  });

  it("ports ZBuilding ProcessSetBuildingStateData as production state update", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      refId: 42,
    });
    building.ztime = { ztime: 10 };

    building.processSetBuildingStateData(
      {
        refId: 42,
        state: BuildingState.Building,
        initOffset: 1.5,
        productionTime: 6,
        objectType: 3,
        objectId: 4,
      },
      SET_BUILDING_STATE_PACKET_SIZE_BYTES,
    );

    expect(building.buildState).toBe(BuildingState.Building);
    expect(building.bot).toBe(3);
    expect(building.boid).toBe(4);
    expect(building.initialProductionTime).toBe(11.5);
    expect(building.finalProductionTime).toBe(17.5);
    expect(building.totalProductionTime).toBe(6);
  });

  it("ports ZBuilding CreateBuildingStateData as aligned production state serialization", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      refId: 0x01020304,
    });
    building.ztime = { ztime: 10 };
    building.buildState = BuildingState.Building;
    building.bot = 255;
    building.boid = 260;
    building.initialProductionTime = 12.5;
    building.finalProductionTime = 20;

    const packet = building.createBuildingStateData();
    const view = new DataView(packet.data!.buffer);

    expect(packet.size).toBe(SET_BUILDING_STATE_PACKET_SIZE_BYTES);
    expect(packet.data!.byteLength).toBe(SET_BUILDING_STATE_PACKET_SIZE_BYTES);
    expect(view.getInt32(0, true)).toBe(0x01020304);
    expect(view.getInt32(4, true)).toBe(BuildingState.Building);
    expect(view.getFloat64(8, true)).toBe(2.5);
    expect(view.getFloat64(16, true)).toBe(7.5);
    expect(packet.data![24]).toBe(255);
    expect(packet.data![25]).toBe(4);
  });

  it("ports ZBuilding CreateBuiltCannonData as ref/count/id serialization", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
      refId: 0x01020304,
    });
    building.builtCannonList = [3, 255, 256];

    const packet = building.createBuiltCannonData();

    expect(packet.size).toBe(11);
    expect(Array.from(packet.data)).toEqual([
      0x04,
      0x03,
      0x02,
      0x01,
      0x03,
      0x00,
      0x00,
      0x00,
      0x03,
      0xff,
      0x00,
    ]);
  });

  it("ports ZBuilding StopBuildingProduction unchanged when already selecting nothing", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.buildState = BuildingState.Select;
    building.bot = -1;
    building.boid = -1;
    building.queueList = [new ZBProductionUnit(1, 2)];

    expect(building.stopBuildingProduction()).toBe(false);
    expect(building).toMatchObject({
      buildState: BuildingState.Select,
      bot: -1,
      boid: -1,
      queueList: [new ZBProductionUnit(1, 2)],
    });
  });

  it("ports ZBuilding StopBuildingProduction as production reset with queue clear", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.buildState = BuildingState.Building;
    building.bot = 3;
    building.boid = 4;
    building.queueList = [new ZBProductionUnit(1, 2)];

    expect(building.stopBuildingProduction()).toBe(true);
    expect(building).toMatchObject({
      buildState: BuildingState.Select,
      bot: -1,
      boid: -1,
      queueList: [],
    });
  });

  it("ports ZBuilding StopBuildingProduction without queue clear", () => {
    const building = new BuildingEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const queuedUnit = new ZBProductionUnit(1, 2);
    building.buildState = BuildingState.Paused;
    building.bot = 3;
    building.boid = 4;
    building.queueList = [queuedUnit];

    expect(building.stopBuildingProduction(false)).toBe(true);
    expect(building).toMatchObject({
      buildState: BuildingState.Select,
      bot: -1,
      boid: -1,
      queueList: [queuedUnit],
    });
  });
});
