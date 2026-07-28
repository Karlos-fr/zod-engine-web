import { describe, expect, it } from "vitest";
import {
  ESIDE_EXPLOSION_HEADER_GUARD_PORTED,
  SideExplosionType,
} from "../src/simulation/SideExplosionEffect";

describe("side explosion effect", () => {
  it("adapts the esideexplosion.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/SideExplosionEffect");
    const secondImport = await import("../src/simulation/SideExplosionEffect");

    expect(ESIDE_EXPLOSION_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ESIDE_EXPLOSION_HEADER_GUARD_PORTED).toBe(
      firstImport.ESIDE_EXPLOSION_HEADER_GUARD_PORTED,
    );
  });

  it("ports side_explosion_type as side explosion identifiers", () => {
    expect(SideExplosionType.Normal).toBe(0);
  });
});
