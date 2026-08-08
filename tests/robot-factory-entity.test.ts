import { describe, expect, it } from "vitest";
import {
  renderRobotFactoryBase,
  type RobotFactoryRenderMap,
  type RobotFactoryRenderState,
  RobotFactoryEntity,
} from "../src/simulation/entities/RobotFactoryEntity";
import type { GameMap } from "../src/world/GameMap";
import { BuildingState } from "../src/simulation/entities/BuildingTypes";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

type RobotFactoryImage = { name: string };

function createRobotFactoryRenderState(
  overrides: Partial<RobotFactoryRenderState<RobotFactoryImage>> = {},
): RobotFactoryRenderState<RobotFactoryImage> {
  return {
    position: { x: 96, y: 144 },
    palette: 1,
    owner: 2,
    destroyed: false,
    dontStamp: false,
    doBaseRerender: true,
    baseImages: [
      [],
      [
        { name: "normal-p1-o0" },
        { name: "normal-p1-o1" },
        { name: "normal-p1-o2" },
      ],
    ],
    destroyedBaseImages: [
      [],
      [
        { name: "destroyed-p1-o0" },
        { name: "destroyed-p1-o1" },
        { name: "destroyed-p1-o2" },
      ],
    ],
    ...overrides,
  };
}

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

  it("replaces BRobot DoRender by stamping the selected base image", () => {
    const state = createRobotFactoryRenderState();
    const stampCalls: Array<{ x: number; y: number; surface: RobotFactoryImage }> = [];
    const map: RobotFactoryRenderMap<RobotFactoryImage> = {
      permStamp(x, y, surface) {
        stampCalls.push({ x, y, surface });
        return true;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderRobotFactoryBase(state, map)).toBeNull();

    expect(stampCalls).toEqual([
      { x: 96, y: 144, surface: { name: "normal-p1-o2" } },
    ]);
    expect(state.doBaseRerender).toBe(false);
  });

  it("keeps BRobot DoRender base rerender pending when permanent stamping fails", () => {
    const state = createRobotFactoryRenderState();
    const map: RobotFactoryRenderMap<RobotFactoryImage> = {
      permStamp() {
        return false;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderRobotFactoryBase(state, map)).toBeNull();

    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BRobot DoRender by rendering destroyed bases when stamping is disabled", () => {
    const state = createRobotFactoryRenderState({
      destroyed: true,
      dontStamp: true,
    });
    const map: RobotFactoryRenderMap<RobotFactoryImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderRobotFactoryBase(state, map)).toEqual({
      surface: { name: "destroyed-p1-o2" },
      x: 96,
      y: 144,
      renderHit: false,
      aboutCenter: false,
    });
    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BRobot DoRender as no command when the selected base image is missing", () => {
    const state = createRobotFactoryRenderState({
      baseImages: [],
      doBaseRerender: true,
    });
    const map: RobotFactoryRenderMap<RobotFactoryImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderRobotFactoryBase(state, map)).toBeNull();

    expect(state.doBaseRerender).toBe(true);
  });
});
