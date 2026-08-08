/**
 * Upstream: zvehicle.h
 */

import { GameEntity } from "./GameEntity";
import type { ZSettings } from "../../data/ZSettingsData";
import {
  DeathEffectObject,
  type DeathEffectSpawn,
} from "../DeathEffect";
import {
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
} from "../TurretMissileEffect";
import type { MobileMissileRocketsEffectSpawn } from "../MobileMissileRocketsEffect";
import type { LightRocketEffectSpawn } from "../LightRocketEffect";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  MAX_ANGLE_TYPES,
  MAX_UNIT_HEALTH,
  RobotType,
  TeamType,
  VEHICLE_MOVE_ANIMATION_SPEED,
} from "../SimulationConstants";
import {
  HEAVY_TURRET_FRAME_INTERVAL_SECONDS,
  LIGHT_TURRET_FRAME_INTERVAL_SECONDS,
  MEDIUM_TURRET_FRAME_INTERVAL_SECONDS,
  MISSILE_LAUNCHER_TURRET_FRAME_INTERVAL_SECONDS,
} from "./VehicleTypes";
import { SoundEngineSound } from "../../audio/AudioService";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  type TeamSurfaceFactory,
} from "../TeamRendering";

export type VehicleSharedImage<TSurface> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

export type VehicleSharedImageInitState<TSurface> = {
  lidImages: readonly (readonly VehicleSharedImage<TSurface>[])[];
  tankRobotImages: VehicleSharedImage<TSurface>[][][];
};

export type MissileLauncherVehicleInitState<TSurface> = {
  baseImages: VehicleSharedImage<TSurface>[][][];
  topImages: VehicleSharedImage<TSurface>[][];
  wastedImages: VehicleSharedImage<TSurface>[];
  loadImage(filename: string): TSurface | null;
};

export type ApcVehicleInitState<TSurface> = {
  baseImages: VehicleSharedImage<TSurface>[][][];
  openImages: VehicleSharedImage<TSurface>[][][];
  topImages: VehicleSharedImage<TSurface>[];
  wastedImages: VehicleSharedImage<TSurface>[];
  loadImage(filename: string): TSurface | null;
};

export type LightVehicleInitState<TSurface> = {
  baseImages: VehicleSharedImage<TSurface>[][][];
  damagedBaseImages: VehicleSharedImage<TSurface>[][][];
  topImages: VehicleSharedImage<TSurface>[];
  loadImage(filename: string): TSurface | null;
};

export type HeavyVehicleInitState<TSurface> = {
  baseImages: VehicleSharedImage<TSurface>[][][];
  damagedBaseImages: VehicleSharedImage<TSurface>[][][];
  topImages: VehicleSharedImage<TSurface>[][];
  loadImage(filename: string): TSurface | null;
};

export type MediumVehicleInitState<TSurface> = {
  baseImages: VehicleSharedImage<TSurface>[][][];
  damagedBaseImages: VehicleSharedImage<TSurface>[][][];
  topImages: VehicleSharedImage<TSurface>[];
  topPopImages: VehicleSharedImage<TSurface>[];
  loadImage(filename: string): TSurface | null;
};

export type JeepVehicleInitState<TSurface> = {
  wastedImage: VehicleSharedImage<TSurface>;
  baseImages: VehicleSharedImage<TSurface>[][][];
  underImages: VehicleSharedImage<TSurface>[][];
  turrentImages: VehicleSharedImage<TSurface>[];
  fireImages: VehicleSharedImage<TSurface>[];
};

export type CraneVehicleInitState<TSurface> = {
  baseImages: VehicleSharedImage<TSurface>[][][];
  craneImages: VehicleSharedImage<TSurface>[];
  hookImages: VehicleSharedImage<TSurface>[];
  wastedImages: VehicleSharedImage<TSurface>[];
  loadImage(filename: string): TSurface | null;
};

export type MissileLauncherVehicleProcessState = {
  moving: boolean;
  moveIndex: number;
  nextMoveTime: number;
  nextTurretTime: number;
  turretDirection: number;
  position: { x: number; y: number };
  attackObject: { centerX: number; centerY: number } | null;
  speedOffsetPercentInv(): number;
  directionFromLocation(deltaX: number, deltaY: number): number;
};

export type HeavyVehicleProcessState = MissileLauncherVehicleProcessState & {
  processLid(): void;
};

export type LightVehicleProcessState = MissileLauncherVehicleProcessState & {
  processLid(): void;
};

export type MediumVehicleProcessState = MissileLauncherVehicleProcessState & {
  processLid(): void;
};

const VEHICLE_TANK_LID_FRAME_COUNT = 3;
const VEHICLE_TANK_ROBOT_FRAME_COUNT = 2;
const VEHICLE_ROTATION_DEGREES = [0, 45, 90, 135, 180, 225, 270, 315] as const;
const VEHICLE_INVERTED_ROTATION_DEGREES = [
  180,
  225,
  270,
  315,
  0,
  45,
  90,
  135,
] as const;
const VEHICLE_TEAM_TYPE_ASSET_NAMES = [
  "null",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "teal",
  "white",
  "black",
] as const;

/**
 * Port of upstream `ZVehicle::Init`.
 * Role: Initializes shared vehicle lid and tank-driver robot images.
 * Upstream: zvehicle.cpp:24-49
 */
