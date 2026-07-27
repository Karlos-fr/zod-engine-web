import { describe, expect, it, vi } from "vitest";
import {
  MAP_EDITOR_MINIMAP_X_PIXELS,
  MAP_EDITOR_MINIMAP_Y_PIXELS,
  MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS,
  MAP_EDITOR_SEPARATOR_WIDTH_PIXELS,
  drawMapEditorSeparator,
} from "../src/world/MapEditorRendering";

describe("map editor rendering", () => {
  it("adapts SEP_SHIFT_X as a named pixel offset", () => {
    expect(MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS).toBe(320);
  });

  it("adapts SEP_WIDTH as a named pixel width", () => {
    expect(MAP_EDITOR_SEPARATOR_WIDTH_PIXELS).toBe(16);
  });

  it("adapts MINIMAP_X as a named pixel coordinate", () => {
    expect(MAP_EDITOR_MINIMAP_X_PIXELS).toBe(5);
  });

  it("adapts MINIMAP_Y as a named pixel coordinate", () => {
    expect(MAP_EDITOR_MINIMAP_Y_PIXELS).toBe(400);
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
