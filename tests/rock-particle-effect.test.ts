import { describe, expect, it } from "vitest";
import {
  EROCK_PARTICLE_HEADER_GUARD_PORTED,
  initRockParticleEffect,
  processRockParticleEffect,
  RockParticleType,
} from "../src/simulation/RockParticleEffect";
import { PlanetType } from "../src/simulation/SimulationConstants";

describe("rock particle effect", () => {
  it("adapts the erockparticle.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RockParticleEffect");
    const secondImport = await import("../src/simulation/RockParticleEffect");

    expect(EROCK_PARTICLE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROCK_PARTICLE_HEADER_GUARD_PORTED).toBe(
      firstImport.EROCK_PARTICLE_HEADER_GUARD_PORTED,
    );
  });

  it("ports rock_particle_type as rock particle identifiers", () => {
    expect(RockParticleType.Small).toBe(0);
    expect(RockParticleType.Mid).toBe(1);
  });

  it("ports ERockParticle Init as rock debris image loading", () => {
    const loaded: string[] = [];
    const state = {
      debriMid0Images: [] as string[][],
      debriMid1Images: [] as string[][],
      debriSmallImages: [] as string[][],
      finishedInit: false,
    };

    initRockParticleEffect(state, (filename) => {
      loaded.push(filename);
      return filename;
    });

    expect(loaded).toHaveLength(PlanetType.Max * (8 + 8 + 16));
    expect(state.debriMid0Images[PlanetType.Desert]).toHaveLength(8);
    expect(state.debriMid1Images[PlanetType.Desert]).toHaveLength(8);
    expect(state.debriSmallImages[PlanetType.Desert]).toHaveLength(16);
    expect(state.debriMid0Images[PlanetType.Desert][0]).toBe(
      "assets/planets/rock_effects/debri_mid0_desert_n00.png",
    );
    expect(state.debriMid1Images[PlanetType.Volcanic][7]).toBe(
      "assets/planets/rock_effects/debri_mid1_volcanic_n07.png",
    );
    expect(state.debriSmallImages[PlanetType.City][15]).toBe(
      "assets/planets/rock_effects/debri_small_city_n15.png",
    );
    expect(loaded.slice(0, 3)).toEqual([
      "assets/planets/rock_effects/debri_mid0_desert_n00.png",
      "assets/planets/rock_effects/debri_mid0_desert_n01.png",
      "assets/planets/rock_effects/debri_mid0_desert_n02.png",
    ]);
    expect(loaded.slice(-3)).toEqual([
      "assets/planets/rock_effects/debri_small_city_n13.png",
      "assets/planets/rock_effects/debri_small_city_n14.png",
      "assets/planets/rock_effects/debri_small_city_n15.png",
    ]);
    expect(state.finishedInit).toBe(true);
  });

  it("ports ERockParticle Process guard cases", () => {
    const killedState = createRockParticleProcessState({
      killme: true,
      ztime: { ztime: 2 },
      renderIndex: 5,
    });

    processRockParticleEffect(killedState);
    expect(killedState).toMatchObject({
      killme: true,
      renderIndex: 5,
      x: 10,
      y: 20,
    });

    const expiredState = createRockParticleProcessState({
      ztime: { ztime: 6 },
      finalTime: 6,
    });

    processRockParticleEffect(expiredState);
    expect(expiredState.killme).toBe(true);
    expect(expiredState.renderIndex).toBe(0);
  });

  it("ports ERockParticle Process as animation and ballistic motion update", () => {
    const state = createRockParticleProcessState({
      ztime: { ztime: 1.5 },
      initTime: 1,
      finalTime: 3,
      nextProcessTime: 1.25,
      renderIndex: 5,
      startX: 10,
      startY: 20,
      deltaX: 4,
      deltaY: -2,
      rise: 3,
    });

    processRockParticleEffect(state);

    expect(state.killme).toBe(false);
    expect(state.renderIndex).toBe(0);
    expect(state.nextProcessTime).toBeCloseTo(1.57);
    expect(state.x).toBe(12);
    expect(state.size).toBeCloseTo(2.125);
    expect(state.y).toBeCloseTo(-149.75);
  });
});

function createRockParticleProcessState(
  overrides: Partial<Parameters<typeof processRockParticleEffect>[0]> = {},
): Parameters<typeof processRockParticleEffect>[0] {
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
