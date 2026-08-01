/**
 * Upstream: etoughsmoke.h
 */

/**
 * Port of upstream `_ETOUGHSMOKE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etoughsmoke.h:2
 */
export const ETOUGH_SMOKE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EToughSmoke` render frame count.
 * Role: Defines how many tough-smoke frames are loaded during initialization.
 * Upstream: etoughsmoke.cpp:37-41
 */
export const TOUGH_SMOKE_FRAME_COUNT = 8;

/**
 * Port of upstream `EToughSmoke::Process` cadence.
 * Role: Defines the fixed delay between tough-smoke frame advances.
 * Upstream: etoughsmoke.cpp:54
 */
export const TOUGH_SMOKE_PROCESS_INTERVAL_SECONDS = 0.12;

/**
 * Port of upstream `EToughSmoke` image state.
 * Role: Stores tough-smoke frame asset paths and initialization status.
 * Upstream: etoughsmoke.cpp:32-44
 */
export type ToughSmokeInitState = {
  renderImages: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `EToughSmoke` construction arguments.
 * Role: Describes a tough-smoke effect spawned along a tough rocket trail.
 * Upstream: etoughrocket.cpp:130
 */
export type ToughSmokeEffectSpawn<TTime = unknown> = {
  ztime: TTime;
  x: number;
  y: number;
};

/**
 * Port of upstream `EToughSmoke::Process` mutable fields.
 * Role: Captures tough-smoke lifetime, frame index, and next animation tick.
 * Upstream: etoughsmoke.cpp:46-61
 */
export type ToughSmokeProcessState = {
  killMe: boolean;
  renderIndex: number;
  nextProcessTime: number;
};

/**
 * Port of upstream `EToughSmoke::Init`.
 * Role: Initializes tough-smoke frame asset paths.
 * Upstream: etoughsmoke.cpp:32-44
 */
export function initToughSmokeEffect(state: ToughSmokeInitState): void {
  state.renderImages = Array.from(
    { length: TOUGH_SMOKE_FRAME_COUNT },
    (_value, index) =>
      `assets/units/robots/tough/smoke_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `EToughSmoke::Process`.
 * Role: Advances tough-smoke frames and expires the effect after the last frame.
 * Upstream: etoughsmoke.cpp:46-61
 */
export function processToughSmokeEffect(
  state: ToughSmokeProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextProcessTime) {
    state.nextProcessTime =
      currentTime + TOUGH_SMOKE_PROCESS_INTERVAL_SECONDS;

    state.renderIndex += 1;
    if (state.renderIndex >= TOUGH_SMOKE_FRAME_COUNT) state.killMe = true;
  }
}
