/**
 * Ported from Zod Engine.
 * Upstream: etanksmoke.h / etanksmoke.cpp
 * Symbols: _ETANKSMOKE_H_, ETANKSMOKE_TIME
 */

/**
 * Adaptation of upstream `_ETANKSMOKE_H_`.
 * Role: Marks the TypeScript module boundary for upstream `etanksmoke.h`.
 * Ledger: MAC-D63C99
 * Upstream: etanksmoke.h:2
 */
export const ETANK_SMOKE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETANKSMOKE_TIME`.
 * Role: Defines the frame advance delay for tank smoke animation effects.
 * Ledger: MAC-BC9043
 * Upstream: etanksmoke.cpp:7
 */
export const TANK_SMOKE_FRAME_INTERVAL_SECONDS = 0.15;
