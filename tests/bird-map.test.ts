import { describe, expect, it } from "vitest";
import {
  ABIRD_HEADER_GUARD_PORTED,
  AMBIENT_BIRD_SQUARE_TILES_PER_BIRD,
  BIRD_MAP_PADDING_PIXELS,
  initAmbientBirdImages,
  renderAmbientBird,
} from "../src/world/BirdMap";
import { PlanetType } from "../src/simulation/SimulationConstants";

describe("bird map", () => {
  it("ports the abird.h header guard as module traceability", async () => {
    const firstImport = await import("../src/world/BirdMap");
    const secondImport = await import("../src/world/BirdMap");

    expect(ABIRD_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ABIRD_HEADER_GUARD_PORTED).toBe(
      firstImport.ABIRD_HEADER_GUARD_PORTED,
    );
  });

  it("ports the square-tile budget per ambient bird", () => {
    expect(AMBIENT_BIRD_SQUARE_TILES_PER_BIRD).toBe(650);
  });

  it("ports the bird map padding", () => {
    expect(BIRD_MAP_PADDING_PIXELS).toBe(160);
  });

  it("ports ABird Init as ambient bird image loading", () => {
    const loaded: string[] = [];
    const birdImages = Array.from({ length: PlanetType.Max }, () =>
      Array.from({ length: 5 }, () => ({
        loadBaseImage: (filename: string) => loaded.push(filename),
      })),
    );

    initAmbientBirdImages(birdImages);

    expect(loaded).toHaveLength(PlanetType.Max * 5);
    expect(loaded.slice(0, 5)).toEqual([
      "assets/other/birds/bird_desert_r000_n00.png",
      "assets/other/birds/bird_desert_r000_n01.png",
      "assets/other/birds/bird_desert_r000_n02.png",
      "assets/other/birds/bird_desert_r000_n03.png",
      "assets/other/birds/bird_desert_r000_n04.png",
    ]);
    expect(loaded.slice(-5)).toEqual([
      "assets/other/birds/bird_city_r000_n00.png",
      "assets/other/birds/bird_city_r000_n01.png",
      "assets/other/birds/bird_city_r000_n02.png",
      "assets/other/birds/bird_city_r000_n03.png",
      "assets/other/birds/bird_city_r000_n04.png",
    ]);
  });

  it("replaces ABird DoRender with transformed centered ambient bird command", () => {
    const transforms: Array<[string, number]> = [];
    const birdImages = Array.from({ length: PlanetType.Max }, (_, planet) =>
      Array.from({ length: 5 }, (_, frame) => ({
        id: `bird-${planet}-${frame}`,
        setAngle: (angle: number) => transforms.push(["angle", angle]),
        setSize: (size: number) => transforms.push(["size", size]),
      })),
    );
    const calls: unknown[] = [];

    const command = renderAmbientBird(
      {
        x: 220,
        y: 180,
        palette: PlanetType.Jungle,
        renderIndex: 3,
        angle: 120,
        rise: 1.6,
        birdImages,
      },
      {
        renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
          calls.push({ surface, x, y, renderHit, aboutCenter });
          return {
            surface,
            x: x - 50,
            y: y - 60,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(command).toEqual({
      surface: birdImages[PlanetType.Jungle]?.[3],
      x: 170,
      y: 90,
      renderHit: false,
      aboutCenter: true,
    });
    expect(transforms).toEqual([
      ["angle", 120],
      ["size", 1.6],
    ]);
    expect(calls).toEqual([
      {
        surface: birdImages[PlanetType.Jungle]?.[3],
        x: 220,
        y: 150,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces ABird DoRender as no command for a missing frame", () => {
    expect(
      renderAmbientBird(
        {
          x: 0,
          y: 0,
          palette: PlanetType.City,
          renderIndex: 9,
          angle: 0,
          rise: 1,
          birdImages: [],
        },
        {
          renderZSurface: () => {
            throw new Error("renderZSurface should not be called");
          },
        },
      ),
    ).toBeNull();
  });
});
