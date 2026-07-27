import { describe, expect, it } from "vitest";
import {
  DEATH_SPARKS_MAX_DOWN,
  DEATH_SPARKS_MAX_LEFT,
  DEATH_SPARKS_MAX_RIGHT,
  DEATH_SPARKS_MAX_UP,
  EDEATH_SPARKS_HEADER_GUARD_PORTED,
} from "../src/simulation/DeathSparksEffect";

describe("death sparks effect", () => {
  it("adapts the edeathsparks.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/DeathSparksEffect");
    const secondImport = await import("../src/simulation/DeathSparksEffect");

    expect(EDEATH_SPARKS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EDEATH_SPARKS_HEADER_GUARD_PORTED).toBe(
      firstImport.EDEATH_SPARKS_HEADER_GUARD_PORTED,
    );
  });

  it("ports death spark spread limits from edeathsparks.cpp", () => {
    expect(DEATH_SPARKS_MAX_UP).toBe(70);
    expect(DEATH_SPARKS_MAX_DOWN).toBe(150);
    expect(DEATH_SPARKS_MAX_LEFT).toBe(180);
    expect(DEATH_SPARKS_MAX_RIGHT).toBe(180);
  });
});
