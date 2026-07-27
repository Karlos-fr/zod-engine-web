/**
 * Ported from Zod Engine.
 * Upstream: edeathsparks.h / edeathsparks.cpp
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Adaptation of upstream `_EDEATHSPARKS_H_`.
 * Role: Marks the TypeScript module boundary for upstream `edeathsparks.h`.
 * Ledger: MAC-4EB9DD
 * Upstream: edeathsparks.h:2
 */
export const EDEATH_SPARKS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `max_up`.
 * Role: Defines the maximum upward spark offset used by the death spark effect.
 * Ledger: CON-F769B2
 * Upstream: edeathsparks.cpp:10
 */
export const DEATH_SPARKS_MAX_UP = 70;

/**
 * Port of upstream `max_down`.
 * Role: Defines the maximum downward spark offset used by the death spark effect.
 * Ledger: CON-400452
 * Upstream: edeathsparks.cpp:11
 */
export const DEATH_SPARKS_MAX_DOWN = 150;

/**
 * Port of upstream `max_left`.
 * Role: Defines the maximum leftward spark offset used by the death spark effect.
 * Ledger: CON-15FF90
 * Upstream: edeathsparks.cpp:12
 */
export const DEATH_SPARKS_MAX_LEFT = 180;

/**
 * Port of upstream `max_right`.
 * Role: Defines the maximum rightward spark offset used by the death spark effect.
 * Ledger: CON-970474
 * Upstream: edeathsparks.cpp:13
 */
export const DEATH_SPARKS_MAX_RIGHT = 180;
