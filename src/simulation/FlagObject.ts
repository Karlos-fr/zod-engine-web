/**
 * Ported from Zod Engine.
 * Upstream: oflag.h, oflag.cpp
 * Symbols: _OFLAG_H_, int_time
 */

/**
 * Adaptation of upstream `_OFLAG_H_`.
 * Role: Marks the TypeScript module boundary for upstream `oflag.h`.
 * Ledger: MAC-2FAA3D
 * Upstream: oflag.h:2
 */
export const OFLAG_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `int_time`.
 * Role: Defines the minimum elapsed time between flag animation frame advances.
 * Ledger: CON-2F6D96
 * Upstream: oflag.cpp:39
 */
export const FLAG_ANIMATION_INTERVAL_SECONDS = 0.2;
