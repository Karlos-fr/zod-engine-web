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
});
