/**
 * Upstream: edeathsparks.h / edeathsparks.cpp
 */

/**
 * Port of upstream `_EDEATHSPARKS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: edeathsparks.h:2
 */
export const EDEATH_SPARKS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EDeathSparks` sprite frame count.
 * Role: Defines how many death-spark frames are loaded during initialization.
 * Upstream: edeathsparks.cpp:58-62
 */
export const DEATH_SPARKS_FRAME_COUNT = 6;

/**
 * Port of upstream `max_up`.
 * Role: Defines the maximum upward spark offset for the death spark effect.
 * Upstream: edeathsparks.cpp:10
 */
export const DEATH_SPARKS_MAX_UP = 70;

/**
 * Port of upstream `max_down`.
 * Role: Defines the maximum downward spark offset for the death spark effect.
 * Upstream: edeathsparks.cpp:11
 */
export const DEATH_SPARKS_MAX_DOWN = 150;

/**
 * Port of upstream `max_left`.
 * Role: Defines the maximum leftward spark offset for the death spark effect.
 * Upstream: edeathsparks.cpp:12
 */
export const DEATH_SPARKS_MAX_LEFT = 180;

/**
 * Port of upstream `max_right`.
 * Role: Defines the maximum rightward spark offset for the death spark effect.
 * Upstream: edeathsparks.cpp:13
 */
export const DEATH_SPARKS_MAX_RIGHT = 180;

/**
 * Port of upstream `EDeathSparks` image state.
 * Role: Stores death-spark frame asset paths and initialization status.
 * Upstream: edeathsparks.cpp:53-65
 */
export type DeathSparksInitState = {
  baseImages: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `EDeathSparks` construction arguments.
 * Role: Describes one spawned vehicle death spark effect.
 * Upstream: edeathsparks.cpp, edeathsparks.h
 */
export type DeathSparksEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  x: number;
  y: number;
};

/**
 * Port of upstream `EDeathSparks::Init`.
 * Role: Initializes death-spark frame asset paths.
 * Upstream: edeathsparks.cpp:53-65
 */
export function initDeathSparksEffect(state: DeathSparksInitState): void {
  state.baseImages = Array.from(
    { length: DEATH_SPARKS_FRAME_COUNT },
    (_value, index) =>
      `assets/units/vehicles/death_effects/spark_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}
