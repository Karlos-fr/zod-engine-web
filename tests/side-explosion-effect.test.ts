import { describe, expect, it } from "vitest";
import {
  ESIDE_EXPLOSION_HEADER_GUARD_PORTED,
  initSideExplosionEffect,
  SIDE_EXPLOSION_NORMAL_FRAME_COUNT,
  SideExplosionType,
  type SideExplosionInitState,
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

  it("ports ESideExplosion Init as normal side-explosion frame path initialization", () => {
    const state: SideExplosionInitState = {
      normalImages: [],
      finishedInit: false,
    };

    initSideExplosionEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.normalImages).toHaveLength(SIDE_EXPLOSION_NORMAL_FRAME_COUNT);
    expect(state.normalImages[0]).toBe(
      "assets/other/explosions/side_explosion_n00.png",
    );
    expect(state.normalImages[6]).toBe(
      "assets/other/explosions/side_explosion_n06.png",
    );
  });
});
