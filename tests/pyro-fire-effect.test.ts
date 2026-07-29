import { describe, expect, it } from "vitest";
import {
  EPYRO_FIRE_HEADER_GUARD_PORTED,
  initPyroFireEffect,
  processPyroFireEffect,
  PYRO_FIRE_FRAME_COUNTS,
  PYRO_FIRE_PROCESS_INTERVAL_SECONDS,
  type PyroFireInitState,
  type PyroFireProcessState,
} from "../src/simulation/PyroFireEffect";

describe("pyro fire effect", () => {
  it("adapts the epyrofire.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/PyroFireEffect");
    const secondImport = await import("../src/simulation/PyroFireEffect");

    expect(EPYRO_FIRE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EPYRO_FIRE_HEADER_GUARD_PORTED).toBe(
      firstImport.EPYRO_FIRE_HEADER_GUARD_PORTED,
    );
  });

  it("ports EPyroFire Init as per-variant fire frame path initialization", () => {
    const state: PyroFireInitState = {
      fireImages: [],
      finishedInit: false,
    };

    initPyroFireEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.fireImages.map((frames) => frames.length)).toEqual([
      ...PYRO_FIRE_FRAME_COUNTS,
    ]);
    expect(state.fireImages[0]?.[0]).toBe("assets/other/fire/fire0_n00.png");
    expect(state.fireImages[2]?.[3]).toBe("assets/other/fire/fire2_n03.png");
    expect(state.fireImages[4]?.[5]).toBe("assets/other/fire/fire4_n05.png");
  });

  it("keeps killed pyro fire effects unchanged while processing", () => {
    const state: PyroFireProcessState = {
      killMe: true,
      fireIndex: 0,
      fireFrame: 1,
      nextProcessTime: 10,
    };

    processPyroFireEffect(state, 10);

    expect(state).toEqual({
      killMe: true,
      fireIndex: 0,
      fireFrame: 1,
      nextProcessTime: 10,
    });
  });

  it("keeps pyro fire unchanged before the next process time", () => {
    const state: PyroFireProcessState = {
      killMe: false,
      fireIndex: 0,
      fireFrame: 1,
      nextProcessTime: 10,
    };

    processPyroFireEffect(state, 9.99);

    expect(state.killMe).toBe(false);
    expect(state.fireFrame).toBe(1);
    expect(state.nextProcessTime).toBe(10);
  });

  it("advances the frame and schedules the next pyro fire process time", () => {
    const state: PyroFireProcessState = {
      killMe: false,
      fireIndex: 4,
      fireFrame: 2,
      nextProcessTime: 10,
    };

    processPyroFireEffect(state, 10);

    expect(state.killMe).toBe(false);
    expect(state.fireFrame).toBe(3);
    expect(state.nextProcessTime).toBe(
      10 + PYRO_FIRE_PROCESS_INTERVAL_SECONDS,
    );
  });

  it("expires pyro fire when the variant reaches its frame count", () => {
    const state: PyroFireProcessState = {
      killMe: false,
      fireIndex: 0,
      fireFrame: PYRO_FIRE_FRAME_COUNTS[0] - 1,
      nextProcessTime: 10,
    };

    processPyroFireEffect(state, 10);

    expect(state.killMe).toBe(true);
    expect(state.fireFrame).toBe(PYRO_FIRE_FRAME_COUNTS[0]);
    expect(state.nextProcessTime).toBe(
      10 + PYRO_FIRE_PROCESS_INTERVAL_SECONDS,
    );
  });
});
