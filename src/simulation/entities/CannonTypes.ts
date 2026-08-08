/**
 * Upstream: zcannon.h, cmissilecannon.h / cmissilecannon.cpp
 */

import { GameEntity } from "./GameEntity";
import { ObjectMode } from "./EntityTypes";
import type { ZSettings } from "../../data/ZSettingsData";
import {
  CannonDeathObject,
  type CannonDeathEffectSpawn,
} from "../CannonDeathEffect";
import type { LightRocketEffectSpawn } from "../LightRocketEffect";
import type { MissileCannonRocketsEffectSpawn } from "../MissileCannonRocketsEffect";
import type { MapSurfaceRenderCommand } from "../../world/GameMap";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  MAX_ANGLE_TYPES,
  MAX_UNIT_HEALTH,
  RobotType,
  TeamType,
} from "../SimulationConstants";
import { SoundEngineSound } from "../../audio/AudioService";
import type { VehicleRestrictedSoundCommand } from "./VehicleEntity";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  TEAM_RENDERING_TEAM_NAMES,
  type TeamSurfaceFactory,
} from "../TeamRendering";

/**
 * Port of upstream `_CGATLING_H_`.
 * Role: Marks that the CGatling header boundary has been adapted to this module.
 * Upstream: cgatling.h:2
 */
export const CGATLING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CGUN_H_`.
 * Role: Marks that the CGun header boundary has been adapted to this module.
 * Upstream: cgun.h:2
 */
export const CGUN_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CHOWITZER_H_`.
 * Role: Marks that the CHowitzer header boundary has been adapted to this module.
 * Upstream: chowitzer.h:2
 */
export const CHOWITZER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CMISSILECANNON_H_`.
 * Role: Marks that the CMissileCannon header boundary has been adapted to this module.
 * Upstream: cmissilecannon.h:2
 */
export const CMISSILECANNON_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZCANNON_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zcannon.h:2
 */
export const ZCANNON_HEADER_GUARD_PORTED = true;

export type CannonPlacementImage = {
  loadBaseImage(filename: string): void;
};

export type GunCannonImage<TSurface> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

/**
 * Port of upstream `CGun::Init` mutable image fields.
 * Role: Provides the shared gun cannon images and browser asset-loading hooks.
 * Upstream: cgun.cpp:45-80
 */
export type GunCannonInitState<TSurface> = {
  wasted: GunCannonImage<TSurface>;
  passive: readonly (readonly GunCannonImage<TSurface>[])[];
  fire: readonly (readonly GunCannonImage<TSurface>[])[];
  place: readonly (readonly GunCannonImage<TSurface>[])[];
  loadImage(filename: string): TSurface | null;
};

export type GunCannonRenderState<TSurface> = {
  position: { x: number; y: number };
  destroyed: boolean;
  mode: ObjectMode | number;
  owner: TeamType | number;
  direction: number;
  placeIndex: number;
  doHitEffect: boolean;
  wastedImage: TSurface | null;
  initPlaceImages: readonly (TSurface | null | undefined)[];
  placeImages: readonly (readonly (TSurface | null | undefined)[] | null | undefined)[];
  passiveImages: readonly (readonly (TSurface | null | undefined)[] | null | undefined)[];
};

export type GunCannonRenderMap<TSurface> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<TSurface>;
};

export type GunCannonRenderCommand<TSurface> =
  | MapSurfaceRenderCommand<TSurface>
  | null;

/**
 * Replacement for upstream `CGun::DoRender`.
 * Role: Builds the gun cannon render command and clears the hit-effect flag.
 * Upstream: cgun.cpp:82-126
 */
export function renderGunCannon<TSurface>(
  state: GunCannonRenderState<TSurface>,
  zmap: GunCannonRenderMap<TSurface>,
): GunCannonRenderCommand<TSurface> {
  const surface = getGunCannonRenderSurface(state);
  const renderHit = state.doHitEffect;
  state.doHitEffect = false;

  if (!surface) return null;

  return zmap.renderZSurface(
    surface,
    state.position.x + GUN_CANNON_UNIT_X_PIXELS,
    state.position.y + GUN_CANNON_UNIT_Y_PIXELS,
    renderHit,
    false,
  );
}

function getGunCannonRenderSurface<TSurface>(
  state: GunCannonRenderState<TSurface>,
): TSurface | null | undefined {
  if (state.destroyed) return state.wastedImage;

  if (state.mode === ObjectMode.JustPlaced) {
    if (state.placeIndex < 3) return state.initPlaceImages[state.placeIndex];
    return state.placeImages[state.owner]?.[state.placeIndex - 3];
  }

  return state.passiveImages[state.owner]?.[state.direction];
}

/**
 * Port of upstream `CGun::Init`.
 * Role: Loads gun cannon destroyed, empty, placement, passive, and fire images.
 * Upstream: cgun.cpp:45-80
 */
export function initGunCannon<TSurface>(
  state: GunCannonInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  state.wasted.loadBaseImage("assets/units/cannons/gun/wasted.png");

  const emptySurface = state.loadImage("assets/units/cannons/gun/empty.png");
  for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
    state.passive[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
    state.fire[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
  }

  for (let frame = 0; frame < 4; frame += 1) {
    state.place[TeamType.Null]?.[frame]?.loadBaseImage(
      state.passive[TeamType.Null]?.[4]?.getBaseSurface() ?? emptySurface,
    );
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const teamName = TEAM_RENDERING_TEAM_NAMES[team];

    for (let frame = 0; frame < 4; frame += 1) {
      const baseImage = state.place[TEAM_RENDERING_BASE_TEAM]?.[frame];
      const placeImage = state.place[team]?.[frame];
      if (!baseImage || !placeImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        placeImage,
        `assets/units/cannons/gun/place_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }

    for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
      const baseImage = state.passive[TEAM_RENDERING_BASE_TEAM]?.[angle];
      const passiveImage = state.passive[team]?.[angle];
      const fireImage = state.fire[team]?.[angle];
      if (!baseImage || !passiveImage || !fireImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        passiveImage,
        `assets/units/cannons/gun/equiped_${teamName}_r${(angle * 45)
          .toString()
          .padStart(3, "0")}.png`,
        makeTeamSurface,
      );
      fireImage.loadBaseImage(passiveImage.getBaseSurface());
    }
  }
}

