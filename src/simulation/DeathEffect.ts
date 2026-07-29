/**
 * Upstream: edeath.h
 */

/**
 * Port of upstream `_EDEATH_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: edeath.h:2
 */
export const EDEATH_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `edeath_objects`.
 * Role: Identifies the vehicle death sprite set for the death effect.
 * Upstream: edeath.h:7-10
 */
export enum DeathEffectObject {
  Jeep = 0,
  MobileMissile = 1,
  Apc = 2,
  Tank = 3,
  Crane = 4,
}

/**
 * Port of upstream `EDeath` wasted image fields.
 * Role: Stores the base image path for each vehicle destroyed-body variant initialized by the effect.
 * Upstream: edeath.cpp:101-104
 */
export type DeathEffectImageState = {
  jeepWasted: string | null;
  mobileMissileWasted: string | null;
  apcWasted: string | null;
  craneWasted: string | null;
};

/**
 * Minimal state consumed by ported `EDeath::Init`.
 * Role: Holds vehicle destroyed-body image paths and the initialization flag.
 * Upstream: edeath.cpp:99-107
 */
export type DeathEffectInitState = DeathEffectImageState & {
  finishedInit: boolean;
};

/**
 * Port of upstream `EDeath::Init`.
 * Role: Initializes vehicle destroyed-body image paths.
 * Upstream: edeath.cpp:99-107
 */
export function initDeathEffect(state: DeathEffectInitState): void {
  state.jeepWasted = "assets/units/vehicles/jeep/wasted.png";
  state.mobileMissileWasted =
    "assets/units/vehicles/missile_launcher/wasted.png";
  state.apcWasted = "assets/units/vehicles/apc/wasted.png";
  state.craneWasted = "assets/units/vehicles/crane/wasted_null.png";

  state.finishedInit = true;
}
