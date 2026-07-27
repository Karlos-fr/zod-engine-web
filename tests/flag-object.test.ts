import { describe, expect, it } from "vitest";
import {
  FLAG_ANIMATION_INTERVAL_SECONDS,
  OFLAG_HEADER_GUARD_PORTED,
} from "../src/simulation/FlagObject";

describe("flag object", () => {
  it("adapts the oflag.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/FlagObject");
    const secondImport = await import("../src/simulation/FlagObject");

    expect(OFLAG_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OFLAG_HEADER_GUARD_PORTED).toBe(firstImport.OFLAG_HEADER_GUARD_PORTED);
  });

  it("ports int_time as the flag animation frame interval", () => {
    expect(FLAG_ANIMATION_INTERVAL_SECONDS).toBe(0.2);
  });
});
