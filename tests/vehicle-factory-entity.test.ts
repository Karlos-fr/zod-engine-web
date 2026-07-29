import { describe, expect, it } from "vitest";
import { VehicleFactoryEntity } from "../src/simulation/entities/VehicleFactoryEntity";

describe("vehicle factory entity", () => {
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
