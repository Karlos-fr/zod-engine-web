/**
 * Ported from Zod Engine.
 * Upstream: etankoil.h / etankoil.cpp
 * Symbols: _ETANKOIL_H_, ETANKOIL_TIME
 */

/**
 * Adaptation of upstream `_ETANKOIL_H_`.
 * Role: Marks the TypeScript module boundary for upstream `etankoil.h`.
 * Ledger: MAC-BFE2E7
 * Upstream: etankoil.h:2
 */
export const ETANK_OIL_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETANKOIL_TIME`.
 * Role: Defines the lifetime duration for tank oil effects.
 * Ledger: MAC-DB695F
 * Upstream: etankoil.cpp:6
 */
export const TANK_OIL_LIFETIME_SECONDS = 3.0;
