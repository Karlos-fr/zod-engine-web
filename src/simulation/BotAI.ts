/**
 * Upstream: zbot.h, zbot.cpp
 */

/**
 * Port of upstream `_ZBOT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zbot.h:2
 */
export const ZBOT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `PreferredUnit`.
 * Role: Stores a bot build preference and how many matching units are already in production.
 * Upstream: zbot.h:115-137
 */
export class PreferredUnit {
  ot: number;
  oid: number;
  pValue: number;
  inProduction: number;

  constructor(ot = 255, oid = 255, pValue = 1.0) {
    this.ot = ot;
    this.oid = oid;
    this.pValue = pValue;
    this.inProduction = 0;
  }
}

/**
 * Port of upstream `max_line_dist`.
 * Role: Limits how far a candidate target may stray from a crane priority path.
 * Upstream: zbot.cpp:482
 */
export const BOT_CRANE_TARGET_MAX_LINE_DISTANCE_PIXELS = 224;

/**
 * Port of upstream `max_total_dist`.
 * Role: Limits total crane-to-target distance trusted for path-adjacent culling.
 * Upstream: zbot.cpp:483
 */
export const BOT_CRANE_TARGET_MAX_TOTAL_DISTANCE_PIXELS = 672;

/**
 * Port of upstream `percent_guns_building_max`.
 * Role: Caps the fraction of buildings that may be assigned to cannon production.
 * Upstream: zbot.cpp:1799
 */
export const BOT_MAX_GUNS_BUILDING_RATIO = 0.35;

/**
 * Port of upstream `max_combo_check`.
 * Role: Caps factory lists before expensive build-combination scoring.
 * Upstream: zbot.cpp:1946
 */
export const BOT_MAX_BUILD_COMBO_CHECK = 6;
