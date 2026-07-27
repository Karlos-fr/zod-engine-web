/**
 * Ported from Zod Engine.
 * Upstream: zsettings.cpp, zsettings.h
 * Symbols: run_past_radius, buf_size, _ZSETTINGS_H_
 */

/**
 * Port of upstream `run_past_radius`.
 * Role: Defines the radius used by unit settings when allowing movement to run past a target point.
 * Ledger: CON-9762E8
 * Upstream: zsettings.cpp:16
 * Adaptation: Replaces the C++ file-scope constant with a typed TypeScript export for future settings and unit movement code.
 */
export const RUN_PAST_RADIUS = 1.3;

/**
 * Port of upstream `buf_size`.
 * Role: Defines the fixed character buffer size used by the global settings file parser when reading persisted unit and gameplay options.
 * Ledger: CON-DBE040
 * Upstream: zsettings.cpp:404
 * Adaptation: Replaces the C++ local constant with a typed TypeScript export so future settings parsing code can preserve the upstream read buffer limit.
 */
export const GLOBAL_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the global settings data module.
 * Role: Marks the TypeScript module boundary for upstream `zsettings.h`.
 * Ledger: MAC-7732A2
 * Upstream: zsettings.h:2
 */
export const ZSETTINGS_HEADER_GUARD_PORTED = true;
