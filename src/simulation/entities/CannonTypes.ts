/**
 * Upstream: zcannon.h, cmissilecannon.h / cmissilecannon.cpp
 */

import { GameEntity } from "./GameEntity";
import type { ZSettings } from "../../data/ZSettingsData";
import {
  CannonDeathObject,
  type CannonDeathEffectSpawn,
} from "../CannonDeathEffect";
import type { LightRocketEffectSpawn } from "../LightRocketEffect";
import { MAX_UNIT_HEALTH, RobotType, TeamType } from "../SimulationConstants";
import { SoundEngineSound } from "../../audio/AudioService";
import type { VehicleRestrictedSoundCommand } from "./VehicleEntity";

/**
 * Port of upstream `_CGATLING_H_`.
 * Role: Marks that the CGatling header boundary has been adapted to this module.
 * Upstream: cgatling.h:2
 */
export const CGATLING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CGUN_H_`.
 * Role: Marks that the CGun header boundary has been adapted to this module.
 * Upstream: cgun.h:2
 */
export const CGUN_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CHOWITZER_H_`.
 * Role: Marks that the CHowitzer header boundary has been adapted to this module.
 * Upstream: chowitzer.h:2
 */
export const CHOWITZER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CMISSILECANNON_H_`.
 * Role: Marks that the CMissileCannon header boundary has been adapted to this module.
 * Upstream: cmissilecannon.h:2
 */
export const CMISSILECANNON_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZCANNON_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zcannon.h:2
 */
export const ZCANNON_HEADER_GUARD_PORTED = true;

export type CannonPlacementImage = {
  loadBaseImage(filename: string): void;
};

/**
 * Port of upstream `ZCannon::Init`.
 * Role: Loads the cannon placement marker images.
 * Upstream: zcannon.cpp:18-29
 */
export function initCannonPlacementImages(
  placementImages: readonly CannonPlacementImage[],
): void {
  for (let i = 0; i < 3; i += 1) {
    placementImages[i]?.loadBaseImage(
      `assets/units/cannons/init-place_n${i.toString().padStart(2, "0")}.png`,
    );
  }
}

/**
 * Port of upstream `ZCannon::CanSetWaypoints`.
 * Role: Reports that cannon entities can receive waypoint orders.
 * Upstream: zcannon.h:16
 */
export function canCannonSetWaypoints(): boolean {
  return true;
}

/**
 * Browser simulation entity containing the subset of `ZCannon` behavior already ported.
 * Role: Owns cannon-specific driver ejection and sniper vulnerability state.
 * Upstream: zcannon.h
 */
export class CannonEntity extends GameEntity {
  ejectableCannon = true;

  /**
   * Port of upstream `ZCannon::CanBeSniped`.
   * Role: Reports whether this cannon has a snipeable driver and can eject it.
   * Upstream: zcannon.cpp:46-49
   */
  override canBeSniped(): boolean {
    return this.canBeSnipedFlag && this.driverInfo.length > 0 && this.ejectableCannon;
  }

  /**
   * Port of upstream `ZCannon::SetAttackObject`.
   * Role: Stores the attack target and faces the cannon toward the target center.
   * Upstream: zcannon.cpp:31-44
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) return;

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }

  /**
   * Port of upstream `ZCannon::CanEjectDrivers`.
   * Role: Reports whether this cannon can eject its driver.
   * Upstream: zcannon.cpp:51-55
   */
  override canEjectDrivers(): boolean {
    return this.ejectableCannon;
  }

  /**
   * Port of upstream `ZCannon::SetInitialDrivers`.
   * Role: Initializes cannon driver state from ownership and grunt health settings.
   * Upstream: zcannon.cpp:57-70
   */
  override setInitialDrivers(zsettings?: ZSettings): void {
    this.driverType = RobotType.Grunt;

    if (this.owner === TeamType.Null) {
      this.clearDrivers();
      return;
    }

    if (!zsettings) {
      this.clearDrivers();
      return;
    }

    this.addDriver(zsettings.robotSettings[RobotType.Grunt].health * MAX_UNIT_HEALTH);
  }

  /**
   * Port of upstream `ZCannon::SetEjectableCannon`.
   * Role: Toggles whether this cannon can eject its driver.
   * Upstream: zcannon.cpp:72-75
   */
  override setEjectableCannon(ejectable: boolean): void {
    this.ejectableCannon = ejectable;
  }
}

/**
 * Browser simulation entity containing the subset of `CGatling` behavior already ported.
 * Role: Represents gatling-specific cannon attack rendering state.
 * Upstream: cgatling.h / cgatling.cpp
 */
export class GatlingCannonEntity extends CannonEntity {
  renderFire = false;

  /**
   * Port of upstream `CGatling::SetAttackObject`.
   * Role: Stores the attack target, clears fire rendering when empty, and faces the target.
   * Upstream: cgatling.cpp:245-259
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) {
      this.renderFire = false;
      return;
    }

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }
}

/**
 * Browser simulation entity containing the subset of `CHowitzer` behavior already ported.
 * Role: Represents howitzer-specific cannon attack rendering state.
 * Upstream: chowitzer.h / chowitzer.cpp
 */
export class HowitzerCannonEntity extends CannonEntity {
  renderFire = false;

  /**
   * Port of upstream `CHowitzer::SetAttackObject`.
   * Role: Stores the attack target, clears fire rendering when empty, and faces the target.
   * Upstream: chowitzer.cpp:225-239
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) {
      this.renderFire = false;
      return;
    }

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }
}

/**
 * Browser simulation entity containing the subset of `CMissileCannon` behavior already ported.
 * Role: Represents missile-cannon-specific attack rendering state.
 * Upstream: cmissilecannon.h / cmissilecannon.cpp
 */
export class MissileCannonEntity extends CannonEntity {
  renderFire = false;

  /**
   * Port of upstream `CMissileCannon::SetAttackObject`.
   * Role: Stores the attack target, clears fire rendering when empty, and faces the target.
   * Upstream: cmissilecannon.cpp:229-243
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) {
      this.renderFire = false;
      return;
    }

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }
}

export type GunCannonTurrentMissileState<TTime = unknown> = {
  ztime: TTime | null;
  position: {
    x: number;
    y: number;
  };
};

export type GatlingCannonTurrentMissileState<TTime = unknown> =
  GunCannonTurrentMissileState<TTime>;

export type HowitzerCannonTurrentMissileState<TTime = unknown> =
  GunCannonTurrentMissileState<TTime>;

export type MissileCannonTurrentMissileState<TTime = unknown> =
  GunCannonTurrentMissileState<TTime>;

const GUN_CANNON_FIRE_OFFSET_X = [20, 12, 0, -12, -20, -12, 0, 12] as const;
const GUN_CANNON_FIRE_OFFSET_Y = [0, -12, -20, -12, 0, 12, 20, 12] as const;

/**
 * Port of upstream `CGun::FireMissile`.
 * Role: Spawns a gun cannon rocket and requests its restricted fire sound.
 * Upstream: cgun.cpp:195-206
 */
export function fireGunCannonMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    direction: number;
    missileSpeed: number;
    pixelWidth: number;
    pixelHeight: number;
  },
  effectList: LightRocketEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
): void {
  const direction = Math.trunc(state.direction) & 7;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX: state.position.x + 17 + GUN_CANNON_FIRE_OFFSET_X[direction],
      startY: state.position.y + 14 + GUN_CANNON_FIRE_OFFSET_Y[direction],
      targetX,
      targetY,
      speed: state.missileSpeed,
      extraSmall: 0,
      extraLarge: 1,
      extraExtraLarge: 0,
    });
  }

  if (soundCommands) {
    soundCommands.push({
      sound: SoundEngineSound.GunFireSnd,
      x: state.position.x,
      y: state.position.y,
      width: state.pixelWidth,
      height: state.pixelHeight,
    });
  }
}

/**
 * Port of upstream `CGatling::FireTurrentMissile`.
 * Role: Spawns a gatling cannon death effect from the cannon body.
 * Upstream: cgatling.cpp:298-302
 */
export function fireGatlingCannonTurrentMissile<TTime>(
  state: GatlingCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Gatling,
  });
}

/**
 * Port of upstream `CHowitzer::FireTurrentMissile`.
 * Role: Spawns a howitzer cannon death effect from the cannon body.
 * Upstream: chowitzer.cpp:278-282
 */
export function fireHowitzerCannonTurrentMissile<TTime>(
  state: HowitzerCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Howitzer,
  });
}

/**
 * Port of upstream `CMissileCannon::FireTurrentMissile`.
 * Role: Spawns a missile cannon death effect from the cannon body.
 * Upstream: cmissilecannon.cpp:282-286
 */
export function fireMissileCannonTurrentMissile<TTime>(
  state: MissileCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Missile,
  });
}

/**
 * Port of upstream `CGatling::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: cgatling.cpp:261-267
 */
