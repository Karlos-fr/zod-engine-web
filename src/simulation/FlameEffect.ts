/**
 * Upstream: eflame.cpp
 */
import type { PyroFireEffectSpawn } from "./PyroFireEffect";

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
 * Port of upstream `EFlame::Process` mutable fields.
 * Role: Tracks flame projectile movement, lifetime, and pyro-fire spawn endpoint.
 * Upstream: eflame.cpp:73-87
 */
export type FlameProcessState<TTime = unknown> = {
  ztime: TTime;
  killMe: boolean;
  x: number;
  y: number;
  startX: number;
  startY: number;
  directionX: number;
  directionY: number;
  initTime: number;
  finalTime: number;
  endX: number;
  endY: number;
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

/**
 * Port of upstream `EFlame::Process`.
 * Role: Moves the flame projectile until expiry, then spawns pyro fire at the endpoint.
 * Upstream: eflame.cpp:71-89
 */
export function processFlameEffect<TTime>(
  state: FlameProcessState<TTime>,
  currentTime: number,
  effectList: PyroFireEffectSpawn<TTime>[] | null,
): void {
  if (state.killMe) return;

  if (currentTime >= state.finalTime) {
    state.killMe = true;
    effectList?.push({
      ztime: state.ztime,
      x: state.endX,
      y: state.endY,
    });
    return;
  }

  state.x = state.startX + state.directionX * (currentTime - state.initTime);
  state.y = state.startY + state.directionY * (currentTime - state.initTime);
}
