import { describe, expect, it } from "vitest";
import {
  EROCK_TURRET_HEADER_GUARD_PORTED,
  initRockTurretEffect,
} from "../src/simulation/RockTurretEffect";
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
});
