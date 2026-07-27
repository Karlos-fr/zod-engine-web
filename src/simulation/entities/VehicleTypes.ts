/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: vapc.cpp, vapc.h, vcrane.cpp, vcrane.h
 * - Symbols: turrent_time_int, _VAPC_H_, hook_time_int, _VCRANE_H_
 * - Ledger: CON-16143C, CON-170FAF, CON-FC26A8, MAC-581266, MAC-6DE558
 *
 * Porting notes:
 * - Vehicle animation timing values are represented as named constants.
 * - Vehicle header guards are replaced by ES module boundaries.
 */

/**
 * Port of upstream `turrent_time_int`.
 *
 * Role:
 * - Defines the seconds between APC turret animation frame advances.
 *
 * Ledger: CON-170FAF
 * Upstream: vapc.cpp:5
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 * - Uses `turret` in the TypeScript name while documenting the upstream
 *   `turrent` spelling.
 */
export const APC_TURRET_FRAME_INTERVAL_SECONDS = 0.2;

/**
 * Port of upstream `turrent_time_int`.
 *
 * Role:
 * - Defines the seconds between crane turret animation frame advances.
 *
 * Ledger: CON-FC26A8
 * Upstream: vcrane.cpp:5
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 * - Uses `turret` in the TypeScript name while documenting the upstream
 *   `turrent` spelling.
 */
export const CRANE_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `hook_time_int`.
 *
 * Role:
 * - Defines the seconds between crane hook animation frame advances.
 *
 * Ledger: CON-16143C
 * Upstream: vcrane.cpp:6
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 */
export const CRANE_HOOK_FRAME_INTERVAL_SECONDS = 0.7;

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `vapc.h` include guard
 *   before the full `VAPC` class is ported.
 *
 * Ledger: MAC-581266
 * Upstream: vapc.h:2
 *
 * Adaptation:
 * - Replaces the C `_VAPC_H_` header guard with TypeScript module loading.
 */
export const VAPC_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `vcrane.h` include
 *   guard before the full `VCrane` class is ported.
 *
 * Ledger: MAC-6DE558
 * Upstream: vcrane.h:2
 *
 * Adaptation:
 * - Replaces the C `_VCRANE_H_` header guard with TypeScript module loading.
 */
export const VCRANE_HEADER_GUARD_PORTED = true;