export function initVehicleSharedImages<TSurface>(
  state: VehicleSharedImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < VEHICLE_TANK_LID_FRAME_COUNT; frame += 1) {
      state.lidImages[rotation]?.[frame]?.loadBaseImage(
        `assets/units/vehicles/tank_lid_r${VEHICLE_ROTATION_DEGREES[rotation]
          .toString()
          .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
      );
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      for (let frame = 0; frame < VEHICLE_TANK_ROBOT_FRAME_COUNT; frame += 1) {
        const baseImage =
          state.tankRobotImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const tankRobotImage = state.tankRobotImages[team]?.[rotation]?.[frame];
        if (!baseImage || !tankRobotImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          tankRobotImage,
          `assets/units/robots/tank_fire_${VEHICLE_TEAM_TYPE_ASSET_NAMES[
            team
          ]}_r${VEHICLE_ROTATION_DEGREES[rotation]
            .toString()
            .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }
  }

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < VEHICLE_TANK_ROBOT_FRAME_COUNT; frame += 1) {
      const redImage = state.tankRobotImages[TeamType.Red]?.[rotation]?.[frame];
      if (redImage) {
        state.tankRobotImages[TeamType.Null][rotation][frame] = redImage;
      }
    }
  }
}

/**
 * Port of upstream `VMissileLauncher::Init`.
 * Role: Initializes mobile-missile base, turret, and wreck images for every team.
 * Upstream: vmissilelauncher.cpp:45-84
 */
