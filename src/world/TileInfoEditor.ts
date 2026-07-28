/**
 * Upstream: tile_info_editor.cpp
 */

/**
 * Port of upstream `editor_mode`.
 * Role: Identifies the active tile information editing mode for terrain map, usability, passability, tank-track, and crater-type metadata.
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

/**
 * Replacement for upstream `blit_message` output.
 * Role: Describes a tile-info editor text draw that can be rendered by the browser UI layer.
 * Upstream: tile_info_editor.cpp:487-504
 */
export type TileInfoEditorMessageBlit = {
  message: string;
  x: number;
  y: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
};

/**
 * Replacement for upstream `blit_message`.
 * Role: Adapts SDL/TTF white text rendering into a browser-renderable tile-info editor text draw.
 * Upstream: tile_info_editor.cpp:487-504
 */
export function blitTileInfoEditorMessage(
  message: string,
  x: number,
  y: number,
): TileInfoEditorMessageBlit {
  return {
    message,
    x,
    y,
    color: { r: 255, g: 255, b: 255 },
  };
}
