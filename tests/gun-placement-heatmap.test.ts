import { describe, expect, it } from "vitest";
import {
  ENEMY_HEAT_TILE_DISTANCE,
  FLAG_HEAT_TILE_DISTANCE,
  FORT_HEAT_TILE_DISTANCE,
  GUN_PLACEMENT_HEATMAP_PROCESS_TIME_INCREMENT,
  type HeatMapBaseState,
  UNIT_HISTORY_HEAT_TILE_DISTANCE,
  UNIT_HISTORY_HEATMAP_TIME_INCREMENT,
  ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED,
  getHeatMapSize,
} from "../src/world/GunPlacementHeatMap";

describe("gun placement heatmap", () => {
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

  it("ports GetHeatMapSize as the heatmap size accessor", () => {
    const state: HeatMapBaseState = { heatMapSize: 256 };

    expect(getHeatMapSize(state)).toBe(256);
  });
});
