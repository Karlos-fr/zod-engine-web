/**
 * Upstream: orock.h
 */

/**
 * Port of upstream `_OROCK_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: orock.h:2
 */
export const OROCK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ORock::IsDestroyableImpass`.
 * Role: Reports that rock objects are destroyable impassable barriers.
 * Upstream: orock.h:31
 */
export function isRockDestroyableImpassable(): boolean {
  return true;
}
