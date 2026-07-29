import { describe, expect, it } from "vitest";
import { RadarBuildingEntity } from "../src/simulation/entities/RadarBuildingEntity";

describe("radar building entity", () => {
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
