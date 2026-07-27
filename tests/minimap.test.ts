import { describe, expect, it } from "vitest";
import {
  MINIMAP_MAX_HEIGHT_PIXELS,
  MINIMAP_MAX_WIDTH_PIXELS,
  type MiniMapTerrainState,
  ZMINIMAP_HEADER_GUARD_PORTED,
  setMiniMapShowTerrain,
  toggleMiniMapShowTerrain,
} from "../src/world/MiniMap";

describe("minimap", () => {
  it("ports the zmini_map.h header guard as module traceability", async () => {
    const firstImport = await import("../src/world/MiniMap");
    const secondImport = await import("../src/world/MiniMap");

    expect(ZMINIMAP_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZMINIMAP_HEADER_GUARD_PORTED).toBe(
      firstImport.ZMINIMAP_HEADER_GUARD_PORTED,
    );
  });

  it("ports MINIMAP_H_MAX as the maximum minimap height", () => {
    expect(MINIMAP_MAX_HEIGHT_PIXELS).toBe(89);
  });

  it("ports MINIMAP_W_MAX as the maximum minimap width", () => {
    expect(MINIMAP_MAX_WIDTH_PIXELS).toBe(92);
  });

  it("ports SetShowTerrain as explicit terrain visibility replacement", () => {
    const state: MiniMapTerrainState = { showTerrain: false };

    const nextState = setMiniMapShowTerrain(state, true);

    expect(nextState.showTerrain).toBe(true);
    expect(state.showTerrain).toBe(false);
  });

  it("ports ToggleShowTerrain from false to true", () => {
    const state: MiniMapTerrainState = { showTerrain: false };

    const nextState = toggleMiniMapShowTerrain(state);

    expect(nextState.showTerrain).toBe(true);
    expect(state.showTerrain).toBe(false);
  });

  it("ports ToggleShowTerrain from true to false", () => {
    expect(toggleMiniMapShowTerrain({ showTerrain: true })).toEqual({
      showTerrain: false,
    });
  });
});
