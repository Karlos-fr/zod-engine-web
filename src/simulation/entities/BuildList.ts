/**
 * Upstream: zbuildlist.h
 */

/**
 * Port of upstream `_ZBUILDLIST_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zbuildlist.h:2
 */
export const ZBUILD_LIST_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `buildlist_object`.
 * Role: Stores an object type and object id entry in a building production list.
 * Upstream: zbuildlist.h:12-25
 */
export class BuildListObject {
  ot: number;
  oid: number;

  constructor(ot?: number, oid?: number) {
    if (ot === undefined || oid === undefined) {
      this.ot = 0;
      this.oid = 0;
      return;
    }

    this.ot = ot;
    this.oid = oid;
  }

  /**
   * Port of upstream `buildlist_object::clear`.
   * Role: Resets the build-list object type and object id to defaults.
   * Upstream: zbuildlist.h:18-22
   */
  clear(): void {
    this.ot = 0;
    this.oid = 0;
  }
}
