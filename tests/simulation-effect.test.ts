import { describe, expect, it } from "vitest";
import { ZEFFECT_HEADER_GUARD_PORTED } from "../src/simulation/SimulationEffect";

describe("simulation effect", () => {
  it("adapts the zeffect.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/SimulationEffect");
    const secondImport = await import("../src/simulation/SimulationEffect");

    expect(ZEFFECT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZEFFECT_HEADER_GUARD_PORTED).toBe(
      firstImport.ZEFFECT_HEADER_GUARD_PORTED,
    );
  });
});
