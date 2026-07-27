/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zcomp_message_engine.h
 * - Symbols: MAX_RENDERABLE_STORED_GUNS
 * - Ledger: MAC-154053
 *
 * Porting notes:
 * - Component message rendering constants are exposed as named module exports.
 */

/**
 * Replacement for upstream `MAX_RENDERABLE_STORED_GUNS`.
 *
 * Role:
 * - Caps how many stored guns the component message renderer may display.
 *
 * Ledger: MAC-154053
 * Upstream: zcomp_message_engine.h:9
 *
 * Adaptation:
 * - Replaces the C preprocessor macro with a named TypeScript constant.
 */
export const MAX_RENDERABLE_STORED_GUNS = 8;
