import {
  MINIMAP_MAX_HEIGHT_PIXELS,
  MINIMAP_MAX_WIDTH_PIXELS,
} from "./MiniMap";
import type {
  SurfaceFillRectRegion,
  SurfacePixelColor,
} from "../rendering/SurfacePixels";
import {
  BuildingType,
  CannonType,
  ItemType,
  PlanetType,
  RobotType,
  TeamType,
  VehicleType,
} from "../simulation/SimulationConstants";
import { type MapZoneInfo, MapObjectType } from "./MapFormat";
import { MapEditorMode, MapRulerMode } from "./WorldConstants";

/**
 * Upstream: map_editor.cpp
 */

/**
 * Port of upstream `SEP_SHIFT_X`.
 * Role: Defines the fixed horizontal pixel offset used to position the map editor separator panel.
 * Upstream: map_editor.cpp:61
 */
export const MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS = 320;

/**
 * Port of upstream `SEP_WIDTH`.
 * Role: Defines the fixed pixel width of the map editor separator panel.
 * Upstream: map_editor.cpp:62
 */
export const MAP_EDITOR_SEPARATOR_WIDTH_PIXELS = 16;

/**
 * Port of upstream `MAP_SHIFT_X`.
 * Role: Defines the left pixel coordinate where the editable map area begins.
 * Upstream: map_editor.cpp:63
 */
export const MAP_EDITOR_MAP_SHIFT_X_PIXELS =
  MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS + MAP_EDITOR_SEPARATOR_WIDTH_PIXELS;

/**
 * Port of upstream `MINIMAP_X`.
 * Role: Defines the fixed left pixel coordinate of the map editor minimap.
 * Upstream: map_editor.cpp:64
 */
export const MAP_EDITOR_MINIMAP_X_PIXELS = 5;

/**
 * Port of upstream `MINIMAP_Y`.
 * Role: Defines the fixed top pixel coordinate of the map editor minimap.
 * Upstream: map_editor.cpp:65
 */
export const MAP_EDITOR_MINIMAP_Y_PIXELS = 400;

/**
 * Port of upstream `within_minimap`.
 * Role: Reports whether a point is inside the map editor minimap hit area.
 * Upstream: map_editor.cpp:958-961
 */
export function isWithinMapEditorMiniMap(x: number, y: number): boolean {
  return (
    x > MAP_EDITOR_MINIMAP_X_PIXELS &&
    x < MAP_EDITOR_MINIMAP_X_PIXELS + MINIMAP_MAX_WIDTH_PIXELS &&
    y > MAP_EDITOR_MINIMAP_Y_PIXELS &&
    y < MAP_EDITOR_MINIMAP_Y_PIXELS + MINIMAP_MAX_HEIGHT_PIXELS
  );
}

/**
 * Replacement for upstream `blit_message` output.
 * Role: Describes a map editor text draw that can be rendered by the browser UI layer.
 * Upstream: map_editor.cpp:1726-1745
 */
export type MapEditorMessageBlit = {
  message: string;
  x: number;
  y: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
};

export type MapEditorInfoClearRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: SurfacePixelColor;
};

export type MapEditorInfoHoverObject = {
  getObjectId(): { objectType: number; objectId: number };
  getObjectName(): string;
  getLevel(): number;
};

export type MapEditorInfoState = {
  screenHeight: number;
  changesMade: boolean;
  currentMode: MapEditorMode;
  currentPaletteTileCount: number;
  currentObject: number;
  currentTeam: TeamType;
  currentHealthPercent: number;
  currentBuildingLevel: number;
  currentExtraLinks: number;
  hoverObject: MapEditorInfoHoverObject | null;
};

export type MapEditorInfoDraw = {
  clearRect: MapEditorInfoClearRect | null;
  messages: MapEditorMessageBlit[];
};

export type MapEditorRulerLine = SurfaceFillRectRegion & {
  color: SurfacePixelColor;
};

export type MapEditorRulerDraw = {
  lines: MapEditorRulerLine[];
  messages: MapEditorMessageBlit[];
};

const mapEditorModeNames = [
  "place_tile",
  "place_building",
  "place_cannon",
  "place_vehicle",
  "place_robot",
  "place_item",
  "place_zone",
  "remove_zone",
  "remove_object",
];

const vehicleTypeNames = [
  "jeep",
  "light",
  "medium",
  "heavy",
  "apc",
  "missile_launcher",
  "crane",
];

