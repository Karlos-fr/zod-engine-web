import { describe, expect, it } from "vitest";
import { VehicleEntity } from "../src/simulation/entities/VehicleEntity";

describe("vehicle entity", () => {
  it("ports ZVehicle CanSetWaypoints as enabled waypoint orders", () => {
    const entity = new VehicleEntity({
      id: "vehicle-1",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetWaypoints()).toBe(true);
  });
});
