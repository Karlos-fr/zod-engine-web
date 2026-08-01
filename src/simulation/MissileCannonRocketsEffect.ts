/**
 * Upstream: emissilecrockets.h
 */
import {
  calcMissileCannonRocketTimeD,
  calcMissileCannonRocketTimeD2,
} from "./ProjectileConstants";
import type { ToughSmokeEffectSpawn } from "./ToughSmokeEffect";

/**
 * Port of upstream `_EMISSILECROCKETS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: emissilecrockets.h:2
 */
export const EMISSILE_C_ROCKETS_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `EMissileCRockets::Init`.
 * Role: Holds the missile-cannon bullet image path and initialization flag.
 * Upstream: emissilecrockets.cpp:61-69
 */
export type MissileCannonRocketsInitState = {
  bulletImage: string | null;
  finishedInit: boolean;
};

/**
 * Port of upstream `EMissileCRockets` construction arguments.
 * Role: Describes one spawned missile-cannon rocket effect.
 * Upstream: emissilecrockets.h:13-30
 */
export type MissileCannonRocketsEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
};

/**
 * Port of upstream `EMissileCRockets::PlaceSmoke` mutable fields.
 * Role: Tracks missile-cannon rocket path timing, last smoke time, and paired smoke offset.
 * Upstream: emissilecrockets.cpp:148-157
 */
export type MissileCannonRocketSmokePlacementState<TTime = unknown> = {
  ztime: TTime;
  startX: number;
  startY: number;
  directionX: number;
  directionY: number;
  initTime: number;
  lastSmokeTime: number;
  otherXShift: number;
  otherYShift: number;
};

/**
 * Port of upstream `EMissileCRockets::Init`.
 * Role: Initializes the missile-cannon bullet image path.
 * Upstream: emissilecrockets.cpp:61-69
 */
export function initMissileCannonRocketsEffect(
  state: MissileCannonRocketsInitState,
): void {
  state.bulletImage = "assets/units/cannons/missile_cannon/bullet.png";
  state.finishedInit = true;
}

/**
 * Port of upstream `EMissileCRockets::PlaceSmoke`.
 * Role: Spawns paired tough-smoke trail effects at fixed intervals behind the missile cannon rocket.
 * Upstream: emissilecrockets.cpp:141-159
 */
export function placeMissileCannonRocketSmoke<TTime>(
  state: MissileCannonRocketSmokePlacementState<TTime>,
  currentTime: number,
  bulletSpeed: number,
  effectList: ToughSmokeEffectSpawn<TTime>[] | null,
): void {
  const timeD = calcMissileCannonRocketTimeD(bulletSpeed);
  const timeD2 = calcMissileCannonRocketTimeD2(bulletSpeed);

  while (currentTime - state.lastSmokeTime > timeD2) {
    const smokeTime = state.lastSmokeTime - timeD - state.initTime;
    const smokeX = state.startX + state.directionX * smokeTime;
    const smokeY = state.startY + state.directionY * smokeTime;

    effectList?.push({ ztime: state.ztime, x: smokeX, y: smokeY });
    effectList?.push({
      ztime: state.ztime,
      x: smokeX + state.otherXShift,
      y: smokeY + state.otherYShift,
    });

    state.lastSmokeTime += timeD2;
  }
}
