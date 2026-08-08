/**
 * Upstream: ecraneconco.h / ecraneconco.cpp
 */

import { ACTIVE_TEAM_TYPE_COUNT, TeamType } from "./SimulationConstants";
import { CraneConstructionRenderItem } from "../rendering/EffectRenderTypes";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  TEAM_RENDERING_TEAM_NAMES,
  type TeamSurfaceFactory,
} from "./TeamRendering";
import type { MapSurfaceRenderCommand } from "../world/GameMap";

/**
 * Port of upstream `_ECRANECONCO_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ecraneconco.h:2
 */
export const ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ECraneConcoItem`.
 * Role: Stores one crane construction animation item with travel endpoints and dimensions.
 * Upstream: ecraneconco.h:12-73
 */
export class CraneConstructionItem {
  type = -1;
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  destX = 0;
  destY = 0;
  width = 0;
  height = 0;
  widthDistance = 0;
  heightDistance = 0;

  /**
   * Port of upstream `ECraneConcoItem::Init`.
   * Role: Initializes this construction item at a crane center and calculates travel deltas.
   * Upstream: ecraneconco.h:24-32
   */
  init(type: number, centerX: number, centerY: number, width = 0, height = 0): void {
    this.type = type;
    this.startX = centerX;
    this.destX = centerX;
    this.x = centerX;
    this.startY = centerY;
    this.destY = centerY;
    this.y = centerY;
    this.width = width;
    this.height = height;
    this.setTravelDistances();
  }

  /**
   * Port of upstream `ECraneConcoItem::SetStart`.
   * Role: Centers this construction item on its starting coordinates.
   * Upstream: ecraneconco.h:34-38
   */
  setStart(x: number, y: number): void {
    setCraneConstructionItemStart(this, x, y);
  }

  /**
   * Port of upstream `ECraneConcoItem::SetReturn`.
   * Role: Sets this construction item's return destination around a target center.
   * Upstream: ecraneconco.h:40-47
   */
  setReturn(centerX: number, centerY: number): void {
    setCraneConstructionItemReturn(this, centerX, centerY);
  }

  /**
   * Port of upstream `ECraneConcoItem::SetTravelDistances`.
   * Role: Calculates this construction item's travel deltas from start to destination.
   * Upstream: ecraneconco.h:49-53
   */
  setTravelDistances(): void {
    setCraneConstructionTravelDistances(this);
  }

  /**
   * Port of upstream `ECraneConcoItem::Move`.
   * Role: Moves this construction item along its travel vector by a percentage.
   * Upstream: ecraneconco.h:55-59
   */
  move(percentage: number): void {
    this.x = Math.trunc(this.startX + this.widthDistance * percentage);
    this.y = Math.trunc(this.startY + this.heightDistance * percentage);
  }

  /**
   * Port of upstream `ECraneConcoItem::MoveToDest`.
   * Role: Snaps this construction item to its destination coordinates.
   * Upstream: ecraneconco.h:61-65
   */
  moveToDestination(): void {
    moveCraneConstructionItemToDestination(this);
  }
}

/**
 * Adaptation support for upstream `ECraneConcoItem::MoveToDest`.
 * Role: Represents the position fields touched by the crane construction item destination snap operation.
 * Upstream: ecraneconco.h:61-65
 */
export type CraneConstructionDestinationState = {
  x: number;
  y: number;
  destX: number;
  destY: number;
};

/**
 * Adaptation support for upstream `ECraneConcoItem::SetTravelDistances`.
 * Role: Represents the coordinate fields touched by crane construction travel distance calculation.
 * Upstream: ecraneconco.h:49-53
 */
export type CraneConstructionTravelDistanceState =
  CraneConstructionDestinationState & {
    startX: number;
    startY: number;
    height: number;
    widthDistance: number;
    heightDistance: number;
  };

/**
 * Adaptation support for upstream `ECraneConcoItem::SetStart`.
 * Role: Represents the coordinate fields touched by crane construction start placement.
 * Upstream: ecraneconco.h:34-38
 */
export type CraneConstructionStartState = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  width: number;
};

export type CraneConstructionReturnItem = {
  setReturn(centerX: number, centerY: number): void;
};

/**
 * Adaptation support for upstream `ECraneConco::SetBotInitCords`.
 * Role: Provides building bounds and crane center coordinates used to place construction robots.
 * Upstream: ecraneconco.cpp:175-242
 */
export type CraneConstructionBotInitialCoordinateInput = {
  isBridge: boolean;
  craneCenterX: number;
  craneCenterY: number;
  buildingX: number;
  buildingY: number;
  buildingWidth: number;
  buildingHeight: number;
};

/**
 * Adaptation support for upstream `ECraneConco::SetBotInitCords`.
 * Role: Represents the destination coordinates selected for a construction robot.
 * Upstream: ecraneconco.cpp:175-242
 */
export type CraneConstructionCoordinates = {
  x: number;
  y: number;
};

export type CraneConstructionRandomInteger = (maxExclusive: number) => number;

/**
 * Adaptation support for upstream `ECraneConco::Process`.
 * Role: Represents a construction render item that can move during crane travel.
 * Upstream: ecraneconco.cpp:388-397, ecraneconco.cpp:414-415
 */
export type CraneConstructionProcessItem = {
  move(percentage: number): void;
  moveToDestination(): void;
};

/**
 * Adaptation support for upstream `ECraneConco::Process`.
 * Role: Stores crane construction animation timers, frame indices, and travel state.
 * Upstream: ecraneconco.cpp:329-425
 */
export type CraneConstructionProcessState = {
  killMe: boolean;
  nextJackbotTime: number;
  jackbotIndex: number;
  nextPaperBotTime: number;
  paperBotIndex: number;
  paperBotPointing: boolean;
  travelTo: boolean;
  travelBack: boolean;
  travelTimeStart: number;
  travelTimeEnd: number;
  travelTimeWidth: number;
  concreteIndex: number;
  signIndex: number;
  renderItems: readonly CraneConstructionProcessItem[];
  renderItemList: CraneConstructionItem[];
};

/**
 * Adaptation support for upstream `ECraneConco::DoRender`.
 * Role: Represents one ordered crane construction item used to choose and place an image.
 * Upstream: ecraneconco.cpp:436-493
 */
export type CraneConstructionRenderItemState = {
  type: number;
  x: number;
  y: number;
  widthDistance: number;
};

/**
 * Adaptation support for upstream `ECraneConco::DoRender`.
 * Role: Stores crane construction images and frame state needed to emit render commands.
 * Upstream: ecraneconco.cpp:427-498
 */
export type CraneConstructionRenderState<TSurface> = {
  killMe: boolean;
  team: TeamType | number;
  concreteImages: readonly (readonly (TSurface | null | undefined)[])[];
  signFlipImages: readonly (readonly (TSurface | null | undefined)[])[];
  signImages: readonly (TSurface | null | undefined)[];
  coneNoShadowImages: readonly (TSurface | null | undefined)[];
  coneImages: readonly (TSurface | null | undefined)[];
  robotJackhammerImages: readonly (readonly (TSurface | null | undefined)[])[];
  robotPaperImages: readonly (readonly (TSurface | null | undefined)[])[];
  robotPointImages: readonly (readonly (TSurface | null | undefined)[])[];
  robotTravelLeftImages: readonly (TSurface | null | undefined)[];
  robotTravelRightImages: readonly (TSurface | null | undefined)[];
  robotTravelUpDownImages: readonly (TSurface | null | undefined)[];
  concreteIndex: number;
  signIndex: number;
  jackbotIndex: number;
  paperBotIndex: number;
  paperBotPointing: boolean;
  travelTo: boolean;
  travelBack: boolean;
  renderItemList: readonly CraneConstructionRenderItemState[];
};

/**
 * Adaptation support for upstream `ECraneConco::Init`.
 * Role: Represents dimensions available from loaded crane construction effect surfaces.
 * Upstream: ecraneconco.cpp:305-323
 */
export type CraneConstructionSurfaceDimensions = {
  width?: number;
  height?: number;
  w?: number;
  h?: number;
};

/**
 * Adaptation support for upstream `ECraneConco::Init`.
 * Role: Wraps crane construction effect images loaded per team and animation frame.
 * Upstream: ecraneconco.cpp:249-303
 */
export type CraneConstructionImage<
  TSurface extends CraneConstructionSurfaceDimensions,
> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

/**
 * Adaptation support for upstream `ECraneConco::Init`.
 * Role: Stores crane construction effect image tables and cached image dimensions.
 * Upstream: ecraneconco.cpp:244-327
 */
export type CraneConstructionInitState<
  TSurface extends CraneConstructionSurfaceDimensions,
> = {
  concoImages: CraneConstructionImage<TSurface>[][];
  signFlipImages: CraneConstructionImage<TSurface>[][];
  signImages: CraneConstructionImage<TSurface>[];
  coneNoShadowImages: CraneConstructionImage<TSurface>[];
  coneImages: CraneConstructionImage<TSurface>[];
  robotJackhammerImages: CraneConstructionImage<TSurface>[][];
  robotPaperImages: CraneConstructionImage<TSurface>[][];
  robotPointImages: CraneConstructionImage<TSurface>[][];
  robotTravelLeftImages: CraneConstructionImage<TSurface>[];
  robotTravelRightImages: CraneConstructionImage<TSurface>[];
  robotTravelUpDownImages: CraneConstructionImage<TSurface>[];
  concreteWidth: number;
  concreteHeight: number;
  coneWidth: number;
  coneHeight: number;
  signWidth: number;
  signHeight: number;
  finishedInit: boolean;
};

/**
 * Adaptation support for upstream `ECraneConco::BeginDeath`.
 * Role: Represents the crane construction effect fields touched when death starts.
 * Upstream: ecraneconco.cpp:500-511
 */
export type CraneConstructionDeathState = {
  travelBack: boolean;
  travelTimeStart: number;
  travelTimeEnd: number;
  travelTimeWidth: number;
  renderItems: readonly CraneConstructionReturnItem[];
};

/**
 * Port of upstream `MoveToDest`.
 * Role: Snaps a crane construction item to its destination coordinates.
 * Upstream: ecraneconco.h:61-65
 */
export function moveCraneConstructionItemToDestination(
  item: CraneConstructionDestinationState,
): void {
  item.x = item.destX;
  item.y = item.destY;
}

/**
 * Port of upstream `SetTravelDistances`.
 * Role: Calculates crane construction item travel deltas from start to destination.
 * Upstream: ecraneconco.h:49-53
 */
export function setCraneConstructionTravelDistances(
  item: CraneConstructionTravelDistanceState,
): void {
  item.widthDistance = item.destX - item.startX;
  item.heightDistance = item.destY - item.startY;
}

/**
 * Port of upstream `SetReturn`.
 * Role: Sets a crane construction item return destination around a target center.
 * Upstream: ecraneconco.h:40-47
 */
export function setCraneConstructionItemReturn(
  item: CraneConstructionTravelDistanceState & { width: number },
  centerX: number,
  centerY: number,
): void {
  item.startX = item.x;
  item.startY = item.y;
  item.destX = centerX - (item.width >> 1);
  item.destY = centerY - (item.height >> 1);
  setCraneConstructionTravelDistances(item);
}

/**
 * Port of upstream `SetStart`.
 * Role: Centers a crane construction item on its starting coordinates.
 * Upstream: ecraneconco.h:34-38
 */
export function setCraneConstructionItemStart(
  item: CraneConstructionStartState,
  x: number,
  y: number,
): void {
  const centeredX = x - (item.width >> 1);
  const centeredY = y - (item.width >> 1);
  item.startX = centeredX;
  item.x = centeredX;
  item.startY = centeredY;
  item.y = centeredY;
}

/**
 * Port of upstream `ECraneConco::SetBotInitCords`.
 * Role: Selects initial construction robot destination coordinates around a building or bridge.
 * Upstream: ecraneconco.cpp:175-242
 */
export function setCraneConstructionBotInitialCoordinates(
  input: CraneConstructionBotInitialCoordinateInput,
  randomInteger: CraneConstructionRandomInteger = getRandomCraneConstructionInteger,
): CraneConstructionCoordinates | null {
  const {
    isBridge,
    craneCenterX,
    craneCenterY,
    buildingX,
    buildingY,
    buildingWidth,
    buildingHeight,
  } = input;

  if (buildingWidth - 16 <= 0) return null;
  if (buildingHeight - 16 <= 0) return null;

  const buildingCenterX = buildingX + (buildingWidth >> 1);
  const buildingCenterY = buildingY + (buildingHeight >> 1);

  if (!isBridge) {
    return {
      x: buildingX + randomInteger(buildingWidth - 16),
      y:
        buildingY +
        buildingHeight +
        CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE +
        randomInteger(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX),
    };
  }

  if (buildingWidth > buildingHeight) {
    if (randomInteger(2)) {
      if (craneCenterX > buildingCenterX) {
        return {
          x:
            buildingX +
            buildingWidth +
            CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE +
            randomInteger(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX),
          y: buildingY + randomInteger(buildingHeight - 16),
        };
      }

      return {
        x:
          buildingX -
          (CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE +
            randomInteger(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX)),
        y: buildingY + randomInteger(buildingHeight - 16),
      };
    }

    return {
      x: buildingX + randomInteger(buildingWidth - 16),
      y: buildingY + 16 + randomInteger(16),
    };
  }

  if (randomInteger(2)) {
    if (craneCenterY < buildingCenterY) {
      return {
        x: buildingX + randomInteger(buildingWidth - 16),
        y:
          buildingY -
          (CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE +
            randomInteger(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX)) +
          16,
      };
    }

    return {
      x: buildingX + randomInteger(buildingWidth - 16),
      y:
        buildingY +
        buildingHeight +
        CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE +
        randomInteger(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX),
    };
  }

  return {
    x: buildingX + 16 + randomInteger(16),
    y: buildingY + randomInteger(buildingHeight - 16),
  };
}

function getRandomCraneConstructionInteger(maxExclusive: number): number {
  return Math.trunc(Math.random() * maxExclusive);
}

/**
 * Port of upstream `ECraneConco::Process`.
 * Role: Advances crane construction robot frames and travel animations.
 * Upstream: ecraneconco.cpp:329-425
 */
export function processCraneConstructionEffect(
  state: CraneConstructionProcessState,
  currentTime: number,
  randomInteger: CraneConstructionRandomInteger = getRandomCraneConstructionInteger,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextJackbotTime) {
    state.nextJackbotTime = currentTime + 0.045 + randomInteger(20) * 0.001;
    state.jackbotIndex = state.jackbotIndex ? 0 : 1;
  }

  if (currentTime >= state.nextPaperBotTime) {
    state.nextPaperBotTime = currentTime + 0.15 + randomInteger(20) * 0.01;

    if (state.paperBotPointing) {
      if (state.paperBotIndex >= 2) {
        state.paperBotIndex = 0;
        state.paperBotPointing = false;
      } else {
        state.paperBotIndex += 1;
        state.nextPaperBotTime = currentTime + 0.3 + randomInteger(30) * 0.01;
      }
    } else if (!randomInteger(10)) {
      state.paperBotIndex = 0;
      state.paperBotPointing = true;
    } else {
      state.paperBotIndex = state.paperBotIndex ? 0 : 1;
    }
  }

  if (state.travelTo) {
    if (currentTime < state.travelTimeEnd) {
      const percentage =
        (currentTime - state.travelTimeStart) / state.travelTimeWidth;
      state.concreteIndex = clampCraneConstructionFrame(
        Math.trunc(7 * (1 - percentage)),
      );
      state.signIndex = state.concreteIndex;

      for (const item of state.renderItems) {
        item.move(percentage);
      }
    } else {
      state.travelTo = false;
      state.concreteIndex = 0;

      for (const item of state.renderItems) {
        item.moveToDestination();
      }
    }

    sortCraneConstructionRenderItems(state.renderItemList);
  } else if (state.travelBack) {
    if (currentTime < state.travelTimeEnd) {
      const percentage =
        (currentTime - state.travelTimeStart) / state.travelTimeWidth;
      state.concreteIndex = clampCraneConstructionFrame(
        Math.trunc(7 * percentage),
      );
      state.signIndex = state.concreteIndex;

      for (const item of state.renderItems) {
        item.move(percentage);
      }

      sortCraneConstructionRenderItems(state.renderItemList);
    } else {
      state.travelBack = false;
      state.killMe = true;
    }
  }
}

function clampCraneConstructionFrame(frame: number): number {
  if (frame < 0) return 0;
  if (frame > 7) return 7;
  return frame;
}

function sortCraneConstructionRenderItems(
  items: CraneConstructionItem[],
): void {
  items.sort((first, second) => {
    if (compareCraneConstructionRenderItemBottom(first, second)) return -1;
    if (compareCraneConstructionRenderItemBottom(second, first)) return 1;
    return 0;
  });
}

/**
 * Replacement for upstream `ECraneConco::DoRender`.
 * Role: Builds map-relative render commands for crane construction effect items.
 * Upstream: ecraneconco.cpp:427-498
 */
export function renderCraneConstructionEffect<TSurface>(
  state: CraneConstructionRenderState<TSurface>,
  zmap: {
    renderZSurface(
      surface: TSurface,
      x: number,
      y: number,
      renderHit: boolean,
      aboutCenter: boolean,
    ): MapSurfaceRenderCommand<TSurface>;
  },
): Array<MapSurfaceRenderCommand<TSurface>> {
  if (state.killMe) return [];

  const commands: Array<MapSurfaceRenderCommand<TSurface>> = [];

  for (const item of state.renderItemList) {
    const surface = getCraneConstructionRenderSurface(state, item);
    if (!surface) continue;

    commands.push(zmap.renderZSurface(surface, item.x, item.y, false, false));
  }

  return commands;
}

function getCraneConstructionRenderSurface<TSurface>(
  state: CraneConstructionRenderState<TSurface>,
  item: CraneConstructionRenderItemState,
): TSurface | null | undefined {
  switch (item.type) {
    case CraneConstructionRenderItem.Concrete:
      return state.concreteImages[state.team]?.[state.concreteIndex];
    case CraneConstructionRenderItem.Sign:
      return state.travelBack || state.travelTo
        ? state.signFlipImages[state.team]?.[state.signIndex]
        : state.signImages[state.team];
    case CraneConstructionRenderItem.ConeVariant0:
    case CraneConstructionRenderItem.ConeVariant1:
      return state.travelBack || state.travelTo
        ? state.coneNoShadowImages[state.team]
        : state.coneImages[state.team];
    case CraneConstructionRenderItem.Jack:
      return state.travelBack || state.travelTo
        ? getCraneConstructionTravelSurface(state, item.widthDistance)
        : state.robotJackhammerImages[state.team]?.[state.jackbotIndex];
    case CraneConstructionRenderItem.Paper:
      if (state.travelBack || state.travelTo) {
        return getCraneConstructionTravelSurface(state, item.widthDistance);
      }

      return state.paperBotPointing
        ? state.robotPointImages[state.team]?.[state.paperBotIndex]
        : state.robotPaperImages[state.team]?.[state.paperBotIndex];
    default:
      return null;
  }
}

function getCraneConstructionTravelSurface<TSurface>(
  state: CraneConstructionRenderState<TSurface>,
  widthDistance: number,
): TSurface | null | undefined {
  if (widthDistance > 0) return state.robotTravelRightImages[state.team];
  if (widthDistance < 0) return state.robotTravelLeftImages[state.team];
  return state.robotTravelUpDownImages[state.team];
}

/**
 * Port of upstream `ECraneConco::BeginDeath`.
 * Role: Starts the return animation for every crane construction render item.
 * Upstream: ecraneconco.cpp:500-511
 */
export function beginCraneConstructionDeath(
  state: CraneConstructionDeathState,
  centerX: number,
  centerY: number,
  currentTime: number,
): void {
  state.travelBack = true;
  state.travelTimeStart = currentTime;
  state.travelTimeEnd = state.travelTimeStart + state.travelTimeWidth;

  for (const item of state.renderItems) {
    item.setReturn(centerX + 16, centerY + 16);
  }
}

/**
 * Port of upstream `ECraneConco::Init`.
 * Role: Initializes team-colored crane construction effect images and cached dimensions.
 * Upstream: ecraneconco.cpp:244-327
 */
export function initCraneConstructionEffect<
  TSurface extends CraneConstructionSurfaceDimensions,
>(
  state: CraneConstructionInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const teamName = TEAM_RENDERING_TEAM_NAMES[team];

    for (let frame = 0; frame < 8; frame += 1) {
      loadCraneConstructionTeamImage(
        team,
        state.concoImages[TEAM_RENDERING_BASE_TEAM]?.[frame],
        state.concoImages[team]?.[frame],
        `assets/units/vehicles/crane/effects/conco_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
      loadCraneConstructionTeamImage(
        team,
        state.signFlipImages[TEAM_RENDERING_BASE_TEAM]?.[frame],
        state.signFlipImages[team]?.[frame],
        `assets/units/vehicles/crane/effects/sign_flip_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }

    loadCraneConstructionTeamImage(
      team,
      state.signImages[TEAM_RENDERING_BASE_TEAM],
      state.signImages[team],
      `assets/units/vehicles/crane/effects/sign_${teamName}.png`,
      makeTeamSurface,
    );
    loadCraneConstructionTeamImage(
      team,
      state.coneNoShadowImages[TEAM_RENDERING_BASE_TEAM],
      state.coneNoShadowImages[team],
      `assets/units/vehicles/crane/effects/cone_no_shadow_${teamName}.png`,
      makeTeamSurface,
    );
    loadCraneConstructionTeamImage(
      team,
      state.coneImages[TEAM_RENDERING_BASE_TEAM],
      state.coneImages[team],
      `assets/units/vehicles/crane/effects/cone_${teamName}.png`,
      makeTeamSurface,
    );

    for (let frame = 0; frame < 2; frame += 1) {
      loadCraneConstructionTeamImage(
        team,
        state.robotJackhammerImages[TEAM_RENDERING_BASE_TEAM]?.[frame],
        state.robotJackhammerImages[team]?.[frame],
        `assets/units/vehicles/crane/effects/robot_jackhammer_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
      loadCraneConstructionTeamImage(
        team,
        state.robotPaperImages[TEAM_RENDERING_BASE_TEAM]?.[frame],
        state.robotPaperImages[team]?.[frame],
        `assets/units/vehicles/crane/effects/robot_paper_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }

    for (let frame = 0; frame < 3; frame += 1) {
      loadCraneConstructionTeamImage(
        team,
        state.robotPointImages[TEAM_RENDERING_BASE_TEAM]?.[frame],
        state.robotPointImages[team]?.[frame],
        `assets/units/vehicles/crane/effects/robot_point_${teamName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }

    loadCraneConstructionTeamImage(
      team,
      state.robotTravelLeftImages[TEAM_RENDERING_BASE_TEAM],
      state.robotTravelLeftImages[team],
      `assets/units/vehicles/crane/effects/robot_travel_left_${teamName}.png`,
      makeTeamSurface,
    );
    loadCraneConstructionTeamImage(
      team,
      state.robotTravelRightImages[TEAM_RENDERING_BASE_TEAM],
      state.robotTravelRightImages[team],
      `assets/units/vehicles/crane/effects/robot_travel_right_${teamName}.png`,
      makeTeamSurface,
    );
    loadCraneConstructionTeamImage(
      team,
      state.robotTravelUpDownImages[TEAM_RENDERING_BASE_TEAM],
      state.robotTravelUpDownImages[team],
      `assets/units/vehicles/crane/effects/robot_travel_updown_${teamName}.png`,
      makeTeamSurface,
    );
  }

  const concreteSurface =
    state.concoImages[TeamType.Red]?.[0]?.getBaseSurface();
  if (concreteSurface) {
    state.concreteWidth = getCraneConstructionSurfaceWidth(concreteSurface);
    state.concreteHeight = getCraneConstructionSurfaceHeight(concreteSurface);
  }

  const coneSurface = state.coneImages[TeamType.Red]?.getBaseSurface();
  if (coneSurface) {
    state.coneWidth = getCraneConstructionSurfaceWidth(coneSurface);
    state.coneHeight = getCraneConstructionSurfaceHeight(coneSurface);
  }

  const signSurface = state.signImages[TeamType.Red]?.getBaseSurface();
  if (signSurface) {
    state.signWidth = getCraneConstructionSurfaceWidth(signSurface);
    state.signHeight = getCraneConstructionSurfaceHeight(signSurface);
  }

  state.finishedInit = true;
}

