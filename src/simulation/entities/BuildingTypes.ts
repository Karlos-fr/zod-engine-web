/**
 * Upstream: bbridge.h, bfort.h, bradar.h, brepair.h, brobot.h, bvehicle.h, zbuilding.h
 */

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bbridge.h:2
 */
export const BBRIDGE_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bfort.h:2
 */
export const BFORT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bradar.h:2
 */
export const BRADAR_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: brepair.h:2
 */
export const BREPAIR_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: brobot.h:2
 */
export const BROBOT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bvehicle.h:2
 */
export const BVEHICLE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZBUILDING_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zbuilding.h:2
 */
export const ZBUILDING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_QUEUE_ITEMS`.
 * Role: Defines the maximum number of queued production units for a building.
 * Upstream: zbuilding.h:8
 */
export const BUILDING_MAX_QUEUE_ITEMS = 5;

/**
 * Port of upstream `building_state`.
 * Role: Identifies the production state currently held by a building.
 * Upstream: zbuilding.h:10-13
 */
export enum BuildingState {
  Place = 0,
  Select = 1,
  Building = 2,
  Paused = 3,
  MaxBuildingStates = 4,
}

/**
 * Port of upstream `ZBProductionUnit`.
 * Role: Stores the object type and object id queued for building production.
 * Upstream: zbuilding.h:18-25
 */
export class ZBProductionUnit {
  ot: number;
  oid: number;

  constructor(ot = 0, oid = 0) {
    this.ot = ot;
    this.oid = oid;
  }
}

/**
 * Port of upstream `ZBuilding` zone ownership field.
 * Role: Holds the zone ownership fraction used by building production timing.
 * Upstream: zbuilding.h:69, zbuilding.h:87
 */
export type BuildingZoneOwnageState = {
  zoneOwnage: number;
};

/**
 * Port of upstream `ZBuilding` production timing fields.
 * Role: Holds the total production duration tracked for the current build.
 * Upstream: zbuilding.h:51, zbuilding.h:84
 */
export type BuildingProductionTimeState = {
  totalProductionTime: number;
};

/**
 * Port of upstream `ZBuilding::SetZoneOwnage`.
 * Role: Updates the building zone ownership fraction.
 * Upstream: zbuilding.h:69
 */
export function setBuildingZoneOwnage(
  state: BuildingZoneOwnageState,
  zoneOwnage: number,
): void {
  state.zoneOwnage = zoneOwnage;
}

/**
 * Port of upstream `ProductionTimeTotal`.
 * Role: Returns the total production duration tracked for the current build.
 * Upstream: zbuilding.h:51
 */
export function getBuildingProductionTimeTotal(
  state: BuildingProductionTimeState,
): number {
  return state.totalProductionTime;
}

/**
 * Port of upstream `min_interval_time` from `BVehicle`.
 * Role: Defines the minimum time interval between vehicle factory process updates.
 * Upstream: bvehicle.cpp:139
 */
export const VEHICLE_FACTORY_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `exhaust_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory exhaust effect source.
 * Upstream: bvehicle.cpp:232
 */
export const VEHICLE_FACTORY_EXHAUST_X_PIXELS = 28;

/**
 * Port of upstream `exhaust_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory exhaust effect source.
 * Upstream: bvehicle.cpp:233
 */
export const VEHICLE_FACTORY_EXHAUST_Y_PIXELS = -22;

/**
 * Port of upstream `bulb_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory bulb effect source.
 * Upstream: bvehicle.cpp:224
 */
export const VEHICLE_FACTORY_BULB_X_PIXELS = 24;

/**
 * Port of upstream `bulb_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory bulb effect source.
 * Upstream: bvehicle.cpp:225
 */
export const VEHICLE_FACTORY_BULB_Y_PIXELS = 39;

/**
 * Port of upstream `x_plus` from `BVehicle`.
 * Role: Defines the additional x offset applied while rendering the vehicle factory building effect layer.
 * Upstream: bvehicle.cpp:361
 */
export const VEHICLE_FACTORY_EFFECT_X_OFFSET_PIXELS = 15;

/**
 * Port of upstream `y_plus` from `BVehicle`.
 * Role: Defines the additional y offset applied while rendering the vehicle factory building effect layer.
 * Upstream: bvehicle.cpp:362
 */
export const VEHICLE_FACTORY_EFFECT_Y_OFFSET_PIXELS = 8;

/**
 * Port of upstream `level_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory level indicator effect source.
 * Upstream: bvehicle.cpp:176, bvehicle.cpp:228
 */
export const VEHICLE_FACTORY_LEVEL_X_PIXELS = 8;

/**
 * Port of upstream `level_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory level indicator effect source.
 * Upstream: bvehicle.cpp:177, bvehicle.cpp:229
 */
export const VEHICLE_FACTORY_LEVEL_Y_PIXELS = 56;

/**
 * Port of upstream `lights_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory lights effect source.
 * Upstream: bvehicle.cpp:231
 */
export const VEHICLE_FACTORY_LIGHTS_Y_PIXELS = 47;

/**
 * Port of upstream `spin_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory spinner effect source.
 * Upstream: bvehicle.cpp:220
 */
