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

/**
 * Replacement for upstream rotozoom image state used by `ETurrentMissile::DoRender`.
 * Role: Applies the current angle and scale before turret missile debris rendering.
 * Upstream: eturrentmissile.cpp:248-249
 */
export type TurretMissileRenderImage = {
  setAngle?(angle: number): void;
  setSize?(size: number): void;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for turret missile debris.
 * Upstream: eturrentmissile.cpp:251
 */
export type TurretMissileRenderMap<TImage, TCommand> = {
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ETurrentMissile::DoRender`.
 * Role: Holds the active turret missile debris frame, transform, and visibility state.
 * Upstream: eturrentmissile.cpp:188-254
 */
export type TurretMissileRenderState<TImage> = {
  killme: boolean;
  x: number;
  y: number;
  type: TurretMissileEffectType | number;
  owner: number;
  renderIndex: number;
  angle: number;
  size: number;
  lightTurretImages: readonly (TImage | null | undefined)[];
  mediumTurretImages: readonly (TImage | null | undefined)[];
  heavyTurretImages: readonly (readonly (TImage | null | undefined)[] | null | undefined)[];
  gatlingWastedImage: TImage | null | undefined;
  gunWastedImage: TImage | null | undefined;
  howitzerWastedImage: TImage | null | undefined;
  missileWastedImage: TImage | null | undefined;
  buildingPieceImages: readonly (readonly (TImage | null | undefined)[] | null | undefined)[];
  fortBuildingPieceImages: readonly (readonly (TImage | null | undefined)[] | null | undefined)[];
  grenadeImages: readonly (TImage | null | undefined)[];
};

/**
 * Replacement for upstream `ETurrentMissile::DoRender`.
 * Role: Builds the centered turret missile debris render command.
 * Upstream: eturrentmissile.cpp:188-254
 */
export function renderTurretMissileEffect<
  TImage extends TurretMissileRenderImage,
  TCommand,
>(
  state: TurretMissileRenderState<TImage>,
  zmap: TurretMissileRenderMap<TImage, TCommand>,
): TCommand | null {
  if (state.killme) return null;

  const image = getTurretMissileRenderImage(state);
  if (!image) return null;

  image.setAngle?.(state.angle);
  image.setSize?.(state.size);

  return zmap.renderZSurface(image, state.x, state.y, false, true);
}

function getTurretMissileRenderImage<TImage>(
  state: TurretMissileRenderState<TImage>,
): TImage | null | undefined {
  switch (state.type) {
    case TurretMissileEffectType.Light:
      return state.lightTurretImages[state.renderIndex];
    case TurretMissileEffectType.Medium:
      return state.mediumTurretImages[state.renderIndex];
    case TurretMissileEffectType.Heavy:
      return state.heavyTurretImages[state.owner]?.[state.renderIndex];
    case TurretMissileEffectType.Gatling:
      return state.gatlingWastedImage;
    case TurretMissileEffectType.Gun:
      return state.gunWastedImage;
    case TurretMissileEffectType.Howitzer:
      return state.howitzerWastedImage;
    case TurretMissileEffectType.MissileCannon:
      return state.missileWastedImage;
    case TurretMissileEffectType.BuildingPiece0:
      return state.buildingPieceImages[0]?.[state.renderIndex];
    case TurretMissileEffectType.BuildingPiece1:
      return state.buildingPieceImages[1]?.[state.renderIndex];
    case TurretMissileEffectType.FortBuildingPiece0:
      return state.fortBuildingPieceImages[0]?.[state.renderIndex];
    case TurretMissileEffectType.FortBuildingPiece1:
      return state.fortBuildingPieceImages[1]?.[state.renderIndex];
    case TurretMissileEffectType.FortBuildingPiece2:
      return state.fortBuildingPieceImages[2]?.[state.renderIndex];
    case TurretMissileEffectType.FortBuildingPiece3:
      return state.fortBuildingPieceImages[3]?.[state.renderIndex];
    case TurretMissileEffectType.FortBuildingPiece4:
      return state.fortBuildingPieceImages[4]?.[state.renderIndex];
    case TurretMissileEffectType.Grenade:
      return state.grenadeImages[state.renderIndex];
    default:
      return null;
  }
}
