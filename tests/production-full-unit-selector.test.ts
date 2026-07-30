import { describe, expect, it } from "vitest";
import {
  initProductionFullUnitSelector,
  PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_HEIGHT_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_WIDTH_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_SIDE_SIZE_PIXELS,
  PRODUCTION_FULL_UNIT_SELECTOR_TOP_HEIGHT_PIXELS,
  type ProductionFullUnitSelectorImageState,
} from "../src/ui/ProductionFullUnitSelector";

describe("production full unit selector", () => {
  it("ports the frame and grid layout dimensions", () => {
    expect(PRODUCTION_FULL_UNIT_SELECTOR_MARGIN_PIXELS).toBe(2);
    expect(PRODUCTION_FULL_UNIT_SELECTOR_TOP_HEIGHT_PIXELS).toBe(20);
    expect(PRODUCTION_FULL_UNIT_SELECTOR_SIDE_SIZE_PIXELS).toBe(4);
    expect(PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_WIDTH_PIXELS).toBe(45);
    expect(PRODUCTION_FULL_UNIT_SELECTOR_OBJECT_HEIGHT_PIXELS).toBe(51);
  });

  it("ports GWPFullUnitSelector Init as static frame image loading", () => {
    const state: ProductionFullUnitSelectorImageState = {
      finishedInit: false,
    };
    const filenames: string[] = [];

    initProductionFullUnitSelector(state, (filename) => {
      filenames.push(filename);
      return { filename };
    });

    expect(filenames).toEqual([
      "assets/other/production_gui/fus_top_left.png",
      "assets/other/production_gui/fus_top_right.png",
      "assets/other/production_gui/fus_bottom_left.png",
      "assets/other/production_gui/fus_bottom_right.png",
      "assets/other/production_gui/fus_top.png",
      "assets/other/production_gui/fus_bottom.png",
      "assets/other/production_gui/fus_left.png",
      "assets/other/production_gui/fus_right.png",
      "assets/other/production_gui/object_back.png",
    ]);
    expect(state.finishedInit).toBe(true);
    expect(state.images).toEqual({
      topLeft: { filename: "assets/other/production_gui/fus_top_left.png" },
      topRight: { filename: "assets/other/production_gui/fus_top_right.png" },
      bottomLeft: {
        filename: "assets/other/production_gui/fus_bottom_left.png",
      },
      bottomRight: {
        filename: "assets/other/production_gui/fus_bottom_right.png",
      },
      top: { filename: "assets/other/production_gui/fus_top.png" },
      bottom: { filename: "assets/other/production_gui/fus_bottom.png" },
      left: { filename: "assets/other/production_gui/fus_left.png" },
      right: { filename: "assets/other/production_gui/fus_right.png" },
      objectBack: { filename: "assets/other/production_gui/object_back.png" },
    });
  });
});
