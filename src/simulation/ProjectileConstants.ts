/**
 * Ported from Zod Engine.
 * Upstream: ebullet.h / ebullet.cpp / eflame.h / eflame.cpp / elaser.h / zdamagemissile.h
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Adaptation of upstream `_EBULLET_H_`.
 * Role: Marks the TypeScript module boundary for upstream `ebullet.h`.
 * Ledger: MAC-F13D4D
 * Upstream: ebullet.h:2
 */
export const EBULLET_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `_EFLAME_H_`.
 * Role: Marks the TypeScript module boundary for upstream `eflame.h`.
 * Ledger: MAC-75F0F6
 * Upstream: eflame.h:2
 */
export const EFLAME_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `_ELASER_H_`.
 * Role: Marks the TypeScript module boundary for upstream `elaser.h`.
 * Ledger: MAC-58E0D5
 * Upstream: elaser.h:2
 */
export const ELASER_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `_ZDAMGEMISSILE_H_`.
 * Role: Marks the TypeScript module boundary for the future `damage_missile` port.
 * Ledger: MAC-05F94B
 * Upstream: zdamagemissile.h:2
 */
export const ZDAMAGE_MISSILE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `bullet_speed`.
 * Role: Defines the movement speed used by bullet projectiles.
 * Ledger: CON-45BACE
 * Upstream: ebullet.cpp:7
 */
export const BULLET_SPEED = 300;

/**
 * Port of upstream `bullet_speed` from `eflame.cpp`.
 * Role: Defines the movement speed used by flame projectiles.
 * Ledger: CON-7196C6
 * Upstream: eflame.cpp:10
 * Notes: Uses a flame-specific export name because upstream also declares a local `bullet_speed` constant in `ebullet.cpp`.
 */
export const FLAME_PROJECTILE_SPEED = 300;

/**
 * Port of upstream `bullet_speed` from `elaser.cpp`.
 * Role: Defines the movement speed used by laser projectiles.
 * Ledger: CON-834886
 * Upstream: elaser.cpp:9
 * Notes: Uses a laser-specific export name because upstream declares multiple local `bullet_speed` constants across projectile effect files.
 */
export const LASER_PROJECTILE_SPEED = 300;

/**
 * Minimal cannon settings contract needed by missile cannon rocket effects.
 * Role: Describes the upstream `zsettings->cannon_settings` access used by `EMissileCRockets` without porting the broader settings subsystem.
 */
export type MissileCannonRocketSettings = {
  cannonSettings: ReadonlyArray<{
    attackMissileSpeed: number;
  }>;
};

/**
 * Minimal vehicle settings contract needed by mobile missile rocket effects.
 * Role: Describes the upstream `zsettings->vehicle_settings` access used by `EMoMissileRockets` without porting the broader settings subsystem.
 */
export type MobileMissileRocketSettings = {
  vehicleSettings: ReadonlyArray<{
    attackMissileSpeed: number;
  }>;
};

/**
 * Port of upstream `bullet_speed` from `emissilecrockets.cpp`.
 * Role: Resolves the missile cannon rocket speed from the missile cannon entry in cannon settings.
 * Ledger: CON-3224D8
 * Upstream: emissilecrockets.cpp:12
 * Notes: Upstream reads `zsettings->cannon_settings[MISSILE_CANNON]`. * - The missile cannon index is injected here until cannon type IDs are ported.
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
 * Notes: Upstream reads `zsettings->vehicle_settings[MISSILE_LAUNCHER]`. * - The missile launcher index is injected here until vehicle type IDs are ported.
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
