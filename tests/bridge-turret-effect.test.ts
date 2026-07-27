import { describe, expect, it } from "vitest";
import { EBRIDGE_TURRENT_HEADER_GUARD_PORTED } from "../src/simulation/BridgeTurretEffect";

describe("bridge turret effect", () => {
  it("adapts the ebridgeturrent.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/BridgeTurretEffect");
    const secondImport = await import("../src/simulation/BridgeTurretEffect");

    expect(EBRIDGE_TURRENT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EBRIDGE_TURRENT_HEADER_GUARD_PORTED).toBe(
      firstImport.EBRIDGE_TURRENT_HEADER_GUARD_PORTED,
    );
  });
});