export function initMissileLauncherVehicle<TSurface>(
  state: MissileLauncherVehicleInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  const nullBase = state.loadImage(
    "assets/units/vehicles/missile_launcher/empty_null.png",
  );

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < 3; frame += 1) {
      state.baseImages[TeamType.Null]?.[rotation]?.[frame]?.loadBaseImage(
        nullBase,
      );
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      for (let frame = 0; frame < 3; frame += 1) {
        const baseImage =
          state.baseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.baseImages[team]?.[rotation]?.[frame];
        if (!baseImage || !targetImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          targetImage,
          `assets/units/vehicles/missile_launcher/base_${
            VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
          }_r${VEHICLE_ROTATION_DEGREES[rotation]
            .toString()
            .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      const baseImage =
        state.topImages[TEAM_RENDERING_BASE_TEAM]?.[rotation];
      const targetImage = state.topImages[team]?.[rotation];
      if (!baseImage || !targetImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        targetImage,
        `assets/units/vehicles/missile_launcher/top_${
          VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
        }_r${VEHICLE_ROTATION_DEGREES[rotation]
          .toString()
          .padStart(3, "0")}.png`,
        makeTeamSurface,
      );
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const baseImage = state.wastedImages[TEAM_RENDERING_BASE_TEAM];
    const targetImage = state.wastedImages[team];
    if (!baseImage || !targetImage) continue;

    loadTeamZSurface(
      team,
      baseImage,
      targetImage,
      `assets/units/vehicles/missile_launcher/wasted_${
        VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
      }.png`,
      makeTeamSurface,
    );
  }

  const redWasted = state.wastedImages[TeamType.Red]?.getBaseSurface() ?? null;
  state.wastedImages[TeamType.Null]?.loadBaseImage(redWasted);
}

/**
 * Port of upstream `VAPC::Init`.
 * Role: Initializes APC base, open-door, top, and wreck images for every team.
 * Upstream: vapc.cpp:37-83
 */
export function initApcVehicle<TSurface>(
  state: ApcVehicleInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  const emptyBase = state.loadImage("assets/units/vehicles/apc/empty.png");

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < 3; frame += 1) {
      state.baseImages[TeamType.Null]?.[rotation]?.[frame]?.loadBaseImage(
        emptyBase,
      );
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      for (let frame = 0; frame < 3; frame += 1) {
        const baseImage =
          state.baseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.baseImages[team]?.[rotation]?.[frame];
        if (!baseImage || !targetImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          targetImage,
          `assets/units/vehicles/apc/base_${
            VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
          }_r${VEHICLE_ROTATION_DEGREES[rotation]
            .toString()
            .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      for (let frame = 0; frame < 5; frame += 1) {
        const baseImage =
          state.openImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.openImages[team]?.[rotation]?.[frame];
        if (!baseImage || !targetImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          targetImage,
          `assets/units/vehicles/apc/open_${
            VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
          }_r${VEHICLE_ROTATION_DEGREES[rotation]
            .toString()
            .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }
  }

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    state.topImages[rotation]?.loadBaseImage(
      `assets/units/vehicles/apc/top_r${VEHICLE_ROTATION_DEGREES[rotation]
        .toString()
        .padStart(3, "0")}.png`,
    );
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const baseImage = state.wastedImages[TEAM_RENDERING_BASE_TEAM];
    const targetImage = state.wastedImages[team];
    if (!baseImage || !targetImage) continue;

    loadTeamZSurface(
      team,
      baseImage,
      targetImage,
      `assets/units/vehicles/apc/wasted_${VEHICLE_TEAM_TYPE_ASSET_NAMES[team]}.png`,
      makeTeamSurface,
    );
  }

  const redWasted = state.wastedImages[TeamType.Red];
  if (redWasted) state.wastedImages[TeamType.Null] = redWasted;
}

/**
 * Port of upstream `VLight::Init`.
 * Role: Initializes light vehicle base, damaged base, and turret images.
 * Upstream: vlight.cpp:48-96
 */
export function initLightVehicle<TSurface>(
  state: LightVehicleInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  const emptyBase = state.loadImage("assets/units/vehicles/light/empty.png");

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < 3; frame += 1) {
      state.baseImages[TeamType.Null]?.[rotation]?.[frame]?.loadBaseImage(
        emptyBase,
      );
      state.damagedBaseImages[TeamType.Null]?.[rotation]?.[
        frame
      ]?.loadBaseImage(emptyBase);
    }
  }

  const sourceRotations = [0, 1, 2, 7] as const;

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (const rotation of sourceRotations) {
      for (let frame = 0; frame < 3; frame += 1) {
        const baseImage =
          state.baseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.baseImages[team]?.[rotation]?.[frame];
        if (baseImage && targetImage) {
          loadTeamZSurface(
            team,
            baseImage,
            targetImage,
            `assets/units/vehicles/light/base_${
              VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
            }_r${VEHICLE_ROTATION_DEGREES[rotation]
              .toString()
              .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
            makeTeamSurface,
          );
        }

        const mirroredRotation = rotation === 7 ? 3 : rotation + 4;
        const mirroredFrame = 2 - frame;
        const mirroredBase = state.baseImages[team]?.[mirroredRotation]?.[
          mirroredFrame
        ];
        if (targetImage && mirroredBase) {
          mirroredBase.loadBaseImage(targetImage.getBaseSurface());
        }

        const damagedBaseImage =
          state.damagedBaseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[
            frame
          ];
        const damagedTargetImage =
          state.damagedBaseImages[team]?.[rotation]?.[frame];
        if (damagedBaseImage && damagedTargetImage) {
          loadTeamZSurface(
            team,
            damagedBaseImage,
            damagedTargetImage,
            `assets/units/vehicles/light/base_damaged_${
              VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
            }_r${VEHICLE_ROTATION_DEGREES[rotation]
              .toString()
              .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
            makeTeamSurface,
          );
        }

        const mirroredDamagedBase = state.damagedBaseImages[team]?.[
          mirroredRotation
        ]?.[mirroredFrame];
        if (damagedTargetImage && mirroredDamagedBase) {
          mirroredDamagedBase.loadBaseImage(
            damagedTargetImage.getBaseSurface(),
          );
        }
      }
    }
  }

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    state.topImages[rotation]?.loadBaseImage(
      `assets/units/vehicles/light/top_r${VEHICLE_ROTATION_DEGREES[rotation]
        .toString()
        .padStart(3, "0")}.png`,
    );
  }
}

/**
 * Port of upstream `VHeavy::Init`.
 * Role: Initializes heavy vehicle base, damaged base, and team-colored turret images.
 * Upstream: vheavy.cpp:47-97
 */
export function initHeavyVehicle<TSurface>(
  state: HeavyVehicleInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  const emptyBase = state.loadImage("assets/units/vehicles/heavy/empty.png");

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < 3; frame += 1) {
      state.baseImages[TeamType.Null]?.[rotation]?.[frame]?.loadBaseImage(
        emptyBase,
      );
      state.damagedBaseImages[TeamType.Null]?.[rotation]?.[
        frame
      ]?.loadBaseImage(emptyBase);
    }
  }

  const sourceRotations = [0, 1, 2, 7] as const;

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (const rotation of sourceRotations) {
      for (let frame = 0; frame < 3; frame += 1) {
        const baseImage =
          state.baseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.baseImages[team]?.[rotation]?.[frame];
        if (baseImage && targetImage) {
          loadTeamZSurface(
            team,
            baseImage,
            targetImage,
            `assets/units/vehicles/heavy/base_${
              VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
            }_r${VEHICLE_ROTATION_DEGREES[rotation]
              .toString()
              .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
            makeTeamSurface,
          );
        }

        const mirroredRotation = rotation === 7 ? 3 : rotation + 4;
        const mirroredFrame = 2 - frame;
        if (targetImage && state.baseImages[team]?.[mirroredRotation]) {
          state.baseImages[team][mirroredRotation][mirroredFrame] = targetImage;
        }

        const damagedBaseImage =
          state.damagedBaseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[
            frame
          ];
        const damagedTargetImage =
          state.damagedBaseImages[team]?.[rotation]?.[frame];
        if (damagedBaseImage && damagedTargetImage) {
          loadTeamZSurface(
            team,
            damagedBaseImage,
            damagedTargetImage,
            `assets/units/vehicles/heavy/base_damaged_${
              VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
            }_r${VEHICLE_ROTATION_DEGREES[rotation]
              .toString()
              .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
            makeTeamSurface,
          );
        }

        if (
          damagedTargetImage &&
          state.damagedBaseImages[team]?.[mirroredRotation]
        ) {
          state.damagedBaseImages[team][mirroredRotation][mirroredFrame] =
            damagedTargetImage;
        }
      }
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      const baseImage =
        state.topImages[TEAM_RENDERING_BASE_TEAM]?.[rotation];
      const targetImage = state.topImages[team]?.[rotation];
      if (!baseImage || !targetImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        targetImage,
        `assets/units/vehicles/heavy/top_${
          VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
        }_r${VEHICLE_ROTATION_DEGREES[rotation]
          .toString()
          .padStart(3, "0")}.png`,
        makeTeamSurface,
      );
    }
  }
}

/**
 * Port of upstream `VMedium::Init`.
 * Role: Initializes medium vehicle base, damaged base, turret, and pop-up turret images.
 * Upstream: vmedium.cpp:49-103
 */
export function initMediumVehicle<TSurface>(
  state: MediumVehicleInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  const emptyBase = state.loadImage(
    "assets/units/vehicles/medium/empty_null.png",
  );

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < 3; frame += 1) {
      state.baseImages[TeamType.Null]?.[rotation]?.[frame]?.loadBaseImage(
        emptyBase,
      );
      state.damagedBaseImages[TeamType.Null]?.[rotation]?.[
        frame
      ]?.loadBaseImage(emptyBase);
    }
  }

  const sourceRotations = [0, 1, 2, 7] as const;

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (const rotation of sourceRotations) {
      for (let frame = 0; frame < 3; frame += 1) {
        const baseImage =
          state.baseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.baseImages[team]?.[rotation]?.[frame];
        if (baseImage && targetImage) {
          loadTeamZSurface(
            team,
            baseImage,
            targetImage,
            `assets/units/vehicles/medium/base_${
              VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
            }_r${VEHICLE_ROTATION_DEGREES[rotation]
              .toString()
              .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
            makeTeamSurface,
          );
        }

        const mirroredRotation = rotation === 7 ? 3 : rotation + 4;
        const mirroredFrame = 2 - frame;
        const mirroredBase = state.baseImages[team]?.[mirroredRotation]?.[
          mirroredFrame
        ];
        if (targetImage && mirroredBase) {
          mirroredBase.loadBaseImage(targetImage.getBaseSurface());
        }

        const damagedBaseImage =
          state.damagedBaseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[
            frame
          ];
        const damagedTargetImage =
          state.damagedBaseImages[team]?.[rotation]?.[frame];
        if (damagedBaseImage && damagedTargetImage) {
          loadTeamZSurface(
            team,
            damagedBaseImage,
            damagedTargetImage,
            `assets/units/vehicles/medium/base_damaged_${
              VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
            }_r${VEHICLE_ROTATION_DEGREES[rotation]
              .toString()
              .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
            makeTeamSurface,
          );
        }

        const mirroredDamagedBase = state.damagedBaseImages[team]?.[
          mirroredRotation
        ]?.[mirroredFrame];
        if (damagedTargetImage && mirroredDamagedBase) {
          mirroredDamagedBase.loadBaseImage(
            damagedTargetImage.getBaseSurface(),
          );
        }
      }
    }
  }

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    state.topImages[rotation]?.loadBaseImage(
      `assets/units/vehicles/medium/topf_r${VEHICLE_ROTATION_DEGREES[rotation]
        .toString()
        .padStart(3, "0")}.png`,
    );
  }

  for (let frame = 0; frame < 8; frame += 1) {
    state.topPopImages[frame]?.loadBaseImage(
      `assets/units/vehicles/medium/top_pop_n${frame
        .toString()
        .padStart(2, "0")}.png`,
    );
  }
}

/**
 * Port of upstream `VJeep::Init`.
 * Role: Initializes jeep base, undercarriage, turret, fire, and wreck images.
 * Upstream: vjeep.cpp:54-107
 */
export function initJeepVehicle<TSurface>(
  state: JeepVehicleInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  state.wastedImage.loadBaseImage("assets/units/vehicles/jeep/wasted.png");

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    const emptyImage = state.baseImages[TeamType.Null]?.[rotation]?.[1];
    if (!emptyImage) continue;

    emptyImage.loadBaseImage(
      `assets/units/vehicles/jeep/empty_r${VEHICLE_ROTATION_DEGREES[rotation]
        .toString()
        .padStart(3, "0")}.png`,
    );

    state.baseImages[TeamType.Null]?.[rotation]?.[0]?.loadBaseImage(
      emptyImage.getBaseSurface(),
    );
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      for (let frame = 0; frame < 2; frame += 1) {
        const baseImage =
          state.baseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.baseImages[team]?.[rotation]?.[frame];
        if (!baseImage || !targetImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          targetImage,
          `assets/units/vehicles/jeep/base_${
            VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
          }_r${VEHICLE_ROTATION_DEGREES[rotation]
            .toString()
            .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }
  }

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    if (rotation === 2 || rotation === 6) continue;

    for (let frame = 0; frame < 4; frame += 1) {
      state.underImages[rotation]?.[frame]?.loadBaseImage(
        `assets/units/vehicles/jeep/under_r${VEHICLE_ROTATION_DEGREES[rotation]
          .toString()
          .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
      );
    }
  }

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    state.turrentImages[rotation]?.loadBaseImage(
      `assets/units/vehicles/jeep/fire_r${VEHICLE_ROTATION_DEGREES[rotation]
        .toString()
        .padStart(3, "0")}_n00.png`,
    );
    state.fireImages[rotation]?.loadBaseImage(
      `assets/units/vehicles/jeep/fire_r${VEHICLE_ROTATION_DEGREES[rotation]
        .toString()
        .padStart(3, "0")}_n01.png`,
    );
  }
}

/**
 * Port of upstream `VCrane::Init`.
 * Role: Initializes crane vehicle base, boom, hook, and wreck images.
 * Upstream: vcrane.cpp:49-92
 */
export function initCraneVehicle<TSurface>(
  state: CraneVehicleInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  const emptyBase = state.loadImage(
    "assets/units/vehicles/crane/empty_null.png",
  );

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    for (let frame = 0; frame < 3; frame += 1) {
      state.baseImages[TeamType.Null]?.[rotation]?.[frame]?.loadBaseImage(
        emptyBase,
      );
    }
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      for (let frame = 0; frame < 3; frame += 1) {
        const baseImage =
          state.baseImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const targetImage = state.baseImages[team]?.[rotation]?.[frame];
        if (!baseImage || !targetImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          targetImage,
          `assets/units/vehicles/crane/base_${
            VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
          }_r${VEHICLE_ROTATION_DEGREES[rotation]
            .toString()
            .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }
  }

  for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
    state.craneImages[rotation]?.loadBaseImage(
      `assets/units/vehicles/crane/crane_r${VEHICLE_INVERTED_ROTATION_DEGREES[
        rotation
      ]
        .toString()
        .padStart(3, "0")}.png`,
    );
  }

  for (let frame = 0; frame < 8; frame += 1) {
    const hookImage = state.hookImages[frame];
    if (!hookImage) continue;

    hookImage.loadBaseImage(
      `assets/units/vehicles/crane/hook_n${frame
        .toString()
        .padStart(2, "0")}.png`,
    );
    state.hookImages[15 - frame] = hookImage;
  }

  for (let team = 0; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const baseImage = state.wastedImages[TEAM_RENDERING_BASE_TEAM];
    const targetImage = state.wastedImages[team];
    if (!baseImage || !targetImage) continue;

    loadTeamZSurface(
      team,
      baseImage,
      targetImage,
      `assets/units/vehicles/crane/wasted_${
        VEHICLE_TEAM_TYPE_ASSET_NAMES[team]
      }.png`,
      makeTeamSurface,
    );
  }
}

/**
 * Port of upstream `VMissileLauncher::Process`.
 * Role: Advances mobile-missile movement frames and updates turret facing or idle rotation.
 * Upstream: vmissilelauncher.cpp:94-127
 */
export function processMissileLauncherVehicle(
  state: MissileLauncherVehicleProcessState,
  currentTime: number,
): number {
  if (state.moving && currentTime >= state.nextMoveTime) {
    state.moveIndex += 1;
    if (state.moveIndex >= 3) state.moveIndex = 0;

    state.nextMoveTime =
      currentTime + VEHICLE_MOVE_ANIMATION_SPEED * state.speedOffsetPercentInv();
  }

  if (currentTime >= state.nextTurretTime) {
    if (state.attackObject) {
      const newDirection = state.directionFromLocation(
        state.attackObject.centerX - state.position.x,
        state.attackObject.centerY - state.position.y,
      );

      if (newDirection !== -1) state.turretDirection = newDirection;
    } else {
      state.nextTurretTime =
        currentTime + MISSILE_LAUNCHER_TURRET_FRAME_INTERVAL_SECONDS;

      state.turretDirection += 1;
      if (state.turretDirection >= MAX_ANGLE_TYPES) state.turretDirection = 0;
    }
  }

  return 1;
}

/**
 * Port of upstream `VHeavy::Process`.
 * Role: Processes the heavy vehicle lid, movement frames, and turret facing or idle rotation.
 * Upstream: vheavy.cpp:104-138
 */
export function processHeavyVehicle(
  state: HeavyVehicleProcessState,
  currentTime: number,
): number {
  state.processLid();

  if (state.moving && currentTime >= state.nextMoveTime) {
    state.moveIndex -= 1;
    if (state.moveIndex < 0) state.moveIndex = 2;

    state.nextMoveTime =
      currentTime + VEHICLE_MOVE_ANIMATION_SPEED * state.speedOffsetPercentInv();
  }

  if (currentTime >= state.nextTurretTime) {
    if (state.attackObject) {
      const newDirection = state.directionFromLocation(
        state.attackObject.centerX - state.position.x,
        state.attackObject.centerY - state.position.y,
      );

      if (newDirection !== -1) state.turretDirection = newDirection;
    } else {
      state.nextTurretTime = currentTime + HEAVY_TURRET_FRAME_INTERVAL_SECONDS;

      state.turretDirection += 1;
      if (state.turretDirection >= MAX_ANGLE_TYPES) state.turretDirection = 0;
    }
  }

  return 1;
}

/**
 * Port of upstream `VLight::Process`.
 * Role: Processes the light vehicle lid, movement frames, and turret facing or idle rotation.
 * Upstream: vlight.cpp:103-137
 */
export function processLightVehicle(
  state: LightVehicleProcessState,
  currentTime: number,
): number {
  state.processLid();

  if (state.moving && currentTime >= state.nextMoveTime) {
    state.moveIndex -= 1;
    if (state.moveIndex < 0) state.moveIndex = 2;

    state.nextMoveTime =
      currentTime + VEHICLE_MOVE_ANIMATION_SPEED * state.speedOffsetPercentInv();
  }

  if (currentTime >= state.nextTurretTime) {
    if (state.attackObject) {
      const newDirection = state.directionFromLocation(
        state.attackObject.centerX - state.position.x,
        state.attackObject.centerY - state.position.y,
      );

      if (newDirection !== -1) state.turretDirection = newDirection;
    } else {
      state.nextTurretTime = currentTime + LIGHT_TURRET_FRAME_INTERVAL_SECONDS;

      state.turretDirection += 1;
      if (state.turretDirection >= MAX_ANGLE_TYPES) state.turretDirection = 0;
    }
  }

  return 1;
}

/**
 * Port of upstream `VMedium::Process`.
 * Role: Processes the medium vehicle lid, movement frames, and turret facing or idle rotation.
 * Upstream: vmedium.cpp:110-144
 */
export function processMediumVehicle(
  state: MediumVehicleProcessState,
  currentTime: number,
): number {
  state.processLid();

  if (state.moving && currentTime >= state.nextMoveTime) {
    state.moveIndex -= 1;
    if (state.moveIndex < 0) state.moveIndex = 2;

    state.nextMoveTime =
      currentTime + VEHICLE_MOVE_ANIMATION_SPEED * state.speedOffsetPercentInv();
  }

  if (currentTime >= state.nextTurretTime) {
    if (state.attackObject) {
      const newDirection = state.directionFromLocation(
        state.attackObject.centerX - state.position.x,
        state.attackObject.centerY - state.position.y,
      );

      if (newDirection !== -1) state.turretDirection = newDirection;
    } else {
      state.nextTurretTime = currentTime + MEDIUM_TURRET_FRAME_INTERVAL_SECONDS;

      state.turretDirection += 1;
      if (state.turretDirection >= MAX_ANGLE_TYPES) state.turretDirection = 0;
    }
  }

  return 1;
}

/**
 * Browser simulation entity containing the subset of `ZVehicle` behavior already ported.
 * Role: Represents shared vehicle behavior over the base game entity.
 * Upstream: zvehicle.h
 */
export class VehicleEntity extends GameEntity {
  lidOpen = false;
  lidI = 0;
  showRobot = false;
  nextLidTime = 0;
  doCloseLid = false;
  nextCloseLidTime = 0;
  moving = false;
  moveIndex = 0;

  /**
   * Port of upstream `CanSetWaypoints`.
   * Role: Reports whether this vehicle can receive waypoint orders.
   * Upstream: zvehicle.h:21
   */
  canSetWaypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `ZVehicle::ShowDamaged`.
   * Role: Reports whether this vehicle is below the damaged-health threshold.
   * Upstream: zvehicle.cpp:71-74
   */
  override showDamaged(): boolean {
    return 0.4 > this.health / this.maxHealth;
  }

  /**
   * Port of upstream `ZVehicle::ShowPartiallyDamaged`.
   * Role: Reports whether this vehicle is between partial and heavy damage.
   * Upstream: zvehicle.cpp:76-83
   */
  override showPartiallyDamaged(): boolean {
    const healthRatio = this.health / this.maxHealth;

    return healthRatio < 0.7 && healthRatio > 0.4;
  }

  /**
   * Port of upstream `ZVehicle::CanBeRepaired`.
   * Role: Reports whether this vehicle is damaged but not destroyed.
   * Upstream: zvehicle.cpp:170-176
   */
  override canBeRepaired(): boolean {
    if (this.isDestroyed()) return false;
    if (this.health >= this.maxHealth) return false;

    return true;
  }

  /**
   * Port of upstream `ZVehicle::CanBeSniped`.
   * Role: Reports whether this vehicle exposes a driver that can be sniped.
   * Upstream: zvehicle.cpp:178-186
   */
  override canBeSniped(): boolean {
    if (this.hasLidFlag) {
      return this.canBeSnipedFlag && this.lidOpen && this.driverInfo.length > 0;
    }

    return this.canBeSnipedFlag && this.driverInfo.length > 0;
  }

  /**
   * Port of upstream `ZVehicle::SetInitialDrivers`.
   * Role: Initializes vehicle driver state from ownership and grunt health settings.
   * Upstream: zvehicle.cpp:155-168
   */
  override setInitialDrivers(zsettings?: ZSettings): void {
    this.driverType = RobotType.Grunt;

    if (this.owner === TeamType.Null) {
      this.clearDrivers();
      return;
    }

    if (!zsettings) {
      this.clearDrivers();
      return;
    }

    this.addDriver(zsettings.robotSettings[RobotType.Grunt].health * MAX_UNIT_HEALTH);
  }

  /**
   * Port of upstream `ZVehicle::SetAttackObject`.
   * Role: Stores the attack target and faces the vehicle toward the target center.
   * Upstream: zvehicle.cpp:140-153
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) return;

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }

  /**
   * Port of upstream `ZVehicle::RecalcDirection`.
   * Role: Refreshes vehicle movement state and facing direction from current velocity.
   * Upstream: zvehicle.cpp:51-69
   */
  override recalcDirection(): void {
    const newDirection = this.directionFromLocation(
      this.locationDeltaX,
      this.locationDeltaY,
    );

    if (newDirection !== -1) {
      this.moving = true;
      this.direction = newDirection;
      this.moveIndex = 0;
    } else {
      this.moving = false;
    }
  }

  /**
   * Port of upstream `ZVehicle::SetLidState`.
   * Role: Stores whether this vehicle's lid is open.
   * Upstream: zvehicle.cpp:188-191
   */
  override setLidState(lidOpen: boolean): void {
    this.lidOpen = lidOpen;
  }

  /**
   * Port of upstream `ZVehicle::GetLidState`.
   * Role: Reports whether this vehicle's lid is open.
   * Upstream: zvehicle.cpp:193-196
   */
  override getLidState(): boolean {
    return this.lidOpen;
  }

  /**
   * Port of upstream `ZVehicle::SignalLidShouldOpen`.
   * Role: Opens the vehicle lid and marks it for network update when the random gate allows it.
   * Upstream: zvehicle.cpp:198-207
   */
  override signalLidShouldOpen(
    randomModulo5 = Math.floor(Math.random() * 5),
  ): void {
    if (!this.hasLidFlag) return;
    if (randomModulo5 === 0) return;

    this.serverFlags.updatedOpenLid = true;
    this.lidOpen = true;
  }

  /**
   * Port of upstream `ZVehicle::SignalLidShouldClose`.
   * Role: Schedules lid closing after a short random delay when the lid is open.
   * Upstream: zvehicle.cpp:209-220
   */
  override signalLidShouldClose(
    theTime = 0,
    randomModulo15 = Math.floor(Math.random() * 15),
  ): void {
    if (!this.hasLidFlag) return;

    if (this.lidOpen && !this.doCloseLid) {
      this.doCloseLid = true;
      this.nextCloseLidTime = theTime + 0.1 * randomModulo15;
    }
  }

  /**
   * Port of upstream `ZVehicle::ProcessLid`.
   * Role: Advances the vehicle lid animation and robot visibility on its timer.
   * Upstream: zvehicle.cpp:242-266
   */
  processLid(theTime: number): void {
    if (theTime < this.nextLidTime) return;

    this.nextLidTime = theTime + 0.2;

    if (this.lidOpen) {
      if (this.lidI >= 2) {
        this.showRobot = true;
      } else {
        this.lidI += 1;
      }

      return;
    }

    this.showRobot = false;

    if (this.lidI > 0) {
      this.lidI -= 1;
    }
  }
}

/**
 * Replacement for upstream `ZSoundEngine::PlayWavRestricted` arguments.
 * Role: Describes restricted positional audio requested by a vehicle action.
 * Upstream: zsound_engine.cpp:284-293
 */
export type VehicleRestrictedSoundCommand = {
  sound: SoundEngineSound | number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const MISSILE_LAUNCHER_FIRE_OFFSET_X = [20, 12, 0, -12, -20, -12, 0, 12] as const;
const MISSILE_LAUNCHER_FIRE_OFFSET_Y = [0, -12, -20, -12, 0, 12, 20, 12] as const;

/**
 * Port of upstream `VMissileLauncher::FireMissile`.
 * Role: Spawns a mobile-missile rocket and requests its restricted fire sound.
 * Upstream: vmissilelauncher.cpp:192-202
 */
export function fireMissileLauncherMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    turretDirection: number;
    pixelWidth: number;
    pixelHeight: number;
  },
  effectList: MobileMissileRocketsEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
): void {
  const direction = Math.trunc(state.turretDirection) & 7;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX:
        state.position.x + 17 + MISSILE_LAUNCHER_FIRE_OFFSET_X[direction],
      startY:
        state.position.y + 14 + MISSILE_LAUNCHER_FIRE_OFFSET_Y[direction],
      targetX,
      targetY,
    });
  }

  if (soundCommands) {
    soundCommands.push({
      sound: SoundEngineSound.MomissileFireSnd,
      x: state.position.x,
      y: state.position.y,
      width: state.pixelWidth,
      height: state.pixelHeight,
    });
  }
}

/**
 * Port of upstream `VHeavy::FireMissile`.
 * Role: Spawns a heavy vehicle rocket and requests its restricted fire sound.
 * Upstream: vheavy.cpp:213-224
 */
export function fireHeavyVehicleMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    turretDirection: number;
    missileSpeed: number;
    pixelWidth: number;
    pixelHeight: number;
  },
  effectList: LightRocketEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
): void {
  const direction = Math.trunc(state.turretDirection) & 7;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX:
        state.position.x + 17 + MISSILE_LAUNCHER_FIRE_OFFSET_X[direction],
      startY:
        state.position.y + 14 + MISSILE_LAUNCHER_FIRE_OFFSET_Y[direction],
      targetX,
      targetY,
      speed: state.missileSpeed,
      extraSmall: 0,
      extraLarge: 1,
      extraExtraLarge: 1,
    });
  }

  if (soundCommands) {
    soundCommands.push({
      sound: SoundEngineSound.HeavyFireSnd,
      x: state.position.x,
      y: state.position.y,
      width: state.pixelWidth,
      height: state.pixelHeight,
    });
  }
}

