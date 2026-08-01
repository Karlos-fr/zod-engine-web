import { describe, expect, it } from "vitest";
import {
  RobotType,
  TeamType,
  VehicleType,
} from "../src/simulation/SimulationConstants";
import { Waypoint } from "../src/simulation/entities/EntityTypes";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { RepairBuildingEntity } from "../src/simulation/entities/RepairBuildingEntity";
import { MapObjectType } from "../src/world/MapFormat";
import type { GameMap } from "../src/world/GameMap";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

describe("repair building entity", () => {
  it("ports BRepair Process without advancing animation before the interval", () => {
    const building = new RepairBuildingEntity({
      id: "repair-process-before",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.lastProcessTime = 10;
    const effectTimes: number[] = [];
    const showTimes: number[] = [];
    building.resetShowTime = (newTime: number): void => {
      showTimes.push(newTime);
    };

    expect(building.process(10.34, (currentTime) => effectTimes.push(currentTime))).toBe(1);

    expect(effectTimes).toEqual([10.34]);
    expect(showTimes).toEqual([-1]);
    expect(building.lastProcessTime).toBe(10);
    expect(building.smokeStackIndex).toBe(0);
    expect(building.textBoxIndex).toBe(0);
    expect(building.sideLightIndex).toBe(0);
    expect(building.frontLightIndex).toBe(0);
    expect(building.bulbIndex).toBe(0);
  });

  it("ports BRepair Process animation frame advancement and wrapping", () => {
    const building = new RepairBuildingEntity({
      id: "repair-process-wrap",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.lastProcessTime = 10;
    building.smokeStackIndex = 4;
    building.textBoxIndex = 2;
    building.sideLightIndex = 1;
    building.frontLightIndex = 1;
    building.bulbIndex = 1;
    building.repairingUnit = true;
    building.repairTime = 15.9;
    const showTimes: number[] = [];
    building.resetShowTime = (newTime: number): void => {
      showTimes.push(newTime);
    };

    expect(building.process(10.35)).toBe(1);

    expect(building.lastProcessTime).toBe(10.35);
    expect(building.smokeStackIndex).toBe(0);
    expect(building.textBoxIndex).toBe(0);
    expect(building.sideLightIndex).toBe(0);
    expect(building.frontLightIndex).toBe(0);
    expect(building.bulbIndex).toBe(0);
    expect(showTimes).toEqual([5]);
  });

  it("ports BRepair SetMapImpassables as full footprint blockage", () => {
    const building = new RepairBuildingEntity({
      id: "repair-0",
      kind: "building",
      position: { x: 48, y: 64 },
    });
    building.width = 5;
    building.height = 4;
    const calls: ImpassableCall[] = [];
    const map = {
      setImpassable(
        x: number,
        y: number,
        impassable?: boolean,
        destroyable?: boolean,
      ) {
        calls.push({ x, y, impassable, destroyable });
      },
    } as GameMap;

    building.setMapImpassables(map);

    expect(calls).toEqual([
      { x: 3, y: 4, impassable: undefined, destroyable: undefined },
      { x: 3, y: 5, impassable: undefined, destroyable: undefined },
      { x: 3, y: 6, impassable: undefined, destroyable: undefined },
      { x: 3, y: 7, impassable: undefined, destroyable: undefined },
      { x: 4, y: 4, impassable: undefined, destroyable: undefined },
      { x: 4, y: 5, impassable: undefined, destroyable: undefined },
      { x: 4, y: 6, impassable: undefined, destroyable: undefined },
      { x: 4, y: 7, impassable: undefined, destroyable: undefined },
      { x: 5, y: 4, impassable: undefined, destroyable: undefined },
      { x: 5, y: 5, impassable: undefined, destroyable: undefined },
      { x: 5, y: 6, impassable: undefined, destroyable: undefined },
      { x: 5, y: 7, impassable: undefined, destroyable: undefined },
      { x: 6, y: 4, impassable: undefined, destroyable: undefined },
      { x: 6, y: 5, impassable: undefined, destroyable: undefined },
      { x: 6, y: 6, impassable: undefined, destroyable: undefined },
      { x: 6, y: 7, impassable: undefined, destroyable: undefined },
      { x: 7, y: 4, impassable: undefined, destroyable: undefined },
      { x: 7, y: 5, impassable: undefined, destroyable: undefined },
      { x: 7, y: 6, impassable: undefined, destroyable: undefined },
      { x: 7, y: 7, impassable: undefined, destroyable: undefined },
    ]);
  });

  it("ports BRepair RepairingAUnit as repair-in-progress state read", () => {
    const building = new RepairBuildingEntity({
      id: "repair-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    expect(building.repairingAUnit()).toBe(false);

    building.repairingUnit = true;
    expect(building.repairingAUnit()).toBe(true);
  });

  it("ports BRepair SetRepairUnit guard exits", () => {
    const building = new RepairBuildingEntity({
      id: "repair-set-guard",
      kind: "building",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    const unit = new GameEntity({
      id: "repair-set-unit",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });

    expect(building.setRepairUnit(null)).toBe(false);

    building.repairingUnit = true;
    expect(building.setRepairUnit(unit)).toBe(false);

    building.repairingUnit = false;
    building.owner = TeamType.Red;
    expect(building.setRepairUnit(unit)).toBe(false);
  });

  it("ports BRepair SetRepairUnit as copied repair payload capture", () => {
    const building = new RepairBuildingEntity({
      id: "repair-set",
      kind: "building",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    const unit = new GameEntity({
      id: "repair-set-unit",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
      objectType: MapObjectType.Vehicle,
      objectId: VehicleType.Light,
    });
    const waypoint = new Waypoint();
    waypoint.mode = 5;
    waypoint.x = 12;
    waypoint.y = 34;
    unit.driverType = RobotType.Psycho;
    unit.driverInfo = [{ health: 88, nextAttackTime: 12 }];
    unit.waypointList = [waypoint];
    building.ztime = { ztime: 21 };

    expect(building.setRepairUnit(unit)).toBe(true);

    expect(building.repairingUnit).toBe(true);
    expect(building.repairTime).toBe(26);
    expect(building.repairObjectType).toBe(MapObjectType.Vehicle);
    expect(building.repairObjectId).toBe(VehicleType.Light);
    expect(building.repairDriverType).toBe(RobotType.Psycho);
    expect(building.repairDriverInfo).toEqual([{ health: 88, nextAttackTime: 12 }]);
    expect(building.repairDriverInfo).not.toBe(unit.driverInfo);
    expect(building.repairDriverInfo[0]).not.toBe(unit.driverInfo[0]);
    expect(building.repairWaypointList).toHaveLength(1);
    expect(building.repairWaypointList[0]).toMatchObject({ mode: 5, x: 12, y: 34 });
    expect(building.repairWaypointList[0]).not.toBe(waypoint);
  });

  it("ports BRepair DoRepairBuildingAnim as enabled repair animation timing", () => {
    const building = new RepairBuildingEntity({
      id: "repair-anim-on",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.ztime = { ztime: 12 };
    building.bulbIndex = 4;
    building.smokeStackIndex = 5;

    building.doRepairBuildingAnim(true, 3.5);

    expect(building.repairingUnit).toBe(true);
    expect(building.repairTime).toBe(15.5);
    expect(building.bulbIndex).toBe(0);
    expect(building.smokeStackIndex).toBe(0);
  });

  it("ports BRepair DoRepairBuildingAnim as disabled repair animation timing", () => {
    const building = new RepairBuildingEntity({
      id: "repair-anim-off",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.ztime = { ztime: 20 };
    building.bulbIndex = 4;
    building.smokeStackIndex = 5;

    building.doRepairBuildingAnim(false, 2);

    expect(building.repairingUnit).toBe(false);
    expect(building.repairTime).toBe(22);
    expect(building.bulbIndex).toBe(4);
    expect(building.smokeStackIndex).toBe(5);
  });

  it("ports BRepair CreateRepairAnimData as active repair animation packet", () => {
    const building = new RepairBuildingEntity({
      id: "repair-create-anim-on",
      kind: "building",
      position: { x: 0, y: 0 },
      refId: 42,
    });
    building.ztime = { ztime: 10 };
    building.repairingUnit = true;
    building.repairTime = 13.5;

    expect(building.createRepairAnimData(false)).toEqual({
      data: {
        refId: 42,
        on: true,
        playSound: false,
        remainingTime: 3.5,
      },
      size: 24,
    });
  });

  it("ports BRepair CreateRepairAnimData as inactive repair animation packet", () => {
    const building = new RepairBuildingEntity({
      id: "repair-create-anim-off",
      kind: "building",
      position: { x: 0, y: 0 },
      refId: 43,
    });
    building.ztime = { ztime: 10 };
    building.repairingUnit = false;
    building.repairTime = 13.5;

    expect(building.createRepairAnimData()).toEqual({
      data: {
        refId: 43,
        on: false,
        playSound: true,
        remainingTime: 0,
      },
      size: 24,
    });
  });

  it("ports BRepair RepairUnit guard exits", () => {
    const building = new RepairBuildingEntity({
      id: "repair-unit-guard",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const output = createRepairUnitOutput();

    expect(building.repairUnit(output)).toBe(false);

    building.repairingUnit = true;
    building.repairTime = 12;
    building.ztime = { ztime: 11.5 };

    expect(building.repairUnit(output)).toBe(false);
    expect(building.repairingUnit).toBe(true);
    expect(output).toEqual(createRepairUnitOutput());
  });

  it("ports BRepair RepairUnit as completed repair payload emission", () => {
    const building = new RepairBuildingEntity({
      id: "repair-unit-complete",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const waypoint = new Waypoint();
    waypoint.mode = 3;
    waypoint.x = 10;
    waypoint.y = 20;
    building.ztime = { ztime: 12 };
    building.repairingUnit = true;
    building.repairTime = 12;
    building.repairObjectType = 4;
    building.repairObjectId = 5;
    building.repairDriverType = 6;
    building.repairDriverInfo = [{ health: 20, nextAttackTime: 7 }];
    building.repairWaypointList = [waypoint];
    const output = createRepairUnitOutput();

    expect(building.repairUnit(output)).toBe(true);

    expect(output).toMatchObject({
      objectType: 4,
      objectId: 5,
      driverType: 6,
      driverInfo: [{ health: 20, nextAttackTime: 7 }],
    });
    expect(output.driverInfo).not.toBe(building.repairDriverInfo);
    expect(output.driverInfo[0]).not.toBe(building.repairDriverInfo[0]);
    expect(output.waypointList).toHaveLength(1);
    expect(output.waypointList[0]).not.toBe(waypoint);
    expect(output.waypointList[0]).toMatchObject({ mode: 3, x: 10, y: 20 });
    expect(building.repairingUnit).toBe(false);
  });

  it("ports BRepair CanRepairUnit as owner-team and alive check", () => {
    const building = new RepairBuildingEntity({
      id: "repair-can-repair",
      kind: "building",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    building.maxHealth = 100;
    building.health = 100;

    expect(building.canRepairUnit(TeamType.Blue)).toBe(true);
    expect(building.canRepairUnit(TeamType.Red)).toBe(false);

    building.owner = TeamType.Null;
    expect(building.canRepairUnit(TeamType.Null)).toBe(false);

    building.owner = TeamType.Blue;
    building.health = 0;
    expect(building.canRepairUnit(TeamType.Blue)).toBe(false);
  });

  it("ports BRepair GetRepairCenter as the fixed repair interaction point", () => {
    const building = new RepairBuildingEntity({
      id: "repair-2",
      kind: "building",
      position: { x: 96, y: 128 },
    });

    expect(building.getRepairCenter()).toEqual({
      hasCenter: true,
      x: 128,
      y: 160,
    });
  });

  it("ports BRepair GetCraneEntrance as the fixed point below the building", () => {
    const building = new RepairBuildingEntity({
      id: "repair-3",
      kind: "building",
      position: { x: 96, y: 128 },
    });
    building.pixelHeight = 64;

    expect(building.getCraneEntrance()).toEqual({
      canEnter: true,
      x: 128,
      y: 224,
      exitX: 128,
      exitY: 224,
    });
  });

  it("ports BRepair GetCraneCenter as the fixed crane interaction point", () => {
    const building = new RepairBuildingEntity({
      id: "repair-4",
      kind: "building",
      position: { x: 96, y: 128 },
    });

    expect(building.getCraneCenter()).toEqual({
      hasCenter: true,
      x: 128,
      y: 160,
    });
  });

  it("ports BRepair GetRepairEntrance as the fixed point below the building", () => {
    const building = new RepairBuildingEntity({
      id: "repair-5",
      kind: "building",
      position: { x: 96, y: 128 },
    });
    building.pixelHeight = 64;

    expect(building.getRepairEntrance()).toEqual({
      x: 128,
      y: 224,
    });
  });
});

function createRepairUnitOutput() {
  return {
    time: 0,
    objectType: 0,
    objectId: 0,
    driverType: 0,
    driverInfo: [],
    waypointList: [],
  };
}
