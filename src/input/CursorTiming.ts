/**
 * Ported from Zod Engine.
 * Upstream: cursor.cpp, cursor.h
 * Symbols: time_inc, _CURSOR_H_
 */

/**
 * Port of upstream `time_inc`.
 * Role: Defines the seconds between cursor animation frame advances.
 * Ledger: CON-DC7963
 * Upstream: cursor.cpp:206
 * Adaptation: Replaces the C++ local constant with a named TypeScript export for future cursor animation ports.
 */
export const CURSOR_FRAME_INTERVAL_SECONDS = 0.2;
