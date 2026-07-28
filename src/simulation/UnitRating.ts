/**
 * Ported from Zod Engine.
 * Upstream: zunitrating.h
 */

/**
 * Port of upstream `_ZUNITRATING_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-563E02
 * Upstream: zunitrating.h:2
 */
export const ZUNITRATING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `unit_cross_reference`.
 * Role: Classifies the expected outcome between two unit types.
 * Ledger: ENU-6DB055
 * Upstream: zunitrating.h:4-7
 */
export enum UnitCrossReference {
  WillDie = 0,
  Even = 1,
  WillKill = 2,
}
