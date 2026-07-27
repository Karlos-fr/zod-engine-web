import { describe, expect, it } from "vitest";
import { TileInfoEditorMode } from "../src/world/TileInfoEditor";

describe("tile info editor", () => {
  it("ports editor_mode numeric values", () => {
    expect(TileInfoEditorMode.Normal).toBe(0);
    expect(TileInfoEditorMode.Map).toBe(1);
    expect(TileInfoEditorMode.Usable).toBe(2);
    expect(TileInfoEditorMode.Passable).toBe(3);
    expect(TileInfoEditorMode.TakesTracks).toBe(4);
    expect(TileInfoEditorMode.CraterType).toBe(5);
    expect(TileInfoEditorMode.Max).toBe(6);
  });
});
