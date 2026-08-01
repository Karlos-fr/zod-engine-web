/**
 * Upstream: etankoil.h / etankoil.cpp
 */

import type { MapSurfaceRenderCommand } from "../world/GameMap";
import { Rotation } from "./SimulationConstants";

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

export type TankOilPreRenderState<TSurface> = {
  killMe: boolean;
  tankOilFrames: readonly (readonly TSurface[])[];
  oilIndex: number;
  frameIndex: number;
  centerX: number;
  centerY: number;
};

/**
 * Port of upstream `ETankOil::SetCoords` mutable fields.
 * Role: Stores tank-oil center coordinates and source movement direction.
 * Upstream: etankoil.cpp:73-117
 */
export type TankOilCoordsState = {
  centerX: number;
  centerY: number;
  direction: number;
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

/**
 * Replacement for upstream `ETankOil::DoPreRender`.
 * Role: Builds the centered map render command for the current tank-oil frame.
 * Upstream: etankoil.cpp:60-71
 */
export function doPreRenderTankOilEffect<TSurface>(
  state: TankOilPreRenderState<TSurface>,
  zmap: {
    renderZSurface(
      surface: TSurface,
      x: number,
      y: number,
      renderHit: boolean,
      aboutCenter: boolean,
    ): MapSurfaceRenderCommand<TSurface>;
  },
): MapSurfaceRenderCommand<TSurface> | null {
  if (state.killMe) return null;

  const surface = state.tankOilFrames[state.oilIndex]?.[state.frameIndex];
  if (surface === undefined) return null;

  return zmap.renderZSurface(
    surface,
    state.centerX,
    state.centerY,
    false,
    true,
  );
}

/**
 * Port of upstream `ETankOil::SetCoords`.
 * Role: Positions tank-oil effects behind a moving vehicle with random local jitter.
 * Upstream: etankoil.cpp:73-117
 */
export function setTankOilEffectCoords(
  state: TankOilCoordsState,
  centerX: number,
  centerY: number,
  direction: number,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  state.centerX = centerX;
  state.centerY = centerY;
  state.direction = direction;

  switch (direction) {
    case Rotation.R0:
      state.centerX -= 5;
      break;
    case Rotation.R180:
      state.centerX += 5;
      break;
    case Rotation.R90:
      state.centerY += 5;
      break;
    case Rotation.R270:
      state.centerY -= 5;
      break;
    case Rotation.R45:
      state.centerX -= 4;
      state.centerY += 4;
      break;
    case Rotation.R135:
      state.centerX += 4;
      state.centerY += 4;
      break;
    case Rotation.R225:
      state.centerX += 4;
      state.centerY -= 4;
      break;
    case Rotation.R315:
      state.centerX -= 4;
      state.centerY -= 4;
      break;
  }

  state.centerY += 5;
  state.centerX -= 3;
  state.centerY -= 3;
  state.centerX += randomInt(7);
  state.centerY += randomInt(7);
}
