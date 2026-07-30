import { describe, expect, it } from "vitest";
import {
  EBRIDGE_TURRENT_HEADER_GUARD_PORTED,
  initBridgeTurrentEffect,
} from "../src/simulation/BridgeTurretEffect";
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
});