const cannonTypeNames = ["gatling", "gun", "howitzer", "missile_cannon"];
const robotTypeNames = ["grunt", "psycho", "sniper", "tough", "pyro", "laser"];
const itemTypeNames = ["flag", "rock", "grenades", "rockets", "hut", "map_object0"];
const buildingTypeNames = [
  "fort_front",
  "fort_back",
  "radar",
  "repair",
  "robot_factory",
  "vehicle_factory",
  "bridge_vert",
  "bridge_horz",
];

const teamTypeNames = [
  "null",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "teal",
  "white",
  "black",
];

/**
 * Replacement for upstream `blit_message`.
 * Role: Adapts SDL/TTF text rendering into a browser-renderable map editor text draw.
 * Upstream: map_editor.cpp:1726-1745
 */
export function blitMapEditorMessage(
  message: string,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  hasFont = true,
): MapEditorMessageBlit | null {
  if (!hasFont) {
    return null;
  }

  return {
    message,
    x,
    y,
    color: { r, g, b },
  };
}

/**
 * Replacement for upstream `draw_info`.
 * Role: Builds map editor information panel draw commands for the browser renderer.
 * Upstream: map_editor.cpp:2305-2397
 */
export function drawMapEditorInfo(
  state: MapEditorInfoState,
  flip: boolean,
): MapEditorInfoDraw {
  void flip;

  const messages: MapEditorMessageBlit[] = [];
  const x = 10 + MINIMAP_MAX_WIDTH_PIXELS;
  let yOffset = 0;
  const white = { r: 255, g: 255, b: 255 };

  if (state.changesMade) {
    messages.push({
      message: "-------------------------- Changes Made! Press S to save!! --------------------------",
      x: 5,
      y: 390 + yOffset,
      color: { r: 255, g: 0, b: 0 },
    });
  }

  yOffset += 10;
  messages.push({
    message: `Current Mode: ${lookupName(mapEditorModeNames, state.currentMode)}`,
    x,
    y: 390 + yOffset,
    color: white,
  });

  yOffset += 10;
  messages.push({
    message: getCurrentObjectMessage(state),
    x,
    y: 390 + yOffset,
    color: white,
  });

  yOffset += 10;
  messages.push({
    message: `Current Team: ${lookupName(teamTypeNames, state.currentTeam)}`,
    x,
    y: 390 + yOffset,
    color: white,
  });

  if (modeHasHealthPercent(state.currentMode)) {
    yOffset += 10;
    messages.push({
      message: `Current Health Percent: ${state.currentHealthPercent}`,
      x,
      y: 390 + yOffset,
      color: white,
    });
  }

  if (state.currentMode === MapEditorMode.PlaceBuilding) {
    yOffset += 10;
    messages.push({
      message: `Current Building Level: ${state.currentBuildingLevel + 1}`,
      x,
      y: 390 + yOffset,
      color: white,
    });

    yOffset += 10;
    messages.push({
      message: `Current Bridge Extra Links: ${state.currentExtraLinks}`,
      x,
      y: 390 + yOffset,
      color: white,
    });
  }

  yOffset += 20;
  if (state.hoverObject) {
    const { objectType } = state.hoverObject.getObjectId();
    const objectName = state.hoverObject.getObjectName();
    const hoverMessage =
      objectType === MapObjectType.Building
        ? `Hover Object: ${objectName} L${state.hoverObject.getLevel() + 1}`
        : `Hover Object: ${objectName}`;

    messages.push({
      message: hoverMessage,
      x,
      y: 390 + yOffset,
      color: white,
    });
  }

  return {
    clearRect:
      state.screenHeight > 384
        ? {
            x: 0,
            y: 384,
            width: 320,
            height: state.screenHeight - 384,
            color: { red: 0, green: 0, blue: 0, alpha: 255 },
          }
        : null,
    messages,
  };
}

/**
 * Replacement for upstream `draw_map_ruler`.
 * Role: Builds map editor ruler tick, guide-line, and label draw commands.
 * Upstream: map_editor.cpp:1775-1886
 */
