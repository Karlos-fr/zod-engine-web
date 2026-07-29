import { describe, expect, it } from "vitest";
import {
  getMapViewportBlitInfo,
  setMapViewportHasHud,
  setMapViewportOrigin,
  setMapViewportScreenDimensions,
} from "../src/world/MapViewport";

describe("map viewport", () => {
  it("ports ZSDL_Surface::SetMapPlace as map viewport origin assignment", () => {
    const state = { mapPlaceX: 0, mapPlaceY: 0 };

    setMapViewportOrigin(state, 120, 48);

    expect(state).toEqual({ mapPlaceX: 120, mapPlaceY: 48 });
  });

  it("ports ZSDL_Surface::SetHasHud as HUD viewport flag assignment", () => {
    const state = { hasHud: false };

    setMapViewportHasHud(state, true);
    expect(state.hasHud).toBe(true);

    setMapViewportHasHud(state, false);
    expect(state.hasHud).toBe(false);
  });

  it("ports ZSDL_Surface::SetScreenDimensions as viewport size assignment", () => {
    const state = { screenWidth: 0, screenHeight: 0 };

    setMapViewportScreenDimensions(state, 320, 200);

    expect(state).toEqual({ screenWidth: 320, screenHeight: 200 });
  });

  it("ports ZSDL_Surface::GetMapBlitInfo as visible blit clipping", () => {
    const state = {
      screenWidth: 320,
      screenHeight: 200,
      mapPlaceX: 20,
      mapPlaceY: 10,
      hasHud: true,
      hudWidth: 40,
      hudHeight: 30,
    };

    expect(getMapViewportBlitInfo(state, { width: 50, height: 40 }, 12, 8))
      .toEqual({
        fromRect: { x: 0, y: 0, width: 50, height: 40 },
        toRect: { x: 12, y: 8, width: 0, height: 0 },
      });
  });

  it("ports ZSDL_Surface::GetMapBlitInfo as offscreen rejection", () => {
    const state = {
      screenWidth: 100,
      screenHeight: 80,
      mapPlaceX: 0,
      mapPlaceY: 0,
      hasHud: false,
      hudWidth: 0,
      hudHeight: 0,
    };

    expect(getMapViewportBlitInfo(state, null, 0, 0)).toBeNull();
    expect(getMapViewportBlitInfo(state, { width: 10, height: 10 }, 101, 0))
      .toBeNull();
    expect(getMapViewportBlitInfo(state, { width: 10, height: 10 }, 0, 81))
      .toBeNull();
    expect(getMapViewportBlitInfo(state, { width: 10, height: 10 }, -11, 0))
      .toBeNull();
    expect(getMapViewportBlitInfo(state, { width: 10, height: 10 }, 0, -11))
      .toBeNull();
  });

  it("ports ZSDL_Surface::GetMapBlitInfo as edge clipping", () => {
    const state = {
      screenWidth: 100,
      screenHeight: 80,
      mapPlaceX: 0,
      mapPlaceY: 0,
      hasHud: false,
      hudWidth: 0,
      hudHeight: 0,
    };

    expect(getMapViewportBlitInfo(state, { width: 40, height: 30 }, -5, -7))
      .toEqual({
        fromRect: { x: 5, y: 7, width: 35, height: 23 },
        toRect: { x: 0, y: 0, width: 0, height: 0 },
      });
    expect(getMapViewportBlitInfo(state, { width: 40, height: 30 }, 80, 70))
      .toEqual({
        fromRect: { x: 0, y: 0, width: 20, height: 10 },
        toRect: { x: 80, y: 70, width: 0, height: 0 },
      });
  });

  it("uses the SetHasHud state when clipping map blits", () => {
    const state = {
      screenWidth: 100,
      screenHeight: 80,
      mapPlaceX: 0,
      mapPlaceY: 0,
      hasHud: false,
      hudWidth: 20,
      hudHeight: 10,
    };

    expect(getMapViewportBlitInfo(state, { width: 30, height: 30 }, 75, 65))
      .toEqual({
        fromRect: { x: 0, y: 0, width: 25, height: 15 },
        toRect: { x: 75, y: 65, width: 0, height: 0 },
      });

    setMapViewportHasHud(state, true);

    expect(getMapViewportBlitInfo(state, { width: 30, height: 30 }, 75, 65))
      .toEqual({
        fromRect: { x: 0, y: 0, width: 5, height: 5 },
        toRect: { x: 75, y: 65, width: 0, height: 0 },
      });
  });

  it("uses SetScreenDimensions state when clipping map blits", () => {
    const state = {
      screenWidth: 50,
      screenHeight: 40,
      mapPlaceX: 0,
      mapPlaceY: 0,
      hasHud: false,
      hudWidth: 0,
      hudHeight: 0,
    };

    expect(getMapViewportBlitInfo(state, { width: 20, height: 20 }, 45, 35))
      .toEqual({
        fromRect: { x: 0, y: 0, width: 5, height: 5 },
        toRect: { x: 45, y: 35, width: 0, height: 0 },
      });

    setMapViewportScreenDimensions(state, 60, 50);

    expect(getMapViewportBlitInfo(state, { width: 20, height: 20 }, 45, 35))
      .toEqual({
        fromRect: { x: 0, y: 0, width: 15, height: 15 },
        toRect: { x: 45, y: 35, width: 0, height: 0 },
      });
  });
});
