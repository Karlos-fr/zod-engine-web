import { describe, expect, it } from "vitest";
import { ESTANDARD_HEADER_GUARD_PORTED } from "../src/simulation/StandardEffect";

describe("standard effect", () => {
  it("adapts the estandard.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/StandardEffect");
    const secondImport = await import("../src/simulation/StandardEffect");

    expect(ESTANDARD_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ESTANDARD_HEADER_GUARD_PORTED).toBe(
      firstImport.ESTANDARD_HEADER_GUARD_PORTED,
    );
  });
});
