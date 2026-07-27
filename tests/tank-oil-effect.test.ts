import { describe, expect, it } from "vitest";
import {
  ETANK_OIL_HEADER_GUARD_PORTED,
  TANK_OIL_LIFETIME_SECONDS,
} from "../src/simulation/TankOilEffect";

describe("tank oil effect", () => {
  it("adapts the etankoil.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankOilEffect");
    const secondImport = await import("../src/simulation/TankOilEffect");

    expect(ETANK_OIL_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_OIL_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_OIL_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKOIL_TIME as the tank oil lifetime", () => {
    expect(TANK_OIL_LIFETIME_SECONDS).toBe(3.0);
  });
});
