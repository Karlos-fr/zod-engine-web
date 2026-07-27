import { describe, expect, it } from "vitest";
import {
  GMM_SELECT_MAP_HEADER_GUARD_PORTED,
  type SelectableMapListState,
  setSelectableMapList,
} from "../src/world/MapSelection";

describe("map selection", () => {
  it("adapts the gmm_select_map header guard to module boundaries", async () => {
    const firstImport = await import("../src/world/MapSelection");
    const secondImport = await import("../src/world/MapSelection");

    expect(GMM_SELECT_MAP_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.GMM_SELECT_MAP_HEADER_GUARD_PORTED).toBe(
      firstImport.GMM_SELECT_MAP_HEADER_GUARD_PORTED,
    );
  });

  it("ports SetSelectableMapList as selectable map-list state replacement", () => {
    const state: SelectableMapListState = {
      selectableMapList: ["original.map"],
    };
    const selectableMapList = ["alpha.map", "beta.map"];

    const nextState = setSelectableMapList(state, selectableMapList);

    expect(nextState.selectableMapList).toBe(selectableMapList);
    expect(state.selectableMapList).toEqual(["original.map"]);
  });
});
