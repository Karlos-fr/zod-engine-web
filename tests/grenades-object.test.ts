import { describe, expect, it } from "vitest";
import {
  GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS,
  GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS,
  OGRENADES_HEADER_GUARD_PORTED,
} from "../src/simulation/GrenadesObject";

describe("grenades object", () => {
  it("adapts the ogrenades.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/GrenadesObject");
    const secondImport = await import("../src/simulation/GrenadesObject");

    expect(OGRENADES_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OGRENADES_HEADER_GUARD_PORTED).toBe(
      firstImport.OGRENADES_HEADER_GUARD_PORTED,
    );
  });

  it("ports missile spread limits for spawned grenade missiles", () => {
    expect(GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS).toBe(130);
    expect(GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS).toBe(130);
  });
});
