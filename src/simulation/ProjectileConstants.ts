/**
 * Upstream: ebullet.h / ebullet.cpp / eflame.h / eflame.cpp / elaser.h / zdamagemissile.h
 */

/**
 * Port of upstream `_EBULLET_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ebullet.h:2
 */
export const EBULLET_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_EFLAME_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: eflame.h:2
 */
export const EFLAME_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ELASER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: elaser.h:2
 */
export const ELASER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZDAMGEMISSILE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zdamagemissile.h:2
 */
export const ZDAMAGE_MISSILE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `bullet_speed`.
 * Role: Defines the movement speed for bullet projectiles.
 * Upstream: ebullet.cpp:7
 */
export const BULLET_SPEED = 300;

/**
 * Port of upstream `bullet_speed` from `eflame.cpp`.
 * Role: Defines the movement speed for flame projectiles.
 * Upstream: eflame.cpp:10
 */
export const FLAME_PROJECTILE_SPEED = 300;

/**
 * Port of upstream `bullet_speed` from `elaser.cpp`.
 * Role: Defines the movement speed for laser projectiles.
 * Upstream: elaser.cpp:9
 */
export const LASER_PROJECTILE_SPEED = 300;

/**
 * Cannon settings shape for missile speed lookup.
 * Role: Exposes cannon missile speed entries.
 */
export type MissileCannonRocketSettings = {
  cannonSettings: ReadonlyArray<{
    attackMissileSpeed: number;
  }>;
};

/**
 * Vehicle settings shape for missile speed lookup.
 * Role: Exposes vehicle missile speed entries.
 */
export type MobileMissileRocketSettings = {
  vehicleSettings: ReadonlyArray<{
    attackMissileSpeed: number;
  }>;
};

/**
 * Port of upstream `damage_missile` timing fields.
 * Role: Stores missile position and computed explosion time.
 * Upstream: zdamagemissile.h:23-33
 */
export type DamageMissileTimingState = {
  x: number;
  y: number;
  explodeTime: number;
};

/**
 * Port of upstream `CalcExplodeTimeTo`.
 * Role: Computes when a damage missile reaches a source point at the given speed.
 * Upstream: zdamagemissile.h:23-33
 */
export function calcDamageMissileExplodeTimeTo(
  state: DamageMissileTimingState,
  sx: number,
  sy: number,
  missileSpeed: number,
  theTime: number,
): void {
  const dx = state.x - sx;
  const dy = state.y - sy;
  const mag = Math.sqrt(dx * dx + dy * dy);

  state.explodeTime = theTime + mag / missileSpeed;
}

/**
 * Port of upstream `bullet_speed` from `emissilecrockets.cpp`.
 * Role: Resolves the missile cannon rocket speed from the missile cannon entry in cannon settings.
 * Upstream: emissilecrockets.cpp:12
 */
export function resolveMissileCannonRocketSpeed(
  settings: MissileCannonRocketSettings,
  missileCannonIndex: number,
): number {
  const cannonSettings = settings.cannonSettings[missileCannonIndex];
  if (!cannonSettings) {
    throw new RangeError(`Missing cannon settings for index ${missileCannonIndex}`);
  }
  return cannonSettings.attackMissileSpeed;
}

/**
 * Port of upstream `time_d`.
 * Role: Calculates the first missile cannon rocket timing threshold.
 * Upstream: emissilecrockets.cpp:145
 */
export function calcMissileCannonRocketTimeD(bulletSpeed: number): number {
  return 6.0 / bulletSpeed;
}

/**
 * Port of upstream `time_d2`.
 * Role: Calculates the second missile cannon rocket timing threshold.
 * Upstream: emissilecrockets.cpp:146
 */
export function calcMissileCannonRocketTimeD2(bulletSpeed: number): number {
  return 8.0 / bulletSpeed;
}

/**
 * Port of upstream `bullet_speed` from `emomissilerockets.cpp`.
 * Role: Resolves the mobile missile launcher rocket speed from the missile launcher entry in vehicle settings.
 * Upstream: emomissilerockets.cpp:12
 */
export function resolveMobileMissileRocketSpeed(
  settings: MobileMissileRocketSettings,
  missileLauncherIndex: number,
): number {
  const vehicleSettings = settings.vehicleSettings[missileLauncherIndex];
  if (!vehicleSettings) {
    throw new RangeError(`Missing vehicle settings for index ${missileLauncherIndex}`);
  }
  return vehicleSettings.attackMissileSpeed;
}

/**
 * Port of upstream `time_d`.
 * Role: Calculates the first mobile missile rocket timing threshold.
 * Upstream: emomissilerockets.cpp:154
 */
export function calcMobileMissileRocketTimeD(bulletSpeed: number): number {
  return 6.0 / bulletSpeed;
}

/**
 * Port of upstream `time_d2`.
 * Role: Calculates the second mobile missile rocket timing threshold.
 * Upstream: emomissilerockets.cpp:155
 */
export function calcMobileMissileRocketTimeD2(bulletSpeed: number): number {
  return 8.0 / bulletSpeed;
}
