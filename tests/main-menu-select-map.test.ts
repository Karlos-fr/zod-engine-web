import { describe, expect, it } from "vitest";
import { MainMenuListEntry } from "../src/ui/MainMenuWidgets";
import {
  processMainMenuSelectMap,
  setupMainMenuSelectMapList,
  ZGMM_SELECT_MAP_HEADER_GUARD_PORTED,
  type MainMenuSelectMapState,
} from "../src/ui/MainMenuSelectMap";

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
});
