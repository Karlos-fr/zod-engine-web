import { describe, expect, it } from "vitest";
import {
  clickedMiniMap,
  MINIMAP_MAX_HEIGHT_PIXELS,
  MINIMAP_MAX_WIDTH_PIXELS,
  type MiniMapBoundaryState,
  type MiniMapSetupState,
  type MiniMapTerrainState,
  ZMINIMAP_HEADER_GUARD_PORTED,
  setupMiniMap,
  setupMiniMapBoundaries,
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

  it("ports Setup_Boundaries as tall-map minimap render area fitting", () => {
    const state: MiniMapBoundaryState<{ width: number; height: number }, { id: number }> = {
      zmap: { width: 40, height: 80 },
      objectList: [{ id: 1 }],
      renderArea: { x: 0, y: 0, width: 0, height: 0 },
      renderRatio: 0,
    };

    const nextState = setupMiniMapBoundaries(state);

    expect(nextState).toEqual({
      zmap: state.zmap,
      objectList: state.objectList,
      renderArea: { x: 26, y: 2, width: 40, height: 85 },
      renderRatio: 85 / (80 * 16),
    });
    expect(nextState).not.toBe(state);
  });

  it("ports Setup_Boundaries as wide-map minimap render area fitting", () => {
    const state: MiniMapBoundaryState<{ width: number; height: number }, { id: number }> = {
      zmap: { width: 80, height: 40 },
      objectList: [{ id: 1 }],
      renderArea: { x: 99, y: 99, width: 1, height: 1 },
      renderRatio: 9,
    };

    const nextState = setupMiniMapBoundaries(state);

    expect(nextState.renderArea).toEqual({ x: 2, y: 23, width: 88, height: 42 });
    expect(nextState.renderRatio).toBe(42 / (40 * 16));
  });

  it("ports Setup_Boundaries guard exits when missing map or object list", () => {
    const missingMap: MiniMapBoundaryState<{ width: number; height: number }, { id: number }> = {
      zmap: null,
      objectList: [{ id: 1 }],
      renderArea: { x: 1, y: 2, width: 3, height: 4 },
      renderRatio: 5,
    };
    const missingObjectList: MiniMapBoundaryState<
      { width: number; height: number },
      { id: number }
    > = {
      zmap: { width: 80, height: 40 },
      objectList: null,
      renderArea: { x: 1, y: 2, width: 3, height: 4 },
      renderRatio: 5,
    };

    expect(setupMiniMapBoundaries(missingMap)).toBe(missingMap);
    expect(setupMiniMapBoundaries(missingObjectList)).toBe(missingObjectList);
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
