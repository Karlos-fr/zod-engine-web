import { describe, expect, it } from "vitest";
import { PlayerConnectionMode, TeamType } from "../src/simulation/SimulationConstants";
import {
  allowCoreRun,
  GAMES_PER_VOTING_POWER_POINT,
  getRealVotingPower,
  PlayerInfo,
  PlayerVoteChoice,
  ZCORE_HEADER_GUARD_PORTED,
} from "../src/simulation/GameCore";
import type { CoreRunPermissionState } from "../src/simulation/GameCore";

describe("game core", () => {
  it("adapts the zcore.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/GameCore");
    const secondImport = await import("../src/simulation/GameCore");

    expect(ZCORE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCORE_HEADER_GUARD_PORTED).toBe(firstImport.ZCORE_HEADER_GUARD_PORTED);
  });

  it("ports games_per_vp as the voting-power progression interval", () => {
    expect(GAMES_PER_VOTING_POWER_POINT).toBe(5);
  });

  it("ports real_voting_power using integer games-per-vote progression", () => {
    expect(getRealVotingPower(2, 0)).toBe(2);
    expect(getRealVotingPower(2, 4)).toBe(2);
    expect(getRealVotingPower(2, 5)).toBe(3);
    expect(getRealVotingPower(2, 12)).toBe(4);
  });

  it("ports player vote choices", () => {
    expect(PlayerVoteChoice.Null).toBe(0);
    expect(PlayerVoteChoice.Yes).toBe(1);
    expect(PlayerVoteChoice.No).toBe(2);
    expect(PlayerVoteChoice.Pass).toBe(3);
    expect(PlayerVoteChoice.MaxVoteChoices).toBe(4);
  });

  it("ports p_info default construction with incrementing player ids", () => {
    PlayerInfo.nextPlayerId = 0;

    const firstPlayer = new PlayerInfo();
    const secondPlayer = new PlayerInfo();

    expect(firstPlayer.playerId).toBe(0);
    expect(secondPlayer.playerId).toBe(1);
    expect(PlayerInfo.nextPlayerId).toBe(2);
    expect(firstPlayer).toMatchObject({
      name: "",
      team: TeamType.Null,
      mode: PlayerConnectionMode.Nobody,
      voteChoice: PlayerVoteChoice.Null,
      ignored: false,
      ip: "",
      loggedIn: false,
      dbId: -1,
      activated: false,
      votingPower: 0,
      lastTime: 0,
      totalGames: 0,
      botLoggedIn: false,
    });
  });

  it("ports p_info configured construction without consuming the next player id", () => {
    PlayerInfo.nextPlayerId = 7;

    const player = new PlayerInfo(42);

    expect(player.playerId).toBe(42);
    expect(PlayerInfo.nextPlayerId).toBe(7);
  });

  it("ports p_info clear as player state and login reset", () => {
    const player = new PlayerInfo(42);
    player.name = "Ada";
    player.team = TeamType.Blue;
    player.mode = PlayerConnectionMode.Player;
    player.voteChoice = PlayerVoteChoice.Yes;
    player.ignored = true;
    player.ip = "127.0.0.1";
    player.loggedIn = true;
    player.dbId = 9;
    player.activated = true;
    player.votingPower = 3;
    player.totalGames = 12;
    player.lastTime = 99;
    player.botLoggedIn = true;

    player.clear();

    expect(player).toMatchObject({
      name: "",
      team: TeamType.Null,
      mode: PlayerConnectionMode.Nobody,
      voteChoice: PlayerVoteChoice.Null,
      ignored: false,
      playerId: 42,
      ip: "127.0.0.1",
      loggedIn: false,
      dbId: -1,
      activated: false,
      votingPower: 0,
      lastTime: 0,
      totalGames: 0,
      botLoggedIn: false,
    });
  });

  it("ports p_info logout as login metadata reset", () => {
    const player = new PlayerInfo(42);
    player.name = "Ada";
    player.team = TeamType.Blue;
    player.mode = PlayerConnectionMode.Player;
    player.voteChoice = PlayerVoteChoice.Yes;
    player.ignored = true;
    player.loggedIn = true;
    player.dbId = 9;
    player.activated = true;
    player.votingPower = 3;
    player.totalGames = 12;
    player.lastTime = 99;
    player.botLoggedIn = true;

    player.logout();

    expect(player).toMatchObject({
      name: "",
      team: TeamType.Blue,
      mode: PlayerConnectionMode.Player,
      voteChoice: PlayerVoteChoice.Yes,
      ignored: true,
      loggedIn: false,
      dbId: -1,
      activated: false,
      votingPower: 0,
      lastTime: 0,
      totalGames: 0,
      botLoggedIn: false,
    });
  });

  it("ports p_info real_voting_power from player fields", () => {
    const player = new PlayerInfo(42);
    player.votingPower = 2;
    player.totalGames = 12;

    expect(player.realVotingPower()).toBe(4);
  });

  it("ports AllowRun defaulting to true", () => {
    const state: CoreRunPermissionState = { allowRun: false };

    allowCoreRun(state);

    expect(state.allowRun).toBe(true);
  });

  it("ports AllowRun with an explicit value", () => {
    const state: CoreRunPermissionState = { allowRun: true };

    allowCoreRun(state, false);

    expect(state.allowRun).toBe(false);
  });
});
