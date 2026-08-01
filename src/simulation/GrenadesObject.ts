/**
 * Upstream: ogrenades.h, ogrenades.cpp
 */

import {
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
} from "./TurretMissileEffect";

/**
 * Port of upstream `_OGRENADES_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ogrenades.h:2
 */
export const OGRENADES_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `OGrenades` grenade inventory field.
 * Role: Holds the grenade count carried by a grenade pickup object.
 * Upstream: ogrenades.h:15, ogrenades.h:25
 */
export type GrenadesObjectInventoryState = {
  grenadeAmount: number;
};

/**
 * Port of upstream `OGrenades::render_img` source.
 * Role: Identifies the browser asset used to render grenade pickup objects.
 * Upstream: ogrenades.cpp:27
 */
export const GRENADES_OBJECT_IMAGE_PATH = "assets/other/map_items/grenades.png";

/**
 * Replacement for upstream `OGrenades::render_img`.
 * Role: Holds the loaded grenade pickup render asset.
 * Upstream: ogrenades.h:25
 */
export type GrenadesObjectRenderState<TImage> = {
  renderImage: TImage | null;
};

export type GrenadesObjectTurrentMissileState<TTime = unknown> = {
  ztime: TTime | null;
  position: {
    x: number;
    y: number;
  };
};

/**
 * Port of upstream `SetGrenadeAmount`.
 * Role: Updates the grenade count carried by a grenade pickup object.
 * Upstream: ogrenades.h:15
 */
export function setGrenadesObjectAmount(
  state: GrenadesObjectInventoryState,
  grenadeAmount: number,
): void {
  state.grenadeAmount = grenadeAmount;
}

/**
 * Port of upstream `GetGrenadeAmount`.
 * Role: Returns the grenade count carried by a grenade pickup object.
 * Upstream: ogrenades.h:16
 */
export function getGrenadesObjectAmount(
  state: GrenadesObjectInventoryState,
): number {
  return state.grenadeAmount;
}

/**
 * Port of upstream `OGrenades::Init`.
 * Role: Loads the shared grenade pickup render asset through the browser asset loader.
 * Upstream: ogrenades.cpp:25-28
 */
export function initGrenadesObjectImage<TImage>(
  state: GrenadesObjectRenderState<TImage>,
  loadImage: (path: string) => TImage,
): void {
  state.renderImage = loadImage(GRENADES_OBJECT_IMAGE_PATH);
}

/**
 * Port of upstream `OGrenades::Process`.
 * Role: Reports no per-tick processing work for grenade pickup objects.
 * Upstream: ogrenades.cpp:46-49
 */
export function processGrenadesObject(): number {
  return 0;
}

/**
 * Port of upstream `OGrenades::FireTurrentMissile`.
 * Role: Spawns a grenade turret missile effect from the grenade pickup object.
 * Upstream: ogrenades.cpp:51-54
 */
export function fireGrenadesObjectTurrentMissile<TTime>(
  state: GrenadesObjectTurrentMissileState<TTime>,
  effectList: TurretMissileEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.push({
    ztime: state.ztime,
    startX: state.position.x + 2,
    startY: state.position.y + 2,
    targetX,
    targetY,
    offsetTime,
    type: TurretMissileEffectType.Grenade,
  });
}

/**
 * Port of upstream `OGrenades::SetOwner`.
 * Role: Ignores ownership changes for grenade pickup objects.
 * Upstream: ogrenades.cpp:79-82
 */
export function setGrenadesObjectOwner(owner: number): void {
  void owner;
}

/**
 * Port of upstream `max_horz`.
 * Role: Defines the horizontal random spread limit for grenade-triggered missiles.
 * Upstream: ogrenades.cpp:60
 */
export const GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS = 130;

/**
 * Port of upstream `max_vert`.
 * Role: Defines the vertical random spread limit for grenade-triggered missiles.
 * Upstream: ogrenades.cpp:61
 */
export const GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS = 130;
