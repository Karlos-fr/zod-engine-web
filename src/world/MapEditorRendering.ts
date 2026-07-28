import {
  MINIMAP_MAX_HEIGHT_PIXELS,
  MINIMAP_MAX_WIDTH_PIXELS,
} from "./MiniMap";
import type { SurfacePixelColor } from "../rendering/SurfacePixels";

/**
 * Upstream: map_editor.cpp
 */

/**
 * Port of upstream `SEP_SHIFT_X`.
 * Role: Defines the fixed horizontal pixel offset used to position the map editor separator panel.
 * Upstream: map_editor.cpp:61
 */
export const MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS = 320;

/**
 * Port of upstream `SEP_WIDTH`.
 * Role: Defines the fixed pixel width of the map editor separator panel.
 * Upstream: map_editor.cpp:62
 */
export const MAP_EDITOR_SEPARATOR_WIDTH_PIXELS = 16;

/**
 * Port of upstream `MAP_SHIFT_X`.
 * Role: Defines the left pixel coordinate where the editable map area begins.
 * Upstream: map_editor.cpp:63
 */
export const MAP_EDITOR_MAP_SHIFT_X_PIXELS =
  MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS + MAP_EDITOR_SEPARATOR_WIDTH_PIXELS;

/**
 * Port of upstream `MINIMAP_X`.
 * Role: Defines the fixed left pixel coordinate of the map editor minimap.
 * Upstream: map_editor.cpp:64
 */
export const MAP_EDITOR_MINIMAP_X_PIXELS = 5;

/**
 * Port of upstream `MINIMAP_Y`.
 * Role: Defines the fixed top pixel coordinate of the map editor minimap.
 * Upstream: map_editor.cpp:65
 */
export const MAP_EDITOR_MINIMAP_Y_PIXELS = 400;

/**
 * Port of upstream `within_minimap`.
 * Role: Reports whether a point is inside the map editor minimap hit area.
 * Upstream: map_editor.cpp:958-961
 */
export function isWithinMapEditorMiniMap(x: number, y: number): boolean {
  return (
    x > MAP_EDITOR_MINIMAP_X_PIXELS &&
    x < MAP_EDITOR_MINIMAP_X_PIXELS + MINIMAP_MAX_WIDTH_PIXELS &&
    y > MAP_EDITOR_MINIMAP_Y_PIXELS &&
    y < MAP_EDITOR_MINIMAP_Y_PIXELS + MINIMAP_MAX_HEIGHT_PIXELS
  );
}

/**
 * Replacement for upstream `blit_message` output.
 * Role: Describes a map editor text draw that can be rendered by the browser UI layer.
 * Upstream: map_editor.cpp:1726-1745
 */
export type MapEditorMessageBlit = {
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
 * Role: Adapts SDL/TTF text rendering into a browser-renderable map editor text draw.
 * Upstream: map_editor.cpp:1726-1745
 */
export function blitMapEditorMessage(
  message: string,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  hasFont = true,
): MapEditorMessageBlit | null {
  if (!hasFont) {
    return null;
  }

  return {
    message,
    x,
    y,
    color: { r, g, b },
  };
}

/**
 * Replacement for upstream `draw_selection_box` output.
 * Role: Describes one map editor selection marker pixel for browser rendering.
 * Upstream: map_editor.cpp:2399-2437
 */
export type MapEditorSelectionPixel = {
  x: number;
  y: number;
  color: SurfacePixelColor;
};

const MAP_EDITOR_OBJECT_SELECTION_COLOR: SurfacePixelColor = {
  red: 255,
  green: 0,
  blue: 0,
  alpha: 255,
};

const MAP_EDITOR_PALETTE_SELECTION_COLOR: SurfacePixelColor = {
  red: 0,
  green: 255,
  blue: 255,
  alpha: 255,
};

/**
 * Replacement for upstream `draw_selection_box(int x, int y, int w, int h)`.
 * Role: Adapts map editor object selection-box pixel writes into renderable pixel commands.
 * Upstream: map_editor.cpp:2399-2416
 */
export function drawMapEditorSelectionBox(
  x: number,
  y: number,
  width: number,
  height: number,
): MapEditorSelectionPixel[] {
  const pixels: MapEditorSelectionPixel[] = [];

  for (let i = 0; i < width; i += 1) {
    if (x + i >= MAP_EDITOR_MAP_SHIFT_X_PIXELS) {
      pixels.push({ x: x + i, y, color: MAP_EDITOR_OBJECT_SELECTION_COLOR });
      pixels.push({
        x: x + i,
        y: y + (height - 1),
        color: MAP_EDITOR_OBJECT_SELECTION_COLOR,
      });
    }
  }

  for (let i = 0; i < height; i += 1) {
    if (x >= MAP_EDITOR_MAP_SHIFT_X_PIXELS) {
      pixels.push({ x, y: y + i, color: MAP_EDITOR_OBJECT_SELECTION_COLOR });
    }
  }

  for (let i = 0; i < height; i += 1) {
    pixels.push({
      x: x + (width - 1),
      y: y + i,
      color: MAP_EDITOR_OBJECT_SELECTION_COLOR,
    });
  }

  return pixels;
}

/**
 * Replacement for upstream `draw_selection_box(int tile)`.
 * Role: Adapts map editor palette-tile selection-box pixel writes into renderable pixel commands.
 * Upstream: map_editor.cpp:2418-2437
 */
export function drawMapEditorPaletteTileSelectionBox(
  tile: number,
  getPaletteTile: (tile: number) => { x: number; y: number },
): MapEditorSelectionPixel[] {
  if (tile === -1) {
    return [];
  }

  const { x, y } = getPaletteTile(tile);
  const pixels: MapEditorSelectionPixel[] = [];

  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x: x + i, y, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }
  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x, y: y + i, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }
  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x: x + 15, y: y + i, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }
  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x: x + i, y: y + 15, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }

  return pixels;
}

/**
 * Port of upstream `draw_seperator`.
 * Role: Preserves the map editor separator rendering hook, which currently only presents the SDL screen when requested.
 * Upstream: map_editor.cpp:1769-1773
 */
export function drawMapEditorSeparator(
  flip: boolean,
  presentScreen: () => void = () => undefined,
): void {
  if (flip) {
    presentScreen();
  }
}
