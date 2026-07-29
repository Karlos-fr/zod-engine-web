/**
 * Upstream: ecannondeath.h
 */

/**
 * Port of upstream `_ECANNONDEATH_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ecannondeath.h:2
 */
export const ECANNON_DEATH_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ecannondeath_objects`.
 * Role: Identifies which cannon body variant is represented by a cannon death effect.
 * Upstream: ecannondeath.h:7-10
 */
export enum CannonDeathObject {
  Gatling = 0,
  Gun = 1,
  Howitzer = 2,
  Missile = 3,
}

/**
 * Port of upstream `ECannonDeath` wasted image fields.
 * Role: Stores the base image path for each cannon destroyed-body variant.
 * Upstream: ecannondeath.cpp:76-79
 */
export type CannonDeathImageState = {
  gatlingWasted: string | null;
  gunWasted: string | null;
  howitzerWasted: string | null;
  missileWasted: string | null;
};

/**
 * Minimal state consumed by ported `ECannonDeath::Init`.
 * Role: Holds cannon destroyed-body image paths and the initialization flag.
 * Upstream: ecannondeath.cpp:74-82
 */
export type CannonDeathInitState = CannonDeathImageState & {
  finishedInit: boolean;
};

/**
 * Port of upstream `ECannonDeath::Init`.
 * Role: Initializes cannon destroyed-body image paths.
 * Upstream: ecannondeath.cpp:74-82
 */
export function initCannonDeathEffect(state: CannonDeathInitState): void {
  state.gatlingWasted = "assets/units/cannons/gatling/wasted.png";
  state.gunWasted = "assets/units/cannons/gun/wasted.png";
  state.howitzerWasted = "assets/units/cannons/howitzer/wasted.png";
  state.missileWasted = "assets/units/cannons/missile_cannon/wasted.png";

  state.finishedInit = true;
}
