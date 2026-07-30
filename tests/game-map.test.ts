import { describe, expect, it, vi } from "vitest";
import {
  GameMap,
  type PermanentStampBlitCommand,
  type PermanentRenderableStampBlitCommand,
  type MapSurfaceRenderCommand,
  type MapViewportRenderCommand,
  writeMapPaletteTileInfo,
} from "../src/world/GameMap";
import { MapObjectType, type MapObject } from "../src/world/MapFormat";
import {
  ROAD_SPEED,
  TeamType,
  WATER_SPEED,
} from "../src/simulation/SimulationConstants";
import { MAX_PLANET_TILES } from "../src/world/WorldConstants";

describe("GameMap", () => {
  const paletteTileInfo = {
    isWater: false,
    isPassable: true,
    isUsable: true,
    isRoad: false,
    isEffect: false,
    isWaterEffect: false,
    nextTileInEffect: 0,
    takesTankTracks: true,
    craterType: -1,
    isStarterTile: false,
  };

  it("ports ZMap::WriteMapPaletteTileInfo through an injected persistence adapter", () => {
    const writes: Array<[string, number]> = [];
    const planetTileInfo = [
      [],
      Array.from({ length: MAX_PLANET_TILES + 1 }, (_, index) => ({
        ...paletteTileInfo,
        nextTileInEffect: index,
      })),
    ];

    const result = writeMapPaletteTileInfo(1, planetTileInfo, (filename, tiles) => {
      writes.push([filename, tiles.length]);
      expect(tiles.at(-1)?.nextTileInEffect).toBe(MAX_PLANET_TILES - 1);
      return true;
    });

    expect(result).toBe(1);
    expect(writes).toEqual([["assets/planets/volcanic.tileinfo", 480]]);
    expect(writeMapPaletteTileInfo(1, planetTileInfo, () => false)).toBe(0);
    expect(writeMapPaletteTileInfo(9, planetTileInfo, () => true)).toBe(0);
  });

  it("ports ZMap::RebuildRegions as a pathfinding-region rebuild delegate", () => {
    const rebuildRegions = vi.fn();
    const setImpassable = vi.fn();
    const withinImpassable = vi.fn(() => ({ within: false, stopX: 0, stopY: 0 }));
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      pathFinder: { rebuildRegions, setImpassable, withinImpassable },
    });

    map.rebuildRegions();

    expect(rebuildRegions).toHaveBeenCalledOnce();
  });

  it("ports ZMap::WithinImpassable as a pathfinding-area query delegate", () => {
    const result = { within: true, stopX: 4, stopY: 5 };
    const rebuildRegions = vi.fn();
    const setImpassable = vi.fn();
    const withinImpassable = vi.fn(() => result);
    const map = new GameMap({
      width: 8,
      height: 8,
      tiles: Array.from({ length: 64 }, () => ({ terrain: "plain" })),
      pathFinder: { rebuildRegions, setImpassable, withinImpassable },
    });

    expect(map.withinImpassable(1, 2, 3, 4, true)).toBe(result);
    expect(withinImpassable).toHaveBeenCalledWith(1, 2, 3, 4, true);
  });

  it("ports ZMap::SetImpassable as a pathfinding blockage update delegate", () => {
    const rebuildRegions = vi.fn();
    const setImpassable = vi.fn();
    const withinImpassable = vi.fn(() => ({ within: false, stopX: 0, stopY: 0 }));
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      pathFinder: { rebuildRegions, setImpassable, withinImpassable },
    });

    map.setImpassable(1, 2);
    map.setImpassable(3, 4, false, true);

    expect(setImpassable).toHaveBeenNthCalledWith(1, 1, 2, true, false);
    expect(setImpassable).toHaveBeenNthCalledWith(2, 3, 4, false, true);
  });

  it("ports ZMap::DeletePathfindingInfo as pathfinding tile-info cleanup", () => {
    const rebuildRegions = vi.fn();
    const deleteAllTileInfo = vi.fn();
    const setImpassable = vi.fn();
    const withinImpassable = vi.fn(() => ({ within: false, stopX: 0, stopY: 0 }));
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      pathFinder: {
        rebuildRegions,
        deleteAllTileInfo,
        setImpassable,
        withinImpassable,
      },
    });

    map.deletePathfindingInfo();

    expect(deleteAllTileInfo).toHaveBeenCalledOnce();
  });

  it("ports ZMap::Loaded as file-loaded state read", () => {
    expect(GameMap.createFlat({ width: 1, height: 1 }).loaded()).toBe(false);
    expect(
      new GameMap({
        width: 1,
        height: 1,
        tiles: [{ terrain: "plain" }],
        fileLoaded: true,
      }).loaded(),
    ).toBe(true);
  });

  it("ports ZMap::DebugMapInfo as unloaded map diagnostic text", () => {
    const map = GameMap.createFlat({ width: 1, height: 1 });

    expect(map.debugMapInfo()).toEqual(["DebugMapInfo::map not loaded"]);
  });

  it("ports ZMap::DebugMapInfo as loaded map metadata text", () => {
    const map = new GameMap({
      width: 32,
      height: 24,
      tiles: Array.from({ length: 32 * 24 }, () => ({ terrain: "plain" })),
      objectList: [
        {
          x: 1,
          y: 2,
          owner: 3,
          objectType: MapObjectType.Robot,
          objectId: 4,
          buildingLevel: 0,
          extraLinks: 0,
          healthPercent: 1,
        },
      ],
      mapName: "river",
      terrainType: 2,
      playerCount: 3,
      zoneCount: 4,
      fileLoaded: true,
    });

    expect(map.debugMapInfo()).toEqual([
      "",
      "DebugMapInfo...",
      "Map name:river",
      "Map width:32",
      "Map height:24",
      "Map player_count:3",
      "Map object_count:1",
      "Map zone_count:4",
      "Map terrain_type:arctic",
      "",
    ]);
  });

  it("ports ZMap::GetMapData as retained raw map-data read", () => {
    const data = new Uint8Array([1, 2, 3, 4]);
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      mapData: data,
      mapDataSize: 3,
    });

    expect(map.getMapData()).toEqual({
      hasData: true,
      data,
      size: 3,
    });
  });

  it("ports ZMap::FreeMapData as raw map-data cleanup", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      mapData: new Uint8Array([1, 2, 3]),
    });

    map.freeMapData();

    expect(map.mapData).toBeNull();
    expect(map.mapDataSize).toBe(0);
  });

  it("replaces ZMap::DeRenderMap as full-render surface unload", () => {
    const calls: string[] = [];
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      fullRenderSurface: {
        unload: () => calls.push("unload"),
      },
    });

    map.deRenderMap();

    expect(calls).toEqual(["unload"]);
    expect(GameMap.createFlat({ width: 1, height: 1 }).deRenderMap()).toBeUndefined();
  });

  it("ports ZMap::PlaceObject as an object-list append", () => {
    const map = GameMap.createFlat({ width: 1, height: 1 });
    const object: MapObject = {
      x: 4,
      y: 7,
      owner: 1,
      objectType: MapObjectType.Robot,
      objectId: 2,
      buildingLevel: 0,
      extraLinks: 0,
      healthPercent: 75,
    };

    map.placeObject(object);

    expect(map.objectList).toEqual([object]);
    expect(map.objectList[0]).toBe(object);
  });

  it("ports ZMap::GetViewShift as current view shift read", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      shiftX: 12,
      shiftY: 34,
    });

    expect(map.getViewShift()).toEqual({ x: 12, y: 34 });
  });

  it("replaces ZMap::RenderZSurface as a shifted surface render command", () => {
    const surface = { id: "cursor" };
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      shiftX: 12,
      shiftY: 7,
    });

    const command: MapSurfaceRenderCommand<typeof surface> = map.renderZSurface(
      surface,
      30,
      20,
      true,
      false,
    );

    expect(command).toEqual({
      surface,
      x: 18,
      y: 13,
      renderHit: true,
      aboutCenter: false,
    });
  });

  it("replaces ZMap::DoRender as a full-map viewport blit command", () => {
    const surface = { unload: vi.fn() };
    const map = new GameMap({
      width: 10,
      height: 8,
      tiles: Array.from({ length: 80 }, () => ({ terrain: "plain" })),
      shiftX: 24,
      shiftY: 32,
      viewWidth: 160,
      viewHeight: 96,
      fullRenderSurface: surface,
    });

    const command: MapViewportRenderCommand<typeof surface> = map.doRender(5, 7)!;

    expect(command).toEqual({
      surface,
      region: {
        sourceX: 24,
        sourceY: 32,
        width: 160,
        height: 96,
        destinationX: 5,
        destinationY: 7,
      },
    });
  });

  it("replaces ZMap::DoRender as no command when the map has no render surface", () => {
    const map = GameMap.createFlat({ width: 1, height: 1 });

    expect(map.doRender(5, 7)).toBeNull();
  });

  it("ports ZMap::GetMapCoords as mouse coordinates plus view shift", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      shiftX: 12,
      shiftY: 34,
    });

    expect(map.getMapCoords(5, 6)).toEqual({ x: 17, y: 40 });
  });

  it("ports ZMap::ShiftViewRight(int) as clamped horizontal view movement", () => {
    const map = new GameMap({
      width: 10,
      height: 1,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftX: 20,
      viewWidth: 64,
    });

    expect(map.shiftViewRight(12)).toBe(true);
    expect(map.shiftX).toBe(32);

    expect(map.shiftViewRight(100)).toBe(false);
    expect(map.shiftX).toBe(96);

    expect(map.shiftViewRight(-200)).toBe(false);
    expect(map.shiftX).toBe(0);
  });

  it("ports ZMap::ShiftViewDifference as max shift after stream timeout", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      lastShiftTime: 1,
      shiftOverflow: 0.75,
      readCurrentTime: () => 1.2,
    });

    expect(map.shiftViewDifference()).toBe(1);
    expect(map.shiftOverflow).toBe(0);
    expect(map.lastShiftTime).toBe(1.2);
  });

  it("ports ZMap::ShiftViewDifference as streamed shift with overflow carry", () => {
    const times = [1.05, 1.1];
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      lastShiftTime: 1,
      shiftOverflow: 0.25,
      readCurrentTime: () => times.shift() ?? 1.1,
    });

    expect(map.shiftViewDifference()).toBeCloseTo(16.25);
    expect(map.shiftOverflow).toBeCloseTo(0.25);
    expect(map.lastShiftTime).toBe(1.05);

    expect(map.shiftViewDifference()).toBeCloseTo(16.25);
    expect(map.shiftOverflow).toBeCloseTo(0.25);
    expect(map.lastShiftTime).toBe(1.1);
  });

  it("ports ZMap::ShiftViewRight() as streamed right view movement", () => {
    const map = new GameMap({
      width: 10,
      height: 1,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftX: 20,
      viewWidth: 64,
      lastShiftTime: 1,
      shiftOverflow: 0.25,
      readCurrentTime: () => 1.05,
    });

    expect(map.shiftViewRightByTime()).toBe(true);
    expect(map.shiftX).toBe(36);
    expect(map.shiftOverflow).toBeCloseTo(0.25);
  });

  it("ports ZMap::ShiftViewLeft(int) as clamped leftward view movement", () => {
    const map = new GameMap({
      width: 10,
      height: 1,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftX: 60,
      viewWidth: 64,
    });

    expect(map.shiftViewLeft(12)).toBe(true);
    expect(map.shiftX).toBe(48);

    expect(map.shiftViewLeft(100)).toBe(false);
    expect(map.shiftX).toBe(0);

    expect(map.shiftViewLeft(-200)).toBe(false);
    expect(map.shiftX).toBe(96);
  });

  it("ports ZMap::ShiftViewLeft() as streamed leftward view movement", () => {
    const map = new GameMap({
      width: 10,
      height: 1,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftX: 60,
      viewWidth: 64,
      lastShiftTime: 1,
      shiftOverflow: 0.25,
      readCurrentTime: () => 1.05,
    });

    expect(map.shiftViewLeftByTime()).toBe(true);
    expect(map.shiftX).toBe(44);
    expect(map.shiftOverflow).toBeCloseTo(0.25);
  });

  it("ports ZMap::ShiftViewUp(int) as clamped upward view movement", () => {
    const map = new GameMap({
      width: 1,
      height: 10,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftY: 60,
      viewHeight: 64,
    });

    expect(map.shiftViewUp(12)).toBe(true);
    expect(map.shiftY).toBe(48);

    expect(map.shiftViewUp(100)).toBe(false);
    expect(map.shiftY).toBe(0);

    expect(map.shiftViewUp(-200)).toBe(false);
    expect(map.shiftY).toBe(96);
  });

  it("ports ZMap::ShiftViewUp() as streamed upward view movement", () => {
    const map = new GameMap({
      width: 1,
      height: 10,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftY: 60,
      viewHeight: 64,
      lastShiftTime: 1,
      shiftOverflow: 0.25,
      readCurrentTime: () => 1.05,
    });

    expect(map.shiftViewUpByTime()).toBe(true);
    expect(map.shiftY).toBe(44);
    expect(map.shiftOverflow).toBeCloseTo(0.25);
  });

  it("ports ZMap::ShiftViewDown(int) as clamped downward view movement", () => {
    const map = new GameMap({
      width: 1,
      height: 10,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftY: 20,
      viewHeight: 64,
    });

    expect(map.shiftViewDown(12)).toBe(true);
    expect(map.shiftY).toBe(32);

    expect(map.shiftViewDown(100)).toBe(false);
    expect(map.shiftY).toBe(96);

    expect(map.shiftViewDown(-200)).toBe(false);
    expect(map.shiftY).toBe(0);
  });

  it("ports ZMap::ShiftViewDown() as streamed downward view movement", () => {
    const map = new GameMap({
      width: 1,
      height: 10,
      tiles: Array.from({ length: 10 }, () => ({ terrain: "plain" })),
      shiftY: 20,
      viewHeight: 64,
      lastShiftTime: 1,
      shiftOverflow: 0.25,
      readCurrentTime: () => 1.05,
    });

    expect(map.shiftViewDownByTime()).toBe(true);
    expect(map.shiftY).toBe(36);
    expect(map.shiftOverflow).toBeCloseTo(0.25);
  });

  it("ports ZMap::GetTile as linear tile index to map pixels", () => {
    const map = new GameMap({
      width: 5,
      height: 4,
      tiles: Array.from({ length: 20 }, () => ({ terrain: "plain" })),
    });

    expect(map.getTile(0)).toEqual({ x: 0, y: 0 });
    expect(map.getTile(7)).toEqual({ x: 32, y: 16 });
    expect(map.getTile(19)).toEqual({ x: 64, y: 48 });
  });

  it("ports ZMap::GetTile shifted output as view-relative pixels", () => {
    const map = new GameMap({
      width: 5,
      height: 4,
      tiles: Array.from({ length: 20 }, () => ({ terrain: "plain" })),
      shiftX: 20,
      shiftY: 6,
    });

    expect(map.getTile(7, true)).toEqual({ x: 12, y: 10 });
  });

  it("ports ZMap::GetTileIndex as map pixels to linear tile index", () => {
    const map = new GameMap({
      width: 5,
      height: 4,
      tiles: Array.from({ length: 20 }, () => ({ terrain: "plain" })),
    });

    expect(map.getTileIndex(0, 0)).toBe(0);
    expect(map.getTileIndex(47, 31)).toBe(7);
    expect(map.getTileIndex(79, 63)).toBe(19);
  });

  it("ports ZMap::GetTileIndex bounds checks", () => {
    const map = new GameMap({
      width: 5,
      height: 4,
      tiles: Array.from({ length: 20 }, () => ({ terrain: "plain" })),
    });

    expect(map.getTileIndex(80, 0)).toBe(-1);
    expect(map.getTileIndex(0, 64)).toBe(-1);
    expect(map.getTileIndex(-1, 0)).toBe(-1);
    expect(map.getTileIndex(0, -1)).toBe(-1);
  });

  it("ports ZMap::GetTileIndex shifted input as screen pixels plus view shift", () => {
    const map = new GameMap({
      width: 5,
      height: 4,
      tiles: Array.from({ length: 20 }, () => ({ terrain: "plain" })),
      shiftX: 20,
      shiftY: 6,
    });

    expect(map.getTileIndex(12, 10, true)).toBe(7);
    expect(map.getTileIndex(-21, 0, true)).toBe(-1);
  });

  it("ports ZMap::GetPaletteTile as fixed planet-palette pixel lookup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
    });

    expect(map.getPaletteTile(0, 0)).toBe(0);
    expect(map.getPaletteTile(31, 16)).toBe(21);
    expect(map.getPaletteTile(19 * 16, 23 * 16)).toBe(479);
    expect(map.getPaletteTile(20 * 16, 23 * 16)).toBe(-1);
    expect(map.getPaletteTile(-16, 0)).toBe(-1);
  });

  it("ports ZMap::GetPaletteTile index overload as fixed palette coordinates", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
    });

    expect(map.getPaletteTileCoordinates(21)).toEqual({
      success: true,
      x: 16,
      y: 16,
    });
    expect(map.getPaletteTileCoordinates(479)).toEqual({
      success: true,
      x: 304,
      y: 368,
    });
    expect(map.getPaletteTileCoordinates(480)).toEqual({
      success: false,
      x: 0,
      y: 0,
    });
  });

  it("ports ZMap::CoordIsRoad as palette road lookup at map pixels", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      mapTiles: [{ tile: 0 }, { tile: 1 }, { tile: 2 }, { tile: 3 }],
      terrainType: 1,
      paletteTileInfo: [
        [],
        [
          { ...paletteTileInfo, isRoad: false },
          { ...paletteTileInfo, isRoad: false },
          { ...paletteTileInfo, isRoad: true },
          { ...paletteTileInfo, isRoad: false },
        ],
      ],
    });

    expect(map.coordIsRoad(0, 16)).toBe(true);
    expect(map.coordIsRoad(16, 16)).toBe(false);
  });

  it("ports ZMap::CoordIsRoad by rejecting off-map and missing palette data", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      mapTiles: [{ tile: 10 }, { tile: 11 }, { tile: 12 }, { tile: 13 }],
      terrainType: 0,
      paletteTileInfo: [],
    });

    expect(map.coordIsRoad(-1, 0)).toBe(false);
    expect(map.coordIsRoad(32, 0)).toBe(false);
    expect(map.coordIsRoad(0, 0)).toBe(false);
  });

  it("ports ZMap::CoordCraterType as tile-coordinate palette lookup", () => {
    const map = new GameMap({
      width: 3,
      height: 2,
      tiles: Array.from({ length: 6 }, () => ({ terrain: "plain" })),
      mapTiles: [
        { tile: 0 },
        { tile: 1 },
        { tile: 2 },
        { tile: 3 },
        { tile: 4 },
        { tile: 5 },
      ],
      terrainType: 1,
      paletteTileInfo: [
        [],
        [
          { ...paletteTileInfo, craterType: 0 },
          { ...paletteTileInfo, craterType: 1 },
          { ...paletteTileInfo, craterType: 2 },
          { ...paletteTileInfo, craterType: 3 },
          { ...paletteTileInfo, craterType: 4 },
          { ...paletteTileInfo, craterType: 5 },
        ],
      ],
    });

    expect(map.coordCraterType(0, 0)).toBe(0);
    expect(map.coordCraterType(2, 0)).toBe(2);
    expect(map.coordCraterType(1, 1)).toBe(4);
  });

  it("ports ZMap::CoordCraterType bounds and missing palette guards", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      mapTiles: [{ tile: 10 }, { tile: 11 }, { tile: 12 }, { tile: 13 }],
      terrainType: 0,
      paletteTileInfo: [],
    });

    expect(map.coordCraterType(-1, 0)).toBe(-1);
    expect(map.coordCraterType(0, -1)).toBe(-1);
    expect(map.coordCraterType(2, 0)).toBe(-1);
    expect(map.coordCraterType(0, 2)).toBe(-1);
    expect(map.coordCraterType(0, 0)).toBe(-1);
  });

  it("ports ZMap::SetupAllZoneInfo as border passable tile reconstruction", () => {
    const passableLand = { ...paletteTileInfo, isPassable: true, isWater: false };
    const passableWater = { ...paletteTileInfo, isPassable: true, isWater: true };
    const blocked = { ...paletteTileInfo, isPassable: false, isWater: false };
    const map = new GameMap({
      width: 5,
      height: 4,
      tiles: Array.from({ length: 20 }, () => ({ terrain: "plain" })),
      mapTiles: [
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 1 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 1 },
        { tile: 2 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
        { tile: 0 },
      ],
      paletteTileInfo: [[passableLand, passableWater, blocked]],
      zoneList: [{ x: 1, y: 1, width: 3, height: 2 }],
      zoneInfoList: [
        {
          id: 99,
          owner: TeamType.Red,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          tiles: [],
        },
      ],
    });

    map.setupAllZoneInfo();

    expect(map.zoneInfoList).toHaveLength(1);
    expect(map.zoneInfoList[0]).toMatchObject({
      id: 0,
      owner: TeamType.Null,
      x: 16,
      y: 16,
      width: 48,
      height: 32,
    });
    expect(
      map.zoneInfoList[0].tiles.map((tile) => ({
        x: tile.renderLocation.x,
        y: tile.renderLocation.y,
        isWater: tile.isWater,
      })),
    ).toEqual([
      { x: 38, y: 22, isWater: true },
      { x: 22, y: 22, isWater: false },
      { x: 54, y: 22, isWater: false },
      { x: 22, y: 38, isWater: true },
      { x: 54, y: 38, isWater: false },
    ]);
  });

  it("ports ZMap::RemoveZone as exact zone removal and zone-info rebuild", () => {
    const passableLand = { ...paletteTileInfo, isPassable: true, isWater: false };
    const map = new GameMap({
      width: 4,
      height: 4,
      tiles: Array.from({ length: 16 }, () => ({ terrain: "plain" })),
      mapTiles: Array.from({ length: 16 }, () => ({ tile: 0 })),
      paletteTileInfo: [[passableLand]],
      zoneList: [
        { x: 0, y: 0, width: 2, height: 2 },
        { x: 2, y: 1, width: 2, height: 2 },
      ],
      zoneInfoList: [
        {
          id: 99,
          owner: TeamType.Red,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          tiles: [],
        },
      ],
    });

    expect(map.removeZone(3, 3)).toBe(0);
    expect(map.zoneList).toEqual([
      { x: 0, y: 0, width: 2, height: 2 },
      { x: 2, y: 1, width: 2, height: 2 },
    ]);
    expect(map.zoneInfoList[0].id).toBe(99);

    expect(map.removeZone(0, 0)).toBe(1);
    expect(map.zoneList).toEqual([{ x: 2, y: 1, width: 2, height: 2 }]);
    expect(map.zoneInfoList).toHaveLength(1);
    expect(map.zoneInfoList[0]).toMatchObject({
      id: 0,
      owner: TeamType.Null,
      x: 32,
      y: 16,
      width: 32,
      height: 32,
    });
  });

  it("ports ZMap::AddZone as validation, append, and zone-info rebuild", () => {
    const passableLand = { ...paletteTileInfo, isPassable: true, isWater: false };
    const map = new GameMap({
      width: 4,
      height: 4,
      tiles: Array.from({ length: 16 }, () => ({ terrain: "plain" })),
      mapTiles: Array.from({ length: 16 }, () => ({ tile: 0 })),
      paletteTileInfo: [[passableLand]],
      zoneList: [{ x: 0, y: 0, width: 2, height: 2 }],
      zoneInfoList: [
        {
          id: 99,
          owner: TeamType.Red,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          tiles: [],
        },
      ],
    });

    expect(map.addZone({ x: 4, y: 1, width: 1, height: 1 })).toBe(0);
    expect(map.addZone({ x: 1, y: 4, width: 1, height: 1 })).toBe(0);
    expect(map.addZone({ x: 1, y: 1, width: 5, height: 1 })).toBe(0);
    expect(map.addZone({ x: 1, y: 1, width: 1, height: 5 })).toBe(0);
    expect(map.addZone({ x: 0, y: 0, width: 1, height: 1 })).toBe(0);
    expect(map.zoneList).toEqual([{ x: 0, y: 0, width: 2, height: 2 }]);
    expect(map.zoneInfoList[0].id).toBe(99);

    expect(map.addZone({ x: 2, y: 1, width: 2, height: 2 })).toBe(1);
    expect(map.zoneList).toEqual([
      { x: 0, y: 0, width: 2, height: 2 },
      { x: 2, y: 1, width: 2, height: 2 },
    ]);
    expect(map.zoneInfoList).toHaveLength(2);
    expect(map.zoneInfoList[1]).toMatchObject({
      id: 1,
      owner: TeamType.Null,
      x: 32,
      y: 16,
      width: 32,
      height: 32,
    });
  });

  it("ports ZMap::GetTileWalkSpeed as palette movement speed lookup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      mapTiles: [{ tile: 0 }, { tile: 1 }, { tile: 2 }, { tile: 3 }],
      terrainType: 0,
      paletteTileInfo: [
        [
          { ...paletteTileInfo, isPassable: false, isRoad: false, isWater: false },
          { ...paletteTileInfo, isPassable: true, isRoad: true, isWater: false },
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: true },
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: false },
        ],
      ],
    });

    expect(map.getTileWalkSpeed(0, 0)).toBe(0);
    expect(map.getTileWalkSpeed(16, 0)).toBe(ROAD_SPEED);
    expect(map.getTileWalkSpeed(0, 16)).toBe(WATER_SPEED);
    expect(map.getTileWalkSpeed(16, 16)).toBe(1.0);
  });

  it("ports ZMap::GetTileWalkSpeed bounds and shifted-coordinate handling", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      mapTiles: [{ tile: 0 }, { tile: 1 }, { tile: 2 }, { tile: 3 }],
      terrainType: 0,
      paletteTileInfo: [
        [
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: false },
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: false },
          { ...paletteTileInfo, isPassable: true, isRoad: true, isWater: false },
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: false },
        ],
      ],
      shiftX: 4,
      shiftY: 12,
    });

    expect(map.getTileWalkSpeed(32, 0)).toBe(0);
    expect(map.getTileWalkSpeed(-4, 4, true)).toBe(ROAD_SPEED);
  });

  it("ports ZMap::SubmergeAmount as column-row submerge lookup", () => {
    const map = new GameMap({
      width: 3,
      height: 2,
      tiles: Array.from({ length: 6 }, () => ({ terrain: "plain" })),
      submergeInfoSetup: true,
      submergeAmounts: [
        [0, 1],
        [2, 3],
        [4, 5],
      ],
    });

    expect(map.submergeAmount(0, 0)).toBe(0);
    expect(map.submergeAmount(17, 1)).toBe(2);
    expect(map.submergeAmount(32, 16)).toBe(5);
  });

  it("ports ZMap::SubmergeAmount guards for missing setup and off-map pixels", () => {
    const notSetup = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      submergeAmounts: [
        [7, 8],
        [9, 10],
      ],
    });
    const setup = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      submergeInfoSetup: true,
      submergeAmounts: [
        [7, 8],
        [9, 10],
      ],
    });

    expect(notSetup.submergeAmount(0, 0)).toBe(0);
    expect(setup.submergeAmount(-16, 0)).toBe(0);
    expect(setup.submergeAmount(0, -16)).toBe(0);
    expect(setup.submergeAmount(32, 0)).toBe(0);
    expect(setup.submergeAmount(0, 32)).toBe(0);
  });

  it("ports ZMap::DeleteSubmergeAmounts as no-op when not setup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      submergeInfoSetup: false,
      submergeAmounts: [
        [7, 8],
        [9, 10],
      ],
    });

    map.deleteSubmergeAmounts();

    expect(map.submergeInfoSetup).toBe(false);
    expect(map.submergeAmounts).toEqual([
      [7, 8],
      [9, 10],
    ]);
  });

  it("ports ZMap::DeleteSubmergeAmounts as submerge storage cleanup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      submergeInfoSetup: true,
      submergeAmounts: [
        [7, 8],
        [9, 10],
      ],
    });

    map.deleteSubmergeAmounts();

    expect(map.submergeInfoSetup).toBe(false);
    expect(map.submergeAmounts).toEqual([]);
    expect(map.submergeAmount(0, 0)).toBe(0);
  });

  it("ports ZMap::InitSubmergeAmounts by clearing existing data before unloaded no-op", () => {
    const map = new GameMap({
      width: 2,
      height: 1,
      tiles: Array.from({ length: 2 }, () => ({ terrain: "plain" })),
      submergeInfoSetup: true,
      submergeAmounts: [[7], [8]],
      fileLoaded: false,
    });

    map.initSubmergeAmounts();

    expect(map.submergeInfoSetup).toBe(false);
    expect(map.submergeAmounts).toEqual([]);
  });

  it("ports ZMap::InitSubmergeAmounts as water tile initialization", () => {
    const map = new GameMap({
      width: 2,
      height: 1,
      tiles: Array.from({ length: 2 }, () => ({ terrain: "plain" })),
      mapTiles: [{ tile: 1 }, { tile: 1 }],
      terrainType: 0,
      paletteTileInfo: [
        [
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: false },
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: true },
        ],
      ],
      fileLoaded: true,
    });

    map.initSubmergeAmounts();

    expect(map.submergeInfoSetup).toBe(true);
    expect(map.submergeAmounts).toEqual([[8], [8]]);
  });

  it("ports ZMap::InitSubmergeAmounts by lowering water next to land", () => {
    const map = new GameMap({
      width: 2,
      height: 1,
      tiles: Array.from({ length: 2 }, () => ({ terrain: "plain" })),
      mapTiles: [{ tile: 1 }, { tile: 0 }],
      terrainType: 0,
      paletteTileInfo: [
        [
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: false },
          { ...paletteTileInfo, isPassable: true, isRoad: false, isWater: true },
        ],
      ],
      fileLoaded: true,
    });

    map.initSubmergeAmounts();

    expect(map.submergeAmounts).toEqual([[6], [0]]);
  });

  it("ports ZMap::DeleteRockList as no-op when not setup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      rockListSetup: false,
      rockList: [
        [true, false],
        [false, true],
      ],
    });

    map.deleteRockList();

    expect(map.rockListSetup).toBe(false);
    expect(map.rockList).toEqual([
      [true, false],
      [false, true],
    ]);
  });

  it("ports ZMap::DeleteRockList as rock occupancy cleanup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      rockListSetup: true,
      rockList: [
        [true, false],
        [false, true],
      ],
    });

    map.deleteRockList();

    expect(map.rockListSetup).toBe(false);
    expect(map.rockList).toEqual([]);
  });

  it("ports ZMap::InitRockList by clearing existing data before unloaded no-op", () => {
    const map = new GameMap({
      width: 2,
      height: 1,
      tiles: Array.from({ length: 2 }, () => ({ terrain: "plain" })),
      rockListSetup: true,
      rockList: [[true], [false]],
      fileLoaded: false,
    });

    map.initRockList();

    expect(map.rockListSetup).toBe(false);
    expect(map.rockList).toEqual([]);
  });

  it("ports ZMap::InitRockList as false rock occupancy initialization", () => {
    const map = new GameMap({
      width: 2,
      height: 3,
      tiles: Array.from({ length: 6 }, () => ({ terrain: "plain" })),
      fileLoaded: true,
    });

    map.initRockList();

    expect(map.rockListSetup).toBe(true);
    expect(map.rockList).toEqual([
      [false, false, false],
      [false, false, false],
    ]);
  });

  it("ports ZMap::DeleteStampList as no-op when not setup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      stampListSetup: false,
      stampList: [
        [true, false],
        [false, true],
      ],
      stampListWidth: 2,
      stampListHeight: 2,
    });

    map.deleteStampList();

    expect(map.stampListSetup).toBe(false);
    expect(map.stampList).toEqual([
      [true, false],
      [false, true],
    ]);
    expect(map.stampListWidth).toBe(2);
    expect(map.stampListHeight).toBe(2);
  });

  it("ports ZMap::DeleteStampList as stamp storage cleanup", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [true, false],
        [false, true],
      ],
      stampListWidth: 2,
      stampListHeight: 2,
    });

    map.deleteStampList();

    expect(map.stampListSetup).toBe(false);
    expect(map.stampList).toEqual([]);
    expect(map.stampListWidth).toBe(-1);
    expect(map.stampListHeight).toBe(-1);
  });

  it("ports ZMap::InitStampList by clearing existing data before unloaded no-op", () => {
    const map = new GameMap({
      width: 2,
      height: 1,
      tiles: Array.from({ length: 2 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [[true], [false]],
      stampListWidth: 2,
      stampListHeight: 1,
      fileLoaded: false,
    });

    map.initStampList();

    expect(map.stampListSetup).toBe(false);
    expect(map.stampList).toEqual([]);
    expect(map.stampListWidth).toBe(-1);
    expect(map.stampListHeight).toBe(-1);
  });

  it("ports ZMap::InitStampList as false terrain stamp initialization", () => {
    const map = new GameMap({
      width: 2,
      height: 3,
      tiles: Array.from({ length: 6 }, () => ({ terrain: "plain" })),
      fileLoaded: true,
    });

    map.initStampList();

    expect(map.stampListSetup).toBe(true);
    expect(map.stampList).toEqual([
      [false, false, false],
      [false, false, false],
    ]);
    expect(map.stampListWidth).toBe(2);
    expect(map.stampListHeight).toBe(3);
  });

  it("ports ZMap::MakeSureStampListExists by initializing missing stamp data", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      fileLoaded: true,
    });

    map.makeSureStampListExists();

    expect(map.stampListSetup).toBe(true);
    expect(map.stampList).toEqual([
      [false, false],
      [false, false],
    ]);
    expect(map.stampListWidth).toBe(2);
    expect(map.stampListHeight).toBe(2);
  });

  it("ports ZMap::MakeSureStampListExists by rebuilding mismatched stamp dimensions", () => {
    const map = new GameMap({
      width: 3,
      height: 1,
      tiles: Array.from({ length: 3 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [[true], [false]],
      stampListWidth: 2,
      stampListHeight: 1,
      fileLoaded: true,
    });

    map.makeSureStampListExists();

    expect(map.stampListSetup).toBe(true);
    expect(map.stampList).toEqual([[false], [false], [false]]);
    expect(map.stampListWidth).toBe(3);
    expect(map.stampListHeight).toBe(1);
  });

  it("ports ZMap::MakeSureStampListExists as no-op for matching stamp dimensions", () => {
    const stampList = [[true, false], [false, true]];
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList,
      stampListWidth: 2,
      stampListHeight: 2,
      fileLoaded: true,
    });

    map.makeSureStampListExists();

    expect(map.stampList).toBe(stampList);
    expect(map.stampListSetup).toBe(true);
    expect(map.stampListWidth).toBe(2);
    expect(map.stampListHeight).toBe(2);
  });

  it("ports ZMap::CoordStamped as stamped tile lookup from map pixels", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [false, true],
        [true, false],
      ],
      stampListWidth: 2,
      stampListHeight: 2,
      fileLoaded: true,
    });

    expect(map.coordStamped(0, 17)).toBe(true);
    expect(map.coordStamped(16, 0)).toBe(true);
    expect(map.coordStamped(0, 0)).toBe(false);
    expect(map.coordStamped(31, 31)).toBe(false);
  });

  it("ports ZMap::CoordStamped by rejecting off-list pixels", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [true, true],
        [true, true],
      ],
      stampListWidth: 2,
      stampListHeight: 2,
      fileLoaded: true,
    });

    expect(map.coordStamped(-1, 0)).toBe(false);
    expect(map.coordStamped(0, -1)).toBe(false);
    expect(map.coordStamped(32, 0)).toBe(false);
    expect(map.coordStamped(0, 32)).toBe(false);
  });

  it("ports ZMap::CoordStamped by ensuring the stamp list before lookup", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      fileLoaded: true,
    });

    expect(map.coordStamped(0, 0)).toBe(false);
    expect(map.stampListSetup).toBe(true);
    expect(map.stampList).toEqual([[false]]);
    expect(map.stampListWidth).toBe(1);
    expect(map.stampListHeight).toBe(1);
  });

  it("ports ZMap::MarkAreaStamped as marking every touched tile", () => {
    const map = new GameMap({
      width: 3,
      height: 3,
      tiles: Array.from({ length: 9 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ],
      stampListWidth: 3,
      stampListHeight: 3,
      fileLoaded: true,
    });

    map.markAreaStamped(8, 8, 24, 24);

    expect(map.stampList).toEqual([
      [true, true, false],
      [true, true, false],
      [false, false, false],
    ]);
  });

  it("ports ZMap::MarkAreaStamped by excluding exact tile boundary endings", () => {
    const map = new GameMap({
      width: 3,
      height: 3,
      tiles: Array.from({ length: 9 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ],
      stampListWidth: 3,
      stampListHeight: 3,
      fileLoaded: true,
    });

    map.markAreaStamped(16, 16, 16, 16);

    expect(map.stampList).toEqual([
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ]);
  });

  it("ports ZMap::MarkAreaStamped by clamping to stamp-list bounds", () => {
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [false, false],
        [false, false],
      ],
      stampListWidth: 2,
      stampListHeight: 2,
      fileLoaded: true,
    });

    map.markAreaStamped(-8, -8, 64, 64);

    expect(map.stampList).toEqual([
      [true, true],
      [true, true],
    ]);
  });

  it("ports ZMap::MarkAreaStamped by ensuring the stamp list before marking", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      fileLoaded: true,
    });

    map.markAreaStamped(0, 0, 16, 16);

    expect(map.stampListSetup).toBe(true);
    expect(map.stampList).toEqual([[true]]);
    expect(map.coordStamped(0, 0)).toBe(true);
  });

  it("ports ZMap::PermStamp as false when the full render surface is missing", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      fileLoaded: true,
    });
    const blits: Array<PermanentStampBlitCommand<{ width: number; height: number }>> =
      [];

    expect(
      map.permStamp(0, 0, { width: 16, height: 16 }, true, false, (command) =>
        blits.push(command),
      ),
    ).toBe(false);
    expect(blits).toEqual([]);
    expect(map.stampListSetup).toBe(false);
  });

  it("ports ZMap::PermStamp as true without side effects when the source surface is missing", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      fileLoaded: true,
    });
    const blits: Array<PermanentStampBlitCommand<{ width: number; height: number }>> =
      [];

    expect(
      map.permStamp(0, 0, null, true, true, (command) => blits.push(command)),
    ).toBe(true);
    expect(blits).toEqual([]);
    expect(map.stampListSetup).toBe(false);
  });

  it("ports ZMap::PermStamp as optional tile marking plus full-render blit", () => {
    const surface = { width: 24, height: 24 };
    const map = new GameMap({
      width: 3,
      height: 3,
      tiles: Array.from({ length: 9 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ],
      stampListWidth: 3,
      stampListHeight: 3,
      fileLoaded: true,
    });
    const blits: Array<PermanentStampBlitCommand<typeof surface>> = [];

    expect(
      map.permStamp(8, 8, surface, true, true, (command) => blits.push(command)),
    ).toBe(true);

    expect(map.stampList).toEqual([
      [true, true, false],
      [true, true, false],
      [false, false, false],
    ]);
    expect(blits).toEqual([
      {
        surface,
        destinationX: 8,
        destinationY: 8,
        width: 24,
        height: 24,
      },
    ]);
  });

  it("ports ZMap::PermStamp renderable overload as true without side effects when base surface is missing", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      fileLoaded: true,
    });
    const surface = { baseSurface: null };
    const blits: Array<PermanentRenderableStampBlitCommand<typeof surface>> = [];

    expect(
      map.permStampRenderableSurface(0, 0, surface, true, true, (command) =>
        blits.push(command),
      ),
    ).toBe(true);
    expect(blits).toEqual([]);
    expect(map.stampListSetup).toBe(false);
  });

  it("ports ZMap::PermStamp renderable overload as optional tile marking plus source blit", () => {
    const surface = { baseSurface: { width: 24, height: 24 }, textureId: "rock" };
    const map = new GameMap({
      width: 3,
      height: 3,
      tiles: Array.from({ length: 9 }, () => ({ terrain: "plain" })),
      stampListSetup: true,
      stampList: [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ],
      stampListWidth: 3,
      stampListHeight: 3,
      fileLoaded: true,
    });
    const blits: Array<PermanentRenderableStampBlitCommand<typeof surface>> = [];

    expect(
      map.permStampRenderableSurface(8, 8, surface, true, true, (command) =>
        blits.push(command),
      ),
    ).toBe(true);

    expect(map.stampList).toEqual([
      [true, true, false],
      [true, true, false],
      [false, false, false],
    ]);
    expect(blits).toEqual([
      {
        surface,
        destinationX: 8,
        destinationY: 8,
        width: 24,
        height: 24,
      },
    ]);
  });

  it("ports ZMap::GetViewLimits as shifted map view bounds", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      shiftX: 12,
      shiftY: 34,
      viewWidth: 640,
      viewHeight: 480,
    });

    expect(map.getViewLimits()).toEqual({
      mapLeft: 12,
      mapRight: 652,
      mapTop: 34,
      mapBottom: 514,
    });
  });

  it("ports ZMap::GetViewShiftFull as shift plus view dimensions", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      shiftX: 12,
      shiftY: 34,
      viewWidth: 640,
      viewHeight: 480,
    });

    expect(map.getViewShiftFull()).toEqual({
      x: 12,
      y: 34,
      viewWidth: 640,
      viewHeight: 480,
    });
  });

  it("ports ZMap::WithinView as shifted rectangle intersection check", () => {
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      shiftX: 100,
      shiftY: 200,
      viewWidth: 640,
      viewHeight: 480,
    });

    expect(map.withinView(120, 220, 10, 10)).toBe(true);
    expect(map.withinView(741, 220, 10, 10)).toBe(false);
    expect(map.withinView(120, 681, 10, 10)).toBe(false);
    expect(map.withinView(80, 220, 19, 10)).toBe(false);
    expect(map.withinView(120, 180, 10, 19)).toBe(false);
    expect(map.withinView(740, 680, 0, 0)).toBe(true);
    expect(map.withinView(80, 180, 20, 20)).toBe(true);
  });
});
