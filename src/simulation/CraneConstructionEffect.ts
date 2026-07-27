/**
 * Ported from Zod Engine.
 * Upstream: ecraneconco.h / ecraneconco.cpp
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Adaptation of upstream `_ECRANECONCO_H_`.
 * Role: Marks the TypeScript module boundary for upstream `ecraneconco.h`.
 * Ledger: MAC-62A0D4
 * Upstream: ecraneconco.h:2
 */
export const ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED = true;

/**
 * Adaptation support for upstream `ECraneConcoItem::MoveToDest`.
 * Role: Represents the position fields touched by the crane construction item destination snap operation.
 * Ledger: FUN-3474CE
 * Upstream: ecraneconco.h:61-65
 * Adaptation: Models only the fields required by `MoveToDest`; the full `ECraneConcoItem` class remains unported.
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
 * Adaptation: Models only the fields required by `SetTravelDistances`; the full `ECraneConcoItem` class remains unported.
 */
export type CraneConstructionTravelDistanceState =
  CraneConstructionDestinationState & {
    startX: number;
    startY: number;
    widthDistance: number;
    heightDistance: number;
  };

/**
 * Port of upstream `MoveToDest`.
 * Role: Snaps a crane construction item to its destination coordinates.
 * Ledger: FUN-3474CE
 * Upstream: ecraneconco.h:61-65
 * Adaptation: Ported as a standalone mutating helper over the minimal destination state instead of as an `ECraneConcoItem` method.
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
 * Adaptation: Ported as a standalone mutating helper over the minimal travel distance state instead of as an `ECraneConcoItem` method.
 */
export function setCraneConstructionTravelDistances(
  item: CraneConstructionTravelDistanceState,
): void {
  item.widthDistance = item.destX - item.startX;
  item.heightDistance = item.destY - item.startY;
}

/**
 * Port of upstream `travel_time_width`.
 * Role: Defines the width of the crane construction travel animation window.
 * Ledger: CON-D2486C
 * Upstream: ecraneconco.h:125, ecraneconco.cpp:3
 * Notes: Uses the out-of-class definition from `ecraneconco.cpp` for the runtime value.
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
 * Role: Defines the box-size entrance offset used by the crane construction effect.
 * Ledger: CON-6A7A05
 * Upstream: ecraneconco.cpp:178
 */
export const CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX = 32;
