/**
 * Upstream: etankspark.h / etankspark.cpp
 */

import type { MapSurfaceRenderCommand } from "../world/GameMap";

/**
 * Port of upstream `_ETANKSPARK_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etankspark.h:2
 */
export const ETANK_SPARK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETankSpark` sprite frame count.
 * Role: Defines how many ground-spark frames are loaded during initialization.
 * Upstream: etankspark.cpp:31-35
 */
export const TANK_SPARK_FRAME_COUNT = 6;

/**
 * Port of upstream `ETANKSPARK_TIME`.
 * Role: Defines the frame advance delay for tank spark animation effects.
 * Upstream: etankspark.cpp:6
 */
export const TANK_SPARK_FRAME_INTERVAL_SECONDS = 0.1;

/**
 * Port of upstream `ETankSpark` image state.
 * Role: Stores loaded ground-spark frame asset paths and initialization status.
 * Upstream: etankspark.cpp:27-38
 */
export type TankSparkInitState = {
  tankSparkFrames: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `ETankSpark::Process` mutable fields.
 * Role: Captures tank spark lifetime, frame index, and next animation tick.
 * Upstream: etankspark.cpp:40-56
 */
export type TankSparkProcessState = {
  killMe: boolean;
  frameIndex: number;
  frameIteration: number;
  maxFrameIterations: number;
  nextFrameTime: number;
};

export type TankSparkPreRenderState<TSurface> = {
  killMe: boolean;
  tankSparkFrames: readonly TSurface[];
  frameIndex: number;
  centerX: number;
  centerY: number;
};

/**
 * Port of upstream `ETankSpark::Init`.
 * Role: Initializes ground-spark frame asset paths.
 * Upstream: etankspark.cpp:27-38
 */
export function initTankSparkEffect(state: TankSparkInitState): void {
  state.tankSparkFrames = Array.from(
    { length: TANK_SPARK_FRAME_COUNT },
    (_value, index) =>
      `assets/units/vehicles/ground_spark_n${index.toString().padStart(2, "0")}.png`,
  );

  state.finishedInit = true;
}

/**
 * Port of upstream `ETankSpark::Process`.
 * Role: Advances ground-spark frames and expires the effect after its iteration cap.
 * Upstream: etankspark.cpp:40-56
 */
export function processTankSparkEffect(
  state: TankSparkProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextFrameTime) {
    state.nextFrameTime = currentTime + TANK_SPARK_FRAME_INTERVAL_SECONDS;

    state.frameIndex += 1;
    state.frameIteration += 1;

    if (state.frameIndex >= TANK_SPARK_FRAME_COUNT) state.frameIndex = 0;
    if (state.frameIteration >= state.maxFrameIterations) state.killMe = true;
  }
}

/**
 * Replacement for upstream `ETankSpark::DoPreRender`.
 * Role: Builds the centered map render command for the current tank-spark frame.
 * Upstream: etankspark.cpp:58-69
 */
export function doPreRenderTankSparkEffect<TSurface>(
  state: TankSparkPreRenderState<TSurface>,
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

  const surface = state.tankSparkFrames[state.frameIndex];
  if (surface === undefined) return null;

  return zmap.renderZSurface(
    surface,
    state.centerX,
    state.centerY,
    false,
    true,
  );
}
