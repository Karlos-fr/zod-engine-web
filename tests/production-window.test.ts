import { describe, expect, it } from "vitest";
import {
  PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS,
  PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS,
  PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS,
  PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
  ZGW_PRODUCTION_HEADER_GUARD_PORTED,
} from "../src/ui/ProductionWindow";

describe("production window", () => {
  it("adapts the gwproduction.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/ProductionWindow");
    const secondImport = await import("../src/ui/ProductionWindow");

    expect(ZGW_PRODUCTION_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_PRODUCTION_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_PRODUCTION_HEADER_GUARD_PORTED,
    );
  });

  it("ports full selector center offsets with C++ integer division", () => {
    expect(PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS).toBe(24);
    expect(PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS).toBe(21);
  });

  it("ports production queue button vertical layout constants", () => {
    expect(PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS).toBe(13);
    expect(PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS).toBe(1);
  });
});
