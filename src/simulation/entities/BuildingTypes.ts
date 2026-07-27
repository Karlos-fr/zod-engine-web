/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: bbridge.h, bfort.h, bradar.h, brepair.h, bradar.cpp, brepair.cpp,
 *   brobot.cpp
 * - Symbols: _BBRIDGE_H_, _BFORT_H_, _BRADAR_H_, _BREPAIR_H_,
 *   box_spinner_x, box_spinner_y, bulb_x, bulb_y, dish_x, double_light_x,
 *   exhaust_y, front_light_x, front_light_y, green_box_x, green_box_y,
 *   min_interval_time, robot_x, robot_y, side_light_x, side_light_y,
 *   smoke_stack_x, smoke_stack_y, text_box_x, text_box_y, spin_x, spin_y,
 *   x_plus, y_plus
 * - Ledger: MAC-09DFD1, MAC-189091, MAC-BBC4DD, CON-25DB3E, CON-30AB1E,
 *   CON-77BBB1, CON-7BB0C5, CON-853627, CON-A5E131, CON-D1A073,
 *   CON-D2A8A6, CON-E501C6, CON-EBA752, CON-0DF011, CON-1329A3,
 *   CON-1DC64D, CON-2E8243, CON-34142A, CON-3C2846, CON-3FE461,
 *   CON-7C6665, CON-91192A, CON-B35129, CON-DE02B1, CON-F0AC7E,
 *   CON-F8EF0D, MAC-F5FC59, CON-1C30E4, CON-243565, CON-37D778,
 *   CON-3CBE11, CON-550D5E, CON-5F7D01, CON-626CD9, CON-896ADD,
 *   CON-B6F0A4, CON-BEDC34
 *
 * Porting notes:
 * - Building header guards are replaced by ES module boundaries.
 */

/**
 * Marker exported from the building type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `bbridge.h` include
 *   guard before the full `BBridge` class is ported.
 *
 * Ledger: MAC-09DFD1
 * Upstream: bbridge.h:2
 *
 * Adaptation:
 * - Replaces the C `_BBRIDGE_H_` header guard with TypeScript module loading.
 */
export const BBRIDGE_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `bfort.h` include
 *   guard before the full `BFort` class is ported.
 *
 * Ledger: MAC-189091
 * Upstream: bfort.h:2
 *
 * Adaptation:
 * - Replaces the C `_BFORT_H_` header guard with TypeScript module loading.
 */
export const BFORT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `bradar.h` include
 *   guard before the full `BRadar` class is ported.
 *
 * Ledger: MAC-BBC4DD
 * Upstream: bradar.h:2
 *
 * Adaptation:
 * - Replaces the C `_BRADAR_H_` header guard with TypeScript module loading.
 */
export const BRADAR_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `brepair.h` include
 *   guard before the full `BRepair` class is ported.
 *
 * Ledger: MAC-F5FC59
 * Upstream: brepair.h:2
 *
 * Adaptation:
 * - Replaces the C `_BREPAIR_H_` header guard with TypeScript module loading.
 */
export const BREPAIR_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `min_interval_time` from `BRobot`.
 *
 * Role:
 * - Defines the minimum time interval between robot factory process updates.
 *
 * Ledger: CON-896ADD
 * Upstream: brobot.cpp:138
 *
 * Notes:
 * - Unit is seconds.
 * - Kept separate from the `BRadar` and `BRepair` constants with the same
 *   upstream name.
 */
export const ROBOT_FACTORY_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `double_light_x` from `BRobot`.
 *
 * Role:
 * - Defines the x offset of the robot factory double-light effect source.
 *
 * Ledger: CON-243565
 * Upstream: brobot.cpp:221
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_DOUBLE_LIGHT_X_PIXELS = 16;

