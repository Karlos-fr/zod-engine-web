import { describe, expect, it } from "vitest";
import { EROBOT_DEATH_HEADER_GUARD_PORTED } from "../src/simulation/RobotDeathEffect";

describe("robot death effect", () => {
  it("adapts the erobotdeath.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RobotDeathEffect");
    const secondImport = await import("../src/simulation/RobotDeathEffect");

    expect(EROBOT_DEATH_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROBOT_DEATH_HEADER_GUARD_PORTED).toBe(
      firstImport.EROBOT_DEATH_HEADER_GUARD_PORTED,
    );
  });
});
