import { describe, expect, it } from "vitest";
import {
  EROCK_PARTICLE_HEADER_GUARD_PORTED,
  RockParticleType,
} from "../src/simulation/RockParticleEffect";

describe("rock particle effect", () => {
  it("adapts the erockparticle.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RockParticleEffect");
    const secondImport = await import("../src/simulation/RockParticleEffect");

    expect(EROCK_PARTICLE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROCK_PARTICLE_HEADER_GUARD_PORTED).toBe(
      firstImport.EROCK_PARTICLE_HEADER_GUARD_PORTED,
    );
  });

  it("ports rock_particle_type as rock particle identifiers", () => {
    expect(RockParticleType.Small).toBe(0);
    expect(RockParticleType.Mid).toBe(1);
  });
});