/**
 * Port of upstream `exhaust_y` from `BRobot`.
 *
 * Role:
 * - Defines the y offset of the robot factory exhaust effect source.
 *
 * Ledger: CON-5F7D01
 * Upstream: brobot.cpp:230
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_EXHAUST_Y_PIXELS = -24;

/**
 * Port of upstream `green_box_x` from `BRobot`.
 *
 * Role:
 * - Defines the x offset of the robot factory green-box effect source.
 *
 * Ledger: CON-550D5E
 * Upstream: brobot.cpp:227
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_GREEN_BOX_X_PIXELS = 38;

/**
 * Port of upstream `green_box_y` from `BRobot`.
 *
 * Role:
 * - Defines the y offset of the robot factory green-box effect source.
 *
 * Ledger: CON-37D778
 * Upstream: brobot.cpp:228
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_GREEN_BOX_Y_PIXELS = 39;

/**
 * Port of upstream `robot_x` from `BRobot`.
 *
 * Role:
 * - Defines the x offset of the robot factory robot-body effect source.
 *
 * Ledger: CON-626CD9
 * Upstream: brobot.cpp:219
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_ROBOT_X_PIXELS = 16;

/**
 * Port of upstream `robot_y` from `BRobot`.
 *
 * Role:
 * - Defines the y offset of the robot factory robot-body effect source.
 *
 * Ledger: CON-BEDC34
 * Upstream: brobot.cpp:220
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_ROBOT_Y_PIXELS = 48;

/**
 * Port of upstream `spin_x` from `BRobot`.
 *
 * Role:
 * - Defines the x offset of the robot factory spinner effect source.
 *
 * Ledger: CON-3CBE11
 * Upstream: brobot.cpp:217
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_SPINNER_X_PIXELS = 9;

/**
 * Port of upstream `spin_y` from `BRobot`.
 *
 * Role:
 * - Defines the y offset of the robot factory spinner effect source.
 *
 * Ledger: CON-B6F0A4
 * Upstream: brobot.cpp:218
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const ROBOT_FACTORY_SPINNER_Y_PIXELS = -2;

/**
 * Port of upstream `x_plus` from `BRobot`.
 *
 * Role:
 * - Defines the additional x offset applied while rendering the robot factory
 *   building effect layer.
 *
 * Ledger: CON-1C30E4
 * Upstream: brobot.cpp:360
 *
 * Adaptation:
 * - Evaluates the C++ expression `35 - 16` as a named number.
 */
export const ROBOT_FACTORY_EFFECT_X_OFFSET_PIXELS = 19;

/**
 * Port of upstream `min_interval_time` from `BRepair`.
 *
 * Role:
 * - Defines the minimum time interval between repair building process updates.
 *
 * Ledger: CON-91192A
 * Upstream: brepair.cpp:125
 *
 * Notes:
 * - Unit is seconds.
 * - Kept separate from the `BRadar` constant with the same upstream name.
 */
export const REPAIR_MIN_PROCESS_INTERVAL_SECONDS = 0.35;

/**
 * Port of upstream `front_light_x` from `BRepair`.
 *
 * Role:
 * - Defines the x offset of the repair building front-light effect source.
 *
 * Ledger: CON-0DF011
 * Upstream: brepair.cpp:208
 *
 * Notes:
 * - Unit is source image pixels.
 * - Kept separate from the `BRadar` constant with the same upstream name.
 */
export const REPAIR_FRONT_LIGHT_X_PIXELS = 6;

/**
 * Port of upstream `front_light_y` from `BRepair`.
 *
 * Role:
 * - Defines the y offset of the repair building front-light effect source.
 *
 * Ledger: CON-2E8243
 * Upstream: brepair.cpp:209
 *
 * Notes:
 * - Unit is source image pixels.
 * - Kept separate from the `BRadar` constant with the same upstream name.
 */
export const REPAIR_FRONT_LIGHT_Y_PIXELS = 16;

/**
 * Port of upstream `side_light_x` from `BRepair`.
 *
 * Role:
 * - Defines the x offset of the repair building side-light effect source.
 *
 * Ledger: CON-3FE461
 * Upstream: brepair.cpp:210
 *
 * Notes:
 * - Unit is source image pixels.
 * - Kept separate from the `BRadar` constant with the same upstream name.
 */
export const REPAIR_SIDE_LIGHT_X_PIXELS = 18;

/**
 * Port of upstream `side_light_y` from `BRepair`.
 *
 * Role:
 * - Defines the y offset of the repair building side-light effect source.
 *
 * Ledger: CON-7C6665
 * Upstream: brepair.cpp:211
 *
 * Notes:
 * - Unit is source image pixels.
 * - Kept separate from the `BRadar` constant with the same upstream name.
 */
export const REPAIR_SIDE_LIGHT_Y_PIXELS = 6;

/**
 * Port of upstream `bulb_x` from `BRepair`.
 *
 * Role:
 * - Defines the x offset of the repair building bulb effect source.
 *
 * Ledger: CON-34142A
 * Upstream: brepair.cpp:212
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const REPAIR_BULB_X_PIXELS = 32;

/**
 * Port of upstream `bulb_y` from `BRepair`.
 *
 * Role:
 * - Defines the y offset of the repair building bulb effect source.
 *
 * Ledger: CON-1329A3
 * Upstream: brepair.cpp:213
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const REPAIR_BULB_Y_PIXELS = 0;

/**
 * Port of upstream `smoke_stack_x` from `BRepair`.
 *
 * Role:
 * - Defines the x offset of the repair building smoke-stack effect source.
 *
 * Ledger: CON-3C2846
 * Upstream: brepair.cpp:214
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const REPAIR_SMOKE_STACK_X_PIXELS = 61;

/**
 * Port of upstream `smoke_stack_y` from `BRepair`.
 *
 * Role:
 * - Defines the y offset of the repair building smoke-stack effect source.
 *
 * Ledger: CON-DE02B1
 * Upstream: brepair.cpp:215
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const REPAIR_SMOKE_STACK_Y_PIXELS = 0;

/**
 * Port of upstream `text_box_x` from `BRepair`.
 *
 * Role:
 * - Defines the x offset of the repair building status text box source.
 *
 * Ledger: CON-B35129
 * Upstream: brepair.cpp:216
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const REPAIR_TEXT_BOX_X_PIXELS = 16;

/**
 * Port of upstream `text_box_y` from `BRepair`.
 *
 * Role:
 * - Defines the y offset of the repair building status text box source.
 *
 * Ledger: CON-F8EF0D
 * Upstream: brepair.cpp:217
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const REPAIR_TEXT_BOX_Y_PIXELS = 32;

/**
 * Port of upstream `x_plus` from `BRepair`.
 *
 * Role:
 * - Defines the additional x offset applied while rendering the repair
 *   building effect layer.
 *
 * Ledger: CON-1DC64D
 * Upstream: brepair.cpp:239, brepair.cpp:357
 *
 * Adaptation:
 * - Evaluates the C++ expression `26 - 16` as a named number.
 * - Kept separate from the `BRadar` constant with the same upstream name.
 * - Reused for both upstream `BRepair` local constants with this expression.
 */
