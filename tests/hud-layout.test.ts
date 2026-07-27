import { describe, expect, it } from "vitest";
import { HUD_HEIGHT_PIXELS, HUD_WIDTH_PIXELS } from "../src/ui/HudLayout";

describe("HUD layout", () => {
  it("adapts the upstream HUD viewport reservations", () => {
    expect(HUD_WIDTH_PIXELS).toBe(100);
    expect(HUD_HEIGHT_PIXELS).toBe(36);
  });
});
