/**
 * Upstream: etankoil.h / etankoil.cpp
 */

/**
 * Port of upstream `_ETANKOIL_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etankoil.h:2
 */
export const ETANK_OIL_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETankOil` sprite variant count.
 * Role: Defines the number of tank-oil direction/shape variants.
 * Upstream: etankoil.cpp:30-35
 */
export const TANK_OIL_VARIANT_COUNT = 3;

/**
 * Port of upstream `ETankOil` sprite frame count per variant.
 * Role: Defines how many frames are loaded for each oil variant.
 * Upstream: etankoil.cpp:30-35
 */
export const TANK_OIL_FRAME_COUNT = 3;

/**
 * Port of upstream `ETANKOIL_TIME`.
 * Role: Defines the lifetime duration for tank oil effects.
 * Upstream: etankoil.cpp:6
 */
export const TANK_OIL_LIFETIME_SECONDS = 3.0;

/**
 * Port of upstream `ETankOil::Process` random delay step.
 * Role: Converts `rand()%10` into tenths of a second added to the lifetime.
 * Upstream: etankoil.cpp:48
 */
export const TANK_OIL_RANDOM_DELAY_STEP_SECONDS = 0.1;

/**
 * Port of upstream `ETankOil` image state.
 * Role: Stores tank-oil frame asset paths and initialization status.
 * Upstream: etankoil.cpp:26-38
 */
export type TankOilInitState = {
  tankOilFrames: string[][];
  finishedInit: boolean;
};

/**
 * Port of upstream `ETankOil::Process` mutable fields.
 * Role: Captures tank-oil lifetime, frame index, and next animation tick.
 * Upstream: etankoil.cpp:40-58
 */
export type TankOilProcessState = {
  killMe: boolean;
  frameIndex: number;
  nextFrameTime: number;
};

/**
 * Port of upstream `ETankOil::Init`.
 * Role: Initializes tank-oil frame asset paths.
 * Upstream: etankoil.cpp:26-38
 */
export function initTankOilEffect(state: TankOilInitState): void {
  state.tankOilFrames = Array.from(
    { length: TANK_OIL_VARIANT_COUNT },
    (_variantValue, variantIndex) =>
      Array.from(
        { length: TANK_OIL_FRAME_COUNT },
        (_frameValue, frameIndex) =>
          `assets/units/vehicles/tank_oil_${variantIndex}_n${frameIndex.toString().padStart(2, "0")}.png`,
      ),
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `ETankOil::Process`.
 * Role: Advances tank-oil frames with the upstream randomized delay and expires after the last frame.
 * Upstream: etankoil.cpp:40-58
 */
export function processTankOilEffect(
  state: TankOilProcessState,
  currentTime: number,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextFrameTime) {
    state.nextFrameTime =
      currentTime +
      TANK_OIL_LIFETIME_SECONDS +
      randomInt(10) * TANK_OIL_RANDOM_DELAY_STEP_SECONDS;

    state.frameIndex += 1;

    if (state.frameIndex >= TANK_OIL_FRAME_COUNT) {
      state.frameIndex = 0;
      state.killMe = true;
    }
  }
}
