import { describe, expect, it } from "vitest";
import { EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED } from "../src/simulation/MobileMissileRocketsEffect";

describe("mobile missile rockets effect", () => {
  it("adapts the emomissilerockets.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/MobileMissileRocketsEffect");
    const secondImport = await import("../src/simulation/MobileMissileRocketsEffect");

    expect(EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED).toBe(
      firstImport.EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED,
    );
  });
});
