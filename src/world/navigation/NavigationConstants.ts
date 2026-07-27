/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zpath_finding.cpp / zpath_finding_astar.cpp
 * - Symbols: ticks_until_pause, crawl_dist
 * - Ledger: CON-DB7A41, CON-C73102
 *
 * Porting notes:
 * - Native pathfinding constants are preserved as named TypeScript constants.
 */

/**
 * Port of upstream `ticks_until_pause`.
 *
 * Role:
 * - Defines how many pathfinding ticks can run before yielding work.
 *
 * Ledger: CON-DB7A41
 * Upstream: zpath_finding_astar.cpp:263
 */
export const TICKS_UNTIL_PATHFINDING_PAUSE = 90;

/**
 * Port of upstream `crawl_dist`.
 *
 * Role:
 * - Defines the neighborhood crawl distance used by pathfinding expansion.
 *
 * Ledger: CON-C73102
 * Upstream: zpath_finding.cpp:905
 */
export const CRAWL_DISTANCE = 4;
