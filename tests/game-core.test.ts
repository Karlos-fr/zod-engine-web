import { describe, expect, it } from "vitest";
import {
  GAMES_PER_VOTING_POWER_POINT,
  ZCORE_HEADER_GUARD_PORTED,
} from "../src/simulation/GameCore";

describe("game core", () => {
  it("adapts the zcore.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/GameCore");
    const secondImport = await import("../src/simulation/GameCore");

    expect(ZCORE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCORE_HEADER_GUARD_PORTED).toBe(firstImport.ZCORE_HEADER_GUARD_PORTED);
  });

  it("ports games_per_vp as the voting-power progression interval", () => {
    expect(GAMES_PER_VOTING_POWER_POINT).toBe(5);
  });
});
