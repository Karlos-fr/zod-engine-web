import { describe, expect, it } from "vitest";
import {
  type MapEditorEvent,
  storeMapEditorEvent,
} from "../src/world/MapEditorEvents";
import { MAP_EDITOR_MAX_LIST_SIZE } from "../src/world/WorldConstants";

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

  it("ports store_map_event by ignoring empty events", () => {
    const list: MapEditorEvent[] = [];

    storeMapEditorEvent(createMapEditorEvent({ mode: -1 }), list);

    expect(list).toEqual([]);
  });

  it("ports store_map_event by appending valid events", () => {
    const list: MapEditorEvent[] = [createMapEditorEvent({ mode: 1, referenceId: 1 })];
    const event = createMapEditorEvent({ mode: 2, referenceId: 2 });

    storeMapEditorEvent(event, list);

    expect(list).toEqual([createMapEditorEvent({ mode: 1, referenceId: 1 }), event]);
  });

  it("ports store_map_event by retaining the newest bounded history", () => {
    const list = Array.from({ length: MAP_EDITOR_MAX_LIST_SIZE }, (_, index) =>
      createMapEditorEvent({ mode: 1, referenceId: index }),
    );
    const event = createMapEditorEvent({
      mode: 2,
      referenceId: MAP_EDITOR_MAX_LIST_SIZE,
    });

    storeMapEditorEvent(event, list);

    expect(list).toHaveLength(MAP_EDITOR_MAX_LIST_SIZE);
    expect(list[0].referenceId).toBe(1);
    expect(list.at(-1)).toBe(event);
  });
});

function createMapEditorEvent(overrides: Partial<MapEditorEvent> = {}): MapEditorEvent {
  return {
    mode: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    mapTile: 0,
    paletteTile: 0,
    team: 0,
    object: 0,
    buildingLevel: 0,
    healthPercent: 0,
    extraLinks: 0,
    referenceId: 0,
    ...overrides,
  };
}
