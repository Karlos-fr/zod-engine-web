import { describe, expect, it } from "vitest";
import {
  ESIDE_EXPLOSION_HEADER_GUARD_PORTED,
  initSideExplosionEffect,
  processSideExplosionEffect,
  SIDE_EXPLOSION_NORMAL_FRAME_COUNT,
  type SideExplosionProcessState,
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

  it("ports ESideExplosion Process killme guard", () => {
    const state: SideExplosionProcessState = {
      killme: true,
      renderIndex: 0,
      nextRenderTime: 10,
      initTime: 5,
      x: 20,
      y: 30,
      startX: 100,
      startY: 200,
      deltaX: 3,
      deltaY: 4,
    };

    processSideExplosionEffect(state, 12);

    expect(state).toEqual({
      killme: true,
      renderIndex: 0,
      nextRenderTime: 10,
      initTime: 5,
      x: 20,
      y: 30,
      startX: 100,
      startY: 200,
      deltaX: 3,
      deltaY: 4,
    });
  });

  it("ports ESideExplosion Process frame advance and movement", () => {
    const state: SideExplosionProcessState = {
      killme: false,
      renderIndex: 2,
      nextRenderTime: 10,
      initTime: 5,
      x: 0,
      y: 0,
      startX: 100,
      startY: 200,
      deltaX: 3,
      deltaY: 4,
    };

    processSideExplosionEffect(state, 10);

    expect(state.renderIndex).toBe(3);
    expect(state.nextRenderTime).toBe(10.13);
    expect(state.killme).toBe(false);
    expect(state.x).toBe(115);
    expect(state.y).toBe(220);
  });

  it("ports ESideExplosion Process movement before next frame time", () => {
    const state: SideExplosionProcessState = {
      killme: false,
      renderIndex: 2,
      nextRenderTime: 10,
      initTime: 5,
      x: 0,
      y: 0,
      startX: 100,
      startY: 200,
      deltaX: 3,
      deltaY: 4,
    };

    processSideExplosionEffect(state, 9);

    expect(state.renderIndex).toBe(2);
    expect(state.nextRenderTime).toBe(10);
    expect(state.killme).toBe(false);
    expect(state.x).toBe(112);
    expect(state.y).toBe(216);
  });

  it("ports ESideExplosion Process final frame kill without movement", () => {
    const state: SideExplosionProcessState = {
      killme: false,
      renderIndex: SIDE_EXPLOSION_NORMAL_FRAME_COUNT - 1,
      nextRenderTime: 10,
      initTime: 5,
      x: 20,
      y: 30,
      startX: 100,
      startY: 200,
      deltaX: 3,
      deltaY: 4,
    };

    processSideExplosionEffect(state, 10);

    expect(state.renderIndex).toBe(SIDE_EXPLOSION_NORMAL_FRAME_COUNT);
    expect(state.killme).toBe(true);
    expect(state.x).toBe(20);
    expect(state.y).toBe(30);
  });
});
