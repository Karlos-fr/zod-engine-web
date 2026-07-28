/**
 * Upstream: ohut.h
 */

/**
 * Port of upstream `_OHUT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ohut.h:2
 */
export const OHUT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `OHut::IsDestroyableImpass`.
 * Role: Reports that hut objects are destroyable impassable barriers.
 * Upstream: ohut.h:25
 */
export function isHutDestroyableImpassable(): boolean {
  return true;
}
