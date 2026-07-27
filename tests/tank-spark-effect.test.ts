import { describe, expect, it } from "vitest";
import {
  ETANK_SPARK_HEADER_GUARD_PORTED,
  TANK_SPARK_FRAME_INTERVAL_SECONDS,
} from "../src/simulation/TankSparkEffect";

describe("tank spark effect", () => {
  it("adapts the etankspark.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankSparkEffect");
    const secondImport = await import("../src/simulation/TankSparkEffect");

    expect(ETANK_SPARK_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_SPARK_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_SPARK_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKSPARK_TIME as the tank spark frame interval", () => {
    expect(TANK_SPARK_FRAME_INTERVAL_SECONDS).toBe(0.1);
  });
});
