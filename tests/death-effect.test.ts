import { describe, expect, it } from "vitest";
import {
  DeathEffectObject,
  EDEATH_HEADER_GUARD_PORTED,
} from "../src/simulation/DeathEffect";

describe("death effect", () => {
  it("adapts the edeath.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/DeathEffect");
    const secondImport = await import("../src/simulation/DeathEffect");

    expect(EDEATH_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EDEATH_HEADER_GUARD_PORTED).toBe(
      firstImport.EDEATH_HEADER_GUARD_PORTED,
    );
  });

  it("ports edeath_objects as death effect object identifiers", () => {
    expect(DeathEffectObject.Jeep).toBe(0);
    expect(DeathEffectObject.MobileMissile).toBe(1);
    expect(DeathEffectObject.Apc).toBe(2);
    expect(DeathEffectObject.Tank).toBe(3);
    expect(DeathEffectObject.Crane).toBe(4);
  });
});