export function doGatlingCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CGun::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: cgun.cpp:208-214
 */
export function doGunCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CHowitzer::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: chowitzer.cpp:241-247
 */
export function doHowitzerCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CMissileCannon::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: cmissilecannon.cpp:245-251
 */
export function doMissileCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CGun::FireTurrentMissile`.
 * Role: Spawns a gun cannon death effect from the cannon body.
 * Upstream: cgun.cpp:245-248
 */
export function fireGunCannonTurrentMissile<TTime>(
  state: GunCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Gun,
  });
}

/**
 * Port of upstream `unit_x` from `CGatling`.
 * Role: Defines the x offset of the gatling cannon unit render source.
 * Upstream: cgatling.cpp:91, cgatling.cpp:202
 */
export const GATLING_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_x` from `CHowitzer`.
 * Role: Defines the x offset of the howitzer cannon unit render source.
 * Upstream: chowitzer.cpp:90
 */
export const HOWITZER_CANNON_UNIT_X_PIXELS = -2;

/**
 * Port of upstream `unit_y` from `CHowitzer`.
 * Role: Defines the y offset of the howitzer cannon unit render source.
 * Upstream: chowitzer.cpp:91
 */
export const HOWITZER_CANNON_UNIT_Y_PIXELS = -12;

/**
 * Port of upstream `unit_x` from `CMissileCannon`.
 * Role: Defines the x offset of the missile cannon unit render source.
 * Upstream: cmissilecannon.cpp:98
 */
export const MISSILE_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CMissileCannon`.
 * Role: Defines the y offset of the missile cannon unit render source.
 * Upstream: cmissilecannon.cpp:99
 */
export const MISSILE_CANNON_UNIT_Y_PIXELS = -8;

/**
 * Port of upstream `unit_x` from `CGun`.
 * Role: Defines the x offset of the gun cannon unit render source.
 * Upstream: cgun.cpp:84
 */
export const GUN_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CGun`.
 * Role: Defines the y offset of the gun cannon unit render source.
 * Upstream: cgun.cpp:85
 */
export const GUN_CANNON_UNIT_Y_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CGatling`.
 * Role: Defines the y offset of the gatling cannon unit render source.
 * Upstream: cgatling.cpp:92, cgatling.cpp:203
 */
export const GATLING_CANNON_UNIT_Y_PIXELS = -7;
