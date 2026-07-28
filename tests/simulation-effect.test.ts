import { describe, expect, it } from "vitest";
import {
  EffectFlags,
  ZEFFECT_HEADER_GUARD_PORTED,
} from "../src/simulation/SimulationEffect";

describe("simulation effect", () => {
  it("adapts the zeffect.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/SimulationEffect");
    const secondImport = await import("../src/simulation/SimulationEffect");

    expect(ZEFFECT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZEFFECT_HEADER_GUARD_PORTED).toBe(
      firstImport.ZEFFECT_HEADER_GUARD_PORTED,
    );
  });

  it("ports effect_flags default construction through Clear", () => {
    expect(new EffectFlags()).toEqual({
      unitParticles: false,
      unitParticlesRadius: 0,
      unitParticlesAmount: 0,
      x: 0,
      y: 0,
    });
  });

  it("ports effect_flags Clear without changing coordinates", () => {
    const flags = new EffectFlags();
    flags.unitParticles = true;
    flags.unitParticlesRadius = 12;
    flags.unitParticlesAmount = 4;
    flags.x = 30;
    flags.y = 40;

    flags.clear();

    expect(flags).toEqual({
      unitParticles: false,
      unitParticlesRadius: 0,
      unitParticlesAmount: 0,
      x: 30,
      y: 40,
    });
  });
});
