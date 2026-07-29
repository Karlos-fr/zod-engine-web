/**
 * Upstream: ahutanimal.h
 */

import { pointsWithinDistance } from "../Common";
import { PlanetType } from "../SimulationConstants";

/**
 * Port of upstream `_AHUTANIMAL_H_`.
 * Role: Marks an upstream compile-time boundary.
 * Upstream: ahutanimal.h:2
 */
export const AHUTANIMAL_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `AHutAnimal` home-navigation accessors.
 * Role: Stores whether the hut animal is currently returning to its home tile.
 * Upstream: ahutanimal.h:58, ahutanimal.h:80
 */
export type HutAnimalHomeState = {
  goingHome: boolean;
};

/**
 * Minimal state consumed by ported `AHutAnimal` home-coordinate mutators.
 * Role: Stores the hut tile coordinates that an animal treats as home.
 * Upstream: ahutanimal.h:57, ahutanimal.h:78-79
 */
export type HutAnimalHomeCoordsState = {
  homeX: number;
  homeY: number;
};

/**
 * Minimal state consumed by ported `AHutAnimal::SetStateNothing`.
 * Role: Stores idle timing, current animation state, species type, and walk frame.
 * Upstream: ahutanimal.h:48-56, ahutanimal.h:68-70
 */
export type HutAnimalStateNothingState = {
  hutAnimalState: HutAnimalState;
  nextNothingTime: number;
  hutAnimalType: HutAnimalType | number;
  walkIndex: number;
  graphics: Array<{ walkToZero: boolean }>;
};

/**
 * Minimal state consumed by ported `AHutAnimal::TileIsTooFar`.
 * Role: Stores the home position and configured roam distance used to validate target tiles.
 * Upstream: ahutanimal.h:57, ahutanimal.cpp:176-184
 */
export type HutAnimalRoamDistanceState = {
  homeX: number;
  homeY: number;
  hutAnimalRoamDistance: number;
};

/**
 * Minimal state consumed by ported `AHutAnimal::GoHome`.
 * Role: Stores home pixel coordinates and the active return-home flag.
 * Upstream: ahutanimal.h:57-58, ahutanimal.cpp:188-190
 */
export type HutAnimalGoHomeState = {
  goingHome: boolean;
  homeX: number;
  homeY: number;
};

/**
 * Port of upstream `AHutAnimal::animals_in_palette` dependency surface.
 * Role: Stores which hut animal species may spawn for each planet palette.
 * Upstream: ahutanimal.h:66
 */
export type HutAnimalsInPalette = readonly (readonly number[])[];

/**
 * Port of upstream `hut_animal_type`.
 * Role: Identifies the ambient animal species that can be spawned around hut objects.
 * Upstream: ahutanimal.h:6-13
 */
export enum HutAnimalType {
  GreenSnake = 0,
  GreenLizard = 1,
  DesertRabbit = 2,
  Raptor = 3,
  MiniRaptor = 4,
  PigDino = 5,
  YellowWorm = 6,
  ArcticRabbit = 7,
  Penguin = 8,
  WhiteWolf = 9,
  Ostrich = 10,
  Rat = 11,
  Turtle = 12,
  RedWorm = 13,
  GreenEyedFox = 14,
}

/**
 * Port of upstream `MAX_HUT_ANIMAL_TYPES`.
 * Role: Defines the number of concrete hut animal species in the upstream enum.
 * Upstream: ahutanimal.h:12
 */
export const HUT_ANIMAL_TYPE_COUNT = 15;

/**
 * Port of upstream `hut_animal_state`.
 * Role: Represents the behavior state for hut animals while idling, walking, or looking around.
 * Upstream: ahutanimal.h:23-26
 */
export enum HutAnimalState {
  Nothing = 0,
  Walking = 1,
  Looking = 2,
}

/**
 * Port of upstream `MAX_HA_STATES`.
 * Role: Defines the number of concrete hut animal states in the upstream enum.
 * Upstream: ahutanimal.h:25
 */
export const HUT_ANIMAL_STATE_COUNT = 3;

/**
 * Port of upstream `IsGoingHome`.
 * Role: Reports whether a hut animal is currently returning to its home tile.
 * Upstream: ahutanimal.h:58
 */
export function isHutAnimalGoingHome(state: HutAnimalHomeState): boolean {
  return state.goingHome;
}

/**
 * Port of upstream `SetHomeCoords`.
 * Role: Replaces the hut animal home tile coordinates.
 * Upstream: ahutanimal.h:57
 */
export function setHutAnimalHomeCoords<
  TState extends HutAnimalHomeCoordsState,
>(state: TState, homeX: number, homeY: number): TState {
  return {
    ...state,
    homeX,
    homeY,
  };
}

/**
 * Port of upstream `AHutAnimal::SetStateNothing`.
 * Role: Switches a hut animal to idle state and schedules its next idle action.
 * Upstream: ahutanimal.cpp:141-149
 */
export function setHutAnimalStateNothing(
  state: HutAnimalStateNothingState,
  now: number,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  state.hutAnimalState = HutAnimalState.Nothing;
  state.nextNothingTime = now + 0.1 + randomInt(10) * 0.1;

  if (state.graphics[state.hutAnimalType]?.walkToZero) {
    state.walkIndex = 0;
  }
}

/**
 * Port of upstream `AHutAnimal::ChooseRandomAnimal`.
 * Role: Selects a hut animal species from the palette-specific spawn table.
 * Upstream: ahutanimal.cpp:127-139
 */
export function chooseRandomHutAnimal(
  palette: number,
  animalsInPalette: HutAnimalsInPalette,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): number {
  if (palette < 0) return 0;
  if (palette >= PlanetType.Max) return 0;

  const paletteAnimals = animalsInPalette[palette];
  if (!paletteAnimals?.length) return 0;

  return paletteAnimals[randomInt(paletteAnimals.length) % paletteAnimals.length];
}

/**
 * Port of upstream `AHutAnimal::GoHome`.
 * Role: Marks the hut animal as returning home and targets its home tile.
 * Upstream: ahutanimal.cpp:186-191
 */
export function sendHutAnimalHome(
  state: HutAnimalGoHomeState,
  gotoTile: (tileX: number, tileY: number) => void,
): void {
  state.goingHome = true;
  gotoTile(state.homeX >> 4, state.homeY >> 4);
}

/**
 * Port of upstream `AHutAnimal::TileIsTooFar`.
 * Role: Reports whether a tile center is outside the hut animal roam radius from home.
 * Upstream: ahutanimal.cpp:176-184
 */
export function isHutAnimalTileTooFar(
  state: HutAnimalRoamDistanceState,
  tileX: number,
  tileY: number,
): boolean {
  const entityX = (tileX << 4) + 8;
  const entityY = (tileY << 4) + 8;

  return !pointsWithinDistance(
    state.homeX,
    state.homeY,
    entityX,
    entityY,
    state.hutAnimalRoamDistance,
  );
}
