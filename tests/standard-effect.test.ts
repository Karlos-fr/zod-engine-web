import { describe, expect, it } from "vitest";
import {
  ESTANDARD_HEADER_GUARD_PORTED,
  isStandardEffectBefore,
  processStandardEffect,
  STANDARD_EFFECT_PROCESS_INTERVAL_SECONDS,
  StandardEffectObject,
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
