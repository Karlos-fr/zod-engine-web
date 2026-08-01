/**
 * Upstream: eturrentmissile.h
 */

/**
 * Port of upstream `_ETURRENTMISSILE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: eturrentmissile.h:2
 */
export const ETURRET_MISSILE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `eturrent_missile`.
 * Role: Identifies the turret missile effect sprite set.
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

/**
 * Port of upstream `ETurrentMissile` construction arguments.
 * Role: Describes a turret missile effect spawned by a combat unit.
 * Upstream: eturrentmissile.h:17-39
 */
export type TurretMissileEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  offsetTime: number;
  type: TurretMissileEffectType;
  owner?: number;
};
