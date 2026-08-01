import { describe, expect, it } from "vitest";
import {
  PlayerConnectionMode,
  TeamType,
} from "../src/simulation/SimulationConstants";
import {
  handleMainMenuPlayerListWidgetEvent,
  MAIN_MENU_PLAYER_LIST_TEAM_LABELS,
  processMainMenuPlayerList,
  setupMainMenuPlayerList,
  ZGMM_PLAYER_LIST_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuPlayerList";
import { MainMenuListState } from "../src/ui/MainMenuWidgets";

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

  it("ports GMMPlayerList Process as setup-list then widget processing", () => {
    const calls: string[] = [];

    processMainMenuPlayerList({
      setupList() {
        calls.push("setupList");
      },
      processWidgets() {
        calls.push("processWidgets");
      },
    });

    expect(calls).toEqual(["setupList", "processWidgets"]);
  });

  it("ports GMMPlayerList SetupList as no-op without player info", () => {
    const labels: string[] = [];
    const state = {
      playerInfo: null,
      entries: [{ text: "old", refId: 1, sortNumber: 1, state: MainMenuListState.Pressed }],
      visibleEntries: 1,
      viewIndex: 9,
      playersOnlineNumberLabel: {
        setText: (text: string) => labels.push(text),
      },
    };

    setupMainMenuPlayerList(state);

    expect(state.entries).toEqual([
      { text: "old", refId: 1, sortNumber: 1, state: MainMenuListState.Pressed },
    ]);
    expect(labels).toEqual([]);
    expect(state.viewIndex).toBe(9);
  });

  it("ports GMMPlayerList SetupList as human-player row rebuild and count", () => {
    const labels: string[] = [];
    const state = {
      playerInfo: [
        {
          name: "blue-player",
          playerId: 20,
          team: TeamType.Blue,
          mode: PlayerConnectionMode.Player,
        },
        {
          name: "red-player",
          playerId: 10,
          team: TeamType.Red,
          mode: PlayerConnectionMode.Player,
        },
        {
          name: "bot",
          playerId: 30,
          team: TeamType.Green,
          mode: PlayerConnectionMode.Bot,
        },
      ],
      entries: [{ text: "old", refId: 99, sortNumber: 99, state: MainMenuListState.Pressed }],
      visibleEntries: 1,
      viewIndex: 5,
      playersOnlineNumberLabel: {
        setText: (text: string) => labels.push(text),
      },
    };

    setupMainMenuPlayerList(state);

    expect(labels).toEqual(["2"]);
    expect(state.entries).toEqual([
      {
        text: `${MAIN_MENU_PLAYER_LIST_TEAM_LABELS[TeamType.Red]}: red-player`,
        refId: 10,
        sortNumber: TeamType.Red,
        state: MainMenuListState.Normal,
      },
      {
        text: `${MAIN_MENU_PLAYER_LIST_TEAM_LABELS[TeamType.Blue]}: blue-player`,
        refId: 20,
        sortNumber: TeamType.Blue,
        state: MainMenuListState.Normal,
      },
    ]);
    expect(state.viewIndex).toBe(1);
  });

  it("ports GMMPlayerList SetupList as empty filtered list view clamp", () => {
    const labels: string[] = [];
    const state = {
      playerInfo: [
        {
          name: "spectator",
          playerId: 30,
          team: TeamType.Green,
          mode: PlayerConnectionMode.Spectator,
        },
      ],
      entries: [],
      visibleEntries: 3,
      viewIndex: 2,
      playersOnlineNumberLabel: {
        setText: (text: string) => labels.push(text),
      },
    };

    setupMainMenuPlayerList(state);

    expect(labels).toEqual(["0"]);
    expect(state.entries).toEqual([]);
    expect(state.viewIndex).toBe(0);
  });
});