function loadCraneConstructionTeamImage<
  TSurface extends CraneConstructionSurfaceDimensions,
>(
  team: TeamType | number,
  baseImage: CraneConstructionImage<TSurface> | undefined,
  targetImage: CraneConstructionImage<TSurface> | undefined,
  filename: string,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  if (!baseImage || !targetImage) return;
  loadTeamZSurface(team, baseImage, targetImage, filename, makeTeamSurface);
}

function getCraneConstructionSurfaceWidth(
  surface: CraneConstructionSurfaceDimensions,
): number {
  return surface.width ?? surface.w ?? 0;
}

function getCraneConstructionSurfaceHeight(
  surface: CraneConstructionSurfaceDimensions,
): number {
  return surface.height ?? surface.h ?? 0;
}

/**
 * Replacement for upstream `ecc_render_item_comp`.
 * Role: Compares crane construction render items by their bottom edge for draw ordering.
 * Upstream: ecraneconco.cpp:513-519
 */
export function compareCraneConstructionRenderItemBottom(
  first: Pick<CraneConstructionItem, "y" | "height">,
  second: Pick<CraneConstructionItem, "y" | "height">,
): boolean {
  return first.y + first.height < second.y + second.height;
}

/**
 * Port of upstream `travel_time_width`.
 * Role: Defines the width of the crane construction travel animation window.
 * Upstream: ecraneconco.h:125, ecraneconco.cpp:3
 */
export const CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH = 0.8;

/**
 * Port of upstream `conco_dist_from_entrace`.
 * Role: Defines the construction concrete offset from the building entrance.
 * Upstream: ecraneconco.cpp:92
 */
export const CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE = 12;

/**
 * Port of upstream `cone_dist_from_entrace`.
 * Role: Defines the construction cone offset from the building entrance.
 * Upstream: ecraneconco.cpp:93
 */
export const CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE = 6;

/**
 * Port of upstream `cone_dist_from_center`.
 * Role: Defines the construction cone offset from the construction effect center.
 * Upstream: ecraneconco.cpp:94
 */
export const CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER = 18;

/**
 * Port of upstream `sign_dist_from_conco`.
 * Role: Defines the construction sign offset from the concrete construction piece.
 * Upstream: ecraneconco.cpp:95
 */
export const CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE = 6;

/**
 * Port of upstream `dist_from_entrance`.
 * Role: Defines the base crane construction effect offset from the building entrance.
 * Upstream: ecraneconco.cpp:177
 */
export const CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE = 16;

/**
 * Port of upstream `dist_from_entrance_box`.
 * Role: Defines the box-size entrance offset for the crane construction effect.
 * Upstream: ecraneconco.cpp:178
 */
export const CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX = 32;
