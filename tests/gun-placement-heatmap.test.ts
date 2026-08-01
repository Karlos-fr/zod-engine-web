import { describe, expect, it } from "vitest";
import {
  ENEMY_HEAT_TILE_DISTANCE,
  FLAG_HEAT_TILE_DISTANCE,
  FORT_HEAT_TILE_DISTANCE,
  GUN_PLACEMENT_HEATMAP_PROCESS_TIME_INCREMENT,
  type GunPlacementCoreReference,
  type GunPlacementMapReference,
  type GunPlacementMapZoneInfoReference,
  type GunPlacementObjectListsReference,
  type GunPlacementObjectReference,
  type HeatMapBaseState,
  UNIT_HISTORY_HEAT_TILE_DISTANCE,
  UNIT_HISTORY_HEATMAP_CLEAR_THRESHOLD,
  UNIT_HISTORY_HEATMAP_TIME_DECAY,
  UNIT_HISTORY_HEATMAP_TIME_INCREMENT,
  ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED,
  addHeatMapHeat,
  clearHeatMap,
  getHeatMapSize,
  lazyCreateGunPlacementRedTile,
  resetHeatMap,
  shouldClearHeatMap,
  shouldResetHeatMap,
} from "../src/world/GunPlacementHeatMap";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { TeamType } from "../src/simulation/SimulationConstants";
import { GameMap } from "../src/world/GameMap";

