/**
 * Ported from Zod Engine.
 * Upstream: ahutanimal.h
 * Symbols: see entity comments
 */

/**
 * Port of upstream `_AHUTANIMAL_H_`.
 * Role: Marks upstream `ahutanimal.h` as compile-time only.
 * Ledger: MAC-C5E798
 * Upstream: ahutanimal.h:2
 */
export const AHUTANIMAL_HEADER_GUARD_PORTED = true;

/**
 * Minimal state consumed by ported `AHutAnimal` home-navigation accessors.
 * Role: Stores whether the hut animal is currently returning to its home tile.
 * Ledger: FUN-7A56DE
 * Upstream: ahutanimal.h:58, ahutanimal.h:80
 */
export type HutAnimalHomeState = {
  goingHome: boolean;
};

/**
 * Minimal state consumed by ported `AHutAnimal` home-coordinate mutators.
 * Role: Stores the hut tile coordinates that an animal treats as home.
 * Ledger: FUN-8B87D4
 * Upstream: ahutanimal.h:57, ahutanimal.h:78-79
 */
export type HutAnimalHomeCoordsState = {
  homeX: number;
  homeY: number;
};

/**
 * Port of upstream `hut_animal_type`.
 * Role: Identifies the ambient animal species that can be spawned around hut objects.
 * Ledger: ENU-E7E2B3
 * Upstream: ahutanimal.h:6-13
 * Adaptation: Uses PascalCase member names while preserving the C++ numeric order. * - Corrects upstream spelling in `DESERT_RABIT` and `ARCTIC_RABIT` to `DesertRabbit` and `ArcticRabbit`. - The upstream `MAX_HUT_ANIMAL_TYPES` sentinel is exposed as `HUT_ANIMAL_TYPE_COUNT` instead of an actionable animal type.
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
 * Ledger: ENU-E7E2B3
 * Upstream: ahutanimal.h:12
 */
export const HUT_ANIMAL_TYPE_COUNT = 15;

/**
 * Port of upstream `hut_animal_state`.
 * Role: Represents the behavior state used by hut animals while idling, walking, or looking around.
 * Ledger: ENU-3BDCE3
 * Upstream: ahutanimal.h:23-26
 * Adaptation: Uses a PascalCase TypeScript enum while preserving the C++ numeric order. * - The upstream `MAX_HA_STATES` sentinel is exposed as `HUT_ANIMAL_STATE_COUNT` instead of an actionable state.
 */
export enum HutAnimalState {
  Nothing = 0,
  Walking = 1,
  Looking = 2,
}

/**
 * Port of upstream `MAX_HA_STATES`.
 * Role: Defines the number of concrete hut animal states in the upstream enum.
 * Ledger: ENU-3BDCE3
 * Upstream: ahutanimal.h:25
 */
export const HUT_ANIMAL_STATE_COUNT = 3;

/**
 * Port of upstream `IsGoingHome`.
 * Role: Reports whether a hut animal is currently returning to its home tile.
 * Ledger: FUN-7A56DE
 * Upstream: ahutanimal.h:58
 */
export function isHutAnimalGoingHome(state: HutAnimalHomeState): boolean {
  return state.goingHome;
}

/**
 * Port of upstream `SetHomeCoords`.
 * Role: Replaces the hut animal home tile coordinates.
 * Ledger: FUN-8B87D4
 * Upstream: ahutanimal.h:57
 * Adaptation: Returns updated state instead of mutating `AHutAnimal::home_x` and `AHutAnimal::home_y`.
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
