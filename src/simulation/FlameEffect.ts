/**
 * Upstream: eflame.cpp
 */

/**
 * Port of upstream `EFlame` sprite frame count.
 * Role: Defines how many pyro flame bullet frames are loaded during initialization.
 * Upstream: eflame.cpp:62-66
 */
export const FLAME_BULLET_FRAME_COUNT = 4;

/**
 * Port of upstream `EFlame` image state.
 * Role: Stores pyro flame bullet frame asset paths and initialization status.
 * Upstream: eflame.cpp:57-69
 */
export type FlameInitState = {
  flameBulletFrames: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `EFlame::Init`.
 * Role: Initializes pyro flame bullet frame asset paths.
 * Upstream: eflame.cpp:57-69
 */
export function initFlameEffect(state: FlameInitState): void {
  state.flameBulletFrames = Array.from(
    { length: FLAME_BULLET_FRAME_COUNT },
    (_value, index) =>
      `assets/units/robots/pyro/bullet_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}