/**
 * Port of upstream `VLight::FireMissile`.
 * Role: Spawns a light vehicle rocket and requests its restricted fire sound.
 * Upstream: vlight.cpp:230-241
 */
export function fireLightVehicleMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    turretDirection: number;
    missileSpeed: number;
    pixelWidth: number;
    pixelHeight: number;
  },
  effectList: LightRocketEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
): void {
  const direction = Math.trunc(state.turretDirection) & 7;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX:
        state.position.x + 17 + MISSILE_LAUNCHER_FIRE_OFFSET_X[direction],
      startY:
        state.position.y + 14 + MISSILE_LAUNCHER_FIRE_OFFSET_Y[direction],
      targetX,
      targetY,
      speed: state.missileSpeed,
      extraSmall: 0,
      extraLarge: 0,
      extraExtraLarge: 0,
    });
  }

  if (soundCommands) {
    soundCommands.push({
      sound: SoundEngineSound.LightFireSnd,
      x: state.position.x,
      y: state.position.y,
      width: state.pixelWidth,
      height: state.pixelHeight,
    });
  }
}

/**
 * Port of upstream `VMedium::FireMissile`.
 * Role: Spawns a medium vehicle rocket and requests its restricted fire sound.
 * Upstream: vmedium.cpp:224-235
 */
