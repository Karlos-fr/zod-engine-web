import { describe, expect, it } from "vitest";
import {
  EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED,
  initMissileCannonRocketsEffect,
  placeMissileCannonRocketSmoke,
  type MissileCannonRocketsInitState,
  type MissileCannonRocketSmokePlacementState,
} from "../src/simulation/MissileCannonRocketsEffect";
import { calcMissileCannonRocketTimeD2 } from "../src/simulation/ProjectileConstants";
import type { ToughSmokeEffectSpawn } from "../src/simulation/ToughSmokeEffect";

describe("missile cannon rockets effect", () => {
  it("adapts the emissilecrockets.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/MissileCannonRocketsEffect");
    const secondImport = await import("../src/simulation/MissileCannonRocketsEffect");

    expect(EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED).toBe(
      firstImport.EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED,
    );
  });

  it("ports EMissileCRockets Init as bullet image initialization", () => {
    const state: MissileCannonRocketsInitState = {
      bulletImage: null,
      finishedInit: false,
    };

    initMissileCannonRocketsEffect(state);

    expect(state).toEqual({
      bulletImage: "assets/units/cannons/missile_cannon/bullet.png",
      finishedInit: true,
    });
  });

  it("ports EMissileCRockets PlaceSmoke as paired tough-smoke spawning", () => {
    const ztime = { tick: 2 };
    const state: MissileCannonRocketSmokePlacementState<typeof ztime> = {
      ztime,
      startX: 100,
      startY: 50,
      directionX: 10,
      directionY: -5,
      initTime: 1,
      lastSmokeTime: 1,
      otherXShift: 6,
      otherYShift: -3,
    };
    const effects: ToughSmokeEffectSpawn<typeof ztime>[] = [];

    placeMissileCannonRocketSmoke(state, 1.059, 300, effects);

    expect(state.lastSmokeTime).toBeCloseTo(1.0533333333);
    expect(effects).toHaveLength(4);
    expect(effects[0]?.ztime).toBe(ztime);
    expect(effects[0]?.x).toBeCloseTo(99.8);
    expect(effects[0]?.y).toBeCloseTo(50.1);
    expect(effects[1]?.ztime).toBe(ztime);
    expect(effects[1]?.x).toBeCloseTo(105.8);
    expect(effects[1]?.y).toBeCloseTo(47.1);
    expect(effects[2]?.x).toBeCloseTo(100.0666666667);
    expect(effects[2]?.y).toBeCloseTo(49.9666666667);
    expect(effects[3]?.x).toBeCloseTo(106.0666666667);
    expect(effects[3]?.y).toBeCloseTo(46.9666666667);
  });

  it("ports EMissileCRockets PlaceSmoke as strict interval threshold", () => {
    const state: MissileCannonRocketSmokePlacementState<null> = {
      ztime: null,
      startX: 0,
      startY: 0,
      directionX: 1,
      directionY: 1,
      initTime: 0,
      lastSmokeTime: 2,
      otherXShift: 4,
      otherYShift: 5,
    };
    const effects: ToughSmokeEffectSpawn<null>[] = [];

    placeMissileCannonRocketSmoke(
      state,
      2 + calcMissileCannonRocketTimeD2(300),
      300,
      effects,
    );

    expect(state.lastSmokeTime).toBe(2);
    expect(effects).toEqual([]);
  });

  it("ports EMissileCRockets PlaceSmoke as timing update without an effect list", () => {
    const state: MissileCannonRocketSmokePlacementState<null> = {
      ztime: null,
      startX: 0,
      startY: 0,
      directionX: 1,
      directionY: 1,
      initTime: 0,
      lastSmokeTime: 1,
      otherXShift: 4,
      otherYShift: 5,
    };

    placeMissileCannonRocketSmoke(state, 1.03, 300, null);

    expect(state.lastSmokeTime).toBeCloseTo(1.0266666667);
  });
});
