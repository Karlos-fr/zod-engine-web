import { describe, expect, it } from "vitest";
import { ACTIVE_TEAM_TYPE_COUNT } from "../src/simulation/SimulationConstants";
import {
  CHANGE_TEAMS_JOIN_BUTTON_WIDTH_PIXELS,
  highlightOurChangeTeam,
  processChangeTeamsMenu,
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

  it("ports GMMChangeTeams HighlightOurTeam as current team button highlight", () => {
    const calls: Array<[number, boolean]> = [];
    const teamButtons = Array.from(
      { length: ACTIVE_TEAM_TYPE_COUNT },
      (_, index) => ({
        setGreen(isGreen: boolean) {
          calls.push([index, isGreen]);
        },
      }),
    );

    highlightOurChangeTeam({
      playerTeam: 2,
      teamButtons,
    });

    expect(calls).toEqual([
      [0, false],
      [1, false],
      [2, false],
      [3, false],
      [4, false],
      [5, false],
      [6, false],
      [7, false],
      [8, false],
      [2, true],
    ]);
  });

  it("ports GMMChangeTeams HighlightOurTeam invalid-team guards as no-ops", () => {
    const calls: boolean[] = [];
    const teamButtons = Array.from(
      { length: ACTIVE_TEAM_TYPE_COUNT },
      () => ({
        setGreen(isGreen: boolean) {
          calls.push(isGreen);
        },
      }),
    );

    highlightOurChangeTeam({ playerTeam: null, teamButtons });
    highlightOurChangeTeam({ playerTeam: -1, teamButtons });
    highlightOurChangeTeam({
      playerTeam: ACTIVE_TEAM_TYPE_COUNT,
      teamButtons,
    });

    expect(calls).toEqual([]);
  });

  it("ports GMMChangeTeams Process as highlight then widget processing", () => {
    const calls: string[] = [];
    const teamButtons = Array.from(
      { length: ACTIVE_TEAM_TYPE_COUNT },
      (_, index) => ({
        setGreen(isGreen: boolean) {
          calls.push(`${index}:${isGreen}`);
        },
      }),
    );

    processChangeTeamsMenu({
      playerTeam: 1,
      teamButtons,
      processWidgets() {
        calls.push("widgets");
      },
    });

    expect(calls).toEqual([
      "0:false",
      "1:false",
      "2:false",
      "3:false",
      "4:false",
      "5:false",
      "6:false",
      "7:false",
      "8:false",
      "1:true",
      "widgets",
    ]);
  });
});
