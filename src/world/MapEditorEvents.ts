/**
 * Upstream: map_editor.cpp
 */

import { MAP_EDITOR_MAX_LIST_SIZE, MapEditorMode } from "./WorldConstants";
import { MapObjectType } from "./MapFormat";

/**
 * Port of upstream `map_event`.
 * Role: Stores one map editor operation with its mode, tile rectangle, palette tile values, object metadata, and reference id.
 * Upstream: map_editor.cpp:90-103
 */
export type MapEditorEvent = {
  /** Upstream `mode`: editor operation mode that produced the event. */
  mode: number;
  /** Upstream `x`: tile-space horizontal coordinate. */
  x: number;
  /** Upstream `y`: tile-space vertical coordinate. */
  y: number;
  /** Upstream `w`: tile-space event width. */
  width: number;
  /** Upstream `h`: tile-space event height. */
  height: number;
  /** Upstream `mtile`: map terrain tile id. */
  mapTile: number;
  /** Upstream `ptile`: palette tile id. */
  paletteTile: number;
  /** Upstream `team`: owning team or neutral marker. */
  team: number;
  /** Upstream `object`: object id selected by the editor event. */
  object: number;
  /** Upstream `blevel`: building level metadata for object placement. */
  buildingLevel: number;
  /** Upstream `health_percent`: initial object health percentage. */
  healthPercent: number;
  /** Upstream `extra_links`: additional link metadata for object placement. */
  extraLinks: number;
  /** Upstream `ref_id`: editor reference id associated with the event. */
  referenceId: number;
};

/**
 * Port of upstream `reverse_event` object lookup inputs.
 * Role: Provides the object metadata needed to rebuild a removed map object event.
 * Upstream: map_editor.cpp:1031-1055
 */
export type MapEditorReverseObject = {
  referenceId: number;
  objectType: MapObjectType;
  objectId: number;
  x: number;
  y: number;
  owner: number;
  buildingLevel: number;
  extraLinks: number;
  healthPercent: number;
};

/**
 * Port of upstream `reverse_event` map lookup inputs.
 * Role: Provides current map tiles and zones used to construct undo events.
 * Upstream: map_editor.cpp:1018-1022, map_editor.cpp:1062-1072
 */
export type MapEditorReverseContext = {
  tiles: readonly { tile: number }[];
  objects: readonly MapEditorReverseObject[];
  zones: readonly { x: number; y: number; width: number; height: number }[];
  nextReferenceId: number;
};

function createEmptyMapEditorEvent(): MapEditorEvent {
  return {
    mode: -1,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    mapTile: 0,
    paletteTile: 0,
    team: 0,
    object: 0,
    buildingLevel: 0,
    healthPercent: 0,
    extraLinks: 0,
    referenceId: 0,
  };
}

function objectPlacementModeForType(objectType: MapObjectType): MapEditorMode | null {
  switch (objectType) {
    case MapObjectType.Building:
      return MapEditorMode.PlaceBuilding;
    case MapObjectType.Cannon:
      return MapEditorMode.PlaceCannon;
    case MapObjectType.Robot:
      return MapEditorMode.PlaceRobot;
    case MapObjectType.Vehicle:
      return MapEditorMode.PlaceVehicle;
    case MapObjectType.MapItem:
      return MapEditorMode.PlaceItem;
    default:
      return null;
  }
}

/**
 * Port of upstream `reverse_event`.
 * Role: Builds the undo event for a map editor operation from the current edited map state.
 * Upstream: map_editor.cpp:1003-1077
 */
export function reverseMapEditorEvent(
  event: MapEditorEvent,
  context: MapEditorReverseContext,
): MapEditorEvent {
  const reverseEvent = createEmptyMapEditorEvent();

  switch (event.mode) {
    case MapEditorMode.PlaceTile:
      return {
        ...reverseEvent,
        mode: MapEditorMode.PlaceTile,
        mapTile: event.mapTile,
        paletteTile: context.tiles[event.mapTile]?.tile ?? 0,
      };
    case MapEditorMode.PlaceBuilding:
    case MapEditorMode.PlaceCannon:
    case MapEditorMode.PlaceRobot:
    case MapEditorMode.PlaceVehicle:
    case MapEditorMode.PlaceItem:
      return {
        ...reverseEvent,
        mode: MapEditorMode.RemoveObject,
        referenceId: context.nextReferenceId,
      };
    case MapEditorMode.RemoveObject: {
      const object = context.objects.find(
        (candidate) => candidate.referenceId === event.referenceId,
      );

      if (!object) return reverseEvent;

      const mode = objectPlacementModeForType(object.objectType);

      if (mode === null) return reverseEvent;

      return {
        ...reverseEvent,
        mode,
        x: object.x >> 4,
        y: object.y >> 4,
        team: object.owner,
        object: object.objectId,
        buildingLevel: object.buildingLevel,
        extraLinks: object.extraLinks,
        healthPercent: object.healthPercent,
      };
    }
    case MapEditorMode.PlaceZone:
      return {
        ...reverseEvent,
        mode: MapEditorMode.RemoveZone,
        x: event.x,
        y: event.y,
      };
    case MapEditorMode.RemoveZone: {
      const zone = context.zones.find(
        (candidate) => candidate.x === event.x && candidate.y === event.y,
      );

      if (!zone) return reverseEvent;

      return {
        ...reverseEvent,
        mode: MapEditorMode.PlaceZone,
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
      };
    }
    default:
      return reverseEvent;
  }
}

/**
 * Port of upstream `store_map_event`.
 * Role: Stores a map editor event unless it is empty, while retaining only the newest bounded history.
 * Upstream: map_editor.cpp:991-1001
 */
export function storeMapEditorEvent(
  event: MapEditorEvent,
  list: MapEditorEvent[],
): void {
  if (event.mode === -1) {
    return;
  }

  list.push(event);

  while (list.length > MAP_EDITOR_MAX_LIST_SIZE) {
    list.shift();
  }
}
