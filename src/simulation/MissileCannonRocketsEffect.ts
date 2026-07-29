/**
 * Upstream: emissilecrockets.h
 */

/**
 * Port of upstream `_EMISSILECROCKETS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: emissilecrockets.h:2
 */
export const EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `EMissileCRockets::Init`.
 * Role: Holds the missile-cannon bullet image path and initialization flag.
 * Upstream: emissilecrockets.cpp:61-69
 */
export type MissileCannonRocketsInitState = {
  bulletImage: string | null;
  finishedInit: boolean;
};

/**
 * Port of upstream `EMissileCRockets::Init`.
 * Role: Initializes the missile-cannon bullet image path.
 * Upstream: emissilecrockets.cpp:61-69
 */
export function initMissileCannonRocketsEffect(
  state: MissileCannonRocketsInitState,
): void {
  state.bulletImage = "assets/units/cannons/missile_cannon/bullet.png";
  state.finishedInit = true;
}
