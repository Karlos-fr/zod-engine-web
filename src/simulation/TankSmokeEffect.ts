/**
 * Upstream: etanksmoke.h / etanksmoke.cpp
 */
import { MAX_ANGLE_TYPES } from "./SimulationConstants";

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
 * Port of upstream `ETankSmoke` spark frame count.
 * Role: Defines how many spark frames are loaded for tank smoke effects.
 * Upstream: etanksmoke.h:20, etanksmoke.cpp:40-44
 */
export const TANK_SMOKE_SPARK_FRAME_COUNT = 4;

const TANK_SMOKE_ROTATION_DEGREES = [
  0,
  45,
  90,
  135,
  180,
  225,
  270,
  315,
] as const;

export type TankSmokeImageLoader<TImage> = (filename: string) => TImage;

/**
 * Port of upstream `ETankSmoke` static image state.
 * Role: Holds loaded tank smoke and spark frame images.
 * Upstream: etanksmoke.cpp:3-4, etanksmoke.cpp:37-47
 */
export type TankSmokeInitState<TImage> = {
  tankSmoke: TImage[][];
  tankSpark: TImage[][];
  finishedInit: boolean;
};

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
 * Port of upstream `ETankSmoke::Init`.
 * Role: Loads tank smoke and spark frames for every rotation bucket.
 * Upstream: etanksmoke.cpp:30-48
 */
export function initTankSmokeEffect<TImage>(
  state: TankSmokeInitState<TImage>,
  loadImage: TankSmokeImageLoader<TImage>,
): void {
  state.tankSmoke = [];
  state.tankSpark = [];

  for (let rotationIndex = 0; rotationIndex < MAX_ANGLE_TYPES; rotationIndex += 1) {
    const rotation = TANK_SMOKE_ROTATION_DEGREES[rotationIndex] ?? 0;
    state.tankSmoke[rotationIndex] = [];
    state.tankSpark[rotationIndex] = [];

    for (let frameIndex = 0; frameIndex < TANK_SMOKE_FRAME_COUNT; frameIndex += 1) {
      const frame = frameIndex.toString().padStart(2, "0");
      state.tankSmoke[rotationIndex][frameIndex] = loadImage(
        `assets/units/vehicles/track_dust_r${rotation.toString().padStart(3, "0")}_n${frame}.png`,
      );

      if (frameIndex < TANK_SMOKE_SPARK_FRAME_COUNT) {
        state.tankSpark[rotationIndex][frameIndex] = loadImage(
          `assets/units/vehicles/track_spark_r${rotation.toString().padStart(3, "0")}_n${frame}.png`,
        );
      }
    }
  }

  state.finishedInit = true;
}

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
