import { describe, expect, it } from "vitest";
import { EROCK_TURRET_HEADER_GUARD_PORTED } from "../src/simulation/RockTurretEffect";

describe("rock turret effect", () => {
  it("adapts the erockturrent.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RockTurretEffect");
    const secondImport = await import("../src/simulation/RockTurretEffect");

    expect(EROCK_TURRET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROCK_TURRET_HEADER_GUARD_PORTED).toBe(
      firstImport.EROCK_TURRET_HEADER_GUARD_PORTED,
    );
  });
});
