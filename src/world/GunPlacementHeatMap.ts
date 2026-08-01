/**
 * Upstream: zgun_placement_heatmap.h / zgun_placement_heatmap.cpp
 */

import type { GameMap } from "./GameMap";
import type { MapZoneInfo } from "./MapFormat";
import type { GameEntity } from "../simulation/entities/GameEntity";
import { distance, xyToIndex } from "../simulation/Common";

/**
 * Marker exported from the gun placement heatmap module.
 * Role: Marks an upstream header boundary.
 * Upstream: zgun_placement_heatmap.h:2
 */
export const ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `ZHeatMapBase` accessors.
 * Role: Stores the current heatmap buffer size exposed by `GetHeatMapSize`.
 * Upstream: zgun_placement_heatmap.h:28, zgun_placement_heatmap.h:35
 */
export type HeatMapBaseState = {
  heatMapSize: number;
  heatMap?: { [index: number]: number; length: number };
  lastTeam?: number;
};

export type GunPlacementRedTileSurface<TSurface = unknown> = {
  getBaseSurface(): TSurface | null;
  loadNewSurface(width: number, height: number): void;
  makeAlphable(): void;
  fillRectOnToMe(
    rect: { x: number; y: number; width: number; height: number },
    red: number,
    green: number,
    blue: number,
  ): void;
};

/**
 * Port of upstream `ZCore` forward declaration.
 * Role: References the game core passed into gun placement searches.
 * Upstream: zgun_placement_heatmap.h:10
 */
export type GunPlacementCoreReference = object;

/**
 * Port of upstream `ZObject` forward declaration.
 * Role: References the simulation object evaluated by gun placement searches.
 * Upstream: zgun_placement_heatmap.h:11
 */
export type GunPlacementObjectReference = GameEntity;

/**
 * Port of upstream `ZMap` forward declaration.
 * Role: References the game map used by gun placement heatmap processing.
 * Upstream: zgun_placement_heatmap.h:12
 */
export type GunPlacementMapReference = GameMap;

/**
 * Port of upstream `map_zone_info` forward declaration.
 * Role: References map zone metadata while evaluating cannon placement.
 * Upstream: zgun_placement_heatmap.h:15
 */
export type GunPlacementMapZoneInfoReference = MapZoneInfo;

/**
 * Port of upstream `ZOLists` forward declaration.
 * Role: References the object-list container used by heatmap processing.
 * Upstream: zgun_placement_heatmap.h:14
 */
export type GunPlacementObjectListsReference = object;

/**
 * Port of upstream `process_time_inc`.
 * Role: Defines the processing time increment for the gun placement heatmap update loop.
 * Upstream: zgun_placement_heatmap.cpp:32
 */
export const GUN_PLACEMENT_HEATMAP_PROCESS_TIME_INCREMENT = 0.25;

/**
 * Port of upstream `heat_tile_dist`.
 * Role: Defines the tile radius used when adding flag-object heat to placement evaluation.
 * Upstream: zgun_placement_heatmap.cpp:464
 */
export const FLAG_HEAT_TILE_DISTANCE = 6;

/**
 * Port of upstream `heat_tile_dist`.
 * Role: Defines the tile radius used when adding recent unit-position history heat to placement evaluation.
 * Upstream: zgun_placement_heatmap.cpp:495
 */
export const UNIT_HISTORY_HEAT_TILE_DISTANCE = 6;

/**
 * Port of upstream `enemy_heat_tile_dist`.
 * Role: Defines the tile radius used when adding enemy-unit heat to building placement evaluation.
 * Upstream: zgun_placement_heatmap.cpp:564
 */
export const ENEMY_HEAT_TILE_DISTANCE = 3;

/**
 * Port of upstream `fort_heat_tile_dist`.
 * Role: Defines the tile radius used when adding fortification heat to building placement evaluation.
 * Upstream: zgun_placement_heatmap.cpp:565
 */
export const FORT_HEAT_TILE_DISTANCE = 3;

/**
 * Port of upstream `time_inc`.
 * Role: Defines the time-step increment used while processing unit history heatmap decay and clearing thresholds.
 * Upstream: zgun_placement_heatmap.cpp:496
 */
export const UNIT_HISTORY_HEATMAP_TIME_INCREMENT = 0.01;

/**
 * Port of upstream `time_dec`.
 * Role: Defines the per-step decay factor for unit history heatmap values.
 * Upstream: zgun_placement_heatmap.cpp:497
 */
export const UNIT_HISTORY_HEATMAP_TIME_DECAY = Math.pow(
  0.2,
  1 / (2 * 60 * (1 / UNIT_HISTORY_HEATMAP_TIME_INCREMENT)),
);

/**
 * Port of upstream `clear_threshold`.
 * Role: Defines the unit-history heat value below which entries are cleared.
 * Upstream: zgun_placement_heatmap.cpp:498
 */