export type HowitzerCannonInitState<TSurface> = GunCannonInitState<TSurface>;

export type GatlingCannonInitState<TSurface> = GunCannonInitState<TSurface>;

/**
 * Port of upstream `CGatling::Init`.
 * Role: Loads gatling cannon destroyed, empty, placement, passive, and fire images.
 * Upstream: cgatling.cpp:44-87
 */
export function initGatlingCannon<TSurface>(
  state: GatlingCannonInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  state.wasted.loadBaseImage("assets/units/cannons/gatling/wasted.png");

  for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
    const emptySurface = state.loadImage(
      `assets/units/cannons/gatling/empty_r${(angle * 45)
        .toString()
        .padStart(3, "0")}.png`,
    );
    state.fire[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
    state.passive[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
  }

  for (let frame = 0; frame < 4; frame += 1) {
    state.place[TeamType.Null]?.[frame]?.loadBaseImage(
      state.passive[TeamType.Null]?.[4]?.getBaseSurface() ?? null,
    );
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const teamName = TEAM_RENDERING_TEAM_NAMES[team];

    for (let frame = 0; frame < 4; frame += 1) {
      const baseImage = state.place[TEAM_RENDERING_BASE_TEAM]?.[frame];
      const placeImage = state.place[team]?.[frame];
      if (!baseImage || !placeImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        placeImage,
        `assets/units/cannons/gatling/place_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }

    for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
      const basePassiveImage = state.passive[TEAM_RENDERING_BASE_TEAM]?.[angle];
      const passiveImage = state.passive[team]?.[angle];
      if (basePassiveImage && passiveImage) {
        loadTeamZSurface(
          team,
          basePassiveImage,
          passiveImage,
          `assets/units/cannons/gatling/fire_${teamName}_r${(angle * 45)
            .toString()
            .padStart(3, "0")}_n00.png`,
          makeTeamSurface,
        );
      }

      const baseFireImage = state.fire[TEAM_RENDERING_BASE_TEAM]?.[angle];
      const fireImage = state.fire[team]?.[angle];
      if (!baseFireImage || !fireImage) continue;

      loadTeamZSurface(
        team,
        baseFireImage,
        fireImage,
        `assets/units/cannons/gatling/fire_${teamName}_r${(angle * 45)
          .toString()
          .padStart(3, "0")}_n01.png`,
        makeTeamSurface,
      );
    }
  }
}

/**
 * Port of upstream `CMissileCannon::Init` mutable image fields.
 * Role: Adds missile-cannon empty images to the shared cannon image set.
 * Upstream: cmissilecannon.cpp:47-94
 */
export type MissileCannonInitState<TSurface> = {
  wasted: readonly GunCannonImage<TSurface>[];
  passive: readonly (readonly GunCannonImage<TSurface>[])[];
  fire: readonly (readonly GunCannonImage<TSurface>[])[];
  place: readonly (readonly GunCannonImage<TSurface>[])[];
  empty: readonly (readonly GunCannonImage<TSurface>[])[];
  loadImage(filename: string): TSurface | null;
};

/**
 * Port of upstream `CMissileCannon::Init`.
 * Role: Loads missile-cannon destroyed, empty, placement, passive, and fire images.
 * Upstream: cmissilecannon.cpp:47-94
 */
export function initMissileCannon<TSurface>(
  state: MissileCannonInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const teamName = TEAM_RENDERING_TEAM_NAMES[team];
    const baseWastedImage = state.wasted[TEAM_RENDERING_BASE_TEAM];
    const wastedImage = state.wasted[team];
    if (!baseWastedImage || !wastedImage) continue;

    loadTeamZSurface(
      team,
      baseWastedImage,
      wastedImage,
      `assets/units/cannons/missile_cannon/wasted_${teamName}.png`,
      makeTeamSurface,
    );
  }

  const emptySurface = state.loadImage(
    "assets/units/cannons/missile_cannon/empty_null.png",
  );
  for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
    state.empty[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
    state.fire[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
    state.passive[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
  }

  for (let frame = 0; frame < 4; frame += 1) {
    state.place[TeamType.Null]?.[frame]?.loadBaseImage(
      state.passive[TeamType.Null]?.[4]?.getBaseSurface() ?? emptySurface,
    );
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const teamName = TEAM_RENDERING_TEAM_NAMES[team];

    for (let frame = 0; frame < 4; frame += 1) {
      const baseImage = state.place[TEAM_RENDERING_BASE_TEAM]?.[frame];
      const placeImage = state.place[team]?.[frame];
      if (!baseImage || !placeImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        placeImage,
        `assets/units/cannons/missile_cannon/place_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }

    for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
      const basePassiveImage = state.passive[TEAM_RENDERING_BASE_TEAM]?.[angle];
      const passiveImage = state.passive[team]?.[angle];
      const fireImage = state.fire[team]?.[angle];
      if (basePassiveImage && passiveImage && fireImage) {
        loadTeamZSurface(
          team,
          basePassiveImage,
          passiveImage,
          `assets/units/cannons/missile_cannon/equiped_${teamName}_r${(angle * 45)
            .toString()
            .padStart(3, "0")}.png`,
          makeTeamSurface,
        );
        fireImage.loadBaseImage(passiveImage.getBaseSurface());
      }

      const baseEmptyImage = state.empty[TEAM_RENDERING_BASE_TEAM]?.[angle];
      const emptyImage = state.empty[team]?.[angle];
      if (!baseEmptyImage || !emptyImage) continue;

      loadTeamZSurface(
        team,
        baseEmptyImage,
        emptyImage,
        `assets/units/cannons/missile_cannon/empty_${teamName}_r${(angle * 45)
          .toString()
          .padStart(3, "0")}.png`,
        makeTeamSurface,
      );
    }
  }
}

/**
 * Port of upstream `CHowitzer::Init`.
 * Role: Loads howitzer cannon destroyed, empty, placement, passive, and fire images.
 * Upstream: chowitzer.cpp:46-86
 */
export function initHowitzerCannon<TSurface>(
  state: HowitzerCannonInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  state.wasted.loadBaseImage("assets/units/cannons/howitzer/wasted.png");

  for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
    const emptySurface = state.loadImage(
      `assets/units/cannons/howitzer/empty_r${(angle * 45)
        .toString()
        .padStart(3, "0")}.png`,
    );
    state.passive[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
    state.fire[TeamType.Null]?.[angle]?.loadBaseImage(emptySurface);
  }

  for (let frame = 0; frame < 4; frame += 1) {
    state.place[TeamType.Null]?.[frame]?.loadBaseImage(
      state.passive[TeamType.Null]?.[4]?.getBaseSurface() ?? null,
    );
  }

  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const teamName = TEAM_RENDERING_TEAM_NAMES[team];

    for (let frame = 0; frame < 4; frame += 1) {
      const baseImage = state.place[TEAM_RENDERING_BASE_TEAM]?.[frame];
      const placeImage = state.place[team]?.[frame];
      if (!baseImage || !placeImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        placeImage,
        `assets/units/cannons/howitzer/place_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }

    for (let angle = 0; angle < MAX_ANGLE_TYPES; angle += 1) {
      const basePassiveImage = state.passive[TEAM_RENDERING_BASE_TEAM]?.[angle];
      const passiveImage = state.passive[team]?.[angle];
      if (basePassiveImage && passiveImage) {
        loadTeamZSurface(
          team,
          basePassiveImage,
          passiveImage,
          `assets/units/cannons/howitzer/fire_${teamName}_r${(angle * 45)
            .toString()
            .padStart(3, "0")}_n00.png`,
          makeTeamSurface,
        );
      }

      const baseFireImage = state.fire[TEAM_RENDERING_BASE_TEAM]?.[angle];
      const fireImage = state.fire[team]?.[angle];
      if (!baseFireImage || !fireImage) continue;

      loadTeamZSurface(
        team,
        baseFireImage,
        fireImage,
        `assets/units/cannons/howitzer/fire_${teamName}_r${(angle * 45)
          .toString()
          .padStart(3, "0")}_n01.png`,
        makeTeamSurface,
      );
    }
  }
}

export type GunCannonProcessTarget = Pick<GameEntity, "centerX" | "centerY">;

/**
 * Port of upstream `CGun::Process` mutable fields.
 * Role: Carries gun placement animation and idle rotation state across ticks.
 * Upstream: cgun.cpp:151-193
 */
export type GunCannonProcessState = {
  mode: ObjectMode | number;
  lastProcessTime: number;
  placeIndex: number;
  owner: TeamType | number;
  attackObject: GunCannonProcessTarget | null;
  position: {
    x: number;
    y: number;
  };
  direction: number;
  directionFromLocation(deltaX: number, deltaY: number): number;
};

/**
 * Port of upstream `CGun::Process`.
 * Role: Advances the gun placement frames and periodic idle or target-facing rotation.
 * Upstream: cgun.cpp:151-193
 */
export function processGunCannon(
  state: GunCannonProcessState,
  currentTime: number,
): number {
  switch (state.mode) {
    case ObjectMode.JustPlaced:
      if (currentTime - state.lastProcessTime < 0.1) break;
      state.lastProcessTime = currentTime;
      state.placeIndex += 1;

      if (state.placeIndex >= 7) {
        state.placeIndex = 0;
        state.mode = ObjectMode.Rotating;
      }
      break;
    case ObjectMode.Rotating:
      if (currentTime - state.lastProcessTime < 1.0) break;
      if (state.owner === TeamType.Null) break;
      state.lastProcessTime = currentTime;

      if (state.attackObject) {
        const newDirection = state.directionFromLocation(
          state.attackObject.centerX - state.position.x,
          state.attackObject.centerY - state.position.y,
        );
        if (newDirection !== -1) state.direction = newDirection;
      } else {
        state.direction += 1;
        if (state.direction >= MAX_ANGLE_TYPES) state.direction = 0;
      }
      break;
  }

  return 1;
}

/**
 * Port of upstream `ZCannon::Init`.
 * Role: Loads the cannon placement marker images.
 * Upstream: zcannon.cpp:18-29
 */
export function initCannonPlacementImages(
  placementImages: readonly CannonPlacementImage[],
): void {
  for (let i = 0; i < 3; i += 1) {
    placementImages[i]?.loadBaseImage(
      `assets/units/cannons/init-place_n${i.toString().padStart(2, "0")}.png`,
    );
  }
}

/**
 * Port of upstream `ZCannon::CanSetWaypoints`.
 * Role: Reports that cannon entities can receive waypoint orders.
 * Upstream: zcannon.h:16
 */
export function canCannonSetWaypoints(): boolean {
  return true;
}

/**
 * Browser simulation entity containing the subset of `ZCannon` behavior already ported.
 * Role: Owns cannon-specific driver ejection and sniper vulnerability state.
 * Upstream: zcannon.h
 */
export class CannonEntity extends GameEntity {
  ejectableCannon = true;

  /**
   * Port of upstream `ZCannon::CanBeSniped`.
   * Role: Reports whether this cannon has a snipeable driver and can eject it.
   * Upstream: zcannon.cpp:46-49
   */
  override canBeSniped(): boolean {
    return this.canBeSnipedFlag && this.driverInfo.length > 0 && this.ejectableCannon;
  }

  /**
   * Port of upstream `ZCannon::SetAttackObject`.
   * Role: Stores the attack target and faces the cannon toward the target center.
   * Upstream: zcannon.cpp:31-44
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
   * Port of upstream `ZCannon::CanEjectDrivers`.
   * Role: Reports whether this cannon can eject its driver.
   * Upstream: zcannon.cpp:51-55
   */
  override canEjectDrivers(): boolean {
    return this.ejectableCannon;
  }

  /**
   * Port of upstream `ZCannon::SetInitialDrivers`.
   * Role: Initializes cannon driver state from ownership and grunt health settings.
   * Upstream: zcannon.cpp:57-70
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
   * Port of upstream `ZCannon::SetEjectableCannon`.
   * Role: Toggles whether this cannon can eject its driver.
   * Upstream: zcannon.cpp:72-75
   */
  override setEjectableCannon(ejectable: boolean): void {
    this.ejectableCannon = ejectable;
  }
}

/**
 * Browser simulation entity containing the subset of `CGatling` behavior already ported.
 * Role: Represents gatling-specific cannon attack rendering state.
 * Upstream: cgatling.h / cgatling.cpp
 */
export class GatlingCannonEntity extends CannonEntity {
  renderFire = false;

  /**
   * Port of upstream `CGatling::SetAttackObject`.
   * Role: Stores the attack target, clears fire rendering when empty, and faces the target.
   * Upstream: cgatling.cpp:245-259
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) {
      this.renderFire = false;
      return;
    }

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }
}

/**
 * Browser simulation entity containing the subset of `CHowitzer` behavior already ported.
 * Role: Represents howitzer-specific cannon attack rendering state.
 * Upstream: chowitzer.h / chowitzer.cpp
 */
export class HowitzerCannonEntity extends CannonEntity {
  renderFire = false;

  /**
   * Port of upstream `CHowitzer::SetAttackObject`.
   * Role: Stores the attack target, clears fire rendering when empty, and faces the target.
   * Upstream: chowitzer.cpp:225-239
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) {
      this.renderFire = false;
      return;
    }

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }
}

/**
 * Browser simulation entity containing the subset of `CMissileCannon` behavior already ported.
 * Role: Represents missile-cannon-specific attack rendering state.
 * Upstream: cmissilecannon.h / cmissilecannon.cpp
 */
export class MissileCannonEntity extends CannonEntity {
  renderFire = false;

  /**
   * Port of upstream `CMissileCannon::SetAttackObject`.
   * Role: Stores the attack target, clears fire rendering when empty, and faces the target.
   * Upstream: cmissilecannon.cpp:229-243
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) {
      this.renderFire = false;
      return;
    }

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }
}

export type GunCannonTurrentMissileState<TTime = unknown> = {
  ztime: TTime | null;
  position: {
    x: number;
    y: number;
  };
};

export type GatlingCannonTurrentMissileState<TTime = unknown> =
  GunCannonTurrentMissileState<TTime>;

export type HowitzerCannonTurrentMissileState<TTime = unknown> =
  GunCannonTurrentMissileState<TTime>;

export type MissileCannonTurrentMissileState<TTime = unknown> =
  GunCannonTurrentMissileState<TTime>;

const GUN_CANNON_FIRE_OFFSET_X = [20, 12, 0, -12, -20, -12, 0, 12] as const;
const GUN_CANNON_FIRE_OFFSET_Y = [0, -12, -20, -12, 0, 12, 20, 12] as const;

export type MissileCannonFireState<TTime = unknown> = {
  ztime: TTime | null;
  position: { x: number; y: number };
  direction: number;
  endRenderFireTime: number;
  pixelWidth: number;
  pixelHeight: number;
};

export type HowitzerCannonFireState<TTime = unknown> = MissileCannonFireState<TTime> & {
  renderFire: boolean;
  missileSpeed: number;
};

/**
 * Port of upstream `CHowitzer::Process` mutable fields.
 * Role: Adds howitzer fire-render timing to the shared cannon process state.
 * Upstream: chowitzer.cpp:162-207
 */
export type HowitzerCannonProcessState = GunCannonProcessState & {
  renderFire: boolean;
  endRenderFireTime: number;
};

/**
 * Port of upstream `CHowitzer::Process`.
 * Role: Ends the howitzer muzzle-fire frame and advances placement or rotation state.
 * Upstream: chowitzer.cpp:162-207
 */
export function processHowitzerCannon(
  state: HowitzerCannonProcessState,
  currentTime: number,
): number {
  if (state.renderFire && currentTime >= state.endRenderFireTime) {
    state.renderFire = false;
  }

  return processGunCannon(state, currentTime);
}

/**
 * Port of upstream `CMissileCannon::Process` mutable fields.
 * Role: Adds missile-cannon fire-render timing to the shared cannon process state.
 * Upstream: cmissilecannon.cpp:168-213
 */
export type MissileCannonProcessState = GunCannonProcessState & {
  renderFire: boolean;
  endRenderFireTime: number;
};

/**
 * Port of upstream `CMissileCannon::Process`.
 * Role: Ends the missile-cannon muzzle-fire frame and advances placement or rotation state.
 * Upstream: cmissilecannon.cpp:168-213
 */
export function processMissileCannon(
  state: MissileCannonProcessState,
  currentTime: number,
): number {
  if (state.renderFire && currentTime >= state.endRenderFireTime) {
    state.renderFire = false;
  }

  return processGunCannon(state, currentTime);
}

/**
 * Port of upstream `CGun::FireMissile`.
 * Role: Spawns a gun cannon rocket and requests its restricted fire sound.
 * Upstream: cgun.cpp:195-206
 */
export function fireGunCannonMissile<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    direction: number;
    missileSpeed: number;
    pixelWidth: number;
    pixelHeight: number;
  },
  effectList: LightRocketEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
): void {
  const direction = Math.trunc(state.direction) & 7;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX: state.position.x + 17 + GUN_CANNON_FIRE_OFFSET_X[direction],
      startY: state.position.y + 14 + GUN_CANNON_FIRE_OFFSET_Y[direction],
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
      sound: SoundEngineSound.GunFireSnd,
      x: state.position.x,
      y: state.position.y,
      width: state.pixelWidth,
      height: state.pixelHeight,
    });
  }
}

/**
 * Port of upstream `CHowitzer::FireMissile`.
 * Role: Spawns a howitzer rocket, starts fire rendering, and requests its restricted fire sound.
 * Upstream: chowitzer.cpp:209-223
 */
export function fireHowitzerCannonMissile<TTime>(
  state: HowitzerCannonFireState<TTime>,
  currentTime: number,
  effectList: LightRocketEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  const direction = Math.trunc(state.direction) & 7;

  state.renderFire = true;
  state.endRenderFireTime =
    currentTime + 0.05 + (Math.trunc(randomInt(100)) % 100) * 0.0003;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX: state.position.x + 17 + GUN_CANNON_FIRE_OFFSET_X[direction],
      startY: state.position.y + 14 + GUN_CANNON_FIRE_OFFSET_Y[direction],
      targetX,
      targetY,
      speed: state.missileSpeed,
      extraSmall: 1,
      extraLarge: 1,
      extraExtraLarge: 0,
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
 * Port of upstream `CMissileCannon::FireMissile`.
 * Role: Spawns a missile-cannon rocket, updates fire-render timing, and requests its restricted fire sound.
 * Upstream: cmissilecannon.cpp:215-227
 */
export function fireMissileCannonMissile<TTime>(
  state: MissileCannonFireState<TTime>,
  currentTime: number,
  effectList: MissileCannonRocketsEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  soundCommands: VehicleRestrictedSoundCommand[] | null = null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  const direction = Math.trunc(state.direction) & 7;

  state.endRenderFireTime =
    currentTime + 0.05 + (Math.trunc(randomInt(100)) % 100) * 0.0003;

  if (effectList) {
    effectList.push({
      ztime: state.ztime,
      startX: state.position.x + 17 + GUN_CANNON_FIRE_OFFSET_X[direction],
      startY: state.position.y + 14 + GUN_CANNON_FIRE_OFFSET_Y[direction],
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
 * Port of upstream `CGatling::FireTurrentMissile`.
 * Role: Spawns a gatling cannon death effect from the cannon body.
 * Upstream: cgatling.cpp:298-302
 */
export function fireGatlingCannonTurrentMissile<TTime>(
  state: GatlingCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Gatling,
  });
}

/**
 * Port of upstream `CHowitzer::FireTurrentMissile`.
 * Role: Spawns a howitzer cannon death effect from the cannon body.
 * Upstream: chowitzer.cpp:278-282
 */
export function fireHowitzerCannonTurrentMissile<TTime>(
  state: HowitzerCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Howitzer,
  });
}

/**
 * Port of upstream `CMissileCannon::FireTurrentMissile`.
 * Role: Spawns a missile cannon death effect from the cannon body.
 * Upstream: cmissilecannon.cpp:282-286
 */
export function fireMissileCannonTurrentMissile<TTime>(
  state: MissileCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Missile,
  });
}

/**
 * Port of upstream `CGatling::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: cgatling.cpp:261-267
 */
export function doGatlingCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CGun::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: cgun.cpp:208-214
 */
export function doGunCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CHowitzer::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: chowitzer.cpp:241-247
 */
export function doHowitzerCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CMissileCannon::DoDeathEffect`.
 * Role: Preserves the upstream no-op cannon death hook; its effect spawns are commented out.
 * Upstream: cmissilecannon.cpp:245-251
 */
export function doMissileCannonDeathEffect<TTime>(
  state: {
    owner: TeamType | number;
  },
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  void effectList;
  void doFireDeath;
  void doMissileDeath;
  if (state.owner === TeamType.Null) return;
}

/**
 * Port of upstream `CGun::FireTurrentMissile`.
 * Role: Spawns a gun cannon death effect from the cannon body.
 * Upstream: cgun.cpp:245-248
 */
export function fireGunCannonTurrentMissile<TTime>(
  state: GunCannonTurrentMissileState<TTime>,
  effectList: CannonDeathEffectSpawn<TTime>[] | null,
  targetX: number,
  targetY: number,
  offsetTime: number,
): void {
  if (!effectList) return;

  effectList.unshift({
    ztime: state.ztime,
    startX: state.position.x,
    startY: state.position.y,
    targetX,
    targetY,
    offsetTime,
    object: CannonDeathObject.Gun,
  });
}

/**
 * Port of upstream `unit_x` from `CGatling`.
 * Role: Defines the x offset of the gatling cannon unit render source.
 * Upstream: cgatling.cpp:91, cgatling.cpp:202
 */
export const GATLING_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_x` from `CHowitzer`.
 * Role: Defines the x offset of the howitzer cannon unit render source.
 * Upstream: chowitzer.cpp:90
 */
export const HOWITZER_CANNON_UNIT_X_PIXELS = -2;

/**
 * Port of upstream `unit_y` from `CHowitzer`.
 * Role: Defines the y offset of the howitzer cannon unit render source.
 * Upstream: chowitzer.cpp:91
 */
export const HOWITZER_CANNON_UNIT_Y_PIXELS = -12;

/**
 * Port of upstream `unit_x` from `CMissileCannon`.
 * Role: Defines the x offset of the missile cannon unit render source.
 * Upstream: cmissilecannon.cpp:98
 */
export const MISSILE_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CMissileCannon`.
 * Role: Defines the y offset of the missile cannon unit render source.
 * Upstream: cmissilecannon.cpp:99
 */
export const MISSILE_CANNON_UNIT_Y_PIXELS = -8;

/**
 * Port of upstream `unit_x` from `CGun`.
 * Role: Defines the x offset of the gun cannon unit render source.
 * Upstream: cgun.cpp:84
 */
export const GUN_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CGun`.
 * Role: Defines the y offset of the gun cannon unit render source.
 * Upstream: cgun.cpp:85
 */
export const GUN_CANNON_UNIT_Y_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CGatling`.
 * Role: Defines the y offset of the gatling cannon unit render source.
 * Upstream: cgatling.cpp:92, cgatling.cpp:203
 */
export const GATLING_CANNON_UNIT_Y_PIXELS = -7;
