import { describe, expect, it } from "vitest";
import { ETOUGH_SMOKE_HEADER_GUARD_PORTED } from "../src/simulation/ToughSmokeEffect";

describe("tough smoke effect", () => {
  it("adapts the etoughsmoke.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughSmokeEffect");
    const secondImport = await import("../src/simulation/ToughSmokeEffect");

    expect(ETOUGH_SMOKE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_SMOKE_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_SMOKE_HEADER_GUARD_PORTED,
    );
  });
});
