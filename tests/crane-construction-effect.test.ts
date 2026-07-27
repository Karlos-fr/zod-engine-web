import { describe, expect, it } from "vitest";
import {
  CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER,
  CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX,
  CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE,
  CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
  ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED,
  moveCraneConstructionItemToDestination,
  setCraneConstructionTravelDistances,
} from "../src/simulation/CraneConstructionEffect";

describe("crane construction effect", () => {
  it("adapts the ecraneconco.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/CraneConstructionEffect");
    const secondImport = await import("../src/simulation/CraneConstructionEffect");

    expect(ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED).toBe(
      firstImport.ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED,
    );
  });

  it("ports travel_time_width as the travel animation window", () => {
    expect(CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH).toBe(0.8);
  });

  it("ports MoveToDest as a destination snap helper", () => {
    const item = {
      x: 10,
      y: 20,
      destX: 30,
      destY: 40,
    };

    moveCraneConstructionItemToDestination(item);

    expect(item).toEqual({
      x: 30,
      y: 40,
      destX: 30,
      destY: 40,
    });
  });

  it("ports SetTravelDistances as a travel delta helper", () => {
    const item = {
      x: 0,
      y: 0,
      startX: 8,
      startY: 12,
      destX: 28,
      destY: 4,
      widthDistance: 99,
      heightDistance: 99,
    };

    setCraneConstructionTravelDistances(item);

    expect(item.widthDistance).toBe(20);
    expect(item.heightDistance).toBe(-8);
  });

  it("ports construction object offsets from ecraneconco.cpp", () => {
    expect(CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE).toBe(12);
    expect(CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE).toBe(6);
    expect(CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER).toBe(18);
    expect(CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE).toBe(6);
  });

  it("ports construction entrance offsets from ecraneconco.cpp", () => {
    expect(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE).toBe(16);
    expect(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX).toBe(32);
  });
});
