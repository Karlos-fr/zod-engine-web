/**
 * Upstream: zsettings.cpp, zsettings.h
 */

/**
 * Port of upstream `run_past_radius`.
 * Role: Defines the radius for unit settings when allowing movement to run past a target point.
 * Upstream: zsettings.cpp:16
 */
export const RUN_PAST_RADIUS = 1.3;

/**
 * Port of upstream `buf_size`.
 * Role: Defines the fixed character buffer size for the global settings file parser when reading persisted unit and gameplay options.
 * Upstream: zsettings.cpp:404
 */
export const GLOBAL_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the global settings data module.
 * Role: Marks an upstream header boundary.
 * Upstream: zsettings.h:2
 */
export const ZSETTINGS_HEADER_GUARD_PORTED = true;
