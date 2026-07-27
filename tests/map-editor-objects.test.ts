import { describe, expect, it } from "vitest";
import { objectExistsAt } from "../src/world/MapEditorObjects";
import { MapObjectType, type MapObject } from "../src/world/MapFormat";

const mapObjects: MapObject[] = [
  {
    x: 2,
    y: 3,
    owner: 1,
    objectType: MapObjectType.Building,
    objectId: 4,
    buildingLevel: 2,
    extraLinks: 0,
    healthPercent: 100,
  },
  {
    x: 7,
    y: 11,
    owner: -1,
    objectType: MapObjectType.Rock,
    objectId: 1,
    buildingLevel: 0,
    extraLinks: 0,
    healthPercent: 80,
  },
];

describe("map editor objects", () => {
  it("ports object_exists_at as true when an object has the requested tile", () => {
    expect(objectExistsAt(mapObjects, 7, 11)).toBe(true);
  });

  it("ports object_exists_at as false when no object has the requested tile", () => {
    expect(objectExistsAt(mapObjects, 3, 2)).toBe(false);
  });

  it("ports object_exists_at as false for an empty object list", () => {
    expect(objectExistsAt([], 2, 3)).toBe(false);
  });

  it("matches x and y as one exact tile coordinate", () => {
    expect(objectExistsAt(mapObjects, 2, 11)).toBe(false);
    expect(objectExistsAt(mapObjects, 7, 3)).toBe(false);
  });
});
