import { describe, expect, it } from "vitest";
import {
  PORTRAIT_BASE_HEIGHT_PIXELS,
  PORTRAIT_BASE_WIDTH_PIXELS,
  PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS,
  PORTRAIT_MAX_EYES,
  PORTRAIT_MAX_HANDS,
  PORTRAIT_MAX_MOUTHS,
  ZPORTRAIT_HEADER_GUARD_PORTED,
} from "../src/simulation/PortraitAnimation";

describe("portrait animation", () => {
  it("adapts the zportrait.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/PortraitAnimation");
    const secondImport = await import("../src/simulation/PortraitAnimation");

    expect(ZPORTRAIT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZPORTRAIT_HEADER_GUARD_PORTED).toBe(
      firstImport.ZPORTRAIT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the portrait base dimensions", () => {
    expect(PORTRAIT_BASE_WIDTH_PIXELS).toBe(86);
    expect(PORTRAIT_BASE_HEIGHT_PIXELS).toBe(74);
  });

  it("adapts the portrait facial sprite limits", () => {
    expect(PORTRAIT_MAX_EYES).toBe(11);
    expect(PORTRAIT_MAX_HANDS).toBe(9);
    expect(PORTRAIT_MAX_MOUTHS).toBe(16);
  });

  it("ports the portrait frame duration multiplier", () => {
    expect(PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS).toBe(0.015);
  });
});
