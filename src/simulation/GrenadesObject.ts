/**
 * Ported from Zod Engine.
 * Upstream: ogrenades.h, ogrenades.cpp
 */

/**
 * Port of upstream `_OGRENADES_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-0E2872
 * Upstream: ogrenades.h:2
 */
export const OGRENADES_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `max_horz`.
 * Role: Defines the horizontal random spread limit for grenade-triggered missiles.
 * Ledger: CON-7BE48C
 * Upstream: ogrenades.cpp:60
 */
export const GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS = 130;

/**
 * Port of upstream `max_vert`.
 * Role: Defines the vertical random spread limit for grenade-triggered missiles.
 * Ledger: CON-10EDC3
 * Upstream: ogrenades.cpp:61
 */
export const GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS = 130;
