import { describe, expect, it } from "vitest";
import {
  type DeathEffectInitState,
  DeathEffectObject,
  type DeathEffectProcessState,
  EDEATH_HEADER_GUARD_PORTED,
  initDeathEffect,
  processDeathEffect,
  spawnDeathEffectSparks,
} from "../src/simulation/DeathEffect";
import type { DeathSparksEffectSpawn } from "../src/simulation/DeathSparksEffect";

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

  it("ports EDeath DoSparks null effect list guard", () => {
    expect(() =>
      spawnDeathEffectSparks(
        {
          ztime: { now: 10 },
          x: 20,
          y: 30,
        },
        null,
        () => 29,
      ),
    ).not.toThrow();
  });

  it("ports EDeath DoSparks as centered death spark spawning", () => {
    const ztime = { now: 10 };
    const effects: DeathSparksEffectSpawn<typeof ztime>[] = [];

    spawnDeathEffectSparks(
      {
        ztime,
        x: 20,
        y: 30,
      },
      effects,
      () => 29,
    );

    expect(effects).toHaveLength(69);
    expect(effects[0]).toEqual({
      ztime,
      x: 36,
      y: 46,
    });
    expect(effects[68]).toEqual(effects[0]);
  });

  it("ports EDeath Process killme guard", () => {
    const ztime = { now: 10 };
    let processed = 0;
    const state: DeathEffectProcessState<typeof ztime> = {
      killme: true,
      finalTime: 5,
      ztime,
      x: 20,
      y: 30,
      extraEffects: [{ process: () => (processed += 1) }],
    };
    const effects: DeathSparksEffectSpawn<typeof ztime>[] = [];

    processDeathEffect(state, 10, effects, () => {
      throw new Error("randomInt should not be called");
    });

    expect(state.killme).toBe(true);
    expect(processed).toBe(0);
    expect(effects).toEqual([]);
  });

  it("ports EDeath Process final-time spark spawning", () => {
    const ztime = { now: 10 };
    let processed = 0;
    const state: DeathEffectProcessState<typeof ztime> = {
      killme: false,
      finalTime: 5,
      ztime,
      x: 20,
      y: 30,
      extraEffects: [{ process: () => (processed += 1) }],
    };
    const effects: DeathSparksEffectSpawn<typeof ztime>[] = [];

    processDeathEffect(state, 5, effects, () => 0);

    expect(state.killme).toBe(true);
    expect(processed).toBe(0);
    expect(effects).toHaveLength(40);
    expect(effects[0]).toEqual({
      ztime,
      x: 36,
      y: 46,
    });
  });

  it("ports EDeath Process child effect processing before final time", () => {
    const state: DeathEffectProcessState<null> = {
      killme: false,
      finalTime: 5,
      ztime: null,
      x: 20,
      y: 30,
      extraEffects: [
        { process: () => calls.push("first") },
        { process: () => calls.push("second") },
      ],
    };
    const calls: string[] = [];
    const effects: DeathSparksEffectSpawn<null>[] = [];

    processDeathEffect(state, 4.99, effects, () => {
      throw new Error("randomInt should not be called");
    });

    expect(state.killme).toBe(false);
    expect(calls).toEqual(["first", "second"]);
    expect(effects).toEqual([]);
  });
});