describe("gun placement heatmap", () => {
  it("ports the ZCore forward declaration as an opaque game-core reference", () => {
    const core = { allowRun: true };
    const acceptCore = (
      value: GunPlacementCoreReference,
    ): GunPlacementCoreReference => value;

    expect(acceptCore(core)).toBe(core);
  });

  it("ports the ZMap forward declaration as a game-map reference", () => {
    const map: GunPlacementMapReference = GameMap.createFlat({
      width: 2,
      height: 2,
    });

    expect(map).toBeInstanceOf(GameMap);
    expect(map.width).toBe(2);
    expect(map.height).toBe(2);
  });

  it("ports the ZObject forward declaration as a game-entity reference", () => {
    const object: GunPlacementObjectReference = new GameEntity({
      id: "factory-1",
      kind: "factory",
      position: { x: 3, y: 4 },
    });

    expect(object).toBeInstanceOf(GameEntity);
    expect(object.position).toEqual({ x: 3, y: 4 });
  });

  it("ports the map_zone_info forward declaration as a map-zone reference", () => {
    const zone: GunPlacementMapZoneInfoReference = {
      owner: TeamType.Red,
      tiles: [],
      x: 1,
      y: 2,
      width: 3,
      height: 4,
      id: 5,
    };

    expect(zone).toEqual({
      owner: TeamType.Red,
      tiles: [],
      x: 1,
      y: 2,
      width: 3,
      height: 4,
      id: 5,
    });
  });

  it("ports the ZOLists forward declaration as an opaque object-lists reference", () => {
    const objectLists = { objects: [] };
    const acceptObjectLists = (
      value: GunPlacementObjectListsReference,
    ): GunPlacementObjectListsReference => value;

    expect(acceptObjectLists(objectLists)).toBe(objectLists);
  });

  it("adapts the zgun_placement_heatmap header guard to module boundaries", async () => {
    const firstImport = await import("../src/world/GunPlacementHeatMap");
    const secondImport = await import("../src/world/GunPlacementHeatMap");

    expect(ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED,
    );
  });

  it("ports process_time_inc as the gun placement process increment", () => {
    expect(GUN_PLACEMENT_HEATMAP_PROCESS_TIME_INCREMENT).toBe(0.25);
  });

  it("ports heat_tile_dist as a flag heat tile-distance constant", () => {
    expect(FLAG_HEAT_TILE_DISTANCE).toBe(6);
  });

  it("ports enemy_heat_tile_dist as a tile-distance constant", () => {
    expect(ENEMY_HEAT_TILE_DISTANCE).toBe(3);
  });

  it("ports fort_heat_tile_dist as a tile-distance constant", () => {
    expect(FORT_HEAT_TILE_DISTANCE).toBe(3);
  });

  it("ports the unit-history heat_tile_dist as a tile-distance constant", () => {
    expect(UNIT_HISTORY_HEAT_TILE_DISTANCE).toBe(6);
  });

  it("ports time_inc as the unit-history heatmap time increment", () => {
    expect(UNIT_HISTORY_HEATMAP_TIME_INCREMENT).toBe(0.01);
  });

  it("ports time_dec as the unit-history heatmap decay factor", () => {
    expect(UNIT_HISTORY_HEATMAP_TIME_DECAY).toBeCloseTo(
      Math.pow(0.2, 1 / (2 * 60 * (1 / 0.01))),
    );
  });

  it("ports clear_threshold as the unit-history heatmap clear threshold", () => {
    expect(UNIT_HISTORY_HEATMAP_CLEAR_THRESHOLD).toBeCloseTo(
      Math.pow(UNIT_HISTORY_HEATMAP_TIME_DECAY, 5 * 60 * (1 / 0.01)),
    );
  });

  it("ports GetHeatMapSize as the heatmap size accessor", () => {
    const state: HeatMapBaseState = { heatMapSize: 256, lastTeam: TeamType.Blue };

    expect(getHeatMapSize(state)).toBe(256);
  });

  it("ports ZHeatMapBase ShouldClear as last-team comparison", () => {
    expect(shouldClearHeatMap({ lastTeam: TeamType.Blue }, TeamType.Blue)).toBe(
      false,
    );
    expect(shouldClearHeatMap({ lastTeam: TeamType.Red }, TeamType.Blue)).toBe(
      true,
    );
  });

  it("ports ZHeatMapBase ShouldReset as map area and heatmap-size comparison", () => {
    expect(
      shouldResetHeatMap({ heatMapSize: 12 }, { width: 3, height: 4 }),
    ).toBe(false);
    expect(
      shouldResetHeatMap({ heatMapSize: 11 }, { width: 3, height: 4 }),
    ).toBe(true);
  });

  it("ports ZHeatMapBase DoReset as heatmap allocation for map dimensions", () => {
    const oldHeatMap = [9, 8, 7];
    const state: HeatMapBaseState = {
      heatMapSize: oldHeatMap.length,
      heatMap: oldHeatMap,
      lastTeam: TeamType.Red,
    };

    resetHeatMap(state, { width: 3, height: 2 });

    expect(state.heatMapSize).toBe(6);
    expect(state.heatMap).toEqual([0, 0, 0, 0, 0, 0]);
    expect(state.heatMap).not.toBe(oldHeatMap);
    expect(state.lastTeam).toBe(TeamType.Red);
  });

  it("ports ZHeatMapBase DoReset by dropping storage for empty maps", () => {
    const state: HeatMapBaseState = {
      heatMapSize: 3,
      heatMap: [1, 2, 3],
      lastTeam: TeamType.Blue,
    };

    resetHeatMap(state, { width: 0, height: 5 });

    expect(state.heatMapSize).toBe(0);
    expect(state.heatMap).toBeUndefined();
    expect(state.lastTeam).toBe(TeamType.Blue);
  });

  it("ports ZHeatMapBase DoReset by clamping negative computed size to zero", () => {
    const state: HeatMapBaseState = {
      heatMapSize: 3,
      heatMap: [1, 2, 3],
    };

    resetHeatMap(state, { width: -2, height: 5 });

    expect(state.heatMapSize).toBe(0);
    expect(state.heatMap).toBeUndefined();
  });

  it("ports ZHeatMapBase DoClear as heatmap reset and optional team update", () => {
    const state: HeatMapBaseState = {
      heatMapSize: 3,
      heatMap: [4, 5, 6, 7],
      lastTeam: TeamType.Red,
    };

    clearHeatMap(state, TeamType.Blue);

    expect(state.heatMap).toEqual([0, 0, 0, 7]);
    expect(state.lastTeam).toBe(TeamType.Blue);

    state.heatMap = [1, 2, 3];
    clearHeatMap(state, -1);

    expect(state.heatMap).toEqual([0, 0, 0]);
    expect(state.lastTeam).toBe(TeamType.Blue);
  });

  it("ports ZHeatMapBase AddHeat as stacked radial tile heat", () => {
    const state: HeatMapBaseState = {
      heatMapSize: 9,
      heatMap: Array.from({ length: 9 }, () => 0),
    };

    addHeatMapHeat(state, { width: 3, height: 3 }, 24, 24, 24, 2);

    expect(state.heatMap?.[4]).toBe(2);
    expect(state.heatMap?.[1]).toBeCloseTo(2 / 3);
    expect(state.heatMap?.[3]).toBeCloseTo(2 / 3);
    expect(state.heatMap?.[5]).toBeCloseTo(2 / 3);
    expect(state.heatMap?.[7]).toBeCloseTo(2 / 3);
    expect(state.heatMap?.[0]).toBeGreaterThan(0);
    expect(state.heatMap?.[8]).toBeGreaterThan(0);

    addHeatMapHeat(state, { width: 3, height: 3 }, 24, 24, 16, 1);

    expect(state.heatMap?.[4]).toBe(3);
    expect(state.heatMap?.[1]).toBeCloseTo(2 / 3);
  });

  it("ports ZHeatMapBase AddHeat as bounded non-stacking heat update", () => {
    const state: HeatMapBaseState = {
      heatMapSize: 4,
      heatMap: [0.25, 0.25, -0.25, -0.25],
    };

    addHeatMapHeat(state, { width: 2, height: 2 }, 8, 8, 8, 0.5, false);
    expect(state.heatMap).toEqual([0.5, 0.25, -0.25, -0.25]);

    addHeatMapHeat(state, { width: 2, height: 2 }, 8, 8, 8, -0.5, false);
    expect(state.heatMap).toEqual([-0.5, 0.25, -0.25, -0.25]);

    addHeatMapHeat(
      { heatMapSize: 4 },
      { width: 2, height: 2 },
      8,
      8,
      16,
      1,
    );
  });

  it("ports ZGunPlacementHeatMap LazyCreateRedTile as no-op when surface exists", () => {
    const calls: string[] = [];
    const redTile = {
      getBaseSurface: () => ({ id: "existing" }),
      loadNewSurface: () => calls.push("load"),
      makeAlphable: () => calls.push("alpha"),
      fillRectOnToMe: () => calls.push("fill"),
    };

    expect(lazyCreateGunPlacementRedTile(redTile)).toBe(true);
    expect(calls).toEqual([]);
  });

  it("ports ZGunPlacementHeatMap LazyCreateRedTile as lazy 16px red surface creation", () => {
    const calls: unknown[] = [];
    let surface: { id: string } | null = null;
    const redTile = {
      getBaseSurface: () => surface,
      loadNewSurface(width: number, height: number): void {
        calls.push(["load", width, height]);
        surface = { id: "red-tile" };
      },
      makeAlphable(): void {
        calls.push("alpha");
      },
      fillRectOnToMe(
        rect: { x: number; y: number; width: number; height: number },
        red: number,
        green: number,
        blue: number,
      ): void {
        calls.push(["fill", rect, red, green, blue]);
      },
    };

    expect(lazyCreateGunPlacementRedTile(redTile)).toBe(true);
    expect(calls).toEqual([
      ["load", 16, 16],
      "alpha",
      ["fill", { x: 0, y: 0, width: 16, height: 16 }, 255, 0, 0],
    ]);
  });

  it("ports ZGunPlacementHeatMap LazyCreateRedTile as false when allocation fails", () => {
    const calls: string[] = [];
    const redTile = {
      getBaseSurface: () => null,
      loadNewSurface: () => calls.push("load"),
      makeAlphable: () => calls.push("alpha"),
      fillRectOnToMe: () => calls.push("fill"),
    };

    expect(lazyCreateGunPlacementRedTile(redTile)).toBe(false);
    expect(calls).toEqual(["load"]);
  });
});
