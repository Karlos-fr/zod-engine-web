import { describe, expect, it } from "vitest";
import {
  ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED,
  initLightInitFireEffect,
  LIGHT_INIT_FIRE_FRAME_COUNT,
  LIGHT_INIT_FIRE_PROCESS_INTERVAL_SECONDS,
  processLightInitFireEffect,
  type LightInitFireInitState,
  type LightInitFireProcessState,
} from "../src/simulation/LightInitFireEffect";

describe("light init fire effect", () => {
  it("adapts the elightinitfire.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/LightInitFireEffect");
    const secondImport = await import("../src/simulation/LightInitFireEffect");

    expect(ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED).toBe(
      firstImport.ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED,
    );
  });

  it("ports ELightInitFire Init as muzzle-flash frame path initialization", () => {
    const state: LightInitFireInitState = {
      renderImages: [],
      finishedInit: false,
    };

    initLightInitFireEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.renderImages).toHaveLength(LIGHT_INIT_FIRE_FRAME_COUNT);
    expect(state.renderImages).toEqual([
      "assets/units/vehicles/light/initfire_n00.png",
      "assets/units/vehicles/light/initfire_n01.png",
      "assets/units/vehicles/light/initfire_n02.png",
      "assets/units/vehicles/light/initfire_n03.png",
    ]);
  });

  it("ports ELightInitFire Process as no-op after kill", () => {
    const state: LightInitFireProcessState = {
      killMe: true,
      nextProcessTime: 12,
    };

    processLightInitFireEffect(state, 20);

    expect(state).toEqual({
      killMe: true,
      nextProcessTime: 12,
    });
  });

  it("ports ELightInitFire Process as one-shot kill at process time", () => {
    const state: LightInitFireProcessState = {
      killMe: false,
      nextProcessTime: 12,
    };

    processLightInitFireEffect(state, 11.999);
    expect(state).toEqual({
      killMe: false,
      nextProcessTime: 12,
    });

    processLightInitFireEffect(state, 12);
    expect(state).toEqual({
      killMe: true,
      nextProcessTime: 12 + LIGHT_INIT_FIRE_PROCESS_INTERVAL_SECONDS,
    });
  });
});
