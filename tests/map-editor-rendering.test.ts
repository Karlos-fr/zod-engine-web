import { describe, expect, it, vi } from "vitest";
import {
  MAP_EDITOR_MINIMAP_X_PIXELS,
  MAP_EDITOR_MINIMAP_Y_PIXELS,
  MAP_EDITOR_MAP_SHIFT_X_PIXELS,
  MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS,
  MAP_EDITOR_SEPARATOR_WIDTH_PIXELS,
  blitMapEditorMessage,
  drawMapEditorPaletteTileSelectionBox,
  drawMapEditorSeparator,
  drawMapEditorSelectionBox,
  isWithinMapEditorMiniMap,
} from "../src/world/MapEditorRendering";

describe("map editor rendering", () => {
  it("adapts SEP_SHIFT_X as a named pixel offset", () => {
    expect(MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS).toBe(320);
  });

  it("adapts SEP_WIDTH as a named pixel width", () => {
    expect(MAP_EDITOR_SEPARATOR_WIDTH_PIXELS).toBe(16);
  });

  it("adapts MAP_SHIFT_X as the editable map start coordinate", () => {
    expect(MAP_EDITOR_MAP_SHIFT_X_PIXELS).toBe(336);
  });

  it("adapts MINIMAP_X as a named pixel coordinate", () => {
    expect(MAP_EDITOR_MINIMAP_X_PIXELS).toBe(5);
  });

  it("adapts MINIMAP_Y as a named pixel coordinate", () => {
    expect(MAP_EDITOR_MINIMAP_Y_PIXELS).toBe(400);
  });

  it("ports within_minimap as an exclusive minimap hit test", () => {
    expect(isWithinMapEditorMiniMap(6, 401)).toBe(true);
    expect(isWithinMapEditorMiniMap(96, 488)).toBe(true);
    expect(isWithinMapEditorMiniMap(5, 401)).toBe(false);
    expect(isWithinMapEditorMiniMap(97, 401)).toBe(false);
    expect(isWithinMapEditorMiniMap(6, 400)).toBe(false);
    expect(isWithinMapEditorMiniMap(6, 489)).toBe(false);
  });

  it("replaces blit_message with a browser text draw command", () => {
    expect(blitMapEditorMessage("ready", 10, 20, 30, 40, 50)).toEqual({
      message: "ready",
      x: 10,
      y: 20,
      color: { r: 30, g: 40, b: 50 },
    });
  });

  it("replaces blit_message font-missing return with a null draw command", () => {
    expect(blitMapEditorMessage("ready", 10, 20, 30, 40, 50, false)).toBeNull();
  });

  it("replaces draw_selection_box geometry with clipped red pixel commands", () => {
    expect(drawMapEditorSelectionBox(334, 10, 4, 3)).toEqual([
      {
        x: 336,
        y: 10,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 336,
        y: 12,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 10,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 12,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 10,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 11,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 12,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
    ]);
  });

  it("replaces draw_selection_box tile overload with cyan palette pixel commands", () => {
    const getPaletteTile = vi.fn(() => ({ x: 20, y: 30 }));
    const pixels = drawMapEditorPaletteTileSelectionBox(7, getPaletteTile);

    expect(getPaletteTile).toHaveBeenCalledWith(7);
    expect(pixels).toHaveLength(64);
    expect(pixels[0]).toEqual({
      x: 20,
      y: 30,
      color: { red: 0, green: 255, blue: 255, alpha: 255 },
    });
    expect(pixels[63]).toEqual({
      x: 35,
      y: 45,
      color: { red: 0, green: 255, blue: 255, alpha: 255 },
    });
  });

  it("replaces draw_selection_box tile overload no-selection return", () => {
    const getPaletteTile = vi.fn(() => ({ x: 20, y: 30 }));

    expect(drawMapEditorPaletteTileSelectionBox(-1, getPaletteTile)).toEqual([]);
    expect(getPaletteTile).not.toHaveBeenCalled();
  });

  it("ports draw_seperator as a screen present when flip is requested", () => {
    const presentScreen = vi.fn();

    drawMapEditorSeparator(true, presentScreen);

    expect(presentScreen).toHaveBeenCalledOnce();
  });

  it("ports draw_seperator as a no-op when flip is not requested", () => {
    const presentScreen = vi.fn();

    drawMapEditorSeparator(false, presentScreen);

    expect(presentScreen).not.toHaveBeenCalled();
  });
});
