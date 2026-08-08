import { describe, expect, it } from "vitest";
import {
  endRockTurrentExplosion,
  EROCK_TURRET_HEADER_GUARD_PORTED,
  initRockTurretEffect,
  renderRockTurrentEffect,
} from "../src/simulation/RockTurretEffect";
import {
  RockParticleType,
  type RockParticleEffectSpawn,
} from "../src/simulation/RockParticleEffect";
import { PlanetType } from "../src/simulation/SimulationConstants";

describe("rock turret effect", () => {
  it("adapts the erockturrent.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RockTurretEffect");
    const secondImport = await import("../src/simulation/RockTurretEffect");

    expect(EROCK_TURRET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROCK_TURRET_HEADER_GUARD_PORTED).toBe(
      firstImport.EROCK_TURRET_HEADER_GUARD_PORTED,
    );
  });

  it("ports ERockTurrent Init as large debris image loading", () => {
    const loaded: string[] = [];
    const state = {
      debriLargeImages: Array.from({ length: 2 }, () =>
        Array.from({ length: PlanetType.Max }, () =>
          Array.from({ length: 12 }, () => ({
            loadBaseImage: (filename: string) => loaded.push(filename),
          })),
        ),
      ),
      finishedInit: false,
    };

    initRockTurretEffect(state);

    expect(loaded).toHaveLength(PlanetType.Max * 12 + 3 * 12);
    expect(loaded.slice(0, 3)).toEqual([
      "assets/planets/rock_effects/debri_large0_desert_n00.png",
      "assets/planets/rock_effects/debri_large0_desert_n01.png",
      "assets/planets/rock_effects/debri_large0_desert_n02.png",
    ]);
    expect(loaded).toContain(
      "assets/planets/rock_effects/debri_large1_volcanic_n00.png",
    );
    expect(loaded).toContain(
      "assets/planets/rock_effects/debri_large1_jungle_n11.png",
    );
    expect(loaded).not.toContain(
      "assets/planets/rock_effects/debri_large1_desert_n00.png",
    );
    expect(loaded).not.toContain(
      "assets/planets/rock_effects/debri_large1_city_n00.png",
    );
    expect(state.finishedInit).toBe(true);
  });

  it("replaces ERockTurrent DoRender with transformed centered debris command", () => {
    const transforms: Array<[string, number]> = [];
    const debriLargeImages = Array.from({ length: 2 }, (_, variant) =>
      Array.from({ length: PlanetType.Max }, (_, palette) =>
        Array.from({ length: 12 }, (_, frame) => ({
          id: `rock-${variant}-${palette}-${frame}`,
          setAngle: (angle: number) => transforms.push(["angle", angle]),
          setSize: (size: number) => transforms.push(["size", size]),
        })),
      ),
    );
    const calls: unknown[] = [];

    const command = renderRockTurrentEffect(
      {
        killme: false,
        x: 140,
        y: 180,
        largeIndex: 1,
        palette: PlanetType.Volcanic,
        renderIndex: 6,
        angle: 75,
        size: 1.8,
        debriLargeImages,
      },
      {
        renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
          calls.push({ surface, x, y, renderHit, aboutCenter });
          return {
            surface,
            x: x - 24,
            y: y - 36,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(command).toEqual({
      surface: debriLargeImages[1]?.[PlanetType.Volcanic]?.[6],
      x: 116,
      y: 144,
      renderHit: false,
      aboutCenter: true,
    });
    expect(transforms).toEqual([
      ["angle", 75],
      ["size", 1.8],
    ]);
    expect(calls).toEqual([
      {
        surface: debriLargeImages[1]?.[PlanetType.Volcanic]?.[6],
        x: 140,
        y: 180,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces ERockTurrent DoRender as no command for killed or missing frames", () => {
    const debriLargeImages = [
      [[{ setAngle: () => undefined, setSize: () => undefined }]],
    ];
    const zmap = {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(
      renderRockTurrentEffect(
        {
          killme: true,
          x: 0,
          y: 0,
          largeIndex: 0,
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
      renderRockTurrentEffect(
        {
          killme: false,
          x: 0,
          y: 0,
          largeIndex: 1,
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

  it("ports ERockTurrent EndExplosion null effect list guard", () => {
    expect(() =>
      endRockTurrentExplosion(
        {
          ztime: { now: 10 },
          x: 20,
          y: 30,
          palette: PlanetType.Volcanic,
        },
        null,
        () => 5,
      ),
    ).not.toThrow();
  });

  it("ports ERockTurrent EndExplosion as small rock particle spawning", () => {
    const ztime = { now: 10 };
    const effects: RockParticleEffectSpawn<typeof ztime>[] = [];

    endRockTurrentExplosion(
      {
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
});
