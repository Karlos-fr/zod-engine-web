import { describe, expect, it } from "vitest";
import {
  MainMenuButton,
  ZGMM_MAIN_MENU_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenu";

describe("main menu", () => {
  it("adapts the gmm_main_menu.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenu");
    const secondImport = await import("../src/ui/MainMenu");

    expect(ZGMM_MAIN_MENU_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_MAIN_MENU_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_MAIN_MENU_HEADER_GUARD_PORTED,
    );
  });

  it("ports main menu button identifiers", () => {
    expect(MainMenuButton.ChangeTeams).toBe(0);
    expect(MainMenuButton.ManageBots).toBe(1);
    expect(MainMenuButton.PlayerList).toBe(2);
    expect(MainMenuButton.SelectMap).toBe(3);
    expect(MainMenuButton.Options).toBe(4);
    expect(MainMenuButton.QuitGame).toBe(5);
    expect(MainMenuButton.MaxButtons).toBe(6);
  });
});
