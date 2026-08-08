/**
 * Upstream: elightinitfire.h
 */

/**
 * Port of upstream `_ELIGHTINITFIRE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: elightinitfire.h:2
 */
export const ELIGHT_INIT_FIRE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ELightInitFire` render frame count.
 * Role: Defines how many light-tank muzzle-flash frames are loaded.
 * Upstream: elightinitfire.cpp:29-33
 */
export const LIGHT_INIT_FIRE_FRAME_COUNT = 4;

/**
 * Port of upstream `ELightInitFire::Process` interval.
 * Role: Defines the short lifetime update interval before the effect is killed.
 * Upstream: elightinitfire.cpp:44-48
 */
export const LIGHT_INIT_FIRE_PROCESS_INTERVAL_SECONDS = 0.02;

/**
 * Port of upstream `ELightInitFire` image state.
 * Role: Stores light-tank muzzle-flash frame asset paths and initialization status.
 * Upstream: elightinitfire.cpp:24-36
 */
export type LightInitFireInitState = {
  renderImages: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `ELightInitFire` process state.
 * Role: Stores effect lifetime state for the one-shot light-tank muzzle flash.
 * Upstream: elightinitfire.cpp:38-50
 */
export type LightInitFireProcessState = {
  killMe: boolean;
  nextProcessTime: number;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a map-relative render command for the muzzle-flash frame.
 * Upstream: elightinitfire.cpp:58
 */
export type LightInitFireRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ELightInitFire::DoRender`.
 * Role: Holds the muzzle-flash frame selection and visibility state.
 * Upstream: elightinitfire.cpp:52-61
 */
export type LightInitFireRenderState<TSurface> = {
  killMe: boolean;
  x: number;
  y: number;
  renderIndex: number;
  renderImages: readonly TSurface[];
};

/**
 * Port of upstream `ELightInitFire::Init`.
 * Role: Initializes light-tank muzzle-flash frame asset paths.
 * Upstream: elightinitfire.cpp:24-36
 */
export function initLightInitFireEffect(state: LightInitFireInitState): void {
  state.renderImages = Array.from(
    { length: LIGHT_INIT_FIRE_FRAME_COUNT },
    (_value, index) =>
      `assets/units/vehicles/light/initfire_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `ELightInitFire::Process`.
 * Role: Kills the one-shot muzzle flash once its next process time is reached.
 * Upstream: elightinitfire.cpp:38-50
 */
export function processLightInitFireEffect(
  state: LightInitFireProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextProcessTime) {
    state.nextProcessTime =
      currentTime + LIGHT_INIT_FIRE_PROCESS_INTERVAL_SECONDS;
    state.killMe = true;
  }
}

/**
 * Replacement for upstream `ELightInitFire::DoRender`.
 * Role: Builds the map-relative light-tank muzzle-flash render command.
 * Upstream: elightinitfire.cpp:52-61
 */
export function renderLightInitFireEffect<TSurface, TCommand>(
  state: LightInitFireRenderState<TSurface>,
  zmap: LightInitFireRenderMap<TSurface, TCommand>,
): TCommand | null {
  if (state.killMe) return null;

  const surface = state.renderImages[state.renderIndex];
  if (!surface) return null;

  return zmap.renderZSurface(surface, state.x, state.y, false, false);
}
