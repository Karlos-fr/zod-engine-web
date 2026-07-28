/**
 * Ported from Zod Engine.
 * Upstream: constants.h, map_editor.cpp
 */

/**
 * Port of upstream `MAX_PLANET_TILES`.
 * Role: Defines the maximum number of terrain tiles addressable by planet/map level systems.
 * Ledger: MAC-198B3B
 * Upstream: constants.h:14
 */
export const MAX_PLANET_TILES = 480;

/**
 * Port of upstream `MAP_ITEMS_AMOUNT`.
 * Role: Defines how many map item identifiers are available in the upstream constants table.
 * Ledger: MAC-47BF98
 * Upstream: constants.h:125
 */
export const MAP_ITEM_TYPE_COUNT = 22;

/**
 * Port of upstream `max_list_size`.
 * Role: Defines the maximum temporary list size for map editor operations.
 * Ledger: CON-37F4A2
 * Upstream: map_editor.cpp:993
 */
export const MAP_EDITOR_MAX_LIST_SIZE = 5000;

/**
 * Port of upstream `shift_speed`.
 * Role: Defines the map editor view-shift speed used when moving the editor camera across the map.
 * Ledger: CON-853D91
 * Upstream: map_editor.cpp:635
 */
export const MAP_EDITOR_VIEW_SHIFT_SPEED = 800;

/**
 * Port of upstream `map_editor_mode`.
 * Role: Identifies the active editing tool mode for the map editor.
 * Ledger: ENU-A4B8CB
 * Upstream: map_editor.cpp:71-77
 */
export enum MapEditorMode {
  PlaceTile = 0,
  PlaceBuilding = 1,
  PlaceCannon = 2,
  PlaceVehicle = 3,
  PlaceRobot = 4,
  PlaceItem = 5,
  PlaceZone = 6,
  RemoveZone = 7,
  RemoveObject = 8,
  Max = 9,
}

/**
 * Port of upstream `map_ruler_mode`.
 * Role: Identifies how much ruler overlay information the map editor displays.
 * Ledger: ENU-F0BC9E
 * Upstream: map_editor.cpp:79-83
 */
export enum MapRulerMode {
  None = 0,
  Simple = 1,
  Full = 2,
  Max = 3,
}
