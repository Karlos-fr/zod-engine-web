/**
 * Ported from Zod Engine.
 * Upstream: event_handler.h
 * Symbols: _EVENTHANDLER_H_, MAX_VERSION_PACKET_CHARS, MAX_EVENT_TYPES, MAX_FUNCTIONS
 */

/**
 * Adaptation of upstream `_EVENTHANDLER_H_`.
 * Role: Marks the TypeScript module boundary for upstream `event_handler.h`.
 * Ledger: MAC-96C7EA
 * Upstream: event_handler.h:2
 */
export const EVENT_HANDLER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_VERSION_PACKET_CHARS`.
 * Role: Defines the fixed character capacity of upstream `version_packet.version`.
 * Ledger: MAC-E8EBB4
 * Upstream: event_handler.h:231
 */
export const MAX_VERSION_PACKET_CHARS = 50;

/**
 * Port of upstream `MAX_EVENT_TYPES`.
 * Role: Defines the dispatch table height for top-level event categories.
 * Ledger: MAC-16A9AF
 * Upstream: event_handler.h:304
 */
export const MAX_EVENT_TYPES = 5;

/**
 * Port of upstream `MAX_FUNCTIONS`.
 * Role: Defines the dispatch table width allocated for event functions.
 * Ledger: MAC-6FF2C3
 * Upstream: event_handler.h:305
 */
export const MAX_FUNCTIONS = 200;
