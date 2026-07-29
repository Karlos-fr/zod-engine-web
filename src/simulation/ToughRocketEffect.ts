/**
 * Upstream: etoughrocket.h
 */

/**
 * Port of upstream `_ETOUGHROCKET_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etoughrocket.h:2
 */
export const ETOUGH_ROCKET_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EToughRocket` bullet frame count.
 * Role: Defines how many tough rocket bullet frames are loaded during initialization.
 * Upstream: etoughrocket.cpp:65-69
 */
export const TOUGH_ROCKET_BULLET_FRAME_COUNT = 2;

/**
 * Port of upstream `EToughRocket` image state.
 * Role: Stores tough rocket bullet frame asset paths and initialization status.
 * Upstream: etoughrocket.cpp:60-72
 */
export type ToughRocketInitState = {
  bulletFrames: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `EToughRocket::Init`.
 * Role: Initializes tough rocket bullet frame asset paths.
 * Upstream: etoughrocket.cpp:60-72
 */
export function initToughRocketEffect(state: ToughRocketInitState): void {
  state.bulletFrames = Array.from(
    { length: TOUGH_ROCKET_BULLET_FRAME_COUNT },
    (_value, index) =>
      `assets/units/robots/tough/bullet_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `time_d`.
 * Role: Calculates the first tough rocket timing threshold.
 * Upstream: etoughrocket.cpp:118
 */
export function calcToughRocketTimeD(bulletSpeed: number): number {
  return 6.0 / bulletSpeed;
}

/**
 * Port of upstream `time_d2`.
 * Role: Calculates the second tough rocket timing threshold.
 * Upstream: etoughrocket.cpp:119
 */
export function calcToughRocketTimeD2(bulletSpeed: number): number {
  return 8.0 / bulletSpeed;
}
