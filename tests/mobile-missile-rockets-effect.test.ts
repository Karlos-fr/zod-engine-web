import { describe, expect, it } from "vitest";
import {
  EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED,
  initMobileMissileRocketsEffect,
  type MobileMissileRocketsEffectSpawn,
  type MobileMissileRocketsInitState,
} from "../src/simulation/MobileMissileRocketsEffect";

describe("mobile missile rockets effect", () => {
  it("adapts the emomissilerockets.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/MobileMissileRocketsEffect");
    const secondImport = await import("../src/simulation/MobileMissileRocketsEffect");

    expect(EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED).toBe(
      firstImport.EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED,
    );
  });

  it("ports EMoMissileRockets Init as bullet image initialization", () => {
    const state: MobileMissileRocketsInitState = {
      bulletImage: null,
      finishedInit: false,
    };

    initMobileMissileRocketsEffect(state);

    expect(state).toEqual({
      bulletImage: "assets/units/vehicles/missile_launcher/bullet.png",
      finishedInit: true,
    });
  });

  it("ports EMoMissileRockets construction arguments as a spawn descriptor", () => {
    const ztime = { now: 12 };
    const spawn: MobileMissileRocketsEffectSpawn<typeof ztime> = {
      ztime,
      startX: 52,
      startY: 74,
      targetX: 120,
      targetY: 140,
    };

    expect(spawn).toEqual({
      ztime,
      startX: 52,
      startY: 74,
      targetX: 120,
      targetY: 140,
    });
  });
});
