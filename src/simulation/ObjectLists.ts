/**
 * Upstream: zolists.h
 */

import type { GameEntity } from "./entities/GameEntity";
import { ItemType } from "./SimulationConstants";
import { MapObjectType } from "../world/MapFormat";

/**
 * Port of upstream `_ZOLISTS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zolists.h:2
 */
export const ZOLISTS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZObject` forward declaration.
 * Role: Provides the entity reference stored by simulation object lists.
 * Upstream: zolists.h:8
 */
export type ObjectListsObjectReference = GameEntity;

/**
 * Port of upstream `ZOLists`.
 * Role: Stores the master object list and categorized object-list views for simulation systems.
 * Upstream: zolists.h:10-36
 */
export class ObjectLists {
  objectList: ObjectListsObjectReference[] | null = null;
  flagObjectList: ObjectListsObjectReference[] = [];
  cannonObjectList: ObjectListsObjectReference[] = [];
  buildingObjectList: ObjectListsObjectReference[] = [];
  rockObjectList: ObjectListsObjectReference[] = [];
  passiveEngagableObjectList: ObjectListsObjectReference[] = [];
  mobileObjectList: ObjectListsObjectReference[] = [];
  prerenderObjectList: ObjectListsObjectReference[] = [];
  nonMapItemObjectList: ObjectListsObjectReference[] = [];
  grenadesObjectList: ObjectListsObjectReference[] = [];

  /**
   * Port of upstream `Init`.
   * Role: Stores the master object list used by categorized object-list operations.
   * Upstream: zolists.h:15
   */
  init(objectList: ObjectListsObjectReference[]): void {
    this.objectList = objectList;
  }

  /**
   * Port of upstream `ZOLists::DeleteAllObjects`.
   * Role: Disposes all master objects and clears every simulation object list.
   * Upstream: zolists.cpp:12-28
   */
  deleteAllObjects(
    dispose: (object: ObjectListsObjectReference) => void = () => {},
  ): void {
    for (const object of this.objectList ?? []) {
      dispose(object);
    }

    this.objectList?.splice(0);
    this.flagObjectList = [];
    this.cannonObjectList = [];
    this.buildingObjectList = [];
    this.rockObjectList = [];
    this.passiveEngagableObjectList = [];
    this.mobileObjectList = [];
    this.prerenderObjectList = [];
    this.nonMapItemObjectList = [];
    this.grenadesObjectList = [];
  }

  /**
   * Port of upstream `ZOLists::AddObject`.
   * Role: Adds an object to the master list and relevant categorized object-list views.
   * Upstream: zolists.cpp:51-74
   */
  addObject(object: ObjectListsObjectReference): void {
    if (!this.objectList) {
      this.objectList = [];
    }

    if (this.objectList.includes(object)) return;

    this.objectList.push(object);

    const objectId = object.getObjectId();
    const objectType = objectId.objectType;
    const itemType = objectId.objectId;

    if (objectType === MapObjectType.Cannon) this.cannonObjectList.push(object);
    if (objectType === MapObjectType.Building) this.buildingObjectList.push(object);
    if (objectType === MapObjectType.MapItem && itemType === ItemType.Rock) {
      this.rockObjectList.push(object);
    }
    if (
      objectType === MapObjectType.Cannon ||
      objectType === MapObjectType.Robot ||
      objectType === MapObjectType.Vehicle
    ) {
      this.passiveEngagableObjectList.push(object);
    }
    if (objectType === MapObjectType.Robot || objectType === MapObjectType.Vehicle) {
      this.mobileObjectList.push(object);
    }

    this.prerenderObjectList.push(object);

    if (objectType !== MapObjectType.MapItem) {
      this.nonMapItemObjectList.push(object);
    }
    if (objectType === MapObjectType.MapItem && itemType === ItemType.Flag) {
      this.flagObjectList.push(object);
    }
    if (objectType === MapObjectType.MapItem && itemType === ItemType.Grenades) {
      this.grenadesObjectList.push(object);
    }
  }

  /**
   * Port of upstream `ZOLists::RemoveObjectFromList`.
   * Role: Removes every occurrence of an object reference from a categorized list in place.
   * Upstream: zolists.cpp:83-92
   */
  removeObjectFromList(
    object: ObjectListsObjectReference,
    objectList: ObjectListsObjectReference[],
  ): void {
    for (let i = objectList.length - 1; i >= 0; i -= 1) {
      if (objectList[i] === object) {
        objectList.splice(i, 1);
      }
    }
  }

  /**
   * Port of upstream `ZOLists::RemoveObject`.
   * Role: Removes every occurrence of an object reference from all simulation object lists.
   * Upstream: zolists.cpp:30-42
   */
  removeObject(object: ObjectListsObjectReference): void {
    if (this.objectList) {
      this.removeObjectFromList(object, this.objectList);
    }

    this.removeObjectFromList(object, this.flagObjectList);
    this.removeObjectFromList(object, this.cannonObjectList);
    this.removeObjectFromList(object, this.buildingObjectList);
    this.removeObjectFromList(object, this.rockObjectList);
    this.removeObjectFromList(object, this.passiveEngagableObjectList);
    this.removeObjectFromList(object, this.mobileObjectList);
    this.removeObjectFromList(object, this.prerenderObjectList);
    this.removeObjectFromList(object, this.nonMapItemObjectList);
    this.removeObjectFromList(object, this.grenadesObjectList);
  }

  /**
   * Port of upstream `ZOLists::DeleteObject`.
   * Role: Disposes one object, then removes it from every simulation object list.
   * Upstream: zolists.cpp:44-49
   */
  deleteObject(
    object: ObjectListsObjectReference,
    dispose: (object: ObjectListsObjectReference) => void = () => {},
  ): void {
    dispose(object);
    this.removeObject(object);
  }

  /**
   * Port of upstream `ZOLists::SetupFlagList`.
   * Role: Rebuilds the categorized list of flag map items from the master object list.
   * Upstream: zolists.cpp:94-106
   */
  setupFlagList(): void {
    this.flagObjectList = [];

    for (const object of this.objectList ?? []) {
      const objectId = object.getObjectId();

      if (
        objectId.objectType === MapObjectType.MapItem &&
        objectId.objectId === ItemType.Flag
      ) {
        this.flagObjectList.push(object);
      }
    }
  }

  /**
   * Port of upstream `ZOLists::DeleteObjectFromList`.
   * Role: Runs object disposal, then removes every occurrence of the object from a categorized list.
   * Upstream: zolists.cpp:76-81
   */
  deleteObjectFromList(
    object: ObjectListsObjectReference,
    objectList: ObjectListsObjectReference[],
    dispose: (object: ObjectListsObjectReference) => void = () => {},
  ): void {
    dispose(object);
    this.removeObjectFromList(object, objectList);
  }
}
