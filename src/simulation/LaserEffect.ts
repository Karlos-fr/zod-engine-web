/**
 * Upstream: elaser.cpp
 */

/**
 * Port of upstream `ELaser` bullet frame count.
 * Role: Defines how many laser bullet frames are loaded during initialization.
 * Upstream: elaser.cpp:55-59
 */
export const LASER_BULLET_FRAME_COUNT = 2;

/**
 * Port of upstream `ELaser` image state.
 * Role: Stores laser bullet frame asset paths and initialization status.
 * Upstream: elaser.cpp:50-62
 */
export type LaserInitState = {
  laserBulletFrames: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `ELaser` projectile movement state.
 * Role: Stores laser bullet lifetime and linear movement parameters.
 * Upstream: elaser.cpp:64-76
 */
export type LaserProcessState = {
  killMe: boolean;
  finalTime: number;
  initTime: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  dx: number;
  dy: number;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a map-relative render command for the laser projectile surface.
 * Upstream: elaser.cpp:84
 */
export type LaserRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ELaser::DoRender`.
 * Role: Holds the laser projectile surface and visibility state.
 * Upstream: elaser.cpp:78-87
 */
export type LaserRenderState<TSurface> = {
  killMe: boolean;
  x: number;
  y: number;
  bulletImage: TSurface;
};

/**
 * Port of upstream `ELaser::Init`.
 * Role: Initializes laser bullet frame asset paths.
 * Upstream: elaser.cpp:50-62
 */
export function initLaserEffect(state: LaserInitState): void {
  state.laserBulletFrames = Array.from(
    { length: LASER_BULLET_FRAME_COUNT },
    (_value, index) =>
      `assets/units/robots/laser/bullet_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `ELaser::Process`.
 * Role: Advances the laser projectile position until its final time expires.
 * Upstream: elaser.cpp:64-76
 */
export function processLaserEffect(
  state: LaserProcessState,
  currentTime: number,
): void {
  if (currentTime >= state.finalTime) {
    state.killMe = true;
    return;
  }

  state.x = state.sx + state.dx * (currentTime - state.initTime);
  state.y = state.sy + state.dy * (currentTime - state.initTime);
}

/**
 * Replacement for upstream `ELaser::DoRender`.
 * Role: Builds the map-relative laser projectile render command.
 * Upstream: elaser.cpp:78-87
 */
export function renderLaserEffect<TSurface, TCommand>(
  state: LaserRenderState<TSurface>,
  zmap: LaserRenderMap<TSurface, TCommand>,
): TCommand | null {
  if (state.killMe) return null;

  return zmap.renderZSurface(state.bulletImage, state.x, state.y, false, false);
}
