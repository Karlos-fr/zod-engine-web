import { describe, expect, it } from "vitest";
import {
  handleMainMenuPlayerListWidgetEvent,
  ZGMM_PLAYER_LIST_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuPlayerList";

describe("main menu player list", () => {
  it("adapts the gmm_player_list.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuPlayerList");
    const secondImport = await import("../src/ui/MainMenuPlayerList");

    expect(ZGMM_PLAYER_LIST_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_PLAYER_LIST_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_PLAYER_LIST_HEADER_GUARD_PORTED,
    );
  });

  it("ports GMMPlayerList HandleWidgetEvent as an empty widget hook", () => {
    const widget = { touched: false };

    expect(handleMainMenuPlayerListWidgetEvent(5, widget)).toBeUndefined();
    expect(widget).toEqual({ touched: false });
  });
});
