import { describe, expect, it } from "vitest";
import {
  createMapEffectInfo,
  createMapZoneInfoTile,
  type LegacyMapObject,
  type MapObject,
  type MapTile,
  type MapZone,
  type NewPaletteTileInfo,
  type PaletteTileInfo,
  MAP_FILE_READ_BUFFER_SIZE,
  MAX_SHIFT_CLICK_PIXELS,
  MapObjectType,
  SHIFT_CLICK_SPEED_PIXELS_PER_SECOND,
  SHIFT_CLICK_STREAM_SECONDS,
} from "../src/world/MapFormat";

describe("map format constants", () => {
  it("ports the upstream map file read buffer size", () => {
    expect(MAP_FILE_READ_BUFFER_SIZE).toBe(1024);
  });

  it("ports the shift-click stream threshold in seconds", () => {
    expect(SHIFT_CLICK_STREAM_SECONDS).toBe(0.1);
  });

  it("ports the maximum shift-click step in pixels", () => {
    expect(MAX_SHIFT_CLICK_PIXELS).toBe(1);
  });

  it("ports the shift-click speed in pixels per second", () => {
    expect(SHIFT_CLICK_SPEED_PIXELS_PER_SECOND).toBe(320);
  });

  it("ports map_object_type numeric values", () => {
    expect(MapObjectType.Rock).toBe(0);
    expect(MapObjectType.Bridge).toBe(1);
    expect(MapObjectType.Building).toBe(2);
    expect(MapObjectType.Cannon).toBe(3);
    expect(MapObjectType.Vehicle).toBe(4);
    expect(MapObjectType.Robot).toBe(5);
    expect(MapObjectType.Animal).toBe(6);
    expect(MapObjectType.MapItem).toBe(7);
    expect(MapObjectType.Max).toBe(8);
  });

  it("ports the legacy map object record", () => {
    const object: LegacyMapObject = {
      x: 12,
      y: 34,
      owner: -1,
      objectType: MapObjectType.Building,
      objectId: 7,
      buildingLevel: 2,
    };

    expect(object).toEqual({
      x: 12,
      y: 34,
      owner: -1,
      objectType: MapObjectType.Building,
      objectId: 7,
      buildingLevel: 2,
    });
  });

  it("ports the current map object record", () => {
    const object: MapObject = {
      x: 12,
      y: 34,
      owner: 1,
      objectType: MapObjectType.Vehicle,
      objectId: 3,
      buildingLevel: 0,
      extraLinks: 2,
      healthPercent: 75,
    };

    expect(object.extraLinks).toBe(2);
    expect(object.healthPercent).toBe(75);
  });

  it("ports the map tile record", () => {
    const mapTile: MapTile = { tile: 513 };

    expect(mapTile.tile).toBe(513);
  });

  it("ports map zones in tile coordinates", () => {
    const zone: MapZone = { x: 2, y: 3, width: 8, height: 5 };

    expect(zone).toEqual({ x: 2, y: 3, width: 8, height: 5 });
  });

  it("ports palette tile metadata", () => {
    const tile: PaletteTileInfo = {
      isWater: true,
      isPassable: false,
      isUsable: false,
      isRoad: false,
      isEffect: true,
      isWaterEffect: true,
      nextTileInEffect: 14,
      takesTankTracks: false,
      craterType: -1,
      isStarterTile: false,
    };

    expect(tile.nextTileInEffect).toBe(14);
    expect(tile.craterType).toBe(-1);
    expect(tile.isWaterEffect).toBe(true);
  });

  it("keeps the new palette tile layout compatible", () => {
    const tile: NewPaletteTileInfo = {
      isWater: false,
      isPassable: true,
      isUsable: true,
      isRoad: true,
      isEffect: false,
      isWaterEffect: false,
      nextTileInEffect: 0,
      takesTankTracks: true,
      craterType: 2,
      isStarterTile: true,
    };

    expect(tile.isStarterTile).toBe(true);
    expect(tile.takesTankTracks).toBe(true);
  });

  it("ports map_effect_info constructor defaults", () => {
    expect(createMapEffectInfo(42)).toEqual({
      tile: 42,
      nextEffectTime: 0,
    });
  });

  it("ports map_zone_info_tile constructor defaults", () => {
    expect(
      createMapZoneInfoTile({
        x: 12,
        y: 34,
        isWater: true,
        random: () => 0.75,
      }),
    ).toEqual({
      renderLocation: {
        x: 12,
        y: 34,
        width: 0,
        height: 0,
      },
      isWater: true,
      bobIndex: 1,
      nextTime: 0,
    });
  });
});
