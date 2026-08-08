import { describe, expect, it } from "vitest";
import {
  EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED,
  initMobileMissileRocketsEffect,
  type MobileMissileRocketsEffectSpawn,
  type MobileMissileRocketsInitState,
  placeMobileMissileRocketSmoke,
  renderMobileMissileRocketsEffect,
  type MobileMissileRocketSmokePlacementState,
} from "../src/simulation/MobileMissileRocketsEffect";
import { calcMobileMissileRocketTimeD2 } from "../src/simulation/ProjectileConstants";

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

  it("replaces EMoMissileRockets DoRender with triple centered rocket commands", () => {
    const bulletImage = { id: "mobile-missile-rocket" };
    const calls: unknown[] = [];

    const commands = renderMobileMissileRocketsEffect(
      {
        killMe: false,
        x: 80,
        y: 120,
        leftX: 74,
        leftY: 126,
        rightX: 88,
        rightY: 112,
        bulletImage,
      },
      {
        renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
          calls.push({ surface, x, y, renderHit, aboutCenter });
          return {
            surface,
            x: x - 10,
            y: y - 15,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(commands).toEqual([
      {
        surface: bulletImage,
        x: 70,
        y: 105,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: bulletImage,
        x: 64,
        y: 111,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: bulletImage,
        x: 78,
        y: 97,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
    expect(calls).toEqual([
      {
        surface: bulletImage,
        x: 80,
        y: 120,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: bulletImage,
        x: 74,
        y: 126,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface: bulletImage,
        x: 88,
        y: 112,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces EMoMissileRockets DoRender as no commands for killed or missing image", () => {
    const zmap = {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(
      renderMobileMissileRocketsEffect(
        {
          killMe: true,
          x: 0,
          y: 0,
          leftX: 0,
          leftY: 0,
          rightX: 0,
          rightY: 0,
          bulletImage: {},
        },
        zmap,
      ),
    ).toEqual([]);
    expect(
      renderMobileMissileRocketsEffect(
        {
          killMe: false,
          x: 0,
          y: 0,
          leftX: 0,
          leftY: 0,
          rightX: 0,
          rightY: 0,
          bulletImage: null,
        },
        zmap,
      ),
    ).toEqual([]);
  });

  it("ports EMoMissileRockets PlaceSmoke as triple tough-smoke spawning", () => {
    const ztime = { now: 12 };
    const state: MobileMissileRocketSmokePlacementState<typeof ztime> = {
      ztime,
      startX: 100,
      startY: 200,
      directionX: 10,
      directionY: -20,
      initTime: 1,
      lastSmokeTime: 1.02,
      leftXShift: -3,
      leftYShift: 4,
      rightXShift: 5,
      rightYShift: -6,
    };
    const effects: Array<{ ztime: typeof ztime; x: number; y: number }> = [];

    placeMobileMissileRocketSmoke(state, 1.071, 400, effects);

    expect(effects).toEqual([
      { ztime, x: 100.05, y: 199.9 },
      { ztime, x: 97.05, y: 203.9 },
      { ztime, x: 105.05, y: 193.9 },
      { ztime, x: 100.25, y: 199.5 },
      { ztime, x: 97.25, y: 203.5 },
      { ztime, x: 105.25, y: 193.5 },
    ]);
    expect(state.lastSmokeTime).toBeCloseTo(1.06);
  });

  it("ports EMoMissileRockets PlaceSmoke as strict smoke interval threshold", () => {
    const state: MobileMissileRocketSmokePlacementState<null> = {
      ztime: null,
      startX: 0,
      startY: 0,
      directionX: 1,
      directionY: 1,
      initTime: 2,
      lastSmokeTime: 2,
      leftXShift: -1,
      leftYShift: 0,
      rightXShift: 1,
      rightYShift: 0,
    };
    const effects: Array<{ ztime: null; x: number; y: number }> = [];

    placeMobileMissileRocketSmoke(
      state,
      2 + calcMobileMissileRocketTimeD2(400),
      400,
      effects,
    );

    expect(effects).toEqual([]);
    expect(state.lastSmokeTime).toBe(2);
  });

  it("ports EMoMissileRockets PlaceSmoke as timing update without an effect list", () => {
    const state: MobileMissileRocketSmokePlacementState<null> = {
      ztime: null,
      startX: 0,
      startY: 0,
      directionX: 1,
      directionY: 1,
      initTime: 2,
      lastSmokeTime: 2,
      leftXShift: -1,
      leftYShift: 0,
      rightXShift: 1,
      rightYShift: 0,
    };

    placeMobileMissileRocketSmoke(state, 2.05, 400, null);

    expect(state.lastSmokeTime).toBeCloseTo(2.04);
  });
});
