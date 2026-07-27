import { describe, expect, it } from "vitest";
import {
  type MiniMapTerrainState,
  toggleMiniMapShowTerrain,
} from "../src/world/MiniMap";

describe("minimap", () => {
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
