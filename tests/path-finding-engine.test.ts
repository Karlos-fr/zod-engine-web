import { describe, expect, it, vi } from "vitest";
import {
  findPathThread,
  PathFindingEngine,
  PathFindingRegionInfo,
  PathFindingResponse,
  PathFindingThreadEntry,
  type PathFindingThreadHandle,
} from "../src/world/navigation/PathFindingEngine";
import { PathFindingPoint } from "../src/world/navigation/AStar";
import {
  PathTileType,
  type MapPathfindingTile,
} from "../src/world/navigation/NavigationTypes";
import { ROAD_SPEED, WATER_SPEED } from "../src/simulation/SimulationConstants";

describe("PathFindingEngine", () => {
  it("ports ZPath_Finding_RegionInfo::Init as zeroed region allocation", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 1;
    regionInfo.height = 1;
    regionInfo.allocated = true;
    regionInfo.floodFillQueue = [new PathFindingPoint(9, 9)];
    regionInfo.robotRegion = [[7]];
    regionInfo.vehicleRegion = [[8]];
    const oldQueue = regionInfo.floodFillQueue;
    const oldRobotRegion = regionInfo.robotRegion;
    const oldVehicleRegion = regionInfo.vehicleRegion;

    regionInfo.init(3, 2);

    expect(oldQueue).toEqual([]);
    expect(oldRobotRegion).toEqual([]);
    expect(oldVehicleRegion).toEqual([]);
    expect(regionInfo).toMatchObject({
      allocated: true,
      width: 3,
      height: 2,
    });
    expect(regionInfo.floodFillQueue).toHaveLength(6);
    expect(regionInfo.floodFillQueue?.[0]).toEqual(new PathFindingPoint(0, 0));
    expect(regionInfo.robotRegion).toEqual([
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
    expect(regionInfo.vehicleRegion).toEqual([
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
  });

  it("ports ZPath_Finding_RegionInfo::Delete as allocated region cleanup", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 2;
    regionInfo.height = 2;
    regionInfo.allocated = true;
    regionInfo.floodFillQueue = [new PathFindingPoint(1, 2)];
    regionInfo.robotRegion = [
      [1, 1],
      [2, 2],
    ];
    regionInfo.vehicleRegion = [
      [3, 3],
      [4, 4],
    ];
    const floodFillQueue = regionInfo.floodFillQueue;
    const robotRegion = regionInfo.robotRegion;
    const vehicleRegion = regionInfo.vehicleRegion;
    const firstRobotColumn = robotRegion[0];
    const firstVehicleColumn = vehicleRegion[0];

    regionInfo.delete();

    expect(floodFillQueue).toEqual([]);
    expect(firstRobotColumn).toEqual([]);
    expect(firstVehicleColumn).toEqual([]);
    expect(robotRegion).toEqual([]);
    expect(vehicleRegion).toEqual([]);
    expect(regionInfo.floodFillQueue).toBeNull();
    expect(regionInfo.robotRegion).toBeNull();
    expect(regionInfo.vehicleRegion).toBeNull();
    expect(regionInfo.allocated).toBe(false);
  });

  it("ports ZPath_Finding_RegionInfo::Delete as no-op when unallocated", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.floodFillQueue = [new PathFindingPoint(1, 2)];
    regionInfo.robotRegion = [[1]];
    regionInfo.vehicleRegion = [[2]];

    regionInfo.delete();

    expect(regionInfo.floodFillQueue).toEqual([new PathFindingPoint(1, 2)]);
    expect(regionInfo.robotRegion).toEqual([[1]]);
    expect(regionInfo.vehicleRegion).toEqual([[2]]);
  });

  it("ports ZPath_Finding_RegionInfo::FloodFill_Recursive as four-way region marking", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 4;
    regionInfo.height = 3;
    const region = [
      [-1, -1, -1],
      [-1, 5, -1],
      [-1, -1, -1],
      [8, -1, -1],
    ];

    regionInfo.floodFillRecursive(region, 0, 0, 4);

    expect(region).toEqual([
      [4, 4, 4],
      [4, 5, 4],
      [4, 4, 4],
      [8, 4, 4],
    ]);
  });

  it("ports ZPath_Finding_RegionInfo::FloodFill_Recursive guard cases", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 2;
    regionInfo.height = 2;
    const region = [
      [-1, -1],
      [-1, 3],
    ];

    regionInfo.floodFillRecursive(region, -1, 0, 9);
    regionInfo.floodFillRecursive(region, 0, -1, 9);
    regionInfo.floodFillRecursive(region, 2, 0, 9);
    regionInfo.floodFillRecursive(region, 0, 2, 9);
    regionInfo.floodFillRecursive(region, 1, 1, 9);

    expect(region).toEqual([
      [-1, -1],
      [-1, 3],
    ]);
  });

  it("ports ZPath_Finding_RegionInfo::FloodFill_AddQ as region marking", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 3;
    regionInfo.height = 2;
    regionInfo.floodFillQueue = [];
    const region = [
      [-1, -1],
      [-1, 5],
      [-1, -1],
    ];

    const nextIndex = regionInfo.floodFillAddQueue(region, 0, 2, 1, 7);

    expect(nextIndex).toBe(1);
    expect(region[2][1]).toBe(7);
    expect(regionInfo.floodFillQueue).toEqual([new PathFindingPoint(2, 1)]);
  });

  it("ports ZPath_Finding_RegionInfo::FloodFill_AddQ no-op cases", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 2;
    regionInfo.height = 2;
    regionInfo.floodFillQueue = [];
    const region = [
      [-1, -1],
      [-1, 3],
    ];

    expect(regionInfo.floodFillAddQueue(region, 4, -1, 0, 9)).toBe(4);
    expect(regionInfo.floodFillAddQueue(region, 4, 0, -1, 9)).toBe(4);
    expect(regionInfo.floodFillAddQueue(region, 4, 2, 0, 9)).toBe(4);
    expect(regionInfo.floodFillAddQueue(region, 4, 0, 2, 9)).toBe(4);
    expect(regionInfo.floodFillAddQueue(region, 4, 1, 1, 9)).toBe(4);

    regionInfo.floodFillQueue = null;
    expect(regionInfo.floodFillAddQueue(region, 4, 0, 0, 9)).toBe(4);

    expect(region).toEqual([
      [-1, -1],
      [-1, 3],
    ]);
  });

  it("ports ZPath_Finding_RegionInfo::FloodFill as four-way region marking", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 4;
    regionInfo.height = 3;
    regionInfo.floodFillQueue = [new PathFindingPoint(99, 99)];
    const region = [
      [-1, -1, -1],
      [-1, 5, -1],
      [-1, -1, -1],
      [8, -1, -1],
    ];

    const filled = regionInfo.floodFill(region, 0, 0, 4);

    expect(filled).toBe(10);
    expect(region).toEqual([
      [4, 4, 4],
      [4, 5, 4],
      [4, 4, 4],
      [8, 4, 4],
    ]);
    expect(regionInfo.floodFillQueue).toHaveLength(10);
    expect(regionInfo.floodFillQueue[0]).toEqual(new PathFindingPoint(0, 0));
    expect(regionInfo.floodFillQueue).not.toContainEqual(
      new PathFindingPoint(1, 1),
    );
    expect(regionInfo.floodFillQueue).not.toContainEqual(
      new PathFindingPoint(3, 0),
    );
  });

  it("ports ZPath_Finding_RegionInfo::FloodFill as no-op without a queue", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 1;
    regionInfo.height = 1;
    regionInfo.floodFillQueue = null;
    const region = [[-1]];

    expect(regionInfo.floodFill(region, 0, 0, 4)).toBe(0);
    expect(region).toEqual([[-1]]);
  });

  it("ports ZPath_Finding_RegionInfo::BuildRegions as passable-region construction", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 4;
    regionInfo.height = 3;
    regionInfo.allocated = true;
    regionInfo.floodFillQueue = [];
    const tileInfo = createTileGrid(4, 3, false);
    const passableTiles = [
      [0, 0],
      [0, 1],
      [1, 0],
      [2, 2],
      [3, 1],
      [3, 2],
    ];
    for (const [x, y] of passableTiles) {
      tileInfo[x][y].passable = true;
    }
    const region = [
      [99, 99, 99],
      [99, 99, 99],
      [99, 99, 99],
      [99, 99, 99],
    ];

    expect(regionInfo.buildRegions(tileInfo, region)).toBe(2);

    expect(region).toEqual([
      [0, 0, -2],
      [0, -2, -2],
      [-2, -2, 1],
      [-2, 1, 1],
    ]);
  });

  it("ports ZPath_Finding_RegionInfo::BuildRegions as no-op when unallocated", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 1;
    regionInfo.height = 1;
    regionInfo.allocated = false;
    regionInfo.floodFillQueue = [];
    const tileInfo = createTileGrid(1, 1, true);
    const region = [[99]];

    expect(regionInfo.buildRegions(tileInfo, region)).toBe(0);
    expect(region).toEqual([[99]]);
  });

  it("ports ZPath_Finding_RegionInfo::InSameRegion as region-id comparison", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 3;
    regionInfo.height = 2;
    regionInfo.allocated = true;
    regionInfo.robotRegion = [
      [0, 0],
      [0, 1],
      [2, 1],
    ];
    regionInfo.vehicleRegion = [
      [3, 3],
      [4, 4],
      [4, 5],
    ];

    expect(regionInfo.inSameRegion(0, 0, 20, 0, true)).toBe(true);
    expect(regionInfo.inSameRegion(0, 0, 20, 20, true)).toBe(false);
    expect(regionInfo.inSameRegion(16, 0, 32, 0, false)).toBe(true);
    expect(regionInfo.inSameRegion(16, 16, 32, 16, false)).toBe(false);
  });

  it("ports ZPath_Finding_RegionInfo::InSameRegion permissive guard cases", () => {
    const regionInfo = new PathFindingRegionInfo();
    regionInfo.width = 1;
    regionInfo.height = 1;
    regionInfo.robotRegion = [[0]];
    regionInfo.vehicleRegion = [[0]];

    expect(regionInfo.inSameRegion(0, 0, 128, 128, true)).toBe(true);

    regionInfo.allocated = true;
    expect(regionInfo.inSameRegion(-1, 0, 0, 0, true)).toBe(true);
    expect(regionInfo.inSameRegion(0, -1, 0, 0, true)).toBe(true);
    expect(regionInfo.inSameRegion(0, 0, -1, 0, true)).toBe(true);
    expect(regionInfo.inSameRegion(0, 0, 0, -1, true)).toBe(true);
    expect(regionInfo.inSameRegion(16, 0, 0, 0, true)).toBe(true);
    expect(regionInfo.inSameRegion(0, 16, 0, 0, true)).toBe(true);
    expect(regionInfo.inSameRegion(0, 0, 16, 0, true)).toBe(true);
    expect(regionInfo.inSameRegion(0, 0, 0, 16, true)).toBe(true);
  });

  it("delegates same-region checks to region info", () => {
    const inSameRegion = vi.fn(() => true);
    const engine = new PathFindingEngine({ inSameRegion });

    expect(engine.inSameRegion(1, 2, 3, 4, true)).toBe(true);
    expect(inSameRegion).toHaveBeenCalledWith(1, 2, 3, 4, true);
  });

  it("ports ZPath_Finding_Engine::RebuildRegions as robot and vehicle rebuilds", () => {
    const tileSet = createTileSet(2, 1, true);
    const robotRegion = [
      [99],
      [99],
    ];
    const vehicleRegion = [
      [88],
      [88],
    ];
    const buildRegions = vi
      .fn()
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4);
    const engine = new PathFindingEngine(
      {
        inSameRegion: () => true,
        buildRegions,
        robotRegion,
        vehicleRegion,
      },
      { width: 2, height: 1, tileSet },
    );

    expect(engine.rebuildRegions()).toEqual({
      robotRegions: 3,
      vehicleRegions: 4,
    });
    expect(buildRegions).toHaveBeenNthCalledWith(
      1,
      tileSet.robotTiles,
      robotRegion,
    );
    expect(buildRegions).toHaveBeenNthCalledWith(
      2,
      tileSet.vehicleTiles,
      vehicleRegion,
    );
  });

  it("ports ZPath_Finding_Engine::RebuildRegions as no-op without region grids", () => {
    const tileSet = createTileSet(1, 1, true);
    const buildRegions = vi.fn();
    const engine = new PathFindingEngine(
      {
        inSameRegion: () => true,
        buildRegions,
        robotRegion: null,
        vehicleRegion: [[0]],
      },
      { width: 1, height: 1, tileSet },
    );
    const unallocatedEngine = new PathFindingEngine(
      {
        inSameRegion: () => true,
        buildRegions,
        robotRegion: [[0]],
        vehicleRegion: [[0]],
      },
      { width: 1, height: 1 },
    );

    expect(engine.rebuildRegions()).toEqual({
      robotRegions: 0,
      vehicleRegions: 0,
    });
    expect(unallocatedEngine.rebuildRegions()).toEqual({
      robotRegions: 0,
      vehicleRegions: 0,
    });
    expect(buildRegions).not.toHaveBeenCalled();
  });

  it("ports ZPath_Finding_Engine::SetImpassable as grid passability updates", () => {
    const tileSet = createTileSet(2, 1, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 1, tileSet },
    );

    engine.setImpassable(0, 0, true, false);
    engine.setImpassable(1, 0, true, true);

    expect(tileSet.robotTiles[0][0].passable).toBe(false);
    expect(tileSet.vehicleTiles[0][0].passable).toBe(false);
    expect(tileSet.robotNoRocksTiles[0][0].passable).toBe(false);
    expect(tileSet.vehicleNoRocksTiles[0][0].passable).toBe(false);
    expect(tileSet.robotTiles[1][0].passable).toBe(false);
    expect(tileSet.vehicleTiles[1][0].passable).toBe(false);
    expect(tileSet.robotNoRocksTiles[1][0].passable).toBe(true);
    expect(tileSet.vehicleNoRocksTiles[1][0].passable).toBe(true);

    engine.setImpassable(0, 0, false, false);

    expect(tileSet.robotTiles[0][0].passable).toBe(true);
    expect(tileSet.vehicleTiles[0][0].passable).toBe(true);
    expect(tileSet.robotNoRocksTiles[0][0].passable).toBe(true);
    expect(tileSet.vehicleNoRocksTiles[0][0].passable).toBe(true);
  });

  it("ports ZPath_Finding_Engine::SetImpassable as no-op outside allocated grids", () => {
    const tileSet = createTileSet(1, 1, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 1, height: 1, tileSet },
    );
    const unallocatedEngine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 1, height: 1 },
    );

    engine.setImpassable(-1, 0, true, false);
    engine.setImpassable(0, -1, true, false);
    engine.setImpassable(1, 0, true, false);
    engine.setImpassable(0, 1, true, false);
    unallocatedEngine.setImpassable(0, 0, true, false);

    expect(tileSet.robotTiles[0][0].passable).toBe(true);
    expect(tileSet.vehicleTiles[0][0].passable).toBe(true);
    expect(tileSet.robotNoRocksTiles[0][0].passable).toBe(true);
    expect(tileSet.vehicleNoRocksTiles[0][0].passable).toBe(true);
  });

  it("checks whether tile coordinates are on the map", () => {
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 3, height: 2 },
    );

    expect(engine.tileOnMap(0, 0)).toBe(true);
    expect(engine.tileOnMap(2, 1)).toBe(true);
    expect(engine.tileOnMap(-1, 0)).toBe(false);
    expect(engine.tileOnMap(0, -1)).toBe(false);
    expect(engine.tileOnMap(3, 1)).toBe(false);
    expect(engine.tileOnMap(2, 2)).toBe(false);
  });

  it("allocates zeroed tile info grids", () => {
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 2 },
    );

    engine.allocAllTileInfo();

    expect(engine.tileSet?.robotTiles).toEqual(createTileGrid(2, 2, false));
    expect(engine.tileSet?.vehicleTiles).toEqual(createTileGrid(2, 2, false));
    expect(engine.tileSet?.robotNoRocksTiles).toEqual(createTileGrid(2, 2, false));
    expect(engine.tileSet?.vehicleNoRocksTiles).toEqual(
      createTileGrid(2, 2, false),
    );
    expect(engine.tileSet?.robotTiles[0][0]).not.toBe(
      engine.tileSet?.vehicleTiles[0][0],
    );
  });

  it("deletes tile info grids and clears the reference result", () => {
    const grid = createTileGrid(2, 2, true);

    expect(PathFindingEngine.deleteTileInfo(grid)).toBeNull();
    expect(grid).toEqual([]);
    expect(PathFindingEngine.deleteTileInfo(null)).toBeNull();
  });

  it("deletes every pathfinding tile grid after clearing active threads", () => {
    PathFindingResponse.existingResponses = 0;
    const tileSet = createTileSet(2, 2, true);
    const robotTiles = tileSet.robotTiles;
    const robotNoRocksTiles = tileSet.robotNoRocksTiles;
    const vehicleTiles = tileSet.vehicleTiles;
    const vehicleNoRocksTiles = tileSet.vehicleNoRocksTiles;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 2, tileSet },
    );
    const response = new PathFindingResponse();
    const wait = vi.fn();
    engine.threadList.push(new PathFindingThreadEntry(1, { wait }, response));

    engine.deleteAllTileInfo();

    expect(wait).toHaveBeenCalledOnce();
    expect(response.killThread).toBe(true);
    expect(engine.threadList).toEqual([]);
    expect(robotTiles).toEqual([]);
    expect(robotNoRocksTiles).toEqual([]);
    expect(vehicleTiles).toEqual([]);
    expect(vehicleNoRocksTiles).toEqual([]);
    expect(engine.tileSet).toBeNull();

    response.dispose();
  });

  it("pushes pathfinding responses onto the response list", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const firstResponse = new PathFindingResponse();
    const secondResponse = new PathFindingResponse();

    engine.pushResponse(firstResponse);
    engine.pushResponse(null);
    engine.pushResponse(secondResponse);

    expect(engine.responseList).toEqual([firstResponse, secondResponse]);

    firstResponse.dispose();
    secondResponse.dispose();
  });

  it("clears queued responses and cancels their tracked threads", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const firstResponse = new PathFindingResponse();
    const secondResponse = new PathFindingResponse();
    firstResponse.threadId = 7;
    secondResponse.threadId = 8;
    const wait = vi.fn();
    engine.responseList.push(firstResponse, secondResponse);
    engine.threadList.push(new PathFindingThreadEntry(7, { wait }, firstResponse));

    engine.clearResponseList();

    expect(wait).toHaveBeenCalledOnce();
    expect(firstResponse.killThread).toBe(true);
    expect(secondResponse.killThread).toBe(false);
    expect(engine.responseList).toEqual([]);
    expect(engine.threadList).toEqual([]);
    expect(PathFindingResponse.existingResponses).toBe(0);
  });

  it("kills and removes a tracked pathfinding thread by id", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = new PathFindingResponse();
    const wait = vi.fn();
    engine.threadList.push(new PathFindingThreadEntry(9, { wait }, response));

    engine.killThreadId(9);

    expect(response.killThread).toBe(true);
    expect(wait).toHaveBeenCalledOnce();
    expect(engine.threadList).toEqual([]);

    response.dispose();
  });

  it("removes thread entries without a thread handle", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = new PathFindingResponse();
    engine.threadList.push(new PathFindingThreadEntry(9, null, response));

    engine.killThreadId(9);

    expect(response.killThread).toBe(false);
    expect(engine.threadList).toEqual([]);

    response.dispose();
  });

  it("ignores missing pathfinding thread ids", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = new PathFindingResponse();
    engine.threadList.push(new PathFindingThreadEntry(9, null, response));

    engine.killThreadId(10);

    expect(engine.threadList).toHaveLength(1);
    expect(response.killThread).toBe(false);

    response.dispose();
  });

  it("clears a tracked pathfinding thread and disposes its response", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = new PathFindingResponse();
    const wait = vi.fn();
    engine.threadList.push(new PathFindingThreadEntry(9, { wait }, response));

    engine.clearThreadId(9);

    expect(wait).not.toHaveBeenCalled();
    expect(response.killThread).toBe(false);
    expect(engine.threadList).toEqual([]);
    expect(PathFindingResponse.existingResponses).toBe(0);
  });

  it("ignores missing pathfinding thread ids when clearing", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = new PathFindingResponse();
    engine.threadList.push(new PathFindingThreadEntry(9, null, response));

    engine.clearThreadId(10);

    expect(engine.threadList).toHaveLength(1);
    expect(PathFindingResponse.existingResponses).toBe(1);

    response.dispose();
  });

  it("clears every tracked pathfinding thread", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const firstResponse = new PathFindingResponse();
    const secondResponse = new PathFindingResponse();
    const firstWait = vi.fn();
    const secondWait = vi.fn();
    engine.threadList.push(
      new PathFindingThreadEntry(7, { wait: firstWait }, firstResponse),
      new PathFindingThreadEntry(8, { wait: secondWait }, secondResponse),
    );

    engine.clearThreadList();

    expect(firstResponse.killThread).toBe(true);
    expect(secondResponse.killThread).toBe(true);
    expect(firstWait).toHaveBeenCalledOnce();
    expect(secondWait).toHaveBeenCalledOnce();
    expect(engine.threadList).toEqual([]);

    firstResponse.dispose();
    secondResponse.dispose();
  });

  it("removes all thread entries without signaling missing thread handles", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = new PathFindingResponse();
    engine.threadList.push(new PathFindingThreadEntry(7, null, response));

    engine.clearThreadList();

    expect(response.killThread).toBe(false);
    expect(engine.threadList).toEqual([]);

    response.dispose();
  });

  it("reports robot and vehicle tile passability", () => {
    const tileSet = createTileSet(2, 1, true);
    tileSet.robotTiles[1][0].passable = true;
    tileSet.vehicleTiles[1][0].passable = false;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 1, tileSet },
    );
    const unallocated = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 1 },
    );

    expect(engine.tilePassable(1, 0, true)).toBe(true);
    expect(engine.tilePassable(1, 0, false)).toBe(false);
    expect(engine.tilePassable(2, 0, true)).toBe(false);
    expect(unallocated.tilePassable(0, 0, true)).toBe(false);
  });

  it("ports ZPath_Finding_Engine::ShouldBeAbleToMoveTo as robot target check", () => {
    const tileSet = createTileSet(2, 1, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 1, tileSet },
    );

    expect(engine.shouldBeAbleToMoveTo(0, 0, 16, 0, true)).toBe(true);

    tileSet.robotTiles[1][0].passable = false;

    expect(engine.shouldBeAbleToMoveTo(0, 0, 16, 0, true)).toBe(false);
  });

  it("ports ZPath_Finding_Engine::ShouldBeAbleToMoveTo as vehicle 2x2 target check", () => {
    const tileSet = createTileSet(3, 3, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 3, height: 3, tileSet },
    );

    expect(engine.shouldBeAbleToMoveTo(0, 0, 16, 16, false)).toBe(true);

    tileSet.vehicleTiles[2][2].passable = false;

    expect(engine.shouldBeAbleToMoveTo(0, 0, 16, 16, false)).toBe(false);
  });

  it("ports ZPath_Finding_Engine::ShouldBeAbleToMoveTo as region gate", () => {
    const tileSet = createTileSet(1, 1, true);
    const inSameRegion = vi.fn(() => false);
    const engine = new PathFindingEngine(
      { inSameRegion },
      { width: 1, height: 1, tileSet },
    );

    expect(engine.shouldBeAbleToMoveTo(0, 0, 0, 0, true)).toBe(false);
    expect(inSameRegion).toHaveBeenCalledWith(0, 0, 0, 0, true);
  });

  it("allows direct paths through passable tiles", () => {
    const tiles = createTileGrid(4, 2, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      {
        width: 4,
        height: 2,
        tileSet: {
          robotTiles: tiles,
          robotNoRocksTiles: tiles,
          vehicleTiles: tiles,
          vehicleNoRocksTiles: tiles,
        },
      },
    );

    expect(engine.directPathPossible(0, 8, 48, 8, true, false)).toBe(true);
    expect(engine.directPathPossible(8, 8, 8, 8, true, false)).toBe(true);
  });

  it("rejects direct paths blocked near the route", () => {
    const robotTiles = createTileGrid(4, 2, true);
    robotTiles[1][0].passable = false;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      {
        width: 4,
        height: 2,
        tileSet: {
          robotTiles,
          robotNoRocksTiles: createTileGrid(4, 2, true),
          vehicleTiles: createTileGrid(4, 2, true),
          vehicleNoRocksTiles: createTileGrid(4, 2, true),
        },
      },
    );

    expect(engine.directPathPossible(0, 8, 48, 8, true, false)).toBe(false);
  });

  it("uses no-rock tile grids when explosives are available", () => {
    const robotTiles = createTileGrid(4, 2, true);
    const robotNoRocksTiles = createTileGrid(4, 2, true);
    robotTiles[1][0].passable = false;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      {
        width: 4,
        height: 2,
        tileSet: {
          robotTiles,
          robotNoRocksTiles,
          vehicleTiles: createTileGrid(4, 2, true),
          vehicleNoRocksTiles: createTileGrid(4, 2, true),
        },
      },
    );

    expect(engine.directPathPossible(0, 8, 48, 8, true, true)).toBe(true);
  });

  it("ports ZPath_Finding_Engine::Find_Path as no request for direct paths", () => {
    const tileSet = createTileSet(4, 2, true);
    const inSameRegion = vi.fn(() => true);
    const threadLauncher = vi.fn();
    const engine = new PathFindingEngine(
      { inSameRegion },
      { width: 4, height: 2, tileSet, threadLauncher },
    );

    expect(engine.findPath(0, 8, 48, 8, true, false, 12)).toBe(0);
    expect(inSameRegion).not.toHaveBeenCalled();
    expect(threadLauncher).not.toHaveBeenCalled();
    expect(engine.threadList).toEqual([]);
  });

  it("ports ZPath_Finding_Engine::Find_Path as path response creation", () => {
    const tileSet = createTileSet(4, 3, true);
    tileSet.robotTiles[1][0].passable = false;
    const wait = vi.fn();
    let capturedResponse: PathFindingResponse | null = null;
    const threadLauncher = vi.fn((response: PathFindingResponse) => {
      capturedResponse = response;
      return { wait };
    });
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 4, height: 3, tileSet, threadLauncher },
    );

    expect(engine.findPath(0, 8, 48, 8, true, false, 77)).toBe(1);

    expect(threadLauncher).toHaveBeenCalledOnce();
    const response = capturedResponse as unknown as PathFindingResponse;
    expect(response.pathFinder).toBe(engine);
    expect(response.threadId).toBe(1);
    expect(response.objectRefId).toBe(77);
    expect(response.startX).toBe(0);
    expect(response.startY).toBe(8);
    expect(response.endX).toBe(48);
    expect(response.endY).toBe(8);
    expect(response.isRobot).toBe(true);
    expect(response.killThread).toBe(false);
    expect(response.width).toBe(4);
    expect(response.height).toBe(3);
    expect(response.tileInfo).toBe(tileSet.robotTiles);
    expect(engine.threadList).toHaveLength(1);
    expect(engine.threadList[0].threadId).toBe(1);
    expect(engine.threadList[0].thread).toEqual({ wait });
    expect(engine.threadList[0].response).toBe(response);

    response.dispose();
  });

  it("ports ZPath_Finding_Engine::Find_Path as no-rock tile selection", () => {
    const tileSet = createTileSet(4, 3, true);
    tileSet.robotTiles[1][0].passable = false;
    tileSet.robotNoRocksTiles[1][0].passable = false;
    let capturedResponse: PathFindingResponse | null = null;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      {
        width: 4,
        height: 3,
        tileSet,
        threadLauncher: (response) => {
          capturedResponse = response;
          return { wait: () => undefined };
        },
      },
    );

    expect(engine.findPath(0, 8, 48, 8, true, true, 77)).toBe(1);
    const response = capturedResponse as unknown as PathFindingResponse;
    expect(response.tileInfo).toBe(tileSet.robotNoRocksTiles);

    response.dispose();
  });

  it("ports ZPath_Finding_Engine::Find_Path as no request across regions", () => {
    const tileSet = createTileSet(4, 3, true);
    tileSet.robotTiles[1][0].passable = false;
    const threadLauncher = vi.fn();
    const engine = new PathFindingEngine(
      { inSameRegion: () => false },
      { width: 4, height: 3, tileSet, threadLauncher },
    );

    expect(engine.findPath(0, 8, 48, 8, true, false, 77)).toBe(0);
    expect(threadLauncher).not.toHaveBeenCalled();
    expect(engine.threadList).toEqual([]);
  });

  it("ports ZPath_Finding_Engine::Find_Path as failed thread launch cleanup", () => {
    PathFindingResponse.existingResponses = 0;
    const tileSet = createTileSet(4, 3, true);
    tileSet.robotTiles[1][0].passable = false;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      {
        width: 4,
        height: 3,
        tileSet,
        threadLauncher: () => null,
      },
    );

    expect(engine.findPath(0, 8, 48, 8, true, false, 77)).toBe(0);
    expect(engine.threadList).toEqual([]);
    expect(PathFindingResponse.existingResponses).toBe(0);
  });

  it("sets normal tile movement info on every pathfinding grid", () => {
    const tileSet = createTileSet(1, 1, false);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 1, height: 1, tileSet },
    );

    engine.setTileInfo(0, 0, PathTileType.Normal);

    expect(tileSet.robotTiles[0][0]).toEqual({
      sideWeight: 100,
      diagonalWeight: 141.4,
      passable: true,
    });
    expect(tileSet.vehicleTiles[0][0]).toEqual(tileSet.robotTiles[0][0]);
    expect(tileSet.robotNoRocksTiles[0][0]).toEqual(tileSet.robotTiles[0][0]);
    expect(tileSet.vehicleNoRocksTiles[0][0]).toEqual(tileSet.robotTiles[0][0]);
  });

  it("sets water and road tile movement rules", () => {
    const tileSet = createTileSet(2, 1, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 1, tileSet },
    );

    engine.setTileInfo(0, 0, PathTileType.Water);
    engine.setTileInfo(1, 0, PathTileType.Road);

    expect(tileSet.robotTiles[0][0].passable).toBe(true);
    expect(tileSet.vehicleTiles[0][0].passable).toBe(false);
    expect(tileSet.robotTiles[0][0].sideWeight).toBeCloseTo(100 / WATER_SPEED);
    expect(tileSet.robotTiles[1][0].sideWeight).toBeCloseTo(
      100 / (ROAD_SPEED + 0.5),
    );
    expect(tileSet.vehicleNoRocksTiles[0][0].passable).toBe(false);
  });

  it("ignores tile info updates outside allocated grids", () => {
    const tileSet = createTileSet(1, 1, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 1, height: 1, tileSet },
    );

    engine.setTileInfo(-1, 0, PathTileType.Impassable);
    engine.setTileInfo(1, 0, PathTileType.Impassable);

    expect(tileSet.robotTiles[0][0].passable).toBe(true);
  });

  it("expands vehicle weights across a 2x2 footprint", () => {
    const tileSet = createTileSet(2, 2, true);
    tileSet.vehicleTiles[0][0].sideWeight = 1;
    tileSet.vehicleTiles[1][0].sideWeight = 2;
    tileSet.vehicleTiles[0][1].sideWeight = 3;
    tileSet.vehicleTiles[1][1].sideWeight = 4;
    tileSet.vehicleTiles[0][0].diagonalWeight = 10;
    tileSet.vehicleTiles[1][0].diagonalWeight = 20;
    tileSet.vehicleTiles[0][1].diagonalWeight = 30;
    tileSet.vehicleTiles[1][1].diagonalWeight = 40;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 2, tileSet },
    );

    engine.setTileWideWeights();

    expect(tileSet.vehicleTiles[0][0].sideWeight).toBe(10);
    expect(tileSet.vehicleTiles[1][0].sideWeight).toBe(6);
    expect(tileSet.vehicleTiles[0][1].sideWeight).toBe(7);
    expect(tileSet.vehicleTiles[1][1].sideWeight).toBe(4);
    expect(tileSet.vehicleTiles[0][0].diagonalWeight).toBe(100);
    expect(tileSet.vehicleNoRocksTiles[0][0].sideWeight).toBe(10);
    expect(tileSet.vehicleNoRocksTiles[0][0].diagonalWeight).toBe(100);
    expect(tileSet.robotTiles[0][0].sideWeight).toBe(0);
  });

  it("reports map-boundary impassable rectangles", () => {
    const tiles = createTileGrid(2, 2, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      {
        width: 2,
        height: 2,
        tileSet: {
          robotTiles: tiles,
          robotNoRocksTiles: tiles,
          vehicleTiles: tiles,
          vehicleNoRocksTiles: tiles,
        },
      },
    );

    expect(engine.withinImpassable(-1, 0, 4, 4, true)).toEqual({
      within: true,
      stopX: -1,
      stopY: 0,
    });
    expect(engine.withinImpassable(28, 0, 4, 4, true)).toEqual({
      within: true,
      stopX: 28,
      stopY: 0,
    });
  });

  it("reports overlapping impassable tile coordinates", () => {
    const robotTiles = createTileGrid(3, 3, true);
    robotTiles[1][1].passable = false;
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      {
        width: 3,
        height: 3,
        tileSet: {
          robotTiles,
          robotNoRocksTiles: createTileGrid(3, 3, true),
          vehicleTiles: createTileGrid(3, 3, true),
          vehicleNoRocksTiles: createTileGrid(3, 3, true),
        },
      },
    );

    expect(engine.withinImpassable(15, 15, 4, 4, true)).toEqual({
      within: true,
      stopX: 16,
      stopY: 16,
    });
    expect(engine.withinImpassable(0, 0, 4, 4, true)).toEqual({
      within: false,
      stopX: 0,
      stopY: 0,
    });
  });

  it("reports destroyable barriers from robot and no-rock grids", () => {
    const tileSet = createTileSet(2, 1, true);
    const engine = new PathFindingEngine(
      { inSameRegion: () => true },
      { width: 2, height: 1, tileSet },
    );
    tileSet.robotTiles[1][0].passable = false;
    tileSet.robotNoRocksTiles[1][0].passable = true;

    expect(engine.hasDestroyableBarrier(1, 0)).toBe(true);
    expect(engine.hasDestroyableBarrier(0, 0)).toBe(false);
    expect(engine.hasDestroyableBarrier(-1, 0)).toBe(false);
    expect(engine.hasDestroyableBarrier(2, 0)).toBe(false);
  });
});

