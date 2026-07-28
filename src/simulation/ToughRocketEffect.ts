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
