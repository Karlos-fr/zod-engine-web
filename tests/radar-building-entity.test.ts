import { describe, expect, it } from "vitest";
import { RadarBuildingEntity } from "../src/simulation/entities/RadarBuildingEntity";
import type { GameMap } from "../src/world/GameMap";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

describe("radar building entity", () => {
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
});
