import { describe, expect, it } from "vitest";
import { EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED } from "../src/simulation/MissileCannonRocketsEffect";

describe("missile cannon rockets effect", () => {
  it("adapts the emissilecrockets.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/MissileCannonRocketsEffect");
    const secondImport = await import("../src/simulation/MissileCannonRocketsEffect");

    expect(EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED).toBe(
      firstImport.EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED,
    );
  });
});
