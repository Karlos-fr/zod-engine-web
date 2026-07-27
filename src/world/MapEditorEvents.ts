/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: map_editor.cpp
 * - Symbols: map_event
 * - Ledger: STR-12C865
 *
 * Porting notes:
 * - The C++ editor event record is modeled as typed data for browser-side map
 *   editing workflows.
 */

/**
 * Port of upstream `map_event`.
 *
 * Role:
 * - Stores one map editor operation with its mode, tile rectangle, palette
 *   tile values, object metadata, and reference id.
 *
 * Ledger: STR-12C865
 * Upstream: map_editor.cpp:90-103
 *
 * Adaptation:
 * - Renames C++ fields to descriptive camelCase names.
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
