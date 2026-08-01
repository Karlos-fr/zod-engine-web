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
 * Port of upstream `EDeathSparks::Process` mutable fields.
 * Role: Stores animation, lifetime, and projectile-motion state for one death spark.
 * Upstream: edeathsparks.cpp:67-114
 */
export type DeathSparksProcessState = {
  killMe: boolean;
  renderIndex: number;
  nextProcessTime: number;
  initialTime: number;
  finalTime: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  rise: number;
  size: number;
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

/**
 * Port of upstream `EDeathSparks::Process`.
 * Role: Advances death-spark animation, expires it, and updates its arcing position.
 * Upstream: edeathsparks.cpp:67-114
 */
export function processDeathSparksEffect(
  state: DeathSparksProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.finalTime) {
    state.killMe = true;
    return;
  }

  if (currentTime >= state.nextProcessTime) {
    state.renderIndex += 1;
    if (state.renderIndex >= DEATH_SPARKS_FRAME_COUNT) state.renderIndex = 0;

    state.nextProcessTime = currentTime + 0.1;
  }

  const timeDifference = currentTime - state.initialTime;

  state.x = state.startX + state.deltaX * timeDifference;
  state.y = state.startY + state.deltaY * timeDifference;
  state.size =
    -(state.rise / (state.finalTime - state.initialTime)) *
      (timeDifference * timeDifference) +
    state.rise * timeDifference;
  state.y -= state.size * 30;
}
