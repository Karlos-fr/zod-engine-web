/**
 * Upstream: etoughrocket.h
 */
import type { ToughSmokeEffectSpawn } from "./ToughSmokeEffect";

/**
 * Port of upstream `_ETOUGHROCKET_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etoughrocket.h:2
 */
export const ETOUGH_ROCKET_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EToughRocket` bullet frame count.
 * Role: Defines how many tough rocket bullet frames are loaded during initialization.
 * Upstream: etoughrocket.cpp:65-69
 */
export const TOUGH_ROCKET_BULLET_FRAME_COUNT = 2;

/**
 * Port of upstream `EToughRocket` image state.
 * Role: Stores tough rocket bullet frame asset paths and initialization status.
 * Upstream: etoughrocket.cpp:60-72
 */
export type ToughRocketInitState = {
  bulletFrames: string[];
  finishedInit: boolean;
};

/**
 * Port of upstream `EToughRocket::PlaceSmoke` mutable fields.
 * Role: Tracks rocket path timing and the last tough-smoke placement time.
 * Upstream: etoughrocket.cpp:122-130
 */
export type ToughRocketSmokePlacementState<TTime = unknown> = {
  ztime: TTime;
  startX: number;
  startY: number;
  directionX: number;
  directionY: number;
  initTime: number;
  lastSmokeTime: number;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for the tough rocket projectile.
 * Upstream: etoughrocket.cpp:106
 */
export type ToughRocketRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `EToughRocket::DoRender`.
 * Role: Holds the tough rocket projectile frames and visibility state.
 * Upstream: etoughrocket.cpp:100-113
 */
export type ToughRocketRenderState<TSurface> = {
  killMe: boolean;
  x: number;
  y: number;
  bulletIndex: number;
  bulletImages: readonly TSurface[];
};

/**
 * Port of upstream `EToughRocket::Init`.
 * Role: Initializes tough rocket bullet frame asset paths.
 * Upstream: etoughrocket.cpp:60-72
 */
export function initToughRocketEffect(state: ToughRocketInitState): void {
  state.bulletFrames = Array.from(
    { length: TOUGH_ROCKET_BULLET_FRAME_COUNT },
    (_value, index) =>
      `assets/units/robots/tough/bullet_n${index.toString().padStart(2, "0")}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `time_d`.
 * Role: Calculates the first tough rocket timing threshold.
 * Upstream: etoughrocket.cpp:118
 */
export function calcToughRocketTimeD(bulletSpeed: number): number {
  return 6.0 / bulletSpeed;
}

/**
 * Port of upstream `time_d2`.
 * Role: Calculates the second tough rocket timing threshold.
 * Upstream: etoughrocket.cpp:119
 */
export function calcToughRocketTimeD2(bulletSpeed: number): number {
  return 8.0 / bulletSpeed;
}

/**
 * Port of upstream `EToughRocket::PlaceSmoke`.
 * Role: Spawns tough-smoke trail effects at fixed distance intervals behind the rocket.
 * Upstream: etoughrocket.cpp:115-132
 */
export function placeToughRocketSmoke<TTime>(
  state: ToughRocketSmokePlacementState<TTime>,
  currentTime: number,
  bulletSpeed: number,
  effectList: ToughSmokeEffectSpawn<TTime>[],
): void {
  const timeD = calcToughRocketTimeD(bulletSpeed);
  const timeD2 = calcToughRocketTimeD2(bulletSpeed);

  while (currentTime - state.lastSmokeTime > timeD2) {
    const smokeTime = state.lastSmokeTime - timeD - state.initTime;

    effectList.push({
      ztime: state.ztime,
      x: state.startX + state.directionX * smokeTime,
      y: state.startY + state.directionY * smokeTime,
    });

    state.lastSmokeTime += timeD2;
  }
}

/**
 * Replacement for upstream `EToughRocket::DoRender`.
 * Role: Builds the centered map-relative tough rocket projectile render command.
 * Upstream: etoughrocket.cpp:100-113
 */
export function renderToughRocketEffect<TSurface, TCommand>(
  state: ToughRocketRenderState<TSurface>,
  zmap: ToughRocketRenderMap<TSurface, TCommand>,
): TCommand | null {
  if (state.killMe) return null;

  const surface = state.bulletImages[0];
  if (!surface) return null;

  const command = zmap.renderZSurface(surface, state.x, state.y, false, true);
  state.bulletIndex = 0;

  return command;
}
