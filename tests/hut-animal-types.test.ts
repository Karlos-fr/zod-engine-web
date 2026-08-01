import { describe, expect, it } from "vitest";
import {
  AHUTANIMAL_HEADER_GUARD_PORTED,
  HUT_ANIMAL_STATE_COUNT,
  HUT_ANIMAL_TYPE_COUNT,
  chooseRandomHutAnimal,
  createHutAnimalGraphics,
  loadHutAnimalGraphics,
  type HutAnimalGraphics,
  type HutAnimalGoHomeState,
  type HutAnimalHomeCoordsState,
  type HutAnimalHomeState,
  type HutAnimalRoamDistanceState,
  type HutAnimalStateNothingState,
  HutAnimalState,
  HutAnimalType,
  isHutAnimalGoingHome,
  isHutAnimalTileTooFar,
  isPreferredHutAnimalDirection,
  sendHutAnimalHome,
  setHutAnimalHomeCoords,
  setHutAnimalStateNothing,
} from "../src/simulation/entities/HutAnimalTypes";
import { PlanetType } from "../src/simulation/SimulationConstants";

describe("hut animal types", () => {
  it("ports the ahutanimal.h header guard as module traceability", async () => {
    const firstImport = await import(
      "../src/simulation/entities/HutAnimalTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/HutAnimalTypes"
    );

    expect(AHUTANIMAL_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.AHUTANIMAL_HEADER_GUARD_PORTED).toBe(
      firstImport.AHUTANIMAL_HEADER_GUARD_PORTED,
    );
  });

  it("ports hut_animal_type with upstream enum ordinals", () => {
    expect(HutAnimalType.GreenSnake).toBe(0);
    expect(HutAnimalType.GreenLizard).toBe(1);
    expect(HutAnimalType.DesertRabbit).toBe(2);
    expect(HutAnimalType.Raptor).toBe(3);
    expect(HutAnimalType.MiniRaptor).toBe(4);
    expect(HutAnimalType.PigDino).toBe(5);
    expect(HutAnimalType.YellowWorm).toBe(6);
    expect(HutAnimalType.ArcticRabbit).toBe(7);
    expect(HutAnimalType.Penguin).toBe(8);
    expect(HutAnimalType.WhiteWolf).toBe(9);
    expect(HutAnimalType.Ostrich).toBe(10);
    expect(HutAnimalType.Rat).toBe(11);
    expect(HutAnimalType.Turtle).toBe(12);
    expect(HutAnimalType.RedWorm).toBe(13);
    expect(HutAnimalType.GreenEyedFox).toBe(14);
  });

  it("ports MAX_HUT_ANIMAL_TYPES as the hut animal type count", () => {
    expect(HUT_ANIMAL_TYPE_COUNT).toBe(15);
  });

  it("ports hut_animal_state with upstream enum ordinals", () => {
    expect(HutAnimalState.Nothing).toBe(0);
    expect(HutAnimalState.Walking).toBe(1);
    expect(HutAnimalState.Looking).toBe(2);
  });

  it("ports MAX_HA_STATES as the hut animal state count", () => {
    expect(HUT_ANIMAL_STATE_COUNT).toBe(3);
  });

  it("ports hut_animal_graphics construction as empty animation graphics", () => {
    expect(createHutAnimalGraphics()).toEqual({
      walk: [],
      look: [],
      deadUp: null,
      deadDown: null,
      walkFrameCount: 0,
      lookFrameCount: 0,
      walkToZero: false,
    });
  });

  it("ports hut_animal_graphics LoadGraphics as green snake walking frames", () => {
    const loaded: string[] = [];
    const graphics: HutAnimalGraphics<string> = {
      walk: [],
      look: [],
      deadUp: null,
      deadDown: null,
      walkFrameCount: 0,
      lookFrameCount: 0,
      walkToZero: true,
    };

    loadHutAnimalGraphics(graphics, HutAnimalType.GreenSnake, (filename) => {
      loaded.push(filename);
      return filename;
    });

    expect(graphics.walkFrameCount).toBe(8);
    expect(graphics.lookFrameCount).toBe(0);
    expect(graphics.walkToZero).toBe(false);
    expect(graphics.deadDown).toBe(
      "assets/other/hut_animals/green_snake_dead_down.png",
    );
    expect(graphics.deadUp).toBe(
      "assets/other/hut_animals/green_snake_dead_up.png",
    );
    expect(graphics.walk[7][7]).toBe(
      "assets/other/hut_animals/green_snake_walk_r315_n07.png",
    );
    expect(graphics.look).toEqual([[], [], [], [], [], [], [], []]);
    expect(loaded).toHaveLength(2 + 8 * 8);
  });

  it("ports hut_animal_graphics LoadGraphics look frames and walk-to-zero species", () => {
    const loaded: string[] = [];
    const graphics: HutAnimalGraphics<string> = {
      walk: [],
      look: [],
      deadUp: null,
      deadDown: null,
      walkFrameCount: 0,
      lookFrameCount: 0,
      walkToZero: false,
    };

    loadHutAnimalGraphics(graphics, HutAnimalType.DesertRabbit, (filename) => {
      loaded.push(filename);
      return filename;
    });

    expect(graphics.walkFrameCount).toBe(4);
    expect(graphics.lookFrameCount).toBe(4);
    expect(graphics.walkToZero).toBe(true);
    expect(graphics.deadDown).toBe(
      "assets/other/hut_animals/desert_rabit_dead_down.png",
    );
    expect(graphics.walk[1][3]).toBe(
      "assets/other/hut_animals/desert_rabit_walk_r045_n03.png",
    );
    expect(graphics.look[0][0]).toBe(
      "assets/other/hut_animals/desert_rabit_look_r000_n00.png",
    );
    expect(graphics.look[1][0]).toBe(graphics.look[0][0]);
    expect(graphics.look[6][3]).toBe(
      "assets/other/hut_animals/desert_rabit_look_r270_n03.png",
    );
    expect(graphics.look[7][3]).toBe(graphics.look[6][3]);
    expect(loaded).toHaveLength(2 + 8 * 4 + 4 * 4);
  });

  it("ports IsGoingHome as a hut animal home-state accessor", () => {
    const goingHome: HutAnimalHomeState = { goingHome: true };
    const wandering: HutAnimalHomeState = { goingHome: false };

    expect(isHutAnimalGoingHome(goingHome)).toBe(true);
    expect(isHutAnimalGoingHome(wandering)).toBe(false);
  });

  it("ports SetHomeCoords as a hut animal home-coordinate replacement", () => {
    const state: HutAnimalHomeCoordsState = { homeX: 4, homeY: 8 };

    const nextState = setHutAnimalHomeCoords(state, 12, 16);

    expect(nextState).toEqual({ homeX: 12, homeY: 16 });
    expect(state).toEqual({ homeX: 4, homeY: 8 });
  });

  it("ports AHutAnimal SetStateNothing as idle state and delay scheduling", () => {
    const state: HutAnimalStateNothingState = {
      hutAnimalState: HutAnimalState.Walking,
      nextNothingTime: 0,
      hutAnimalType: HutAnimalType.GreenSnake,
      walkIndex: 5,
      graphics: [{ walkToZero: true }],
    };

    setHutAnimalStateNothing(state, 20, () => 4);

    expect(state).toEqual({
      hutAnimalState: HutAnimalState.Nothing,
      nextNothingTime: 20.5,
      hutAnimalType: HutAnimalType.GreenSnake,
      walkIndex: 0,
      graphics: [{ walkToZero: true }],
    });

    state.hutAnimalState = HutAnimalState.Walking;
    state.walkIndex = 6;
    state.graphics[0] = { walkToZero: false };

    setHutAnimalStateNothing(state, 30, () => 0);

    expect(state.hutAnimalState).toBe(HutAnimalState.Nothing);
    expect(state.nextNothingTime).toBe(30.1);
    expect(state.walkIndex).toBe(6);
  });

  it("ports AHutAnimal IsPrefferedDirection bad direction offsets", () => {
    expect(isPreferredHutAnimalDirection(-1, 0)).toBe(false);
    expect(isPreferredHutAnimalDirection(0, -1)).toBe(false);

    expect(isPreferredHutAnimalDirection(0, 3)).toBe(false);
    expect(isPreferredHutAnimalDirection(0, 4)).toBe(false);
    expect(isPreferredHutAnimalDirection(2, 7)).toBe(false);

    expect(isPreferredHutAnimalDirection(1, 1)).toBe(true);
    expect(isPreferredHutAnimalDirection(1, 2)).toBe(true);
    expect(isPreferredHutAnimalDirection(1, 3)).toBe(true);
    expect(isPreferredHutAnimalDirection(0, 6)).toBe(true);
    expect(isPreferredHutAnimalDirection(0, 7)).toBe(true);
  });

  it("ports AHutAnimal ChooseRandomAnimal guard exits", () => {
    const animalsInPalette = [
      [HutAnimalType.GreenSnake],
      [],
      [HutAnimalType.Penguin],
    ];

    expect(chooseRandomHutAnimal(-1, animalsInPalette)).toBe(0);
    expect(chooseRandomHutAnimal(PlanetType.Max, animalsInPalette)).toBe(0);
    expect(chooseRandomHutAnimal(PlanetType.Volcanic, animalsInPalette)).toBe(0);
  });

  it("ports AHutAnimal ChooseRandomAnimal as palette-table random selection", () => {
    const animalsInPalette = [
      [],
      [],
      [HutAnimalType.ArcticRabbit, HutAnimalType.Penguin, HutAnimalType.WhiteWolf],
    ];

    expect(
      chooseRandomHutAnimal(PlanetType.Arctic, animalsInPalette, () => 1),
    ).toBe(HutAnimalType.Penguin);
    expect(
      chooseRandomHutAnimal(PlanetType.Arctic, animalsInPalette, () => 5),
    ).toBe(HutAnimalType.WhiteWolf);
  });

  it("ports AHutAnimal GoHome as return flag and home-tile targeting", () => {
    const state: HutAnimalGoHomeState = {
      goingHome: false,
      homeX: 47,
      homeY: 64,
    };
    const calls: Array<[number, number]> = [];

    sendHutAnimalHome(state, (tileX, tileY) => calls.push([tileX, tileY]));

    expect(state.goingHome).toBe(true);
    expect(calls).toEqual([[2, 4]]);
  });

  it("ports AHutAnimal TileIsTooFar using the tile center and roam distance", () => {
    const state: HutAnimalRoamDistanceState = {
      homeX: 8,
      homeY: 8,
      hutAnimalRoamDistance: 16,
    };

    expect(isHutAnimalTileTooFar(state, 0, 0)).toBe(false);
    expect(isHutAnimalTileTooFar(state, 1, 0)).toBe(false);

    state.hutAnimalRoamDistance = 15;

    expect(isHutAnimalTileTooFar(state, 1, 0)).toBe(true);
  });
});
