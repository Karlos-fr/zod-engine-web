/**
 * Upstream: gwfactory_list.h
 */

/**
 * Port of upstream `_ZGWFACTORY_LIST_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gwfactory_list.h:2
 */
export const ZGW_FACTORY_LIST_HEADER_GUARD_PORTED = true;

/**
 * Replacement for upstream `gwfl_render_entry`.
 * Role: Stores one factory-list render row with paired text, progress, color, and geometry.
 * Upstream: gwfactory_list.h:12-33
 */
export class FactoryListRenderEntry {
  messageLeft = ["", "", ""];
  messageRight = ["", "", ""];
  colored = [false, false, false];
  percent = [0, 0, 0];
  refId = -1;
  x = 0;
  y = 0;
  width = 0;
  height = 0;

  clear(): void {
    this.colored.fill(false);
    this.refId = -1;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
  }
}

/**
 * Browser-side factory list window containing the subset of `GWFactoryList` behavior already ported.
 * Role: Tracks the team context used when collecting and rendering factory entries.
 * Upstream: gwfactory_list.h
 */
export class FactoryListWindow {
  team = -1;

  /**
   * Port of upstream `SetTeam`.
   * Role: Stores the team id used by the factory list.
   * Upstream: gwfactory_list.h:43
   */
  setTeam(team: number): void {
    this.team = team;
  }
}
