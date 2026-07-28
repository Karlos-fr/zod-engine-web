/**
 * Upstream: ahutanimal.h
 */

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
