import type { BuildingType } from "../simulation/SimulationConstants";
import type { SimulationTime } from "../simulation/SimulationTime";

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
 * Port of upstream `GetSelected` output.
 * Role: Carries the selected production object type, object id, and selection flag.
 * Upstream: gwproduction.h:54
 */
export type ProductionSelectedResult = {
  selectedObjectType: number;
  selectedObjectId: number;
  objectSelected: boolean;
};

/**
 * Port of upstream `GWPUnitSelector::GetCoords` output.
 * Role: Carries the production unit selector origin.
 * Upstream: gwproduction.h:123
 */
export type ProductionUnitSelectorCoordsResult = {
  x: number;
  y: number;
};

/**
 * Port of upstream `GWProduction` active state field.
 * Role: Holds whether the production window is currently active.
 * Upstream: gwproduction.h:56, gwproduction.h:277
 */
export type ProductionActiveState = {
  isActive: boolean;
};

/**
 * Port of upstream `GWProduction` coordinate fields.
 * Role: Holds the production window origin.
 * Upstream: gwproduction.h:49, gwproduction.h:92
 */
export type ProductionCoordinateState = {
  x: number;
  y: number;
};

/**
 * Port of upstream `GWProduction` center coordinate fields.
 * Role: Holds the production window center anchor.
 * Upstream: gwproduction.h:50, gwproduction.h:273
 */
export type ProductionCenterCoordinateState = {
  centerX: number;
  centerY: number;
};

/**
 * Port of upstream `GWPUnitSelector` coordinate fields.
 * Role: Holds the production unit selector origin.
 * Upstream: gwproduction.h:122, gwproduction.h:161
 */
export type ProductionUnitSelectorCoordinateState = {
  x: number;
  y: number;
};

/**
 * Port of upstream `GWProduction` reference id field.
 * Role: Holds the object reference associated with the production window.
 * Upstream: gwproduction.h:203, gwproduction.h:264
 */
export type ProductionRefState = {
  refId: number;
};

/**
 * Port of upstream `GWPUnitSelector` reference id field.
 * Role: Holds the object reference associated with the production unit selector.
 * Upstream: gwproduction.h:131, gwproduction.h:155
 */
export type ProductionUnitSelectorObjectRefState = {
  refId: number;
};

/**
 * Port of upstream `GWPFullUnitSelector` ztime pointer field.
 * Role: Holds the simulation clock used by the full production selector.
 * Upstream: gwproduction.h:75
 */
export type ProductionZTimeState = {
  ztime: SimulationTime | null;
};

/**
 * Port of upstream `GWPUnitSelector` ztime pointer field.
 * Role: Holds the simulation clock used by the production unit selector.
 * Upstream: gwproduction.h:150
 */
export type ProductionUnitSelectorZTimeState = {
  ztime: SimulationTime | null;
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
 * Port of upstream `GetSelected`.
 * Role: Returns the selected production object type, object id, and selection flag.
 * Upstream: gwproduction.h:54
 */
export function getProductionSelected(
  state: ProductionSelectionState,
): ProductionSelectedResult {
  return {
    selectedObjectType: state.selectedObjectType,
    selectedObjectId: state.selectedObjectId,
    objectSelected: state.objectSelected,
  };
}

/**
 * Port of upstream `IsActive`.
 * Role: Returns whether the production window is currently active.
 * Upstream: gwproduction.h:56
 */
export function isProductionActive(state: ProductionActiveState): boolean {
  return state.isActive;
}

/**
 * Port of upstream `GWProduction::SetActive`.
 * Role: Updates whether the production window is currently active.
 * Upstream: gwproduction.h:52
 */
export function setProductionActive(
  state: ProductionActiveState,
  isActive: boolean,
): void {
  state.isActive = isActive;
}

/**
 * Port of upstream `GWPUnitSelector::SetActive`.
 * Role: Updates whether the production unit selector is currently active.
 * Upstream: gwproduction.h:124
 */
export function setProductionUnitSelectorActive(
  state: ProductionActiveState,
  isActive: boolean,
): void {
  state.isActive = isActive;
}

/**
 * Port of upstream `GWProduction::SetCoords`.
 * Role: Updates the production window origin.
 * Upstream: gwproduction.h:49
 */
export function setProductionCoords(
  state: ProductionCoordinateState,
  x: number,
  y: number,
): void {
  state.x = x;
  state.y = y;
}

/**
 * Port of upstream `SetCenterCoords`.
 * Role: Updates the production window center anchor.
 * Upstream: gwproduction.h:50
 */
export function setProductionCenterCoords(
  state: ProductionCenterCoordinateState,
  centerX: number,
  centerY: number,
): void {
  state.centerX = centerX;
  state.centerY = centerY;
}

/**
 * Port of upstream `GWPFullUnitSelector::SetZTime`.
 * Role: Stores the simulation clock reference for the full production selector.
 * Upstream: gwproduction.h:44
 */
export function setProductionZTime(
  state: ProductionZTimeState,
  ztime: SimulationTime,
): void {
  state.ztime = ztime;
}

/**
 * Port of upstream `GWPUnitSelector::SetCoords`.
 * Role: Updates the production unit selector origin.
 * Upstream: gwproduction.h:122
 */
export function setProductionUnitSelectorCoords(
  state: ProductionUnitSelectorCoordinateState,
  x: number,
  y: number,
): void {
  state.x = x;
  state.y = y;
}

/**
 * Port of upstream `GWPUnitSelector::SetZTime`.
 * Role: Stores the simulation clock reference for the production unit selector.
 * Upstream: gwproduction.h:121
 */
export function setProductionUnitSelectorZTime(
  state: ProductionUnitSelectorZTimeState,
  ztime: SimulationTime,
): void {
  state.ztime = ztime;
}

/**
 * Port of upstream `GWPUnitSelector::GetCoords`.
 * Role: Returns the production unit selector origin.
 * Upstream: gwproduction.h:123
 */
export function getProductionUnitSelectorCoords(
  state: ProductionUnitSelectorCoordinateState,
): ProductionUnitSelectorCoordsResult {
  return {
    x: state.x,
    y: state.y,
  };
}

/**
 * Port of upstream `GWProduction::SetRefID`.
 * Role: Updates the object reference associated with the production window.
 * Upstream: gwproduction.h:203
 */
export function setProductionRefId(
  state: ProductionRefState,
  refId: number,
): void {
  state.refId = refId;
}

/**
 * Port of upstream `GWProduction::GetRefID`.
 * Role: Returns the object reference associated with the production window.
 * Upstream: gwproduction.h:205
 */
export function getProductionRefId(state: ProductionRefState): number {
  return state.refId;
}

/**
 * Port of upstream `GWPUnitSelector::GetRefID`.
 * Role: Returns the object reference associated with the production unit selector.
 * Upstream: gwproduction.h:131
 */
export function getProductionUnitSelectorObjectRefId(
  state: ProductionUnitSelectorObjectRefState,
): number {
  return state.refId;
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
 * Port of upstream `GWPUnitSelector` full selector load flag.
 * Role: Holds whether the full production selector should be loaded.
 * Upstream: gwproduction.h:130, gwproduction.h:165
 */
export type ProductionUnitSelectorLoadState = {
  loadFullSelector: boolean;
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
 * Port of upstream `GWPUnitSelector::LoadFullSelector`.
 * Role: Returns whether the full production selector should be loaded.
 * Upstream: gwproduction.h:130
 */
export function shouldLoadProductionFullSelector(
  state: ProductionUnitSelectorLoadState,
): boolean {
  return state.loadFullSelector;
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
