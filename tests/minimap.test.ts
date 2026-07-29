import { describe, expect, it } from "vitest";
import {
  clickedMiniMap,
  MINIMAP_MAX_HEIGHT_PIXELS,
  MINIMAP_MAX_WIDTH_PIXELS,
  type MiniMapSetupState,
  type MiniMapTerrainState,
  ZMINIMAP_HEADER_GUARD_PORTED,
  setupMiniMap,
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

  it("ports Setup as minimap map and object-list binding", () => {
    const zmap = { width: 32, height: 24 };
    const objectList = [{ id: 1 }, { id: 2 }];
    const state: MiniMapSetupState<typeof zmap, (typeof objectList)[number]> & {
      showTerrain: boolean;
    } = {
      zmap: null,
      objectList: null,
      showTerrain: true,
    };

    const nextState = setupMiniMap(state, zmap, objectList);

    expect(nextState.zmap).toBe(zmap);
    expect(nextState.objectList).toBe(objectList);
    expect(nextState.showTerrain).toBe(true);
    expect(state.zmap).toBeNull();
    expect(state.objectList).toBeNull();
  });

  it("ports ClickedMap as minimap click to map pixel conversion", () => {
    expect(
      clickedMiniMap(
        30,
        45,
        { x: 10, y: 20, width: 80, height: 100 },
        { width: 40, height: 50 },
      ),
    ).toEqual({ mapX: 160, mapY: 200 });
  });

  it("ports ClickedMap by accepting the render-area edge", () => {
    expect(
      clickedMiniMap(
        90,
        120,
        { x: 10, y: 20, width: 80, height: 100 },
        { width: 40, height: 50 },
      ),
    ).toEqual({ mapX: 640, mapY: 800 });
  });

  it("ports ClickedMap by rejecting clicks outside the render area", () => {
    const renderArea = { x: 10, y: 20, width: 80, height: 100 };
    const mapBasics = { width: 40, height: 50 };

    expect(clickedMiniMap(9, 45, renderArea, mapBasics)).toBeNull();
    expect(clickedMiniMap(91, 45, renderArea, mapBasics)).toBeNull();
    expect(clickedMiniMap(30, 19, renderArea, mapBasics)).toBeNull();
    expect(clickedMiniMap(30, 121, renderArea, mapBasics)).toBeNull();
  });
});
