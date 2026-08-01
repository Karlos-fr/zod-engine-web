/**
 * Upstream: gwfactory_list.h
 */
import {
  loadRotozoomCacheBaseImage,
  type BaseImageFileLoadState,
} from "../rendering/SurfaceLifecycle";
import { TeamType } from "../simulation/SimulationConstants";

/**
 * Port of upstream `_ZGWFACTORY_LIST_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gwfactory_list.h:2
 */
export const ZGW_FACTORY_LIST_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream factory-list image path.
 * Role: Identifies the top panel image loaded by `GWFactoryList::Init`.
 * Upstream: gwfactory_list.cpp:32
 */
export const FACTORY_LIST_MAIN_TOP_IMAGE_PATH =
  "assets/other/factory_gui/main_top.png";

/**
 * Port of upstream factory-list image path.
 * Role: Identifies the right panel image loaded by `GWFactoryList::Init`.
 * Upstream: gwfactory_list.cpp:33
 */
export const FACTORY_LIST_MAIN_RIGHT_IMAGE_PATH =
  "assets/other/factory_gui/main_right.png";

/**
 * Port of upstream factory-list image path.
 * Role: Identifies the entry background image loaded by `GWFactoryList::Init`.
 * Upstream: gwfactory_list.cpp:34
 */
export const FACTORY_LIST_MAIN_ENTRY_IMAGE_PATH =
  "assets/other/factory_gui/main_entry.png";

/**
 * Port of upstream factory-list image path.
 * Role: Identifies the green progress bar image loaded by `GWFactoryList::Init`.
 * Upstream: gwfactory_list.cpp:35
 */
export const FACTORY_LIST_ENTRY_BAR_GREEN_IMAGE_PATH =
  "assets/other/factory_gui/entry_bar_green.png";

/**
 * Port of upstream factory-list image path.
 * Role: Identifies the red progress bar image loaded by `GWFactoryList::Init`.
 * Upstream: gwfactory_list.cpp:36
 */
export const FACTORY_LIST_ENTRY_BAR_RED_IMAGE_PATH =
  "assets/other/factory_gui/entry_bar_red.png";

/**
 * Port of upstream factory-list image path.
 * Role: Identifies the grey progress bar image loaded by `GWFactoryList::Init`.
 * Upstream: gwfactory_list.cpp:37
 */
export const FACTORY_LIST_ENTRY_BAR_GREY_IMAGE_PATH =
  "assets/other/factory_gui/entry_bar_grey.png";

/**
 * Port of upstream factory-list image path.
 * Role: Identifies the white inverted progress bar image loaded by `GWFactoryList::Init`.
 * Upstream: gwfactory_list.cpp:38
 */
export const FACTORY_LIST_ENTRY_BAR_WHITE_INVERTED_IMAGE_PATH =
  "assets/other/factory_gui/entry_bar_white_i.png";

/**
 * Replacement for upstream factory-list SDL image surfaces.
 * Role: Stores the loaded base surface used by `GWFactoryList::Init` checks.
 * Upstream: gwfactory_list.cpp:32-47
 */
export type FactoryListImageState<TSurface = unknown> = BaseImageFileLoadState & {
  baseSurface: TSurface | null;
};

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
 * Port of upstream `gflags` clear dependency.
 * Role: Clears pending factory-list GUI actions before unclick routing.
 * Upstream: gwfactory_list.cpp:287
 */
export type FactoryListFlagClearTarget = {
  clear(): void;
};

/**
 * Port of upstream factory-list scroll button dependency.
 * Role: Receives local unclick coordinates and reports whether the button was released.
 * Upstream: gwfactory_list.cpp:292-293
 */
export type FactoryListUnclickButton = {
  unClick(x: number, y: number): boolean;
};

/**
 * Replacement for upstream image base surface dimensions.
 * Role: Provides the height used by factory-list layout calculations.
 * Upstream: gwfactory_list.cpp:220, gwfactory_list.cpp:229
 */
export type FactoryListSurfaceDimensions = {
  height: number;
};

/**
 * Browser-side factory list window containing the subset of `GWFactoryList` behavior already ported.
 * Role: Tracks the team context used when collecting and rendering factory entries.
 * Upstream: gwfactory_list.h
 */
