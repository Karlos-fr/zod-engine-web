/**
 * Ported from Zod Engine.
 * Upstream: vapc.cpp, vapc.h, vcrane.cpp, vcrane.h, vheavy.cpp, vheavy.h,
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between APC turret animation frame advances.
 * Ledger: CON-170FAF
 * Upstream: vapc.cpp:5
 * Adaptation: Replaces the C++ file-scope constant with a named TypeScript export. * - Uses `turret` in the TypeScript name while documenting the upstream `turrent` spelling.
 */
export const APC_TURRET_FRAME_INTERVAL_SECONDS = 0.2;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between crane turret animation frame advances.
 * Ledger: CON-FC26A8
 * Upstream: vcrane.cpp:5
 * Adaptation: Replaces the C++ file-scope constant with a named TypeScript export. * - Uses `turret` in the TypeScript name while documenting the upstream `turrent` spelling.
 */
export const CRANE_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `hook_time_int`.
 * Role: Defines the seconds between crane hook animation frame advances.
 * Ledger: CON-16143C
 * Upstream: vcrane.cpp:6
 */
export const CRANE_HOOK_FRAME_INTERVAL_SECONDS = 0.7;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between heavy vehicle turret animation frame advances.
 * Ledger: CON-08F69F
 * Upstream: vheavy.cpp:5
 * Adaptation: Replaces the C++ file-scope constant with a named TypeScript export. * - Uses `turret` in the TypeScript name while documenting the upstream `turrent` spelling.
 */
export const HEAVY_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between light vehicle turret animation frame advances.
 * Ledger: CON-4640CD
 * Upstream: vlight.cpp:5
 * Adaptation: Replaces the C++ file-scope constant with a named TypeScript export. * - Uses `turret` in the TypeScript name while documenting the upstream `turrent` spelling.
 */
export const LIGHT_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between medium vehicle turret animation frame advances.
 * Ledger: CON-261D7F
 * Upstream: vmedium.cpp:5
 * Adaptation: Replaces the C++ file-scope constant with a named TypeScript export. * - Uses `turret` in the TypeScript name while documenting the upstream `turrent` spelling.
 */
export const MEDIUM_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between missile launcher turret animation frame advances.
 * Ledger: CON-31DD6E
 * Upstream: vmissilelauncher.cpp:5
 * Adaptation: Replaces the C++ file-scope constant with a named TypeScript export. * - Uses `turret` in the TypeScript name while documenting the upstream `turrent` spelling.
 */
export const MISSILE_LAUNCHER_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `lid_shift_x`.
 * Role: Defines the horizontal pixel offset used when rendering the medium vehicle lid overlay.
 * Ledger: CON-841EC3
 * Upstream: vmedium.cpp:156
 * Adaptation: Replaces the C++ local constant with a named TypeScript export so later medium vehicle rendering code can reuse the upstream offset.
 */
export const MEDIUM_LID_RENDER_OFFSET_X_PIXELS = 12;

/**
 * Port of upstream `lid_shift_y`.
 * Role: Defines the vertical pixel offset used when rendering the medium vehicle lid overlay.
 * Ledger: CON-F3CA14
 * Upstream: vmedium.cpp:157
 * Adaptation: Replaces the C++ local constant with a named TypeScript export so later medium vehicle rendering code can reuse the upstream offset.
 */
export const MEDIUM_LID_RENDER_OFFSET_Y_PIXELS = -5;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between jeep turret animation frame advances.
 * Ledger: CON-522E47
 * Upstream: vjeep.cpp:6
 * Adaptation: Replaces the C++ file-scope constant with a named TypeScript export. * - Uses `turret` in the TypeScript name while documenting the upstream `turrent` spelling.
 */
export const JEEP_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `base_time_int`.
 * Role: Defines the seconds between jeep base animation frame advances.
 * Ledger: CON-5F6CA0
 * Upstream: vjeep.cpp:5
 */
export const JEEP_BASE_FRAME_INTERVAL_SECONDS = 0.25;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `vapc.h`.
 * Ledger: MAC-581266
 * Upstream: vapc.h:2
 */
export const VAPC_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `vcrane.h`.
 * Ledger: MAC-6DE558
 * Upstream: vcrane.h:2
 */
export const VCRANE_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `vheavy.h`.
 * Ledger: MAC-D8F2C2
 * Upstream: vheavy.h:2
 */
export const VHEAVY_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `vjeep.h`.
 * Ledger: MAC-3BA9BD
 * Upstream: vjeep.h:2
 */
export const VJEEP_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `vlight.h`.
 * Ledger: MAC-4D6EEA
 * Upstream: vlight.h:2
 */
export const VLIGHT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `vmedium.h`.
 * Ledger: MAC-D13C6B
 * Upstream: vmedium.h:2
 */
export const VMEDIUM_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `vmissilelauncher.h`.
 * Ledger: MAC-8A1322
 * Upstream: vmissilelauncher.h:2
 */
export const VMISSILE_LAUNCHER_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks the TypeScript module boundary for upstream `zvehicle.h`.
 * Ledger: MAC-C0D0D9
 * Upstream: zvehicle.h:2
 */
export const ZVEHICLE_HEADER_GUARD_PORTED = true;