export function drawMapEditorRuler(state: {
  terrainType: PlanetType;
  screenWidth: number;
  screenHeight: number;
  shiftX: number;
  shiftY: number;
  viewWidth: number;
  viewHeight: number;
  rulerMode: MapRulerMode;
}): MapEditorRulerDraw {
  if (state.screenWidth < MAP_EDITOR_MAP_SHIFT_X_PIXELS) {
    return { lines: [], messages: [] };
  }

  const color =
    state.terrainType === PlanetType.Arctic
      ? { red: 255, green: 0, blue: 0, alpha: 255 }
      : { red: 255, green: 255, blue: 255, alpha: 255 };
  const messageColor =
    state.terrainType === PlanetType.Arctic
      ? { r: 255, g: 0, b: 0 }
      : { r: 255, g: 255, b: 255 };
  const lines: MapEditorRulerLine[] = [];
  const messages: MapEditorMessageBlit[] = [];

  const offsetX = (-state.shiftX % 16) + 16;
  let tileX = Math.trunc(state.shiftX / 16) + 1;

  for (let x = offsetX; x < state.viewWidth; x += 16, tileX += 1) {
    const screenX = x + MAP_EDITOR_MAP_SHIFT_X_PIXELS;
    lines.push({ x: screenX, y: 0, width: 1, height: 4, color });

    if (tileX % 5 === 0) {
      messages.push({
        message: `${tileX}`,
        x: screenX + 2,
        y: 6,
        color: messageColor,
      });

      if (state.rulerMode === MapRulerMode.Full) {
        lines.push({
          x: screenX,
          y: 0,
          width: 1,
          height: state.screenHeight,
          color,
        });
      }
    }

    lines.push({
      x: screenX,
      y: state.screenHeight - 4,
      width: 1,
      height: 4,
      color,
    });
  }

  const offsetY = (-state.shiftY % 16) + 16;
  let tileY = Math.trunc(state.shiftY / 16) + 1;

  for (let y = offsetY; y < state.viewHeight; y += 16, tileY += 1) {
    lines.push({
      x: MAP_EDITOR_MAP_SHIFT_X_PIXELS,
      y,
      width: 4,
      height: 1,
      color,
    });

    if (tileY % 5 === 0) {
      messages.push({
        message: `${tileY}`,
        x: MAP_EDITOR_MAP_SHIFT_X_PIXELS + 6,
        y,
        color: messageColor,
      });

      if (state.rulerMode === MapRulerMode.Full) {
        lines.push({
          x: MAP_EDITOR_MAP_SHIFT_X_PIXELS,
          y,
          width: state.screenWidth - MAP_EDITOR_MAP_SHIFT_X_PIXELS,
          height: 1,
          color,
        });
      }
    }

    lines.push({
      x: state.screenWidth - 4,
      y,
      width: 4,
      height: 1,
      color,
    });
  }

  return { lines, messages };
}

function getCurrentObjectMessage(state: MapEditorInfoState): string {
  switch (state.currentMode) {
    case MapEditorMode.PlaceTile:
      return `Current Object: Palette Tile of ${state.currentPaletteTileCount}`;
    case MapEditorMode.PlaceVehicle:
      return `Current Vehicle: ${lookupName(vehicleTypeNames, state.currentObject, VehicleType.Max)}`;
    case MapEditorMode.PlaceCannon:
      return `Current Cannon: ${lookupName(cannonTypeNames, state.currentObject, CannonType.Max)}`;
    case MapEditorMode.PlaceRobot:
      return `Current Robot: ${lookupName(robotTypeNames, state.currentObject, RobotType.Max)}`;
    case MapEditorMode.PlaceItem:
      return `Current Item: ${lookupName(itemTypeNames, state.currentObject, ItemType.Max)}`;
    case MapEditorMode.PlaceBuilding:
      return `Current Building: ${lookupName(buildingTypeNames, state.currentObject, BuildingType.Max)}`;
    default:
      return "Current Object: ";
  }
}

function modeHasHealthPercent(mode: MapEditorMode): boolean {
  return (
    mode === MapEditorMode.PlaceBuilding ||
    mode === MapEditorMode.PlaceCannon ||
    mode === MapEditorMode.PlaceVehicle ||
    mode === MapEditorMode.PlaceRobot ||
    mode === MapEditorMode.PlaceItem
  );
}

function lookupName(names: readonly string[], index: number, max = names.length): string {
  if (index >= 0 && index < names.length && index < max) {
    return names[index];
  }

  return "";
}

/**
 * Replacement for upstream `draw_selection_box` output.
 * Role: Describes one map editor selection marker pixel for browser rendering.
 * Upstream: map_editor.cpp:2399-2437
 */
export type MapEditorSelectionPixel = {
  x: number;
  y: number;
  color: SurfacePixelColor;
};

export type MapEditorZoneBoxLine = SurfaceFillRectRegion & {
  color: SurfacePixelColor;
};

const MAP_EDITOR_OBJECT_SELECTION_COLOR: SurfacePixelColor = {
  red: 255,
  green: 0,
  blue: 0,
  alpha: 255,
};

