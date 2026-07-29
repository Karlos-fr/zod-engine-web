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

export type MapObjectTurrentInitState = {
  objectImages: readonly MapObjectTurrentImage[];
  finishedInit: boolean;
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
