/**
 * Ported from Zod Engine.
 * Upstream: edeath.h
 */

/**
 * Port of upstream `_EDEATH_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-E7DC43
 * Upstream: edeath.h:2
 */
export const EDEATH_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `edeath_objects`.
 * Role: Identifies the vehicle death sprite set for the death effect.
 * Ledger: ENU-E49060
 * Upstream: edeath.h:7-10
 */
export enum DeathEffectObject {
  Jeep = 0,
  MobileMissile = 1,
  Apc = 2,
  Tank = 3,
  Crane = 4,
}
