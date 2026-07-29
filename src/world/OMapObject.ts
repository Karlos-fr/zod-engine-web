/**
 * Upstream: omapobject.h
 */
import { ItemType, TeamType } from "../simulation/SimulationConstants";
import { MAP_ITEM_TYPE_COUNT } from "./WorldConstants";

/**
 * Marker exported from the object map object module.
 * Role: Marks an upstream header boundary.
 * Upstream: omapobject.h:2
 */
export const OMAP_OBJECT_HEADER_GUARD_PORTED = true;

export type ObjectMapObjectOptions = {
  x?: number;
  y?: number;
};

export type ObjectMapImpassableMap = {
  setImpassable(
    tileX: number,
    tileY: number,
    impassable: boolean,
    destroyable: boolean,
  ): void;
};

/**
 * Browser-side object map object containing the subset of `OMapObject` behavior already ported.
 * Role: Represents map objects that occupy impassable terrain.
 * Upstream: omapobject.h
 */
export class ObjectMapObject {
  x: number;
  y: number;
  owner = TeamType.Null;
  mapObjectImages: string[] = [];
  objectIndex = 0;
  objectName = "map_object0";
  objectId = ItemType.Map0;

  constructor(options: ObjectMapObjectOptions = {}) {
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
  }

  /**
   * Port of upstream `OMapObject::Process`.
   * Role: Reports no per-tick object-map processing work.
   * Upstream: omapobject.cpp:67-70
   */
  process(): number {
    return 0;
  }

  /**
   * Port of upstream `OMapObject::Init`.
   * Role: Initializes map-object image asset paths.
   * Upstream: omapobject.cpp:37-47
   */
  init(): void {
    this.mapObjectImages = Array.from(
      { length: MAP_ITEM_TYPE_COUNT },
      (_value, index) => `assets/other/map_items/map_object${index}.png`,
    );
  }

  /**
   * Port of upstream `OMapObject::SetType`.
   * Role: Stores a bounded map-object index, display name, and object id.
   * Upstream: omapobject.cpp:22-35
   */
  setType(objectId: number): void {
    this.objectIndex = objectId - ItemType.Map0;

    if (this.objectIndex < 0) {
      this.objectIndex = 0;
    } else if (this.objectIndex >= MAP_ITEM_TYPE_COUNT) {
      this.objectIndex = MAP_ITEM_TYPE_COUNT - 1;
    }

    this.objectName = `map_object${this.objectIndex}`;
    this.objectId = ItemType.Map0 + this.objectIndex;
  }

  /**
   * Port of upstream `OMapObject::CausesImpassAtCoord`.
   * Role: Reports whether this object-map object occupies the queried coordinate.
   * Upstream: omapobject.cpp:72-75
   */
  causesImpassAtCoord(x: number, y: number): boolean {
    return x === this.x && y === this.y;
  }

  /**
   * Port of upstream `OMapObject::SetMapImpassables`.
   * Role: Marks this map object's occupied tile as a destroyable impassable.
   * Upstream: omapobject.cpp:77-85
   */
  setMapImpassables(map: ObjectMapImpassableMap): void {
    const tileX = Math.trunc(this.x / 16);
    const tileY = Math.trunc(this.y / 16);

    map.setImpassable(tileX, tileY, true, true);
  }

  /**
   * Port of upstream `OMapObject::UnSetMapImpassables`.
   * Role: Clears this map object's occupied tile while preserving destroyable impassable metadata.
   * Upstream: omapobject.cpp:87-95
   */
  unsetMapImpassables(map: ObjectMapImpassableMap): void {
    const tileX = Math.trunc(this.x / 16);
    const tileY = Math.trunc(this.y / 16);

    map.setImpassable(tileX, tileY, false, true);
  }

  /**
   * Port of upstream `OMapObject::SetOwner`.
   * Role: Ignores ownership changes because object-map impassables remain on the null team.
   * Upstream: omapobject.cpp:165-168
   */
  setOwner(owner: TeamType): void {
    void owner;
  }

  /**
   * Port of upstream `IsDestroyableImpass`.
   * Role: Reports whether this map object is a destroyable impassable barrier.
   * Upstream: omapobject.h:26
   */
  isDestroyableImpassable(): boolean {
    return true;
  }
}
