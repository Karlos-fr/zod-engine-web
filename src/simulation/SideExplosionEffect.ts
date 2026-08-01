/**
 * Upstream: esideexplosion.h
 */

/**
 * Port of upstream `_ESIDEEXPLOSION_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: esideexplosion.h:2
 */
export const ESIDE_EXPLOSION_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ESideExplosion` normal sprite frame count.
 * Role: Defines how many side-explosion frames are loaded during initialization.
 * Upstream: esideexplosion.cpp:62-66
 */
export const SIDE_EXPLOSION_NORMAL_FRAME_COUNT = 7;

/**
 * Port of upstream `side_explosion_type`.
 * Role: Identifies the side explosion effect variant.
 * Upstream: esideexplosion.h:6-9
 */
export enum SideExplosionType {
  Normal = 0,
}

/**
 * Port of upstream `ESideExplosion` image state.
 * Role: Stores side-explosion frame asset paths and initialization status.
 * Upstream: esideexplosion.cpp:57-69
 */
export type SideExplosionInitState = {
  normalImages: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `ESideExplosion::Process` mutable fields.
 * Role: Tracks frame timing and linear movement for a side explosion effect.
 * Upstream: esideexplosion.cpp:71-94
 */
export type SideExplosionProcessState = {
  killme: boolean;
  renderIndex: number;
  nextRenderTime: number;
  initTime: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
};

/**
 * Port of upstream `ESideExplosion::Init`.
 * Role: Initializes side-explosion frame asset paths.
 * Upstream: esideexplosion.cpp:57-69
 */
export function initSideExplosionEffect(state: SideExplosionInitState): void {
  state.normalImages = Array.from(
    { length: SIDE_EXPLOSION_NORMAL_FRAME_COUNT },
    (_value, index) =>
      `assets/other/explosions/side_explosion_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `ESideExplosion::Process`.
 * Role: Advances side explosion animation timing and linear movement.
 * Upstream: esideexplosion.cpp:71-94
 */
export function processSideExplosionEffect(
  state: SideExplosionProcessState,
  currentTime: number,
): void {
  if (state.killme) return;

  if (currentTime >= state.nextRenderTime) {
    state.renderIndex += 1;
    if (state.renderIndex >= SIDE_EXPLOSION_NORMAL_FRAME_COUNT) {
      state.killme = true;
      return;
    }

    state.nextRenderTime = currentTime + 0.13;
  }

  state.x = state.startX + state.deltaX * (currentTime - state.initTime);
  state.y = state.startY + state.deltaY * (currentTime - state.initTime);
}
