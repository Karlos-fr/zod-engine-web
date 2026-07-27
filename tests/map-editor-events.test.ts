import { describe, expect, it } from "vitest";
import type { MapEditorEvent } from "../src/world/MapEditorEvents";

describe("map editor events", () => {
  it("ports the map_event record with descriptive field names", () => {
    const event: MapEditorEvent = {
      mode: 2,
      x: 4,
      y: 6,
      width: 8,
      height: 10,
      mapTile: 12,
      paletteTile: 14,
      team: 1,
      object: 3,
      buildingLevel: 2,
      healthPercent: 75,
      extraLinks: 5,
      referenceId: 99,
    };

    expect(event).toEqual({
      mode: 2,
      x: 4,
      y: 6,
      width: 8,
      height: 10,
      mapTile: 12,
      paletteTile: 14,
      team: 1,
      object: 3,
      buildingLevel: 2,
      healthPercent: 75,
      extraLinks: 5,
      referenceId: 99,
    });
  });
});
