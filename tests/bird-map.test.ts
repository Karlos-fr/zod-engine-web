import { describe, expect, it } from "vitest";
import {
  ABIRD_HEADER_GUARD_PORTED,
  AMBIENT_BIRD_SQUARE_TILES_PER_BIRD,
  BIRD_MAP_PADDING_PIXELS,
  initAmbientBirdImages,
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
});
