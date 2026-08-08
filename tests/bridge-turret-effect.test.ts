import { describe, expect, it } from "vitest";
import {
  EBRIDGE_TURRENT_HEADER_GUARD_PORTED,
  endBridgeTurrentExplosion,
  initBridgeTurrentEffect,
  processBridgeTurrentEffect,
  renderBridgeTurrentEffect,
  type BridgeTurrentProcessState,
} from "../src/simulation/BridgeTurretEffect";
import {
  RockParticleType,
  type RockParticleEffectSpawn,
} from "../src/simulation/RockParticleEffect";
import { PlanetType } from "../src/simulation/SimulationConstants";

describe("bridge turret effect", () => {
  it("adapts the ebridgeturrent.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/BridgeTurretEffect");
    const secondImport = await import("../src/simulation/BridgeTurretEffect");

    expect(EBRIDGE_TURRENT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EBRIDGE_TURRENT_HEADER_GUARD_PORTED).toBe(
      firstImport.EBRIDGE_TURRENT_HEADER_GUARD_PORTED,
    );
  });

  it("ports EBridgeTurrent Init as large debris image loading", () => {
    const loaded: string[] = [];
    const state = {
      debriLargeImages: Array.from({ length: PlanetType.Max }, () =>
        Array.from({ length: 12 }, () => ({
          loadBaseImage: (filename: string) => loaded.push(filename),
        })),
      ),
      finishedInit: false,
    };

    initBridgeTurrentEffect(state);

    expect(loaded).toHaveLength(PlanetType.Max * 12);
    expect(loaded.slice(0, 3)).toEqual([
      "assets/planets/bridge_effects/debri_large_desert_n00.png",
      "assets/planets/bridge_effects/debri_large_desert_n01.png",
      "assets/planets/bridge_effects/debri_large_desert_n02.png",
    ]);
    expect(loaded.slice(-3)).toEqual([
      "assets/planets/bridge_effects/debri_large_city_n09.png",
      "assets/planets/bridge_effects/debri_large_city_n10.png",
      "assets/planets/bridge_effects/debri_large_city_n11.png",
    ]);
    expect(state.finishedInit).toBe(true);
  });

  it("replaces EBridgeTurrent DoRender with transformed centered debris command", () => {
    const transforms: Array<[string, number]> = [];
    const debriLargeImages = Array.from({ length: PlanetType.Max }, (_, palette) =>
      Array.from({ length: 12 }, (_, frame) => ({
        id: `bridge-${palette}-${frame}`,
        setAngle: (angle: number) => transforms.push(["angle", angle]),
        setSize: (size: number) => transforms.push(["size", size]),
      })),
    );
    const calls: unknown[] = [];

    const command = renderBridgeTurrentEffect(
      {
        killme: false,
        x: 150,
        y: 190,
        palette: PlanetType.Jungle,
        renderIndex: 4,
        angle: 35,
        size: 1.4,
        debriLargeImages,
      },
      {
        renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
          calls.push({ surface, x, y, renderHit, aboutCenter });
          return {
            surface,
            x: x - 30,
            y: y - 40,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(command).toEqual({
      surface: debriLargeImages[PlanetType.Jungle]?.[4],
      x: 120,
      y: 150,
      renderHit: false,
      aboutCenter: true,
    });
    expect(transforms).toEqual([
      ["angle", 35],
      ["size", 1.4],
    ]);
    expect(calls).toEqual([
      {
        surface: debriLargeImages[PlanetType.Jungle]?.[4],
        x: 150,
        y: 190,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces EBridgeTurrent DoRender as no command for killed or missing frames", () => {
    const debriLargeImages = [[{ setAngle: () => undefined, setSize: () => undefined }]];
    const zmap = {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(
      renderBridgeTurrentEffect(
        {
          killme: true,
          x: 0,
          y: 0,
          palette: 0,
          renderIndex: 0,
          angle: 0,
          size: 1,
          debriLargeImages,
        },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderBridgeTurrentEffect(
        {
          killme: false,
          x: 0,
          y: 0,
          palette: PlanetType.City,
          renderIndex: 20,
          angle: 0,
          size: 1,
          debriLargeImages,
        },
        zmap,
      ),
    ).toBeNull();
  });

  it("ports EBridgeTurrent EndExplosion guard exits", () => {
    const effects: RockParticleEffectSpawn<{ now: number }>[] = [];

    endBridgeTurrentExplosion(
      {
        isReversed: true,
        ztime: { now: 10 },
        x: 20,
        y: 30,
        palette: PlanetType.Desert,
      },
      effects,
      () => 5,
    );
    endBridgeTurrentExplosion(
      {
        isReversed: false,
        ztime: { now: 10 },
        x: 20,
        y: 30,
        palette: PlanetType.Desert,
      },
      null,
      () => 5,
    );

    expect(effects).toEqual([]);
  });

  it("ports EBridgeTurrent EndExplosion as small rock particle spawning", () => {
    const ztime = { now: 10 };
    const effects: Array<{
      ztime: typeof ztime | null;
      x: number;
      y: number;
      palette: number;
      particleType: RockParticleType;
      maxX: number;
      maxY: number;
    }> = [];

    endBridgeTurrentExplosion(
      {
        isReversed: false,
        ztime,
        x: 20,
        y: 30,
        palette: PlanetType.Jungle,
      },
      effects,
      () => 5,
    );

    expect(effects).toHaveLength(17);
    expect(effects[0]).toEqual({
      ztime,
      x: 20,
      y: 30,
      palette: PlanetType.Jungle,
      particleType: RockParticleType.Small,
      maxX: 80,
      maxY: 60,
    });
    expect(effects[16]).toEqual(effects[0]);
  });

  it("ports EBridgeTurrent Process guard exit", () => {
    const state = createBridgeTurrentProcessState({ killme: true });
    const effects: RockParticleEffectSpawn[] = [];

    processBridgeTurrentEffect(state, 3, effects, () => {
      throw new Error("randomInt should not be called for killed bridge debris");
    });

    expect(state.x).toBe(10);
    expect(state.y).toBe(20);
    expect(effects).toEqual([]);
  });

  it("ports EBridgeTurrent Process as frame cadence, arcing movement, and wrapped angle", () => {
    const state = createBridgeTurrentProcessState({
      initTime: 2,
      finalTime: 6,
      nextProcessTime: 3,
      sx: 10,
      sy: 20,
      dx: 5,
      dy: 8,
      rise: 2,
      dangle: -250,
      renderIndex: 11,
    });

    processBridgeTurrentEffect(state, 3.5, []);

    expect(state.killme).toBe(false);
    expect(state.renderIndex).toBe(0);
    expect(state.nextProcessTime).toBeCloseTo(3.57);
    expect(state.x).toBe(17.5);
    expect(state.y).toBeCloseTo(-11.875);
    expect(state.size).toBeCloseTo(3.0625);
    expect(state.angle).toBe(345);
  });

  it("ports EBridgeTurrent Process impact as end explosion then killed", () => {
    const ztime = { now: 44 };
    const state = createBridgeTurrentProcessState({
      ztime,
      finalTime: 6,
      x: 70,
      y: 90,
      palette: PlanetType.Arctic,
    });
    const effects: RockParticleEffectSpawn<typeof ztime>[] = [];

    processBridgeTurrentEffect(state, 6, effects, () => 0);

    expect(state.killme).toBe(true);
    expect(effects).toHaveLength(12);
    expect(effects[0]).toEqual({
      ztime,
      x: 70,
      y: 90,
      palette: PlanetType.Arctic,
      particleType: RockParticleType.Small,
      maxX: 80,
      maxY: 60,
    });
  });
});

function createBridgeTurrentProcessState<TTime = unknown>(
  overrides: Partial<BridgeTurrentProcessState<TTime>> = {},
): BridgeTurrentProcessState<TTime> {
  return {
    killme: false,
    isReversed: false,
    ztime: null,
    initTime: 0,
    finalTime: 2,
    nextProcessTime: 0.07,
    x: 10,
    y: 20,
    sx: 10,
    sy: 20,
    dx: 30,
    dy: 40,
    size: 1,
    rise: 0.5,
    angle: 0,
    dangle: 120,
    renderIndex: 0,
    palette: PlanetType.Desert,
    ...overrides,
  };
}
