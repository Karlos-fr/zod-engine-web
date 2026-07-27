/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: zpsettings.cpp, zpsettings.h
 * - Symbols: buf_size, _ZPSETTINGS_H_
 * - Ledger: CON-D21333, MAC-2AAD55
 *
 * Porting notes:
 * - C++ settings parser constants are represented as named data constants.
 */

/**
 * Port of upstream `buf_size`.
 *
 * Role:
 * - Defines the fixed character buffer size used by the player settings file
 *   parser when reading persisted options.
 *
 * Ledger: CON-D21333
 * Upstream: zpsettings.cpp:46
 *
 * Adaptation:
 * - Replaces the C++ local constant with a typed TypeScript export so future
 *   settings parsing code can preserve the upstream read buffer limit.
 */
export const PLAYER_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the player settings data module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `zpsettings.h` include
 *   guard before the full `ZPSettings` class is ported.
 *
 * Ledger: MAC-2AAD55
 * Upstream: zpsettings.h:2
 *
 * Adaptation:
 * - Replaces the C `_ZPSETTINGS_H_` header guard with TypeScript module
 *   loading.
 */
export const ZPSETTINGS_HEADER_GUARD_PORTED = true;
