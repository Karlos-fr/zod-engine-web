import { describe, expect, it } from "vitest";
import {
  EUNIT_PARTICLE_HEADER_GUARD_PORTED,
  initUnitParticleEffect,
  processUnitParticleEffect,
  UNIT_PARTICLE_FRAME_COUNT,
  type UnitParticleInitState,
} from "../src/simulation/UnitParticleEffect";

describe("unit particle effect", () => {
  it("adapts the eunitparticle.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/UnitParticleEffect");
    const secondImport = await import("../src/simulation/UnitParticleEffect");

    expect(EUNIT_PARTICLE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EUNIT_PARTICLE_HEADER_GUARD_PORTED).toBe(
      firstImport.EUNIT_PARTICLE_HEADER_GUARD_PORTED,
    );
  });

  it("ports EUnitParticle Init as unit-particle frame path initialization", () => {
    const state: UnitParticleInitState = { baseImages: [] };

    initUnitParticleEffect(state);

    expect(state.baseImages).toHaveLength(UNIT_PARTICLE_FRAME_COUNT);
    expect(state.baseImages[0]).toBe("assets/other/particles/unit_particle_n00.png");
    expect(state.baseImages[9]).toBe("assets/other/particles/unit_particle_n09.png");
    expect(state.baseImages[19]).toBe("assets/other/particles/unit_particle_n19.png");
  });

  it("ports EUnitParticle Process guard cases", () => {
    const killedState = createUnitParticleProcessState({
      killme: true,
      ztime: { ztime: 2 },
      renderIndex: 19,
    });

    processUnitParticleEffect(killedState);
    expect(killedState).toMatchObject({
      killme: true,
      renderIndex: 19,
      x: 10,
      y: 20,
    });

    const expiredState = createUnitParticleProcessState({
      ztime: { ztime: 6 },
      finalTime: 6,
    });

    processUnitParticleEffect(expiredState);
    expect(expiredState.killme).toBe(true);
    expect(expiredState.renderIndex).toBe(0);
  });

  it("ports EUnitParticle Process as animation and ballistic motion update", () => {
    const state = createUnitParticleProcessState({
      ztime: { ztime: 1.5 },
      initTime: 1,
      finalTime: 3,
      nextProcessTime: 1.25,
      renderIndex: 19,
      startX: 10,
      startY: 20,
      deltaX: 4,
      deltaY: -2,
      rise: 3,
    });

    processUnitParticleEffect(state);

    expect(state.killme).toBe(false);
    expect(state.renderIndex).toBe(0);
    expect(state.nextProcessTime).toBeCloseTo(1.53);
    expect(state.x).toBe(12);
    expect(state.size).toBe(1);
    expect(state.y).toBeCloseTo(-54.125);
  });
});

function createUnitParticleProcessState(
  overrides: Partial<Parameters<typeof processUnitParticleEffect>[0]> = {},
): Parameters<typeof processUnitParticleEffect>[0] {
  return {
    killme: false,
    ztime: { ztime: 0 },
    initTime: 0,
    finalTime: 10,
    nextProcessTime: 1,
    renderIndex: 0,
    x: 10,
    y: 20,
    startX: 10,
    startY: 20,
    deltaX: 0,
    deltaY: 0,
    rise: 1,
    size: 1,
    ...overrides,
  };
}
