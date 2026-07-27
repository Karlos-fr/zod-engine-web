import { describe, expect, it } from "vitest";
import { ZTIME_HEADER_GUARD_PORTED } from "../src/simulation/SimulationTime";

describe("simulation time", () => {
  it("adapts the ztime.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/SimulationTime");
    const secondImport = await import("../src/simulation/SimulationTime");

    expect(ZTIME_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZTIME_HEADER_GUARD_PORTED).toBe(
      firstImport.ZTIME_HEADER_GUARD_PORTED,
    );
  });
});
