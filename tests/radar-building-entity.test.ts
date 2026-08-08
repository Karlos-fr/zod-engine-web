import { describe, expect, it } from "vitest";
import {
  renderRadarBuildingBase,
  type RadarBuildingRenderMap,
  type RadarBuildingRenderState,
  RadarBuildingEntity,
} from "../src/simulation/entities/RadarBuildingEntity";
import type { GameMap } from "../src/world/GameMap";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

type RadarBuildingImage = { name: string };

function createRadarBuildingRenderState(
  overrides: Partial<RadarBuildingRenderState<RadarBuildingImage>> = {},
): RadarBuildingRenderState<RadarBuildingImage> {
  return {
    position: { x: 144, y: 192 },
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
      { name: "destroyed-p0" },
      { name: "destroyed-p1" },
    ],
    ...overrides,
  };
}

describe("radar building entity", () => {
  it("ports BRadar Process without advancing animation before the interval", () => {
    const building = new RadarBuildingEntity({
      id: "radar-process-0",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.lastProcessTime = 10;
    const effectTimes: number[] = [];

    expect(building.process(10.24, (currentTime) => effectTimes.push(currentTime))).toBe(1);

    expect(effectTimes).toEqual([10.24]);
    expect(building.lastProcessTime).toBe(10);
    expect(building.frontLightIndex).toBe(0);
    expect(building.sideLightIndex).toBe(0);
    expect(building.boxSpinnerIndex).toBe(0);
    expect(building.dishIndex).toBe(0);
  });

  it("ports BRadar Process animation frame advancement and wrapping", () => {
    const building = new RadarBuildingEntity({
      id: "radar-process-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    building.lastProcessTime = 10;
    building.frontLightIndex = 1;
    building.sideLightIndex = 1;
    building.boxSpinnerIndex = 11;
    building.dishIndex = 7;

    expect(building.process(10.25)).toBe(1);

    expect(building.lastProcessTime).toBe(10.25);
    expect(building.frontLightIndex).toBe(0);
    expect(building.sideLightIndex).toBe(0);
    expect(building.boxSpinnerIndex).toBe(0);
    expect(building.dishIndex).toBe(0);
  });

  it("ports BRadar SetMapImpassables as a blocked footprint with open entrance", () => {
    const building = new RadarBuildingEntity({
      id: "radar-0",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    building.width = 4;
    building.height = 3;
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
      { x: 2, y: 3, impassable: undefined, destroyable: undefined },
      { x: 2, y: 4, impassable: undefined, destroyable: undefined },
      { x: 2, y: 5, impassable: undefined, destroyable: undefined },
      { x: 3, y: 3, impassable: undefined, destroyable: undefined },
      { x: 3, y: 4, impassable: undefined, destroyable: undefined },
      { x: 3, y: 5, impassable: undefined, destroyable: undefined },
      { x: 4, y: 3, impassable: undefined, destroyable: undefined },
      { x: 4, y: 4, impassable: undefined, destroyable: undefined },
      { x: 4, y: 5, impassable: undefined, destroyable: undefined },
      { x: 5, y: 3, impassable: undefined, destroyable: undefined },
      { x: 5, y: 4, impassable: undefined, destroyable: undefined },
      { x: 5, y: 5, impassable: undefined, destroyable: undefined },
      { x: 5, y: 5, impassable: false, destroyable: undefined },
    ]);
  });

  it("ports BRadar GetCraneEntrance as the fixed point below the building", () => {
    const building = new RadarBuildingEntity({
      id: "radar-1",
      kind: "building",
      position: { x: 96, y: 128 },
    });
    building.pixelHeight = 64;

    expect(building.getCraneEntrance()).toEqual({
      canEnter: true,
      x: 124,
      y: 224,
      exitX: 124,
      exitY: 224,
    });
  });

  it("ports BRadar GetCraneCenter as the radar crane interaction point", () => {
    const building = new RadarBuildingEntity({
      id: "radar-2",
      kind: "building",
      position: { x: 96, y: 128 },
    });

    expect(building.getCraneCenter()).toEqual({
      hasCenter: true,
      x: 124,
      y: 152,
    });
  });

  it("replaces BRadar DoRender by stamping the selected owner base image", () => {
    const state = createRadarBuildingRenderState();
    const stampCalls: Array<{ x: number; y: number; surface: RadarBuildingImage }> =
      [];
    const map: RadarBuildingRenderMap<RadarBuildingImage> = {
      permStamp(x, y, surface) {
        stampCalls.push({ x, y, surface });
        return true;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderRadarBuildingBase(state, map)).toBeNull();

    expect(stampCalls).toEqual([
      { x: 144, y: 192, surface: { name: "normal-p1-o2" } },
    ]);
    expect(state.doBaseRerender).toBe(false);
  });

  it("keeps BRadar DoRender base rerender pending when permanent stamping fails", () => {
    const state = createRadarBuildingRenderState();
    const map: RadarBuildingRenderMap<RadarBuildingImage> = {
      permStamp() {
        return false;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderRadarBuildingBase(state, map)).toBeNull();

    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BRadar DoRender by rendering destroyed bases from palette only", () => {
    const state = createRadarBuildingRenderState({
      owner: 0,
      destroyed: true,
      dontStamp: true,
    });
    const map: RadarBuildingRenderMap<RadarBuildingImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderRadarBuildingBase(state, map)).toEqual({
      surface: { name: "destroyed-p1" },
      x: 144,
      y: 192,
      renderHit: false,
      aboutCenter: false,
    });
    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BRadar DoRender as no command when the selected base image is missing", () => {
    const state = createRadarBuildingRenderState({
      baseImages: [],
      doBaseRerender: true,
    });
    const map: RadarBuildingRenderMap<RadarBuildingImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderRadarBuildingBase(state, map)).toBeNull();

    expect(state.doBaseRerender).toBe(true);
  });
});
