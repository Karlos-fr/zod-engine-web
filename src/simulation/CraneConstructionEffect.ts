/**
 * Ported from Zod Engine.
 * Upstream: ecraneconco.h / ecraneconco.cpp
 */

/**
 * Port of upstream `_ECRANECONCO_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-62A0D4
 * Upstream: ecraneconco.h:2
 */
export const ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED = true;

/**
 * Adaptation support for upstream `ECraneConcoItem::MoveToDest`.
 * Role: Represents the position fields touched by the crane construction item destination snap operation.
 * Ledger: FUN-3474CE
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
 * Ledger: FUN-7A3CE6
 * Upstream: ecraneconco.h:49-53
 */
export type CraneConstructionTravelDistanceState =
  CraneConstructionDestinationState & {
    startX: number;
    startY: number;
    widthDistance: number;
    heightDistance: number;
  };

/**
 * Adaptation support for upstream `ECraneConcoItem::SetStart`.
 * Role: Represents the coordinate fields touched by crane construction start placement.
 * Ledger: FUN-8E3B39
 * Upstream: ecraneconco.h:34-38
 */
export type CraneConstructionStartState = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  width: number;
};

/**
 * Port of upstream `MoveToDest`.
 * Role: Snaps a crane construction item to its destination coordinates.
 * Ledger: FUN-3474CE
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
 * Ledger: FUN-7A3CE6
 * Upstream: ecraneconco.h:49-53
 */
export function setCraneConstructionTravelDistances(
  item: CraneConstructionTravelDistanceState,
): void {
  item.widthDistance = item.destX - item.startX;
  item.heightDistance = item.destY - item.startY;
}

/**
 * Port of upstream `SetStart`.
 * Role: Centers a crane construction item on its starting coordinates.
 * Ledger: FUN-8E3B39
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
 * Port of upstream `travel_time_width`.
 * Role: Defines the width of the crane construction travel animation window.
 * Ledger: CON-D2486C
 * Upstream: ecraneconco.h:125, ecraneconco.cpp:3
 */
export const CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH = 0.8;

/**
 * Port of upstream `conco_dist_from_entrace`.
 * Role: Defines the construction concrete offset from the building entrance.
 * Ledger: CON-B63D15
 * Upstream: ecraneconco.cpp:92
 */
export const CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE = 12;

/**
 * Port of upstream `cone_dist_from_entrace`.
 * Role: Defines the construction cone offset from the building entrance.
 * Ledger: CON-DF4F42
 * Upstream: ecraneconco.cpp:93
 */
export const CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE = 6;

/**
 * Port of upstream `cone_dist_from_center`.
 * Role: Defines the construction cone offset from the construction effect center.
 * Ledger: CON-77DECD
 * Upstream: ecraneconco.cpp:94
 */
export const CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER = 18;

/**
 * Port of upstream `sign_dist_from_conco`.
 * Role: Defines the construction sign offset from the concrete construction piece.
 * Ledger: CON-F6E57A
 * Upstream: ecraneconco.cpp:95
 */
export const CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE = 6;

/**
 * Port of upstream `dist_from_entrance`.
 * Role: Defines the base crane construction effect offset from the building entrance.
 * Ledger: CON-C60554
 * Upstream: ecraneconco.cpp:177
 */
export const CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE = 16;

/**
 * Port of upstream `dist_from_entrance_box`.
 * Role: Defines the box-size entrance offset for the crane construction effect.
 * Ledger: CON-6A7A05
 * Upstream: ecraneconco.cpp:178
 */
export const CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX = 32;
