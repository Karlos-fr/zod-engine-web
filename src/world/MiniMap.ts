/**
 * Upstream: zmini_map.h
 */

/**
 * Port of upstream `_ZMINIMAP_H_`.
 * Role: Marks an upstream compile-time boundary.
 * Upstream: zmini_map.h:2
 */
export const ZMINIMAP_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MINIMAP_H_MAX`.
 * Role: Defines the maximum source minimap height in pixels.
 * Upstream: zmini_map.h:12
 */
export const MINIMAP_MAX_HEIGHT_PIXELS = 89;

/**
 * Port of upstream `MINIMAP_W_MAX`.
 * Role: Defines the maximum source minimap width in pixels.
 * Upstream: zmini_map.h:11
 */
export const MINIMAP_MAX_WIDTH_PIXELS = 92;

/**
 * Minimal state consumed by ported `ZMiniMap` display toggles.
 * Role: Stores whether terrain rendering is enabled for the minimap overlay.
 * Upstream: zmini_map.h:23-24, zmini_map.h:32
 */
export type MiniMapTerrainState = {
  showTerrain: boolean;
};

/**
 * Minimal state consumed by ported `ZMiniMap::Setup`.
 * Role: Stores the map and object-list references used by minimap operations.
 * Upstream: zmini_map.h:18-19, zmini_map.cpp:18-22
 */
export type MiniMapSetupState<TMap = unknown, TObject = unknown> = {
  zmap: TMap | null;
  objectList: readonly TObject[] | null;
};

/**
 * Port of upstream `ZMiniMap::render_area` shape.
 * Role: Defines the minimap screen rectangle used for click-to-map conversion.
 * Upstream: zmini_map.h:34, zmini_map.cpp:61-75
 */
export type MiniMapRenderArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Port of upstream `SetShowTerrain`.
 * Role: Sets the minimap terrain visibility flag to the requested value.
 * Upstream: zmini_map.h:23
 */
export function setMiniMapShowTerrain<TState extends MiniMapTerrainState>(
  state: TState,
  showTerrain: boolean,
): TState {
  return {
    ...state,
    showTerrain,
  };
}

/**
 * Port of upstream `ToggleShowTerrain`.
 * Role: Flips the minimap terrain visibility flag.
 * Upstream: zmini_map.h:24
 */
export function toggleMiniMapShowTerrain<TState extends MiniMapTerrainState>(
  state: TState,
): TState {
  return {
    ...state,
    showTerrain: !state.showTerrain,
  };
}

/**
 * Port of upstream `ZMiniMap::Setup`.
 * Role: Connects minimap state to the map and object list it will read.
 * Upstream: zmini_map.cpp:18-22
 */
export function setupMiniMap<TMap, TObject, TState extends MiniMapSetupState<TMap, TObject>>(
  state: TState,
  zmap: TMap,
  objectList: readonly TObject[],
): TState {
  return {
    ...state,
    zmap,
    objectList,
  };
}

/**
 * Port of upstream `ZMiniMap::ClickedMap`.
 * Role: Converts a click inside the minimap render area into map pixel coordinates.
 * Upstream: zmini_map.cpp:61-75
 */
export function clickedMiniMap(
  x: number,
  y: number,
  renderArea: MiniMapRenderArea,
  mapBasics: { width: number; height: number },
): { mapX: number; mapY: number } | null {
  if (x < renderArea.x) return null;
  if (x > renderArea.x + renderArea.width) return null;
  if (y < renderArea.y) return null;
  if (y > renderArea.y + renderArea.height) return null;

  const xPercent = (x - renderArea.x) / renderArea.width;
  const yPercent = (y - renderArea.y) / renderArea.height;

  return {
    mapX: xPercent * (mapBasics.width * 16.0),
    mapY: yPercent * (mapBasics.height * 16.0),
  };
}
