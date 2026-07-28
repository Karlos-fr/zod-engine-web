/**
 * Upstream: estandard.h
 */

/**
 * Port of upstream `_ESTANDARD_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: estandard.h:2
 */
export const ESTANDARD_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `estandard_objects`.
 * Role: Identifies the standard death/fire effect sprite set.
 * Upstream: estandard.h:6-9
 */
export enum StandardEffectObject {
  BigSmoke = 0,
  LittleFire = 1,
  SmallFireSmoke = 2,
  Fire = 3,
}
