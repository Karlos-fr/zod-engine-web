import { describe, expect, it } from "vitest";
import { ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED } from "../src/simulation/LightInitFireEffect";

describe("light init fire effect", () => {
  it("adapts the elightinitfire.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/LightInitFireEffect");
    const secondImport = await import("../src/simulation/LightInitFireEffect");

    expect(ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED).toBe(
      firstImport.ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED,
    );
  });
});
