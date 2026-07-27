import { describe, expect, it } from "vitest";
import { ETURRET_MISSILE_HEADER_GUARD_PORTED } from "../src/simulation/TurretMissileEffect";

describe("turret missile effect", () => {
  it("adapts the eturrentmissile.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TurretMissileEffect");
    const secondImport = await import("../src/simulation/TurretMissileEffect");

    expect(ETURRET_MISSILE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETURRET_MISSILE_HEADER_GUARD_PORTED).toBe(
      firstImport.ETURRET_MISSILE_HEADER_GUARD_PORTED,
    );
  });
});
