/**
 * Upstream: zeffect.h
 */
import type { ZSettings } from "../data/ZSettingsData";

/**
 * Port of upstream `_ZEFFECT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zeffect.h:2
 */
export const ZEFFECT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `effect_flags`.
 * Role: Carries extra effect requests emitted during effect processing.
 * Upstream: zeffect.h:16-32
 */
export class EffectFlags {
  unitParticles = false;
  unitParticlesRadius = 0;
  unitParticlesAmount = 0;
  x = 0;
  y = 0;

  constructor() {
    this.clear();
  }

  /**
   * Port of upstream `effect_flags::Clear`.
   * Role: Resets unit-particle effect flags and leaves coordinates untouched.
   * Upstream: zeffect.h:26-31
   */
  clear(): void {
    this.unitParticles = false;
    this.unitParticlesRadius = 0;
    this.unitParticlesAmount = 0;
  }
}

/**
 * Port of upstream `ZEffect` reference.
 * Role: Represents an effect instance stored by the shared effect list.
 * Upstream: zeffect.h:40, zobject.h:302
 */
export type SimulationEffectReference = object;

/**
 * Port of upstream `ZEffect::effect_list`.
 * Role: Holds the shared effect list reference used by simulation objects.
 * Upstream: zeffect.h:54, zobject.h:302
 */
export type SimulationEffectListState = {
  effectList: SimulationEffectReference[] | null;
};

/**
 * Port of upstream `ZEffect::zsettings`.
 * Role: Holds the shared settings reference used by simulation effects.
 * Upstream: zeffect.h:51-52
 */
export type SimulationEffectSettingsState = {
  zsettings: ZSettings | null;
};

/**
 * Port of upstream `ZEffect::killme`.
 * Role: Holds whether an effect should be removed from the active effect list.
 * Upstream: zeffect.h:49
 */
export type SimulationEffectKillState = {
  killme: boolean;
};

/**
 * Port of upstream `ZEffect::SetEffectList`.
 * Role: Stores the shared effect list reference for effect-producing objects.
 * Upstream: zeffect.cpp:19-22
 */
export function setSimulationEffectList(
  state: SimulationEffectListState,
  effectList: SimulationEffectReference[] | null,
): void {
  state.effectList = effectList;
}

/**
 * Port of upstream `ZEffect::SetSettings`.
 * Role: Stores the shared settings reference used by simulation effects.
 * Upstream: zeffect.cpp:14-17
 */
export function setSimulationEffectSettings(
  state: SimulationEffectSettingsState,
  zsettings: ZSettings | null,
): void {
  state.zsettings = zsettings;
}

/**
 * Port of upstream `ZEffect::Process`.
 * Role: Base effect processing hook; upstream implementation is empty.
 * Upstream: zeffect.cpp:24-27
 */
export function processSimulationEffect(): void {}

/**
 * Port of upstream `ZEffect::KillMe`.
 * Role: Reports whether the effect should be removed.
 * Upstream: zeffect.cpp:29-32
 */
export function simulationEffectKillMe(state: SimulationEffectKillState): boolean {
  return state.killme;
}
