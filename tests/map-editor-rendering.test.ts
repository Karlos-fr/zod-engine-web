import { describe, expect, it, vi } from "vitest";
import { drawMapEditorSeparator } from "../src/world/MapEditorRendering";

describe("map editor rendering", () => {
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
