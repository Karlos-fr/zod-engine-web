/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zgun_placement_heatmap.h / zgun_placement_heatmap.cpp
 * - Symbols: _ZGUN_PLACEMENT_HEATMAP_H_, process_time_inc, heat_tile_dist,
 *   enemy_heat_tile_dist, fort_heat_tile_dist, time_inc, GetHeatMapSize
 * - Ledger: MAC-B23CBF, CON-D3A379, CON-C4B75F, CON-06EC4C, CON-DC32BD,
 *   CON-7BF996, FUN-3A11B1
 *
 * Porting notes:
 * - C header guards for gun placement heatmap state are represented by ES
 *   module boundaries.
 * - Heatmap tuning values are exposed as named constants for browser-side
 *   world placement logic.
 */

/**
 * Marker exported from the gun placement heatmap module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted
 *   `zgun_placement_heatmap.h` include guard before the full heatmap class
 *   hierarchy is ported.
 *
 * Ledger: MAC-B23CBF
 * Upstream: zgun_placement_heatmap.h:2
 *
 * Adaptation:
 * - Replaces the C `_ZGUN_PLACEMENT_HEATMAP_H_` header guard with TypeScript
 *   module loading.
 */
export const ZGUN_PLACEMENT_HEATMAP_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `ZHeatMapBase` accessors.
 *
 * Role:
 * - Stores the current heatmap buffer size exposed by `GetHeatMapSize`.
 *
 * Ledger: FUN-3A11B1
 * Upstream: zgun_placement_heatmap.h:28, zgun_placement_heatmap.h:35
 *
 * Adaptation:
 * - Represents the C++ `heatmap_size` member as explicit immutable data.
 */
export type HeatMapBaseState = {
  heatMapSize: number;
};

/**
 * Port of upstream `process_time_inc`.
 *
 * Role:
 * - Defines the processing time increment used by the gun placement heatmap
 *   update loop.
 *
 * Ledger: CON-D3A379
 * Upstream: zgun_placement_heatmap.cpp:32
 *
 * Notes:
 * - Unit follows the upstream heatmap processing time scale.
 */
export const GUN_PLACEMENT_HEATMAP_PROCESS_TIME_INCREMENT = 0.25;

/**
 * Port of upstream `heat_tile_dist`.
 *
 * Role:
 * - Defines the tile radius used when adding flag-object heat to placement
 *   evaluation.
 *
 * Ledger: CON-C4B75F
 * Upstream: zgun_placement_heatmap.cpp:464
 *
 * Notes:
 * - Unit is tile distance.
 */
export const FLAG_HEAT_TILE_DISTANCE = 6;

/**
 * Port of upstream `heat_tile_dist`.
 *
 * Role:
 * - Defines the tile radius used when adding recent unit-position history heat
 *   to placement evaluation.
 *
 * Ledger: CON-C4B75F
 * Upstream: zgun_placement_heatmap.cpp:495
 *
 * Notes:
 * - Unit is tile distance.
 * - Shares the upstream symbol name with the flag heat distance at line 464,
 *   but is kept as a separate named constant because it is scoped to different
 *   heatmap processing logic.
 */
export const UNIT_HISTORY_HEAT_TILE_DISTANCE = 6;

/**
 * Port of upstream `enemy_heat_tile_dist`.
 *
 * Role:
 * - Defines the tile radius used when adding enemy-unit heat to building
 *   placement evaluation.
 *
 * Ledger: CON-06EC4C
 * Upstream: zgun_placement_heatmap.cpp:564
 *
 * Notes:
 * - Unit is tile distance.
 */
export const ENEMY_HEAT_TILE_DISTANCE = 3;

/**
 * Port of upstream `fort_heat_tile_dist`.
 *
 * Role:
 * - Defines the tile radius used when adding fortification heat to building
 *   placement evaluation.
 *
 * Ledger: CON-DC32BD
 * Upstream: zgun_placement_heatmap.cpp:565
 *
 * Notes:
 * - Unit is tile distance.
 */
export const FORT_HEAT_TILE_DISTANCE = 3;

/**
 * Port of upstream `time_inc`.
 *
 * Role:
 * - Defines the time-step increment used while processing unit history heatmap
 *   decay and clearing thresholds.
 *
 * Ledger: CON-7BF996
 * Upstream: zgun_placement_heatmap.cpp:496
 *
 * Notes:
 * - Unit follows the upstream heatmap processing time scale.
 */
export const UNIT_HISTORY_HEATMAP_TIME_INCREMENT = 0.01;

/**
 * Port of upstream `GetHeatMapSize`.
 *
 * Role:
 * - Returns the current heatmap buffer size stored by `ZHeatMapBase`.
 *
 * Ledger: FUN-3A11B1
 * Upstream: zgun_placement_heatmap.h:28
 *
 * Adaptation:
 * - Uses explicit `HeatMapBaseState` instead of reading a C++ class member.
 */
export function getHeatMapSize(state: HeatMapBaseState): number {
  return state.heatMapSize;
}
