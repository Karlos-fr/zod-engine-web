/**
 * Ported from Zod Engine.
 * Upstream: etrack.h
 */

/**
 * Port of upstream `_ETRACK_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-1FE002
 * Upstream: etrack.h:2
 */
export const ETRACK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETRACK_TYPE`.
 * Role: Identifies the vehicle track effect sprite set.
 * Ledger: ENU-9C31CA
 * Upstream: etrack.h:6-9
 */
export enum TrackEffectType {
  Tank = 0,
  Jeep = 1,
  MaxTrackTypes = 2,
}
