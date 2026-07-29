import { describe, expect, it } from "vitest";
import {
  AHUTANIMAL_HEADER_GUARD_PORTED,
  HUT_ANIMAL_STATE_COUNT,
  HUT_ANIMAL_TYPE_COUNT,
  chooseRandomHutAnimal,
  type HutAnimalGoHomeState,
  type HutAnimalHomeCoordsState,
  type HutAnimalHomeState,
  type HutAnimalRoamDistanceState,
  type HutAnimalStateNothingState,
  HutAnimalState,
  HutAnimalType,
  isHutAnimalGoingHome,
  isHutAnimalTileTooFar,
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
