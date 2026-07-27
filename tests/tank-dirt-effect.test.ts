import { describe, expect, it } from "vitest";
import {
  ETANK_DIRT_HEADER_GUARD_PORTED,
  TANK_DIRT_FRAME_INTERVAL_SECONDS,
} from "../src/simulation/TankDirtEffect";

describe("tank dirt effect", () => {
  it("adapts the etankdirt.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankDirtEffect");
    const secondImport = await import("../src/simulation/TankDirtEffect");

    expect(ETANK_DIRT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_DIRT_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_DIRT_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKDIRT_TIME as the tank dirt frame interval", () => {
    expect(TANK_DIRT_FRAME_INTERVAL_SECONDS).toBe(0.15);
  });
});