export class FactoryListWindow {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  team = -1;
  show = false;
  finishedInit = false;
  objectLists: object | null = null;
  showStartEntry = 0;
  showAbleEntries = 0;
  entryList: unknown[] = [];
  mainTopImage: FactoryListImageState = { imageFilename: "", baseSurface: null };
  mainRightImage: FactoryListImageState = {
    imageFilename: "",
    baseSurface: null,
  };
  mainEntryImage: FactoryListImageState = {
    imageFilename: "",
    baseSurface: null,
  };
  entryBarGreenImage: FactoryListImageState = {
    imageFilename: "",
    baseSurface: null,
  };
  entryBarRedImage: FactoryListImageState = {
    imageFilename: "",
    baseSurface: null,
  };
  entryBarGreyImage: FactoryListImageState = {
    imageFilename: "",
    baseSurface: null,
  };
  entryBarWhiteInvertedImage: FactoryListImageState = {
    imageFilename: "",
    baseSurface: null,
  };
  gflags: FactoryListFlagClearTarget = { clear: (): void => undefined };
  upButton: FactoryListUnclickButton = { unClick: () => false };
  downButton: FactoryListUnclickButton = { unClick: () => false };

  /**
   * Port of upstream `SetTeam`.
   * Role: Stores the team id used by the factory list.
   * Upstream: gwfactory_list.h:43
   */
  setTeam(team: number): void {
    this.team = team;
  }

  /**
   * Port of upstream `GWFactoryList::Init`.
   * Role: Loads factory-list images and marks initialization complete only when every base surface exists.
   * Upstream: gwfactory_list.cpp:30-50
   */
  init<TSurface>(loadImage: (filename: string) => TSurface | null): void {
    const loadBaseImage = (
      image: FactoryListImageState,
      surface: TSurface | null,
    ): void => {
      image.baseSurface = surface;
    };

    const imageLoads: Array<[FactoryListImageState, string]> = [
      [this.mainTopImage, FACTORY_LIST_MAIN_TOP_IMAGE_PATH],
      [this.mainRightImage, FACTORY_LIST_MAIN_RIGHT_IMAGE_PATH],
      [this.mainEntryImage, FACTORY_LIST_MAIN_ENTRY_IMAGE_PATH],
      [this.entryBarGreenImage, FACTORY_LIST_ENTRY_BAR_GREEN_IMAGE_PATH],
      [this.entryBarRedImage, FACTORY_LIST_ENTRY_BAR_RED_IMAGE_PATH],
      [this.entryBarGreyImage, FACTORY_LIST_ENTRY_BAR_GREY_IMAGE_PATH],
      [
        this.entryBarWhiteInvertedImage,
        FACTORY_LIST_ENTRY_BAR_WHITE_INVERTED_IMAGE_PATH,
      ],
    ];

    for (const [image, filename] of imageLoads) {
      loadRotozoomCacheBaseImage(image, filename, loadImage, (surface) =>
        loadBaseImage(image, surface),
      );
    }

    if (imageLoads.some(([image]) => !image.baseSurface)) return;

    this.finishedInit = true;
  }

  /**
   * Port of upstream `GWFactoryList::CollectEntries`.
   * Role: Rebuilds the visible factory list entries from world object lists.
   * Upstream: gwfactory_list.cpp:60
   */
  collectEntries(): void {}

  /**
   * Port of upstream `GWFactoryList::DetermineHeight`.
   * Role: Computes visible factory rows and total window height from available vertical space.
   * Upstream: gwfactory_list.cpp:214-243
   */
  determineHeight(maxHeight: number): void {
    const mainTopSurface =
      this.mainTopImage.baseSurface as FactoryListSurfaceDimensions | null;
    const mainEntrySurface =
      this.mainEntryImage.baseSurface as FactoryListSurfaceDimensions | null;
    const topHeight = mainTopSurface?.height ?? 0;
    const entryHeight = mainEntrySurface?.height ?? 0;

    this.height = topHeight;

    if (!this.entryList.length) {
      this.showStartEntry = 0;
      this.showAbleEntries = 0;
      return;
    }

    const minHeight = this.height + entryHeight;
    const freeSpace = maxHeight - minHeight;

    this.showAbleEntries = 1;

    if (freeSpace > 0 && entryHeight > 0) {
      this.showAbleEntries += Math.trunc(freeSpace / entryHeight);
    }

    if (this.showAbleEntries > this.entryList.length) {
      this.showAbleEntries = this.entryList.length;
    }

    const maxStartEntry = this.entryList.length - this.showAbleEntries;
    if (this.showStartEntry > maxStartEntry) this.showStartEntry = maxStartEntry;

    this.height += this.showAbleEntries * entryHeight;
  }

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

  /**
   * Port of upstream `GWFactoryList::UnClick`.
   * Role: Routes button release input to scroll buttons, then reports whether the release hit the window.
   * Upstream: gwfactory_list.cpp:281-301
   */
  unClick(x: number, y: number): boolean {
    if (!this.show) return false;

    this.gflags.clear();

    const localX = x - this.x;
    const localY = y - this.y;

    if (this.upButton.unClick(localX, localY)) this.doUpButton();
    if (this.downButton.unClick(localX, localY)) this.doDownButton();

    if (x < this.x) return false;
    if (y < this.y) return false;
    if (x >= this.x + this.width) return false;
    if (y >= this.y + this.height) return false;

    return true;
  }
}
