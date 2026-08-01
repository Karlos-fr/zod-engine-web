/**
 * Upstream: gwproduction_fus.cpp
 */

/**
 * Port of upstream `GWPFUS_MARGIN`.
 * Role: Defines the inner spacing between production unit buttons and frame edges.
 * Upstream: gwproduction_fus.cpp:25
 */
export const PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS = 2;

/**
 * Port of upstream `GWPFUS_TOPH`.
 * Role: Defines the top frame height before production unit rows begin.
 * Upstream: gwproduction_fus.cpp:26
 */
export const PRODUCTION_FULL_UNIT_SELECTOR_TOP_HEIGHT_PIXELS = 20;

/**
 * Port of upstream `GWPFUS_SIDE_SIZE`.
 * Role: Defines the thickness of the side and bottom frame slices.
 * Upstream: gwproduction_fus.cpp:27
 */
export const PRODUCTION_FULL_UNIT_SELECTOR_SIDE_SIZE_PIXELS = 4;

/**
 * Port of upstream `GWPFUS_OBJW`.
 * Role: Defines the width allocated to each production unit button.
 * Upstream: gwproduction_fus.cpp:28
 */
export const PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_WIDTH_PIXELS = 45;

/**
 * Port of upstream `GWPFUS_OBJH`.
 * Role: Defines the height allocated to each production unit button row.
 * Upstream: gwproduction_fus.cpp:29
 */
export const PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_HEIGHT_PIXELS = 51;

export type ProductionFullUnitSelectorImageName =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "objectBack";

export type ProductionFullUnitSelectorImageState = {
  images?: Partial<Record<ProductionFullUnitSelectorImageName, unknown | null>>;
  finishedInit?: boolean;
};

export type ProductionFullUnitSelectorImageLoader = (
  filename: string,
) => unknown | null;

/**
 * Port of upstream `ZObject::ProcessList` dependency surface.
 * Role: Processes one cached object list owned by the full production selector.
 * Upstream: gwproduction_fus.cpp:223-225
 */
export type ProductionFullUnitSelectorListProcessor<TUnit = unknown> = (
  units: TUnit[],
) => void;

/**
 * Port of upstream `GWPFullUnitSelector::Process` fields.
 * Role: Holds cached unit lists, active state, and list loading used during processing.
 * Upstream: gwproduction_fus.cpp:221-228
 */
export type ProductionFullUnitSelectorProcessState<TUnit = unknown> = {
  robotList: TUnit[];
  vehicleList: TUnit[];
  cannonList: TUnit[];
  isActive: boolean;
  loadLists(): void;
};

const PRODUCTION_FULL_UNIT_SELECTOR_IMAGE_FILES: ReadonlyArray<{
  name: ProductionFullUnitSelectorImageName;
  filename: string;
}> = [
  {
    name: "topLeft",
    filename: "assets/other/production_gui/fus_top_left.png",
  },
  {
    name: "topRight",
    filename: "assets/other/production_gui/fus_top_right.png",
  },
  {
    name: "bottomLeft",
    filename: "assets/other/production_gui/fus_bottom_left.png",
  },
  {
    name: "bottomRight",
    filename: "assets/other/production_gui/fus_bottom_right.png",
  },
  { name: "top", filename: "assets/other/production_gui/fus_top.png" },
  { name: "bottom", filename: "assets/other/production_gui/fus_bottom.png" },
  { name: "left", filename: "assets/other/production_gui/fus_left.png" },
  { name: "right", filename: "assets/other/production_gui/fus_right.png" },
  {
    name: "objectBack",
    filename: "assets/other/production_gui/object_back.png",
  },
];

/**
 * Port of upstream `GWPFullUnitSelector::Init`.
 * Role: Loads static production selector frame images and marks the selector initialized.
 * Upstream: gwproduction_fus.cpp:65-79
 */
export function initProductionFullUnitSelector(
  state: ProductionFullUnitSelectorImageState,
  loadImage: ProductionFullUnitSelectorImageLoader,
): void {
  state.images = {};

  for (const image of PRODUCTION_FULL_UNIT_SELECTOR_IMAGE_FILES) {
    state.images[image.name] = loadImage(image.filename);
  }

  state.finishedInit = true;
}

/**
 * Port of upstream `GWPFullUnitSelector::Process`.
 * Role: Processes cached unit lists and refreshes selector lists while active.
 * Upstream: gwproduction_fus.cpp:221-228
 */
export function processProductionFullUnitSelector<TUnit>(
  state: ProductionFullUnitSelectorProcessState<TUnit>,
  processList: ProductionFullUnitSelectorListProcessor<TUnit>,
): void {
  processList(state.robotList);
  processList(state.vehicleList);
  processList(state.cannonList);

  if (state.isActive) state.loadLists();
}
