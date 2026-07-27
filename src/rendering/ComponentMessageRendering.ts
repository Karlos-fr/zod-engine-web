/**
 * Ported from Zod Engine.
 * Upstream: zcomp_message_engine.h
 * Symbols: _ZCOMP_MESSAGE_ENGINE_H_, MAX_RENDERABLE_STORED_GUNS
 */

/**
 * Adaptation of upstream `_ZCOMP_MESSAGE_ENGINE_H_`.
 * Role: Marks the TypeScript module boundary for the future `ZCompMessageEngine` port.
 * Ledger: MAC-DE6F98
 * Upstream: zcomp_message_engine.h:2
 */
export const ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Replacement for upstream `MAX_RENDERABLE_STORED_GUNS`.
 * Role: Caps how many stored guns the component message renderer may display.
 * Ledger: MAC-154053
 * Upstream: zcomp_message_engine.h:9
 */
export const MAX_RENDERABLE_STORED_GUNS = 8;