export const VEHICLE_FACTORY_SPINNER_X_PIXELS = 9;

/**
 * Port of upstream `spin_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory spinner effect source.
 * Upstream: bvehicle.cpp:221
 */
export const VEHICLE_FACTORY_SPINNER_Y_PIXELS = -2;

/**
 * Port of upstream `tank_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory tank effect source.
 * Upstream: bvehicle.cpp:226
 */
export const VEHICLE_FACTORY_TANK_X_PIXELS = 16;

/**
 * Port of upstream `tank_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory tank effect source.
 * Upstream: bvehicle.cpp:227
 */
export const VEHICLE_FACTORY_TANK_Y_PIXELS = 48;

/**
 * Port of upstream `vent_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory vent effect source.
 * Upstream: bvehicle.cpp:222
 */
export const VEHICLE_FACTORY_VENT_X_PIXELS = 16;

/**
 * Port of upstream `vent_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory vent effect source.
 * Upstream: bvehicle.cpp:223
 */
export const VEHICLE_FACTORY_VENT_Y_PIXELS = 32;

/**
 * Port of upstream `min_interval_time` from `BRobot`.
 * Role: Defines the minimum time interval between robot factory process updates.
 * Upstream: brobot.cpp:138
 */
export const ROBOT_FACTORY_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `double_light_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory double-light effect source.
 * Upstream: brobot.cpp:221
 */
export const ROBOT_FACTORY_DOUBLE_LIGHT_X_PIXELS = 16;

/**
 * Port of upstream `double_light_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory double-light effect source.
 * Upstream: brobot.cpp:222
 */
export const ROBOT_FACTORY_DOUBLE_LIGHT_Y_PIXELS = 32;

/**
 * Port of upstream `exhaust_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory exhaust effect source.
 * Upstream: brobot.cpp:229
 */
export const ROBOT_FACTORY_EXHAUST_X_PIXELS = 28;

/**
 * Port of upstream `exhaust_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory exhaust effect source.
 * Upstream: brobot.cpp:230
 */
export const ROBOT_FACTORY_EXHAUST_Y_PIXELS = -24;

/**
 * Port of upstream `green_box_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory green-box effect source.
 * Upstream: brobot.cpp:227
 */
export const ROBOT_FACTORY_GREEN_BOX_X_PIXELS = 38;

/**
 * Port of upstream `green_box_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory green-box effect source.
 * Upstream: brobot.cpp:228
 */
export const ROBOT_FACTORY_GREEN_BOX_Y_PIXELS = 39;

/**
 * Port of upstream `level_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory level indicator effect source.
 * Upstream: brobot.cpp:225
 */
export const ROBOT_FACTORY_LEVEL_X_PIXELS = 8;

/**
 * Port of upstream `level_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory level indicator effect source.
 * Upstream: brobot.cpp:226
 */
export const ROBOT_FACTORY_LEVEL_Y_PIXELS = 56;

/**
 * Port of upstream `robot_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory robot-body effect source.
 * Upstream: brobot.cpp:219
 */
export const ROBOT_FACTORY_ROBOT_X_PIXELS = 16;

/**
 * Port of upstream `robot_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory robot-body effect source.
 * Upstream: brobot.cpp:220
 */
export const ROBOT_FACTORY_ROBOT_Y_PIXELS = 48;

/**
 * Port of upstream `single_light_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory single-light effect source.
 * Upstream: brobot.cpp:224
 */
export const ROBOT_FACTORY_SINGLE_LIGHT_Y_PIXELS = 68;

/**
 * Port of upstream `spin_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory spinner effect source.
 * Upstream: brobot.cpp:217
 */
export const ROBOT_FACTORY_SPINNER_X_PIXELS = 9;

/**
 * Port of upstream `spin_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory spinner effect source.
 * Upstream: brobot.cpp:218
 */
export const ROBOT_FACTORY_SPINNER_Y_PIXELS = -2;

/**
 * Port of upstream `x_plus` from `BRobot`.
 * Role: Defines the additional x offset applied while rendering the robot factory building effect layer.
 * Upstream: brobot.cpp:360
 */
export const ROBOT_FACTORY_EFFECT_X_OFFSET_PIXELS = 19;

/**
 * Port of upstream `y_plus` from `BRobot`.
 * Role: Defines the additional y offset applied while rendering the robot factory building effect layer.
 * Upstream: brobot.cpp:361
 */
export const ROBOT_FACTORY_EFFECT_Y_OFFSET_PIXELS = 8;

/**
 * Port of upstream `min_interval_time` from `BRepair`.
 * Role: Defines the minimum time interval between repair building process updates.
 * Upstream: brepair.cpp:125
 */
export const REPAIR_MIN_PROCESS_INTERVAL_SECONDS = 0.35;

/**
 * Port of upstream `front_light_x` from `BRepair`.
 * Role: Defines the x offset of the repair building front-light effect source.
 * Upstream: brepair.cpp:208
 */
export const REPAIR_FRONT_LIGHT_X_PIXELS = 6;

