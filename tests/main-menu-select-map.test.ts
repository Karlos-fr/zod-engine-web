import { describe, expect, it } from "vitest";
import { MainMenuListEntry, MainMenuListState } from "../src/ui/MainMenuWidgets";
import {
  handleMainMenuSelectMapWidgetEvent,
  processMainMenuSelectMap,
  setupMainMenuSelectMapList,
  ZGMM_SELECT_MAP_HEADER_GUARD_PORTED,
  type MainMenuSelectMapState,
} from "../src/ui/MainMenuSelectMap";
import { MainMenuEventType, MainMenuFlag } from "../src/ui/MainMenuBase";

describe("main menu select map", () => {
  it("adapts the gmm_select_map include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuSelectMap");
    const secondImport = await import("../src/ui/MainMenuSelectMap");

    expect(ZGMM_SELECT_MAP_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_SELECT_MAP_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_SELECT_MAP_HEADER_GUARD_PORTED,
    );
  });

  it("ports GMMSelectMap SetupList as a no-op without selectable maps", () => {
    const entries = [new MainMenuListEntry("existing.map", 3, 3)];
    const state: MainMenuSelectMapState = {
      selectableMapList: null,
      mapList: {
        entries,
        visibleEntries: 1,
        viewIndex: 0,
      },
    };

    setupMainMenuSelectMapList(state);

    expect(state.mapList.entries).toBe(entries);
    expect(state.mapList.entries).toEqual([
      new MainMenuListEntry("existing.map", 3, 3),
    ]);
  });

  it("ports GMMSelectMap SetupList size guard", () => {
    const entries = [
      new MainMenuListEntry("old-alpha.map", 10, 10),
      new MainMenuListEntry("old-beta.map", 11, 11),
    ];
    const state: MainMenuSelectMapState = {
      selectableMapList: ["alpha.map", "beta.map"],
      mapList: {
        entries,
        visibleEntries: 1,
        viewIndex: 0,
      },
    };

    setupMainMenuSelectMapList(state);

    expect(state.mapList.entries).toBe(entries);
    expect(state.mapList.entries).toEqual([
      new MainMenuListEntry("old-alpha.map", 10, 10),
      new MainMenuListEntry("old-beta.map", 11, 11),
    ]);
  });

  it("ports GMMSelectMap SetupList as entry rebuild and view clamp", () => {
    const entries = [new MainMenuListEntry("old.map", 10, 10)];
    const state: MainMenuSelectMapState = {
      selectableMapList: ["alpha.map", "beta.map", "gamma.map"],
      mapList: {
        entries,
        visibleEntries: 2,
        viewIndex: 5,
      },
    };

    setupMainMenuSelectMapList(state);

    expect(state.mapList.entries).toBe(entries);
    expect(state.mapList.entries).toEqual([
      new MainMenuListEntry("alpha.map", 0, 0),
      new MainMenuListEntry("beta.map", 1, 1),
      new MainMenuListEntry("gamma.map", 2, 2),
    ]);
    expect(state.mapList.viewIndex).toBe(1);
  });

  it("ports GMMSelectMap Process as setup-list then widget processing", () => {
    const calls: string[] = [];
    const entries = [new MainMenuListEntry("old.map", 10, 10)];
    const state = {
      selectableMapList: ["alpha.map", "beta.map"],
      mapList: {
        entries,
        visibleEntries: 2,
        viewIndex: 0,
      },
      processWidgets() {
        calls.push("processWidgets");
      },
    };

    processMainMenuSelectMap(state);

    expect(entries).toEqual([
      new MainMenuListEntry("alpha.map", 0, 0),
      new MainMenuListEntry("beta.map", 1, 1),
    ]);
    expect(calls).toEqual(["processWidgets"]);
  });

  it("ports GMMSelectMap HandleWidgetEvent as list click selection clearing", () => {
    const keepSelected = new MainMenuListEntry("keep.map", 10, 10);
    const clearSelected = new MainMenuListEntry("clear.map", 11, 11);
    keepSelected.state = MainMenuListState.Pressed;
    clearSelected.state = MainMenuListState.Pressed;
    const flags = new MainMenuFlag();

    handleMainMenuSelectMapWidgetEvent(
      {
        gmmFlags: flags,
        mapList: {
          refId: 30,
          entries: [keepSelected, clearSelected],
          visibleEntries: 2,
          viewIndex: 0,
        },
        selectButton: { refId: 40 },
      },
      MainMenuEventType.Click,
      { refId: 30 },
    );

    expect(keepSelected.state).toBe(MainMenuListState.Pressed);
    expect(clearSelected.state).toBe(MainMenuListState.Normal);
    expect(flags.changeMap).toBe(false);
  });

  it("ports GMMSelectMap HandleWidgetEvent as select-button map-change flag", () => {
    const alpha = new MainMenuListEntry("alpha.map", 101, 0);
    const beta = new MainMenuListEntry("beta.map", 202, 1);
    beta.state = MainMenuListState.Pressed;
    const flags = new MainMenuFlag();

    handleMainMenuSelectMapWidgetEvent(
      {
        gmmFlags: flags,
        mapList: {
          refId: 30,
          entries: [alpha, beta],
          visibleEntries: 2,
          viewIndex: 0,
        },
        selectButton: { refId: 40 },
      },
      MainMenuEventType.Unclick,
      { refId: 40 },
    );

    expect(flags.changeMap).toBe(true);
    expect(flags.changeMapNumber).toBe(202);
  });

  it("ports GMMSelectMap HandleWidgetEvent guard and ignored cases", () => {
    const entry = new MainMenuListEntry("alpha.map", 101, 0);
    const flags = new MainMenuFlag();
    const state = {
      gmmFlags: flags,
      mapList: {
        refId: 30,
        entries: [entry],
        visibleEntries: 1,
        viewIndex: 0,
      },
      selectButton: { refId: 40 },
    };

    handleMainMenuSelectMapWidgetEvent(state, MainMenuEventType.Click, null);
    handleMainMenuSelectMapWidgetEvent(state, MainMenuEventType.Motion, { refId: 30 });
    handleMainMenuSelectMapWidgetEvent(state, MainMenuEventType.Unclick, { refId: 40 });

    expect(entry.state).toBe(MainMenuListState.Normal);
    expect(flags.changeMap).toBe(false);
    expect(flags.changeMapNumber).toBe(-1);
  });
});
