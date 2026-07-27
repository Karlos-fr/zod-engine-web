import { describe, expect, it } from "vitest";
import { ZUNITRATING_HEADER_GUARD_PORTED } from "../src/simulation/UnitRating";

describe("unit rating", () => {
  it("adapts the zunitrating.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/UnitRating");
    const secondImport = await import("../src/simulation/UnitRating");

    expect(ZUNITRATING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZUNITRATING_HEADER_GUARD_PORTED).toBe(
      firstImport.ZUNITRATING_HEADER_GUARD_PORTED,
    );
  });
});
