import { describe, expect, it } from "vitest";
import {
  AggroWaypointStage,
  CraneRepairWaypointStage,
  type DriverInfo,
  type FireMissileInfo,
  type ObjectLocation,
  type ZPortraitReference,
  EnterFortWaypointStage,
  ObjectMode,
  ServerFlag,
  UnitRepairWaypointStage,
  Waypoint,
  WaypointInformation,
  WaypointMode,
} from "../src/simulation/entities/EntityTypes";

describe("entity types", () => {
  it("ports the ZPortrait forward declaration as a type-only reference", () => {
    const acceptsPortraitReference = (
      portrait: ZPortraitReference | null,
    ): boolean => portrait === null;

    expect(acceptsPortraitReference(null)).toBe(true);
  });

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

  it("ports waypoint defaults and clear behavior", () => {
    const waypoint = new Waypoint();

    expect(waypoint).toMatchObject({
      mode: -1,
      refId: -1,
      x: 0,
      y: 0,
      attackTo: false,
      playerGiven: false,
    });

    Object.assign(waypoint, {
      mode: WaypointMode.Attack,
      refId: 12,
      x: 30,
      y: 40,
      attackTo: true,
      playerGiven: true,
    });

    waypoint.clear();

    expect(waypoint).toMatchObject({
      mode: -1,
      refId: -1,
      x: 0,
      y: 0,
      attackTo: false,
      playerGiven: false,
    });
  });

  it("ports waypoint equality operators", () => {
    const first = new Waypoint();
    const second = new Waypoint();

    expect(first.equals(second)).toBe(true);
    expect(first.notEquals(second)).toBe(false);

    second.playerGiven = true;

    expect(first.equals(second)).toBe(false);
    expect(first.notEquals(second)).toBe(true);
  });

  it("ports waypoint information clear behavior", () => {
    const info = new WaypointInformation();
    Object.assign(info, {
      stage: 3,
      x: 10,
      y: 20,
      sx: 1,
      sy: 2,
      adx: 30,
      ady: 40,
      craneExitX: 5,
      craneExitY: 6,
      agroCenterX: 7,
      agroCenterY: 8,
      fortExitX: 9,
      fortExitY: 10,
      initAttackX: 11,
      initAttackY: 12,
      pathFindingId: 13,
      gotPathfindingResponse: true,
    });
    info.pathfindingPointList.push({ x: 1, y: 2 });

    info.clear();

    expect(info).toMatchObject({
      stage: 0,
      x: 0,
      y: 0,
      sx: 0,
      sy: 0,
      adx: 0,
      ady: 0,
      craneExitX: 0,
      craneExitY: 0,
      agroCenterX: 0,
      agroCenterY: 0,
      fortExitX: 0,
      fortExitY: 0,
      initAttackX: 0,
      initAttackY: 0,
      pathFindingId: 0,
      gotPathfindingResponse: false,
      pathfindingPointList: [],
    });
  });

  it("ports server flag clear behavior", () => {
    const flag = new ServerFlag();
    Object.assign(flag, {
      updatedLocation: true,
      updatedVelocity: true,
      updatedWaypoints: true,
      updatedAttackObject: true,
      updatedAttackObjectHealth: true,
      updatedAttackObjectDriverHealth: true,
      updatedOpenLid: true,
      firedMissile: true,
      missileX: 88,
      missileY: 99,
      enteredTargetRefId: 1,
      buildUnit: true,
      bot: 2,
      buildingObjectId: 3,
      autoRepair: true,
      setCraneAnim: true,
      craneAnimOn: true,
      craneRepairRefId: 4,
      enteredRepairBuildingRefId: 5,
      repairUnit: true,
      robotObjectType: 6,
      robotObjectId: 7,
      repairDriverType: 8,
      recheckLidStatus: true,
      destroyFortBuildingRefId: 9,
      updatedGrenadeAmount: true,
      updatedLeaderGrenadeAmount: true,
      deleteGrenadeBoxRefId: 10,
      doPickupGrenadeAnim: true,
      portraitAnimRefId: 11,
      portraitAnimValue: 12,
    });

    flag.clear();

    expect(flag).toMatchObject({
      updatedLocation: false,
      updatedVelocity: false,
      updatedWaypoints: false,
      updatedAttackObject: false,
      updatedAttackObjectHealth: false,
      updatedAttackObjectDriverHealth: false,
      updatedOpenLid: false,
      firedMissile: false,
      missileX: 88,
      missileY: 99,
      enteredTargetRefId: -1,
      buildUnit: false,
      bot: 2,
      buildingObjectId: 3,
      autoRepair: false,
      setCraneAnim: false,
      craneAnimOn: false,
      craneRepairRefId: -1,
      enteredRepairBuildingRefId: -1,
      repairUnit: false,
      robotObjectType: 6,
      robotObjectId: 7,
      repairDriverType: 8,
      recheckLidStatus: true,
      destroyFortBuildingRefId: -1,
      updatedGrenadeAmount: false,
      updatedLeaderGrenadeAmount: false,
      deleteGrenadeBoxRefId: -1,
      doPickupGrenadeAnim: false,
      portraitAnimRefId: -1,
      portraitAnimValue: -1,
    });
  });

  it("ports server flag construction defaults", () => {
    expect(new ServerFlag()).toMatchObject({
      updatedLocation: false,
      updatedVelocity: false,
      updatedWaypoints: false,
      updatedAttackObject: false,
      updatedAttackObjectHealth: false,
      updatedAttackObjectDriverHealth: false,
      updatedOpenLid: false,
      firedMissile: false,
      missileX: 0,
      missileY: 0,
      enteredTargetRefId: -1,
      buildUnit: false,
      bot: 0,
      buildingObjectId: 0,
      autoRepair: false,
      setCraneAnim: false,
      craneAnimOn: false,
      craneRepairRefId: -1,
      enteredRepairBuildingRefId: -1,
      repairUnit: false,
      robotObjectType: 0,
      robotObjectId: 0,
      repairDriverType: 0,
      repairDriverInfo: [],
      repairWaypointList: [],
      recheckLidStatus: false,
      destroyFortBuildingRefId: -1,
      updatedGrenadeAmount: false,
      updatedLeaderGrenadeAmount: false,
      deleteGrenadeBoxRefId: -1,
      doPickupGrenadeAnim: false,
      portraitAnimRefId: -1,
      portraitAnimValue: -1,
    });
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
