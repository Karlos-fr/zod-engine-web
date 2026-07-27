export const MAP_FILE_READ_BUFFER_SIZE = 1024;
export const MAX_SHIFT_CLICK_PIXELS = 1;
export const SHIFT_CLICK_SPEED_PIXELS_PER_SECOND = 320;
export const SHIFT_CLICK_STREAM_SECONDS = 0.1;

export enum MapObjectType {
  Rock = 0,
  Bridge = 1,
  Building = 2,
  Cannon = 3,
  Vehicle = 4,
  Robot = 5,
  Animal = 6,
  MapItem = 7,
  Max = 8,
}

/**
 * Object record used by legacy map files.
 *
 * Coordinates are tile coordinates, not pixel coordinates. Numeric range
 * validation belongs to the binary map codec that consumes this data shape.
 */
export type LegacyMapObject = {
  x: number;
  y: number;
  owner: number;
  objectType: MapObjectType;
  objectId: number;
  buildingLevel: number;
};

export type MapObject = LegacyMapObject & {
  extraLinks: number;
  healthPercent: number;
};

export type MapTile = {
  tile: number;
};

/** Tile-space rectangle stored in map files. */
export type MapZone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PaletteTileInfo = {
  isWater: boolean;
  isPassable: boolean;
  isUsable: boolean;
  isRoad: boolean;
  isEffect: boolean;
  isWaterEffect: boolean;
  nextTileInEffect: number;
  takesTankTracks: boolean;
  craterType: number;
  isStarterTile: boolean;
};

/** New upstream record name; its layout is currently identical. */
export type NewPaletteTileInfo = PaletteTileInfo;

export type MapEffectInfo = {
  tile: number;
  nextEffectTime: number;
};

export function createMapEffectInfo(tile = 0): MapEffectInfo {
  return {
    tile,
    nextEffectTime: 0,
  };
}

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MapZoneInfoTile = {
  renderLocation: Rect;
  isWater: boolean;
  bobIndex: number;
  nextTime: number;
};

export function createMapZoneInfoTile(
  options: { x?: number; y?: number; isWater?: boolean; random?: () => number } = {},
): MapZoneInfoTile {
  const random = options.random ?? Math.random;
  return {
    renderLocation: {
      x: options.x ?? 0,
      y: options.y ?? 0,
      width: 0,
      height: 0,
    },
    isWater: options.isWater ?? false,
    bobIndex: Math.floor(random() * 2),
    nextTime: 0,
  };
}
