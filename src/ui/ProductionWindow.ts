import type { BuildingType } from "../simulation/SimulationConstants";

/**
 * Upstream: gwproduction.h, gwproduction.cpp
 */

/**
 * Port of upstream `_ZGWPRODUCTION_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gwproduction.h:2
 */
export const ZGW_PRODUCTION_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `gwprod_type`.
 * Role: Identifies the production selector category handled by the production window.
 * Upstream: gwproduction.h:7-10
 */
export enum ProductionType {
  Robot = 0,
  Vehicle = 1,
  Fort = 2,
  TypesMax = 3,
}

/**
 * Port of upstream `GWProduction` selection fields.
 * Role: Holds the selected object type, object id, and selection flag reset by `ClearSelected`.
 * Upstream: gwproduction.h:53, gwproduction.h:270-272
 */
export type ProductionSelectionState = {
  selectedObjectType: number;
  selectedObjectId: number;
  objectSelected: boolean;
};

/**
 * Port of upstream `ClearSelected`.
 * Role: Clears the selected production object type, object id, and selection flag.
 * Upstream: gwproduction.h:53
 */
export function clearProductionSelection(state: ProductionSelectionState): void {
  state.selectedObjectType = 0;
  state.selectedObjectId = 0;
  state.objectSelected = false;
}

/**
 * Port of upstream `GWProduction` unit selector reference field.
 * Role: Holds the object reference for the full unit selector.
 * Upstream: gwproduction.h:51, gwproduction.h:273
 */
export type ProductionUnitSelectorRefState = {
  unitSelectorRefId: number;
};

/**
 * Port of upstream `SetUnitSelectorRefID`.
 * Role: Updates the object reference for the production unit selector.
 * Upstream: gwproduction.h:51
 */
export function setProductionUnitSelectorRefId(
  state: ProductionUnitSelectorRefState,
  unitSelectorRefId: number,
): void {
  state.unitSelectorRefId = unitSelectorRefId;
}

/**
 * Port of upstream `GetUnitSelectorRefID`.
 * Role: Returns the object reference for the production unit selector.
 * Upstream: gwproduction.h:55
 */
export function getProductionUnitSelectorRefId(
  state: ProductionUnitSelectorRefState,
): number {
  return state.unitSelectorRefId;
}

/**
 * Port of upstream `GWProduction` selector mode field.
 * Role: Holds whether the production window is being used only as a selector.
 * Upstream: gwproduction.h:128, gwproduction.h:280
 */
export type ProductionSelectorModeState = {
  isOnlySelector: boolean;
};

/**
 * Port of upstream `GWProduction` building type field.
 * Role: Holds the selected production building type.
 * Upstream: gwproduction.h:48
 */
export type ProductionBuildingTypeState = {
  buildingType: BuildingType;
};

/**
 * Port of upstream `SetIsOnlySelector`.
 * Role: Updates whether the production window is operating only as a selector.
 * Upstream: gwproduction.h:128
 */
export function setProductionIsOnlySelector(
  state: ProductionSelectorModeState,
  isOnlySelector: boolean,
): void {
  state.isOnlySelector = isOnlySelector;
}

/**
 * Port of upstream `SetBuildingType`.
 * Role: Updates the selected production building type.
 * Upstream: gwproduction.h:48
 */
export function setProductionBuildingType(
  state: ProductionBuildingTypeState,
  buildingType: BuildingType,
): void {
  state.buildingType = buildingType;
}

/**
 * Port of upstream `GWP_SELECTOR_CENTER_X`.
 * Role: Defines the x-offset used to center the full unit selector from the production window placement point.
 * Upstream: gwproduction.h:102
 */
export const PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS = 24;

/**
 * Port of upstream `GWP_SELECTOR_CENTER_Y`.
 * Role: Defines the y-offset used to center the full unit selector from the production window placement point.
 * Upstream: gwproduction.h:103
 */
export const PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS = 21;

/**
 * Port of upstream `button_h`.
 * Role: Defines the vertical height step for production queue buttons.
 * Upstream: gwproduction.cpp:190
 */
export const PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS = 13;

/**
 * Port of upstream `button_margin`.
 * Role: Defines the vertical gap between production queue buttons.
 * Upstream: gwproduction.cpp:191
 */
export const PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS = 1;
