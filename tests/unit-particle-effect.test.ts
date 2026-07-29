import { describe, expect, it } from "vitest";
import {
  EUNIT_PARTICLE_HEADER_GUARD_PORTED,
  initUnitParticleEffect,
  UNIT_PARTICLE_FRAME_COUNT,
  type UnitParticleInitState,
} from "../src/simulation/UnitParticleEffect";

describe("unit particle effect", () => {
  it("adapts the eunitparticle.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/UnitParticleEffect");
    const secondImport = await import("../src/simulation/UnitParticleEffect");

    expect(EUNIT_PARTICLE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EUNIT_PARTICLE_HEADER_GUARD_PORTED).toBe(
      firstImport.EUNIT_PARTICLE_HEADER_GUARD_PORTED,
    );
  });

  it("ports EUnitParticle Init as unit-particle frame path initialization", () => {
    const state: UnitParticleInitState = { baseImages: [] };

    initUnitParticleEffect(state);

    expect(state.baseImages).toHaveLength(UNIT_PARTICLE_FRAME_COUNT);
    expect(state.baseImages[0]).toBe("assets/other/particles/unit_particle_n00.png");
    expect(state.baseImages[9]).toBe("assets/other/particles/unit_particle_n09.png");
    expect(state.baseImages[19]).toBe("assets/other/particles/unit_particle_n19.png");
  });
});
