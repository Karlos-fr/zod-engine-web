/**
 * Upstream: map_editor.cpp
 */

import type { MapObject } from "./MapFormat";
import type { MapBasics } from "./MapBasics";
import type { TeamType } from "../simulation/SimulationConstants";

export type MapEditorHoverObject = {
  getCoordinates(): { x: number; y: number };
};

export type MapEditorHoverObjectState<T extends MapEditorHoverObject> = {
  hoverMapTile: number;
  hoverObject: T | null;
};

export type MapEditorPlacementStampObject = {
  dontStamp(dontStamp: boolean): void;
};

export type MapEditorPlacementBuildingLevelObject = {
  setLevel(level: number): void;
};

export type MapEditorPlacementTeamObject = {
  setOwner(team: TeamType): void;
};

export type MapEditorPlacementObjects<T> = {
  fortFront: T;
  fortBack: T;
  repair: T;
  radar: T;
  robot: T;
  vehicle: T;
  bridgeVertical: T;
  bridgeHorizontal: T;
};

export type MapEditorPlacementTeamObjects<T> = MapEditorPlacementObjects<T> & {
  flag: T;
  gatling: T;
  gun: T;
  howitzer: T;
  missileCannon: T;
  jeep: T;
  light: T;
  medium: T;
  heavy: T;
  apc: T;
  missileLauncher: T;
  crane: T;
  grunt: T;
  psycho: T;
  sniper: T;
  tough: T;
  pyro: T;
  laser: T;
};

/**
 * Port of upstream `object_exists_at`.
 * Role: Reports whether the edited map contains an object at the requested tile coordinate.
 * Upstream: map_editor.cpp:2556-2563
 */
export function objectExistsAt(
  objects: readonly MapObject[],
  x: number,
  y: number,
): boolean {
  return objects.some((object) => object.x === x && object.y === y);
}

/**
 * Port of upstream `set_placement_objects_stamp`.
 * Role: Marks every map editor placement object to skip map stamping.
 * Upstream: map_editor.cpp:2490-2500
 */
export function setPlacementObjectsStamp<T extends MapEditorPlacementStampObject>(
  objects: MapEditorPlacementObjects<T>,
): void {
  objects.fortFront.dontStamp(true);
  objects.fortBack.dontStamp(true);
  objects.repair.dontStamp(true);
  objects.radar.dontStamp(true);
  objects.robot.dontStamp(true);
  objects.vehicle.dontStamp(true);
  objects.bridgeVertical.dontStamp(true);
  objects.bridgeHorizontal.dontStamp(true);
}

/**
 * Port of upstream `set_placement_objects_blevel`.
 * Role: Applies the selected building level to every map editor placement building.
 * Upstream: map_editor.cpp:2502-2512
 */
export function setPlacementObjectsBuildingLevel<
  T extends MapEditorPlacementBuildingLevelObject,
>(
  objects: MapEditorPlacementObjects<T>,
  buildingLevel: number,
): void {
  objects.fortFront.setLevel(buildingLevel);
  objects.fortBack.setLevel(buildingLevel);
  objects.repair.setLevel(buildingLevel);
  objects.radar.setLevel(buildingLevel);
  objects.robot.setLevel(buildingLevel);
  objects.vehicle.setLevel(buildingLevel);
  objects.bridgeVertical.setLevel(buildingLevel);
  objects.bridgeHorizontal.setLevel(buildingLevel);
}

/**
 * Port of upstream `set_placement_objects_team`.
 * Role: Applies the selected owner team to every map editor placement object prototype.
 * Upstream: map_editor.cpp:2460-2488
 */
export function setPlacementObjectsTeam<T extends MapEditorPlacementTeamObject>(
  objects: MapEditorPlacementTeamObjects<T>,
  team: TeamType,
): void {
  objects.fortFront.setOwner(team);
  objects.fortBack.setOwner(team);
  objects.repair.setOwner(team);
  objects.radar.setOwner(team);
  objects.robot.setOwner(team);
  objects.vehicle.setOwner(team);
  objects.bridgeVertical.setOwner(team);
  objects.bridgeHorizontal.setOwner(team);
  objects.flag.setOwner(team);
  objects.gatling.setOwner(team);
  objects.gun.setOwner(team);
  objects.howitzer.setOwner(team);
  objects.missileCannon.setOwner(team);
  objects.jeep.setOwner(team);
  objects.light.setOwner(team);
  objects.medium.setOwner(team);
  objects.heavy.setOwner(team);
  objects.apc.setOwner(team);
  objects.missileLauncher.setOwner(team);
  objects.crane.setOwner(team);
  objects.grunt.setOwner(team);
  objects.psycho.setOwner(team);
  objects.sniper.setOwner(team);
  objects.tough.setOwner(team);
  objects.pyro.setOwner(team);
  objects.laser.setOwner(team);
}

/**
 * Port of upstream `check_hover_object`.
 * Role: Updates the map editor hover object from the currently hovered map tile.
 * Upstream: map_editor.cpp:2514-2554
 */
export function checkHoverObject<T extends MapEditorHoverObject>(
  state: MapEditorHoverObjectState<T>,
  objects: readonly T[],
  mapBasics: Pick<MapBasics, "width">,
): boolean {
  if (state.hoverMapTile === -1) {
    if (state.hoverObject) {
      state.hoverObject = null;
      return true;
    }

    return false;
  }

  const mapTileX = state.hoverMapTile % mapBasics.width;
  const mapTileY = Math.trunc(state.hoverMapTile / mapBasics.width);
  const mapTilePixelX = mapTileX * 16;
  const mapTilePixelY = mapTileY * 16;

  for (const object of objects) {
    const coordinates = object.getCoordinates();

    if (coordinates.x === mapTilePixelX && coordinates.y === mapTilePixelY) {
      state.hoverObject = object;
      return true;
    }
  }

  if (state.hoverObject) {
    state.hoverObject = null;
    return true;
  }

  return false;
}
