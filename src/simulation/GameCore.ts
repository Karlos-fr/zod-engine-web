/**
 * Ported from Zod Engine.
 * Upstream: zcore.h
 * Symbols: _ZCORE_H_, games_per_vp
 */

/**
 * Adaptation of upstream `_ZCORE_H_`.
 * Role: Marks the TypeScript module boundary for the future `ZCore` port.
 * Ledger: MAC-860937
 * Upstream: zcore.h:2
 */
export const ZCORE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `games_per_vp`.
 * Role: Defines how many played games grant one extra real voting-power point.
 * Ledger: CON-A48EED
 * Upstream: zcore.h:110
 */
export const GAMES_PER_VOTING_POWER_POINT = 5;
