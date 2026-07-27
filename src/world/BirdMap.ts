/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: abird.cpp
 * - Symbols: BIRD_MAP_PADDING
 * - Ledger: MAC-BF5A5F
 *
 * Porting notes:
 * - Bird map-boundary behavior constants are represented as named world
 *   constants.
 */

/**
 * Port of upstream `BIRD_MAP_PADDING`.
 *
 * Role:
 * - Defines the extra pixel margin around the map used when positioning or
 *   resetting ambient bird movement outside visible terrain bounds.
 *
 * Ledger: MAC-BF5A5F
 * Upstream: abird.cpp:3
 *
 * Adaptation:
 * - Replaces the C macro with a typed TypeScript constant.
 */
export const BIRD_MAP_PADDING_PIXELS = 160;
