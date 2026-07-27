import { describe, expect, it } from "vitest";
import {
  BBRIDGE_HEADER_GUARD_PORTED,
  BFORT_HEADER_GUARD_PORTED,
  BRADAR_HEADER_GUARD_PORTED,
  BREPAIR_HEADER_GUARD_PORTED,
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
  ROBOT_FACTORY_EFFECT_X_OFFSET_PIXELS,
  ROBOT_FACTORY_EXHAUST_Y_PIXELS,
  ROBOT_FACTORY_GREEN_BOX_X_PIXELS,
  ROBOT_FACTORY_GREEN_BOX_Y_PIXELS,
  ROBOT_FACTORY_MIN_PROCESS_INTERVAL_SECONDS,
  ROBOT_FACTORY_ROBOT_X_PIXELS,
  ROBOT_FACTORY_ROBOT_Y_PIXELS,
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

  it("ports the radar side-light x offset", () => {
    expect(RADAR_SIDE_LIGHT_X_PIXELS).toBe(41);
  });

  it("ports the radar side-light y offset", () => {
    expect(RADAR_SIDE_LIGHT_Y_PIXELS).toBe(0);
  });

  it("ports the robot factory double-light x offset", () => {
    expect(ROBOT_FACTORY_DOUBLE_LIGHT_X_PIXELS).toBe(16);
  });

  it("ports the robot factory effect x offset", () => {
    expect(ROBOT_FACTORY_EFFECT_X_OFFSET_PIXELS).toBe(19);
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

  it("ports the robot factory minimum process interval", () => {
    expect(ROBOT_FACTORY_MIN_PROCESS_INTERVAL_SECONDS).toBe(0.25);
  });

  it("ports the robot factory robot x offset", () => {
    expect(ROBOT_FACTORY_ROBOT_X_PIXELS).toBe(16);
  });

  it("ports the robot factory robot y offset", () => {
    expect(ROBOT_FACTORY_ROBOT_Y_PIXELS).toBe(48);
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
