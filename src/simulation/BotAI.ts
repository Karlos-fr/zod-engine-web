/**
 * Ported from Zod Engine.
 * Upstream: zbot.h, zbot.cpp
 * Symbols: _ZBOT_H_, max_line_dist, max_total_dist, percent_guns_building_max, max_combo_check
 */

/**
 * Adaptation of upstream `_ZBOT_H_`.
 * Role: Marks the TypeScript module boundary for the future `ZBot` AI client port.
 * Ledger: MAC-4B483B
 * Upstream: zbot.h:2
 */
export const ZBOT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `max_line_dist`.
 * Role: Limits how far a candidate target may stray from a crane priority path.
 * Ledger: CON-E677B5
 * Upstream: zbot.cpp:482
 */
export const BOT_CRANE_TARGET_MAX_LINE_DISTANCE_PIXELS = 224;

/**
 * Port of upstream `max_total_dist`.
 * Role: Limits total crane-to-target distance trusted for path-adjacent culling.
 * Ledger: CON-8A3DCA
 * Upstream: zbot.cpp:483
 */
export const BOT_CRANE_TARGET_MAX_TOTAL_DISTANCE_PIXELS = 672;

/**
 * Port of upstream `percent_guns_building_max`.
 * Role: Caps the fraction of buildings that may be assigned to cannon production.
 * Ledger: CON-42F57C
 * Upstream: zbot.cpp:1799
 */
export const BOT_MAX_GUNS_BUILDING_RATIO = 0.35;

/**
 * Port of upstream `max_combo_check`.
 * Role: Caps factory lists before expensive build-combination scoring.
 * Ledger: CON-B9244F
 * Upstream: zbot.cpp:1946
 */
export const BOT_MAX_BUILD_COMBO_CHECK = 6;
