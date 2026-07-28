import { describe, expect, it } from "vitest";
import { BuildingType } from "../src/simulation/SimulationConstants";
import { SimulationTime } from "../src/simulation/SimulationTime";
import {
  clearProductionSelection,
  getProductionRefId,
  getProductionSelected,
  getProductionUnitSelectorCoords,
  getProductionUnitSelectorObjectRefId,
  getProductionUnitSelectorRefId,
  isProductionActive,
  ProductionType,
  PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS,
  PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS,
  PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS,
  PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
  setProductionActive,
  setProductionBuildingType,
  setProductionCenterCoords,
  setProductionCoords,
  setProductionIsOnlySelector,
  setProductionRefId,
  setProductionZTime,
  setProductionUnitSelectorActive,
  setProductionUnitSelectorCoords,
  setProductionUnitSelectorRefId,
  setProductionUnitSelectorZTime,
  shouldLoadProductionFullSelector,
  ZGW_PRODUCTION_HEADER_GUARD_PORTED,
} from "../src/ui/ProductionWindow";

describe("production window", () => {
  it("adapts the gwproduction.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/ProductionWindow");
    const secondImport = await import("../src/ui/ProductionWindow");

    expect(ZGW_PRODUCTION_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_PRODUCTION_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_PRODUCTION_HEADER_GUARD_PORTED,
    );
  });

  it("ports full selector center offsets with C++ integer division", () => {
    expect(PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS).toBe(24);
    expect(PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS).toBe(21);
  });

  it("ports gwprod_type as production selector categories", () => {
    expect(ProductionType.Robot).toBe(0);
    expect(ProductionType.Vehicle).toBe(1);
    expect(ProductionType.Fort).toBe(2);
    expect(ProductionType.TypesMax).toBe(3);
  });

  it("ports ClearSelected as production selection state reset", () => {
    const state = {
      selectedObjectType: 2,
      selectedObjectId: 8,
      objectSelected: true,
    };

    clearProductionSelection(state);

    expect(state).toEqual({
      selectedObjectType: 0,
      selectedObjectId: 0,
      objectSelected: false,
    });
  });

  it("ports GetSelected as a production selection snapshot", () => {
    const state = {
      selectedObjectType: 2,
      selectedObjectId: 8,
      objectSelected: true,
    };

    const selected = getProductionSelected(state);
    state.selectedObjectType = 0;

    expect(selected).toEqual({
      selectedObjectType: 2,
      selectedObjectId: 8,
      objectSelected: true,
    });
  });

  it("ports IsActive as a production active-state read", () => {
    expect(isProductionActive({ isActive: true })).toBe(true);
    expect(isProductionActive({ isActive: false })).toBe(false);
  });

  it("ports GWProduction SetActive as production active-state assignment", () => {
    const state = { isActive: false };

    setProductionActive(state, true);
    expect(state.isActive).toBe(true);

    setProductionActive(state, false);
    expect(state.isActive).toBe(false);
  });

  it("ports GWPUnitSelector SetActive as selector active-state assignment", () => {
    const state = { isActive: false };

    setProductionUnitSelectorActive(state, true);
    expect(state.isActive).toBe(true);

    setProductionUnitSelectorActive(state, false);
    expect(state.isActive).toBe(false);
  });

  it("ports GWProduction SetCoords as production window coordinate assignment", () => {
    const state = { x: 0, y: 0 };

    setProductionCoords(state, 10, 20);

    expect(state).toEqual({ x: 10, y: 20 });
  });

  it("ports SetCenterCoords as production window center assignment", () => {
    const state = { centerX: 0, centerY: 0 };

    setProductionCenterCoords(state, 24, 21);

    expect(state).toEqual({ centerX: 24, centerY: 21 });
  });

  it("ports GWPFullUnitSelector SetZTime as simulation clock reference assignment", () => {
    const ztime = new SimulationTime();
    const state = { ztime: null };

    setProductionZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });

  it("ports GWPUnitSelector SetCoords as unit selector coordinate assignment", () => {
    const state = { x: 0, y: 0 };

    setProductionUnitSelectorCoords(state, 30, 40);

    expect(state).toEqual({ x: 30, y: 40 });
  });

  it("ports GWPUnitSelector SetZTime as simulation clock reference assignment", () => {
    const ztime = new SimulationTime();
    const state = { ztime: null };

    setProductionUnitSelectorZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });

  it("ports GWPUnitSelector GetCoords as a unit selector coordinate snapshot", () => {
    const state = { x: 30, y: 40 };

    const coords = getProductionUnitSelectorCoords(state);
    state.x = 0;

    expect(coords).toEqual({ x: 30, y: 40 });
  });

  it("ports SetIsOnlySelector as selector mode state update", () => {
    const state = { isOnlySelector: false };

    setProductionIsOnlySelector(state, true);
    expect(state.isOnlySelector).toBe(true);

    setProductionIsOnlySelector(state, false);
    expect(state.isOnlySelector).toBe(false);
  });

  it("ports SetBuildingType as production building type update", () => {
    const state = { buildingType: BuildingType.FortFront };

    setProductionBuildingType(state, BuildingType.VehicleFactory);

    expect(state.buildingType).toBe(BuildingType.VehicleFactory);
  });

  it("ports SetUnitSelectorRefID as unit selector reference update", () => {
    const state = { unitSelectorRefId: 0 };

    setProductionUnitSelectorRefId(state, 42);

    expect(state.unitSelectorRefId).toBe(42);
  });

  it("ports SetRefID as production reference update", () => {
    const state = { refId: 0 };

    setProductionRefId(state, 42);

    expect(state.refId).toBe(42);
  });

  it("ports GWProduction GetRefID as a production reference read", () => {
    const state = { refId: 42 };

    expect(getProductionRefId(state)).toBe(42);
  });

  it("ports GWPUnitSelector GetRefID as a unit selector object reference read", () => {
    const state = { refId: 88 };

    expect(getProductionUnitSelectorObjectRefId(state)).toBe(88);
  });

  it("ports GetUnitSelectorRefID as unit selector reference read", () => {
    const state = { unitSelectorRefId: 77 };

    expect(getProductionUnitSelectorRefId(state)).toBe(77);
  });

  it("ports GWPUnitSelector LoadFullSelector as a full-selector load flag read", () => {
    expect(shouldLoadProductionFullSelector({ loadFullSelector: true })).toBe(
      true,
    );
    expect(shouldLoadProductionFullSelector({ loadFullSelector: false })).toBe(
      false,
    );
  });

  it("ports production queue button vertical layout constants", () => {
    expect(PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS).toBe(13);
    expect(PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS).toBe(1);
  });
});
