/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zmap_crater_graphics.h
 * - Symbols: MAX_KNOWN_CRATER_TYPES, MAX_KNOWN_CRATER_N
 * - Ledger: MAC-3A1C6F, MAC-516EE8, MAC-80E85C
 *
 * Porting notes:
 * - The C++ header guard is represented by native ES module scoping.
 */

/**
 * Port of upstream `MAX_KNOWN_CRATER_TYPES`.
 *
 * Role:
 * - Defines how many crater sprite/type groups the terrain renderer can address.
 *
 * Ledger: MAC-3A1C6F
 * Upstream: zmap_crater_graphics.h:8
 */
export const MAX_KNOWN_CRATER_TYPES = 7;

/**
 * Port of upstream `MAX_KNOWN_CRATER_N`.
 *
 * Role:
 * - Defines the maximum number of crater variants available within each type.
 *
 * Ledger: MAC-80E85C
 * Upstream: zmap_crater_graphics.h:9
 *
 * Notes:
 * - Renamed to `MAX_KNOWN_CRATERS_PER_TYPE` for clarity.
 */
export const MAX_KNOWN_CRATERS_PER_TYPE = 7;
