/**
 * Ported from Zod Engine.
 * Upstream: zgun_placement_heatmap.h / zgun_placement_heatmap.cpp
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Marker exported from the gun placement heatmap module.
 * Role: Marks the TypeScript module boundary for upstream `zgun_placement_heatmap.h`.
 * Ledger: MAC-B23CBF
 * Upstream: zgun_placement_heatmap.h:2
 */
export const ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `ZHeatMapBase` accessors.
 * Role: Stores the current heatmap buffer size exposed by `GetHeatMapSize`.
 * Ledger: FUN-3A11B1
 * Upstream: zgun_placement_heatmap.h:28, zgun_placement_heatmap.h:35
 */
export type HeatMapBaseState = {
  heatMapSize: number;
};

/**
 * Port of upstream `process_time_inc`.
 * Role: Defines the processing time increment used by the gun placement heatmap update loop.
 * Ledger: CON-D3A379
 * Upstream: zgun_placement_heatmap.cpp:32
 */
export const GUN_PLACEMENT_HEATMAP_PROCESS_TIME_INCREMENT = 0.25;

/**
 * Port of upstream `heat_tile_dist`.
 * Role: Defines the tile radius used when adding flag-object heat to placement evaluation.
 * Ledger: CON-C4B75F
 * Upstream: zgun_placement_heatmap.cpp:464
 */
export const FLAG_HEAT_TILE_DISTANCE = 6;

/**
 * Port of upstream `heat_tile_dist`.
 * Role: Defines the tile radius used when adding recent unit-position history heat to placement evaluation.
 * Ledger: CON-C4B75F
 * Upstream: zgun_placement_heatmap.cpp:495
 * Notes: Unit is tile distance. * - Shares the upstream symbol name with the flag heat distance at line 464, but is kept as a separate named constant because it is scoped to different heatmap processing logic.
 */
export const UNIT_HISTORY_HEAT_TILE_DISTANCE = 6;

/**
 * Port of upstream `enemy_heat_tile_dist`.
 * Role: Defines the tile radius used when adding enemy-unit heat to building placement evaluation.
 * Ledger: CON-06EC4C
 * Upstream: zgun_placement_heatmap.cpp:564
 */
export const ENEMY_HEAT_TILE_DISTANCE = 3;

/**
 * Port of upstream `fort_heat_tile_dist`.
 * Role: Defines the tile radius used when adding fortification heat to building placement evaluation.
 * Ledger: CON-DC32BD
 * Upstream: zgun_placement_heatmap.cpp:565
 */
export const FORT_HEAT_TILE_DISTANCE = 3;

/**
 * Port of upstream `time_inc`.
 * Role: Defines the time-step increment used while processing unit history heatmap decay and clearing thresholds.
 * Ledger: CON-7BF996
 * Upstream: zgun_placement_heatmap.cpp:496
 */
export const UNIT_HISTORY_HEATMAP_TIME_INCREMENT = 0.01;

/**
 * Port of upstream `GetHeatMapSize`.
 * Role: Returns the current heatmap buffer size stored by `ZHeatMapBase`.
 * Ledger: FUN-3A11B1
 * Upstream: zgun_placement_heatmap.h:28
 */
export function getHeatMapSize(state: HeatMapBaseState): number {
  return state.heatMapSize;
}
