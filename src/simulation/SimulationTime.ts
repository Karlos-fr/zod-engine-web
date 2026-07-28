/**
 * Upstream: ztime.h
 */

/**
 * Port of upstream `_ZTIME_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ztime.h:2
 */
export const ZTIME_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `game_speed`.
 * Role: Stores the current simulation time speed multiplier.
 * Upstream: ztime.h:14
 */
export type SimulationTimeSpeedState = {
  gameSpeed: number;
};

/**
 * Port of upstream `paused`.
 * Role: Stores whether simulation time progression is paused.
 * Upstream: ztime.h:12
 */
export type SimulationTimePauseState = {
  paused: boolean;
};

/**
 * Port of upstream `IsPaused`.
 * Role: Returns whether simulation time progression is paused.
 * Upstream: ztime.h:12
 */
export function isSimulationPaused(
  state: SimulationTimePauseState,
): boolean {
  return state.paused;
}

/**
 * Port of upstream `GameSpeed`.
 * Role: Returns the current simulation time speed multiplier.
 * Upstream: ztime.h:14
 */
export function getSimulationGameSpeed(
  state: SimulationTimeSpeedState,
): number {
  return state.gameSpeed;
}
