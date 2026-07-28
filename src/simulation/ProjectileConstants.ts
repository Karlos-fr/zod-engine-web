/**
 * Ported from Zod Engine.
 * Upstream: ebullet.h / ebullet.cpp / eflame.h / eflame.cpp / elaser.h / zdamagemissile.h
 */

/**
 * Port of upstream `_EBULLET_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-F13D4D
 * Upstream: ebullet.h:2
 */
export const EBULLET_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_EFLAME_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-75F0F6
 * Upstream: eflame.h:2
 */
export const EFLAME_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ELASER_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-58E0D5
 * Upstream: elaser.h:2
 */
export const ELASER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZDAMGEMISSILE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-05F94B
 * Upstream: zdamagemissile.h:2
 */
export const ZDAMAGE_MISSILE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `bullet_speed`.
 * Role: Defines the movement speed for bullet projectiles.
 * Ledger: CON-45BACE
 * Upstream: ebullet.cpp:7
 */
export const BULLET_SPEED = 300;

/**
 * Port of upstream `bullet_speed` from `eflame.cpp`.
 * Role: Defines the movement speed for flame projectiles.
 * Ledger: CON-7196C6
 * Upstream: eflame.cpp:10
 */
export const FLAME_PROJECTILE_SPEED = 300;

/**
 * Port of upstream `bullet_speed` from `elaser.cpp`.
 * Role: Defines the movement speed for laser projectiles.
 * Ledger: CON-834886
 * Upstream: elaser.cpp:9
 */
export const LASER_PROJECTILE_SPEED = 300;

/**
 * Minimal cannon settings contract needed by missile cannon rocket effects.
 * Role: Provides missile speed settings for cannon rocket effects.
 */
export type MissileCannonRocketSettings = {
  cannonSettings: ReadonlyArray<{
    attackMissileSpeed: number;
  }>;
};

/**
 * Minimal vehicle settings contract needed by mobile missile rocket effects.
 * Role: Provides missile speed settings for mobile rocket effects.
 */
export type MobileMissileRocketSettings = {
  vehicleSettings: ReadonlyArray<{
    attackMissileSpeed: number;
  }>;
};

/**
 * Port of upstream `damage_missile` timing fields.
 * Role: Stores missile position and computed explosion time.
 * Ledger: FUN-F938E4
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
 * Ledger: FUN-F938E4
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
 * Ledger: CON-3224D8
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
 * Port of upstream `bullet_speed` from `emomissilerockets.cpp`.
 * Role: Resolves the mobile missile launcher rocket speed from the missile launcher entry in vehicle settings.
 * Ledger: CON-055B1A
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
