/**
 * Upstream: zmap.h / zmap.cpp
 */

import type { SurfaceBlitRegion } from "../rendering/SurfacePixels";
import type { Tile } from "./Tile";
import {
  createMapZoneInfoTile,
  MAX_SHIFT_CLICK_PIXELS,
  SHIFT_CLICK_SPEED_PIXELS_PER_SECOND,
  SHIFT_CLICK_STREAM_SECONDS,
  type MapObject,
  type MapTile,
  type MapZone,
  type MapZoneInfo,
  type PaletteTileInfo,
} from "./MapFormat";
import {
  ROAD_SPEED,
  TeamType,
  WATER_SPEED,
} from "../simulation/SimulationConstants";
import { currentTime } from "../simulation/Common";
import { MAX_PLANET_TILES } from "./WorldConstants";

const ZMAP_TILE_SIZE_PIXELS = 16;
const ZMAP_PLANET_TYPE_ASSET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;
const ZMAP_PLANET_TYPE_DEBUG_NAMES: readonly string[] =
  ZMAP_PLANET_TYPE_ASSET_NAMES;

type GameMapPaletteTileInfo = Pick<
  PaletteTileInfo,
  "craterType" | "isPassable" | "isRoad" | "isWater"
>;

export type PaletteTileCoordinatesResult = {
  success: boolean;
  x: number;
  y: number;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` request.
 * Role: Describes a map-shifted surface render operation for the rendering backend.
 * Upstream: zmap.cpp:1400-1403
 */
export type MapSurfaceRenderCommand<TSurface> = {
  surface: TSurface;
  x: number;
  y: number;
  renderHit: boolean;
  aboutCenter: boolean;
};

/**
 * Replacement for upstream `ZMap::DoRender`.
 * Role: Describes blitting the shifted map viewport from the full-map render surface.
 * Upstream: zmap.cpp:269-284
 */
export type MapViewportRenderCommand<TSurface> = {
  surface: TSurface;
  region: SurfaceBlitRegion;
};

/**
 * Port of upstream `SDL_Surface` dimensions used by `ZMap::PermStamp`.
 * Role: Provides the source surface size needed for permanent terrain stamps.
 * Upstream: zmap.cpp:1860-1875
 */
export type PermanentStampSourceSurface = {
  width: number;
  height: number;
};

/**
 * Port of upstream `ZSDL_Surface::GetBaseSurface` dependency surface.
 * Role: Provides the loaded base surface used by permanent map stamping.
 * Upstream: zmap.cpp:1846-1849
 */
export type PermanentStampRenderableSurface<TBaseSurface extends PermanentStampSourceSurface> = {
  baseSurface: TBaseSurface | null;
};

/**
 * Replacement for upstream `full_render.BlitOnToMe`.
 * Role: Describes a full-map terrain blit produced by a permanent stamp.
 * Upstream: zmap.cpp:1870-1873
 */
export type PermanentStampBlitCommand<TSurface extends PermanentStampSourceSurface> = {
  surface: TSurface;
  destinationX: number;
  destinationY: number;
  width: number;
  height: number;
};

/**
 * Replacement for upstream `ZSDL_Surface::BlitSurface`.
 * Role: Describes a renderable surface blit onto the full-map terrain surface.
 * Upstream: zmap.cpp:1851-1854
 */
export type PermanentRenderableStampBlitCommand<
  TSurface extends PermanentStampRenderableSurface<PermanentStampSourceSurface>,
> = {
  surface: TSurface;
  destinationX: number;
  destinationY: number;
  width: number;
  height: number;
};

/**
 * Replacement for upstream `full_render`.
 * Role: Provides the unload operation used to release the rendered full-map surface.
 * Upstream: zmap.cpp:625-633
 */
export type FullMapRenderSurfaceState = {
  unload(): void;
};

export type MapPaletteTileInfoWriter = (
  filename: string,
  tiles: readonly PaletteTileInfo[],
) => boolean;

/**
 * Port of upstream `ZMap::WriteMapPaletteTileInfo`.
 * Role: Writes one planet palette's tile metadata through a browser-supplied persistence adapter.
 * Upstream: zmap.cpp:191-207
 */
export function writeMapPaletteTileInfo(
  palette: number,
  planetTileInfo: readonly (readonly PaletteTileInfo[])[],
  writer: MapPaletteTileInfoWriter,
): number {
  const planetName = ZMAP_PLANET_TYPE_ASSET_NAMES[palette];

  if (!planetName) return 0;

  const tiles = planetTileInfo[palette]?.slice(0, MAX_PLANET_TILES) ?? [];
  const filename = `assets/planets/${planetName}.tileinfo`;

  return writer(filename, tiles) ? 1 : 0;
}

/**
 * Port of upstream `path_finder`.
 * Role: Provides delegated pathfinding operations owned by the map.
 * Upstream: zmap.h:255-261
 */
export type MapPathFinder = {
  rebuildRegions(): void;
  deleteAllTileInfo?(): void;
  setImpassable(x: number, y: number, impassable: boolean, destroyable: boolean): void;
  withinImpassable(
    x: number,
    y: number,
    width: number,
    height: number,
    isRobot: boolean,
  ): WithinImpassableResult;
};

/**
 * Port of upstream `WithinImpassable` output arguments.
 * Role: Reports whether an area hits impassable terrain and where it stopped.
 * Upstream: zmap.h:257-258
 */
export type WithinImpassableResult = {
  within: boolean;
  stopX: number;
  stopY: number;
};

export class GameMap {
  readonly width: number;
  readonly height: number;
  readonly tiles: Tile[];
  readonly mapTiles: readonly MapTile[];
  readonly objectList: MapObject[];
  mapName: string;
  terrainType: number;
  playerCount: number;
  zoneCount: number;
  zoneList: MapZone[];
  zoneInfoList: MapZoneInfo[];
  paletteTileInfo: readonly (readonly GameMapPaletteTileInfo[])[];
  submergeInfoSetup: boolean;
  submergeAmounts: readonly (readonly number[])[];
  rockListSetup: boolean;
  rockList: readonly (readonly boolean[])[];
  stampListSetup: boolean;
  stampList: readonly (readonly boolean[])[];
  stampListWidth: number;
  stampListHeight: number;
  shiftX: number;
  shiftY: number;
  viewWidth: number;
  viewHeight: number;
  lastShiftTime: number;
  shiftOverflow: number;
  mapData: Uint8Array | null;
  mapDataSize: number;
  fullRenderSurface: FullMapRenderSurfaceState | null;
  private fileLoaded: boolean;
  private readonly pathFinder?: MapPathFinder;
  private readonly readCurrentTime: () => number;

  constructor(options: {
    width: number;
    height: number;
    tiles: Tile[];
    mapTiles?: readonly MapTile[];
    objectList?: MapObject[];
    mapName?: string;
    terrainType?: number;
    playerCount?: number;
    zoneCount?: number;
    zoneList?: MapZone[];
    zoneInfoList?: MapZoneInfo[];
    paletteTileInfo?: readonly (readonly GameMapPaletteTileInfo[])[];
    submergeInfoSetup?: boolean;
    submergeAmounts?: readonly (readonly number[])[];
    rockListSetup?: boolean;
    rockList?: readonly (readonly boolean[])[];
    stampListSetup?: boolean;
    stampList?: readonly (readonly boolean[])[];
    stampListWidth?: number;
    stampListHeight?: number;
    shiftX?: number;
    shiftY?: number;
    viewWidth?: number;
    viewHeight?: number;
    lastShiftTime?: number;
    shiftOverflow?: number;
    mapData?: Uint8Array | null;
    mapDataSize?: number;
    fullRenderSurface?: FullMapRenderSurfaceState | null;
    fileLoaded?: boolean;
    pathFinder?: MapPathFinder;
    readCurrentTime?: () => number;
  }) {
    this.width = options.width;
    this.height = options.height;
    this.tiles = options.tiles;
    this.mapTiles =
      options.mapTiles ??
      Array.from({ length: options.width * options.height }, () => ({ tile: 0 }));
    this.objectList = options.objectList ?? [];
    this.mapName = options.mapName ?? "";
    this.terrainType = options.terrainType ?? 0;
    this.playerCount = options.playerCount ?? 0;
    this.zoneCount = options.zoneCount ?? 0;
    this.zoneList = options.zoneList ?? [];
    this.zoneInfoList = options.zoneInfoList ?? [];
    this.paletteTileInfo = options.paletteTileInfo ?? [];
    this.submergeInfoSetup = options.submergeInfoSetup ?? false;
    this.submergeAmounts = options.submergeAmounts ?? [];
    this.rockListSetup = options.rockListSetup ?? false;
    this.rockList = options.rockList ?? [];
    this.stampListSetup = options.stampListSetup ?? false;
    this.stampList = options.stampList ?? [];
    this.stampListWidth = options.stampListWidth ?? -1;
    this.stampListHeight = options.stampListHeight ?? -1;
    this.shiftX = options.shiftX ?? 0;
    this.shiftY = options.shiftY ?? 0;
    this.viewWidth = options.viewWidth ?? 0;
    this.viewHeight = options.viewHeight ?? 0;
    this.lastShiftTime = options.lastShiftTime ?? 0;
    this.shiftOverflow = options.shiftOverflow ?? 0;
    this.mapData = options.mapData ?? null;
    this.mapDataSize = options.mapDataSize ?? this.mapData?.byteLength ?? 0;
    this.fullRenderSurface = options.fullRenderSurface ?? null;
    this.fileLoaded = options.fileLoaded ?? false;
    this.pathFinder = options.pathFinder;
    this.readCurrentTime = options.readCurrentTime ?? currentTime;
  }

  static createFlat(options: { width: number; height: number }): GameMap {
    return new GameMap({
      width: options.width,
      height: options.height,
      tiles: Array.from({ length: options.width * options.height }, () => ({
        terrain: "plain",
      })),
    });
  }

  tileAt(x: number, y: number): Tile | undefined {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.tiles[y * this.width + x];
  }

  /**
   * Port of upstream `RebuildRegions`.
   * Role: Rebuilds the map pathfinding regions.
   * Upstream: zmap.h:261
   */
  rebuildRegions(): void {
    this.pathFinder?.rebuildRegions();
  }

  /**
   * Port of upstream `ZMap::DeletePathfindingInfo`.
   * Role: Clears all pathfinding tile metadata owned by the map.
   * Upstream: zmap.cpp:2261-2264
   */
  deletePathfindingInfo(): void {
    this.pathFinder?.deleteAllTileInfo?.();
  }

  /**
   * Port of upstream `ZMap::Loaded`.
   * Role: Reports whether map file data has been loaded.
   * Upstream: zmap.cpp:159-162
   */
  loaded(): boolean {
    return this.fileLoaded;
  }

  /**
   * Port of upstream `ZMap::DebugMapInfo`.
   * Role: Builds diagnostic map metadata lines for debugging loaded maps.
   * Upstream: zmap.cpp:345-363
   */
  debugMapInfo(): string[] {
    if (!this.fileLoaded) {
      return ["DebugMapInfo::map not loaded"];
    }

    return [
      "",
      "DebugMapInfo...",
      `Map name:${this.mapName}`,
      `Map width:${this.width}`,
      `Map height:${this.height}`,
      `Map player_count:${this.playerCount}`,
      `Map object_count:${this.objectList.length}`,
      `Map zone_count:${this.zoneCount}`,
      `Map terrain_type:${ZMAP_PLANET_TYPE_DEBUG_NAMES[this.terrainType] ?? String(this.terrainType)}`,
      "",
    ];
  }

  /**
   * Port of upstream `ZMap::FreeMapData`.
   * Role: Releases the retained raw map-data buffer and clears its byte size.
   * Upstream: zmap.cpp:617-623
   */
  freeMapData(): void {
    this.mapData = null;
    this.mapDataSize = 0;
  }

  /**
   * Replacement for upstream `ZMap::DeRenderMap`.
   * Role: Releases the rendered full-map surface.
   * Upstream: zmap.cpp:625-633
   */
  deRenderMap(): void {
    this.fullRenderSurface?.unload();
  }

  /**
   * Port of upstream `ZMap::GetMapData`.
   * Role: Reports the retained raw map-data buffer and its stored byte size.
   * Upstream: zmap.cpp:889-895
   */
  getMapData(): { hasData: boolean; data: Uint8Array | null; size: number } {
    return {
      hasData: true,
      data: this.mapData,
      size: this.mapDataSize,
    };
  }

  /**
   * Port of upstream `ZMap::PlaceObject`.
   * Role: Appends a map object placement to the map's object list.
   * Upstream: zmap.cpp:1597-1600
   */
  placeObject(newObject: MapObject): void {
    this.objectList.push(newObject);
  }

  /**
   * Port of upstream `ZMap::GetViewShift`.
   * Role: Returns the current map view pixel shift.
   * Upstream: zmap.cpp:1378-1382
   */
  getViewShift(): { x: number; y: number } {
    return {
      x: this.shiftX,
      y: this.shiftY,
    };
  }

  /**
   * Replacement for upstream `ZMap::RenderZSurface`.
   * Role: Builds a surface render command adjusted by the current map view shift.
   * Upstream: zmap.cpp:1400-1403
   */
  renderZSurface<TSurface>(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<TSurface> {
    return {
      surface,
      x: x - this.shiftX,
      y: y - this.shiftY,
      renderHit,
      aboutCenter,
    };
  }

  /**
   * Replacement for upstream `ZMap::DoRender`.
   * Role: Builds the full-map viewport blit command for the rendering backend.
   * Upstream: zmap.cpp:269-284
   */
  doRender(
    shiftXDestination: number,
    shiftYDestination: number,
  ): MapViewportRenderCommand<FullMapRenderSurfaceState> | null {
    if (!this.fullRenderSurface) return null;

    return {
      surface: this.fullRenderSurface,
      region: {
        sourceX: this.shiftX,
        sourceY: this.shiftY,
        width: this.viewWidth,
        height: this.viewHeight,
        destinationX: shiftXDestination,
        destinationY: shiftYDestination,
      },
    };
  }

  /**
   * Port of upstream `ZMap::GetViewLimits`.
   * Role: Returns the current shifted map view bounds.
   * Upstream: zmap.cpp:1362-1368
   */
  getViewLimits(): {
    mapLeft: number;
    mapRight: number;
    mapTop: number;
    mapBottom: number;
  } {
    const mapLeft = this.shiftX;
    const mapTop = this.shiftY;

    return {
      mapLeft,
      mapRight: mapLeft + this.viewWidth,
      mapTop,
      mapBottom: mapTop + this.viewHeight,
    };
  }

  /**
   * Port of upstream `ZMap::GetViewShiftFull`.
   * Role: Returns the current map view shift and dimensions.
   * Upstream: zmap.cpp:1370-1376
   */
  getViewShiftFull(): {
    x: number;
    y: number;
    viewWidth: number;
    viewHeight: number;
  } {
    return {
      x: this.shiftX,
      y: this.shiftY,
      viewWidth: this.viewWidth,
      viewHeight: this.viewHeight,
    };
  }

  /**
   * Port of upstream `ZMap::ShiftViewRight(int)`.
   * Role: Moves the map view right and clamps it inside the map pixel width.
   * Upstream: zmap.cpp:1227-1248
   */
  shiftViewRight(amount: number): boolean {
    let wasFixed = false;
    this.shiftX += amount;

    const fullWidth = this.width * ZMAP_TILE_SIZE_PIXELS;
    if (this.shiftX > fullWidth - this.viewWidth) {
      this.shiftX = fullWidth - this.viewWidth;
      wasFixed = true;
    }
    if (this.shiftX < 0) {
      this.shiftX = 0;
      wasFixed = true;
    }

    return !wasFixed;
  }

  /**
   * Port of upstream `ZMap::ShiftViewRight()`.
   * Role: Moves the map view right by the streamed shift-click distance.
   * Upstream: zmap.cpp:1319-1322
   */
  shiftViewRightByTime(): boolean {
    return this.shiftViewRight(Math.trunc(this.shiftViewDifference()));
  }

  /**
   * Port of upstream `ZMap::ShiftViewLeft(int)`.
   * Role: Moves the map view left and clamps it inside the map pixel width.
   * Upstream: zmap.cpp:1296-1317
   */
  shiftViewLeft(amount: number): boolean {
    let wasFixed = false;
    this.shiftX -= amount;

    const fullWidth = this.width * ZMAP_TILE_SIZE_PIXELS;
    if (this.shiftX > fullWidth - this.viewWidth) {
      this.shiftX = fullWidth - this.viewWidth;
      wasFixed = true;
    }
    if (this.shiftX < 0) {
      this.shiftX = 0;
      wasFixed = true;
    }

    return !wasFixed;
  }

  /**
   * Port of upstream `ZMap::ShiftViewLeft()`.
   * Role: Moves the map view left by the streamed shift-click distance.
   * Upstream: zmap.cpp:1334-1337
   */
  shiftViewLeftByTime(): boolean {
    return this.shiftViewLeft(Math.trunc(this.shiftViewDifference()));
  }

  /**
   * Port of upstream `ZMap::ShiftViewUp(int)`.
   * Role: Moves the map view up and clamps it inside the map pixel height.
   * Upstream: zmap.cpp:1250-1271
   */
  shiftViewUp(amount: number): boolean {
    let wasFixed = false;
    this.shiftY -= amount;

    const fullHeight = this.height * ZMAP_TILE_SIZE_PIXELS;
    if (this.shiftY > fullHeight - this.viewHeight) {
      this.shiftY = fullHeight - this.viewHeight;
      wasFixed = true;
    }
    if (this.shiftY < 0) {
      this.shiftY = 0;
      wasFixed = true;
    }

    return !wasFixed;
  }

  /**
   * Port of upstream `ZMap::ShiftViewUp()`.
   * Role: Moves the map view up by the streamed shift-click distance.
   * Upstream: zmap.cpp:1324-1327
   */
  shiftViewUpByTime(): boolean {
    return this.shiftViewUp(Math.trunc(this.shiftViewDifference()));
  }

  /**
   * Port of upstream `ZMap::ShiftViewDown(int)`.
   * Role: Moves the map view down and clamps it inside the map pixel height.
   * Upstream: zmap.cpp:1273-1294
   */
  shiftViewDown(amount: number): boolean {
    let wasFixed = false;
    this.shiftY += amount;

    const fullHeight = this.height * ZMAP_TILE_SIZE_PIXELS;
    if (this.shiftY > fullHeight - this.viewHeight) {
      this.shiftY = fullHeight - this.viewHeight;
      wasFixed = true;
    }
    if (this.shiftY < 0) {
      this.shiftY = 0;
      wasFixed = true;
    }

    return !wasFixed;
  }

  /**
   * Port of upstream `ZMap::ShiftViewDown()`.
   * Role: Moves the map view down by the streamed shift-click distance.
   * Upstream: zmap.cpp:1329-1332
   */
  shiftViewDownByTime(): boolean {
    return this.shiftViewDown(Math.trunc(this.shiftViewDifference()));
  }

  /**
   * Port of upstream `ZMap::ShiftViewDifference`.
   * Role: Calculates streamed viewport movement distance from elapsed time.
   * Upstream: zmap.cpp:1339-1360
   */
  shiftViewDifference(): number {
    const theTime = this.readCurrentTime();
    const timeDifference = theTime - this.lastShiftTime;
    let shiftDifference: number;

    if (timeDifference > SHIFT_CLICK_STREAM_SECONDS) {
      shiftDifference = MAX_SHIFT_CLICK_PIXELS;
      this.shiftOverflow = 0;
      this.lastShiftTime = theTime;
    } else {
      shiftDifference =
        timeDifference * SHIFT_CLICK_SPEED_PIXELS_PER_SECOND + this.shiftOverflow;
      this.shiftOverflow = shiftDifference - Math.trunc(shiftDifference);
      this.lastShiftTime = theTime;
    }

    return shiftDifference;
  }

  /**
   * Port of upstream `ZMap::GetMapCoords`.
   * Role: Converts screen mouse coordinates to shifted map coordinates.
   * Upstream: zmap.cpp:1384-1388
   */
  getMapCoords(mouseX: number, mouseY: number): { x: number; y: number } {
    return {
      x: mouseX + this.shiftX,
      y: mouseY + this.shiftY,
    };
  }

  /**
   * Port of upstream `ZMap::GetTile`.
   * Role: Converts a linear tile index into unshifted or shifted map pixel coordinates.
   * Upstream: zmap.cpp:540-553
   */
  getTile(index: number, isShifted = false): { x: number; y: number } {
    let y = Math.trunc(index / this.width);
    let x = index % this.width;

    x *= ZMAP_TILE_SIZE_PIXELS;
    y *= ZMAP_TILE_SIZE_PIXELS;

    if (isShifted) {
      x -= this.shiftX;
      y -= this.shiftY;
    }

    return { x, y };
  }

  /**
   * Port of upstream `ZMap::GetTileIndex`.
   * Role: Converts map or shifted pixel coordinates into a linear tile index.
   * Upstream: zmap.cpp:555-572
   */
  getTileIndex(x: number, y: number, isShifted = false): number {
    if (isShifted) {
      x += this.shiftX;
      y += this.shiftY;
    }

    if (x >= this.width * ZMAP_TILE_SIZE_PIXELS) return -1;
    if (y >= this.height * ZMAP_TILE_SIZE_PIXELS) return -1;
    if (x < 0) return -1;
    if (y < 0) return -1;

    x = Math.trunc(x / ZMAP_TILE_SIZE_PIXELS);
    y = Math.trunc(y / ZMAP_TILE_SIZE_PIXELS);

    return y * this.width + x;
  }

  /**
   * Port of upstream `ZMap::GetPaletteTile`.
   * Role: Converts palette pixel coordinates into the fixed planet-tile palette index.
   * Upstream: zmap.cpp:169-184
   */
  getPaletteTile(x: number, y: number): number {
    const tileX = Math.trunc(x / ZMAP_TILE_SIZE_PIXELS);
    const tileY = Math.trunc(y / ZMAP_TILE_SIZE_PIXELS);
    const paletteTile = tileY * 20 + tileX;

    if (paletteTile >= MAX_PLANET_TILES) return -1;
    if (paletteTile < 0) return -1;

    return paletteTile;
  }

  /**
   * Port of upstream `ZMap::GetPaletteTile`.
   * Role: Converts a fixed planet-tile palette index into palette pixel coordinates.
   * Upstream: zmap.cpp:520-538
   */
  getPaletteTileCoordinates(index: number): PaletteTileCoordinatesResult {
    if (index >= MAX_PLANET_TILES) return { success: false, x: 0, y: 0 };

    return {
      success: true,
      x: (index % 20) * ZMAP_TILE_SIZE_PIXELS,
      y: Math.trunc(index / 20) * ZMAP_TILE_SIZE_PIXELS,
    };
  }

  /**
   * Port of upstream `ZMap::CoordIsRoad`.
   * Role: Reports whether map pixel coordinates point at a road palette tile.
   * Upstream: zmap.cpp:589-596
   */
  coordIsRoad(x: number, y: number): boolean {
    const tileIndex = this.getTileIndex(x, y);

    if (tileIndex === -1) return false;

    const mapTile = this.mapTiles[tileIndex];

    if (!mapTile) return false;

    return this.paletteTileInfo[this.terrainType]?.[mapTile.tile]?.isRoad ?? false;
  }

  /**
   * Port of upstream `ZMap::CoordCraterType`.
   * Role: Returns the crater type for tile coordinates.
   * Upstream: zmap.cpp:1877-1891
   */
  coordCraterType(tileX: number, tileY: number): number {
    if (tileX >= this.width) return -1;
    if (tileY >= this.height) return -1;
    if (tileX < 0) return -1;
    if (tileY < 0) return -1;

    const tileIndex = tileY * this.width + tileX;
    const mapTile = this.mapTiles[tileIndex];

    if (!mapTile) return -1;

    return this.paletteTileInfo[this.terrainType]?.[mapTile.tile]?.craterType ?? -1;
  }

  /**
   * Port of upstream `ZMap::SetupAllZoneInfo`.
   * Role: Rebuilds zone bounds and border render tiles from map zones.
   * Upstream: zmap.cpp:1676-1771
   */
  setupAllZoneInfo(): void {
    const nextZoneInfoList: MapZoneInfo[] = [];

    for (let zoneIndex = 0; zoneIndex < this.zoneList.length; zoneIndex += 1) {
      const zone = this.zoneList[zoneIndex];
      const zoneInfo: MapZoneInfo = {
        id: zoneIndex,
        owner: TeamType.Null,
        x: zone.x * ZMAP_TILE_SIZE_PIXELS,
        y: zone.y * ZMAP_TILE_SIZE_PIXELS,
        width: zone.width * ZMAP_TILE_SIZE_PIXELS,
        height: zone.height * ZMAP_TILE_SIZE_PIXELS,
        tiles: [],
      };

      const addZoneInfoTile = (tileX: number, tileY: number): void => {
        const mapTile = this.mapTiles[tileY * this.width + tileX];
        const tileInfo = mapTile
          ? this.paletteTileInfo[this.terrainType]?.[mapTile.tile]
          : undefined;

        if (!tileInfo?.isPassable) return;

        zoneInfo.tiles.push(
          createMapZoneInfoTile({
            x: tileX * ZMAP_TILE_SIZE_PIXELS + 6,
            y: tileY * ZMAP_TILE_SIZE_PIXELS + 6,
            isWater: tileInfo.isWater,
          }),
        );
      };

      for (let offsetX = 1; offsetX < zone.width - 1; offsetX += 1) {
        addZoneInfoTile(zone.x + offsetX, zone.y);
        addZoneInfoTile(zone.x + offsetX, zone.y + zone.height - 1);
      }

      for (let offsetY = 0; offsetY < zone.height; offsetY += 1) {
        addZoneInfoTile(zone.x, zone.y + offsetY);
        addZoneInfoTile(zone.x + zone.width - 1, zone.y + offsetY);
      }

      nextZoneInfoList.push(zoneInfo);
    }

    this.zoneInfoList = nextZoneInfoList;
  }

  /**
   * Port of upstream `ZMap::AddZone`.
   * Role: Adds one valid zone and rebuilds zone info.
   * Upstream: zmap.cpp:1612-1630
   */
  addZone(newZone: MapZone): number {
    if (newZone.x >= this.width) return 0;
    if (newZone.y >= this.height) return 0;
    if (newZone.width > this.width) return 0;
    if (newZone.height > this.height) return 0;

    if (this.zoneList.some((zone) => zone.x === newZone.x && zone.y === newZone.y)) {
      return 0;
    }

    this.zoneList.push(newZone);
    this.setupAllZoneInfo();

    return 1;
  }

  /**
   * Port of upstream `ZMap::RemoveZone`.
   * Role: Removes one zone at tile coordinates and rebuilds zone info.
   * Upstream: zmap.cpp:1632-1645
   */
  removeZone(x: number, y: number): number {
    const zoneIndex = this.zoneList.findIndex((zone) => zone.x === x && zone.y === y);

    if (zoneIndex === -1) return 0;

    this.zoneList.splice(zoneIndex, 1);
    this.setupAllZoneInfo();

    return 1;
  }

  /**
   * Port of upstream `ZMap::GetTileWalkSpeed`.
   * Role: Returns the movement speed factor for map or shifted pixel coordinates.
   * Upstream: zmap.cpp:598-615
   */
  getTileWalkSpeed(x: number, y: number, isShifted = false): number {
    const tileIndex = this.getTileIndex(x, y, isShifted);

    if (tileIndex === -1) return 0;

    const mapTile = this.mapTiles[tileIndex];
    const tileInfo = mapTile
      ? this.paletteTileInfo[this.terrainType]?.[mapTile.tile]
      : undefined;

    if (!tileInfo?.isPassable) return 0;

    if (tileInfo.isRoad) return ROAD_SPEED;
    if (tileInfo.isWater) return WATER_SPEED;
    return 1.0;
  }

  /**
   * Port of upstream `ZMap::SubmergeAmount`.
   * Role: Returns the tile submersion amount for map pixel coordinates.
   * Upstream: zmap.cpp:2242-2259
   */
  submergeAmount(x: number, y: number): number {
    const tileX = Math.trunc(x / ZMAP_TILE_SIZE_PIXELS);
    const tileY = Math.trunc(y / ZMAP_TILE_SIZE_PIXELS);

    if (!this.submergeInfoSetup) return 0;
    if (tileX < 0) return 0;
    if (tileY < 0) return 0;
    if (tileX >= this.width) return 0;
    if (tileY >= this.height) return 0;

    return this.submergeAmounts[tileX]?.[tileY] ?? 0;
  }

  /**
   * Port of upstream `ZMap::DeleteSubmergeAmounts`.
   * Role: Releases stored submersion amounts and marks them uninitialized.
   * Upstream: zmap.cpp:2228-2240
   */
  deleteSubmergeAmounts(): void {
    if (!this.submergeInfoSetup) return;

    this.submergeAmounts = [];
    this.submergeInfoSetup = false;
  }

  /**
   * Port of upstream `ZMap::InitSubmergeAmounts`.
   * Role: Initializes per-tile water submersion amounts for loaded maps.
   * Upstream: zmap.cpp:2163-2226
   */
  initSubmergeAmounts(): void {
    if (this.submergeInfoSetup) {
      this.deleteSubmergeAmounts();
    }

    if (!this.fileLoaded) return;

    const submergeAmounts = Array.from({ length: this.width }, () =>
      Array.from({ length: this.height }, () => 0),
    );

    let tileX = 0;
    let tileY = 0;

    for (const mapTile of this.mapTiles) {
      submergeAmounts[tileX][tileY] = this.paletteTileInfo[this.terrainType]?.[
        mapTile.tile
      ]?.isWater
        ? 8
        : 0;

      tileX += 1;

      if (tileX >= this.width) {
        tileX = 0;
        tileY += 1;
      }
    }

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        if (submergeAmounts[x][y] !== 8) continue;

        for (let x2 = x - 1; x2 < x + 3; x2 += 1) {
          if (x2 < 0) continue;
          if (x2 >= this.width) continue;

          for (let y2 = y - 1; y2 < y + 3; y2 += 1) {
            if (y2 < 0) continue;
            if (y2 >= this.height) continue;

            if (submergeAmounts[x2][y2] === 0) {
              submergeAmounts[x][y] = 6;
              x2 = x + 3;
              break;
            }
          }
        }
      }
    }

    this.submergeAmounts = submergeAmounts;
    this.submergeInfoSetup = true;
  }

  /**
   * Port of upstream `ZMap::DeleteRockList`.
   * Role: Releases stored per-tile rock occupancy flags and marks them uninitialized.
   * Upstream: zmap.cpp:2138-2150
   */
  deleteRockList(): void {
    if (!this.rockListSetup) return;

    this.rockList = [];
    this.rockListSetup = false;
  }

  /**
   * Port of upstream `ZMap::InitRockList`.
   * Role: Initializes per-tile rock occupancy flags for loaded maps.
   * Upstream: zmap.cpp:2115-2136
   */
  initRockList(): void {
    if (this.rockListSetup) {
      this.deleteRockList();
    }

    if (!this.fileLoaded) return;

    this.rockList = Array.from({ length: this.width }, () =>
      Array.from({ length: this.height }, () => false),
    );
    this.rockListSetup = true;
  }

  /**
   * Port of upstream `ZMap::DeleteStampList`.
   * Role: Releases stored terrain stamp flags and resets their dimensions.
   * Upstream: zmap.cpp:2099-2113
   */
  deleteStampList(): void {
    if (!this.stampListSetup) return;

    this.stampList = [];
    this.stampListSetup = false;
    this.stampListWidth = -1;
    this.stampListHeight = -1;
  }

  /**
   * Port of upstream `ZMap::InitStampList`.
   * Role: Initializes terrain stamp flags for loaded maps.
   * Upstream: zmap.cpp:2072-2097
   */
  initStampList(): void {
    if (this.stampListSetup) {
      this.deleteStampList();
    }

    if (!this.fileLoaded) return;

    this.stampList = Array.from({ length: this.width }, () =>
      Array.from({ length: this.height }, () => false),
    );
    this.stampListWidth = this.width;
    this.stampListHeight = this.height;
    this.stampListSetup = true;
  }

  /**
   * Port of upstream `ZMap::MakeSureStampListExists`.
   * Role: Ensures terrain stamp flags exist and match current map dimensions.
   * Upstream: zmap.cpp:2038-2053
   */
  makeSureStampListExists(): void {
    if (!this.stampListSetup) {
      this.initStampList();
      return;
    }

    if (this.width !== this.stampListWidth || this.height !== this.stampListHeight) {
      this.initStampList();
    }
  }

  /**
   * Port of upstream `ZMap::CoordStamped`.
   * Role: Reports whether map pixel coordinates point at a stamped terrain tile.
   * Upstream: zmap.cpp:2055-2070
   */
  coordStamped(x: number, y: number): boolean {
    this.makeSureStampListExists();

    const tileX = x >> 4;
    const tileY = y >> 4;

    if (tileX < 0) return false;
    if (tileY < 0) return false;
    if (tileX >= this.stampListWidth) return false;
    if (tileY >= this.stampListHeight) return false;

    return this.stampList[tileX]?.[tileY] ?? false;
  }

  /**
   * Port of upstream `ZMap::MarkAreaStamped`.
   * Role: Marks every terrain stamp tile touched by a map-pixel rectangle.
   * Upstream: zmap.cpp:1815-1838
   */
  markAreaStamped(x: number, y: number, width: number, height: number): void {
    this.makeSureStampListExists();

    let startX = x >> 4;
    let startY = y >> 4;
    let endX = (x + width) >> 4;
    let endY = (y + height) >> 4;

    if (!((x + width) % ZMAP_TILE_SIZE_PIXELS)) endX -= 1;
    if (!((y + height) % ZMAP_TILE_SIZE_PIXELS)) endY -= 1;

    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;
    if (endX >= this.stampListWidth) endX = this.stampListWidth - 1;
    if (endY >= this.stampListHeight) endY = this.stampListHeight - 1;

    const nextStampList = this.stampList.map((column) => [...column]);

    for (let tileX = startX; tileX <= endX; tileX += 1) {
      for (let tileY = startY; tileY <= endY; tileY += 1) {
        if (nextStampList[tileX]) {
          nextStampList[tileX][tileY] = true;
        }
      }
    }

    this.stampList = nextStampList;
  }

  /**
   * Port of upstream `ZMap::PermStamp`.
   * Role: Applies a raw source surface as a permanent full-map terrain stamp.
   * Upstream: zmap.cpp:1860-1875
   */
  permStamp<TSurface extends PermanentStampSourceSurface>(
    x: number,
    y: number,
    surface: TSurface | null,
    markStamped: boolean,
    fullRenderSurfaceAvailable: boolean,
    blitPermanentStamp: (
      command: PermanentStampBlitCommand<TSurface>,
    ) => void = (): void => undefined,
  ): boolean {
    if (!fullRenderSurfaceAvailable) return false;

    if (!surface) return true;

    if (markStamped) {
      this.markAreaStamped(x, y, surface.width, surface.height);
    }

    blitPermanentStamp({
      surface,
      destinationX: x,
      destinationY: y,
      width: surface.width,
      height: surface.height,
    });

    return true;
  }

  /**
   * Port of upstream `ZMap::PermStamp`.
   * Role: Applies a renderable source surface as a permanent full-map terrain stamp.
   * Upstream: zmap.cpp:1840-1858
   */
  permStampRenderableSurface<
    TSurface extends PermanentStampRenderableSurface<PermanentStampSourceSurface>,
  >(
    x: number,
    y: number,
    surface: TSurface | null,
    markStamped: boolean,
    fullRenderSurfaceAvailable: boolean,
    blitPermanentStamp: (
      command: PermanentRenderableStampBlitCommand<TSurface>,
    ) => void = (): void => undefined,
  ): boolean {
    if (!fullRenderSurfaceAvailable) return false;

    if (!surface) return true;
    if (!surface.baseSurface) return true;

    if (markStamped) {
      this.markAreaStamped(x, y, surface.baseSurface.width, surface.baseSurface.height);
    }

    blitPermanentStamp({
      surface,
      destinationX: x,
      destinationY: y,
      width: surface.baseSurface.width,
      height: surface.baseSurface.height,
    });

    return true;
  }

  /**
   * Port of upstream `ZMap::WithinView`.
   * Role: Reports whether a rectangle intersects the current shifted map view.
   * Upstream: zmap.cpp:1390-1398
   */
  withinView(x: number, y: number, width: number, height: number): boolean {
    if (x > this.shiftX + this.viewWidth) return false;
    if (y > this.shiftY + this.viewHeight) return false;
    if (x + width < this.shiftX) return false;
    if (y + height < this.shiftY) return false;

    return true;
  }

  /**
   * Port of upstream `SetImpassable`.
   * Role: Updates pathfinding blockage flags for a map coordinate.
   * Upstream: zmap.h:255-256
   */
  setImpassable(
    x: number,
    y: number,
    impassable = true,
    destroyable = false,
  ): void {
    this.pathFinder?.setImpassable(x, y, impassable, destroyable);
  }

  /**
   * Port of upstream `WithinImpassable`.
   * Role: Checks whether a rectangular unit area intersects impassable terrain.
   * Upstream: zmap.h:257-258
   */
  withinImpassable(
    x: number,
    y: number,
    width: number,
    height: number,
    isRobot: boolean,
  ): WithinImpassableResult {
    return (
      this.pathFinder?.withinImpassable(x, y, width, height, isRobot) ?? {
        within: false,
        stopX: x,
        stopY: y,
      }
    );
  }
}
