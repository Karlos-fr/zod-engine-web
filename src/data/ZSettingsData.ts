/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: zsettings.cpp, zsettings.h
 * - Symbols: run_past_radius, buf_size, _ZSETTINGS_H_
 * - Ledger: CON-9762E8, CON-DBE040, MAC-7732A2
 *
 * Porting notes:
 * - C++ gameplay settings constants are represented as named data constants.
 */

/**
 * Port of upstream `run_past_radius`.
 *
 * Role:
 * - Defines the radius used by unit settings when allowing movement to run
 *   past a target point.
 *
 * Ledger: CON-9762E8
 * Upstream: zsettings.cpp:16
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a typed TypeScript export for
 *   future settings and unit movement code.
 */
export const RUN_PAST_RADIUS = 1.3;

/**
 * Port of upstream `buf_size`.
 *
 * Role:
 * - Defines the fixed character buffer size used by the global settings file
 *   parser when reading persisted unit and gameplay options.
 *
 * Ledger: CON-DBE040
 * Upstream: zsettings.cpp:404
 *
 * Adaptation:
 * - Replaces the C++ local constant with a typed TypeScript export so future
 *   settings parsing code can preserve the upstream read buffer limit.
 */
export const GLOBAL_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the global settings data module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `zsettings.h` include
 *   guard before the full `ZSettings` and `ZUnit_Settings` classes are ported.
 *
 * Ledger: MAC-7732A2
 * Upstream: zsettings.h:2
 *
 * Adaptation:
 * - Replaces the C `_ZSETTINGS_H_` header guard with TypeScript module
 *   loading.
 */
export const ZSETTINGS_HEADER_GUARD_PORTED = true;
