/**
 * Upstream: zcore.h
 */

import { PlayerConnectionMode, TeamType } from "./SimulationConstants";

/**
 * Port of upstream `_ZCORE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zcore.h:2
 */
export const ZCORE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `p_vote_choice`.
 * Role: Identifies a player's vote choice in core game voting.
 * Upstream: zcore.h:64-67
 */
export enum PlayerVoteChoice {
  Null = 0,
  Yes = 1,
  No = 2,
  Pass = 3,
  MaxVoteChoices = 4,
}

/**
 * Port of upstream `games_per_vp`.
 * Role: Defines how many played games grant one extra real voting-power point.
 * Upstream: zcore.h:110
 */
export const GAMES_PER_VOTING_POWER_POINT = 5;

/**
 * Port of upstream `real_voting_power`.
 * Role: Computes a player's effective voting power from base power and games played.
 * Upstream: zcore.h:108-113
 */
export function getRealVotingPower(votingPower: number, totalGames: number): number {
  return votingPower + Math.trunc(totalGames / GAMES_PER_VOTING_POWER_POINT);
}

/**
 * Port of upstream `p_info`.
 * Role: Tracks player identity, connection state, voting state, and login metadata.
 * Upstream: zcore.h:69-136
 */
export class PlayerInfo {
  static nextPlayerId = 0;

  name = "";
  team = TeamType.Null;
  mode = PlayerConnectionMode.Nobody;
  voteChoice = PlayerVoteChoice.Null;
  ignored = false;
  playerId: number;
  ip = "";
  loggedIn = false;
  dbId = -1;
  activated = false;
  votingPower = 0;
  lastTime = 0;
  totalGames = 0;
  botLoggedIn = false;

  constructor(playerId?: number) {
    this.clear();

    if (playerId === undefined) {
      this.playerId = PlayerInfo.nextPlayerId;
      PlayerInfo.nextPlayerId += 1;
      return;
    }

    this.playerId = playerId;
  }

  /**
   * Port of upstream `p_info::clear`.
   * Role: Resets player session, team, mode, vote, and ignored status.
   * Upstream: zcore.h:84-93
   */
  clear(): void {
    this.name = "";
    this.team = TeamType.Null;
    this.mode = PlayerConnectionMode.Nobody;
    this.voteChoice = PlayerVoteChoice.Null;
    this.ignored = false;
    this.logout();
  }

  /**
   * Port of upstream `p_info::logout`.
   * Role: Resets login metadata and bot bypass state.
   * Upstream: zcore.h:95-106
   */
  logout(): void {
    this.name = "";
    this.loggedIn = false;
    this.dbId = -1;
    this.activated = false;
    this.votingPower = 0;
    this.totalGames = 0;
    this.lastTime = 0;
    this.botLoggedIn = false;
  }

  /**
   * Port of upstream `real_voting_power`.
   * Role: Computes this player's effective voting power.
   * Upstream: zcore.h:108-113
   */
  realVotingPower(): number {
    return getRealVotingPower(this.votingPower, this.totalGames);
  }
}

/**
 * Port of upstream `allow_run`.
 * Role: Stores whether the core game loop is currently permitted to run.
 * Upstream: zcore.h:148
 */
export type CoreRunPermissionState = {
  allowRun: boolean;
};

/**
 * Port of upstream `AllowRun`.
 * Role: Updates whether the core game loop is permitted to run.
 * Upstream: zcore.h:148
 */
export function allowCoreRun(
  state: CoreRunPermissionState,
  allowRun = true,
): void {
  state.allowRun = allowRun;
}
