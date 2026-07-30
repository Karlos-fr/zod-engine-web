import { describe, expect, it } from "vitest";
import { VehicleFactoryEntity } from "../src/simulation/entities/VehicleFactoryEntity";
import type { GameMap } from "../src/world/GameMap";

type ImpassableCall = {
  x: number;
  y: number;
  impassable?: boolean;
  destroyable?: boolean;
};

describe("vehicle factory entity", () => {
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
});
