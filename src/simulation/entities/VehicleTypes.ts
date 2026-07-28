/**
 * Ported from Zod Engine.
 * Upstream: vapc.cpp, vapc.h, vcrane.cpp, vcrane.h, vheavy.cpp, vheavy.h,
 */

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between APC turret animation frame advances.
 * Ledger: CON-170FAF
 * Upstream: vapc.cpp:5
 */
export const APC_TURRET_FRAME_INTERVAL_SECONDS = 0.2;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between crane turret animation frame advances.
 * Ledger: CON-FC26A8
 * Upstream: vcrane.cpp:5
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
 */
export const HEAVY_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between light vehicle turret animation frame advances.
 * Ledger: CON-4640CD
 * Upstream: vlight.cpp:5
 */
export const LIGHT_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between medium vehicle turret animation frame advances.
 * Ledger: CON-261D7F
 * Upstream: vmedium.cpp:5
 */
export const MEDIUM_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between missile launcher turret animation frame advances.
 * Ledger: CON-31DD6E
 * Upstream: vmissilelauncher.cpp:5
 */
export const MISSILE_LAUNCHER_TURRET_FRAME_INTERVAL_SECONDS = 1.0;

/**
 * Port of upstream `lid_shift_x`.
 * Role: Defines the horizontal pixel offset used when rendering the medium vehicle lid overlay.
 * Ledger: CON-841EC3
 * Upstream: vmedium.cpp:156
 */
export const MEDIUM_LID_RENDER_OFFSET_X_PIXELS = 12;

/**
 * Port of upstream `lid_shift_y`.
 * Role: Defines the vertical pixel offset used when rendering the medium vehicle lid overlay.
 * Ledger: CON-F3CA14
 * Upstream: vmedium.cpp:157
 */
export const MEDIUM_LID_RENDER_OFFSET_Y_PIXELS = -5;

/**
 * Port of upstream `turrent_time_int`.
 * Role: Defines the seconds between jeep turret animation frame advances.
 * Ledger: CON-522E47
 * Upstream: vjeep.cpp:6
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
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-581266
 * Upstream: vapc.h:2
 */
export const VAPC_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-6DE558
 * Upstream: vcrane.h:2
 */
export const VCRANE_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-D8F2C2
 * Upstream: vheavy.h:2
 */
export const VHEAVY_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-3BA9BD
 * Upstream: vjeep.h:2
 */
export const VJEEP_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-4D6EEA
 * Upstream: vlight.h:2
 */
export const VLIGHT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-D13C6B
 * Upstream: vmedium.h:2
 */
export const VMEDIUM_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-8A1322
 * Upstream: vmissilelauncher.h:2
 */
export const VMISSILE_LAUNCHER_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the vehicle type module.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-C0D0D9
 * Upstream: zvehicle.h:2
 */
export const ZVEHICLE_HEADER_GUARD_PORTED = true;
