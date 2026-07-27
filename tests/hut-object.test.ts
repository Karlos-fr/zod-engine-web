import { describe, expect, it } from "vitest";
import { OHUT_HEADER_GUARD_PORTED } from "../src/simulation/HutObject";

describe("hut object", () => {
  it("adapts the ohut.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/HutObject");
    const secondImport = await import("../src/simulation/HutObject");

    expect(OHUT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OHUT_HEADER_GUARD_PORTED).toBe(firstImport.OHUT_HEADER_GUARD_PORTED);
  });
});
