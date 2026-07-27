import { describe, expect, it } from "vitest";
import {
  CHANGE_TEAMS_JOIN_BUTTON_WIDTH_PIXELS,
  ZGMM_CHANGE_TEAMS_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuChangeTeams";

describe("main menu change teams", () => {
  it("adapts the gmm_change_teams.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuChangeTeams");
    const secondImport = await import("../src/ui/MainMenuChangeTeams");

    expect(ZGMM_CHANGE_TEAMS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_CHANGE_TEAMS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_CHANGE_TEAMS_HEADER_GUARD_PORTED,
    );
  });

  it("ports button_width as the join button width", () => {
    expect(CHANGE_TEAMS_JOIN_BUTTON_WIDTH_PIXELS).toBe(40);
  });
});
