/**
 * Ported from Zod Engine.
 * Upstream: zvote.h / zvote.cpp
 * Symbols: _ZVOTE_H_, MAX_VOTE_TIME, max_description_len
 */

/**
 * Adaptation of upstream `_ZVOTE_H_`.
 * Role: Marks the TypeScript module boundary for upstream `zvote.h`.
 * Ledger: MAC-3E31BD
 * Upstream: zvote.h:2
 */
export const ZVOTE_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `MAX_VOTE_TIME`.
 * Role: Defines the maximum vote duration.
 * Ledger: MAC-4E6AF1
 * Upstream: zvote.h:10
 */
export const MAX_VOTE_TIME_SECONDS = 30;

/**
 * Port of upstream `max_description_len`.
 * Role: Defines the maximum rendered vote description width.
 * Ledger: CON-500A93
 * Upstream: zvote.cpp:59
 */
export const VOTE_DESCRIPTION_MAX_WIDTH_PIXELS = 104;