export const UNIT_HISTORY_HEATMAP_CLEAR_THRESHOLD = Math.pow(
  UNIT_HISTORY_HEATMAP_TIME_DECAY,
  5 * 60 * (1 / UNIT_HISTORY_HEATMAP_TIME_INCREMENT),
);

/**
 * Port of upstream `GetHeatMapSize`.
 * Role: Returns the current heatmap buffer size stored by `ZHeatMapBase`.
 * Upstream: zgun_placement_heatmap.h:28
 */
export function getHeatMapSize(state: HeatMapBaseState): number {
  return state.heatMapSize;
}

/**
 * Port of upstream `ZHeatMapBase::ShouldClear`.
 * Role: Reports whether cached heatmap data belongs to a different team.
 * Upstream: zgun_placement_heatmap.cpp:395-400
 */
export function shouldClearHeatMap(
  state: Pick<HeatMapBaseState, "lastTeam">,
  ourTeam: number,
): boolean {
  return state.lastTeam !== ourTeam;
}

/**
 * Port of upstream `ZHeatMapBase::ShouldReset`.
 * Role: Reports whether the cached heatmap size no longer matches the map dimensions.
 * Upstream: zgun_placement_heatmap.cpp:368-373
 */
export function shouldResetHeatMap(
  state: Pick<HeatMapBaseState, "heatMapSize">,
  mapBasics: Pick<GameMap, "width" | "height">,
): boolean {
  return mapBasics.width * mapBasics.height !== state.heatMapSize;
}

/**
 * Port of upstream `ZHeatMapBase::DoReset`.
 * Role: Reallocates heatmap storage to match the current map dimensions.
 * Upstream: zgun_placement_heatmap.cpp:375-393
 */
export function resetHeatMap(
  state: HeatMapBaseState,
  mapBasics: Pick<GameMap, "width" | "height">,
): void {
  state.heatMapSize = mapBasics.width * mapBasics.height;

  if (state.heatMapSize < 0) {
    state.heatMapSize = 0;
  }

  state.heatMap = undefined;

  if (state.heatMapSize) {
    state.heatMap = Array.from({ length: state.heatMapSize }, () => 0);
    clearHeatMap(state, -1);
  }
}

/**
 * Port of upstream `ZHeatMapBase::DoClear`.
 * Role: Clears heatmap data and records the team the cleared data belongs to.
 * Upstream: zgun_placement_heatmap.cpp:402-410
 */
export function clearHeatMap(state: HeatMapBaseState, ourTeam: number): void {
  if (state.heatMap) {
    for (let i = 0; i < state.heatMapSize && i < state.heatMap.length; i += 1) {
      state.heatMap[i] = 0;
    }
  }

  if (ourTeam !== -1) {
    state.lastTeam = ourTeam;
  }
}

/**
 * Port of upstream `ZHeatMapBase::AddHeat`.
 * Role: Adds weighted radial heat into the cached tile heatmap.
 * Upstream: zgun_placement_heatmap.cpp:412-460
 */
export function addHeatMapHeat(
  state: HeatMapBaseState,
  mapBasics: Pick<GameMap, "width" | "height">,
  centerX: number,
  centerY: number,
  heatDistance: number,
  weight: number,
  heatStacks = true,
): void {
  if (!state.heatMap) return;

  const heatTileDistance = Math.trunc(heatDistance / 16);
  const tileX = Math.trunc(centerX / 16);
  const tileY = Math.trunc(centerY / 16);
  const startX = Math.max(0, tileX - heatTileDistance);
  const endX = Math.min(mapBasics.width - 1, tileX + heatTileDistance);
  const startY = Math.max(0, tileY - heatTileDistance);
  const endY = Math.min(mapBasics.height - 1, tileY + heatTileDistance);

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      const index = xyToIndex(x, y, mapBasics.height);

      if (index < 0) continue;
      if (index >= state.heatMapSize) continue;

      const tileDistance = distance(centerX, centerY, x * 16 + 8, y * 16 + 8);
      if (tileDistance > heatDistance) continue;

      const heat = weight * ((heatDistance - tileDistance) / heatDistance);

      if (heatStacks) {
        state.heatMap[index] += heat;
      } else if (weight > 0) {
        if (heat > state.heatMap[index]) state.heatMap[index] = heat;
      } else if (heat < state.heatMap[index]) {
        state.heatMap[index] = heat;
      }
    }
  }
}

/**
 * Port of upstream `ZGunPlacementHeatMap::LazyCreateRedTile`.
 * Role: Lazily creates and fills the red tile surface used by gun placement heatmap display.
 * Upstream: zgun_placement_heatmap.cpp:272-295
 */
export function lazyCreateGunPlacementRedTile<TSurface>(
  redTile: GunPlacementRedTileSurface<TSurface>,
): boolean {
  if (!redTile.getBaseSurface()) {
    redTile.loadNewSurface(16, 16);

    if (!redTile.getBaseSurface()) {
      return false;
    }

    redTile.makeAlphable();
    redTile.fillRectOnToMe({ x: 0, y: 0, width: 16, height: 16 }, 255, 0, 0);
  }

  return true;
}
