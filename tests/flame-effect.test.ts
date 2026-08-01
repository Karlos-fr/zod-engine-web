import { describe, expect, it } from "vitest";
import {
  FLAME_BULLET_FRAME_COUNT,
  initFlameEffect,
  processFlameEffect,
  type FlameInitState,
  type FlameProcessState,
} from "../src/simulation/FlameEffect";
import type { PyroFireEffectSpawn } from "../src/simulation/PyroFireEffect";

describe("flame effect", () => {
  it("ports EFlame Init as pyro flame bullet frame path initialization", () => {
    const state: FlameInitState = {
      flameBulletFrames: [],
      finishedInit: false,
    };

    initFlameEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.flameBulletFrames).toHaveLength(FLAME_BULLET_FRAME_COUNT);
    expect(state.flameBulletFrames).toEqual([
      "assets/units/robots/pyro/bullet_n00.png",
      "assets/units/robots/pyro/bullet_n01.png",
      "assets/units/robots/pyro/bullet_n02.png",
      "assets/units/robots/pyro/bullet_n03.png",
    ]);
  });

  it("ports EFlame Process kill guard", () => {
    const state: FlameProcessState = {
      ztime: null,
      killMe: true,
      x: 1,
      y: 2,
      startX: 10,
      startY: 20,
      directionX: 3,
      directionY: 4,
      initTime: 5,
      finalTime: 9,
      endX: 30,
      endY: 40,
    };
    const effects: PyroFireEffectSpawn[] = [];

    processFlameEffect(state, 10, effects);

    expect(state.x).toBe(1);
    expect(state.y).toBe(2);
    expect(effects).toEqual([]);
  });

  it("ports EFlame Process as linear movement before final time", () => {
    const state: FlameProcessState = {
      ztime: null,
      killMe: false,
      x: 0,
      y: 0,
      startX: 10,
      startY: 20,
      directionX: 3,
      directionY: -2,
      initTime: 5,
      finalTime: 12,
      endX: 30,
      endY: 40,
    };
    const effects: PyroFireEffectSpawn[] = [];

    processFlameEffect(state, 9, effects);

    expect(state.killMe).toBe(false);
    expect(state.x).toBe(22);
    expect(state.y).toBe(12);
    expect(effects).toEqual([]);
  });

  it("ports EFlame Process as expiry and pyro-fire spawn", () => {
    const ztime = { tick: 1 };
    const state: FlameProcessState<typeof ztime> = {
      ztime,
      killMe: false,
      x: 0,
      y: 0,
      startX: 10,
      startY: 20,
      directionX: 3,
      directionY: -2,
      initTime: 5,
      finalTime: 12,
      endX: 30,
      endY: 40,
    };
    const effects: PyroFireEffectSpawn<typeof ztime>[] = [];

    processFlameEffect(state, 12, effects);

    expect(state.killMe).toBe(true);
    expect(state.x).toBe(0);
    expect(state.y).toBe(0);
    expect(effects).toEqual([{ ztime, x: 30, y: 40 }]);

    const noEffectListState = { ...state, killMe: false };
    processFlameEffect(noEffectListState, 13, null);
    expect(noEffectListState.killMe).toBe(true);
  });
});
