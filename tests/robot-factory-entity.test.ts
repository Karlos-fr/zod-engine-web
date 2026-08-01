import { describe, expect, it } from "vitest";
import { RobotFactoryEntity } from "../src/simulation/entities/RobotFactoryEntity";
import type { GameMap } from "../src/world/GameMap";
import { BuildingState } from "../src/simulation/entities/BuildingTypes";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

describe("robot factory entity", () => {
  it("ports BRobot Process without advancing animation before the interval", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-process-before",
      kind: "robot-factory",
      position: { x: 0, y: 0 },
    });
    entity.lastProcessTime = 10;
    entity.buildState = BuildingState.Select;
    entity.singleLightOn = [true, false, true];
    const effectTimes: number[] = [];
    const showTimes: number[] = [];
    entity.resetShowTime = (newTime: number): void => {
      showTimes.push(newTime);
    };

    expect(entity.process(10.24, (currentTime) => effectTimes.push(currentTime))).toBe(1);

    expect(effectTimes).toEqual([10.24]);
    expect(showTimes).toEqual([-1]);
    expect(entity.lastProcessTime).toBe(10);
    expect(entity.spinIndex).toBe(0);
    expect(entity.greenBoxIndex).toBe(0);
    expect(entity.robotIndex).toBe(0);
    expect(entity.exhaustIndex).toBe(0);
    expect(entity.singleLightOn).toEqual([true, false, true]);
  });

  it("ports BRobot Process animation frame advancement, lights, and wrapping", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-process-wrap",
      kind: "robot-factory",
      position: { x: 0, y: 0 },
    });
    entity.lastProcessTime = 10;
    entity.spinIndex = 7;
    entity.greenBoxIndex = 5;
    entity.robotIndex = 1;
    entity.exhaustIndex = 12;
    entity.singleLightOn = [false, false, false];
    entity.buildState = BuildingState.Building;
    entity.finalProductionTime = 18.8;
    const showTimes: number[] = [];
    const randomValues = [0, 1, 0, 1];
    entity.resetShowTime = (newTime: number): void => {
      showTimes.push(newTime);
    };

    expect(
      entity.process(
        10.25,
        null,
        (_font, text) => text,
        () => randomValues.shift() ?? 0,
      ),
    ).toBe(1);

    expect(entity.lastProcessTime).toBe(10.25);
    expect(entity.spinIndex).toBe(0);
    expect(entity.greenBoxIndex).toBe(0);
    expect(entity.robotIndex).toBe(0);
    expect(entity.exhaustIndex).toBe(0);
    expect(entity.singleLightOn).toEqual([true, false, true]);
    expect(showTimes).toEqual([8]);
  });

  it("ports BRobot SetMapImpassables as full footprint blockage", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-0",
      kind: "robot-factory",
      position: { x: 64, y: 80 },
    });
    entity.width = 4;
    entity.height = 5;
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

    entity.setMapImpassables(map);

    expect(calls).toEqual([
      { x: 4, y: 5, impassable: undefined, destroyable: undefined },
      { x: 4, y: 6, impassable: undefined, destroyable: undefined },
      { x: 4, y: 7, impassable: undefined, destroyable: undefined },
      { x: 4, y: 8, impassable: undefined, destroyable: undefined },
      { x: 4, y: 9, impassable: undefined, destroyable: undefined },
      { x: 5, y: 5, impassable: undefined, destroyable: undefined },
      { x: 5, y: 6, impassable: undefined, destroyable: undefined },
      { x: 5, y: 7, impassable: undefined, destroyable: undefined },
      { x: 5, y: 8, impassable: undefined, destroyable: undefined },
      { x: 5, y: 9, impassable: undefined, destroyable: undefined },
      { x: 6, y: 5, impassable: undefined, destroyable: undefined },
      { x: 6, y: 6, impassable: undefined, destroyable: undefined },
      { x: 6, y: 7, impassable: undefined, destroyable: undefined },
      { x: 6, y: 8, impassable: undefined, destroyable: undefined },
      { x: 6, y: 9, impassable: undefined, destroyable: undefined },
      { x: 7, y: 5, impassable: undefined, destroyable: undefined },
      { x: 7, y: 6, impassable: undefined, destroyable: undefined },
      { x: 7, y: 7, impassable: undefined, destroyable: undefined },
      { x: 7, y: 8, impassable: undefined, destroyable: undefined },
      { x: 7, y: 9, impassable: undefined, destroyable: undefined },
    ]);
  });

  it("ports BRobot CanSetRallypoints as enabled rally points", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-1",
      kind: "robot-factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetRallypoints()).toBe(true);
  });

  it("ports BRobot ProducesUnits as enabled unit production", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-2",
      kind: "robot-factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.producesUnits()).toBe(true);
  });

  it("ports BRobot GetCraneEntrance as the fixed point below the building", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-3",
      kind: "robot-factory",
      position: { x: 96, y: 128 },
    });
    entity.pixelHeight = 64;

    expect(entity.getCraneEntrance()).toEqual({
      canEnter: true,
      x: 131,
      y: 224,
      exitX: 131,
      exitY: 224,
    });
  });

  it("ports BRobot GetCraneCenter as the fixed crane interaction point", () => {
    const entity = new RobotFactoryEntity({
      id: "robot-factory-4",
      kind: "robot-factory",
      position: { x: 96, y: 128 },
    });

    expect(entity.getCraneCenter()).toEqual({
      hasCenter: true,
      x: 131,
      y: 160,
    });
  });
});
