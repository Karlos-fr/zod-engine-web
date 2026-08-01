/**
 * Upstream: ahutanimal.h
 */

import { pointsWithinDistance } from "../Common";
import { MAX_ANGLE_TYPES, PlanetType } from "../SimulationConstants";

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

export type HutAnimalInitState<TImage = unknown> = {
  graphics: HutAnimalGraphics<TImage>[];
  animalsInPalette: number[][];
  finishedInit: boolean;
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

const HUT_ANIMAL_TYPE_ASSET_NAMES: Record<HutAnimalType, string> = {
  [HutAnimalType.GreenSnake]: "green_snake",
  [HutAnimalType.GreenLizard]: "green_lizard",
  [HutAnimalType.DesertRabbit]: "desert_rabit",
  [HutAnimalType.Raptor]: "raptor",
  [HutAnimalType.MiniRaptor]: "mini_raptor",
  [HutAnimalType.PigDino]: "pig_dino",
  [HutAnimalType.YellowWorm]: "yellow_worm",
  [HutAnimalType.ArcticRabbit]: "arctic_rabit",
  [HutAnimalType.Penguin]: "penguin",
  [HutAnimalType.WhiteWolf]: "white_wolf",
  [HutAnimalType.Ostrich]: "ostrich",
  [HutAnimalType.Rat]: "rat",
  [HutAnimalType.Turtle]: "turtle",
  [HutAnimalType.RedWorm]: "red_worm",
  [HutAnimalType.GreenEyedFox]: "green_eyed_fox",
};

const HUT_ANIMAL_ROTATION_DEGREES = [
  0, 45, 90, 135, 180, 225, 270, 315,
] as const;

/**
 * Port of upstream `hut_animal_graphics`.
 * Role: Holds hut animal animation frames and per-species frame counters.
 * Upstream: ahutanimal.h:29-41
 */
export type HutAnimalGraphics<TImage = unknown> = {
  walk: TImage[][];
  look: TImage[][];
  deadUp: TImage | null;
  deadDown: TImage | null;
  walkFrameCount: number;
  lookFrameCount: number;
  walkToZero: boolean;
};

/**
 * Port of upstream `hut_animal_graphics` construction.
 * Role: Creates empty hut animal graphics with zero frame counts.
 * Upstream: ahutanimal.h:31
 */
export function createHutAnimalGraphics<TImage = unknown>(): HutAnimalGraphics<TImage> {
  return {
    walk: [],
    look: [],
    deadUp: null,
    deadDown: null,
    walkFrameCount: 0,
    lookFrameCount: 0,
    walkToZero: false,
  };
}

/**
 * Replacement for upstream `ZSDL_Surface::LoadBaseImage`.
 * Role: Loads one hut animal animation frame asset.
 * Upstream: ahutanimal.cpp:40, ahutanimal.cpp:49, ahutanimal.cpp:57
 */
export type HutAnimalImageLoader<TImage> = (filename: string) => TImage;

/**
 * Port of upstream `hut_animal_graphics::LoadGraphics`.
 * Role: Loads hut animal dead, walking, and looking images for one species.
 * Upstream: ahutanimal.cpp:3-62
 */
export function loadHutAnimalGraphics<TImage>(
  graphics: HutAnimalGraphics<TImage>,
  hutAnimalType: HutAnimalType,
  loadImage: HutAnimalImageLoader<TImage>,
): void {
  graphics.walkFrameCount =
    hutAnimalType === HutAnimalType.GreenSnake ? 8 : 4;

  switch (hutAnimalType) {
    case HutAnimalType.GreenSnake:
    case HutAnimalType.YellowWorm:
    case HutAnimalType.RedWorm:
      graphics.lookFrameCount = 0;
      break;
    default:
      graphics.lookFrameCount = 4;
      break;
  }

  switch (hutAnimalType) {
    case HutAnimalType.DesertRabbit:
    case HutAnimalType.PigDino:
    case HutAnimalType.ArcticRabbit:
      graphics.walkToZero = true;
      break;
    default:
      graphics.walkToZero = false;
      break;
  }

  const assetName = HUT_ANIMAL_TYPE_ASSET_NAMES[hutAnimalType];

  graphics.deadDown = loadImage(
    `assets/other/hut_animals/${assetName}_dead_down.png`,
  );
  graphics.deadUp = loadImage(
    `assets/other/hut_animals/${assetName}_dead_up.png`,
  );

  graphics.walk = Array.from({ length: MAX_ANGLE_TYPES }, (_rotation, r) =>
    Array.from({ length: graphics.walkFrameCount }, (_frame, i) =>
      loadImage(
        `assets/other/hut_animals/${assetName}_walk_r${(
          HUT_ANIMAL_ROTATION_DEGREES[r] ?? 0
        )
          .toString()
          .padStart(3, "0")}_n${i.toString().padStart(2, "0")}.png`,
      ),
    ),
  );

  graphics.look = Array.from({ length: MAX_ANGLE_TYPES }, () => []);
  for (let r = 0; r < MAX_ANGLE_TYPES; r += 2) {
    for (let i = 0; i < graphics.lookFrameCount; i += 1) {
      const image = loadImage(
        `assets/other/hut_animals/${assetName}_look_r${(
          HUT_ANIMAL_ROTATION_DEGREES[r] ?? 0
        )
          .toString()
          .padStart(3, "0")}_n${i.toString().padStart(2, "0")}.png`,
      );
      graphics.look[r][i] = image;

      if (r + 1 < MAX_ANGLE_TYPES) {
        graphics.look[r + 1][i] = image;
      }
    }
  }
}

/**
 * Port of upstream `AHutAnimal::Init`.
 * Role: Loads hut animal graphics and populates palette-specific animal spawn tables.
 * Upstream: ahutanimal.cpp:96-125
 */
export function initHutAnimalTypes<TImage>(
  state: HutAnimalInitState<TImage>,
  loadImage: HutAnimalImageLoader<TImage>,
): void {
  for (let type = 0; type < HUT_ANIMAL_TYPE_COUNT; type += 1) {
    if (!state.graphics[type]) {
      state.graphics[type] = createHutAnimalGraphics<TImage>();
    }

    loadHutAnimalGraphics(state.graphics[type], type, loadImage);
  }

  state.animalsInPalette[PlanetType.Desert] = [
    HutAnimalType.GreenSnake,
    HutAnimalType.GreenLizard,
    HutAnimalType.DesertRabbit,
  ];
  state.animalsInPalette[PlanetType.Volcanic] = [
    HutAnimalType.Raptor,
    HutAnimalType.MiniRaptor,
    HutAnimalType.PigDino,
    HutAnimalType.YellowWorm,
  ];
  state.animalsInPalette[PlanetType.Arctic] = [
    HutAnimalType.ArcticRabbit,
    HutAnimalType.Penguin,
    HutAnimalType.WhiteWolf,
  ];
  state.animalsInPalette[PlanetType.Jungle] = [
    HutAnimalType.Ostrich,
    HutAnimalType.Rat,
    HutAnimalType.Turtle,
  ];
  state.animalsInPalette[PlanetType.City] = [
    HutAnimalType.RedWorm,
    HutAnimalType.Rat,
    HutAnimalType.GreenEyedFox,
  ];

  state.finishedInit = true;
}

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
 * Port of upstream `AHutAnimal::IsPrefferedDirection`.
 * Role: Rejects unset directions and direction changes with upstream's bad turn offsets.
 * Upstream: ahutanimal.cpp:151-174
 */
export function isPreferredHutAnimalDirection(
  currentDirection: number,
  newDirection: number,
): boolean {
  if (currentDirection === -1) return false;
  if (newDirection === -1) return false;

  const difference = Math.abs(currentDirection - newDirection);

  return difference < 3 || difference > 5;
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
