import { describe, expect, it } from "vitest";
import { ELIGHT_ROCKET_HEADER_GUARD_PORTED } from "../src/simulation/LightRocketEffect";

describe("light rocket effect", () => {
  it("adapts the elightrocket.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/LightRocketEffect");
    const secondImport = await import("../src/simulation/LightRocketEffect");

    expect(ELIGHT_ROCKET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ELIGHT_ROCKET_HEADER_GUARD_PORTED).toBe(
      firstImport.ELIGHT_ROCKET_HEADER_GUARD_PORTED,
    );
  });
});
