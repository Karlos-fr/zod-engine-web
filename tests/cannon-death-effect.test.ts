import { describe, expect, it } from "vitest";
import {
  type CannonDeathEffectSpawn,
  CannonDeathObject,
  type CannonDeathInitState,
  type CannonDeathProcessState,
  ECANNON_DEATH_HEADER_GUARD_PORTED,
  initCannonDeathEffect,
  processCannonDeathEffect,
  spawnCannonDeathEffectSparks,
} from "../src/simulation/CannonDeathEffect";
import type { DeathSparksEffectSpawn } from "../src/simulation/DeathSparksEffect";
import {
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
} from "../src/simulation/TurretMissileEffect";

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

  it("leaves already killed cannon death effects unchanged", () => {
    const state = createCannonDeathProcessState({
      killMe: true,
      finalTime: 10,
    });
    const turretEffects: TurretMissileEffectSpawn[] = [];
    const sparkEffects: DeathSparksEffectSpawn[] = [];

    processCannonDeathEffect(state, 12, turretEffects, sparkEffects);

    expect(state.killMe).toBe(true);
    expect(turretEffects).toEqual([]);
    expect(sparkEffects).toEqual([]);
  });

  it("ports ECannonDeath Process as child effect processing before final time", () => {
    let processed = 0;
    const state = createCannonDeathProcessState({
      finalTime: 20,
      extraEffects: [
        {
          process() {
            processed += 1;
          },
        },
        {
          process() {
            processed += 1;
          },
        },
      ],
    });

    processCannonDeathEffect(state, 12, [], []);

    expect(state.killMe).toBe(false);
    expect(processed).toBe(2);
  });

  it("ports ECannonDeath Process as final explosion and turret missile spawn", () => {
    const ztime = { now: 10 };
    const state = createCannonDeathProcessState({
      ztime,
      finalTime: 12,
      x: 20,
      y: 30,
      targetX: 120,
      targetY: 150,
      offsetTime: 0.75,
      object: CannonDeathObject.Howitzer,
    });
    const turretEffects: TurretMissileEffectSpawn<typeof ztime>[] = [];
    const sparkEffects: DeathSparksEffectSpawn<typeof ztime>[] = [];

    processCannonDeathEffect(
      state,
      12,
      turretEffects,
      sparkEffects,
      () => 0,
    );

    expect(state.killMe).toBe(true);
    expect(sparkEffects).toHaveLength(20);
    expect(sparkEffects[0]).toEqual({ ztime, x: 36, y: 46 });
    expect(turretEffects).toEqual([
      {
        ztime,
        startX: 20,
        startY: 30,
        targetX: 120,
        targetY: 150,
        offsetTime: 0.75,
        type: TurretMissileEffectType.Howitzer,
      },
    ]);
  });

  it("ports ECannonDeath Process default object as sparks without missile spawn", () => {
    const state = createCannonDeathProcessState({
      finalTime: 12,
      object: 99,
    });
    const turretEffects: TurretMissileEffectSpawn[] = [];
    const sparkEffects: DeathSparksEffectSpawn[] = [];

    processCannonDeathEffect(state, 12, turretEffects, sparkEffects, () => 0);

    expect(state.killMe).toBe(true);
    expect(sparkEffects).toHaveLength(20);
    expect(turretEffects).toEqual([]);
  });
});

function createCannonDeathProcessState<TTime = unknown>(
  overrides: Partial<CannonDeathProcessState<TTime>> = {},
): CannonDeathProcessState<TTime> {
  return {
    ztime: null,
    killMe: false,
    finalTime: 10,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    offsetTime: 0,
    object: CannonDeathObject.Gatling,
    extraEffects: [],
    ...overrides,
  };
}
