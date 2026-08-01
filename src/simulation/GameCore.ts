/**
 * Upstream: zcore.h
 */

import { GameEntity } from "./entities/GameEntity";
import { WaypointMode, type Waypoint } from "./entities/EntityTypes";
import { ZEncryptAES } from "./EncryptionAES";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  BuildingType,
  MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET,
  MAX_BOT_BYPASS_SIZE,
  PlayerConnectionMode,
  RobotType,
  TeamType,
  VehicleType,
} from "./SimulationConstants";
import { MapObjectType } from "../world/MapFormat";

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
 * Port of upstream `ZCore::Run`.
 * Role: Preserves the core run hook; upstream implementation is currently empty.
 * Upstream: zcore.cpp:30-33
 */
export function runCore(): void {}

/**
 * Port of upstream `ZCore::InitEncryption` key bytes.
 * Role: Defines the fixed AES-128 key used by the core protocol encryption helper.
 * Upstream: zcore.cpp:62
 */
export const CORE_ENCRYPTION_KEY_BYTES = [
  0xfe, 0xea, 0x42, 0x35, 0x78, 0x02, 0x57, 0xec, 0xee, 0x92, 0x11, 0x58,
  0xc2, 0x5d, 0xc3, 0x23,
] as const;

/**
 * Port of upstream `ZCore::InitEncryption`.
 * Role: Initializes the core AES helper with the fixed 128-bit protocol key.
 * Upstream: zcore.cpp:60-93
 */
export function initCoreEncryption(encryption: ZEncryptAES): 0 | 1 {
  return encryption.initKey(CORE_ENCRYPTION_KEY_BYTES, 128);
}

/**
 * Port of upstream `ZCore::UnitRequiresActivation`.
 * Role: Reports whether a unit type requires player activation before use.
 * Upstream: zcore.cpp:320-353
 */
export function unitRequiresActivation(
  objectType: number,
  objectId: number,
): boolean {
  switch (objectType) {
    case MapObjectType.Robot:
      switch (objectId) {
        case RobotType.Pyro:
        case RobotType.Laser:
          return true;
      }
      break;
    case MapObjectType.Vehicle:
      switch (objectId) {
        case VehicleType.Jeep:
        case VehicleType.Light:
          return false;
        default:
          return true;
      }
  }

  return false;
}

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
 * Port of upstream `ZCore` bot-bypass data fields.
 * Role: Stores a bounded bot pathing bypass data buffer.
 * Upstream: zcore.h:161-162
 */
export type CoreBotBypassDataState = {
  botBypassData: Uint8Array;
  botBypassSize: number;
};

/**
 * Port of upstream `ZCore` unit-limit tracking fields.
 * Role: Tracks per-team unit limit saturation and available unit counts.
 * Upstream: zcore.h:196-197
 */
export type CoreUnitLimitState = {
  unitLimitReached: boolean[];
  teamUnitsAvailable: number[];
};

/**
 * Port of upstream `ZCore::AreaIsFortTurret` object dependency surface.
 * Role: Provides object identity, selection overlap, and cannon-placement checks.
 * Upstream: zcore.cpp:699-707
 */
export type CoreFortTurretAreaObject = {
  getObjectId(): {
    objectType: number;
    objectId: number;
  };
  withinSelection(selection: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): boolean;
  cannonNotPlacable(selection: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): boolean;
};

/**
 * Port of upstream `ZCore::CreateRandomBotBypassData` output.
 * Role: Carries generated bot pathing bypass data and its byte size.
 * Upstream: zcore.cpp:44-52
 */
export type CoreRandomBotBypassData = {
  data: Uint8Array;
  size: number;
};

/**
 * Port of upstream packed `waypoint` byte size.
 * Role: Defines the per-waypoint payload size used by `ZCore::CreateWaypointSendData`.
 * Upstream: zobject.h:155-164, zcore.cpp:482-493
 */
export const CORE_PACKED_WAYPOINT_BYTES = 15;

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

/**
 * Port of upstream `ZCore::SetBotBypassData`.
 * Role: Stores bounded bot pathing bypass data.
 * Upstream: zcore.cpp:35-42
 */
