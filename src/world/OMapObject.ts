/**
 * Upstream: omapobject.h
 */

/**
 * Marker exported from the object map object module.
 * Role: Marks an upstream header boundary.
 * Upstream: omapobject.h:2
 */
export const OMAP_OBJECT_HEADER_GUARD_PORTED = true;

/**
 * Browser-side object map object containing the subset of `OMapObject` behavior already ported.
 * Role: Represents map objects that occupy impassable terrain.
 * Upstream: omapobject.h
 */
export class ObjectMapObject {
  /**
   * Port of upstream `IsDestroyableImpass`.
   * Role: Reports whether this map object is a destroyable impassable barrier.
   * Upstream: omapobject.h:26
   */
  isDestroyableImpassable(): boolean {
    return true;
  }
}
