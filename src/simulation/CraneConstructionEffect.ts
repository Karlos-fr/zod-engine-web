/**
 * Upstream: ecraneconco.h / ecraneconco.cpp
 */

/**
 * Port of upstream `_ECRANECONCO_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ecraneconco.h:2
 */
export const ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ECraneConcoItem`.
 * Role: Stores one crane construction animation item with travel endpoints and dimensions.
 * Upstream: ecraneconco.h:12-73
 */
export class CraneConstructionItem {
  type = -1;
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  destX = 0;
  destY = 0;
  width = 0;
  height = 0;
  widthDistance = 0;
  heightDistance = 0;

  /**
   * Port of upstream `ECraneConcoItem::Init`.
   * Role: Initializes this construction item at a crane center and calculates travel deltas.
   * Upstream: ecraneconco.h:24-32
   */
  init(type: number, centerX: number, centerY: number, width = 0, height = 0): void {
    this.type = type;
    this.startX = centerX;
    this.destX = centerX;
    this.x = centerX;
    this.startY = centerY;
    this.destY = centerY;
    this.y = centerY;
    this.width = width;
    this.height = height;
    this.setTravelDistances();
  }

  /**
   * Port of upstream `ECraneConcoItem::SetStart`.
   * Role: Centers this construction item on its starting coordinates.
   * Upstream: ecraneconco.h:34-38
   */
  setStart(x: number, y: number): void {
    setCraneConstructionItemStart(this, x, y);
  }

  /**
   * Port of upstream `ECraneConcoItem::SetReturn`.
   * Role: Sets this construction item's return destination around a target center.
   * Upstream: ecraneconco.h:40-47
   */
  setReturn(centerX: number, centerY: number): void {
    setCraneConstructionItemReturn(this, centerX, centerY);
  }

  /**
   * Port of upstream `ECraneConcoItem::SetTravelDistances`.
   * Role: Calculates this construction item's travel deltas from start to destination.
   * Upstream: ecraneconco.h:49-53
   */
  setTravelDistances(): void {
    setCraneConstructionTravelDistances(this);
  }

  /**
   * Port of upstream `ECraneConcoItem::Move`.
   * Role: Moves this construction item along its travel vector by a percentage.
   * Upstream: ecraneconco.h:55-59
   */
  move(percentage: number): void {
    this.x = Math.trunc(this.startX + this.widthDistance * percentage);
    this.y = Math.trunc(this.startY + this.heightDistance * percentage);
  }

  /**
   * Port of upstream `ECraneConcoItem::MoveToDest`.
   * Role: Snaps this construction item to its destination coordinates.
   * Upstream: ecraneconco.h:61-65
   */
  moveToDestination(): void {
    moveCraneConstructionItemToDestination(this);
  }
}

/**
 * Adaptation support for upstream `ECraneConcoItem::MoveToDest`.
 * Role: Represents the position fields touched by the crane construction item destination snap operation.
 * Upstream: ecraneconco.h:61-65
 */
export type CraneConstructionDestinationState = {
  x: number;
  y: number;
  destX: number;
  destY: number;
};

/**
 * Adaptation support for upstream `ECraneConcoItem::SetTravelDistances`.
 * Role: Represents the coordinate fields touched by crane construction travel distance calculation.
 * Upstream: ecraneconco.h:49-53
 */
export type CraneConstructionTravelDistanceState =
  CraneConstructionDestinationState & {
    startX: number;
    startY: number;
    height: number;
    widthDistance: number;
    heightDistance: number;
  };

/**
 * Adaptation support for upstream `ECraneConcoItem::SetStart`.
 * Role: Represents the coordinate fields touched by crane construction start placement.
 * Upstream: ecraneconco.h:34-38
 */
export type CraneConstructionStartState = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  width: number;
};

export type CraneConstructionReturnItem = {
  setReturn(centerX: number, centerY: number): void;
};

/**
 * Adaptation support for upstream `ECraneConco::BeginDeath`.
 * Role: Represents the crane construction effect fields touched when death starts.
 * Upstream: ecraneconco.cpp:500-511
 */
export type CraneConstructionDeathState = {
  travelBack: boolean;
  travelTimeStart: number;
  travelTimeEnd: number;
  travelTimeWidth: number;
  renderItems: readonly CraneConstructionReturnItem[];
};

/**
 * Port of upstream `MoveToDest`.
 * Role: Snaps a crane construction item to its destination coordinates.
 * Upstream: ecraneconco.h:61-65
 */
export function moveCraneConstructionItemToDestination(
  item: CraneConstructionDestinationState,
): void {
  item.x = item.destX;
  item.y = item.destY;
}

/**
 * Port of upstream `SetTravelDistances`.
 * Role: Calculates crane construction item travel deltas from start to destination.
 * Upstream: ecraneconco.h:49-53
 */
export function setCraneConstructionTravelDistances(
  item: CraneConstructionTravelDistanceState,
): void {
  item.widthDistance = item.destX - item.startX;
  item.heightDistance = item.destY - item.startY;
}

/**
 * Port of upstream `SetReturn`.
 * Role: Sets a crane construction item return destination around a target center.
 * Upstream: ecraneconco.h:40-47
 */
export function setCraneConstructionItemReturn(
  item: CraneConstructionTravelDistanceState & { width: number },
  centerX: number,
  centerY: number,
): void {
  item.startX = item.x;
  item.startY = item.y;
  item.destX = centerX - (item.width >> 1);
  item.destY = centerY - (item.height >> 1);
  setCraneConstructionTravelDistances(item);
}

/**
 * Port of upstream `SetStart`.
 * Role: Centers a crane construction item on its starting coordinates.
 * Upstream: ecraneconco.h:34-38
 */
export function setCraneConstructionItemStart(
  item: CraneConstructionStartState,
  x: number,
  y: number,
): void {
  const centeredX = x - (item.width >> 1);
  const centeredY = y - (item.width >> 1);
  item.startX = centeredX;
  item.x = centeredX;
  item.startY = centeredY;
  item.y = centeredY;
}

/**
 * Port of upstream `ECraneConco::BeginDeath`.
 * Role: Starts the return animation for every crane construction render item.
 * Upstream: ecraneconco.cpp:500-511
 */
export function beginCraneConstructionDeath(
  state: CraneConstructionDeathState,
  centerX: number,
  centerY: number,
  currentTime: number,
): void {
  state.travelBack = true;
  state.travelTimeStart = currentTime;
  state.travelTimeEnd = state.travelTimeStart + state.travelTimeWidth;

  for (const item of state.renderItems) {
    item.setReturn(centerX + 16, centerY + 16);
  }
}

/**
 * Replacement for upstream `ecc_render_item_comp`.
 * Role: Compares crane construction render items by their bottom edge for draw ordering.
 * Upstream: ecraneconco.cpp:513-519
 */
export function compareCraneConstructionRenderItemBottom(
  first: Pick<CraneConstructionItem, "y" | "height">,
  second: Pick<CraneConstructionItem, "y" | "height">,
): boolean {
  return first.y + first.height < second.y + second.height;
}

/**
 * Port of upstream `travel_time_width`.
 * Role: Defines the width of the crane construction travel animation window.
 * Upstream: ecraneconco.h:125, ecraneconco.cpp:3
 */
export const CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH = 0.8;

/**
 * Port of upstream `conco_dist_from_entrace`.
 * Role: Defines the construction concrete offset from the building entrance.
 * Upstream: ecraneconco.cpp:92
 */
export const CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE = 12;

/**
 * Port of upstream `cone_dist_from_entrace`.
 * Role: Defines the construction cone offset from the building entrance.
 * Upstream: ecraneconco.cpp:93
 */
export const CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE = 6;

/**
 * Port of upstream `cone_dist_from_center`.
 * Role: Defines the construction cone offset from the construction effect center.
 * Upstream: ecraneconco.cpp:94
 */
export const CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER = 18;

/**
 * Port of upstream `sign_dist_from_conco`.
 * Role: Defines the construction sign offset from the concrete construction piece.
 * Upstream: ecraneconco.cpp:95
 */
export const CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE = 6;

/**
 * Port of upstream `dist_from_entrance`.
 * Role: Defines the base crane construction effect offset from the building entrance.
 * Upstream: ecraneconco.cpp:177
 */
export const CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE = 16;

/**
 * Port of upstream `dist_from_entrance_box`.
 * Role: Defines the box-size entrance offset for the crane construction effect.
 * Upstream: ecraneconco.cpp:178
 */
export const CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX = 32;
