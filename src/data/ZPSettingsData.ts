/**
 * Upstream: zpsettings.cpp, zpsettings.h
 */

/**
 * Port of upstream `buf_size`.
 * Role: Defines the fixed character buffer size for the player settings file parser when reading persisted options.
 * Upstream: zpsettings.cpp:46
 */
export const PLAYER_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the player settings data module.
 * Role: Marks an upstream header boundary.
 * Upstream: zpsettings.h:2
 */
export const ZPSETTINGS_HEADER_GUARD_PORTED = true;
