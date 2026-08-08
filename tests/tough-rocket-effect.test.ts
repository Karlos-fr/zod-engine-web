import { describe, expect, it } from "vitest";
import { SoundEngineSound } from "../src/audio/AudioService";
import {
  ETOUGH_ROCKET_HEADER_GUARD_PORTED,
  calcToughRocketTimeD,
  calcToughRocketTimeD2,
  initToughRocketEffect,
  placeToughRocketSmoke,
  processToughRocketEffect,
  renderToughRocketEffect,
  TOUGH_ROCKET_BULLET_FRAME_COUNT,
  type ToughRocketInitState,
  type ToughRocketMushroomSpawn,
  type ToughRocketProcessState,
  type ToughRocketRestrictedSoundCommand,
  type ToughRocketSmokePlacementState,
} from "../src/simulation/ToughRocketEffect";
import type { ToughSmokeEffectSpawn } from "../src/simulation/ToughSmokeEffect";

describe("tough rocket effect", () => {
  it("adapts the etoughrocket.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughRocketEffect");
    const secondImport = await import("../src/simulation/ToughRocketEffect");

    expect(ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED,
    );
  });

  it("ports etoughrocket.cpp timing thresholds from missile speed", () => {
    expect(calcToughRocketTimeD(250)).toBe(0.024);
    expect(calcToughRocketTimeD2(250)).toBe(0.032);
  });

  it("ports EToughRocket Init as tough rocket bullet frame path initialization", () => {
    const state: ToughRocketInitState = {
      bulletFrames: [],
      finishedInit: false,
    };

    initToughRocketEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.bulletFrames).toHaveLength(TOUGH_ROCKET_BULLET_FRAME_COUNT);
    expect(state.bulletFrames).toEqual([
      "assets/units/robots/tough/bullet_n00.png",
      "assets/units/robots/tough/bullet_n01.png",
    ]);
  });

  it("ports EToughRocket PlaceSmoke as tough-smoke trail spawning", () => {
    const ztime = { tick: 1 };
    const state: ToughRocketSmokePlacementState<typeof ztime> = {
      ztime,
      startX: 100,
      startY: 50,
      directionX: 10,
      directionY: -5,
      initTime: 1,
      lastSmokeTime: 1,
    };
    const effects: ToughSmokeEffectSpawn<typeof ztime>[] = [];

    placeToughRocketSmoke(state, 1.071, 250, effects);

    expect(state.lastSmokeTime).toBeCloseTo(1.064);
    expect(effects).toHaveLength(2);
    expect(effects[0]?.ztime).toBe(ztime);
    expect(effects[0]?.x).toBeCloseTo(99.76);
    expect(effects[0]?.y).toBeCloseTo(50.12);
    expect(effects[1]?.ztime).toBe(ztime);
    expect(effects[1]?.x).toBeCloseTo(100.08);
    expect(effects[1]?.y).toBeCloseTo(49.96);
  });

  it("ports EToughRocket PlaceSmoke as strict smoke interval threshold", () => {
    const state: ToughRocketSmokePlacementState<null> = {
      ztime: null,
      startX: 0,
      startY: 0,
      directionX: 1,
      directionY: 1,
      initTime: 0,
      lastSmokeTime: 2,
    };
    const effects: ToughSmokeEffectSpawn<null>[] = [];

    placeToughRocketSmoke(state, 2 + calcToughRocketTimeD2(250), 250, effects);

    expect(state.lastSmokeTime).toBe(2);
    expect(effects).toEqual([]);
  });

  it("ports EToughRocket Process as no-op after the rocket is killed", () => {
    const state = createToughRocketProcessState({
      killMe: true,
      x: 10,
      y: 20,
    });
    const mushrooms: ToughRocketMushroomSpawn<typeof state.ztime>[] = [];
    const sounds: ToughRocketRestrictedSoundCommand[] = [];
    const smokes: ToughSmokeEffectSpawn<typeof state.ztime>[] = [];
    const craterCalls: unknown[] = [];

    processToughRocketEffect(
      state,
      20,
      mushrooms,
      sounds,
      {
        createCrater(...args) {
          craterCalls.push(args);
        },
      },
      smokes,
    );

    expect(state.x).toBe(10);
    expect(state.y).toBe(20);
    expect(mushrooms).toEqual([]);
    expect(sounds).toEqual([]);
    expect(smokes).toEqual([]);
    expect(craterCalls).toEqual([]);
  });

  it("ports EToughRocket Process as explosion impact effects", () => {
    const state = createToughRocketProcessState({
      finalTime: 2,
      endX: 140,
      endY: 70,
    });
    const mushrooms: ToughRocketMushroomSpawn<typeof state.ztime>[] = [];
    const sounds: ToughRocketRestrictedSoundCommand[] = [];
    const smokes: ToughSmokeEffectSpawn<typeof state.ztime>[] = [];
    const craterCalls: Array<[number, number, boolean, number]> = [];

    processToughRocketEffect(
      state,
      2,
      mushrooms,
      sounds,
      {
        createCrater(x, y, randomCrater, size) {
          craterCalls.push([x, y, randomCrater, size]);
        },
      },
      smokes,
    );

    expect(state.killMe).toBe(true);
    expect(mushrooms).toEqual([{ ztime: state.ztime, x: 140, y: 70 }]);
    expect(sounds).toEqual([
      { sound: SoundEngineSound.RandomExplosionSnd, x: 140, y: 70 },
    ]);
    expect(craterCalls).toEqual([[140, 70, false, 0.35]]);
    expect(smokes).toEqual([]);
  });

  it("ports EToughRocket Process as linear movement and smoke placement", () => {
    const state = createToughRocketProcessState({
      initTime: 1,
      finalTime: 3,
      startX: 100,
      startY: 50,
      directionX: 10,
      directionY: -5,
      lastSmokeTime: 1,
      bulletSpeed: 250,
    });
    const mushrooms: ToughRocketMushroomSpawn<typeof state.ztime>[] = [];
    const sounds: ToughRocketRestrictedSoundCommand[] = [];
    const smokes: ToughSmokeEffectSpawn<typeof state.ztime>[] = [];

    processToughRocketEffect(state, 1.071, mushrooms, sounds, null, smokes);

    expect(state.killMe).toBe(false);
    expect(state.x).toBeCloseTo(100.71);
    expect(state.y).toBeCloseTo(49.645);
    expect(state.lastSmokeTime).toBeCloseTo(1.064);
    expect(smokes).toHaveLength(2);
    expect(smokes[0]).toMatchObject({ ztime: state.ztime });
    expect(smokes[0]?.x).toBeCloseTo(99.76);
    expect(smokes[0]?.y).toBeCloseTo(50.12);
    expect(smokes[1]).toMatchObject({ ztime: state.ztime });
    expect(smokes[1]?.x).toBeCloseTo(100.08);
    expect(smokes[1]?.y).toBeCloseTo(49.96);
    expect(mushrooms).toEqual([]);
    expect(sounds).toEqual([]);
  });

  it("ports EToughRocket Process impact as optional effect sinks", () => {
    const state = createToughRocketProcessState({ finalTime: 2 });

    processToughRocketEffect(state, 2, null, null, null, null);

    expect(state.killMe).toBe(true);
  });

  it("replaces EToughRocket DoRender with a centered map-relative projectile command", () => {
    const bulletImages = [{ id: "tough-rocket-0" }, { id: "tough-rocket-1" }];
    const state = {
      killMe: false,
      x: 80,
      y: 45,
      bulletIndex: 1,
      bulletImages,
    };
    const calls: unknown[] = [];
    const zmap = {
      renderZSurface(
        surface: (typeof bulletImages)[number],
        x: number,
        y: number,
        renderHit: boolean,
        aboutCenter: boolean,
      ) {
        calls.push(surface, x, y, renderHit, aboutCenter);
        return {
          surface,
          x: x - 16,
          y: y - 11,
          renderHit,
          aboutCenter,
        };
      },
    };

    expect(renderToughRocketEffect(state, zmap)).toEqual({
      surface: bulletImages[0],
      x: 64,
      y: 34,
      renderHit: false,
      aboutCenter: true,
    });
    expect(state.bulletIndex).toBe(0);
    expect(calls).toEqual([bulletImages[0], 80, 45, false, true]);
  });

  it("replaces EToughRocket DoRender as no command for killed or missing projectile frames", () => {
    const zmap = {
      renderZSurface() {
        throw new Error("hidden tough rockets should not render");
      },
    };

    expect(
      renderToughRocketEffect(
        {
          killMe: true,
          x: 80,
          y: 45,
          bulletIndex: 1,
          bulletImages: [{ id: "tough-rocket-0" }],
        },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderToughRocketEffect(
        { killMe: false, x: 80, y: 45, bulletIndex: 1, bulletImages: [] },
        zmap,
      ),
    ).toBeNull();
  });
});

function createToughRocketProcessState(
  overrides: Partial<ToughRocketProcessState<{ ztime: number }>> = {},
): ToughRocketProcessState<{ ztime: number }> {
  return {
    killMe: false,
    ztime: { ztime: 12 },
    startX: 0,
    startY: 0,
    directionX: 1,
    directionY: 1,
    initTime: 10,
    lastSmokeTime: 10,
    finalTime: 20,
    x: 3,
    y: 4,
    endX: 50,
    endY: 60,
    bulletSpeed: 250,
    ...overrides,
  };
}
