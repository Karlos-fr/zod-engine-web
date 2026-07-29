/**
 * Upstream: emomissilerockets.h
 */

/**
 * Port of upstream `_EMOMISSILEROCKETS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: emomissilerockets.h:2
 */
export const EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `EMoMissileRockets::Init`.
 * Role: Holds the mobile-missile bullet image path and initialization flag.
 * Upstream: emomissilerockets.cpp:61-69
 */
export type MobileMissileRocketsInitState = {
  bulletImage: string | null;
  finishedInit: boolean;
};

/**
 * Port of upstream `EMoMissileRockets::Init`.
 * Role: Initializes the mobile-missile bullet image path.
 * Upstream: emomissilerockets.cpp:61-69
 */
export function initMobileMissileRocketsEffect(
  state: MobileMissileRocketsInitState,
): void {
  state.bulletImage = "assets/units/vehicles/missile_launcher/bullet.png";
  state.finishedInit = true;
}
