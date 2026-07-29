import type { BuildingType } from "../simulation/SimulationConstants";
import type { SimulationTime } from "../simulation/SimulationTime";
import type { GameEntity } from "../simulation/entities/GameEntity";
import {
  loadRotozoomCacheBaseImage,
  type BaseImageFileLoadState,
} from "../rendering/SurfaceLifecycle";
import {
  PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_HEIGHT_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_WIDTH_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_SIDE_SIZE_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_TOP_HEIGHT_PIXELS,
} from "./ProductionFullUnitSelector";

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
 * Port of upstream `building_state`.
 * Role: Identifies the production UI state used by building production actions.
 * Upstream: zbuilding.h:12-15
 */
export enum ProductionBuildingState {
  Place = 0,
  Select = 1,
  Building = 2,
  Paused = 3,
  MaxBuildingStates = 4,
}

/**
 * Port of upstream `ZObject` forward declaration.
 * Role: Provides the entity reference type used by production window bindings.
 * Upstream: gwproduction.h:17
 */
export type ProductionObjectReference = GameEntity;

/**
 * Port of upstream `ZBuilding` forward declaration.
 * Role: Provides the building reference type used by production window bindings.
 * Upstream: gwproduction.h:18
 */
export type ProductionBuildingReference = GameEntity;

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
 * Port of upstream production selector button click dependency.
 * Role: Receives local click coordinates from the production unit selector.
 * Upstream: gwproduction_us.cpp:369-370
 */
export type ProductionUnitSelectorClickButton = {
  click(x: number, y: number): void;
};

/**
 * Port of upstream `GWPUnitSelector` click fields.
 * Role: Holds selector activation, geometry, and scroll buttons for hit testing.
 * Upstream: gwproduction_us.cpp:364-375
 */
