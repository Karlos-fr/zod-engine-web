import { describe, expect, it } from "vitest";
import {
  CannonDeathObject,
  type CannonDeathInitState,
  ECANNON_DEATH_HEADER_GUARD_PORTED,
  initCannonDeathEffect,
} from "../src/simulation/CannonDeathEffect";

describe("cannon death effect", () => {
  it("adapts the ecannondeath.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/CannonDeathEffect");
    const secondImport = await import("../src/simulation/CannonDeathEffect");

    expect(ECANNON_DEATH_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ECANNON_DEATH_HEADER_GUARD_PORTED).toBe(
      firstImport.ECANNON_DEATH_HEADER_GUARD_PORTED,
    );
  });

  it("ports ecannondeath_objects numeric layout", () => {
    expect(CannonDeathObject.Gatling).toBe(0);
    expect(CannonDeathObject.Gun).toBe(1);
    expect(CannonDeathObject.Howitzer).toBe(2);
    expect(CannonDeathObject.Missile).toBe(3);
  });

  it("ports ECannonDeath Init as wasted cannon image initialization", () => {
    const state: CannonDeathInitState = {
      gatlingWasted: null,
      gunWasted: null,
      howitzerWasted: null,
      missileWasted: null,
      finishedInit: false,
    };

    initCannonDeathEffect(state);

    expect(state).toEqual({
      gatlingWasted: "assets/units/cannons/gatling/wasted.png",
      gunWasted: "assets/units/cannons/gun/wasted.png",
      howitzerWasted: "assets/units/cannons/howitzer/wasted.png",
      missileWasted: "assets/units/cannons/missile_cannon/wasted.png",
      finishedInit: true,
    });
  });
});