/**
 * Port of upstream `front_light_y` from `BRepair`.
 * Role: Defines the y offset of the repair building front-light effect source.
 * Upstream: brepair.cpp:209
 */
export const REPAIR_FRONT_LIGHT_Y_PIXELS = 16;

/**
 * Port of upstream `side_light_x` from `BRepair`.
 * Role: Defines the x offset of the repair building side-light effect source.
 * Upstream: brepair.cpp:210
 */
export const REPAIR_SIDE_LIGHT_X_PIXELS = 18;

/**
 * Port of upstream `side_light_y` from `BRepair`.
 * Role: Defines the y offset of the repair building side-light effect source.
 * Upstream: brepair.cpp:211
 */
export const REPAIR_SIDE_LIGHT_Y_PIXELS = 6;

/**
 * Port of upstream `bulb_x` from `BRepair`.
 * Role: Defines the x offset of the repair building bulb effect source.
 * Upstream: brepair.cpp:212
 */
export const REPAIR_BULB_X_PIXELS = 32;

/**
 * Port of upstream `bulb_y` from `BRepair`.
 * Role: Defines the y offset of the repair building bulb effect source.
 * Upstream: brepair.cpp:213
 */
export const REPAIR_BULB_Y_PIXELS = 0;

/**
 * Port of upstream `smoke_stack_x` from `BRepair`.
 * Role: Defines the x offset of the repair building smoke-stack effect source.
 * Upstream: brepair.cpp:214
 */
export const REPAIR_SMOKE_STACK_X_PIXELS = 61;

/**
 * Port of upstream `smoke_stack_y` from `BRepair`.
 * Role: Defines the y offset of the repair building smoke-stack effect source.
 * Upstream: brepair.cpp:215
 */
export const REPAIR_SMOKE_STACK_Y_PIXELS = 0;

/**
 * Port of upstream `text_box_x` from `BRepair`.
 * Role: Defines the x offset of the repair building status text box source.
 * Upstream: brepair.cpp:216
 */
export const REPAIR_TEXT_BOX_X_PIXELS = 16;

/**
 * Port of upstream `text_box_y` from `BRepair`.
 * Role: Defines the y offset of the repair building status text box source.
 * Upstream: brepair.cpp:217
 */
export const REPAIR_TEXT_BOX_Y_PIXELS = 32;

/**
 * Port of upstream `x_plus` from `BRepair`.
 * Role: Defines the additional x offset applied while rendering the repair building effect layer.
 * Upstream: brepair.cpp:239, brepair.cpp:357
 */
export const REPAIR_EFFECT_X_OFFSET_PIXELS = 10;

/**
 * Port of upstream `y_plus` from `BRepair`.
 * Role: Defines the additional y offset applied while rendering the repair building effect layer.
 * Upstream: brepair.cpp:240, brepair.cpp:358
 */
export const REPAIR_EFFECT_Y_OFFSET_PIXELS = 6;

/**
 * Port of upstream `min_interval_time`.
 * Role: Defines the minimum time interval between radar building process updates.
 * Upstream: bradar.cpp:118
 */
export const RADAR_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `front_light_x`.
 * Role: Defines the x offset of the radar building front-light effect source.
 * Upstream: bradar.cpp:194
 */
export const RADAR_FRONT_LIGHT_X_PIXELS = 16;

/**
 * Port of upstream `front_light_y`.
 * Role: Defines the y offset of the radar building front-light effect source.
 * Upstream: bradar.cpp:195
 */
export const RADAR_FRONT_LIGHT_Y_PIXELS = 22;

/**
 * Port of upstream `side_light_x`.
 * Role: Defines the x offset of the radar building side-light effect source.
 * Upstream: bradar.cpp:196
 */
export const RADAR_SIDE_LIGHT_X_PIXELS = 41;

/**
 * Port of upstream `side_light_y`.
 * Role: Defines the y offset of the radar building side-light effect source.
 * Upstream: bradar.cpp:197
 */
export const RADAR_SIDE_LIGHT_Y_PIXELS = 0;

/**
 * Port of upstream `box_spinner_x`.
 * Role: Defines the x offset of the radar building box-spinner effect source.
 * Upstream: bradar.cpp:198
 */
export const RADAR_BOX_SPINNER_X_PIXELS = 18;

/**
 * Port of upstream `box_spinner_y`.
 * Role: Defines the y offset of the radar building box-spinner effect source.
 * Upstream: bradar.cpp:199
 */
export const RADAR_BOX_SPINNER_Y_PIXELS = 13;

/**
 * Port of upstream `dish_x`.
 * Role: Defines the x offset of the radar building dish effect source.
 * Upstream: bradar.cpp:200
 */
export const RADAR_DISH_X_PIXELS = 15;

/**
 * Port of upstream `x_plus`.
 * Role: Defines the additional x offset applied while rendering the radar building effect layer.
 * Upstream: bradar.cpp:276
 */
export const RADAR_EFFECT_X_OFFSET_PIXELS = 12;

/**
 * Port of upstream `y_plus`.
 * Role: Defines the additional y offset applied while rendering the radar building effect layer.
 * Upstream: bradar.cpp:277
 */
export const RADAR_EFFECT_Y_OFFSET_PIXELS = 0;
