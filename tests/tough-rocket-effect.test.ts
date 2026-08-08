import { describe, expect, it } from "vitest";
import {
  ETOUGH_ROCKET_HEADER_GUARD_PORTED,
  calcToughRocketTimeD,
  calcToughRocketTimeD2,
  initToughRocketEffect,
  placeToughRocketSmoke,
  renderToughRocketEffect,
  TOUGH_ROCKET_BULLET_FRAME_COUNT,
  type ToughRocketInitState,
  type ToughRocketSmokePlacementState,
} from "../src/simulation/ToughRocketEffect";
import type { ToughSmokeEffectSpawn } from "../src/simulation/ToughSmokeEffect";

describe("tough rocket effect", () => {
  it("adapts the etoughrocket.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughRocketEffect");
    const secondImport = await import("../src/simulation/ToughRocketEffect");

    expect(ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED,
    );
  });

  it("ports etoughrocket.cpp timing thresholds from missile speed", () => {
    expect(calcToughRocketTimeD(250)).toBe(0.024);
    expect(calcToughRocketTimeD2(250)).toBe(0.032);
  });

  it("ports EToughRocket Init as tough rocket bullet frame path initialization", () => {
    const state: ToughRocketInitState = {
      bulletFrames: [],
      finishedInit: false,
    };

    initToughRocketEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.bulletFrames).toHaveLength(TOUGH_ROCKET_BULLET_FRAME_COUNT);
    expect(state.bulletFrames).toEqual([
      "assets/units/robots/tough/bullet_n00.png",
      "assets/units/robots/tough/bullet_n01.png",
    ]);
  });

  it("ports EToughRocket PlaceSmoke as tough-smoke trail spawning", () => {
    const ztime = { tick: 1 };
    const state: ToughRocketSmokePlacementState<typeof ztime> = {
      ztime,
      startX: 100,
      startY: 50,
      directionX: 10,
      directionY: -5,
      initTime: 1,
      lastSmokeTime: 1,
    };
    const effects: ToughSmokeEffectSpawn<typeof ztime>[] = [];

    placeToughRocketSmoke(state, 1.071, 250, effects);

    expect(state.lastSmokeTime).toBeCloseTo(1.064);
    expect(effects).toHaveLength(2);
    expect(effects[0]?.ztime).toBe(ztime);
    expect(effects[0]?.x).toBeCloseTo(99.76);
    expect(effects[0]?.y).toBeCloseTo(50.12);
    expect(effects[1]?.ztime).toBe(ztime);
    expect(effects[1]?.x).toBeCloseTo(100.08);
    expect(effects[1]?.y).toBeCloseTo(49.96);
  });

  it("ports EToughRocket PlaceSmoke as strict smoke interval threshold", () => {
    const state: ToughRocketSmokePlacementState<null> = {
      ztime: null,
      startX: 0,
      startY: 0,
      directionX: 1,
      directionY: 1,
      initTime: 0,
      lastSmokeTime: 2,
    };
    const effects: ToughSmokeEffectSpawn<null>[] = [];

    placeToughRocketSmoke(state, 2 + calcToughRocketTimeD2(250), 250, effects);

    expect(state.lastSmokeTime).toBe(2);
    expect(effects).toEqual([]);
  });

  it("replaces EToughRocket DoRender with a centered map-relative projectile command", () => {
    const bulletImages = [{ id: "tough-rocket-0" }, { id: "tough-rocket-1" }];
    const state = {
      killMe: false,
      x: 80,
      y: 45,
      bulletIndex: 1,
      bulletImages,
    };
    const calls: unknown[] = [];
    const zmap = {
      renderZSurface(
        surface: (typeof bulletImages)[number],
        x: number,
        y: number,
        renderHit: boolean,
        aboutCenter: boolean,
      ) {
        calls.push(surface, x, y, renderHit, aboutCenter);
        return {
          surface,
          x: x - 16,
          y: y - 11,
          renderHit,
          aboutCenter,
        };
      },
    };

    expect(renderToughRocketEffect(state, zmap)).toEqual({
      surface: bulletImages[0],
      x: 64,
      y: 34,
      renderHit: false,
      aboutCenter: true,
    });
    expect(state.bulletIndex).toBe(0);
    expect(calls).toEqual([bulletImages[0], 80, 45, false, true]);
  });

  it("replaces EToughRocket DoRender as no command for killed or missing projectile frames", () => {
    const zmap = {
      renderZSurface() {
        throw new Error("hidden tough rockets should not render");
      },
    };

    expect(
      renderToughRocketEffect(
        {
          killMe: true,
          x: 80,
          y: 45,
          bulletIndex: 1,
          bulletImages: [{ id: "tough-rocket-0" }],
        },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderToughRocketEffect(
        { killMe: false, x: 80, y: 45, bulletIndex: 1, bulletImages: [] },
        zmap,
      ),
    ).toBeNull();
  });
});
