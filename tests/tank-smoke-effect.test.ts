import { describe, expect, it } from "vitest";
import {
  ETANK_SMOKE_HEADER_GUARD_PORTED,
  TANK_SMOKE_FRAME_INTERVAL_SECONDS,
} from "../src/simulation/TankSmokeEffect";

describe("tank smoke effect", () => {
  it("adapts the etanksmoke.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankSmokeEffect");
    const secondImport = await import("../src/simulation/TankSmokeEffect");

    expect(ETANK_SMOKE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_SMOKE_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_SMOKE_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKSMOKE_TIME as the tank smoke frame interval", () => {
    expect(TANK_SMOKE_FRAME_INTERVAL_SECONDS).toBe(0.15);
  });
});
