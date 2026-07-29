import { describe, expect, it } from "vitest";
import {
  type DeathEffectInitState,
  DeathEffectObject,
  EDEATH_HEADER_GUARD_PORTED,
  initDeathEffect,
} from "../src/simulation/DeathEffect";

describe("death effect", () => {
  it("adapts the edeath.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/DeathEffect");
    const secondImport = await import("../src/simulation/DeathEffect");

    expect(EDEATH_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EDEATH_HEADER_GUARD_PORTED).toBe(
      firstImport.EDEATH_HEADER_GUARD_PORTED,
    );
  });

  it("ports edeath_objects as death effect object identifiers", () => {
    expect(DeathEffectObject.Jeep).toBe(0);
    expect(DeathEffectObject.MobileMissile).toBe(1);
    expect(DeathEffectObject.Apc).toBe(2);
    expect(DeathEffectObject.Tank).toBe(3);
    expect(DeathEffectObject.Crane).toBe(4);
  });

  it("ports EDeath Init as wasted vehicle image initialization", () => {
    const state: DeathEffectInitState = {
      jeepWasted: null,
      mobileMissileWasted: null,
      apcWasted: null,
      craneWasted: null,
      finishedInit: false,
    };

    initDeathEffect(state);

    expect(state).toEqual({
      jeepWasted: "assets/units/vehicles/jeep/wasted.png",
      mobileMissileWasted: "assets/units/vehicles/missile_launcher/wasted.png",
      apcWasted: "assets/units/vehicles/apc/wasted.png",
      craneWasted: "assets/units/vehicles/crane/wasted_null.png",
      finishedInit: true,
    });
  });
});
