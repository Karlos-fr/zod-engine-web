import { describe, expect, it } from "vitest";
import { PlanetType, TeamType } from "../src/simulation/SimulationConstants";
import {
  changeHutPalette,
  getHutExitToTile,
  type HutMaxAnimalsState,
  hutCausesImpassAtCoord,
  initHutPlanetTemplates,
  isHutDestroyableImpassable,
  OHUT_HEADER_GUARD_PORTED,
  renderHutObject,
  sendHutAnimalsHome,
  setHutMapImpassables,
  setMaxHutAnimals,
  setHutOwner,
  unsetHutMapImpassables,
} from "../src/simulation/HutObject";

describe("hut object", () => {
  it("adapts the ohut.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/HutObject");
    const secondImport = await import("../src/simulation/HutObject");

    expect(OHUT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OHUT_HEADER_GUARD_PORTED).toBe(
      firstImport.OHUT_HEADER_GUARD_PORTED,
    );
  });

  it("ports IsDestroyableImpass as a destroyable hut impassable marker", () => {
    expect(isHutDestroyableImpassable()).toBe(true);
  });

  it("ports OHut Init as one hut image per planet palette", () => {
    const loadedFilenames = Array.from({ length: PlanetType.Max }, () => "");
    const templates = loadedFilenames.map((_, index) => ({
      loadBaseImage(filename: string) {
        loadedFilenames[index] = filename;
      },
    }));

    initHutPlanetTemplates(templates);

    expect(loadedFilenames).toEqual([
      "assets/other/map_items/hut_desert.png",
      "assets/other/map_items/hut_volcanic.png",
      "assets/other/map_items/hut_arctic.png",
      "assets/other/map_items/hut_jungle.png",
      "assets/other/map_items/hut_city.png",
    ]);
  });

  it("replaces OHut DoRender with a palette-selected shifted clipped blit command", () => {
    const baseSurface = { width: 32, height: 24 };
    const renderImages = [
      undefined,
      {
        id: "volcanic-hut",
        getBaseSurface: () => baseSurface,
      },
    ];
    const calls: unknown[] = [];

    const command = renderHutObject(
      {
        palette: PlanetType.Volcanic,
        x: 96,
        y: 128,
        renderImages,
      },
      {
        getBlitInfo: (surface, x, y) => {
          calls.push({ surface, x, y });
          return {
            sourceX: 4,
            sourceY: 5,
            width: 20,
            height: 18,
            destinationX: 70,
            destinationY: 90,
          };
        },
      },
      -6,
      9,
    );

    expect(command).toEqual({
      renderImage: renderImages[1],
      region: {
        sourceX: 4,
        sourceY: 5,
        width: 20,
        height: 18,
        destinationX: 64,
        destinationY: 99,
      },
    });
    expect(calls).toEqual([{ surface: baseSurface, x: 96, y: 128 }]);
  });

  it("replaces OHut DoRender as no command without image or visible blit", () => {
    expect(
      renderHutObject(
        {
          palette: PlanetType.Desert,
          x: 0,
          y: 0,
          renderImages: [],
        },
        {
          getBlitInfo: () => {
            throw new Error("getBlitInfo should not be called");
          },
        },
        0,
        0,
      ),
    ).toBeNull();
    expect(
      renderHutObject(
        {
          palette: PlanetType.Desert,
          x: 0,
          y: 0,
          renderImages: [
            {
              getBaseSurface: () => null,
            },
          ],
        },
        {
          getBlitInfo: () => null,
        },
        0,
        0,
      ),
    ).toBeNull();
  });

  it("ports OHut ChangePalette as palette assignment", () => {
    const state = { palette: PlanetType.Desert };

    changeHutPalette(state, PlanetType.Jungle);

    expect(state.palette).toBe(PlanetType.Jungle);
  });

  it("ports OHut CausesImpassAtCoord as coordinate equality", () => {
    const state = { x: 64, y: 80 };

    expect(hutCausesImpassAtCoord(state, 64, 80)).toBe(true);
    expect(hutCausesImpassAtCoord(state, 63, 80)).toBe(false);
    expect(hutCausesImpassAtCoord(state, 64, 81)).toBe(false);
  });

  it("ports OHut SetMapImpassables as tile impassable marking", () => {
    const calls: Array<[number, number, boolean, boolean]> = [];

    setHutMapImpassables(
      { x: 47, y: 65 },
      {
        setImpassable(tileX, tileY, impassable, destroyable) {
          calls.push([tileX, tileY, impassable, destroyable]);
        },
      },
    );

    expect(calls).toEqual([[2, 4, true, true]]);
  });

  it("ports OHut UnSetMapImpassables as tile impassable clearing", () => {
    const calls: Array<[number, number, boolean, boolean]> = [];

    unsetHutMapImpassables(
      { x: 35, y: 50 },
      {
        setImpassable(tileX, tileY, impassable, destroyable) {
          calls.push([tileX, tileY, impassable, destroyable]);
        },
      },
    );

    expect(calls).toEqual([[2, 3, false, true]]);
  });

  it("ports OHut GetExitToTile as default lower tile without a map", () => {
    expect(getHutExitToTile({ x: 48, y: 64 }, null)).toEqual({
      success: true,
      x: 3,
      y: 5,
    });
  });

  it("ports OHut GetExitToTile as default lower tile when passable", () => {
    const checks: Array<[number, number, boolean]> = [];

    expect(
      getHutExitToTile(
        { x: 48, y: 64 },
        {
          getPathFinder: () => ({
            tilePassable(tileX, tileY, includeOccupants) {
              checks.push([tileX, tileY, includeOccupants]);
              return true;
            },
          }),
        },
      ),
    ).toEqual({
      success: true,
      x: 3,
      y: 5,
    });
    expect(checks).toEqual([[3, 5, false]]);
  });

  it("ports OHut GetExitToTile as random passable adjacent fallback", () => {
    const passable = new Set(["2,3", "4,4"]);
    const checks: Array<[number, number, boolean]> = [];

    const result = getHutExitToTile(
      { x: 48, y: 64 },
      {
        getPathFinder: () => ({
          tilePassable(tileX, tileY, includeOccupants) {
            checks.push([tileX, tileY, includeOccupants]);
            return passable.has(`${tileX},${tileY}`);
          },
        }),
      },
      () => 1,
    );

    expect(result).toEqual({
      success: true,
      x: 4,
      y: 4,
    });
    expect(checks).toEqual([
      [3, 5, false],
      [2, 3, false],
      [2, 4, false],
      [2, 5, false],
      [3, 3, false],
      [3, 5, false],
      [4, 3, false],
      [4, 4, false],
      [4, 5, false],
    ]);
  });

  it("ports OHut GetExitToTile as failure when every adjacent tile is blocked", () => {
    expect(
      getHutExitToTile(
        { x: 48, y: 64 },
        {
          getPathFinder: () => ({
            tilePassable: () => false,
          }),
        },
      ),
    ).toEqual({
      success: false,
      x: 3,
      y: 5,
    });
  });

  it("ports OHut SetMaxHutAnimals as min plus bounded random offset", () => {
    const state: HutMaxAnimalsState = {
      hutAnimalMin: 2,
      hutAnimalMax: 6,
      maxHutAnimals: 0,
    };
    const requestedMaxes: number[] = [];

    setMaxHutAnimals(state, (maxExclusive) => {
      requestedMaxes.push(maxExclusive);
      return 3;
    });

    expect(state.maxHutAnimals).toBe(5);
    expect(requestedMaxes).toEqual([4]);
  });

  it("ports OHut SetMaxHutAnimals as min-only when the range is empty", () => {
    const state: HutMaxAnimalsState = {
      hutAnimalMin: 4,
      hutAnimalMax: 4,
      maxHutAnimals: 0,
    };
    let randomCalled = false;

    setMaxHutAnimals(state, () => {
      randomCalled = true;
      return 1;
    });

    expect(state.maxHutAnimals).toBe(4);
    expect(randomCalled).toBe(false);

    state.hutAnimalMax = 2;
    state.maxHutAnimals = 0;

    setMaxHutAnimals(state, () => {
      randomCalled = true;
      return 1;
    });

    expect(state.maxHutAnimals).toBe(4);
    expect(randomCalled).toBe(false);
  });

  it("ports OHut SendAnimalsHome as sending only missing animals home", () => {
    const calls: string[] = [];
    const animalStates = [true, false, false, false];
    const animals = animalStates.map((goingHome, index) => ({
      isGoingHome: () => animalStates[index],
      goHome() {
        calls.push(`animal-${index}`);
        animalStates[index] = true;
      },
    }));

    sendHutAnimalsHome({ hutAnimals: animals }, 3);

    expect(calls).toEqual(["animal-1", "animal-2"]);
    expect(animalStates).toEqual([true, true, true, false]);
  });

  it("ports OHut SendAnimalsHome as no-op when enough animals are already returning", () => {
    const calls: string[] = [];
    const animals = [
      {
        isGoingHome: () => true,
        goHome: () => calls.push("first"),
      },
      {
        isGoingHome: () => true,
        goHome: () => calls.push("second"),
      },
      {
        isGoingHome: () => false,
        goHome: () => calls.push("third"),
      },
    ];

    sendHutAnimalsHome({ hutAnimals: animals }, 2);
    sendHutAnimalsHome({ hutAnimals: animals }, 0);

    expect(calls).toEqual([]);
  });

  it("ports OHut SendAnimalsHome as stopping when the animal list is exhausted", () => {
    const calls: string[] = [];
    const animals = [
      {
        isGoingHome: () => false,
        goHome: () => calls.push("first"),
      },
      {
        isGoingHome: () => false,
        goHome: () => calls.push("second"),
      },
    ];

    sendHutAnimalsHome({ hutAnimals: animals }, 5);

    expect(calls).toEqual(["first", "second"]);
  });

  it("ports OHut SetOwner as an ownership no-op", () => {
    expect(setHutOwner(TeamType.Red)).toBeUndefined();
  });
});
