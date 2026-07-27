/**
 * Ported from Zod Engine.
 * Upstream: abird.h / abird.cpp / zplayer.cpp
 * Symbols: BIRD_MAP_PADDING, sq_tile_per_bird, _ABIRD_H_
 */

/**
 * Port of upstream `_ABIRD_H_`.
 * Role: Marks upstream `abird.h` as compile-time only.
 * Ledger: MAC-70EFAF
 * Upstream: abird.h:2
 */
export const ABIRD_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `sq_tile_per_bird`.
 * Role: Defines the square-tile area budget used to derive ambient bird density for a map.
 * Ledger: CON-895F4C
 * Upstream: zplayer.cpp:575
 */
export const AMBIENT_BIRD_SQUARE_TILES_PER_BIRD = 650;

/**
 * Port of upstream `BIRD_MAP_PADDING`.
 * Role: Defines the extra pixel margin around the map used when positioning or resetting ambient bird movement outside visible terrain bounds.
 * Ledger: MAC-BF5A5F
 * Upstream: abird.cpp:3
 */
export const BIRD_MAP_PADDING_PIXELS = 160;
