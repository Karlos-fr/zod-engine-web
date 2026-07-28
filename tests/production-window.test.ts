import { describe, expect, it } from "vitest";
import { BuildingType } from "../src/simulation/SimulationConstants";
import {
  clearProductionSelection,
  getProductionUnitSelectorRefId,
  ProductionType,
  PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS,
  PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS,
  PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS,
  PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
  setProductionBuildingType,
  setProductionIsOnlySelector,
  setProductionUnitSelectorRefId,
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

  it("ports GetUnitSelectorRefID as unit selector reference read", () => {
    const state = { unitSelectorRefId: 77 };

    expect(getProductionUnitSelectorRefId(state)).toBe(77);
  });

  it("ports production queue button vertical layout constants", () => {
    expect(PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS).toBe(13);
    expect(PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS).toBe(1);
  });
});