describe("PathFindingResponse", () => {
  it("initializes response fields to the upstream defaults", () => {
    PathFindingResponse.existingResponses = 0;

    const response = new PathFindingResponse();

    expect(PathFindingResponse.existingResponses).toBe(1);
    expect(response.pathFinder).toBeNull();
    expect(response.threadId).toBe(0);
    expect(response.objectRefId).toBe(-1);
    expect(response.tileInfo).toBeNull();
    expect(response.width).toBe(0);
    expect(response.height).toBe(0);
    expect(response.startX).toBe(0);
    expect(response.startY).toBe(0);
    expect(response.endX).toBe(0);
    expect(response.endY).toBe(0);
    expect(response.isRobot).toBe(false);
    expect(response.killThread).toBe(false);
    expect(response.pathFindingPointList).toEqual([]);

    response.dispose();
  });

  it("decrements the live response count once when disposed", () => {
    PathFindingResponse.existingResponses = 0;
    const response = new PathFindingResponse();

    response.dispose();
    response.dispose();

    expect(PathFindingResponse.existingResponses).toBe(0);
  });

  it("stores pathfinding engine, tile info, and point references", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const tileInfo = createTileGrid(1, 1, true);
    const point = new PathFindingPoint(2, 3);
    const response = new PathFindingResponse();

    response.pathFinder = engine;
    response.tileInfo = tileInfo;
    response.pathFindingPointList.push(point);

    expect(response.pathFinder).toBe(engine);
    expect(response.tileInfo).toBe(tileInfo);
    expect(response.pathFindingPointList).toEqual([point]);

    response.dispose();
  });
});

