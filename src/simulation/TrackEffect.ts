/**
 * Upstream: etrack.h
 */

/**
 * Port of upstream `_ETRACK_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etrack.h:2
 */
export const ETRACK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETRACK_TYPE`.
 * Role: Identifies the vehicle track effect sprite set.
 * Upstream: etrack.h:6-9
 */
export enum TrackEffectType {
  Tank = 0,
  Jeep = 1,
  MaxTrackTypes = 2,
}

/**
 * Port of upstream `ETrack::Process` frame timing thresholds.
 * Role: Defines when track marks advance frames and expire.
 * Upstream: etrack.cpp:82-84
 */
export const TRACK_EFFECT_FRAME_1_SECONDS = 3.3;
export const TRACK_EFFECT_FRAME_2_SECONDS = 3.6;
export const TRACK_EFFECT_KILL_SECONDS = 3.9;

/**
 * Port of upstream `ETrack::Process` mutable fields.
 * Role: Captures the track effect lifetime and tile image index.
 * Upstream: etrack.cpp:73-86
 */
export type TrackEffectProcessState = {
  killMe: boolean;
  startTime: number;
  tileIndex: number;
};

/**
 * Port of upstream `ETrack::Process`.
 * Role: Advances the track tile index as it ages and expires old track marks.
 * Upstream: etrack.cpp:73-86
 */
export function processTrackEffect(
  state: TrackEffectProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  const delta = currentTime - state.startTime;

  if (delta >= TRACK_EFFECT_KILL_SECONDS) state.killMe = true;
  else if (delta >= TRACK_EFFECT_FRAME_2_SECONDS) state.tileIndex = 2;
  else if (delta >= TRACK_EFFECT_FRAME_1_SECONDS) state.tileIndex = 1;
  else state.tileIndex = 0;
}
