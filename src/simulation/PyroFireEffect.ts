/**
 * Upstream: epyrofire.h
 */

/**
 * Port of upstream `_EPYROFIRE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: epyrofire.h:2
 */
export const EPYRO_FIRE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `pyro_fire_max`.
 * Role: Defines how many frames exist for each pyro fire animation variant.
 * Upstream: epyrofire.cpp:5
 */
export const PYRO_FIRE_FRAME_COUNTS = [4, 4, 4, 6, 6] as const;

/**
 * Port of upstream `EPyroFire::Process` cadence.
 * Role: Defines the fixed delay between pyro fire frame advances.
 * Upstream: epyrofire.cpp:55
 */
export const PYRO_FIRE_PROCESS_INTERVAL_SECONDS = 0.06;

/**
 * Port of upstream `EPyroFire` image state.
 * Role: Stores pyro fire frame asset paths and initialization status.
 * Upstream: epyrofire.cpp:32-45
 */
export type PyroFireInitState = {
  fireImages: string[][];
  finishedInit: boolean;
};

/**
 * Port of upstream `EPyroFire::Process` mutable fields.
 * Role: Captures lifetime, animation variant, frame index, and next tick time.
 * Upstream: epyrofire.cpp:47-62
 */
export type PyroFireProcessState = {
  killMe: boolean;
  fireIndex: number;
  fireFrame: number;
  nextProcessTime: number;
};

/**
 * Port of upstream `EPyroFire::Init`.
 * Role: Initializes pyro fire frame asset paths.
 * Upstream: epyrofire.cpp:32-45
 */
export function initPyroFireEffect(state: PyroFireInitState): void {
  state.fireImages = PYRO_FIRE_FRAME_COUNTS.map((frameCount, fireIndex) =>
    Array.from(
      { length: frameCount },
      (_value, frameIndex) =>
        `assets/other/fire/fire${fireIndex}_n${frameIndex.toString().padStart(2, "0")}.png`,
    ),
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `EPyroFire::Process`.
 * Role: Advances the selected pyro fire animation and expires it after its last frame.
 * Upstream: epyrofire.cpp:47-62
 */
export function processPyroFireEffect(
  state: PyroFireProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextProcessTime) {
    state.nextProcessTime =
      currentTime + PYRO_FIRE_PROCESS_INTERVAL_SECONDS;

    state.fireFrame += 1;
    const frameCount = PYRO_FIRE_FRAME_COUNTS[state.fireIndex];
    if (frameCount !== undefined && state.fireFrame >= frameCount) {
      state.killMe = true;
    }
  }
}
