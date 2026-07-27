/**
 * Ported from Zod Engine.
 * Upstream: etankspark.h / etankspark.cpp
 * Symbols: _ETANKSPARK_H_, ETANKSPARK_TIME
 */

/**
 * Adaptation of upstream `_ETANKSPARK_H_`.
 * Role: Marks the TypeScript module boundary for upstream `etankspark.h`.
 * Ledger: MAC-6036C3
 * Upstream: etankspark.h:2
 */
export const ETANK_SPARK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETANKSPARK_TIME`.
 * Role: Defines the frame advance delay for tank spark animation effects.
 * Ledger: MAC-854B90
 * Upstream: etankspark.cpp:6
 */
export const TANK_SPARK_FRAME_INTERVAL_SECONDS = 0.1;
