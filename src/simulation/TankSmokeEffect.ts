/**
 * Upstream: etanksmoke.h / etanksmoke.cpp
 */

/**
 * Port of upstream `_ETANKSMOKE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etanksmoke.h:2
 */
export const ETANK_SMOKE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETANKSMOKE_TIME`.
 * Role: Defines the frame advance delay for tank smoke animation effects.
 * Upstream: etanksmoke.cpp:7
 */
export const TANK_SMOKE_FRAME_INTERVAL_SECONDS = 0.15;

/**
 * Port of upstream `ETankSmoke` smoke frame count.
 * Role: Defines how many smoke frames play before the effect expires.
 * Upstream: etanksmoke.cpp:34-45, etanksmoke.cpp:62-66
 */
export const TANK_SMOKE_FRAME_COUNT = 7;

/**
 * Port of upstream `ETankSmoke::Process` mutable fields.
 * Role: Captures tank-smoke lifetime, frame index, and next animation tick.
 * Upstream: etanksmoke.cpp:50-68
 */
export type TankSmokeProcessState = {
  killMe: boolean;
  frameIndex: number;
  nextFrameTime: number;
};

/**
 * Port of upstream `ETankSmoke::Process`.
 * Role: Advances tank-smoke frames on a fixed interval and expires after the last frame.
 * Upstream: etanksmoke.cpp:50-68
 */
export function processTankSmokeEffect(
  state: TankSmokeProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextFrameTime) {
    state.nextFrameTime = currentTime + TANK_SMOKE_FRAME_INTERVAL_SECONDS;
    state.frameIndex += 1;

    if (state.frameIndex >= TANK_SMOKE_FRAME_COUNT) {
      state.frameIndex = 0;
      state.killMe = true;
    }
  }
}