export function fireMediumVehicleMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    turretDirection: number;
    missileSpeed: number;
    pixelWidth: number;
    pixelHeight: number;
  },
  effectList: LightRocketEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
): void {
  const direction = Math.trunc(state.turretDirection) & 7;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX:
        state.position.x + 17 + MISSILE_LAUNCHER_FIRE_OFFSET_X[direction],
      startY:
        state.position.y + 14 + MISSILE_LAUNCHER_FIRE_OFFSET_Y[direction],
      targetX,
      targetY,
      speed: state.missileSpeed,
      extraSmall: 0,
      extraLarge: 1,
      extraExtraLarge: 0,
    });
  }

  if (soundCommands) {
    soundCommands.push({
      sound: SoundEngineSound.MediumFireSnd,
      x: state.position.x,
      y: state.position.y,
      width: state.pixelWidth,
      height: state.pixelHeight,
    });
  }
}

/**
 * Port of upstream `VHeavy::FireTurrentMissile`.
 * Role: Spawns a heavy vehicle turret missile effect from the vehicle body.
 * Upstream: vheavy.cpp:263-266
 */
export function fireHeavyVehicleTurrentMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    owner: TeamType | number;
  },
  effectList: TurretMissileEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.push({
    ztime: state.ztime,
    startX: state.position.x + 8,
    startY: state.position.y + 8,
    targetX,
    targetY,
    offsetTime,
    type: TurretMissileEffectType.Heavy,
    owner: state.owner,
  });
}

