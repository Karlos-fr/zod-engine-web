import { describe, expect, it } from "vitest";
import {
  MAP_EDITOR_MAX_LIST_SIZE,
  MAP_EDITOR_VIEW_SHIFT_SPEED,
  MapEditorMode,
  MapRulerMode,
  MAP_ITEM_TYPE_COUNT,
  MAX_PLANET_TILES,
} from "../src/world/WorldConstants";

describe("world constants", () => {
  it("ports the maximum planet tile count", () => {
    expect(MAX_PLANET_TILES).toBe(20 * 24);
  });

  it("ports the map item type count", () => {
    expect(MAP_ITEM_TYPE_COUNT).toBe(22);
  });

  it("ports the map editor maximum list size", () => {
    expect(MAP_EDITOR_MAX_LIST_SIZE).toBe(5000);
  });

  it("ports the map editor view shift speed", () => {
    expect(MAP_EDITOR_VIEW_SHIFT_SPEED).toBe(800);
  });

  it("ports the map editor modes", () => {
    expect(MapEditorMode.PlaceTile).toBe(0);
    expect(MapEditorMode.PlaceBuilding).toBe(1);
    expect(MapEditorMode.PlaceCannon).toBe(2);
    expect(MapEditorMode.PlaceVehicle).toBe(3);
    expect(MapEditorMode.PlaceRobot).toBe(4);
    expect(MapEditorMode.PlaceItem).toBe(5);
    expect(MapEditorMode.PlaceZone).toBe(6);
    expect(MapEditorMode.RemoveZone).toBe(7);
    expect(MapEditorMode.RemoveObject).toBe(8);
    expect(MapEditorMode.Max).toBe(9);
  });

  it("ports the map ruler modes", () => {
    expect(MapRulerMode.None).toBe(0);
    expect(MapRulerMode.Simple).toBe(1);
    expect(MapRulerMode.Full).toBe(2);
    expect(MapRulerMode.Max).toBe(3);
  });
});
