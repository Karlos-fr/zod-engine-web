/**
 * Upstream: zcannon.h, cmissilecannon.h / cmissilecannon.cpp
 */

import { GameEntity } from "./GameEntity";

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