/**
 * Port of upstream `VLight::FireTurrentMissile`.
 * Role: Spawns a light vehicle turret missile effect from the vehicle body.
 * Upstream: vlight.cpp:280-283
 */
export function fireLightVehicleTurrentMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
  },
  effectList: TurretMissileEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.push({
    ztime: state.ztime,
    startX: state.position.x + 8,
    startY: state.position.y + 8,
    targetX,
    targetY,
    offsetTime,
    type: TurretMissileEffectType.Light,
  });
}

/**
 * Port of upstream `VMedium::FireTurrentMissile`.
 * Role: Spawns a medium vehicle turret missile effect from the vehicle body.
 * Upstream: vmedium.cpp:274-277
 */
export function fireMediumVehicleTurrentMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
  },
  effectList: TurretMissileEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.push({
    ztime: state.ztime,
    startX: state.position.x + 8,
    startY: state.position.y + 8,
    targetX,
    targetY,
    offsetTime,
    type: TurretMissileEffectType.Medium,
  });
}

/**
 * Port of upstream `VAPC::DoDeathEffect`.
 * Role: Inserts an APC death effect at the front of the shared effect list.
 * Upstream: vapc.cpp:219-223
 */
export function doApcVehicleDeathEffect<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
  },
  effectList: DeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void doFireDeath;
  void doMissileDeath;
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    object: DeathEffectObject.Apc,
  });
}

