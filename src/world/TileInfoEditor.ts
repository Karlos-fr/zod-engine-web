/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: tile_info_editor.cpp
 * - Symbols: editor_mode
 * - Ledger: ENU-9DED72
 *
 * Porting notes:
 * - SDL editor runtime state is represented as typed browser/editor data.
 */

/**
 * Port of upstream `editor_mode`.
 *
 * Role:
 * - Identifies the active tile information editing mode for terrain map,
 *   usability, passability, tank-track, and crater-type metadata.
 *
 * Ledger: ENU-9DED72
 * Upstream: tile_info_editor.cpp:14-18
 */
export enum TileInfoEditorMode {
  Normal = 0,
  Map = 1,
  Usable = 2,
  Passable = 3,
  TakesTracks = 4,
  CraterType = 5,
  Max = 6,
}
