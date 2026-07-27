import { describe, expect, it } from "vitest";
import { EUNIT_PARTICLE_HEADER_GUARD_PORTED } from "../src/simulation/UnitParticleEffect";

describe("unit particle effect", () => {
  it("adapts the eunitparticle.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/UnitParticleEffect");
    const secondImport = await import("../src/simulation/UnitParticleEffect");

    expect(EUNIT_PARTICLE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EUNIT_PARTICLE_HEADER_GUARD_PORTED).toBe(
      firstImport.EUNIT_PARTICLE_HEADER_GUARD_PORTED,
    );
  });
});
