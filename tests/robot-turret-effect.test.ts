import { describe, expect, it } from "vitest";
import { EROBOT_TURRET_HEADER_GUARD_PORTED } from "../src/simulation/RobotTurretEffect";

describe("robot turret effect", () => {
  it("adapts the erobotturrent.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RobotTurretEffect");
    const secondImport = await import("../src/simulation/RobotTurretEffect");

    expect(EROBOT_TURRET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROBOT_TURRET_HEADER_GUARD_PORTED).toBe(
      firstImport.EROBOT_TURRET_HEADER_GUARD_PORTED,
    );
  });
});
