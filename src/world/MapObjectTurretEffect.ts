/**
 * Upstream: emapobjectturrent.h
 */

import { MAP_ITEM_TYPE_COUNT } from "./WorldConstants";

/**
 * Marker exported from the map object turret effect module.
 * Role: Marks an upstream header boundary.
 * Upstream: emapobjectturrent.h:2
 */
export const EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED = true;

export type MapObjectTurrentImage = {
  loadBaseImage(filename: string): void;
};

/**
 * Port of upstream `ZSDL_Surface::GetBaseSurface` use in `EMapObjectTurrent`.
 * Role: Reports whether a map-object turret effect image has a loaded base surface.
 * Upstream: emapobjectturrent.cpp:35
 */
export type MapObjectTurrentBaseImage = {
  getBaseSurface(): unknown | null;
};

export type MapObjectTurrentInitState = {
  objectImages: readonly MapObjectTurrentImage[];
  finishedInit: boolean;
};

/**
 * Port of upstream `EMapObjectTurrent` construction arguments.
 * Role: Describes a map-object turret effect spawned by an object map item.
 * Upstream: emapobjectturrent.h:9
 */
export type MapObjectTurrentEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  offsetTime: number;
  objectIndex: number;
};

/**
 * Port of upstream `EMapObjectTurrent::Init`.
 * Role: Loads no-shadow map item images used by map object turret effects.
 * Upstream: emapobjectturrent.cpp:77-89
 */
export function initMapObjectTurrentEffect(
  state: MapObjectTurrentInitState,
): void {
  for (let i = 0; i < MAP_ITEM_TYPE_COUNT; i += 1) {
    state.objectImages[i]?.loadBaseImage(
      `assets/other/map_items/no_shadow${i}.png`,
    );
  }

  state.finishedInit = true;
}
