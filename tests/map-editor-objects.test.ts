import { describe, expect, it } from "vitest";
import {
  checkHoverObject,
  objectExistsAt,
  setPlacementObjectsBuildingLevel,
  setPlacementObjectsStamp,
  setPlacementObjectsTeam,
  type MapEditorHoverObjectState,
} from "../src/world/MapEditorObjects";
import { TeamType } from "../src/simulation/SimulationConstants";
import { MapObjectType, type MapObject } from "../src/world/MapFormat";

const mapObjects: MapObject[] = [
  {
    x: 2,
    y: 3,
    owner: 1,
    objectType: MapObjectType.Building,
    objectId: 4,
    buildingLevel: 2,
    extraLinks: 0,
    healthPercent: 100,
  },
  {
    x: 7,
    y: 11,
    owner: -1,
    objectType: MapObjectType.Rock,
    objectId: 1,
    buildingLevel: 0,
    extraLinks: 0,
    healthPercent: 80,
  },
];

describe("map editor objects", () => {
  it("ports object_exists_at as true when an object has the requested tile", () => {
    expect(objectExistsAt(mapObjects, 7, 11)).toBe(true);
  });

  it("ports object_exists_at as false when no object has the requested tile", () => {
    expect(objectExistsAt(mapObjects, 3, 2)).toBe(false);
  });

  it("ports object_exists_at as false for an empty object list", () => {
    expect(objectExistsAt([], 2, 3)).toBe(false);
  });

  it("matches x and y as one exact tile coordinate", () => {
    expect(objectExistsAt(mapObjects, 2, 11)).toBe(false);
    expect(objectExistsAt(mapObjects, 7, 3)).toBe(false);
  });

  it("marks every placement object as skipped for map stamping", () => {
    const objects = {
      fortFront: createPlacementObject(),
      fortBack: createPlacementObject(),
      repair: createPlacementObject(),
      radar: createPlacementObject(),
      robot: createPlacementObject(),
      vehicle: createPlacementObject(),
      bridgeVertical: createPlacementObject(),
      bridgeHorizontal: createPlacementObject(),
    };

    setPlacementObjectsStamp(objects);

    expect(Object.values(objects).map((object) => object.dontStampCalls)).toEqual([
      [true],
      [true],
      [true],
      [true],
      [true],
      [true],
      [true],
      [true],
    ]);
  });

  it("applies the selected building level to every placement building", () => {
    const objects = {
      fortFront: createPlacementObject(),
      fortBack: createPlacementObject(),
      repair: createPlacementObject(),
      radar: createPlacementObject(),
      robot: createPlacementObject(),
      vehicle: createPlacementObject(),
      bridgeVertical: createPlacementObject(),
      bridgeHorizontal: createPlacementObject(),
    };

    setPlacementObjectsBuildingLevel(objects, 3);

    expect(Object.values(objects).map((object) => object.setLevelCalls)).toEqual([
      [3],
      [3],
      [3],
      [3],
      [3],
      [3],
      [3],
      [3],
    ]);
  });

  it("applies the selected team to every placement object prototype", () => {
    const objects = createPlacementTeamObjects();

    setPlacementObjectsTeam(objects, TeamType.Blue);

    expect(Object.values(objects).map((object) => object.setOwnerCalls)).toEqual([
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
      [TeamType.Blue],
    ]);
  });

  it("clears the hover object when no map tile is hovered", () => {
    const object = createHoverObject(16, 32);
    const state: MapEditorHoverObjectState<HoverObject> = {
      hoverMapTile: -1,
      hoverObject: object,
    };

    expect(checkHoverObject(state, [object], { width: 10 })).toBe(true);
    expect(state.hoverObject).toBeNull();
  });

  it("leaves hover state unchanged when no map tile and no object are hovered", () => {
    const state: MapEditorHoverObjectState<HoverObject> = {
      hoverMapTile: -1,
      hoverObject: null,
    };

    expect(checkHoverObject(state, [], { width: 10 })).toBe(false);
    expect(state.hoverObject).toBeNull();
  });

  it("sets the hover object from the hovered map tile pixel position", () => {
    const firstObject = createHoverObject(16, 16);
    const secondObject = createHoverObject(32, 16);
    const state: MapEditorHoverObjectState<HoverObject> = {
      hoverMapTile: 12,
      hoverObject: null,
    };

    expect(checkHoverObject(state, [firstObject, secondObject], { width: 10 })).toBe(
      true,
    );
    expect(state.hoverObject).toBe(secondObject);
  });

  it("clears stale hover objects when no object matches the hovered tile", () => {
    const object = createHoverObject(16, 16);
    const state: MapEditorHoverObjectState<HoverObject> = {
      hoverMapTile: 12,
      hoverObject: object,
    };

    expect(checkHoverObject(state, [object], { width: 10 })).toBe(true);
    expect(state.hoverObject).toBeNull();
  });

  it("returns false when no object matches and no hover object was set", () => {
    const state: MapEditorHoverObjectState<HoverObject> = {
      hoverMapTile: 12,
      hoverObject: null,
    };

    expect(checkHoverObject(state, [createHoverObject(16, 16)], { width: 10 })).toBe(
      false,
    );
    expect(state.hoverObject).toBeNull();
  });
});

type HoverObject = {
  getCoordinates(): { x: number; y: number };
};

function createHoverObject(x: number, y: number): HoverObject {
  return {
    getCoordinates: () => ({ x, y }),
  };
}

function createPlacementObject() {
  return {
    dontStampCalls: [] as boolean[],
    dontStamp(dontStamp: boolean): void {
      this.dontStampCalls.push(dontStamp);
    },
    setLevelCalls: [] as number[],
    setLevel(level: number): void {
      this.setLevelCalls.push(level);
    },
  };
}

function createPlacementTeamObjects() {
  return {
    fortFront: createPlacementTeamObject(),
    fortBack: createPlacementTeamObject(),
    repair: createPlacementTeamObject(),
    radar: createPlacementTeamObject(),
    robot: createPlacementTeamObject(),
    vehicle: createPlacementTeamObject(),
    bridgeVertical: createPlacementTeamObject(),
    bridgeHorizontal: createPlacementTeamObject(),
    flag: createPlacementTeamObject(),
    gatling: createPlacementTeamObject(),
    gun: createPlacementTeamObject(),
    howitzer: createPlacementTeamObject(),
    missileCannon: createPlacementTeamObject(),
    jeep: createPlacementTeamObject(),
    light: createPlacementTeamObject(),
    medium: createPlacementTeamObject(),
    heavy: createPlacementTeamObject(),
    apc: createPlacementTeamObject(),
    missileLauncher: createPlacementTeamObject(),
    crane: createPlacementTeamObject(),
    grunt: createPlacementTeamObject(),
    psycho: createPlacementTeamObject(),
    sniper: createPlacementTeamObject(),
    tough: createPlacementTeamObject(),
    pyro: createPlacementTeamObject(),
    laser: createPlacementTeamObject(),
  };
}

function createPlacementTeamObject() {
  return {
    setOwnerCalls: [] as TeamType[],
    setOwner(team: TeamType): void {
      this.setOwnerCalls.push(team);
    },
  };
}
