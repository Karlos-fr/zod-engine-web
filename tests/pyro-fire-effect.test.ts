import { describe, expect, it } from "vitest";
import { EPYRO_FIRE_HEADER_GUARD_PORTED } from "../src/simulation/PyroFireEffect";

describe("pyro fire effect", () => {
  it("adapts the epyrofire.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/PyroFireEffect");
    const secondImport = await import("../src/simulation/PyroFireEffect");

    expect(EPYRO_FIRE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EPYRO_FIRE_HEADER_GUARD_PORTED).toBe(
      firstImport.EPYRO_FIRE_HEADER_GUARD_PORTED,
    );
  });
});
