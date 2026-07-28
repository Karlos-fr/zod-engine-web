/**
 * Ported from Zod Engine.
 * Upstream: eturrentmissile.h
 */

/**
 * Port of upstream `_ETURRENTMISSILE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-132963
 * Upstream: eturrentmissile.h:2
 */
export const ETURRET_MISSILE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `eturrent_missile`.
 * Role: Identifies the turret missile effect sprite set.
 * Ledger: ENU-1893F9
 * Upstream: eturrentmissile.h:6-15
 */
export enum TurretMissileEffectType {
  Light = 0,
  Medium = 1,
  Heavy = 2,
  Gatling = 3,
  Gun = 4,
  Howitzer = 5,
  MissileCannon = 6,
  BuildingPiece0 = 7,
  BuildingPiece1 = 8,
  FortBuildingPiece0 = 9,
  FortBuildingPiece1 = 10,
  FortBuildingPiece2 = 11,
  FortBuildingPiece3 = 12,
  FortBuildingPiece4 = 13,
  Grenade = 14,
}
