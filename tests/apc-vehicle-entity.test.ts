import { describe, expect, it } from "vitest";
import { ApcVehicleEntity } from "../src/simulation/entities/ApcVehicleEntity";

describe("APC vehicle entity", () => {
  it("ports VAPC CanEjectDrivers as enabled driver ejection", () => {
    const entity = new ApcVehicleEntity({
      id: "apc-1",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });

    expect(entity.canEjectDrivers()).toBe(true);
  });
});
