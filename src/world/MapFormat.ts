/**
 * Upstream: zmap.h / zmap.cpp
 */
import { TeamType } from "../simulation/SimulationConstants";

/**
 * Port of upstream `buf_size`.
 * Role: Defines the fixed scratch-buffer size used when reading map file chunks.
 * Upstream: zmap.cpp:986
 */
export const MAP_FILE_READ_BUFFER_SIZE = 1024;

/**
 * Port of upstream `MAX_SHIFT_CLICK`.
 * Role: Caps the viewport distance controlled by shift-click map navigation.
 * Upstream: zmap.h:16
 */
export const MAX_SHIFT_CLICK_PIXELS = 1;

/**
 * Port of upstream `SHIFT_CLICK_S`.
 * Role: Defines the viewport shift speed for shift-click map navigation.
 * Upstream: zmap.h:17
 */
export const SHIFT_CLICK_SPEED_PIXELS_PER_SECOND = 320;

/**
 * Port of upstream `SHIFT_CLICK_STREAM`.
 * Role: Defines the shift-click stream interval for viewport movement.
 * Upstream: zmap.h:18
 */
export const SHIFT_CLICK_STREAM_SECONDS = 0.1;

/**
 * Port of upstream `map_object_type`.
 * Role: Identifies the category of an object stored in map files.
 * Upstream: zmap.h:21-32
 */
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
 * Port of upstream `map_object_old`.
 * Role: Stores the compact object placement record for legacy map files.
 * Upstream: zmap.h:144-151
 */
export type LegacyMapObject = {
  x: number;
  y: number;
  owner: number;
  objectType: MapObjectType;
  objectId: number;
  buildingLevel: number;
};

/**
 * Port of upstream `map_object`.
 * Role: Stores a map object placement with link metadata and starting health.
 * Upstream: zmap.h:153-162
 */
export type MapObject = LegacyMapObject & {
  extraLinks: number;
  healthPercent: number;
};

/**
 * Port of upstream `map_tile`.
 * Role: Stores the terrain tile identifier for one map cell.
 * Upstream: zmap.h:164-167
 */
export type MapTile = {
  tile: number;
};

/**
 * Port of upstream `map_zone`.
 * Role: Stores a tile-space rectangle used to define a named map zone.
 * Upstream: zmap.h:139-142
 */
export type MapZone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Port of upstream `palette_tile_info`.
 * Role: Describes terrain palette behavior flags for movement and rendering.
 * Upstream: zmap.h:42-56
 */
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

/**
 * Port of upstream `palette_tile_info_new`.
 * Role: Preserves the newer palette tile record name for later map formats.
 * Upstream: zmap.h:58-72
 */
export type NewPaletteTileInfo = PaletteTileInfo;

/**
 * Port of upstream `map_effect_info`.
 * Role: Tracks the active terrain effect tile and its next animation timestamp.
 * Upstream: zmap.h:105-112
 */
export type MapEffectInfo = {
  tile: number;
  nextEffectTime: number;
};

/**
 * Port of upstream `map_effect_info` default initialization.
 * Role: Creates a terrain effect state record before animation scheduling begins.
 * Upstream: zmap.h:105-112
 */
export function createMapEffectInfo(tile = 0): MapEffectInfo {
  return {
    tile,
    nextEffectTime: 0,
  };
}

/**
 * Browser-side rectangle for the `map_zone_info_tile` port.
 * Role: Represents the render-space bounds attached to a zone-info tile.
 * Upstream: zmap.h:77-95
 */
export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Port of upstream `map_zone_info_tile`.
 * Role: Stores transient render and water-bobbing state for a map zone tile.
 * Upstream: zmap.h:77-95
 */
export type MapZoneInfoTile = {
  renderLocation: Rect;
  isWater: boolean;
  bobIndex: number;
  nextTime: number;
};

/**
 * Port of upstream `map_zone_info_tile` default initialization.
 * Role: Creates zone tile render state with deterministic testable bob selection.
 * Upstream: zmap.h:77-95
 */
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

/**
 * Port of upstream `map_zone_info`.
 * Role: Stores ownership, bounds, and render tiles for a map zone.
 * Upstream: zmap.h:97-103
 */
export type MapZoneInfo = {
  owner: TeamType;
  tiles: MapZoneInfoTile[];
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
};
