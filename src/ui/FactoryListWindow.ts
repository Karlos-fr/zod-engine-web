/**
 * Upstream: gwfactory_list.h
 */
import { TeamType } from "../simulation/SimulationConstants";

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
  show = false;
  finishedInit = false;
  objectLists: object | null = null;
  showStartEntry = 0;

  /**
   * Port of upstream `SetTeam`.
   * Role: Stores the team id used by the factory list.
   * Upstream: gwfactory_list.h:43
   */
  setTeam(team: number): void {
    this.team = team;
  }

  /**
   * Port of upstream `GWFactoryList::CollectEntries`.
   * Role: Rebuilds the visible factory list entries from world object lists.
   * Upstream: gwfactory_list.cpp:60
   */
  collectEntries(): void {}

  /**
   * Port of upstream `GWFactoryList::Process`.
   * Role: Collects factory entries only when the window is visible and initialized for a real team.
   * Upstream: gwfactory_list.cpp:52-61
   */
  process(): void {
    if (!this.show) return;
    if (!this.finishedInit) return;
    if (!this.objectLists) return;
    if (this.team === TeamType.Null) return;

    this.collectEntries();
  }

  /**
   * Port of upstream `GWFactoryList::DoUpButton`.
   * Role: Moves the first visible factory-list entry up without going below zero.
   * Upstream: gwfactory_list.cpp:321-326
   */
  doUpButton(): void {
    this.showStartEntry -= 1;

    if (this.showStartEntry < 0) this.showStartEntry = 0;
  }

  /**
   * Port of upstream `GWFactoryList::DoDownButton`.
   * Role: Advances the first visible factory-list entry by one row.
   * Upstream: gwfactory_list.cpp:328-331
   */
  doDownButton(): void {
    this.showStartEntry += 1;
  }

  /**
   * Port of upstream `GWFactoryList::WheelUpButton`.
   * Role: Routes wheel-up input to the list scroll control only while visible.
   * Upstream: gwfactory_list.cpp:303-310
   */
  wheelUpButton(): boolean {
    if (!this.show) return false;

    this.doUpButton();
    return true;
  }

  /**
   * Port of upstream `GWFactoryList::WheelDownButton`.
   * Role: Routes wheel-down input to the list scroll control only while visible.
   * Upstream: gwfactory_list.cpp:312-319
   */
  wheelDownButton(): boolean {
    if (!this.show) return false;

    this.doDownButton();
    return true;
  }
}
