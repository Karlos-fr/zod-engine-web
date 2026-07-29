import { describe, expect, it } from "vitest";
import {
  CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER,
  CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX,
  CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE,
  CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
  CraneConstructionItem,
  ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED,
  beginCraneConstructionDeath,
  compareCraneConstructionRenderItemBottom,
  moveCraneConstructionItemToDestination,
  setCraneConstructionItemReturn,
  setCraneConstructionItemStart,
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

  it("ports ECraneConcoItem default construction", () => {
    expect(new CraneConstructionItem()).toEqual({
      type: -1,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      destX: 0,
      destY: 0,
      width: 0,
      height: 0,
      widthDistance: 0,
      heightDistance: 0,
    });
  });

  it("ports ECraneConcoItem Init and Move", () => {
    const item = new CraneConstructionItem();

    item.init(3, 20, 30, 8, 12);
    item.destX = 45;
    item.destY = 50;
    item.setTravelDistances();
    item.move(0.5);

    expect(item).toEqual({
      type: 3,
      x: 32,
      y: 40,
      startX: 20,
      startY: 30,
      destX: 45,
      destY: 50,
      width: 8,
      height: 12,
      widthDistance: 25,
      heightDistance: 20,
    });
  });

  it("ports ECraneConcoItem SetStart, SetReturn, and MoveToDest", () => {
    const item = new CraneConstructionItem();
    item.init(2, 10, 20, 8, 12);

    item.setStart(50, 80);
    item.setReturn(100, 120);
    item.moveToDestination();

    expect(item).toEqual({
      type: 2,
      x: 96,
      y: 114,
      startX: 46,
      startY: 76,
      destX: 96,
      destY: 114,
      width: 8,
      height: 12,
      widthDistance: 50,
      heightDistance: 38,
    });
  });

  it("replaces ecc_render_item_comp as a strict bottom-edge comparison", () => {
    expect(
      compareCraneConstructionRenderItemBottom(
        { y: 10, height: 8 },
        { y: 12, height: 9 },
      ),
    ).toBe(true);
    expect(
      compareCraneConstructionRenderItemBottom(
        { y: 10, height: 8 },
        { y: 12, height: 6 },
      ),
    ).toBe(false);
    expect(
      compareCraneConstructionRenderItemBottom(
        { y: 10, height: 8 },
        { y: 5, height: 7 },
      ),
    ).toBe(false);
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
      height: 10,
      widthDistance: 99,
      heightDistance: 99,
    };

    setCraneConstructionTravelDistances(item);

    expect(item.widthDistance).toBe(20);
    expect(item.heightDistance).toBe(-8);
  });

  it("ports SetReturn as a centered return destination helper", () => {
    const item = {
      x: 10,
      y: 20,
      startX: 0,
      startY: 0,
      destX: 0,
      destY: 0,
      width: 8,
      height: 12,
      widthDistance: 0,
      heightDistance: 0,
    };

    setCraneConstructionItemReturn(item, 50, 80);

    expect(item).toEqual({
      x: 10,
      y: 20,
      startX: 10,
      startY: 20,
      destX: 46,
      destY: 74,
      width: 8,
      height: 12,
      widthDistance: 36,
      heightDistance: 54,
    });
  });

  it("ports SetStart as a centered start placement helper", () => {
    const item = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      width: 10,
    };

    setCraneConstructionItemStart(item, 50, 80);

    expect(item).toEqual({
      x: 45,
      y: 75,
      startX: 45,
      startY: 75,
      width: 10,
    });
  });

  it("ports ECraneConco BeginDeath as return travel setup", () => {
    const returns: Array<[number, number]> = [];
    const state = {
      travelBack: false,
      travelTimeStart: 0,
      travelTimeEnd: 0,
      travelTimeWidth: CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
      renderItems: [
        { setReturn: (x: number, y: number) => returns.push([x, y]) },
        { setReturn: (x: number, y: number) => returns.push([x, y]) },
      ],
    };

    beginCraneConstructionDeath(state, 40, 70, 12.5);

    expect(state).toEqual({
      travelBack: true,
      travelTimeStart: 12.5,
      travelTimeEnd: 13.3,
      travelTimeWidth: CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
      renderItems: state.renderItems,
    });
    expect(returns).toEqual([
      [56, 86],
      [56, 86],
    ]);
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