/**
 * Port of upstream `VCrane::DoDeathEffect`.
 * Role: Inserts a crane death effect at the front of the shared effect list.
 * Upstream: vcrane.cpp:239-243
 */
export function doCraneVehicleDeathEffect<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
  },
  effectList: DeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void doFireDeath;
  void doMissileDeath;
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    object: DeathEffectObject.Crane,
  });
}

/**
 * Port of upstream `VJeep::DoDeathEffect`.
 * Role: Inserts a jeep death effect at the front of the shared effect list.
 * Upstream: vjeep.cpp:290-294
 */
export function doJeepVehicleDeathEffect<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
  },
  effectList: DeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void doFireDeath;
  void doMissileDeath;
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    object: DeathEffectObject.Jeep,
  });
}

/**
 * Port of upstream `VMissileLauncher::DoDeathEffect`.
 * Role: Inserts a mobile-missile death effect at the front of the shared effect list.
 * Upstream: vmissilelauncher.cpp:204-208
 */
export function doMissileLauncherVehicleDeathEffect<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
  },
  effectList: DeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void doFireDeath;
  void doMissileDeath;
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    object: DeathEffectObject.MobileMissile,
  });
}

/**
 * Port of upstream `VHeavy::DoDeathEffect`.
 * Role: Inserts a tank death effect with the current damaged base image at the front of the shared effect list.
 * Upstream: vheavy.cpp:226-232
 */
