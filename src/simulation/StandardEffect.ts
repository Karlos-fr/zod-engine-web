/**
 * Ported from Zod Engine.
 * Upstream: estandard.h
 */

/**
 * Port of upstream `_ESTANDARD_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-F872D0
 * Upstream: estandard.h:2
 */
export const ESTANDARD_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `estandard_objects`.
 * Role: Identifies the standard death/fire effect sprite set.
 * Ledger: ENU-4316BD
 * Upstream: estandard.h:6-9
 */
export enum StandardEffectObject {
  BigSmoke = 0,
  LittleFire = 1,
  SmallFireSmoke = 2,
  Fire = 3,
}
