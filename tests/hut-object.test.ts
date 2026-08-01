import { describe, expect, it } from "vitest";
import { PlanetType, TeamType } from "../src/simulation/SimulationConstants";
import {
  changeHutPalette,
  type HutMaxAnimalsState,
  hutCausesImpassAtCoord,
  initHutPlanetTemplates,
  isHutDestroyableImpassable,
  OHUT_HEADER_GUARD_PORTED,
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
