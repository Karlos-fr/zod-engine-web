/**
 * Upstream: zgun_placement_heatmap.h / zgun_placement_heatmap.cpp
 */

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
};

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
