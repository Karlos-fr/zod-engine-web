import { describe, expect, it } from "vitest";
import {
  AggroWaypointStage,
  CraneRepairWaypointStage,
  type DriverInfo,
  type FireMissileInfo,
  type ObjectLocation,
  EnterFortWaypointStage,
  ObjectMode,
  UnitRepairWaypointStage,
  WaypointMode,
} from "../src/simulation/entities/EntityTypes";

describe("entity types", () => {
  it("ports unit repair waypoint stages", () => {
    expect(UnitRepairWaypointStage.GoToEntrance).toBe(0);
    expect(UnitRepairWaypointStage.EnterBuilding).toBe(1);
    expect(UnitRepairWaypointStage.ExitBuilding).toBe(2);
    expect(UnitRepairWaypointStage.Wait).toBe(3);
  });

  it("ports object modes and their numeric layout", () => {
    expect(ObjectMode.Null).toBe(0);
    expect(ObjectMode.Stationary).toBe(3);
    expect(ObjectMode.RobotWalking).toBe(4);
    expect(ObjectMode.RobotAttacking).toBe(10);
    expect(ObjectMode.RobotPickupDownGrenades).toBe(12);
    expect(ObjectMode.CannonAttacking).toBe(13);
    expect(ObjectMode.Max).toBe(14);
  });

  it("ports enter-fort waypoint stages", () => {
    expect(EnterFortWaypointStage.GoToEntrance).toBe(0);
    expect(EnterFortWaypointStage.EnterBuilding).toBe(1);
    expect(EnterFortWaypointStage.ExitBuilding).toBe(2);
  });

  it("ports aggro waypoint stages", () => {
    expect(AggroWaypointStage.Attack).toBe(0);
    expect(AggroWaypointStage.Return).toBe(1);
  });

  it("ports crane repair waypoint stages", () => {
    expect(CraneRepairWaypointStage.GoToEntrance).toBe(0);
    expect(CraneRepairWaypointStage.EnterBuilding).toBe(1);
    expect(CraneRepairWaypointStage.ExitBuilding).toBe(2);
  });

  it("ports waypoint modes and their numeric layout", () => {
    expect(WaypointMode.Move).toBe(0);
    expect(WaypointMode.ForceMove).toBe(3);
    expect(WaypointMode.UnitRepair).toBe(5);
    expect(WaypointMode.EnterFort).toBe(7);
    expect(WaypointMode.PickupGrenades).toBe(9);
    expect(WaypointMode.Max).toBe(10);
  });

  it("ports driver state", () => {
    const driver: DriverInfo = {
      health: 80,
      nextAttackTime: 12.5,
    };

    expect(driver).toEqual({ health: 80, nextAttackTime: 12.5 });
  });

  it("ports missile firing state", () => {
    const missile: FireMissileInfo = {
      offsetTime: 0.25,
      x: 24,
      y: 48,
    };

    expect(missile).toEqual({ offsetTime: 0.25, x: 24, y: 48 });
  });

  it("ports object location and fractional movement", () => {
    const location: ObjectLocation = {
      x: 10,
      y: 20,
      deltaX: 0.25,
      deltaY: -0.5,
    };

    expect(location).toEqual({
      x: 10,
      y: 20,
      deltaX: 0.25,
      deltaY: -0.5,
    });
  });
});
