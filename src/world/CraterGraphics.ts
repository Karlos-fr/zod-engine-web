/**
 * Ported from Zod Engine.
 * Upstream: zmap_crater_graphics.h
 * Symbols: MAX_KNOWN_CRATER_TYPES, MAX_KNOWN_CRATER_N
 */

/**
 * Port of upstream `MAX_KNOWN_CRATER_TYPES`.
 * Role: Defines how many crater sprite/type groups the terrain renderer can address.
 * Ledger: MAC-3A1C6F
 * Upstream: zmap_crater_graphics.h:8
 */
export const MAX_KNOWN_CRATER_TYPES = 7;

/**
 * Port of upstream `MAX_KNOWN_CRATER_N`.
 * Role: Defines the maximum number of crater variants available within each type.
 * Ledger: MAC-80E85C
 * Upstream: zmap_crater_graphics.h:9
 */
export const MAX_KNOWN_CRATERS_PER_TYPE = 7;
