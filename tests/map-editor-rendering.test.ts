import { describe, expect, it, vi } from "vitest";
import {
  MAP_EDITOR_MINIMAP_X_PIXELS,
  MAP_EDITOR_MINIMAP_Y_PIXELS,
  MAP_EDITOR_MAP_SHIFT_X_PIXELS,
  MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS,
  MAP_EDITOR_SEPARATOR_WIDTH_PIXELS,
  blitMapEditorMessage,
  drawMapEditorInfo,
  drawMapEditorPaletteTileSelectionBox,
  drawMapEditorRuler,
  drawMapEditorSeparator,
  drawMapEditorSelectionBox,
  drawMapEditorZones,
  isWithinMapEditorMiniMap,
} from "../src/world/MapEditorRendering";
import { MapEditorMode, MapRulerMode } from "../src/world/WorldConstants";
import { MapObjectType } from "../src/world/MapFormat";
import {
  BuildingType,
  PlanetType,
  TeamType,
} from "../src/simulation/SimulationConstants";

describe("map editor rendering", () => {
  it("adapts SEP_SHIFT_X as a named pixel offset", () => {
    expect(MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS).toBe(320);
  });

  it("adapts SEP_WIDTH as a named pixel width", () => {
    expect(MAP_EDITOR_SEPARATOR_WIDTH_PIXELS).toBe(16);
  });

  it("adapts MAP_SHIFT_X as the editable map start coordinate", () => {
    expect(MAP_EDITOR_MAP_SHIFT_X_PIXELS).toBe(336);
  });

  it("adapts MINIMAP_X as a named pixel coordinate", () => {
    expect(MAP_EDITOR_MINIMAP_X_PIXELS).toBe(5);
  });

  it("adapts MINIMAP_Y as a named pixel coordinate", () => {
    expect(MAP_EDITOR_MINIMAP_Y_PIXELS).toBe(400);
  });

  it("ports within_minimap as an exclusive minimap hit test", () => {
    expect(isWithinMapEditorMiniMap(6, 401)).toBe(true);
    expect(isWithinMapEditorMiniMap(96, 488)).toBe(true);
    expect(isWithinMapEditorMiniMap(5, 401)).toBe(false);
    expect(isWithinMapEditorMiniMap(97, 401)).toBe(false);
    expect(isWithinMapEditorMiniMap(6, 400)).toBe(false);
    expect(isWithinMapEditorMiniMap(6, 489)).toBe(false);
  });

  it("replaces blit_message with a browser text draw command", () => {
    expect(blitMapEditorMessage("ready", 10, 20, 30, 40, 50)).toEqual({
      message: "ready",
      x: 10,
      y: 20,
      color: { r: 30, g: 40, b: 50 },
    });
  });

  it("replaces blit_message font-missing return with a null draw command", () => {
    expect(blitMapEditorMessage("ready", 10, 20, 30, 40, 50, false)).toBeNull();
  });

  it("replaces draw_info with building editor panel draw commands", () => {
    const draw = drawMapEditorInfo(
      {
        screenHeight: 500,
        changesMade: true,
        currentMode: MapEditorMode.PlaceBuilding,
        currentPaletteTileCount: 12,
        currentObject: BuildingType.RobotFactory,
        currentTeam: TeamType.Blue,
        currentHealthPercent: 85,
        currentBuildingLevel: 2,
        currentExtraLinks: 4,
        hoverObject: {
          getObjectId: () => ({
            objectType: MapObjectType.Building,
            objectId: BuildingType.Radar,
          }),
          getObjectName: () => "radar",
          getLevel: () => 1,
        },
      },
      true,
    );

    expect(draw.clearRect).toEqual({
      x: 0,
      y: 384,
      width: 320,
      height: 116,
      color: { red: 0, green: 0, blue: 0, alpha: 255 },
    });
    expect(draw.messages.map((message) => message.message)).toEqual([
      "-------------------------- Changes Made! Press S to save!! --------------------------",
      "Current Mode: place_building",
      "Current Building: robot_factory",
      "Current Team: blue",
      "Current Health Percent: 85",
      "Current Building Level: 3",
      "Current Bridge Extra Links: 4",
      "Hover Object: radar L2",
    ]);
    expect(draw.messages[1]).toMatchObject({
      x: 102,
      y: 400,
      color: { r: 255, g: 255, b: 255 },
    });
  });

  it("replaces draw_info without clear rect or health lines for tile mode", () => {
    const draw = drawMapEditorInfo(
      {
        screenHeight: 384,
        changesMade: false,
        currentMode: MapEditorMode.PlaceTile,
        currentPaletteTileCount: 27,
        currentObject: 0,
        currentTeam: TeamType.Red,
        currentHealthPercent: 100,
        currentBuildingLevel: 0,
        currentExtraLinks: 0,
        hoverObject: null,
      },
      false,
    );

    expect(draw.clearRect).toBeNull();
    expect(draw.messages.map((message) => message.message)).toEqual([
      "Current Mode: place_tile",
      "Current Object: Palette Tile of 27",
      "Current Team: red",
    ]);
  });

  it("replaces draw_info hover text without level for non-building objects", () => {
    const draw = drawMapEditorInfo(
      {
        screenHeight: 500,
        changesMade: false,
        currentMode: MapEditorMode.PlaceRobot,
        currentPaletteTileCount: 0,
        currentObject: 3,
        currentTeam: TeamType.Green,
        currentHealthPercent: 75,
        currentBuildingLevel: 0,
        currentExtraLinks: 0,
        hoverObject: {
          getObjectId: () => ({ objectType: MapObjectType.Robot, objectId: 3 }),
          getObjectName: () => "tough",
          getLevel: () => 0,
        },
      },
      false,
    );

    expect(draw.messages.map((message) => message.message)).toEqual([
      "Current Mode: place_robot",
      "Current Robot: tough",
      "Current Team: green",
      "Current Health Percent: 75",
      "Hover Object: tough",
    ]);
  });

  it("replaces draw_zones with shifted red zone outline commands", () => {
    expect(
      drawMapEditorZones(
        [
          { x: 30, y: 40 },
          { x: 1, y: 12 },
        ],
        { x: 10, y: 5 },
        800,
        600,
      ),
    ).toEqual([
      {
        x: 356,
        y: 35,
        width: 16,
        height: 1,
        color: { red: 250, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 356,
        y: 51,
        width: 16,
        height: 1,
        color: { red: 250, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 356,
        y: 35,
        width: 1,
        height: 16,
        color: { red: 250, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 372,
        y: 35,
        width: 1,
        height: 16,
        color: { red: 250, green: 0, blue: 0, alpha: 255 },
      },
    ]);
  });

  it("replaces draw_zones clipping at the editable map and screen bounds", () => {
    expect(
      drawMapEditorZones(
        [
          { x: 5, y: 20 },
          { x: 900, y: 20 },
          { x: 30, y: 700 },
        ],
        { x: 10, y: 0 },
        200,
        600,
      ),
    ).toEqual([]);
  });

  it("replaces draw_map_ruler with simple tick and label commands", () => {
    const draw = drawMapEditorRuler({
      terrainType: PlanetType.Desert,
      screenWidth: 400,
      screenHeight: 100,
      shiftX: 0,
      shiftY: 0,
      viewWidth: 90,
      viewHeight: 90,
      rulerMode: MapRulerMode.Simple,
    });

    expect(draw.messages).toEqual([
      {
        message: "5",
        x: MAP_EDITOR_MAP_SHIFT_X_PIXELS + 80 + 2,
        y: 6,
        color: { r: 255, g: 255, b: 255 },
      },
      {
        message: "5",
        x: MAP_EDITOR_MAP_SHIFT_X_PIXELS + 6,
        y: 80,
        color: { r: 255, g: 255, b: 255 },
      },
    ]);
    expect(draw.lines).toContainEqual({
      x: MAP_EDITOR_MAP_SHIFT_X_PIXELS + 16,
      y: 0,
      width: 1,
      height: 4,
      color: { red: 255, green: 255, blue: 255, alpha: 255 },
    });
    expect(draw.lines).toContainEqual({
      x: 396,
      y: 80,
      width: 4,
      height: 1,
      color: { red: 255, green: 255, blue: 255, alpha: 255 },
    });
  });

  it("replaces draw_map_ruler full mode with guide lines every five tiles", () => {
    const draw = drawMapEditorRuler({
      terrainType: PlanetType.Desert,
      screenWidth: 400,
      screenHeight: 100,
      shiftX: 0,
      shiftY: 0,
      viewWidth: 90,
      viewHeight: 90,
      rulerMode: MapRulerMode.Full,
    });

    expect(draw.lines).toContainEqual({
      x: MAP_EDITOR_MAP_SHIFT_X_PIXELS + 80,
      y: 0,
      width: 1,
      height: 100,
      color: { red: 255, green: 255, blue: 255, alpha: 255 },
    });
    expect(draw.lines).toContainEqual({
      x: MAP_EDITOR_MAP_SHIFT_X_PIXELS,
      y: 80,
      width: 400 - MAP_EDITOR_MAP_SHIFT_X_PIXELS,
      height: 1,
      color: { red: 255, green: 255, blue: 255, alpha: 255 },
    });
  });

  it("replaces draw_map_ruler with red arctic ruler commands", () => {
    const draw = drawMapEditorRuler({
      terrainType: PlanetType.Arctic,
      screenWidth: 400,
      screenHeight: 100,
      shiftX: 0,
      shiftY: 0,
      viewWidth: 20,
      viewHeight: 20,
      rulerMode: MapRulerMode.Simple,
    });

    expect(draw.lines[0]?.color).toEqual({
      red: 255,
      green: 0,
      blue: 0,
      alpha: 255,
    });
  });

  it("replaces draw_map_ruler with no commands before the editable map area", () => {
    expect(
      drawMapEditorRuler({
        terrainType: PlanetType.Desert,
        screenWidth: MAP_EDITOR_MAP_SHIFT_X_PIXELS - 1,
        screenHeight: 100,
        shiftX: 0,
        shiftY: 0,
        viewWidth: 90,
        viewHeight: 90,
        rulerMode: MapRulerMode.Full,
      }),
    ).toEqual({ lines: [], messages: [] });
  });

  it("replaces draw_selection_box geometry with clipped red pixel commands", () => {
    expect(drawMapEditorSelectionBox(334, 10, 4, 3)).toEqual([
      {
        x: 336,
        y: 10,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 336,
        y: 12,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 10,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 12,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 10,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 11,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
      {
        x: 337,
        y: 12,
        color: { red: 255, green: 0, blue: 0, alpha: 255 },
      },
    ]);
  });

  it("replaces draw_selection_box tile overload with cyan palette pixel commands", () => {
    const getPaletteTile = vi.fn(() => ({ x: 20, y: 30 }));
    const pixels = drawMapEditorPaletteTileSelectionBox(7, getPaletteTile);

    expect(getPaletteTile).toHaveBeenCalledWith(7);
    expect(pixels).toHaveLength(64);
    expect(pixels[0]).toEqual({
      x: 20,
      y: 30,
      color: { red: 0, green: 255, blue: 255, alpha: 255 },
    });
    expect(pixels[63]).toEqual({
      x: 35,
      y: 45,
      color: { red: 0, green: 255, blue: 255, alpha: 255 },
    });
  });

  it("replaces draw_selection_box tile overload no-selection return", () => {
    const getPaletteTile = vi.fn(() => ({ x: 20, y: 30 }));

    expect(drawMapEditorPaletteTileSelectionBox(-1, getPaletteTile)).toEqual([]);
    expect(getPaletteTile).not.toHaveBeenCalled();
  });

  it("ports draw_seperator as a screen present when flip is requested", () => {
    const presentScreen = vi.fn();

    drawMapEditorSeparator(true, presentScreen);

    expect(presentScreen).toHaveBeenCalledOnce();
  });

  it("ports draw_seperator as a no-op when flip is not requested", () => {
    const presentScreen = vi.fn();

    drawMapEditorSeparator(false, presentScreen);

    expect(presentScreen).not.toHaveBeenCalled();
  });
});