export function setCoreBotBypassData(
  state: CoreBotBypassDataState,
  data: Uint8Array,
  size: number,
): void {
  if (size > MAX_BOT_BYPASS_SIZE) return;
  if (size < 1) return;

  state.botBypassData = data.slice(0, size);
  state.botBypassSize = size;
}

/**
 * Port of upstream `ZCore::CreateRandomBotBypassData`.
 * Role: Generates random bot pathing bypass bytes with the upstream randomized size.
 * Upstream: zcore.cpp:44-52
 */
export function createCoreRandomBotBypassData(
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): CoreRandomBotBypassData {
  const size =
    MAX_BOT_BYPASS_SIZE - randomInt(MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET);
  const data = new Uint8Array(size);

  for (let i = 0; i < size; i += 1) {
    data[i] = randomInt(256);
  }

  return { data, size };
}

/**
 * Port of upstream `ZCore::CreateWaypointSendData`.
 * Role: Serializes an object ref id and packed waypoint list into the waypoint-send payload.
 * Upstream: zcore.cpp:475-496
 */
export function createCoreWaypointSendData(
  refId: number,
  waypointList: readonly Pick<
    Waypoint,
    "mode" | "refId" | "x" | "y" | "attackTo" | "playerGiven"
  >[],
): Uint8Array {
  const data = new Uint8Array(
    8 + waypointList.length * CORE_PACKED_WAYPOINT_BYTES,
  );
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  view.setInt32(0, refId, true);
  view.setInt32(4, waypointList.length, true);

  let offset = 8;
  for (const waypoint of waypointList) {
    view.setInt8(offset, waypoint.mode);
    view.setInt32(offset + 1, waypoint.refId, true);
    view.setInt32(offset + 5, waypoint.x, true);
    view.setInt32(offset + 9, waypoint.y, true);
    view.setUint8(offset + 13, waypoint.attackTo ? 1 : 0);
    view.setUint8(offset + 14, waypoint.playerGiven ? 1 : 0);
    offset += CORE_PACKED_WAYPOINT_BYTES;
  }

  return data;
}

/**
 * Port of upstream randomizer seed state owned by `ZCore`.
 * Role: Stores the Unix-time seed used to initialize simulation random behavior.
 * Upstream: zcore.cpp:54-58
 */
export type CoreRandomizerState = {
  randomizerSeed: number;
};

/**
 * Port of upstream `ZCore::SetupRandomizer`.
 * Role: Initializes the core randomizer seed from the current Unix time in seconds.
 * Upstream: zcore.cpp:54-58
 */
export function setupCoreRandomizer(
  state: CoreRandomizerState,
  now: () => number = Date.now,
): void {
  state.randomizerSeed = Math.trunc(now() / 1000);
}

/**
 * Port of upstream `ZCore::Setup`.
 * Role: Initializes core runtime state before the game loop starts.
 * Upstream: zcore.cpp:25-28
 */
export function setupCore(
  state: CoreRandomizerState,
  now: () => number = Date.now,
): void {
  setupCoreRandomizer(state, now);
}

/**
 * Port of upstream `ZCore::GetObjectFromID`.
 * Role: Finds an entity by reference id in a caller-provided object list.
 * Upstream: zcore.cpp:184-187
 */
export function getCoreObjectFromId(
  refId: number,
  objectList: GameEntity[],
): GameEntity | null {
  return GameEntity.getObjectFromIdBinarySearch(refId, objectList);
}

/**
 * Port of upstream `ZCore::GetObjectIndex`.
 * Role: Returns the index of an object reference in a caller-provided list.
 * Upstream: zcore.cpp:172-182
 */
export function getCoreObjectIndex<TObject>(
  object: TObject,
  objectList: TObject[],
): number {
  for (let i = 0; i < objectList.length; i += 1) {
    if (objectList[i] === object) {
      return i;
    }
  }

  return -1;
}

/**
 * Port of upstream `ZCore::VotesFor`.
 * Role: Sums real voting power for players currently voting yes.
 * Upstream: zcore.cpp:420-430
 */
