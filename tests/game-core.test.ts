import { describe, expect, it } from "vitest";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET,
  MAX_BOT_BYPASS_SIZE,
  PlayerConnectionMode,
  TeamType,
} from "../src/simulation/SimulationConstants";
import { WaypointMode } from "../src/simulation/entities/EntityTypes";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  allowCoreRun,
  checkCoreRallypoint,
  createCoreObjectOk,
  createCoreRandomBotBypassData,
  deleteCoreObjectCleanUp,
  GAMES_PER_VOTING_POWER_POINT,
  getCoreObjectFromId,
  getCoreObjectIndex,
  getCoreVotesAgainst,
  getCoreVotesFor,
  getCoreVotesNeeded,
  getRealVotingPower,
  PlayerInfo,
  PlayerVoteChoice,
  resetCoreUnitLimitReached,
  runCore,
  setCoreBotBypassData,
  setupCore,
  setupCoreRandomizer,
  ZCORE_HEADER_GUARD_PORTED,
} from "../src/simulation/GameCore";
import type {
  CoreBotBypassDataState,
  CoreRandomizerState,
  CoreRunPermissionState,
  CoreUnitLimitState,
} from "../src/simulation/GameCore";

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

  it("ports ZCore Run as the empty upstream run hook", () => {
    expect(runCore()).toBeUndefined();
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

  it("ports ZCore SetBotBypassData as bounded buffer copy", () => {
    const state: CoreBotBypassDataState = {
      botBypassData: new Uint8Array([9]),
      botBypassSize: 1,
    };
    const data = new Uint8Array([1, 2, 3, 4]);

    setCoreBotBypassData(state, data, 3);
    data[0] = 99;

    expect(Array.from(state.botBypassData)).toEqual([1, 2, 3]);
    expect(state.botBypassSize).toBe(3);

    setCoreBotBypassData(state, new Uint8Array([5]), 0);
    expect(Array.from(state.botBypassData)).toEqual([1, 2, 3]);
    expect(state.botBypassSize).toBe(3);

    setCoreBotBypassData(
      state,
      new Uint8Array(MAX_BOT_BYPASS_SIZE + 1),
      MAX_BOT_BYPASS_SIZE + 1,
    );
    expect(Array.from(state.botBypassData)).toEqual([1, 2, 3]);
    expect(state.botBypassSize).toBe(3);
  });

  it("ports ZCore CreateRandomBotBypassData as randomized size and byte fill", () => {
    const values = [7, 1, 255, 0, 128];
    const requestedMaxes: number[] = [];

    const bypass = createCoreRandomBotBypassData((maxExclusive) => {
      requestedMaxes.push(maxExclusive);
      return values.shift() ?? 0;
    });

    expect(bypass.size).toBe(MAX_BOT_BYPASS_SIZE - 7);
    expect(Array.from(bypass.data.slice(0, 4))).toEqual([1, 255, 0, 128]);
    expect(bypass.data).toHaveLength(MAX_BOT_BYPASS_SIZE - 7);
    expect(requestedMaxes.slice(0, 5)).toEqual([
      MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET,
      256,
      256,
      256,
      256,
    ]);
  });

  it("ports ZCore SetupRandomizer as Unix-time seed initialization", () => {
    const state: CoreRandomizerState = { randomizerSeed: 0 };

    setupCoreRandomizer(state, () => 1_725_123_456_789);

    expect(state.randomizerSeed).toBe(1_725_123_456);
  });

  it("ports ZCore Setup as core randomizer initialization", () => {
    const state: CoreRandomizerState = { randomizerSeed: 0 };

    setupCore(state, () => 2_000_000_999);

    expect(state.randomizerSeed).toBe(2_000_000);
  });

  it("ports ZCore GetObjectFromID as binary-search object lookup", () => {
    const first = new GameEntity({
      id: "first",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 10,
    });
    const second = new GameEntity({
      id: "second",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 20,
    });

    expect(getCoreObjectFromId(20, [first, second])).toBe(second);
    expect(getCoreObjectFromId(30, [first, second])).toBeNull();
  });

  it("ports ZCore GetObjectIndex as identity index lookup", () => {
    const first = { refId: 10 };
    const second = { refId: 20 };
    const sameShape = { refId: 20 };

    expect(getCoreObjectIndex(second, [first, second, second])).toBe(1);
    expect(getCoreObjectIndex(sameShape, [first, second])).toBe(-1);
    expect(getCoreObjectIndex(first, [])).toBe(-1);
  });

  it("ports ZCore VotesFor as yes-vote real voting power total", () => {
    const yesPlayer = new PlayerInfo(1);
    yesPlayer.voteChoice = PlayerVoteChoice.Yes;
    yesPlayer.votingPower = 2;
    yesPlayer.totalGames = 10;
    const noPlayer = new PlayerInfo(2);
    noPlayer.voteChoice = PlayerVoteChoice.No;
    noPlayer.votingPower = 99;
    const passPlayer = new PlayerInfo(3);
    passPlayer.voteChoice = PlayerVoteChoice.Pass;
    passPlayer.votingPower = 50;

    expect(getCoreVotesFor([yesPlayer, noPlayer, passPlayer])).toBe(4);
  });

  it("ports ZCore VotesAgainst as no-vote real voting power total", () => {
    const yesPlayer = new PlayerInfo(1);
    yesPlayer.voteChoice = PlayerVoteChoice.Yes;
    yesPlayer.votingPower = 99;
    const noPlayer = new PlayerInfo(2);
    noPlayer.voteChoice = PlayerVoteChoice.No;
    noPlayer.votingPower = 3;
    noPlayer.totalGames = 5;
    const passPlayer = new PlayerInfo(3);
    passPlayer.voteChoice = PlayerVoteChoice.Pass;
    passPlayer.votingPower = 50;

    expect(getCoreVotesAgainst([yesPlayer, noPlayer, passPlayer])).toBe(4);
  });

  it("ports ZCore VotesNeeded as half of rounded non-pass real voting power", () => {
    const yesPlayer = new PlayerInfo(1);
    yesPlayer.voteChoice = PlayerVoteChoice.Yes;
    yesPlayer.votingPower = 2;
    const noPlayer = new PlayerInfo(2);
    noPlayer.voteChoice = PlayerVoteChoice.No;
    noPlayer.votingPower = 1;
    noPlayer.totalGames = 5;
    const nullPlayer = new PlayerInfo(3);
    nullPlayer.voteChoice = PlayerVoteChoice.Null;
    nullPlayer.votingPower = 1;
    const passPlayer = new PlayerInfo(4);
    passPlayer.voteChoice = PlayerVoteChoice.Pass;
    passPlayer.votingPower = 99;

    expect(
      getCoreVotesNeeded([yesPlayer, noPlayer, nullPlayer, passPlayer]),
    ).toBe(3);
  });

  it("ports ZCore CreateObjectOk as active-team owner validation", () => {
    expect(createCoreObjectOk(1, 2, 30, 40, 0, 5, 6)).toBe(true);
    expect(
      createCoreObjectOk(1, 2, 30, 40, ACTIVE_TEAM_TYPE_COUNT - 1, 5, 6),
    ).toBe(true);
    expect(createCoreObjectOk(1, 2, 30, 40, -1, 5, 6)).toBe(false);
    expect(
      createCoreObjectOk(1, 2, 30, 40, ACTIVE_TEAM_TYPE_COUNT, 5, 6),
    ).toBe(false);
  });

  it("ports ZCore CheckRallypoint as accepting move waypoints only", () => {
    const entity = new GameEntity({
      id: "entity",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(checkCoreRallypoint(entity, { mode: WaypointMode.Move })).toBe(true);
    expect(checkCoreRallypoint(entity, { mode: WaypointMode.Attack })).toBe(false);
  });

  it("ports ZCore DeleteObjectCleanUp as the empty upstream cleanup hook", () => {
    const entity = new GameEntity({
      id: "entity",
      kind: "robot",
      position: { x: 0, y: 0 },
      refId: 10,
    });

    expect(deleteCoreObjectCleanUp(entity)).toBeUndefined();
    expect(entity.refId).toBe(10);
  });

  it("ports ZCore ResetUnitLimitReached as per-team unit-limit reset", () => {
    const state: CoreUnitLimitState = {
      unitLimitReached: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT + 1 }, () => true),
      teamUnitsAvailable: Array.from(
        { length: ACTIVE_TEAM_TYPE_COUNT + 1 },
        (_value, index) => index + 1,
      ),
    };

    resetCoreUnitLimitReached(state);

    expect(state.unitLimitReached.slice(0, ACTIVE_TEAM_TYPE_COUNT)).toEqual(
      Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () => false),
    );
    expect(state.teamUnitsAvailable.slice(0, ACTIVE_TEAM_TYPE_COUNT)).toEqual(
      Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () => 0),
    );
    expect(state.unitLimitReached[ACTIVE_TEAM_TYPE_COUNT]).toBe(true);
    expect(state.teamUnitsAvailable[ACTIVE_TEAM_TYPE_COUNT]).toBe(
      ACTIVE_TEAM_TYPE_COUNT + 1,
    );
  });
});
