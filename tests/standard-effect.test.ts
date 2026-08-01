import { describe, expect, it } from "vitest";
import {
  ESTANDARD_HEADER_GUARD_PORTED,
  initStandardEffect,
  isStandardEffectBefore,
  processStandardEffect,
  STANDARD_EFFECT_FRAME_COUNT,
  STANDARD_EFFECT_PROCESS_INTERVAL_SECONDS,
  StandardEffectObject,
  type StandardEffectInitState,
  type StandardEffectProcessState,
} from "../src/simulation/StandardEffect";

describe("standard effect", () => {
  it("adapts the estandard.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/StandardEffect");
    const secondImport = await import("../src/simulation/StandardEffect");

    expect(ESTANDARD_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ESTANDARD_HEADER_GUARD_PORTED).toBe(
      firstImport.ESTANDARD_HEADER_GUARD_PORTED,
    );
  });

  it("ports estandard_objects as standard effect identifiers", () => {
    expect(StandardEffectObject.BigSmoke).toBe(0);
    expect(StandardEffectObject.LittleFire).toBe(1);
    expect(StandardEffectObject.SmallFireSmoke).toBe(2);
    expect(StandardEffectObject.Fire).toBe(3);
  });

  it("ports EStandard Init as standard smoke and fire frame paths", () => {
    const state: StandardEffectInitState = {
      bigSmokeFrames: [],
      littleFireFrames: [],
      smallFireSmokeFrames: [],
      fireFrames: [],
      finishedInit: false,
    };

    initStandardEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.bigSmokeFrames).toHaveLength(STANDARD_EFFECT_FRAME_COUNT);
    expect(state.littleFireFrames).toHaveLength(STANDARD_EFFECT_FRAME_COUNT);
    expect(state.smallFireSmokeFrames).toHaveLength(STANDARD_EFFECT_FRAME_COUNT);
    expect(state.fireFrames).toHaveLength(STANDARD_EFFECT_FRAME_COUNT);
    expect(state.bigSmokeFrames).toEqual([
      "assets/units/vehicles/death_effects/big_smoke_n00.png",
      "assets/units/vehicles/death_effects/big_smoke_n01.png",
      "assets/units/vehicles/death_effects/big_smoke_n02.png",
      "assets/units/vehicles/death_effects/big_smoke_n03.png",
    ]);
    expect(state.littleFireFrames[0]).toBe(
      "assets/units/vehicles/death_effects/little_fire_n00.png",
    );
    expect(state.littleFireFrames[3]).toBe(
      "assets/units/vehicles/death_effects/little_fire_n03.png",
    );
    expect(state.smallFireSmokeFrames[0]).toBe(
      "assets/units/vehicles/death_effects/small_fire_smoke_n00.png",
    );
    expect(state.smallFireSmokeFrames[3]).toBe(
      "assets/units/vehicles/death_effects/small_fire_smoke_n03.png",
    );
    expect(state.fireFrames[0]).toBe(
      "assets/units/vehicles/death_effects/fire_n00.png",
    );
    expect(state.fireFrames[3]).toBe(
      "assets/units/vehicles/death_effects/fire_n03.png",
    );
  });

  it("ports sort_estandards_func as bottom-y ordering", () => {
    expect(isStandardEffectBefore({ by: 10 }, { by: 11 })).toBe(true);
    expect(isStandardEffectBefore({ by: 11 }, { by: 10 })).toBe(false);
    expect(isStandardEffectBefore({ by: 10 }, { by: 10 })).toBe(false);
  });

  it("keeps killed effects unchanged while processing", () => {
    const state: StandardEffectProcessState = {
      killMe: true,
      renderIndex: 1,
      maxRender: 4,
      nextProcessTime: 10,
    };

    processStandardEffect(state, 10);

    expect(state).toEqual({
      killMe: true,
      renderIndex: 1,
      maxRender: 4,
      nextProcessTime: 10,
    });
  });

  it("keeps the frame unchanged before the next process time", () => {
    const state: StandardEffectProcessState = {
      killMe: false,
      renderIndex: 1,
      maxRender: 4,
      nextProcessTime: 10,
    };

    processStandardEffect(state, 9.99);

    expect(state.renderIndex).toBe(1);
    expect(state.nextProcessTime).toBe(10);
  });

  it("advances the frame and schedules the next process time", () => {
    const state: StandardEffectProcessState = {
      killMe: false,
      renderIndex: 1,
      maxRender: 4,
      nextProcessTime: 10,
    };

    processStandardEffect(state, 10);

    expect(state.renderIndex).toBe(2);
    expect(state.nextProcessTime).toBe(
      10 + STANDARD_EFFECT_PROCESS_INTERVAL_SECONDS,
    );
  });

  it("wraps the render frame when it reaches the maximum", () => {
    const state: StandardEffectProcessState = {
      killMe: false,
      renderIndex: 3,
      maxRender: 4,
      nextProcessTime: 10,
    };

    processStandardEffect(state, 10);

    expect(state.renderIndex).toBe(0);
    expect(state.nextProcessTime).toBe(
      10 + STANDARD_EFFECT_PROCESS_INTERVAL_SECONDS,
    );
  });
});
