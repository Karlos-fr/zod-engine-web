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

/**
 * Replacement for upstream rotozoom image state used by `EMapObjectTurrent::DoRender`.
 * Role: Applies the current angle and scale before map-relative rendering.
 * Upstream: emapobjectturrent.cpp:134-135
 */
export type MapObjectTurrentRenderImage = {
  setAngle?(angle: number): void;
  setSize?(size: number): void;
};

export type MapObjectTurrentInitState = {
  objectImages: readonly MapObjectTurrentImage[];
  finishedInit: boolean;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for map-object turret debris.
 * Upstream: emapobjectturrent.cpp:139
 */
export type MapObjectTurrentRenderMap<TImage, TCommand> = {
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `EMapObjectTurrent::DoRender`.
 * Role: Holds the active object image, transform, and visibility state.
 * Upstream: emapobjectturrent.cpp:126-142
 */
export type MapObjectTurrentRenderState<TImage> = {
  killMe: boolean;
  x: number;
  y: number;
  objectIndex: number;
  angle: number;
  size: number;
  objectImages: readonly TImage[];
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

/**
 * Replacement for upstream `EMapObjectTurrent::DoRender`.
 * Role: Builds the centered map-relative map-object turret render command.
 * Upstream: emapobjectturrent.cpp:126-142
 */
export function renderMapObjectTurrentEffect<
  TImage extends MapObjectTurrentRenderImage,
  TCommand,
>(
  state: MapObjectTurrentRenderState<TImage>,
  zmap: MapObjectTurrentRenderMap<TImage, TCommand>,
): TCommand | null {
  if (state.killMe) return null;

  const image = state.objectImages[state.objectIndex];
  if (!image) return null;

  image.setAngle?.(state.angle);
  image.setSize?.(state.size);

  return zmap.renderZSurface(image, state.x, state.y, false, true);
}