export function doHeavyVehicleDeathEffect<TTime, TBaseImage>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    owner: TeamType | number;
    direction: number;
    moveIndex: number;
    baseDamaged: readonly (readonly (readonly TBaseImage[])[])[];
  },
  effectList: DeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    object: DeathEffectObject.Tank,
    baseImage:
      state.baseDamaged[state.owner]?.[state.direction]?.[state.moveIndex] ??
      null,
  });
}

/**
 * Port of upstream `VLight::DoDeathEffect`.
 * Role: Inserts a tank death effect with the current damaged base image at the front of the shared effect list.
 * Upstream: vlight.cpp:243-249
 */
export function doLightVehicleDeathEffect<TTime, TBaseImage>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    owner: TeamType | number;
    direction: number;
    moveIndex: number;
    baseDamaged: readonly (readonly (readonly TBaseImage[])[])[];
  },
  effectList: DeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    object: DeathEffectObject.Tank,
    baseImage:
      state.baseDamaged[state.owner]?.[state.direction]?.[state.moveIndex] ??
      null,
  });
}

/**
 * Port of upstream `VMedium::DoDeathEffect`.
 * Role: Inserts a tank death effect with the current damaged base image at the front of the shared effect list.
 * Upstream: vmedium.cpp:237-243
 */
export function doMediumVehicleDeathEffect<TTime, TBaseImage>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    owner: TeamType | number;
    direction: number;
    moveIndex: number;
    baseDamaged: readonly (readonly (readonly TBaseImage[])[])[];
  },
  effectList: DeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    object: DeathEffectObject.Tank,
    baseImage:
      state.baseDamaged[state.owner]?.[state.direction]?.[state.moveIndex] ??
      null,
  });
}
