import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { ItemType } from "../src/simulation/SimulationConstants";
import {
  ObjectLists,
  type ObjectListsObjectReference,
  ZOLISTS_HEADER_GUARD_PORTED,
} from "../src/simulation/ObjectLists";
import { MapObjectType } from "../src/world/MapFormat";

describe("object lists", () => {
  it("adapts the zolists.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ObjectLists");
    const secondImport = await import("../src/simulation/ObjectLists");

    expect(ZOLISTS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZOLISTS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZOLISTS_HEADER_GUARD_PORTED,
    );
  });

  it("ports the object-list ZObject forward declaration as an entity reference", () => {
    const entity = new GameEntity({
      id: "listed-object",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const reference: ObjectListsObjectReference = entity;

    expect(reference).toBe(entity);
  });

  it("initializes categorized object lists to empty lists", () => {
    expect(new ObjectLists()).toMatchObject({
      objectList: null,
      flagObjectList: [],
      cannonObjectList: [],
      buildingObjectList: [],
      rockObjectList: [],
      passiveEngagableObjectList: [],
      mobileObjectList: [],
      prerenderObjectList: [],
      nonMapItemObjectList: [],
      grenadesObjectList: [],
    });
  });

  it("ports Init as storing the master object list reference", () => {
    const objectLists = new ObjectLists();
    const entities = [
      new GameEntity({
        id: "listed-object-1",
        kind: "robot",
        position: { x: 1, y: 2 },
      }),
    ];

    objectLists.init(entities);

    expect(objectLists.objectList).toBe(entities);
  });

  it("ports DeleteAllObjects as disposal and clearing of every object list", () => {
    const objectLists = new ObjectLists();
    const first = new GameEntity({
      id: "deleted-object-1",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const second = new GameEntity({
      id: "deleted-object-2",
      kind: "vehicle",
      position: { x: 3, y: 4 },
    });
    const masterList = [first, second];
    const disposed: GameEntity[] = [];

    objectLists.init(masterList);
    objectLists.flagObjectList = [first];
    objectLists.cannonObjectList = [second];
    objectLists.buildingObjectList = [first];
    objectLists.rockObjectList = [second];
    objectLists.passiveEngagableObjectList = [first];
    objectLists.mobileObjectList = [second];
    objectLists.prerenderObjectList = [first];
    objectLists.nonMapItemObjectList = [second];
    objectLists.grenadesObjectList = [first];

    objectLists.deleteAllObjects((object) => {
      disposed.push(object);
    });

    expect(disposed).toEqual([first, second]);
    expect(masterList).toEqual([]);
    expect(objectLists.flagObjectList).toEqual([]);
    expect(objectLists.cannonObjectList).toEqual([]);
    expect(objectLists.buildingObjectList).toEqual([]);
    expect(objectLists.rockObjectList).toEqual([]);
    expect(objectLists.passiveEngagableObjectList).toEqual([]);
    expect(objectLists.mobileObjectList).toEqual([]);
    expect(objectLists.prerenderObjectList).toEqual([]);
    expect(objectLists.nonMapItemObjectList).toEqual([]);
    expect(objectLists.grenadesObjectList).toEqual([]);
  });

  it("ports DeleteAllObjects as clearing categorized lists without a master list", () => {
    const objectLists = new ObjectLists();
    const object = new GameEntity({
      id: "listed-object",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const disposed: GameEntity[] = [];

    objectLists.flagObjectList = [object];
    objectLists.deleteAllObjects((disposedObject) => {
      disposed.push(disposedObject);
    });

    expect(disposed).toEqual([]);
    expect(objectLists.objectList).toBeNull();
    expect(objectLists.flagObjectList).toEqual([]);
  });

  it("ports AddObject as master-list insertion and object classification", () => {
    const objectLists = new ObjectLists();
    const cannon = new GameEntity({
      id: "cannon-object",
      kind: "cannon",
      position: { x: 1, y: 2 },
      objectType: MapObjectType.Cannon,
      objectId: 0,
    });
    const building = new GameEntity({
      id: "building-object",
      kind: "building",
      position: { x: 3, y: 4 },
      objectType: MapObjectType.Building,
      objectId: 0,
    });
    const robot = new GameEntity({
      id: "robot-object",
      kind: "robot",
      position: { x: 5, y: 6 },
      objectType: MapObjectType.Robot,
      objectId: 0,
    });
    const vehicle = new GameEntity({
      id: "vehicle-object",
      kind: "vehicle",
      position: { x: 7, y: 8 },
      objectType: MapObjectType.Vehicle,
      objectId: 0,
    });
    const flag = new GameEntity({
      id: "flag-item",
      kind: "map-item",
      position: { x: 9, y: 10 },
      objectType: MapObjectType.MapItem,
      objectId: ItemType.Flag,
    });
    const rock = new GameEntity({
      id: "rock-item",
      kind: "map-item",
      position: { x: 11, y: 12 },
      objectType: MapObjectType.MapItem,
      objectId: ItemType.Rock,
    });
    const grenades = new GameEntity({
      id: "grenades-item",
      kind: "map-item",
      position: { x: 13, y: 14 },
      objectType: MapObjectType.MapItem,
      objectId: ItemType.Grenades,
    });

    for (const object of [cannon, building, robot, vehicle, flag, rock, grenades]) {
      objectLists.addObject(object);
    }

    expect(objectLists.objectList).toEqual([
      cannon,
      building,
      robot,
      vehicle,
      flag,
      rock,
      grenades,
    ]);
    expect(objectLists.cannonObjectList).toEqual([cannon]);
    expect(objectLists.buildingObjectList).toEqual([building]);
    expect(objectLists.rockObjectList).toEqual([rock]);
    expect(objectLists.passiveEngagableObjectList).toEqual([cannon, robot, vehicle]);
    expect(objectLists.mobileObjectList).toEqual([robot, vehicle]);
    expect(objectLists.prerenderObjectList).toEqual([
      cannon,
      building,
      robot,
      vehicle,
      flag,
      rock,
      grenades,
    ]);
    expect(objectLists.nonMapItemObjectList).toEqual([
      cannon,
      building,
      robot,
      vehicle,
    ]);
    expect(objectLists.flagObjectList).toEqual([flag]);
    expect(objectLists.grenadesObjectList).toEqual([grenades]);
  });

  it("ports AddObject as no-op when object already exists", () => {
    const objectLists = new ObjectLists();
    const robot = new GameEntity({
      id: "robot-object",
      kind: "robot",
      position: { x: 1, y: 2 },
      objectType: MapObjectType.Robot,
      objectId: 0,
    });

    objectLists.addObject(robot);
    objectLists.addObject(robot);

    expect(objectLists.objectList).toEqual([robot]);
    expect(objectLists.passiveEngagableObjectList).toEqual([robot]);
    expect(objectLists.mobileObjectList).toEqual([robot]);
    expect(objectLists.prerenderObjectList).toEqual([robot]);
    expect(objectLists.nonMapItemObjectList).toEqual([robot]);
  });

  it("ports RemoveObjectFromList as in-place removal of matching references", () => {
    const objectLists = new ObjectLists();
    const first = new GameEntity({
      id: "listed-object-1",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const second = new GameEntity({
      id: "listed-object-2",
      kind: "vehicle",
      position: { x: 3, y: 4 },
    });
    const list = [first, second, first];

    objectLists.removeObjectFromList(first, list);

    expect(list).toEqual([second]);
  });

  it("ports RemoveObject as removal from every object-list view", () => {
    const objectLists = new ObjectLists();
    const removed = new GameEntity({
      id: "removed-object",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const kept = new GameEntity({
      id: "kept-object",
      kind: "vehicle",
      position: { x: 3, y: 4 },
    });
    const masterList = [removed, kept, removed];

    objectLists.init(masterList);
    objectLists.flagObjectList = [removed, kept];
    objectLists.cannonObjectList = [kept, removed];
    objectLists.buildingObjectList = [removed];
    objectLists.rockObjectList = [kept];
    objectLists.passiveEngagableObjectList = [removed, kept, removed];
    objectLists.mobileObjectList = [removed];
    objectLists.prerenderObjectList = [kept, removed];
    objectLists.nonMapItemObjectList = [removed, kept];
    objectLists.grenadesObjectList = [removed];

    objectLists.removeObject(removed);

    expect(masterList).toEqual([kept]);
    expect(objectLists.flagObjectList).toEqual([kept]);
    expect(objectLists.cannonObjectList).toEqual([kept]);
    expect(objectLists.buildingObjectList).toEqual([]);
    expect(objectLists.rockObjectList).toEqual([kept]);
    expect(objectLists.passiveEngagableObjectList).toEqual([kept]);
    expect(objectLists.mobileObjectList).toEqual([]);
    expect(objectLists.prerenderObjectList).toEqual([kept]);
    expect(objectLists.nonMapItemObjectList).toEqual([kept]);
    expect(objectLists.grenadesObjectList).toEqual([]);
  });

  it("ports RemoveObject as safe when the master object list is not initialized", () => {
    const objectLists = new ObjectLists();
    const removed = new GameEntity({
      id: "removed-object",
      kind: "robot",
      position: { x: 1, y: 2 },
    });

    objectLists.flagObjectList = [removed];
    objectLists.removeObject(removed);

    expect(objectLists.objectList).toBeNull();
    expect(objectLists.flagObjectList).toEqual([]);
  });

  it("ports DeleteObject as disposal followed by removal from every list", () => {
    const objectLists = new ObjectLists();
    const deleted = new GameEntity({
      id: "deleted-object",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const kept = new GameEntity({
      id: "kept-object",
      kind: "vehicle",
      position: { x: 3, y: 4 },
    });
    const masterList = [deleted, kept, deleted];
    const disposed: GameEntity[] = [];

    objectLists.init(masterList);
    objectLists.flagObjectList = [deleted, kept];
    objectLists.cannonObjectList = [kept, deleted];
    objectLists.buildingObjectList = [deleted];
    objectLists.rockObjectList = [kept];
    objectLists.passiveEngagableObjectList = [deleted, kept, deleted];
    objectLists.mobileObjectList = [deleted];
    objectLists.prerenderObjectList = [kept, deleted];
    objectLists.nonMapItemObjectList = [deleted, kept];
    objectLists.grenadesObjectList = [deleted];

    objectLists.deleteObject(deleted, (object) => {
      disposed.push(object);
      expect(masterList).toEqual([deleted, kept, deleted]);
    });

    expect(disposed).toEqual([deleted]);
    expect(masterList).toEqual([kept]);
    expect(objectLists.flagObjectList).toEqual([kept]);
    expect(objectLists.cannonObjectList).toEqual([kept]);
    expect(objectLists.buildingObjectList).toEqual([]);
    expect(objectLists.rockObjectList).toEqual([kept]);
    expect(objectLists.passiveEngagableObjectList).toEqual([kept]);
    expect(objectLists.mobileObjectList).toEqual([]);
    expect(objectLists.prerenderObjectList).toEqual([kept]);
    expect(objectLists.nonMapItemObjectList).toEqual([kept]);
    expect(objectLists.grenadesObjectList).toEqual([]);
  });

  it("ports SetupFlagList as a rebuild of flag map items", () => {
    const objectLists = new ObjectLists();
    const flag = new GameEntity({
      id: "flag-item",
      kind: "map-item",
      position: { x: 1, y: 2 },
      objectType: MapObjectType.MapItem,
      objectId: ItemType.Flag,
    });
    const grenades = new GameEntity({
      id: "grenades-item",
      kind: "map-item",
      position: { x: 3, y: 4 },
      objectType: MapObjectType.MapItem,
      objectId: ItemType.Grenades,
    });
    const robot = new GameEntity({
      id: "robot-object",
      kind: "robot",
      position: { x: 5, y: 6 },
      objectType: MapObjectType.Robot,
      objectId: 0,
    });

    objectLists.init([flag, grenades, robot]);
    objectLists.flagObjectList = [grenades, robot];

    objectLists.setupFlagList();

    expect(objectLists.flagObjectList).toEqual([flag]);
  });

  it("ports SetupFlagList as clearing flags when the master list is not initialized", () => {
    const objectLists = new ObjectLists();
    const staleFlag = new GameEntity({
      id: "stale-flag",
      kind: "map-item",
      position: { x: 1, y: 2 },
      objectType: MapObjectType.MapItem,
      objectId: ItemType.Flag,
    });

    objectLists.flagObjectList = [staleFlag];
    objectLists.setupFlagList();

    expect(objectLists.objectList).toBeNull();
    expect(objectLists.flagObjectList).toEqual([]);
  });

  it("ports DeleteObjectFromList as disposal followed by in-place removal", () => {
    const objectLists = new ObjectLists();
    const first = new GameEntity({
      id: "deleted-object-1",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const second = new GameEntity({
      id: "deleted-object-2",
      kind: "vehicle",
      position: { x: 3, y: 4 },
    });
    const disposed: GameEntity[] = [];
    const list = [first, second, first];

    objectLists.deleteObjectFromList(first, list, (object) => {
      disposed.push(object);
    });

    expect(disposed).toEqual([first]);
    expect(list).toEqual([second]);
  });
});
