import { describe, expect, it } from "vitest";
import {
  type MapEditorEvent,
  reverseMapEditorEvent,
  storeMapEditorEvent,
} from "../src/world/MapEditorEvents";
import { MapObjectType } from "../src/world/MapFormat";
import { MAP_EDITOR_MAX_LIST_SIZE, MapEditorMode } from "../src/world/WorldConstants";

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

  it("ports reverse_event for tile placement as previous palette tile restore", () => {
    const reverseEvent = reverseMapEditorEvent(
      createMapEditorEvent({
        mode: MapEditorMode.PlaceTile,
        mapTile: 3,
        paletteTile: 99,
      }),
      {
        tiles: [{ tile: 10 }, { tile: 11 }, { tile: 12 }, { tile: 13 }],
        objects: [],
        zones: [],
        nextReferenceId: 55,
      },
    );

    expect(reverseEvent).toEqual(
      createMapEditorEvent({
        mode: MapEditorMode.PlaceTile,
        mapTile: 3,
        paletteTile: 13,
      }),
    );
  });

  it("ports reverse_event for object placement as remove-object by next reference id", () => {
    const reverseEvent = reverseMapEditorEvent(
      createMapEditorEvent({
        mode: MapEditorMode.PlaceRobot,
        referenceId: 12,
      }),
      {
        tiles: [],
        objects: [],
        zones: [],
        nextReferenceId: 55,
      },
    );

    expect(reverseEvent).toEqual(
      createMapEditorEvent({
        mode: MapEditorMode.RemoveObject,
        referenceId: 55,
      }),
    );
  });

  it("ports reverse_event for object removal as matching object placement", () => {
    const reverseEvent = reverseMapEditorEvent(
      createMapEditorEvent({
        mode: MapEditorMode.RemoveObject,
        referenceId: 77,
      }),
      {
        tiles: [],
        objects: [
          {
            referenceId: 77,
            objectType: MapObjectType.Cannon,
            objectId: 4,
            x: 48,
            y: 80,
            owner: 2,
            buildingLevel: 3,
            extraLinks: 6,
            healthPercent: 71,
          },
        ],
        zones: [],
        nextReferenceId: 55,
      },
    );

    expect(reverseEvent).toEqual(
      createMapEditorEvent({
        mode: MapEditorMode.PlaceCannon,
        x: 3,
        y: 5,
        team: 2,
        object: 4,
        buildingLevel: 3,
        extraLinks: 6,
        healthPercent: 71,
      }),
    );
  });

  it("ports reverse_event for zone placement as zone removal", () => {
    const reverseEvent = reverseMapEditorEvent(
      createMapEditorEvent({
        mode: MapEditorMode.PlaceZone,
        x: 8,
        y: 9,
        width: 3,
        height: 4,
      }),
      {
        tiles: [],
        objects: [],
        zones: [],
        nextReferenceId: 55,
      },
    );

    expect(reverseEvent).toEqual(
      createMapEditorEvent({
        mode: MapEditorMode.RemoveZone,
        x: 8,
        y: 9,
      }),
    );
  });

  it("ports reverse_event for zone removal as matching zone placement", () => {
    const reverseEvent = reverseMapEditorEvent(
      createMapEditorEvent({
        mode: MapEditorMode.RemoveZone,
        x: 8,
        y: 9,
      }),
      {
        tiles: [],
        objects: [],
        zones: [{ x: 8, y: 9, width: 3, height: 4 }],
        nextReferenceId: 55,
      },
    );

    expect(reverseEvent).toEqual(
      createMapEditorEvent({
        mode: MapEditorMode.PlaceZone,
        x: 8,
        y: 9,
        width: 3,
        height: 4,
      }),
    );
  });

  it("ports reverse_event fallback as an empty event when lookups miss", () => {
    const context = {
      tiles: [],
      objects: [],
      zones: [],
      nextReferenceId: 55,
    };

    expect(
      reverseMapEditorEvent(
        createMapEditorEvent({ mode: MapEditorMode.RemoveObject, referenceId: 77 }),
        context,
      ),
    ).toEqual(createMapEditorEvent({ mode: -1 }));
    expect(
      reverseMapEditorEvent(
        createMapEditorEvent({ mode: MapEditorMode.RemoveZone, x: 8, y: 9 }),
        context,
      ),
    ).toEqual(createMapEditorEvent({ mode: -1 }));
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
