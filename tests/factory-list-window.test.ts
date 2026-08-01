import { describe, expect, it } from "vitest";
import { TeamType } from "../src/simulation/SimulationConstants";
import {
  FACTORY_LIST_ENTRY_BAR_GREEN_IMAGE_PATH,
  FACTORY_LIST_ENTRY_BAR_GREY_IMAGE_PATH,
  FACTORY_LIST_ENTRY_BAR_RED_IMAGE_PATH,
  FACTORY_LIST_ENTRY_BAR_WHITE_INVERTED_IMAGE_PATH,
  FACTORY_LIST_MAIN_ENTRY_IMAGE_PATH,
  FACTORY_LIST_MAIN_RIGHT_IMAGE_PATH,
  FACTORY_LIST_MAIN_TOP_IMAGE_PATH,
  FactoryListWindow,
  FactoryListRenderEntry,
  ZGW_FACTORY_LIST_HEADER_GUARD_PORTED,
} from "../src/ui/FactoryListWindow";

describe("factory list window", () => {
  it("adapts the gwfactory_list.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/FactoryListWindow");
    const secondImport = await import("../src/ui/FactoryListWindow");

    expect(ZGW_FACTORY_LIST_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_FACTORY_LIST_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_FACTORY_LIST_HEADER_GUARD_PORTED,
    );
  });

  it("replaces gwfl_render_entry with a three-line render entry", () => {
    expect(new FactoryListRenderEntry()).toEqual({
      messageLeft: ["", "", ""],
      messageRight: ["", "", ""],
      colored: [false, false, false],
      percent: [0, 0, 0],
      refId: -1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  it("ports gwfl_render_entry clear geometry and color reset", () => {
    const entry = new FactoryListRenderEntry();
    entry.messageLeft[0] = "Robot";
    entry.messageRight[0] = "30s";
    entry.colored = [true, true, true];
    entry.percent[0] = 0.5;
    entry.refId = 9;
    entry.x = 1;
    entry.y = 2;
    entry.width = 3;
    entry.height = 4;

    entry.clear();

    expect(entry.messageLeft).toEqual(["Robot", "", ""]);
    expect(entry.messageRight).toEqual(["30s", "", ""]);
    expect(entry.percent).toEqual([0.5, 0, 0]);
    expect(entry.colored).toEqual([false, false, false]);
    expect(entry.refId).toBe(-1);
    expect({ x: entry.x, y: entry.y, width: entry.width, height: entry.height }).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  it("ports GWFactoryList SetTeam as a team assignment", () => {
    const window = new FactoryListWindow();

    window.setTeam(2);

    expect(window.team).toBe(2);
  });

  it("ports GWFactoryList Init as factory GUI image loading", () => {
    const loadedFilenames: string[] = [];
    const window = new FactoryListWindow();

    window.init((filename) => {
      loadedFilenames.push(filename);
      return `surface:${filename}`;
    });

    expect(loadedFilenames).toEqual([
      FACTORY_LIST_MAIN_TOP_IMAGE_PATH,
      FACTORY_LIST_MAIN_RIGHT_IMAGE_PATH,
      FACTORY_LIST_MAIN_ENTRY_IMAGE_PATH,
      FACTORY_LIST_ENTRY_BAR_GREEN_IMAGE_PATH,
      FACTORY_LIST_ENTRY_BAR_RED_IMAGE_PATH,
      FACTORY_LIST_ENTRY_BAR_GREY_IMAGE_PATH,
      FACTORY_LIST_ENTRY_BAR_WHITE_INVERTED_IMAGE_PATH,
    ]);
    expect(window.mainTopImage).toEqual({
      imageFilename: FACTORY_LIST_MAIN_TOP_IMAGE_PATH,
      baseSurface: `surface:${FACTORY_LIST_MAIN_TOP_IMAGE_PATH}`,
    });
    expect(window.mainRightImage.baseSurface).toBe(
      `surface:${FACTORY_LIST_MAIN_RIGHT_IMAGE_PATH}`,
    );
    expect(window.mainEntryImage.baseSurface).toBe(
      `surface:${FACTORY_LIST_MAIN_ENTRY_IMAGE_PATH}`,
    );
    expect(window.entryBarGreenImage.baseSurface).toBe(
      `surface:${FACTORY_LIST_ENTRY_BAR_GREEN_IMAGE_PATH}`,
    );
    expect(window.entryBarRedImage.baseSurface).toBe(
      `surface:${FACTORY_LIST_ENTRY_BAR_RED_IMAGE_PATH}`,
    );
    expect(window.entryBarGreyImage.baseSurface).toBe(
      `surface:${FACTORY_LIST_ENTRY_BAR_GREY_IMAGE_PATH}`,
    );
    expect(window.entryBarWhiteInvertedImage.baseSurface).toBe(
      `surface:${FACTORY_LIST_ENTRY_BAR_WHITE_INVERTED_IMAGE_PATH}`,
    );
    expect(window.finishedInit).toBe(true);
  });

  it("ports GWFactoryList Init as incomplete when an image lacks a base surface", () => {
    const window = new FactoryListWindow();

    window.init((filename) => {
      if (filename === FACTORY_LIST_ENTRY_BAR_RED_IMAGE_PATH) return null;
      return `surface:${filename}`;
    });

    expect(window.entryBarRedImage).toEqual({
      imageFilename: FACTORY_LIST_ENTRY_BAR_RED_IMAGE_PATH,
      baseSurface: null,
    });
    expect(window.finishedInit).toBe(false);
  });

  it("ports GWFactoryList Process guard exits before collecting entries", () => {
    class TestFactoryListWindow extends FactoryListWindow {
      collectCount = 0;

      override collectEntries(): void {
        this.collectCount++;
      }
    }
    const window = new TestFactoryListWindow();

    window.process();
    window.show = true;
    window.process();
    window.finishedInit = true;
    window.process();
    window.objectLists = {};
    window.team = TeamType.Null;
    window.process();

    expect(window.collectCount).toBe(0);
  });

  it("ports GWFactoryList Process as visible initialized entry collection", () => {
    class TestFactoryListWindow extends FactoryListWindow {
      collectCount = 0;

      override collectEntries(): void {
        this.collectCount++;
      }
    }
    const window = new TestFactoryListWindow();
    window.show = true;
    window.finishedInit = true;
    window.objectLists = {};
    window.team = TeamType.Red;

    window.process();

    expect(window.collectCount).toBe(1);
  });

  it("ports GWFactoryList DetermineHeight as empty entry reset", () => {
    const window = new FactoryListWindow();
    window.height = 99;
    window.showStartEntry = 3;
    window.showAbleEntries = 2;
    window.mainTopImage.baseSurface = { height: 12 };
    window.mainEntryImage.baseSurface = { height: 20 };

    window.determineHeight(100);

    expect(window.height).toBe(12);
    expect(window.showStartEntry).toBe(0);
    expect(window.showAbleEntries).toBe(0);
  });

  it("ports GWFactoryList DetermineHeight as minimum one-row layout", () => {
    const window = new FactoryListWindow();
    window.mainTopImage.baseSurface = { height: 12 };
    window.mainEntryImage.baseSurface = { height: 20 };
    window.entryList = [{ id: 1 }, { id: 2 }, { id: 3 }];

    window.determineHeight(20);

    expect(window.showAbleEntries).toBe(1);
    expect(window.showStartEntry).toBe(0);
    expect(window.height).toBe(32);
  });

  it("ports GWFactoryList DetermineHeight as visible row and start-entry clamp", () => {
    const window = new FactoryListWindow();
    window.mainTopImage.baseSurface = { height: 12 };
    window.mainEntryImage.baseSurface = { height: 20 };
    window.entryList = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    window.showStartEntry = 3;

    window.determineHeight(100);

    expect(window.showAbleEntries).toBe(4);
    expect(window.showStartEntry).toBe(0);
    expect(window.height).toBe(92);
  });

  it("ports GWFactoryList DoUpButton as first visible entry decrement clamped to zero", () => {
    const window = new FactoryListWindow();
    window.showStartEntry = 2;

    window.doUpButton();

    expect(window.showStartEntry).toBe(1);

    window.doUpButton();
    window.doUpButton();

    expect(window.showStartEntry).toBe(0);
  });

  it("ports GWFactoryList DoDownButton as first visible entry increment", () => {
    const window = new FactoryListWindow();
    window.showStartEntry = 2;

    window.doDownButton();

    expect(window.showStartEntry).toBe(3);
  });

  it("ports GWFactoryList WheelUpButton as hidden no-op", () => {
    const window = new FactoryListWindow();
    window.show = false;
    window.showStartEntry = 2;

    expect(window.wheelUpButton()).toBe(false);
    expect(window.showStartEntry).toBe(2);
  });

  it("ports GWFactoryList WheelUpButton as visible list scroll", () => {
    const window = new FactoryListWindow();
    window.show = true;
    window.showStartEntry = 2;

    expect(window.wheelUpButton()).toBe(true);
    expect(window.showStartEntry).toBe(1);
  });

  it("ports GWFactoryList WheelDownButton as hidden no-op", () => {
    const window = new FactoryListWindow();
    window.show = false;
    window.showStartEntry = 2;

    expect(window.wheelDownButton()).toBe(false);
    expect(window.showStartEntry).toBe(2);
  });

  it("ports GWFactoryList WheelDownButton as visible list scroll", () => {
    const window = new FactoryListWindow();
    window.show = true;
    window.showStartEntry = 2;

    expect(window.wheelDownButton()).toBe(true);
    expect(window.showStartEntry).toBe(3);
  });

  it("ports GWFactoryList UnClick as hidden no-op", () => {
    const calls: string[] = [];
    const window = new FactoryListWindow();
    window.show = false;
    window.gflags = { clear: () => calls.push("clear") };
    window.upButton = { unClick: () => calls.push("up") > 0 };
    window.downButton = { unClick: () => calls.push("down") > 0 };

    expect(window.unClick(10, 20)).toBe(false);
    expect(calls).toEqual([]);
  });

  it("ports GWFactoryList UnClick as local scroll button routing", () => {
    const calls: unknown[] = [];
    const window = new FactoryListWindow();
    window.show = true;
    window.x = 30;
    window.y = 40;
    window.width = 50;
    window.height = 60;
    window.showStartEntry = 1;
    window.gflags = { clear: () => calls.push("clear") };
    window.upButton = {
      unClick(x: number, y: number) {
        calls.push(["up", x, y]);
        return true;
      },
    };
    window.downButton = {
      unClick(x: number, y: number) {
        calls.push(["down", x, y]);
        return true;
      },
    };

    expect(window.unClick(35, 45)).toBe(true);
    expect(window.showStartEntry).toBe(1);
    expect(calls).toEqual([
      "clear",
      ["up", 5, 5],
      ["down", 5, 5],
    ]);
  });

  it("ports GWFactoryList UnClick bounds after button routing", () => {
    const calls: unknown[] = [];
    const window = new FactoryListWindow();
    window.show = true;
    window.x = 30;
    window.y = 40;
    window.width = 50;
    window.height = 60;
    window.gflags = { clear: () => calls.push("clear") };
    window.upButton = {
      unClick(x: number, y: number) {
        calls.push(["up", x, y]);
        return false;
      },
    };
    window.downButton = {
      unClick(x: number, y: number) {
        calls.push(["down", x, y]);
        return false;
      },
    };

    expect(window.unClick(29, 45)).toBe(false);
    expect(window.unClick(35, 39)).toBe(false);
    expect(window.unClick(80, 45)).toBe(false);
    expect(window.unClick(35, 100)).toBe(false);

    expect(calls).toEqual([
      "clear",
      ["up", -1, 5],
      ["down", -1, 5],
      "clear",
      ["up", 5, -1],
      ["down", 5, -1],
      "clear",
      ["up", 50, 5],
      ["down", 50, 5],
      "clear",
      ["up", 5, 60],
      ["down", 5, 60],
    ]);
  });
});
