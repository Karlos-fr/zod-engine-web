import { describe, expect, it } from "vitest";
import {
  HUD_HEALTH_BAR_MAX_FILL_PIXELS,
  HUD_HEIGHT_PIXELS,
  HUD_PORTRAIT_X_PIXELS,
  HUD_PORTRAIT_Y_PIXELS,
  HUD_TIMER_HOURS_X_SHIFT_PIXELS,
  HUD_TIMER_Y_DOWN_SHIFT_PIXELS,
  HUD_WIDTH_PIXELS,
  HudButton,
  HudButtonState,
  HudEndUnit,
  HudResponseType,
  ZHUD_HEADER_GUARD_PORTED,
  getHudARefId,
} from "../src/ui/HudLayout";

describe("HUD layout", () => {
  it("adapts the zhud.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/HudLayout");
    const secondImport = await import("../src/ui/HudLayout");

    expect(ZHUD_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZHUD_HEADER_GUARD_PORTED).toBe(
      firstImport.ZHUD_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the upstream HUD viewport reservations", () => {
    expect(HUD_WIDTH_PIXELS).toBe(100);
    expect(HUD_HEIGHT_PIXELS).toBe(36);
  });

  it("ports HUD button identifiers", () => {
    expect(HudButton.A).toBe(0);
    expect(HudButton.B).toBe(1);
    expect(HudButton.D).toBe(2);
    expect(HudButton.G).toBe(3);
    expect(HudButton.R).toBe(4);
    expect(HudButton.T).toBe(5);
    expect(HudButton.V).toBe(6);
    expect(HudButton.Z).toBe(7);
    expect(HudButton.Menu).toBe(8);
    expect(HudButton.MaxHudButtons).toBe(9);
  });

  it("ports HUD button state identifiers", () => {
    expect(HudButtonState.Active).toBe(0);
    expect(HudButtonState.Inactive).toBe(1);
    expect(HudButtonState.Pressed).toBe(2);
    expect(HudButtonState.MaxHudButtonStates).toBe(3);
  });

  it("ports HUD response type identifiers", () => {
    expect(HudResponseType.Button).toBe(0);
    expect(HudResponseType.MiniMap).toBe(1);
    expect(HudResponseType.JumpToUnit).toBe(2);
  });

  it("ports HUD end-unit identifiers", () => {
    expect(new HudEndUnit()).toEqual({
      objectType: 0,
      objectId: 0,
      renderObjectId: 0,
    });
    expect(new HudEndUnit(1, 2, 3)).toEqual({
      objectType: 1,
      objectId: 2,
      renderObjectId: 3,
    });
  });

  it("ports ZHud::GetARefID as active HUD reference accessor", () => {
    expect(getHudARefId({ activeRefId: 42 })).toBe(42);
  });

  it("ports the HUD portrait hit-test coordinates", () => {
    expect(HUD_PORTRAIT_X_PIXELS).toBe(556);
    expect(HUD_PORTRAIT_Y_PIXELS).toBe(44);
  });

  it("ports the HUD health-bar fill length", () => {
    expect(HUD_HEALTH_BAR_MAX_FILL_PIXELS).toBe(74);
  });

  it("ports the HUD timer offsets", () => {
    expect(HUD_TIMER_Y_DOWN_SHIFT_PIXELS).toBe(9);
    expect(HUD_TIMER_HOURS_X_SHIFT_PIXELS).toBe(38);
  });
});
