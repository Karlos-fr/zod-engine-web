/**
 * Upstream: etoughmushroom.h
 */

/**
 * Port of upstream `_ETOUGHMUSHROOM_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etoughmushroom.h:2
 */
export const ETOUGH_MUSHROOM_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EToughMushroom` base image count.
 * Role: Defines how many tough mushroom frames are loaded during initialization.
 * Upstream: etoughmushroom.cpp:52-57
 */
export const TOUGH_MUSHROOM_FRAME_COUNT = 12;

/**
 * Port of upstream `EToughMushroom::Process` cadence.
 * Role: Defines the fixed delay between tough mushroom frame advances.
 * Upstream: etoughmushroom.cpp:70
 */
export const TOUGH_MUSHROOM_PROCESS_INTERVAL_SECONDS = 0.08;

/**
 * Port of upstream `EToughMushroom` image state.
 * Role: Stores tough mushroom base image asset paths and initialization status.
 * Upstream: etoughmushroom.cpp:47-60
 */
export type ToughMushroomInitState = {
  baseImages: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `EToughMushroom::Process` mutable fields.
 * Role: Captures tough mushroom lifetime, frame index, and next animation tick.
 * Upstream: etoughmushroom.cpp:62-77
 */
export type ToughMushroomProcessState = {
  killMe: boolean;
  renderIndex: number;
  nextProcessTime: number;
};

/**
 * Port of upstream `EToughMushroom::Init`.
 * Role: Initializes tough mushroom base image asset paths.
 * Upstream: etoughmushroom.cpp:47-60
 */
export function initToughMushroomEffect(
  state: ToughMushroomInitState,
): void {
  state.baseImages = Array.from(
    { length: TOUGH_MUSHROOM_FRAME_COUNT },
    (_value, index) =>
      `assets/units/robots/tough/mushroom_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `EToughMushroom::Process`.
 * Role: Advances tough mushroom frames and expires the effect after the last frame.
 * Upstream: etoughmushroom.cpp:62-77
 */
export function processToughMushroomEffect(
  state: ToughMushroomProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextProcessTime) {
    state.nextProcessTime =
      currentTime + TOUGH_MUSHROOM_PROCESS_INTERVAL_SECONDS;

    state.renderIndex += 1;
    if (state.renderIndex >= TOUGH_MUSHROOM_FRAME_COUNT) state.killMe = true;
  }
}
