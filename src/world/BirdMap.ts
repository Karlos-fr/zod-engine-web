/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: abird.h / abird.cpp / zplayer.cpp
 * - Symbols: BIRD_MAP_PADDING, sq_tile_per_bird, _ABIRD_H_
 * - Ledger: MAC-BF5A5F, CON-895F4C, MAC-70EFAF
 *
 * Porting notes:
 * - Bird map-boundary behavior constants are represented as named world
 *   constants.
 */

/**
 * Port of upstream `_ABIRD_H_`.
 *
 * Role:
 * - Records that the `abird.h` include guard has no runtime behavior.
 *
 * Ledger: MAC-70EFAF
 * Upstream: abird.h:2
 *
 * Adaptation:
 * - Header guards are represented as traceability constants in ES modules.
 */
export const ABIRD_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `sq_tile_per_bird`.
 *
 * Role:
 * - Defines the square-tile area budget used to derive ambient bird density
 *   for a map.
 *
 * Ledger: CON-895F4C
 * Upstream: zplayer.cpp:575
 *
 * Notes:
 * - Unit is square tiles per ambient bird.
 */
export const AMBIENT_BIRD_SQUARE_TILES_PER_BIRD = 650;

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
