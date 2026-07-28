import { describe, expect, it } from "vitest";
import {
  BBRIDGE_HEADER_GUARD_PORTED,
  BFORT_HEADER_GUARD_PORTED,
  BRADAR_HEADER_GUARD_PORTED,
  BROBOT_HEADER_GUARD_PORTED,
  BREPAIR_HEADER_GUARD_PORTED,
  BVEHICLE_HEADER_GUARD_PORTED,
  BUILDING_MAX_QUEUE_ITEMS,
  BuildingState,
  getBuildingProductionTimeTotal,
  RADAR_BOX_SPINNER_X_PIXELS,
  RADAR_BOX_SPINNER_Y_PIXELS,
  RADAR_DISH_X_PIXELS,
  RADAR_EFFECT_X_OFFSET_PIXELS,
  RADAR_EFFECT_Y_OFFSET_PIXELS,
  RADAR_FRONT_LIGHT_X_PIXELS,
  RADAR_FRONT_LIGHT_Y_PIXELS,
  RADAR_MIN_PROCESS_INTERVAL_SECONDS,
  RADAR_SIDE_LIGHT_X_PIXELS,
  RADAR_SIDE_LIGHT_Y_PIXELS,
  ROBOT_FACTORY_DOUBLE_LIGHT_X_PIXELS,
  ROBOT_FACTORY_DOUBLE_LIGHT_Y_PIXELS,
  ROBOT_FACTORY_EFFECT_X_OFFSET_PIXELS,
  ROBOT_FACTORY_EFFECT_Y_OFFSET_PIXELS,
  ROBOT_FACTORY_EXHAUST_X_PIXELS,
  ROBOT_FACTORY_EXHAUST_Y_PIXELS,
  ROBOT_FACTORY_GREEN_BOX_X_PIXELS,
  ROBOT_FACTORY_GREEN_BOX_Y_PIXELS,
  ROBOT_FACTORY_LEVEL_X_PIXELS,
  ROBOT_FACTORY_LEVEL_Y_PIXELS,
  ROBOT_FACTORY_MIN_PROCESS_INTERVAL_SECONDS,
  ROBOT_FACTORY_ROBOT_X_PIXELS,
  ROBOT_FACTORY_ROBOT_Y_PIXELS,
  ROBOT_FACTORY_SINGLE_LIGHT_Y_PIXELS,
  ROBOT_FACTORY_SPINNER_X_PIXELS,
  ROBOT_FACTORY_SPINNER_Y_PIXELS,
  REPAIR_BULB_X_PIXELS,
  REPAIR_BULB_Y_PIXELS,
  REPAIR_EFFECT_X_OFFSET_PIXELS,
  REPAIR_EFFECT_Y_OFFSET_PIXELS,
  REPAIR_FRONT_LIGHT_X_PIXELS,
  REPAIR_FRONT_LIGHT_Y_PIXELS,
  REPAIR_MIN_PROCESS_INTERVAL_SECONDS,
  REPAIR_SIDE_LIGHT_X_PIXELS,
  REPAIR_SIDE_LIGHT_Y_PIXELS,
  REPAIR_SMOKE_STACK_X_PIXELS,
  REPAIR_SMOKE_STACK_Y_PIXELS,
  REPAIR_TEXT_BOX_X_PIXELS,
  REPAIR_TEXT_BOX_Y_PIXELS,
  setBuildingZoneOwnage,
  VEHICLE_FACTORY_BULB_X_PIXELS,
  VEHICLE_FACTORY_BULB_Y_PIXELS,
  VEHICLE_FACTORY_EFFECT_X_OFFSET_PIXELS,
  VEHICLE_FACTORY_EFFECT_Y_OFFSET_PIXELS,
  VEHICLE_FACTORY_EXHAUST_X_PIXELS,
  VEHICLE_FACTORY_EXHAUST_Y_PIXELS,
  VEHICLE_FACTORY_LEVEL_X_PIXELS,
  VEHICLE_FACTORY_LEVEL_Y_PIXELS,
  VEHICLE_FACTORY_LIGHTS_Y_PIXELS,
  VEHICLE_FACTORY_MIN_PROCESS_INTERVAL_SECONDS,
  VEHICLE_FACTORY_SPINNER_X_PIXELS,
  VEHICLE_FACTORY_SPINNER_Y_PIXELS,
  VEHICLE_FACTORY_TANK_X_PIXELS,
  VEHICLE_FACTORY_TANK_Y_PIXELS,
  VEHICLE_FACTORY_VENT_X_PIXELS,
  VEHICLE_FACTORY_VENT_Y_PIXELS,
  ZBProductionUnit,
  ZBUILDING_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/BuildingTypes";

describe("building types", () => {
  it("adapts the bbridge header guard to module boundaries", async () => {
    const firstImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );

    expect(BBRIDGE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.BBRIDGE_HEADER_GUARD_PORTED).toBe(
      firstImport.BBRIDGE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the bfort header guard to module boundaries", async () => {
    const firstImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );

    expect(BFORT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.BFORT_HEADER_GUARD_PORTED).toBe(
      firstImport.BFORT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the bradar header guard to module boundaries", async () => {
    const firstImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );

    expect(BRADAR_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.BRADAR_HEADER_GUARD_PORTED).toBe(
      firstImport.BRADAR_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the brepair header guard to module boundaries", async () => {
    const firstImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );

    expect(BREPAIR_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.BREPAIR_HEADER_GUARD_PORTED).toBe(
      firstImport.BREPAIR_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the brobot header guard to module boundaries", async () => {
    const firstImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );

    expect(BROBOT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.BROBOT_HEADER_GUARD_PORTED).toBe(
      firstImport.BROBOT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the bvehicle header guard to module boundaries", async () => {
    const firstImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );

    expect(BVEHICLE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.BVEHICLE_HEADER_GUARD_PORTED).toBe(
      firstImport.BVEHICLE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the zbuilding header guard to module boundaries", async () => {
    const firstImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/BuildingTypes"
    );

    expect(ZBUILDING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZBUILDING_HEADER_GUARD_PORTED).toBe(
      firstImport.ZBUILDING_HEADER_GUARD_PORTED,
    );
  });

  it("ports the building production queue limit", () => {
    expect(BUILDING_MAX_QUEUE_ITEMS).toBe(5);
  });

  it("ports building production states", () => {
    expect(BuildingState.Place).toBe(0);
    expect(BuildingState.Select).toBe(1);
    expect(BuildingState.Building).toBe(2);
    expect(BuildingState.Paused).toBe(3);
    expect(BuildingState.MaxBuildingStates).toBe(4);
  });

  it("ports ZBProductionUnit default construction", () => {
    expect(new ZBProductionUnit()).toEqual({
      ot: 0,
      oid: 0,
    });
  });

  it("ports ZBProductionUnit configured construction", () => {
    expect(new ZBProductionUnit(1, 4)).toEqual({
      ot: 1,
      oid: 4,
    });
  });

  it("ports ZBuilding SetZoneOwnage as a direct zone ownership assignment", () => {
    const state = { zoneOwnage: 0 };

    setBuildingZoneOwnage(state, 1.25);

    expect(state.zoneOwnage).toBe(1.25);
  });

  it("ports ProductionTimeTotal as a total production time read", () => {
    const state = { totalProductionTime: 12.5 };

    expect(getBuildingProductionTimeTotal(state)).toBe(12.5);
  });

  it("ports the vehicle factory exhaust x offset", () => {
    expect(VEHICLE_FACTORY_EXHAUST_X_PIXELS).toBe(28);
  });

  it("ports the vehicle factory exhaust y offset", () => {
    expect(VEHICLE_FACTORY_EXHAUST_Y_PIXELS).toBe(-22);
  });

  it("ports the vehicle factory bulb x offset", () => {
    expect(VEHICLE_FACTORY_BULB_X_PIXELS).toBe(24);
  });

  it("ports the vehicle factory bulb y offset", () => {
    expect(VEHICLE_FACTORY_BULB_Y_PIXELS).toBe(39);
  });

  it("ports the vehicle factory effect x offset", () => {
    expect(VEHICLE_FACTORY_EFFECT_X_OFFSET_PIXELS).toBe(15);
  });

  it("ports the vehicle factory effect y offset", () => {
    expect(VEHICLE_FACTORY_EFFECT_Y_OFFSET_PIXELS).toBe(8);
  });

  it("ports the vehicle factory level x offset", () => {
    expect(VEHICLE_FACTORY_LEVEL_X_PIXELS).toBe(8);
  });

  it("ports the vehicle factory level y offset", () => {
    expect(VEHICLE_FACTORY_LEVEL_Y_PIXELS).toBe(56);
  });

  it("ports the vehicle factory lights y offset", () => {
    expect(VEHICLE_FACTORY_LIGHTS_Y_PIXELS).toBe(47);
  });

  it("ports the vehicle factory minimum process interval", () => {
    expect(VEHICLE_FACTORY_MIN_PROCESS_INTERVAL_SECONDS).toBe(0.25);
  });

  it("ports the vehicle factory spinner x offset", () => {
    expect(VEHICLE_FACTORY_SPINNER_X_PIXELS).toBe(9);
  });

  it("ports the vehicle factory spinner y offset", () => {
    expect(VEHICLE_FACTORY_SPINNER_Y_PIXELS).toBe(-2);
  });

  it("ports the vehicle factory tank x offset", () => {
    expect(VEHICLE_FACTORY_TANK_X_PIXELS).toBe(16);
  });

  it("ports the vehicle factory tank y offset", () => {
    expect(VEHICLE_FACTORY_TANK_Y_PIXELS).toBe(48);
  });

  it("ports the vehicle factory vent x offset", () => {
    expect(VEHICLE_FACTORY_VENT_X_PIXELS).toBe(16);
  });

  it("ports the vehicle factory vent y offset", () => {
    expect(VEHICLE_FACTORY_VENT_Y_PIXELS).toBe(32);
  });

  it("ports the radar side-light x offset", () => {
    expect(RADAR_SIDE_LIGHT_X_PIXELS).toBe(41);
  });

  it("ports the radar side-light y offset", () => {
    expect(RADAR_SIDE_LIGHT_Y_PIXELS).toBe(0);
  });

  it("ports the robot factory double-light x offset", () => {
    expect(ROBOT_FACTORY_DOUBLE_LIGHT_X_PIXELS).toBe(16);
  });

  it("ports the robot factory double-light y offset", () => {
    expect(ROBOT_FACTORY_DOUBLE_LIGHT_Y_PIXELS).toBe(32);
  });

  it("ports the robot factory effect x offset", () => {
    expect(ROBOT_FACTORY_EFFECT_X_OFFSET_PIXELS).toBe(19);
  });

  it("ports the robot factory effect y offset", () => {
    expect(ROBOT_FACTORY_EFFECT_Y_OFFSET_PIXELS).toBe(8);
  });

  it("ports the robot factory exhaust x offset", () => {
    expect(ROBOT_FACTORY_EXHAUST_X_PIXELS).toBe(28);
  });

  it("ports the robot factory exhaust y offset", () => {
    expect(ROBOT_FACTORY_EXHAUST_Y_PIXELS).toBe(-24);
  });

  it("ports the robot factory green-box x offset", () => {
    expect(ROBOT_FACTORY_GREEN_BOX_X_PIXELS).toBe(38);
  });

  it("ports the robot factory green-box y offset", () => {
    expect(ROBOT_FACTORY_GREEN_BOX_Y_PIXELS).toBe(39);
  });

  it("ports the robot factory level x offset", () => {
    expect(ROBOT_FACTORY_LEVEL_X_PIXELS).toBe(8);
  });

  it("ports the robot factory level y offset", () => {
    expect(ROBOT_FACTORY_LEVEL_Y_PIXELS).toBe(56);
  });

  it("ports the robot factory minimum process interval", () => {
    expect(ROBOT_FACTORY_MIN_PROCESS_INTERVAL_SECONDS).toBe(0.25);
  });

  it("ports the robot factory robot x offset", () => {
    expect(ROBOT_FACTORY_ROBOT_X_PIXELS).toBe(16);
  });

  it("ports the robot factory robot y offset", () => {
    expect(ROBOT_FACTORY_ROBOT_Y_PIXELS).toBe(48);
  });

  it("ports the robot factory single-light y offset", () => {
    expect(ROBOT_FACTORY_SINGLE_LIGHT_Y_PIXELS).toBe(68);
  });

  it("ports the robot factory spinner x offset", () => {
    expect(ROBOT_FACTORY_SPINNER_X_PIXELS).toBe(9);
  });

  it("ports the robot factory spinner y offset", () => {
    expect(ROBOT_FACTORY_SPINNER_Y_PIXELS).toBe(-2);
  });

  it("ports the repair front-light x offset", () => {
    expect(REPAIR_FRONT_LIGHT_X_PIXELS).toBe(6);
  });

  it("ports the repair front-light y offset", () => {
    expect(REPAIR_FRONT_LIGHT_Y_PIXELS).toBe(16);
  });

  it("ports the repair minimum process interval", () => {
    expect(REPAIR_MIN_PROCESS_INTERVAL_SECONDS).toBe(0.35);
  });

  it("ports the repair side-light x offset", () => {
    expect(REPAIR_SIDE_LIGHT_X_PIXELS).toBe(18);
  });

  it("ports the repair side-light y offset", () => {
    expect(REPAIR_SIDE_LIGHT_Y_PIXELS).toBe(6);
  });

  it("ports the repair bulb x offset", () => {
    expect(REPAIR_BULB_X_PIXELS).toBe(32);
  });

  it("ports the repair bulb y offset", () => {
    expect(REPAIR_BULB_Y_PIXELS).toBe(0);
  });

  it("ports the repair smoke-stack x offset", () => {
    expect(REPAIR_SMOKE_STACK_X_PIXELS).toBe(61);
  });

  it("ports the repair smoke-stack y offset", () => {
    expect(REPAIR_SMOKE_STACK_Y_PIXELS).toBe(0);
  });

  it("ports the repair text-box x offset", () => {
    expect(REPAIR_TEXT_BOX_X_PIXELS).toBe(16);
  });

  it("ports the repair text-box y offset", () => {
    expect(REPAIR_TEXT_BOX_Y_PIXELS).toBe(32);
  });

  it("ports the repair effect x offset", () => {
    expect(REPAIR_EFFECT_X_OFFSET_PIXELS).toBe(10);
  });

  it("ports the repair effect y offset", () => {
    expect(REPAIR_EFFECT_Y_OFFSET_PIXELS).toBe(6);
  });

  it("ports the radar minimum process interval", () => {
    expect(RADAR_MIN_PROCESS_INTERVAL_SECONDS).toBe(0.25);
  });

  it("ports the radar front-light x offset", () => {
    expect(RADAR_FRONT_LIGHT_X_PIXELS).toBe(16);
  });

  it("ports the radar front-light y offset", () => {
    expect(RADAR_FRONT_LIGHT_Y_PIXELS).toBe(22);
  });

  it("ports the radar box-spinner x offset", () => {
    expect(RADAR_BOX_SPINNER_X_PIXELS).toBe(18);
  });

  it("ports the radar box-spinner y offset", () => {
    expect(RADAR_BOX_SPINNER_Y_PIXELS).toBe(13);
  });

  it("ports the radar dish x offset", () => {
    expect(RADAR_DISH_X_PIXELS).toBe(15);
  });

  it("ports the radar effect x offset", () => {
    expect(RADAR_EFFECT_X_OFFSET_PIXELS).toBe(12);
  });

  it("ports the radar effect y offset", () => {
    expect(RADAR_EFFECT_Y_OFFSET_PIXELS).toBe(0);
  });
});