export function getCoreVotesFor(players: PlayerInfo[]): number {
  let votes = 0;

  for (const player of players) {
    if (player.voteChoice === PlayerVoteChoice.Yes) {
      votes += player.realVotingPower();
    }
  }

  return votes;
}

/**
 * Port of upstream `ZCore::VotesAgainst`.
 * Role: Sums real voting power for players currently voting no.
 * Upstream: zcore.cpp:432-442
 */
export function getCoreVotesAgainst(players: PlayerInfo[]): number {
  let votes = 0;

  for (const player of players) {
    if (player.voteChoice === PlayerVoteChoice.No) {
      votes += player.realVotingPower();
    }
  }

  return votes;
}

/**
 * Port of upstream `ZCore::VotesNeeded`.
 * Role: Sums non-pass real voting power, rounds it up to an even number, and
 * returns half as the required majority threshold.
 * Upstream: zcore.cpp:405-418
 */
export function getCoreVotesNeeded(players: PlayerInfo[]): number {
  let neededPower = 0;

  for (const player of players) {
    if (player.voteChoice !== PlayerVoteChoice.Pass) {
      neededPower += player.realVotingPower();
    }
  }

  if (neededPower % 2 !== 0) neededPower += 1;

  return neededPower / 2;
}

/**
 * Port of upstream `ZCore::CreateObjectOk`.
 * Role: Validates object creation requests before spawning; upstream currently only
 * rejects invalid owner teams.
 * Upstream: zcore.cpp:355-364
 */
export function createCoreObjectOk(
  objectType: number,
  objectId: number,
  x: number,
  y: number,
  owner: number,
  buildLevel: number,
  extraLinks: number,
): boolean {
  void objectType;
  void objectId;
  void x;
  void y;
  void buildLevel;
  void extraLinks;

  return owner >= 0 && owner < ACTIVE_TEAM_TYPE_COUNT;
}

/**
 * Port of upstream `ZCore::CheckRallypoint`.
 * Role: Accepts rally points only when the waypoint is a move order.
 * Upstream: zcore.cpp:189-194
 */
export function checkCoreRallypoint(
  obj: GameEntity | null,
  waypoint: { mode: number },
): boolean {
  void obj;
  return waypoint.mode === WaypointMode.Move;
}

/**
 * Port of upstream `ZCore::DeleteObjectCleanUp`.
 * Role: Hook for object deletion cleanup; upstream implementation is empty.
 * Upstream: zcore.cpp:632-635
 */
export function deleteCoreObjectCleanUp(obj: GameEntity | null): void {
  void obj;
}

/**
 * Port of upstream `ZCore::AreaIsFortTurret`.
 * Role: Reports whether a 2x2 tile area overlaps a fort body but remains cannon-placeable.
 * Upstream: zcore.cpp:690-711
 */
export function areaIsCoreFortTurret(
  objectList: readonly CoreFortTurretAreaObject[],
  tileX: number,
  tileY: number,
): boolean {
  const left = tileX * 16;
  const top = tileY * 16;
  const right = left + 32;
  const bottom = top + 32;
  const selection = { left, right, top, bottom };

  for (const object of objectList) {
    const objectId = object.getObjectId();

    if (
      objectId.objectType !== MapObjectType.Building ||
      (objectId.objectId !== BuildingType.FortFront &&
        objectId.objectId !== BuildingType.FortBack)
    ) {
      continue;
    }

    if (
      object.withinSelection(selection) &&
      !object.cannonNotPlacable(selection)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Port of upstream `ZCore::ResetUnitLimitReached`.
 * Role: Clears per-team unit-limit flags and available-unit counters.
 * Upstream: zcore.cpp:713-722
 */
export function resetCoreUnitLimitReached(
  state: CoreUnitLimitState,
): void {
  for (let i = 0; i < ACTIVE_TEAM_TYPE_COUNT; i += 1) {
    state.unitLimitReached[i] = false;
    state.teamUnitsAvailable[i] = 0;
  }
}
