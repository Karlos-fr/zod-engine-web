import { describe, expect, it } from "vitest";
import {
  MANAGE_BOTS_BUTTON_SPACER_PIXELS,
  MANAGE_BOTS_MAX_ROWS_PER_COLUMN,
  MANAGE_BOTS_START_BUTTON_WIDTH_PIXELS,
  MANAGE_BOTS_STOP_BUTTON_WIDTH_PIXELS,
  MANAGE_BOTS_TEAM_LABEL_WIDTH_PIXELS,
  ZGMM_MANAGE_BOTS_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuManageBots";

describe("main menu manage bots", () => {
  it("adapts the gmm_manage_bots.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuManageBots");
    const secondImport = await import("../src/ui/MainMenuManageBots");

    expect(ZGMM_MANAGE_BOTS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_MANAGE_BOTS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_MANAGE_BOTS_HEADER_GUARD_PORTED,
    );
  });

  it("ports max_rows as the manage-bots row limit", () => {
    expect(MANAGE_BOTS_MAX_ROWS_PER_COLUMN).toBe(4);
  });

  it("ports label_width as the team label width", () => {
    expect(MANAGE_BOTS_TEAM_LABEL_WIDTH_PIXELS).toBe(40);
  });

  it("ports start_width as the start button width", () => {
    expect(MANAGE_BOTS_START_BUTTON_WIDTH_PIXELS).toBe(25);
  });

  it("ports stop_width as the stop button width", () => {
    expect(MANAGE_BOTS_STOP_BUTTON_WIDTH_PIXELS).toBe(25);
  });

  it("ports button_spacer as the manage-bots control spacing", () => {
    expect(MANAGE_BOTS_BUTTON_SPACER_PIXELS).toBe(2);
  });
});