describe("PathFindingThreadEntry", () => {
  it("stores the upstream thread entry fields", () => {
    PathFindingResponse.existingResponses = 0;
    const response = new PathFindingResponse();
    const thread: PathFindingThreadHandle = { wait: () => undefined };

    const entry = new PathFindingThreadEntry(7, thread, response);

    expect(entry.threadId).toBe(7);
    expect(entry.thread).toBe(thread);
    expect(entry.response).toBe(response);

    response.dispose();
  });
});

describe("findPathThread", () => {
  it("returns zero without a pathfinding response", () => {
    expect(findPathThread(null)).toBe(0);
  });

  it("runs A* and queues live responses on their path finder", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = createPathThreadResponse(engine);

    expect(findPathThread(response)).toBe(1);

    expect(engine.responseList).toEqual([response]);
    expect(response.pathFindingPointList.at(-1)).toEqual(new PathFindingPoint(40, 24));

    response.dispose();
  });

  it("disposes killed pathfinding responses without queueing them", () => {
    PathFindingResponse.existingResponses = 0;
    const engine = new PathFindingEngine({ inSameRegion: () => true });
    const response = createPathThreadResponse(engine);
    response.killThread = true;

    expect(findPathThread(response)).toBe(1);

    expect(engine.responseList).toEqual([]);
    expect(PathFindingResponse.existingResponses).toBe(0);
  });
});

function createTileGrid(
  width: number,
  height: number,
  passable: boolean,
): MapPathfindingTile[][] {
  return Array.from({ length: width }, () =>
    Array.from({ length: height }, () => ({
      sideWeight: 0,
      diagonalWeight: 0,
      passable,
    })),
  );
}

function createTileSet(width: number, height: number, passable: boolean) {
  return {
    robotTiles: createTileGrid(width, height, passable),
    robotNoRocksTiles: createTileGrid(width, height, passable),
    vehicleTiles: createTileGrid(width, height, passable),
    vehicleNoRocksTiles: createTileGrid(width, height, passable),
  };
}

function createPathThreadResponse(engine: PathFindingEngine): PathFindingResponse {
  const response = new PathFindingResponse();
  response.pathFinder = engine;
  response.tileInfo = createTileGrid(3, 3, true);
  response.width = 3;
  response.height = 3;
  response.isRobot = true;
  response.startX = 24;
  response.startY = 24;
  response.endX = 40;
  response.endY = 24;
  return response;
}
