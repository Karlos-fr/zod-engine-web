/**
 * Upstream: emomissilerockets.h
 */
import {
  calcMobileMissileRocketTimeD,
  calcMobileMissileRocketTimeD2,
} from "./ProjectileConstants";
import type { ToughSmokeEffectSpawn } from "./ToughSmokeEffect";

/**
 * Port of upstream `_EMOMISSILEROCKETS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: emomissilerockets.h:2
 */
export const EMO_MISSILE_ROCKETS_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `EMoMissileRockets::Init`.
 * Role: Holds the mobile-missile bullet image path and initialization flag.
 * Upstream: emomissilerockets.cpp:61-69
 */
export type MobileMissileRocketsInitState = {
  bulletImage: string | null;
  finishedInit: boolean;
};

/**
 * Port of upstream `EMoMissileRockets` construction arguments.
 * Role: Describes one spawned mobile-missile rocket effect.
 * Upstream: emomissilerockets.h:13-30
 */
export type MobileMissileRocketsEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
};

/**
 * Port of upstream `EMoMissileRockets::PlaceSmoke` mutable fields.
 * Role: Tracks mobile-missile rocket path timing, last smoke time, and paired side smoke offsets.
 * Upstream: emomissilerockets.cpp:150-170
 */
export type MobileMissileRocketSmokePlacementState<TTime = unknown> = {
  ztime: TTime;
  startX: number;
  startY: number;
  directionX: number;
  directionY: number;
  initTime: number;
  lastSmokeTime: number;
  leftXShift: number;
  leftYShift: number;
  rightXShift: number;
  rightYShift: number;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds map-relative render commands for triple mobile-missile rocket frames.
 * Upstream: emomissilerockets.cpp:137,141,145
 */
export type MobileMissileRocketsRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `EMoMissileRockets::DoRender`.
 * Role: Holds the shared rocket image, side positions, and visibility state.
 * Upstream: emomissilerockets.cpp:131-148
 */
export type MobileMissileRocketsRenderState<TSurface> = {
  killMe: boolean;
  x: number;
  y: number;
  leftX: number;
  leftY: number;
  rightX: number;
  rightY: number;
  bulletImage: TSurface | null;
};

/**
 * Port of upstream `EMoMissileRockets::Init`.
 * Role: Initializes the mobile-missile bullet image path.
 * Upstream: emomissilerockets.cpp:61-69
 */
export function initMobileMissileRocketsEffect(
  state: MobileMissileRocketsInitState,
): void {
  state.bulletImage = "assets/units/vehicles/missile_launcher/bullet.png";
  state.finishedInit = true;
}

/**
 * Port of upstream `EMoMissileRockets::PlaceSmoke`.
 * Role: Spawns triple tough-smoke trail effects at fixed intervals behind the mobile-missile rocket.
 * Upstream: emomissilerockets.cpp:150-170
 */
export function placeMobileMissileRocketSmoke<TTime>(
  state: MobileMissileRocketSmokePlacementState<TTime>,
  currentTime: number,
  bulletSpeed: number,
  effectList: ToughSmokeEffectSpawn<TTime>[] | null,
): void {
  const timeD = calcMobileMissileRocketTimeD(bulletSpeed);
  const timeD2 = calcMobileMissileRocketTimeD2(bulletSpeed);

  while (currentTime - state.lastSmokeTime > timeD2) {
    const smokeTime = state.lastSmokeTime - timeD - state.initTime;
    const smokeX = state.startX + state.directionX * smokeTime;
    const smokeY = state.startY + state.directionY * smokeTime;

    effectList?.push({ ztime: state.ztime, x: smokeX, y: smokeY });
    effectList?.push({
      ztime: state.ztime,
      x: smokeX + state.leftXShift,
      y: smokeY + state.leftYShift,
    });
    effectList?.push({
      ztime: state.ztime,
      x: smokeX + state.rightXShift,
      y: smokeY + state.rightYShift,
    });

    state.lastSmokeTime += timeD2;
  }
}

/**
 * Replacement for upstream `EMoMissileRockets::DoRender`.
 * Role: Builds centered map-relative render commands for all three mobile-missile rockets.
 * Upstream: emomissilerockets.cpp:131-148
 */
export function renderMobileMissileRocketsEffect<TSurface, TCommand>(
  state: MobileMissileRocketsRenderState<TSurface>,
  zmap: MobileMissileRocketsRenderMap<TSurface, TCommand>,
): TCommand[] {
  if (state.killMe || state.bulletImage === null) return [];

  return [
    zmap.renderZSurface(state.bulletImage, state.x, state.y, false, true),
    zmap.renderZSurface(
      state.bulletImage,
      state.leftX,
      state.leftY,
      false,
      true,
    ),
    zmap.renderZSurface(
      state.bulletImage,
      state.rightX,
      state.rightY,
      false,
      true,
    ),
  ];
}