export const REPAIR_EFFECT_X_OFFSET_PIXELS = 10;

/**
 * Port of upstream `y_plus` from `BRepair`.
 *
 * Role:
 * - Defines the additional y offset applied while rendering the repair
 *   building effect layer.
 *
 * Ledger: CON-F0AC7E
 * Upstream: brepair.cpp:240, brepair.cpp:358
 *
 * Adaptation:
 * - Evaluates the C++ expression `30 - 24` as a named number.
 * - Kept separate from the `BRadar` constant with the same upstream name.
 * - Reused for both upstream `BRepair` local constants with this expression.
 */
export const REPAIR_EFFECT_Y_OFFSET_PIXELS = 6;

/**
 * Port of upstream `min_interval_time`.
 *
 * Role:
 * - Defines the minimum time interval between radar building process updates.
 *
 * Ledger: CON-A5E131
 * Upstream: bradar.cpp:118
 *
 * Notes:
 * - Unit is seconds.
 */
export const RADAR_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `front_light_x`.
 *
 * Role:
 * - Defines the x offset of the radar building front-light effect source.
 *
 * Ledger: CON-D2A8A6
 * Upstream: bradar.cpp:194
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const RADAR_FRONT_LIGHT_X_PIXELS = 16;

/**
 * Port of upstream `front_light_y`.
 *
 * Role:
 * - Defines the y offset of the radar building front-light effect source.
 *
 * Ledger: CON-7BB0C5
 * Upstream: bradar.cpp:195
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const RADAR_FRONT_LIGHT_Y_PIXELS = 22;

/**
 * Port of upstream `side_light_x`.
 *
 * Role:
 * - Defines the x offset of the radar building side-light effect source.
 *
 * Ledger: CON-25DB3E
 * Upstream: bradar.cpp:196
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const RADAR_SIDE_LIGHT_X_PIXELS = 41;

/**
 * Port of upstream `side_light_y`.
 *
 * Role:
 * - Defines the y offset of the radar building side-light effect source.
 *
 * Ledger: CON-E501C6
 * Upstream: bradar.cpp:197
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const RADAR_SIDE_LIGHT_Y_PIXELS = 0;

/**
 * Port of upstream `box_spinner_x`.
 *
 * Role:
 * - Defines the x offset of the radar building box-spinner effect source.
 *
 * Ledger: CON-853627
 * Upstream: bradar.cpp:198
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const RADAR_BOX_SPINNER_X_PIXELS = 18;

/**
 * Port of upstream `box_spinner_y`.
 *
 * Role:
 * - Defines the y offset of the radar building box-spinner effect source.
 *
 * Ledger: CON-EBA752
 * Upstream: bradar.cpp:199
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const RADAR_BOX_SPINNER_Y_PIXELS = 13;

/**
 * Port of upstream `dish_x`.
 *
 * Role:
 * - Defines the x offset of the radar building dish effect source.
 *
 * Ledger: CON-30AB1E
 * Upstream: bradar.cpp:200
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const RADAR_DISH_X_PIXELS = 15;

/**
 * Port of upstream `x_plus`.
 *
 * Role:
 * - Defines the additional x offset applied while rendering the radar building
 *   effect layer.
 *
 * Ledger: CON-D1A073
 * Upstream: bradar.cpp:276
 *
 * Adaptation:
 * - Evaluates the C++ expression `28 - 16` as a named number.
 */
export const RADAR_EFFECT_X_OFFSET_PIXELS = 12;

/**
 * Port of upstream `y_plus`.
 *
 * Role:
 * - Defines the additional y offset applied while rendering the radar building
 *   effect layer.
 *
 * Ledger: CON-77BBB1
 * Upstream: bradar.cpp:277
 *
 * Adaptation:
 * - Evaluates the C++ expression `24 - 24` as a named number.
 */
export const RADAR_EFFECT_Y_OFFSET_PIXELS = 0;
