/**
 * Upstream: elightrocket.h
 */

/**
 * Port of upstream `_ELIGHTROCKET_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: elightrocket.h:2
 */
export const ELIGHT_ROCKET_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `ELightRocket::Init`.
 * Role: Holds the light-vehicle bullet image path and initialization flag.
 * Upstream: elightrocket.cpp:59-67
 */
export type LightRocketInitState = {
  bulletImage: string | null;
  finishedInit: boolean;
};

/**
 * Port of upstream `ELightRocket::Init`.
 * Role: Initializes the light-vehicle bullet image path.
 * Upstream: elightrocket.cpp:59-67
 */
export function initLightRocketEffect(state: LightRocketInitState): void {
  state.bulletImage = "assets/units/vehicles/light/bullet.png";
  state.finishedInit = true;
}
