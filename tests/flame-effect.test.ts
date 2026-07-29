import { describe, expect, it } from "vitest";
import {
  FLAME_BULLET_FRAME_COUNT,
  initFlameEffect,
  type FlameInitState,
} from "../src/simulation/FlameEffect";

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
});
