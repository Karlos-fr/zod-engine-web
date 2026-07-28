/**
 * Ported from Zod Engine.
 * Upstream: ecannondeath.h
 */

/**
 * Port of upstream `_ECANNONDEATH_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-4C77B8
 * Upstream: ecannondeath.h:2
 */
export const ECANNON_DEATH_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ecannondeath_objects`.
 * Role: Identifies which cannon body variant is represented by a cannon death effect.
 * Ledger: ENU-CC3996
 * Upstream: ecannondeath.h:7-10
 */
export enum CannonDeathObject {
  Gatling = 0,
  Gun = 1,
  Howitzer = 2,
  Missile = 3,
}
