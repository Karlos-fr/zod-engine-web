/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: vapc.cpp, vapc.h, vcrane.cpp, vcrane.h, vheavy.cpp, vheavy.h,
 *   vjeep.cpp, vjeep.h, vlight.cpp, vlight.h, vmedium.cpp, vmedium.h,
 *   vmissilelauncher.cpp, vmissilelauncher.h, zvehicle.h
 * - Symbols: turrent_time_int, _VAPC_H_, hook_time_int, _VCRANE_H_, _VHEAVY_H_,
 *   base_time_int, _VJEEP_H_, _VLIGHT_H_, lid_shift_x, lid_shift_y,
 *   _VMEDIUM_H_, _VMISSILELAUNCHER_H_, _ZVEHICLE_H_
 * - Ledger: CON-08F69F, CON-16143C, CON-170FAF, CON-522E47, CON-5F6CA0,
 *   CON-841EC3, CON-F3CA14, CON-FC26A8, CON-261D7F, CON-31DD6E,
 *   CON-4640CD, MAC-3BA9BD, MAC-4D6EEA, MAC-581266, MAC-6DE558,
 *   MAC-8A1322, MAC-C0D0D9, MAC-D13C6B, MAC-D8F2C2
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
 * Port of upstream `turrent_time_int`.
 *
 * Role:
 * - Defines the seconds between heavy vehicle turret animation frame advances.
 *
 * Ledger: CON-08F69F
 * Upstream: vheavy.cpp:5
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 * - Uses `turret` in the TypeScript name while documenting the upstream
 *   `turrent` spelling.
 */
export const HEAVY_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 *
 * Role:
 * - Defines the seconds between light vehicle turret animation frame advances.
 *
 * Ledger: CON-4640CD
 * Upstream: vlight.cpp:5
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 * - Uses `turret` in the TypeScript name while documenting the upstream
 *   `turrent` spelling.
 */
export const LIGHT_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 *
 * Role:
 * - Defines the seconds between medium vehicle turret animation frame advances.
 *
 * Ledger: CON-261D7F
 * Upstream: vmedium.cpp:5
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 * - Uses `turret` in the TypeScript name while documenting the upstream
 *   `turrent` spelling.
 */
export const MEDIUM_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 *
 * Role:
 * - Defines the seconds between missile launcher turret animation frame
 *   advances.
 *
 * Ledger: CON-31DD6E
 * Upstream: vmissilelauncher.cpp:5
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 * - Uses `turret` in the TypeScript name while documenting the upstream
 *   `turrent` spelling.
 */
export const MISSILE_LAUNCHER_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `lid_shift_x`.
 *
 * Role:
 * - Defines the horizontal pixel offset used when rendering the medium
 *   vehicle lid overlay.
 *
 * Ledger: CON-841EC3
 * Upstream: vmedium.cpp:156
 *
 * Adaptation:
 * - Replaces the C++ local constant with a named TypeScript export so later
 *   medium vehicle rendering code can reuse the upstream offset.
 */
export const MEDIUM_LID_RENDER_OFFSET_X_PIXELS = 12;

/**
 * Port of upstream `lid_shift_y`.
 *
 * Role:
 * - Defines the vertical pixel offset used when rendering the medium vehicle
 *   lid overlay.
 *
 * Ledger: CON-F3CA14
 * Upstream: vmedium.cpp:157
 *
 * Adaptation:
 * - Replaces the C++ local constant with a named TypeScript export so later
 *   medium vehicle rendering code can reuse the upstream offset.
 */
export const MEDIUM_LID_RENDER_OFFSET_Y_PIXELS = -5;

/**
 * Port of upstream `turrent_time_int`.
 *
 * Role:
 * - Defines the seconds between jeep turret animation frame advances.
 *
 * Ledger: CON-522E47
 * Upstream: vjeep.cpp:6
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 * - Uses `turret` in the TypeScript name while documenting the upstream
 *   `turrent` spelling.
 */
export const JEEP_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `base_time_int`.
 *
 * Role:
 * - Defines the seconds between jeep base animation frame advances.
 *
 * Ledger: CON-5F6CA0
 * Upstream: vjeep.cpp:5
 *
 * Adaptation:
 * - Replaces the C++ file-scope constant with a named TypeScript export.
 */
export const JEEP_BASE_FRAME_INTERVAL_SECONDS = 0.25;

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

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `vheavy.h` include
 *   guard before the full `VHeavy` class is ported.
 *
 * Ledger: MAC-D8F2C2
 * Upstream: vheavy.h:2
 *
 * Adaptation:
 * - Replaces the C `_VHEAVY_H_` header guard with TypeScript module loading.
 */
export const VHEAVY_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `vjeep.h` include
 *   guard before the full `VJeep` class is ported.
 *
 * Ledger: MAC-3BA9BD
 * Upstream: vjeep.h:2
 *
 * Adaptation:
 * - Replaces the C `_VJEEP_H_` header guard with TypeScript module loading.
 */
export const VJEEP_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `vlight.h` include
 *   guard before the full `VLight` class is ported.
 *
 * Ledger: MAC-4D6EEA
 * Upstream: vlight.h:2
 *
 * Adaptation:
 * - Replaces the C `_VLIGHT_H_` header guard with TypeScript module loading.
 */
export const VLIGHT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `vmedium.h` include
 *   guard before the full `VMedium` class is ported.
 *
 * Ledger: MAC-D13C6B
 * Upstream: vmedium.h:2
 *
 * Adaptation:
 * - Replaces the C `_VMEDIUM_H_` header guard with TypeScript module loading.
 */
export const VMEDIUM_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `vmissilelauncher.h`
 *   include guard before the full `VMissileLauncher` class is ported.
 *
 * Ledger: MAC-8A1322
 * Upstream: vmissilelauncher.h:2
 *
 * Adaptation:
 * - Replaces the C `_VMISSILELAUNCHER_H_` header guard with TypeScript module
 *   loading.
 */
export const VMISSILE_LAUNCHER_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `zvehicle.h` include
 *   guard before the full `ZVehicle` base class is ported.
 *
 * Ledger: MAC-C0D0D9
 * Upstream: zvehicle.h:2
 *
 * Adaptation:
 * - Replaces the C `_ZVEHICLE_H_` header guard with TypeScript module loading.
 */
export const ZVEHICLE_HEADER_GUARD_PORTED = true;
