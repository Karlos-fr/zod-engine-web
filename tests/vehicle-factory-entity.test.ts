import { describe, expect, it } from "vitest";
import {
  renderVehicleFactoryBase,
  type VehicleFactoryRenderMap,
  type VehicleFactoryRenderState,
  VehicleFactoryEntity,
} from "../src/simulation/entities/VehicleFactoryEntity";
import type { GameMap } from "../src/world/GameMap";
import { BuildingState } from "../src/simulation/entities/BuildingTypes";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

type VehicleFactoryImage = { name: string };

function createVehicleFactoryRenderState(
  overrides: Partial<VehicleFactoryRenderState<VehicleFactoryImage>> = {},
): VehicleFactoryRenderState<VehicleFactoryImage> {
  return {
    position: { x: 112, y: 160 },
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

describe("vehicle factory entity", () => {
  it("ports BVehicle Process without advancing animation before the interval", () => {
    const entity = new VehicleFactoryEntity({
      id: "vehicle-factory-process-before",
      kind: "vehicle-factory",
      position: { x: 0, y: 0 },
    });
    entity.lastProcessTime = 10;
    entity.buildState = BuildingState.Select;
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
    expect(entity.ventIndex).toBe(0);
    expect(entity.exhaustIndex).toBe(0);
    expect(entity.bulbIndex).toBe(0);
    expect(entity.tankIndex).toBe(0);
  });

  it("ports BVehicle Process animation frame advancement and wrapping", () => {
    const entity = new VehicleFactoryEntity({
      id: "vehicle-factory-process-wrap",
      kind: "vehicle-factory",
      position: { x: 0, y: 0 },
    });
    entity.lastProcessTime = 10;
    entity.spinIndex = 7;
    entity.ventIndex = 3;
    entity.exhaustIndex = 12;
    entity.bulbIndex = 1;
    entity.tankIndex = 1;
    entity.buildState = BuildingState.Building;
    entity.finalProductionTime = 18.8;
    const showTimes: number[] = [];
    entity.resetShowTime = (newTime: number): void => {
      showTimes.push(newTime);
    };

    expect(entity.process(10.25)).toBe(1);

    expect(entity.lastProcessTime).toBe(10.25);
    expect(entity.spinIndex).toBe(0);
    expect(entity.ventIndex).toBe(0);
    expect(entity.exhaustIndex).toBe(0);
    expect(entity.bulbIndex).toBe(0);
    expect(entity.tankIndex).toBe(0);
    expect(showTimes).toEqual([8]);
  });

  it("ports BVehicle SetMapImpassables as full footprint blockage", () => {
    const entity = new VehicleFactoryEntity({
      id: "vehicle-factory-0",
      kind: "vehicle-factory",
      position: { x: 80, y: 96 },
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
      { x: 5, y: 6, impassable: undefined, destroyable: undefined },
      { x: 5, y: 7, impassable: undefined, destroyable: undefined },
      { x: 5, y: 8, impassable: undefined, destroyable: undefined },
      { x: 5, y: 9, impassable: undefined, destroyable: undefined },
      { x: 5, y: 10, impassable: undefined, destroyable: undefined },
      { x: 6, y: 6, impassable: undefined, destroyable: undefined },
      { x: 6, y: 7, impassable: undefined, destroyable: undefined },
      { x: 6, y: 8, impassable: undefined, destroyable: undefined },
      { x: 6, y: 9, impassable: undefined, destroyable: undefined },
      { x: 6, y: 10, impassable: undefined, destroyable: undefined },
      { x: 7, y: 6, impassable: undefined, destroyable: undefined },
      { x: 7, y: 7, impassable: undefined, destroyable: undefined },
      { x: 7, y: 8, impassable: undefined, destroyable: undefined },
      { x: 7, y: 9, impassable: undefined, destroyable: undefined },
      { x: 7, y: 10, impassable: undefined, destroyable: undefined },
      { x: 8, y: 6, impassable: undefined, destroyable: undefined },
      { x: 8, y: 7, impassable: undefined, destroyable: undefined },
      { x: 8, y: 8, impassable: undefined, destroyable: undefined },
      { x: 8, y: 9, impassable: undefined, destroyable: undefined },
      { x: 8, y: 10, impassable: undefined, destroyable: undefined },
    ]);
  });

  it("ports BVehicle CanSetRallypoints as enabled rally points", () => {
    const entity = new VehicleFactoryEntity({
      id: "vehicle-factory-1",
      kind: "vehicle-factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetRallypoints()).toBe(true);
  });

  it("ports BVehicle ProducesUnits as enabled unit production", () => {
    const entity = new VehicleFactoryEntity({
      id: "vehicle-factory-2",
      kind: "vehicle-factory",
      position: { x: 0, y: 0 },
    });

    expect(entity.producesUnits()).toBe(true);
  });

  it("ports BVehicle GetCraneEntrance as the fixed point below the building", () => {
    const entity = new VehicleFactoryEntity({
      id: "vehicle-factory-3",
      kind: "vehicle-factory",
      position: { x: 96, y: 128 },
    });
    entity.pixelHeight = 64;

    expect(entity.getCraneEntrance()).toEqual({
      canEnter: true,
      x: 127,
      y: 224,
      exitX: 127,
      exitY: 224,
    });
  });

  it("ports BVehicle GetCraneCenter as the fixed crane interaction point", () => {
    const entity = new VehicleFactoryEntity({
      id: "vehicle-factory-4",
      kind: "vehicle-factory",
      position: { x: 96, y: 128 },
    });

    expect(entity.getCraneCenter()).toEqual({
      hasCenter: true,
      x: 127,
      y: 160,
    });
  });

  it("replaces BVehicle DoRender by stamping the selected base image", () => {
    const state = createVehicleFactoryRenderState();
    const stampCalls: Array<{ x: number; y: number; surface: VehicleFactoryImage }> =
      [];
    const map: VehicleFactoryRenderMap<VehicleFactoryImage> = {
      permStamp(x, y, surface) {
        stampCalls.push({ x, y, surface });
        return true;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderVehicleFactoryBase(state, map)).toBeNull();

    expect(stampCalls).toEqual([
      { x: 112, y: 160, surface: { name: "normal-p1-o2" } },
    ]);
    expect(state.doBaseRerender).toBe(false);
  });

  it("keeps BVehicle DoRender base rerender pending when permanent stamping fails", () => {
    const state = createVehicleFactoryRenderState();
    const map: VehicleFactoryRenderMap<VehicleFactoryImage> = {
      permStamp() {
        return false;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderVehicleFactoryBase(state, map)).toBeNull();

    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BVehicle DoRender by rendering destroyed bases when stamping is disabled", () => {
    const state = createVehicleFactoryRenderState({
      destroyed: true,
      dontStamp: true,
    });
    const map: VehicleFactoryRenderMap<VehicleFactoryImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderVehicleFactoryBase(state, map)).toEqual({
      surface: { name: "destroyed-p1-o2" },
      x: 112,
      y: 160,
      renderHit: false,
      aboutCenter: false,
    });
    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BVehicle DoRender as no command when the selected base image is missing", () => {
    const state = createVehicleFactoryRenderState({
      baseImages: [],
      doBaseRerender: true,
    });
    const map: VehicleFactoryRenderMap<VehicleFactoryImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderVehicleFactoryBase(state, map)).toBeNull();

    expect(state.doBaseRerender).toBe(true);
  });
});
