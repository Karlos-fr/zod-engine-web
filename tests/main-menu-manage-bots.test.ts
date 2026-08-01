import { describe, expect, it } from "vitest";
import {
  checkMainMenuManageBots,
  handleMainMenuManageBotsWidgetEvent,
  MANAGE_BOTS_BUTTON_SPACER_PIXELS,
  MANAGE_BOTS_MAX_ROWS_PER_COLUMN,
  MANAGE_BOTS_START_BUTTON_WIDTH_PIXELS,
  MANAGE_BOTS_STOP_BUTTON_WIDTH_PIXELS,
  MANAGE_BOTS_TEAM_LABEL_WIDTH_PIXELS,
  processMainMenuManageBots,
  ZGMM_MANAGE_BOTS_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuManageBots";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  PlayerConnectionMode,
  TeamType,
} from "../src/simulation/SimulationConstants";
import { MainMenuEventType, MainMenuFlag } from "../src/ui/MainMenuBase";

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

  it("ports GMMManageBots Process as check-bots then widget processing", () => {
    const calls: string[] = [];

    processMainMenuManageBots({
      checkBots() {
        calls.push("checkBots");
      },
      processWidgets() {
        calls.push("processWidgets");
      },
    });

    expect(calls).toEqual(["checkBots", "processWidgets"]);
  });

  it("ports GMMManageBots CheckBots as no-op without player info", () => {
    const calls: string[] = [];

    checkMainMenuManageBots(null, [{ setGreen: (active) => calls.push(`start:${active}`) }], [
      { setGreen: (active) => calls.push(`stop:${active}`) },
    ]);

    expect(calls).toEqual([]);
  });

  it("ports GMMManageBots CheckBots as button coloring by active bot team", () => {
    const startGreen = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () => false);
    const stopGreen = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () => false);
    const startButtons = startGreen.map((_, index) => ({
      setGreen: (active: boolean) => {
        startGreen[index] = active;
      },
    }));
    const stopButtons = stopGreen.map((_, index) => ({
      setGreen: (active: boolean) => {
        stopGreen[index] = active;
      },
    }));

    checkMainMenuManageBots(
      [
        { team: TeamType.Red, mode: PlayerConnectionMode.Bot, ignored: false },
        { team: TeamType.Blue, mode: PlayerConnectionMode.Player, ignored: false },
        { team: TeamType.Green, mode: PlayerConnectionMode.Bot, ignored: true },
      ],
      startButtons,
      stopButtons,
    );

    expect(startGreen[TeamType.Red]).toBe(true);
    expect(stopGreen[TeamType.Red]).toBe(false);
    expect(startGreen[TeamType.Blue]).toBe(false);
    expect(stopGreen[TeamType.Blue]).toBe(true);
    expect(startGreen[TeamType.Green]).toBe(false);
    expect(stopGreen[TeamType.Green]).toBe(true);
  });

  it("ports GMMManageBots HandleWidgetEvent as start-bot unclick action", () => {
    const flags = new MainMenuFlag();
    const startButtons = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, index) => ({
      refId: 100 + index,
    }));
    const stopButtons = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, index) => ({
      refId: 200 + index,
    }));

    handleMainMenuManageBotsWidgetEvent(
      flags,
      MainMenuEventType.Unclick,
      { refId: startButtons[TeamType.Yellow].refId },
      startButtons,
      stopButtons,
    );

    expect(flags.startBot).toBe(true);
    expect(flags.startBotTeam).toBe(TeamType.Yellow);
    expect(flags.stopBot).toBe(false);
    expect(flags.stopBotTeam).toBe(-1);
  });

  it("ports GMMManageBots HandleWidgetEvent as stop-bot unclick action", () => {
    const flags = new MainMenuFlag();
    const startButtons = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, index) => ({
      refId: 100 + index,
    }));
    const stopButtons = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, index) => ({
      refId: 200 + index,
    }));

    handleMainMenuManageBotsWidgetEvent(
      flags,
      MainMenuEventType.Unclick,
      { refId: stopButtons[TeamType.Teal].refId },
      startButtons,
      stopButtons,
    );

    expect(flags.startBot).toBe(false);
    expect(flags.startBotTeam).toBe(-1);
    expect(flags.stopBot).toBe(true);
    expect(flags.stopBotTeam).toBe(TeamType.Teal);
  });

  it("ports GMMManageBots HandleWidgetEvent guard cases", () => {
    const flags = new MainMenuFlag();
    const startButtons = [{ refId: 10 }];
    const stopButtons = [{ refId: 20 }];

    handleMainMenuManageBotsWidgetEvent(
      flags,
      MainMenuEventType.Click,
      { refId: 10 },
      startButtons,
      stopButtons,
    );
    handleMainMenuManageBotsWidgetEvent(
      flags,
      MainMenuEventType.Unclick,
      null,
      startButtons,
      stopButtons,
    );
    handleMainMenuManageBotsWidgetEvent(
      flags,
      MainMenuEventType.Unclick,
      { refId: 999 },
      startButtons,
      stopButtons,
    );

    expect(flags.startBot).toBe(false);
    expect(flags.startBotTeam).toBe(-1);
    expect(flags.stopBot).toBe(false);
    expect(flags.stopBotTeam).toBe(-1);
  });
});
