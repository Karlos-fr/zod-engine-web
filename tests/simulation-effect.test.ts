import { describe, expect, it } from "vitest";
import { ZSettings } from "../src/data/ZSettingsData";
import {
  EffectFlags,
  type SimulationEffectKillState,
  type SimulationEffectListState,
  type SimulationEffectSettingsState,
  processSimulationEffect,
  renderSimulationEffect,
  setSimulationEffectList,
  setSimulationEffectSettings,
  simulationEffectKillMe,
  ZEFFECT_HEADER_GUARD_PORTED,
} from "../src/simulation/SimulationEffect";

describe("simulation effect", () => {
  it("adapts the zeffect.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/SimulationEffect");
    const secondImport = await import("../src/simulation/SimulationEffect");

    expect(ZEFFECT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZEFFECT_HEADER_GUARD_PORTED).toBe(
      firstImport.ZEFFECT_HEADER_GUARD_PORTED,
    );
  });

  it("ports effect_flags default construction through Clear", () => {
    expect(new EffectFlags()).toEqual({
      unitParticles: false,
      unitParticlesRadius: 0,
      unitParticlesAmount: 0,
      x: 0,
      y: 0,
    });
  });

  it("ports effect_flags Clear without changing coordinates", () => {
    const flags = new EffectFlags();
    flags.unitParticles = true;
    flags.unitParticlesRadius = 12;
    flags.unitParticlesAmount = 4;
    flags.x = 30;
    flags.y = 40;

    flags.clear();

    expect(flags).toEqual({
      unitParticles: false,
      unitParticlesRadius: 0,
      unitParticlesAmount: 0,
      x: 30,
      y: 40,
    });
  });

  it("ports SetEffectList as shared effect-list reference assignment", () => {
    const state: SimulationEffectListState = { effectList: null };
    const effectList = [{ id: "spark" }];

    setSimulationEffectList(state, effectList);
    effectList.push({ id: "smoke" });

    expect(state.effectList).toBe(effectList);
    expect(state.effectList).toHaveLength(2);
  });

  it("ports ZEffect SetEffectList as nullable shared effect-list assignment", () => {
    const effectList = [{ id: "spark" }];
    const state: SimulationEffectListState = { effectList };

    setSimulationEffectList(state, null);

    expect(state.effectList).toBeNull();
  });

  it("ports ZEffect SetSettings as shared settings reference assignment", () => {
    const state: SimulationEffectSettingsState = { zsettings: null };
    const settings = new ZSettings();

    setSimulationEffectSettings(state, settings);
    expect(state.zsettings).toBe(settings);

    setSimulationEffectSettings(state, null);
    expect(state.zsettings).toBeNull();
  });

  it("ports ZEffect Process as the empty base effect hook", () => {
    expect(processSimulationEffect()).toBeUndefined();
  });

  it("replaces ZEffect DoRender as the empty base render command list", () => {
    expect(renderSimulationEffect()).toEqual([]);
  });

  it("ports ZEffect KillMe as killme state read", () => {
    const state: SimulationEffectKillState = { killme: false };

    expect(simulationEffectKillMe(state)).toBe(false);

    state.killme = true;
    expect(simulationEffectKillMe(state)).toBe(true);
  });
});
