import { describe, expect, it } from "vitest";
import {
  ELIGHT_ROCKET_HEADER_GUARD_PORTED,
  initLightRocketEffect,
  type LightRocketEffectSpawn,
  type LightRocketInitState,
} from "../src/simulation/LightRocketEffect";

describe("light rocket effect", () => {
  it("adapts the elightrocket.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/LightRocketEffect");
    const secondImport = await import("../src/simulation/LightRocketEffect");

    expect(ELIGHT_ROCKET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ELIGHT_ROCKET_HEADER_GUARD_PORTED).toBe(
      firstImport.ELIGHT_ROCKET_HEADER_GUARD_PORTED,
    );
  });

  it("ports ELightRocket Init as bullet image initialization", () => {
    const state: LightRocketInitState = {
      bulletImage: null,
      finishedInit: false,
    };

    initLightRocketEffect(state);

    expect(state).toEqual({
      bulletImage: "assets/units/vehicles/light/bullet.png",
      finishedInit: true,
    });
  });

  it("ports ELightRocket construction arguments as a spawn descriptor", () => {
    const ztime = { now: 12 };
    const spawn: LightRocketEffectSpawn<typeof ztime> = {
      ztime,
      startX: 52,
      startY: 74,
      targetX: 120,
      targetY: 140,
      speed: 88,
      extraSmall: 0,
      extraLarge: 1,
      extraExtraLarge: 1,
    };

    expect(spawn).toEqual({
      ztime,
      startX: 52,
      startY: 74,
      targetX: 120,
      targetY: 140,
      speed: 88,
      extraSmall: 0,
      extraLarge: 1,
      extraExtraLarge: 1,
    });
  });
});
