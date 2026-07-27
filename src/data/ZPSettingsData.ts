/**
 * Ported from Zod Engine.
 * Upstream: zpsettings.cpp, zpsettings.h
 * Symbols: buf_size, _ZPSETTINGS_H_
 */

/**
 * Port of upstream `buf_size`.
 * Role: Defines the fixed character buffer size used by the player settings file parser when reading persisted options.
 * Ledger: CON-D21333
 * Upstream: zpsettings.cpp:46
 * Adaptation: Replaces the C++ local constant with a typed TypeScript export so future settings parsing code can preserve the upstream read buffer limit.
 */
export const PLAYER_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the player settings data module.
 * Role: Marks the TypeScript module boundary for upstream `zpsettings.h`.
 * Ledger: MAC-2AAD55
 * Upstream: zpsettings.h:2
 */
export const ZPSETTINGS_HEADER_GUARD_PORTED = true;
