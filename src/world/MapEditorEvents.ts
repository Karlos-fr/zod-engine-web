/**
 * Upstream: map_editor.cpp
 */

import { MAP_EDITOR_MAX_LIST_SIZE } from "./WorldConstants";

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