export type ProductionUnitSelectorClickState = {
  isActive: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  upButton: ProductionUnitSelectorClickButton;
  downButton: ProductionUnitSelectorClickButton;
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
 * Port of upstream `GWPUnitSelector` initialization image fields.
 * Role: Tracks the production unit selector percentage bar images and initialization completion.
 * Upstream: gwproduction_us.cpp:69-71
 */
export type ProductionUnitSelectorInitState = {
  percentageBarImage: BaseImageFileLoadState;
  yellowPercentageBarImage: BaseImageFileLoadState;
  finishedInit: boolean;
};

export const PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH =
  "assets/other/production_gui/percentage_bar.png";

export const PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH =
  "assets/other/production_gui/percentage_bar_yellow.png";

/**
 * Port of upstream `GWPUnitSelector` draw object field.
 * Role: Holds the transient rendered object owned by the production unit selector.
 * Upstream: gwproduction.h:154
 */
export type ProductionUnitSelectorDrawObjectState<TDrawObject = unknown> = {
  drawObject: TDrawObject | null;
};

/**
 * Port of upstream `GWPFullUnitSelector` lists and selection cache fields.
 * Role: Holds cached unit lists, cached building selection metadata, and generated buttons.
 * Upstream: gwproduction.h:76-80, gwproduction_fus.cpp:232-239
 */
export type ProductionFullUnitSelectorListsState<
  TObject = unknown,
  TButton = unknown,
> = {
  robotList: TObject[];
  vehicleList: TObject[];
  cannonList: TObject[];
  listsBuildingType: number;
  listsBuildingLevel: number;
  buttonList: TButton[];
};

/**
 * Port of upstream `ZMap::GetMapBasics` dependency surface.
 * Role: Provides map dimensions in tiles for full production selector placement.
 * Upstream: gwproduction_fus.cpp:90-91
 */
export type ProductionFullSelectorMapBasicsProvider = {
  getMapBasics(): { width: number; height: number };
};

/**
 * Port of upstream `GWPFullUnitSelector` geometry fields.
 * Role: Holds the full selector center, size, origin, and optional map boundary source.
 * Upstream: gwproduction_fus.cpp:83-98
 */
export type ProductionFullUnitSelectorGeometryState = {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  zmap: ProductionFullSelectorMapBasicsProvider | null;
};

/**
 * Port of upstream `GWPFullUnitSelector` size and list fields.
 * Role: Holds generated unit lists and calculated full selector dimensions.
 * Upstream: gwproduction_fus.cpp:280-289
 */
export type ProductionFullUnitSelectorSizeState<TObject = unknown> = {
  width: number;
  height: number;
  robotList: TObject[];
  vehicleList: TObject[];
  cannonList: TObject[];
};

/**
 * Port of upstream `ZObject::GetObjectID` dependency surface.
 * Role: Provides the object id read used by the production unit selector draw object.
 * Upstream: gwproduction_us.cpp:452
 */
export type ProductionUnitSelectorDrawObjectIdSource = {
  getObjectId(): { objectType: number; objectId: number };
};

/**
 * Port of upstream `GWPUnitSelector::GetSelectedID` output.
 * Role: Carries whether the selector has a draw object and its selected object id when present.
 * Upstream: gwproduction_us.cpp:448-457
 */
export type ProductionUnitSelectorSelectedIdResult = {
  selected: boolean;
  objectType: number;
  objectId: number;
};

/**
 * Port of upstream `GWProduction` wheel selector dependency surface.
 * Role: Provides the wheel input handlers used by the production unit and queue selectors.
 * Upstream: gwproduction.cpp:698-712
 */
export type ProductionWheelSelector = {
  wheelUpButton(): boolean;
  wheelDownButton(): boolean;
};

/**
 * Port of upstream `GWProduction` wheel routing fields.
 * Role: Holds the unit selector and queue selector used for production wheel input.
 * Upstream: gwproduction.cpp:698-712
 */
export type ProductionWheelState = {
  unitSelector: ProductionWheelSelector;
  queueSelector: ProductionWheelSelector;
};

/**
 * Port of upstream `SetBuildList` dependency surface.
 * Role: Provides build-list assignment for production selectors.
 * Upstream: gwproduction.cpp:378-380
 */
export type ProductionBuildListReceiver<TBuildList = unknown> = {
  setBuildList(buildList: TBuildList | null): void;
};

/**
 * Port of upstream `GWProduction` build-list fields.
 * Role: Holds the production build list and selectors sharing that reference.
 * Upstream: gwproduction.cpp:374-381
 */
export type ProductionBuildListState<TBuildList = unknown> = {
  buildList: TBuildList | null;
  unitSelector: ProductionBuildListReceiver<TBuildList>;
  queueSelector: ProductionBuildListReceiver<TBuildList>;
  fullSelector: ProductionBuildListReceiver<TBuildList>;
};

/**
 * Port of upstream `SetBuildingObj` dependency surface.
 * Role: Provides building object assignment for production selectors.
 * Upstream: gwproduction.cpp:473-475
 */
export type ProductionBuildingObjectReceiver<TBuilding = unknown> = {
  setBuildingObject(buildingObject: TBuilding | null): void;
};

/**
 * Port of upstream `GWProduction` building object fields.
 * Role: Holds the production building object and selectors sharing that reference.
 * Upstream: gwproduction.cpp:469-476
 */
export type ProductionBuildingObjectState<TBuilding = unknown> = {
  buildingObject: TBuilding | null;
  unitSelector: ProductionBuildingObjectReceiver<TBuilding>;
  queueSelector: ProductionBuildingObjectReceiver<TBuilding>;
  fullSelector: ProductionBuildingObjectReceiver<TBuilding>;
};

/**
 * Port of upstream `ZBuilding::GetLevel` dependency surface.
 * Role: Provides the building level used by production selector scrolling.
 * Upstream: gwproduction_us.cpp:421
 */
export type ProductionBuildingLevelSource = {
  getLevel(): number;
};

/**
 * Port of upstream `ZBuildList::GetBuildList` dependency surface.
 * Role: Provides the selectable production units for a building type and level.
 * Upstream: gwproduction_us.cpp:424, gwproduction_us.cpp:428
 */
export type ProductionBuildListSource<TUnit = unknown> = {
  getBuildList(buildingType: number, buildingLevel: number): TUnit[];
};

/**
 * Port of upstream `GWPUnitSelector` scroll state.
 * Role: Holds the selected unit index and build-list dependencies used by selector scrolling.
 * Upstream: gwproduction_us.cpp:416-430
 */
export type ProductionUnitSelectorScrollState<TUnit = unknown> = {
  buildingObject: ProductionBuildingLevelSource | null;
  buildList: ProductionBuildListSource<TUnit> | null;
  buildingType: number;
  selectedIndex: number;
};

/**
 * Port of upstream production queue button object fields.
 * Role: Carries the queued object type and object id used by queue cancellation.
 * Upstream: gwproduction.cpp:561-562
 */
export type ProductionQueueButtonInfo = {
  ot: number;
  oid: number;
};

/**
 * Port of upstream `ZBuilding::GetRefID` dependency surface.
 * Role: Provides the building reference id used by production queue requests.
 * Upstream: gwproduction.cpp:549, gwproduction.cpp:559
 */
export type ProductionBuildingRefSource = {
  getRefId(): number;
};

/**
 * Port of upstream `GWPQueueSelector::GetSelectedID` output.
 * Role: Carries whether the queue selector has a selected object and its object type/id.
 * Upstream: gwproduction.cpp:544
 */
export type ProductionQueueSelectedIdResult = {
  selected: boolean;
  objectType: number;
  objectId: number;
};

/**
 * Port of upstream queue selector dependency surface.
 * Role: Provides the selected queued object read used by `GWProduction::DoQueueButton`.
 * Upstream: gwproduction.cpp:544
 */
export type ProductionQueueSelector = {
  getSelectedId(): ProductionQueueSelectedIdResult;
};

/**
 * Port of upstream production new queue item flags.
 * Role: Carries the queue insertion request emitted by the production window.
 * Upstream: gwproduction.cpp:546-549
 */
export type ProductionNewQueueFlags = {
  sendNewQueueItem: boolean;
  qot: number;
  qoid: number;
  qrefId: number;
};

/**
 * Port of upstream `GWProduction` queue button dependencies.
 * Role: Holds the queue selector, building, and flags mutated by queue insertion.
 * Upstream: gwproduction.cpp:544-549
 */
export type ProductionQueueButtonState = {
  queueSelector: ProductionQueueSelector;
  buildingObject: ProductionBuildingRefSource;
  flags: ProductionNewQueueFlags;
};

/**
 * Port of upstream production cancel queue flags.
 * Role: Carries the queue cancellation request emitted by the production window.
 * Upstream: gwproduction.cpp:558-562
 */
export type ProductionCancelQueueFlags = {
  sendCancelQueueItem: boolean;
  qcrefId: number;
  qcIndex: number;
  qcot: number;
  qcoid: number;
};

/**
 * Port of upstream `GWProduction` cancel queue dependencies.
 * Role: Holds the building, queue buttons, and flags mutated by queue cancellation.
 * Upstream: gwproduction.cpp:556-562
 */
export type ProductionCancelQueueState = {
  buildingObject: ProductionBuildingRefSource;
  queueButtonList: ProductionQueueButtonInfo[];
  flags: ProductionCancelQueueFlags;
};

/**
 * Port of upstream production stop flags.
 * Role: Carries the stop-production request emitted by the production window.
 * Upstream: gwproduction.cpp:516-517
 */
export type ProductionStopProductionFlags = {
  sendStopProduction: boolean;
  prefId: number;
};

/**
 * Port of upstream `GWProduction` cancel button dependencies.
 * Role: Holds the production state, building, close flag, and stop-production flags.
 * Upstream: gwproduction.cpp:505-520
 */
export type ProductionCancelButtonState = {
  state: ProductionBuildingState;
  buildingObject: ProductionBuildingRefSource;
  killme: boolean;
  flags: ProductionStopProductionFlags;
};

/**
 * Port of upstream connected-zone fields used by cannon placement.
 * Role: Describes the map zone bounds where a cannon may be placed.
 * Upstream: gwproduction.cpp:531-534
 */
export type ProductionConnectedZone = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * Port of upstream building cannon placement dependencies.
 * Role: Provides built cannon list, reference id, and connected zone for placement.
 * Upstream: gwproduction.cpp:524-526, gwproduction.cpp:529-534
 */
export type ProductionPlaceBuilding = ProductionBuildingRefSource & {
  getBuiltCannonList(): number[];
  getConnectedZone(): ProductionConnectedZone | null;
};

/**
 * Port of upstream placement cannon flags.
 * Role: Carries the cannon placement request emitted by the production window.
 * Upstream: gwproduction.cpp:528-534
 */
export type ProductionPlaceCannonFlags = {
  placeCannon: boolean;
  coid: number;
  crefId: number;
  cleft: number;
  cright: number;
  ctop: number;
  cbottom: number;
};

/**
 * Port of upstream `GWProduction` place button dependencies.
 * Role: Holds the production building, close flag, and placement flags.
 * Upstream: gwproduction.cpp:522-538
 */
export type ProductionPlaceButtonState = {
  buildingObject: ProductionPlaceBuilding | null;
  killme: boolean;
  flags: ProductionPlaceCannonFlags;
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
 * Port of upstream `GWPUnitSelector::Init`.
 * Role: Loads the production unit selector percentage bars and marks initialization complete.
 * Upstream: gwproduction_us.cpp:66-72
 */
export function initProductionUnitSelector<TSurface>(
  state: ProductionUnitSelectorInitState,
  loadImage: (filename: string) => TSurface | null,
  loadPercentageBarImage: (surface: TSurface | null) => void,
  loadYellowPercentageBarImage: (surface: TSurface | null) => void,
): void {
  loadRotozoomCacheBaseImage(
    state.percentageBarImage,
    PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH,
    loadImage,
    loadPercentageBarImage,
  );
  loadRotozoomCacheBaseImage(
    state.yellowPercentageBarImage,
    PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
    loadImage,
    loadYellowPercentageBarImage,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `GWPUnitSelector::DeleteDrawObject`.
 * Role: Releases the transient production unit selector draw object.
 * Upstream: gwproduction_us.cpp:74-81
 */
export function deleteProductionUnitSelectorDrawObject(
  state: ProductionUnitSelectorDrawObjectState,
): void {
  state.drawObject = null;
}

/**
 * Port of upstream `GWPFullUnitSelector::ClearLists`.
 * Role: Clears cached unit/button lists and resets cached building metadata.
 * Upstream: gwproduction_fus.cpp:230-240
 */
export function clearProductionFullUnitSelectorLists(
  state: ProductionFullUnitSelectorListsState,
): void {
  state.robotList.length = 0;
  state.vehicleList.length = 0;
  state.cannonList.length = 0;
  state.listsBuildingType = -1;
  state.listsBuildingLevel = -1;
  state.buttonList.length = 0;
}

/**
 * Port of upstream `GWPFullUnitSelector::CalculateXY`.
 * Role: Centers the full selector and clamps it inside map bounds with a 16-pixel margin.
 * Upstream: gwproduction_fus.cpp:81-99
 */
export function calculateProductionFullUnitSelectorXY(
  state: ProductionFullUnitSelectorGeometryState,
): void {
  state.x = state.centerX - Math.trunc(state.width / 2);
  state.y = state.centerY - Math.trunc(state.height / 2);

  if (state.zmap) {
    const mapBasics = state.zmap.getMapBasics();
    const mapWidth = mapBasics.width * 16;
    const mapHeight = mapBasics.height * 16;

    if (state.x + state.width + 16 > mapWidth) {
      state.x = mapWidth - (state.width + 16);
    }
    if (state.y + state.height + 16 > mapHeight) {
      state.y = mapHeight - (state.height + 16);
    }
  }

  if (state.x < 16) state.x = 16;
  if (state.y < 16) state.y = 16;
}

/**
 * Port of upstream `GWPFullUnitSelector::CalculateWH`.
 * Role: Calculates full selector dimensions from the widest unit row and number of populated rows.
 * Upstream: gwproduction_fus.cpp:272-290
 */
export function calculateProductionFullUnitSelectorWH(
  state: ProductionFullUnitSelectorSizeState,
): void {
  let blocksRight = 2;
  let blocksDown = 0;

  if (state.robotList.length) blocksDown++;
  if (state.vehicleList.length) blocksDown++;
  if (state.cannonList.length) blocksDown++;

  if (state.robotList.length > blocksRight) blocksRight = state.robotList.length;
  if (state.vehicleList.length > blocksRight) blocksRight = state.vehicleList.length;
  if (state.cannonList.length > blocksRight) blocksRight = state.cannonList.length;

  state.width =
    PRODUCTION_FULL_UNIT_SELECTOR_SIDE_SIZE_PIXELS +
    (PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS +
      PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_WIDTH_PIXELS) *
      blocksRight +
    PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS +
    PRODUCTION_FULL_UNIT_SELECTOR_SIDE_SIZE_PIXELS;
  state.height =
    PRODUCTION_FULL_UNIT_SELECTOR_TOP_HEIGHT_PIXELS +
    (PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS +
      PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_HEIGHT_PIXELS) *
      blocksDown +
    PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS +
    PRODUCTION_FULL_UNIT_SELECTOR_SIDE_SIZE_PIXELS;
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
 * Port of upstream `GWPUnitSelector::Click`.
 * Role: Routes local clicks to selector buttons and reports whether the click landed inside the selector bounds.
 * Upstream: gwproduction_us.cpp:360-378
 */
export function clickProductionUnitSelector(
  state: ProductionUnitSelectorClickState,
  x: number,
  y: number,
): boolean {
  if (!state.isActive) return false;

  const localX = x - state.x;
  const localY = y - state.y;

  state.upButton.click(localX, localY);
  state.downButton.click(localX, localY);

  if (x < state.x) return false;
  if (y < state.y) return false;
  if (x >= state.x + state.width) return false;
  if (y >= state.y + state.height) return false;

  return true;
}

/**
 * Port of upstream `GWPUnitSelector::GetSelectedID`.
 * Role: Returns the draw object's type/id when the selector currently owns a draw object.
 * Upstream: gwproduction_us.cpp:448-457
 */
export function getProductionUnitSelectorSelectedId(
  state: ProductionUnitSelectorDrawObjectState<ProductionUnitSelectorDrawObjectIdSource>,
): ProductionUnitSelectorSelectedIdResult {
  if (!state.drawObject) {
    return { selected: false, objectType: 0, objectId: 0 };
  }

  const { objectType, objectId } = state.drawObject.getObjectId();

  return { selected: true, objectType, objectId };
}

/**
 * Port of upstream `GWPUnitSelector::WithinPortrait`.
 * Role: Tests whether a point lands inside the production unit portrait bounds.
 * Upstream: gwproduction_us.cpp:406-414
 */
export function withinProductionUnitSelectorPortrait(
  x: number,
  y: number,
): boolean {
  if (x < 2) return false;
  if (y < 2) return false;
  if (x > 46) return false;
  if (y > 52) return false;

  return true;
}

/**
 * Port of upstream `GWProduction::WheelUpButton`.
 * Role: Routes wheel-up input to the unit selector first, then the queue selector.
 * Upstream: gwproduction.cpp:698-704
 */
export function wheelUpProduction(state: ProductionWheelState): boolean {
  if (!state.unitSelector.wheelUpButton()) {
    return state.queueSelector.wheelUpButton();
  }

  return true;
}

/**
 * Port of upstream `GWProduction::WheelDownButton`.
 * Role: Routes wheel-down input to the unit selector first, then the queue selector.
 * Upstream: gwproduction.cpp:706-712
 */
export function wheelDownProduction(state: ProductionWheelState): boolean {
  if (!state.unitSelector.wheelDownButton()) {
    return state.queueSelector.wheelDownButton();
  }

  return true;
}

/**
 * Port of upstream `GWProduction::SetBuildList`.
 * Role: Stores the build list and propagates it to production selectors.
 * Upstream: gwproduction.cpp:374-381
 */
export function setProductionBuildList<TBuildList>(
  state: ProductionBuildListState<TBuildList>,
  buildList: TBuildList | null,
): void {
  state.buildList = buildList;
  state.unitSelector.setBuildList(buildList);
  state.queueSelector.setBuildList(buildList);
  state.fullSelector.setBuildList(buildList);
}

/**
 * Port of upstream `GWProduction::SetBuildingObj`.
 * Role: Stores the building object and propagates it to production selectors.
 * Upstream: gwproduction.cpp:469-476
 */
export function setProductionBuildingObject<TBuilding>(
  state: ProductionBuildingObjectState<TBuilding>,
  buildingObject: TBuilding | null,
): void {
  state.buildingObject = buildingObject;
  state.unitSelector.setBuildingObject(buildingObject);
  state.queueSelector.setBuildingObject(buildingObject);
  state.fullSelector.setBuildingObject(buildingObject);
}

/**
 * Port of upstream `GWPUnitSelector::DoUpButton`.
 * Role: Advances the selected production unit index and wraps at the build-list end.
 * Upstream: gwproduction_us.cpp:416-430
 */
export function doProductionUnitSelectorUpButton(
  state: ProductionUnitSelectorScrollState,
): void {
  if (!state.buildingObject) return;
  if (!state.buildList) return;

  const buildingLevel = state.buildingObject.getLevel();
  const units = state.buildList.getBuildList(state.buildingType, buildingLevel);
  if (!units.length) return;

  state.selectedIndex += 1;

  if (state.selectedIndex >= units.length) {
    state.selectedIndex = 0;
  }
}

/**
 * Port of upstream `GWPUnitSelector::DoDownButton`.
 * Role: Moves the selected production unit index backward and wraps to the build-list end.
 * Upstream: gwproduction_us.cpp:432-446
 */
export function doProductionUnitSelectorDownButton(
  state: ProductionUnitSelectorScrollState,
): void {
  if (!state.buildingObject) return;
  if (!state.buildList) return;

  const buildingLevel = state.buildingObject.getLevel();
  const units = state.buildList.getBuildList(state.buildingType, buildingLevel);
  if (!units.length) return;

  state.selectedIndex -= 1;

  if (state.selectedIndex < 0) {
    state.selectedIndex = units.length - 1;
  }
}

/**
 * Port of upstream `GWProduction::DoQueueButton`.
 * Role: Emits a new queue item request when the queue selector has a selected object.
 * Upstream: gwproduction.cpp:540-551
 */
export function doProductionQueueButton(
  state: ProductionQueueButtonState,
): void {
  const selectedId = state.queueSelector.getSelectedId();
  if (!selectedId.selected) return;

  state.flags.sendNewQueueItem = true;
  state.flags.qot = selectedId.objectType;
  state.flags.qoid = selectedId.objectId;
  state.flags.qrefId = state.buildingObject.getRefId();
}

/**
 * Port of upstream `GWProduction::DoCancelQueueItem`.
 * Role: Emits a queue cancellation request for a valid queue button index.
 * Upstream: gwproduction.cpp:553-563
 */
export function doProductionCancelQueueItem(
  state: ProductionCancelQueueState,
  index: number,
): void {
  if (index < 0) return;
  if (index >= state.queueButtonList.length) return;

  const queueButton = state.queueButtonList[index];
  if (!queueButton) return;

  state.flags.sendCancelQueueItem = true;
  state.flags.qcrefId = state.buildingObject.getRefId();
  state.flags.qcIndex = index;
  state.flags.qcot = queueButton.ot;
  state.flags.qcoid = queueButton.oid;
}

/**
 * Port of upstream `GWProduction::DoCancelButton`.
 * Role: Closes the production window or emits a stop-production request based on the building state.
 * Upstream: gwproduction.cpp:505-520
 */
export function doProductionCancelButton(
  state: ProductionCancelButtonState,
): void {
  switch (state.state) {
    case ProductionBuildingState.Paused:
    case ProductionBuildingState.Place:
    case ProductionBuildingState.Select:
      state.killme = true;
      break;
    case ProductionBuildingState.Building:
      state.flags.sendStopProduction = true;
      state.flags.prefId = state.buildingObject.getRefId();
      break;
  }
}

/**
 * Port of upstream `GWProduction::DoPlaceButton`.
 * Role: Emits cannon placement bounds for the first built cannon and closes the production window.
 * Upstream: gwproduction.cpp:522-538
 */
export function doProductionPlaceButton(
  state: ProductionPlaceButtonState,
): void {
  const building = state.buildingObject;
  if (!building) return;

  const builtCannonList = building.getBuiltCannonList();
  if (!builtCannonList.length) return;

  const connectedZone = building.getConnectedZone();
  if (!connectedZone) return;

  state.flags.placeCannon = true;
  state.flags.coid = builtCannonList[0];
  state.flags.crefId = building.getRefId();
  state.flags.cleft = connectedZone.x;
  state.flags.cright = state.flags.cleft + connectedZone.w;
  state.flags.ctop = connectedZone.y;
  state.flags.cbottom = state.flags.ctop + connectedZone.h;
  state.killme = true;
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
