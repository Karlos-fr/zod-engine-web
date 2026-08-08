/**
 * Upstream: oflag.h, oflag.cpp
 */

import { MapObjectType, type MapZoneInfo } from "../world/MapFormat";
import type { SurfaceBlitRegion } from "../rendering/SurfacePixels";
import {
  BuildingType,
  ACTIVE_TEAM_TYPE_COUNT,
  type TeamType,
} from "./SimulationConstants";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  type TeamSurfaceFactory,
} from "./TeamRendering";

/**
 * Port of upstream `_OFLAG_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: oflag.h:2
 */
export const OFLAG_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `int_time`.
 * Role: Defines the minimum elapsed time between flag animation frame advances.
 * Upstream: oflag.cpp:39
 */
export const FLAG_ANIMATION_INTERVAL_SECONDS = 0.2;

export type FlagImage<TSurface> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

export type FlagImageInitState<TSurface> = {
  flagImages: readonly (readonly FlagImage<TSurface>[])[];
};

/**
 * Replacement for upstream `ZMap::GetBlitInfo` dependency.
 * Role: Calculates visible source and destination rectangles for flag rendering.
 * Upstream: oflag.cpp:62
 */
export type FlagRenderMap<TSurface> = {
  getBlitInfo(
    surface: TSurface | null,
    x: number,
    y: number,
  ): SurfaceBlitRegion | null;
};

/**
 * Replacement state for upstream `OFlag::DoRender`.
 * Role: Holds the active team flag frame and map-space location used for rendering.
 * Upstream: oflag.cpp:52-70
 */
export type FlagRenderState<TImage> = {
  x: number;
  y: number;
  owner: number;
  flagIndex: number;
  flagImages: readonly (readonly (TImage | null | undefined)[])[];
};

/**
 * Replacement for upstream `ZSDL_Surface::BlitSurface`.
 * Role: Describes the clipped flag blit requested by object rendering.
 * Upstream: oflag.cpp:67
 */
export type FlagBlitCommand<TImage> = {
  flagImage: TImage;
  region: SurfaceBlitRegion;
};

const FLAG_ANIMATION_FRAME_COUNT = 4;
const FLAG_TEAM_TYPE_ASSET_NAMES = [
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
 * Port of upstream `OFlag::Init`.
 * Role: Initializes flag animation images for every active team and frame.
 * Upstream: oflag.cpp:21-34
 */
export function initFlagObjectImages<TSurface>(
  state: FlagImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  for (let team = 0; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let frame = 0; frame < FLAG_ANIMATION_FRAME_COUNT; frame += 1) {
      const baseImage = state.flagImages[TEAM_RENDERING_BASE_TEAM]?.[frame];
      const flagImage = state.flagImages[team]?.[frame];
      if (!baseImage || !flagImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        flagImage,
        `assets/other/flag_${FLAG_TEAM_TYPE_ASSET_NAMES[team]}_${frame}.png`,
        makeTeamSurface,
      );
    }
  }
}

/**
 * Replacement for upstream `OFlag::DoRender`.
 * Role: Builds a shifted, clipped blit command for a flag object.
 * Upstream: oflag.cpp:52-70
 */
export function renderFlagObject<
  TSurface extends { width: number; height: number },
  TImage extends FlagImage<TSurface>,
>(
  state: FlagRenderState<TImage>,
  map: FlagRenderMap<TSurface>,
  shiftX: number,
  shiftY: number,
): FlagBlitCommand<TImage> | null {
  const flagImage = state.flagImages[state.owner]?.[state.flagIndex];
  if (!flagImage) return null;

  const region = map.getBlitInfo(flagImage.getBaseSurface(), state.x, state.y);
  if (!region) return null;

  return {
    flagImage,
    region: {
      ...region,
      destinationX: region.destinationX + shiftX,
      destinationY: region.destinationY + shiftY,
    },
  };
}

/**
 * Port of upstream `OFlag::HasRadar` connected object dependency.
 * Role: Supplies the object type/id pair read via upstream `GetObjectID`.
 * Upstream: oflag.cpp:113-119
 */
export type FlagConnectedObject = {
  getObjectId(): {
    objectType: number;
    objectId: number;
  };
};

/**
 * Port of upstream `OFlag::SetZone` mutable fields.
 * Role: Stores the connected zone, flag owner, and zone-connected objects.
 * Upstream: oflag.h:28-29, oflag.cpp:72-99
 */
export type FlagZoneState<TObject> = {
  owner: TeamType;
  connectedZone: MapZoneInfo | null;
  connectedObjectList: TObject[];
};

/**
 * Port of upstream `OFlag::SetZone` object dependency surface.
 * Role: Supplies identity, map coordinates, and owner mutation for connectable objects.
 * Upstream: oflag.cpp:82-97
 */
export type FlagZoneObject = {
  getObjectId(): {
    objectType: number;
    objectId: number;
  };
  getCoordinates(): {
    x: number;
    y: number;
  };
  setOwner(owner: TeamType): void;
};

/**
 * Port of upstream `OFlag::SetZone` map dependency surface.
 * Role: Resolves the map zone at object coordinates.
 * Upstream: oflag.cpp:93
 */
export type FlagZoneMap = {
  getZone(x: number, y: number): MapZoneInfo | null;
};

/**
 * Port of upstream `OFlag::Process` mutable fields.
 * Role: Stores flag animation timing and current frame index.
 * Upstream: oflag.cpp:36-50
 */
export type FlagProcessState = {
  lastProcessTime: number;
  flagIndex: number;
};

/**
 * Port of upstream `OFlag::Process`.
 * Role: Advances the flag animation frame at the upstream fixed interval.
 * Upstream: oflag.cpp:36-50
 */
export function processFlagObject(
  state: FlagProcessState,
  currentTime: number,
): number {
  if (currentTime - state.lastProcessTime >= FLAG_ANIMATION_INTERVAL_SECONDS) {
    state.lastProcessTime = currentTime;
    state.flagIndex += 1;
    if (state.flagIndex > 3) state.flagIndex = 0;
  }

  return 1;
}

/**
 * Port of upstream `OFlag::SetZone`.
 * Role: Connects the flag to a zone and claims buildings located in that same zone.
 * Upstream: oflag.cpp:72-99
 */
export function setFlagZone<TObject extends FlagZoneObject>(
  state: FlagZoneState<TObject>,
  zone: MapZoneInfo,
  map: FlagZoneMap,
  objectList: readonly TObject[],
): void {
  state.connectedZone = zone;
  zone.owner = state.owner;
  state.connectedObjectList = [];

  for (const object of objectList) {
    const { objectType } = object.getObjectId();
    if (objectType !== MapObjectType.Building) continue;

    const { x, y } = object.getCoordinates();
    if (state.connectedZone !== map.getZone(x, y)) continue;

    state.connectedObjectList.push(object);
    object.setOwner(state.owner);
  }
}

/**
 * Port of upstream `OFlag::HasRadar`.
 * Role: Reports whether any connected object is a radar building.
 * Upstream: oflag.cpp:111-124
 */
export function flagHasRadar(connectedObjects: FlagConnectedObject[]): boolean {
  return connectedObjects.some(({ getObjectId }) => {
    const { objectType, objectId } = getObjectId();
    return objectType === MapObjectType.Building && objectId === BuildingType.Radar;
  });
}