const MAP_EDITOR_PALETTE_SELECTION_COLOR: SurfacePixelColor = {
  red: 0,
  green: 255,
  blue: 255,
  alpha: 255,
};

const MAP_EDITOR_ZONE_COLOR: SurfacePixelColor = {
  red: 250,
  green: 0,
  blue: 0,
  alpha: 255,
};

/**
 * Replacement for upstream `draw_zones`.
 * Role: Builds zone outline fill commands for browser rendering.
 * Upstream: map_editor.cpp:2279-2303
 */
export function drawMapEditorZones(
  zones: readonly Pick<MapZoneInfo, "x" | "y">[],
  viewShift: { x: number; y: number },
  screenWidth: number,
  screenHeight: number,
): MapEditorZoneBoxLine[] {
  const lines: MapEditorZoneBoxLine[] = [];
  const maxX = MAP_EDITOR_MAP_SHIFT_X_PIXELS + screenWidth;
  const maxY = screenHeight;

  for (const zone of zones) {
    const x = MAP_EDITOR_MAP_SHIFT_X_PIXELS + zone.x - viewShift.x;
    const y = zone.y - viewShift.y;

    if (x < MAP_EDITOR_MAP_SHIFT_X_PIXELS) {
      continue;
    }
    if (x >= maxX || y >= maxY) {
      continue;
    }

    lines.push(
      { x, y, width: 16, height: 1, color: MAP_EDITOR_ZONE_COLOR },
      { x, y: y + 16, width: 16, height: 1, color: MAP_EDITOR_ZONE_COLOR },
      { x, y, width: 1, height: 16, color: MAP_EDITOR_ZONE_COLOR },
      { x: x + 16, y, width: 1, height: 16, color: MAP_EDITOR_ZONE_COLOR },
    );
  }

  return lines;
}

/**
 * Replacement for upstream `draw_selection_box(int x, int y, int w, int h)`.
 * Role: Adapts map editor object selection-box pixel writes into renderable pixel commands.
 * Upstream: map_editor.cpp:2399-2416
 */
export function drawMapEditorSelectionBox(
  x: number,
  y: number,
  width: number,
  height: number,
): MapEditorSelectionPixel[] {
  const pixels: MapEditorSelectionPixel[] = [];

  for (let i = 0; i < width; i += 1) {
    if (x + i >= MAP_EDITOR_MAP_SHIFT_X_PIXELS) {
      pixels.push({ x: x + i, y, color: MAP_EDITOR_OBJECT_SELECTION_COLOR });
      pixels.push({
        x: x + i,
        y: y + (height - 1),
        color: MAP_EDITOR_OBJECT_SELECTION_COLOR,
      });
    }
  }

  for (let i = 0; i < height; i += 1) {
    if (x >= MAP_EDITOR_MAP_SHIFT_X_PIXELS) {
      pixels.push({ x, y: y + i, color: MAP_EDITOR_OBJECT_SELECTION_COLOR });
    }
  }

  for (let i = 0; i < height; i += 1) {
    pixels.push({
      x: x + (width - 1),
      y: y + i,
      color: MAP_EDITOR_OBJECT_SELECTION_COLOR,
    });
  }

  return pixels;
}

/**
 * Replacement for upstream `draw_selection_box(int tile)`.
 * Role: Adapts map editor palette-tile selection-box pixel writes into renderable pixel commands.
 * Upstream: map_editor.cpp:2418-2437
 */
export function drawMapEditorPaletteTileSelectionBox(
  tile: number,
  getPaletteTile: (tile: number) => { x: number; y: number },
): MapEditorSelectionPixel[] {
  if (tile === -1) {
    return [];
  }

  const { x, y } = getPaletteTile(tile);
  const pixels: MapEditorSelectionPixel[] = [];

  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x: x + i, y, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }
  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x, y: y + i, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }
  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x: x + 15, y: y + i, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }
  for (let i = 0; i < 16; i += 1) {
    pixels.push({ x: x + i, y: y + 15, color: MAP_EDITOR_PALETTE_SELECTION_COLOR });
  }

  return pixels;
}

/**
 * Port of upstream `draw_seperator`.
 * Role: Preserves the map editor separator rendering hook, which currently only presents the SDL screen when requested.
 * Upstream: map_editor.cpp:1769-1773
 */
export function drawMapEditorSeparator(
  flip: boolean,
  presentScreen: () => void = () => undefined,
): void {
  if (flip) {
    presentScreen();
  }
}
