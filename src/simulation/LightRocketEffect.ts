/**
 * Upstream: elightrocket.h
 */

/**
 * Port of upstream `_ELIGHTROCKET_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: elightrocket.h:2
 */
export const ELIGHT_ROCKET_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `ELightRocket::Init`.
 * Role: Holds the light-vehicle bullet image path and initialization flag.
 * Upstream: elightrocket.cpp:59-67
 */
export type LightRocketInitState = {
  bulletImage: string | null;
  finishedInit: boolean;
};

/**
 * Port of upstream `ELightRocket` construction arguments.
 * Role: Describes one spawned light-rocket projectile effect.
 * Upstream: elightrocket.h:8
 */
export type LightRocketEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  speed: number;
  extraSmall: number;
  extraLarge: number;
  extraExtraLarge: number;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a map-relative render command for the light rocket projectile.
 * Upstream: elightrocket.cpp:146
 */
export type LightRocketRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ELightRocket::DoRender`.
 * Role: Holds the light rocket projectile image and visibility state.
 * Upstream: elightrocket.cpp:140-149
 */
export type LightRocketRenderState<TSurface> = {
  killMe: boolean;
  x: number;
  y: number;
  bulletImage: TSurface | null;
};

/**
 * Port of upstream `ELightRocket::Init`.
 * Role: Initializes the light-vehicle bullet image path.
 * Upstream: elightrocket.cpp:59-67
 */
export function initLightRocketEffect(state: LightRocketInitState): void {
  state.bulletImage = "assets/units/vehicles/light/bullet.png";
  state.finishedInit = true;
}

/**
 * Replacement for upstream `ELightRocket::DoRender`.
 * Role: Builds the map-relative light rocket projectile render command.
 * Upstream: elightrocket.cpp:140-149
 */
export function renderLightRocketEffect<TSurface, TCommand>(
  state: LightRocketRenderState<TSurface>,
  zmap: LightRocketRenderMap<TSurface, TCommand>,
): TCommand | null {
  if (state.killMe) return null;
  if (!state.bulletImage) return null;

  return zmap.renderZSurface(state.bulletImage, state.x, state.y, false, false);
}
