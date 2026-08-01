import { describe, expect, it } from "vitest";
import {
  type CannonDeathEffectSpawn,
  CannonDeathObject,
  type CannonDeathInitState,
  ECANNON_DEATH_HEADER_GUARD_PORTED,
  initCannonDeathEffect,
  spawnCannonDeathEffectSparks,
} from "../src/simulation/CannonDeathEffect";
import type { DeathSparksEffectSpawn } from "../src/simulation/DeathSparksEffect";

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

  it("ports ECannonDeath construction arguments as a spawn descriptor", () => {
    const ztime = { now: 1250 };
    const spawn: CannonDeathEffectSpawn<typeof ztime> = {
      ztime,
      startX: 32,
      startY: 48,
      targetX: 160,
      targetY: 176,
      offsetTime: 0.35,
      object: CannonDeathObject.Gun,
    };

    expect(spawn).toEqual({
      ztime,
      startX: 32,
      startY: 48,
      targetX: 160,
      targetY: 176,
      offsetTime: 0.35,
      object: CannonDeathObject.Gun,
    });
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

  it("ports ECannonDeath DoSparks null effect list guard", () => {
    expect(() =>
      spawnCannonDeathEffectSparks(
        {
          ztime: { now: 10 },
          x: 20,
          y: 30,
        },
        null,
        () => 14,
      ),
    ).not.toThrow();
  });

  it("ports ECannonDeath DoSparks as centered death spark spawning", () => {
    const ztime = { now: 10 };
    const effects: DeathSparksEffectSpawn<typeof ztime>[] = [];

    spawnCannonDeathEffectSparks(
      {
        ztime,
        x: 20,
        y: 30,
      },
      effects,
      () => 14,
    );

    expect(effects).toHaveLength(34);
    expect(effects[0]).toEqual({
      ztime,
      x: 36,
      y: 46,
    });
    expect(effects[33]).toEqual(effects[0]);
  });
});
