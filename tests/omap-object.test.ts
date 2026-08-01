import { describe, expect, it } from "vitest";
import { ItemType, TeamType } from "../src/simulation/SimulationConstants";
import type { MapObjectTurrentEffectSpawn } from "../src/world/MapObjectTurretEffect";
import { MAP_ITEM_TYPE_COUNT } from "../src/world/WorldConstants";
import {
  fireObjectMapObjectTurrentMissile,
  ObjectMapObject,
  OMAP_OBJECT_HEADER_GUARD_PORTED,
} from "../src/world/OMapObject";

describe("object map object", () => {
  it("adapts the omapobject header guard to module boundaries", async () => {
    const firstImport = await import("../src/world/OMapObject");
    const secondImport = await import("../src/world/OMapObject");

    expect(OMAP_OBJECT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OMAP_OBJECT_HEADER_GUARD_PORTED).toBe(
      firstImport.OMAP_OBJECT_HEADER_GUARD_PORTED,
    );
  });

  it("ports OMapObject IsDestroyableImpass as true", () => {
    expect(new ObjectMapObject().isDestroyableImpassable()).toBe(true);
  });

  it("ports OMapObject Process as a no-op result", () => {
    expect(new ObjectMapObject().process()).toBe(0);
  });

  it("ports OMapObject Init as map-object image path initialization", () => {
    const object = new ObjectMapObject();

    object.init();

    expect(object.mapObjectImages).toHaveLength(MAP_ITEM_TYPE_COUNT);
    expect(object.mapObjectImages[0]).toBe(
      "assets/other/map_items/map_object0.png",
    );
    expect(object.mapObjectImages[21]).toBe(
      "assets/other/map_items/map_object21.png",
    );
  });

  it("ports OMapObject SetType as bounded map-object identity", () => {
    const object = new ObjectMapObject();

    object.setType(ItemType.Map0 + 3);

    expect(object.objectIndex).toBe(3);
    expect(object.objectName).toBe("map_object3");
    expect(object.objectId).toBe(ItemType.Map0 + 3);
  });

  it("clamps OMapObject SetType below the map-object range", () => {
    const object = new ObjectMapObject();

    object.setType(ItemType.Map0 - 1);

    expect(object.objectIndex).toBe(0);
    expect(object.objectName).toBe("map_object0");
    expect(object.objectId).toBe(ItemType.Map0);
  });

  it("clamps OMapObject SetType above the map-object range", () => {
    const object = new ObjectMapObject();

    object.setType(ItemType.Map0 + MAP_ITEM_TYPE_COUNT);

    expect(object.objectIndex).toBe(MAP_ITEM_TYPE_COUNT - 1);
    expect(object.objectName).toBe(`map_object${MAP_ITEM_TYPE_COUNT - 1}`);
    expect(object.objectId).toBe(ItemType.Map0 + MAP_ITEM_TYPE_COUNT - 1);
  });

  it("ports OMapObject CausesImpassAtCoord as coordinate equality", () => {
    const object = new ObjectMapObject({ x: 32, y: 48 });

    expect(object.causesImpassAtCoord(32, 48)).toBe(true);
    expect(object.causesImpassAtCoord(31, 48)).toBe(false);
    expect(object.causesImpassAtCoord(32, 49)).toBe(false);
  });

  it("ports OMapObject SetMapImpassables as tile impassable marking", () => {
    const object = new ObjectMapObject({ x: 35, y: 50 });
    const calls: Array<[number, number, boolean, boolean]> = [];

    object.setMapImpassables({
      setImpassable(tileX, tileY, impassable, destroyable) {
        calls.push([tileX, tileY, impassable, destroyable]);
      },
    });

    expect(calls).toEqual([[2, 3, true, true]]);
  });

  it("ports OMapObject UnSetMapImpassables as tile impassable clearing", () => {
    const object = new ObjectMapObject({ x: 47, y: 65 });
    const calls: Array<[number, number, boolean, boolean]> = [];

    object.unsetMapImpassables({
      setImpassable(tileX, tileY, impassable, destroyable) {
        calls.push([tileX, tileY, impassable, destroyable]);
      },
    });

    expect(calls).toEqual([[2, 4, false, true]]);
  });

  it("ports OMapObject SetOwner as a null-team no-op", () => {
    const object = new ObjectMapObject();

    object.setOwner(TeamType.Red);

    expect(object.owner).toBe(TeamType.Null);
  });

  it("ports OMapObject FireTurrentMissile as no effect without a base image", () => {
    const effects: MapObjectTurrentEffectSpawn<{ tick: number }>[] = [];
    const state = {
      ztime: { tick: 1 },
      x: 32,
      y: 48,
      objectIndex: 1,
      renderImages: [
        undefined,
        {
          getBaseSurface: () => null,
        },
      ],
    };

    fireObjectMapObjectTurrentMissile(state, effects, 100, 120, 0.75);

    expect(effects).toEqual([]);
  });

  it("ports OMapObject FireTurrentMissile as no effect without an effect list", () => {
    const state = {
      ztime: { tick: 1 },
      x: 32,
      y: 48,
      objectIndex: 1,
      renderImages: [
        undefined,
        {
          getBaseSurface: () => ({ width: 16, height: 16 }),
        },
      ],
    };

    expect(() =>
      fireObjectMapObjectTurrentMissile(state, null, 100, 120, 0.75),
    ).not.toThrow();
  });

  it("ports OMapObject FireTurrentMissile as an appended map-object turret spawn", () => {
    const ztime = { tick: 1 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      objectIndex: 0,
    };
    const effects = [existing];
    const state = {
      ztime,
      x: 32,
      y: 48,
      objectIndex: 2,
      renderImages: [
        undefined,
        undefined,
        {
          getBaseSurface: () => ({ width: 16, height: 16 }),
        },
      ],
    };

    fireObjectMapObjectTurrentMissile(state, effects, 100, 120, 0.75);

    expect(effects).toEqual([
      existing,
      {
        ztime,
        startX: 32,
        startY: 48,
        targetX: 100,
        targetY: 120,
        offsetTime: 0.75,
        objectIndex: 2,
      },
    ]);
  });
});
