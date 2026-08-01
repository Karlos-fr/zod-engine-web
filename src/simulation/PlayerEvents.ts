/**
 * Upstream: zplayer_events.cpp
 */
import {
  MAX_VERSION_PACKET_CHARS,
  TcpEvent,
  type CraneAnimPacket,
  type DriverHitPacket,
} from "./EventHandler";
import { GAME_VERSION } from "./SimulationConstants";

/**
 * Port of upstream `ZPlayer::ProcessPlayerID` call target.
 * Role: Describes player processing for player-id events.
 * Upstream: zplayer_events.cpp:1229
 */
export type PlayerIdProcessor = {
  processPlayerId(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSelectableMapList` call target.
 * Role: Describes player processing for selectable-map-list events.
 * Upstream: zplayer_events.cpp:1234
 */
export type PlayerSelectableMapListProcessor = {
  processSelectableMapList(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream player client socket version send surface.
 * Role: Sends the fixed version packet back to the server after a version request.
 * Upstream: zplayer_events.cpp:1462
 */
export type PlayerVersionClientSocket = {
  sendMessage(packId: TcpEvent, data: Uint8Array, size: number): number;
};

/**
 * Port of upstream `ZPlayer::request_version_event` state.
 * Role: Holds the client socket used to return this player's game version.
 * Upstream: zplayer_events.cpp:1449-1463
 */
export type PlayerRequestVersionEventState = {
  clientSocket: PlayerVersionClientSocket;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerName` call target.
 * Role: Describes player processing for player-name events.
 * Upstream: zplayer_events.cpp:1174
 */
export type PlayerNameProcessor = {
  processSetLocalPlayerName(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerTeam` call target.
 * Role: Describes player processing for player-team events.
 * Upstream: zplayer_events.cpp:1179
 */
export type PlayerTeamProcessor = {
  processSetLocalPlayerTeam(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerMode` call target.
 * Role: Describes player processing for player-mode events.
 * Upstream: zplayer_events.cpp:1184
 */
export type PlayerModeProcessor = {
  processSetLocalPlayerMode(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerIgnored` call target.
 * Role: Describes player processing for player-ignored events.
 * Upstream: zplayer_events.cpp:1189
 */
export type PlayerIgnoredProcessor = {
  processSetLocalPlayerIgnored(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerLogInfo` call target.
 * Role: Describes player processing for player-log-info events.
 * Upstream: zplayer_events.cpp:1194
 */
export type PlayerLogInfoProcessor = {
  processSetLocalPlayerLogInfo(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerVoteInfo` call target.
 * Role: Describes player processing for local player vote-info events.
 * Upstream: zplayer_events.cpp:1199
 */
export type PlayerVoteInfoProcessor = {
  processSetLocalPlayerVoteInfo(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZPlayer::ProcessVoteInfo` call target.
 * Role: Describes player processing for global vote-info events.
 * Upstream: zplayer_events.cpp:1219
 */
export type PlayerGlobalVoteInfoProcessor = {
  processVoteInfo(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZVote` refresh surface used by player vote-info events.
 * Role: Reports active vote state and rebuilds rendered vote counters.
 * Upstream: zplayer_events.cpp:1202-1203
 */
export type PlayerVoteInfoPanel = {
  voteInProgress(): boolean;
  setupImages(
    realVotingPower: number,
    votesNeeded: number,
    votesFor: number,
    votesAgainst: number,
    appendDescription: string,
  ): void;
};

/**
 * Port of upstream `ZPlayer::set_player_voteinfo_event` state.
 * Role: Provides vote payload processing and vote counter values for image refresh.
 * Upstream: zplayer_events.cpp:1197-1205
 */
export type PlayerVoteInfoEventState = PlayerVoteInfoProcessor & {
  vote: PlayerVoteInfoPanel;
  getOurRealVotingPower(): number;
  getVotesNeeded(): number;
  getVotesFor(): number;
  getVotesAgainst(): number;
  getVoteAppendDescription(): string;
};

/**
 * Port of upstream `ZPlayer::set_vote_info_event` state.
 * Role: Provides global vote payload processing and vote counter values for image refresh.
 * Upstream: zplayer_events.cpp:1217-1225
 */
export type PlayerGlobalVoteInfoEventState = PlayerGlobalVoteInfoProcessor &
  Omit<PlayerVoteInfoEventState, keyof PlayerVoteInfoProcessor>;

/**
 * Port of upstream `ZPlayer::ProcessUpdateGamePaused` call target.
 * Role: Describes player processing for pause-state events.
 * Upstream: zplayer_events.cpp:1209
 */
export type PlayerGamePausedProcessor = {
  processUpdateGamePaused(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessUpdateGameSpeed` call target.
 * Role: Describes player processing for game-speed events.
 * Upstream: zplayer_events.cpp:1214
 */
export type PlayerGameSpeedProcessor = {
  processUpdateGameSpeed(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessZSettings` call target.
 * Role: Describes player processing for settings events.
 * Upstream: zplayer_events.cpp:1097
 */
export type PlayerSettingsProcessor = {
  processZSettings(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessObjectLidState` call target.
 * Role: Describes player processing for object lid-state events.
 * Upstream: zplayer_events.cpp:1109
 */
export type PlayerObjectLidStateProcessor = {
  processObjectLidState(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZPlayer::ProcessZoneInfo` call target.
 * Role: Describes player processing for zone-info events.
 * Upstream: zplayer_events.cpp:678
 */
export type PlayerZoneInfoProcessor = {
  processZoneInfo(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetTeam` call target.
 * Role: Describes player processing for team events.
 * Upstream: zplayer_events.cpp:1367
 */
export type PlayerTeamAssignmentProcessor = {
  processSetTeam(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessObjectLoc` call target.
 * Role: Describes player processing for object-location events.
 * Upstream: zplayer_events.cpp:766
 */
export type PlayerObjectLocationProcessor = {
  processObjectLoc(data: Uint8Array | string | null, size: number): unknown;
};

/**
 * Port of upstream `ZPlayer::ProcessObjectGroupInfo` call target.
 * Role: Describes player processing for object group-info events.
 * Upstream: zplayer_events.cpp:1033
 */
export type PlayerObjectGroupInfoProcessor = {
  processObjectGroupInfo(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZPlayer::ProcessSetGrenadeState` call target.
 * Role: Applies a grenade-state payload and returns the affected object.
 * Upstream: zplayer_events.cpp:1265
 */
export type PlayerGrenadeStateProcessor<TObject = unknown> = {
  processSetGrenadeState(
    data: Uint8Array | string | null,
    size: number,
  ): TObject | null;
};

/**
 * Port of upstream `ZHud` selected-object refresh surface.
 * Role: Reports and rerenders the selected HUD object after grenade-state updates.
 * Upstream: zplayer_events.cpp:1269-1270
 */
export type PlayerGrenadeHud<TObject = unknown> = {
  getSelectedObject(): TObject | null;
  reRenderAll(): void;
};

/**
 * Port of upstream `selection_info::UpdateGroupMember` call target.
 * Role: Refreshes selection-group details for the affected grenade object.
 * Upstream: zplayer_events.cpp:1272
 */
export type PlayerGrenadeSelection<TObject = unknown> = {
  updateGroupMember(object: TObject): boolean;
};

/**
 * Port of upstream `ZPlayer::set_grenade_amount_event` state.
 * Role: Holds grenade processing, HUD refresh, and selection cursor update targets.
 * Upstream: zplayer_events.cpp:1261-1274
 */
export type PlayerGrenadeAmountEventState<TObject = unknown> =
  PlayerGrenadeStateProcessor<TObject> & {
    hud: PlayerGrenadeHud<TObject>;
    selection: PlayerGrenadeSelection<TObject>;
    determineCursor(): void;
  };

/**
 * Port of upstream `ZPlayer::ProcessFireMissile` call target.
 * Role: Describes player processing for missile-fire events.
 * Upstream: zplayer_events.cpp:868
 */
export type PlayerFireMissileProcessor = {
  processFireMissile(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZObject::ShowWaypoints` dependency surface.
 * Role: Provides waypoint display activation after player waypoint updates.
 * Upstream: zplayer_events.cpp:749
 */
export type PlayerWaypointObject = {
  showWaypoints(): void;
};

/**
 * Port of upstream `ZPlayer::ProcessWaypointData` call target.
 * Role: Describes player processing for object-waypoints events.
 * Upstream: zplayer_events.cpp:743
 */
export type PlayerWaypointProcessor<TObject extends PlayerWaypointObject = PlayerWaypointObject> = {
  processWaypointData(
    data: Uint8Array | string | null,
    size: number,
  ): TObject | null;
};

/**
 * Port of upstream `ZPlayer::ProcessRallypointData` call target.
 * Role: Describes player processing for object-rallypoints events.
 * Upstream: zplayer_events.cpp:756
 */
export type PlayerRallypointProcessor = {
  processRallypointData(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZObject::DoHitEffect` dependency surface.
 * Role: Provides hit-effect activation after player object-health updates.
 * Upstream: zplayer_events.cpp:853
 */
export type PlayerObjectHealthObject = {
  doHitEffect(): void;
};

/**
 * Port of upstream `ZPlayer::ProcessObjectHealthTeam` call target.
 * Role: Describes player processing for object-health events.
 * Upstream: zplayer_events.cpp:849
 */
export type PlayerObjectHealthTeamProcessor<
  TObject extends PlayerObjectHealthObject = PlayerObjectHealthObject,
> = {
  processObjectHealthTeam(
    data: Uint8Array | string | null,
    size: number,
  ): TObject | null;
};

/**
 * Port of upstream `ZObject::DoDriverHitEffect` dependency surface.
 * Role: Provides the driver-hit effect trigger for player driver-hit events.
 * Upstream: zplayer_events.cpp:1154
 */
export type PlayerDriverHitEffectObject = {
  getRefId(): number;
  doDriverHitEffect(): void;
};

/**
 * Port of upstream `ZPlayer` object list fields used by driver-hit effects.
 * Role: Holds objects looked up by reference id for driver-hit effect events.
 * Upstream: zplayer_events.cpp:1150
 */
export type PlayerDriverHitEffectState<
  TObject extends PlayerDriverHitEffectObject = PlayerDriverHitEffectObject,
> = {
  objectList: TObject[];
};

/**
 * Port of upstream `ZObject::DoCraneAnim` dependency surface.
 * Role: Provides crane animation activation for player crane-animation events.
 * Upstream: zplayer_events.cpp:1064
 */
export type PlayerCraneAnimObject = {
  getRefId(): number;
  doCraneAnim(on: boolean, repairObject: PlayerCraneAnimObject | null): void;
};

/**
 * Port of upstream `ZPlayer` object list fields used by crane-animation events.
 * Role: Holds objects looked up by primary and repair reference ids.
 * Upstream: zplayer_events.cpp:1058-1064
 */
export type PlayerCraneAnimState<
  TObject extends PlayerCraneAnimObject = PlayerCraneAnimObject,
> = {
  objectList: TObject[];
};

/**
 * Port of upstream `ZPlayer::ProcessBuildingCannonList` call target.
 * Role: Describes player processing for building-cannon-list events.
 * Upstream: zplayer_events.cpp:986
 */
export type PlayerBuildingCannonListProcessor = {
  processBuildingCannonList(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZPlayer::ProcessBuildingState` call target.
 * Role: Describes player processing for building-state events.
 * Upstream: zplayer_events.cpp:979
 */
export type PlayerBuildingStateProcessor = {
  processBuildingState(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZPlayer::ProcessBuildingQueueList` call target.
 * Role: Describes player processing for build-queue-list events.
 * Upstream: zplayer_events.cpp:1446
 */
export type PlayerBuildingQueueListProcessor = {
  processBuildingQueueList(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZPlayer::AddNewsEntry` call target.
 * Role: Accepts player news messages for disconnect handling.
 * Upstream: zplayer.cpp:595
 */
export type PlayerNewsEntrySink = {
  addNewsEntry(message: string): void;
};

/**
 * Port of upstream `ZPlayer::connect_event` call targets.
 * Role: Provides connection processing followed by login sending.
 * Upstream: zplayer_events.cpp:617-619
 */
export type PlayerConnectEventProcessor = {
  processConnect(): void;
  sendLogin(): void;
};

/**
 * Port of upstream `ZPlayer::disconnect_event` call target.
 * Role: Provides disconnect processing for player disconnect events.
 * Upstream: zplayer_events.cpp:624
 */
export type PlayerDisconnectEventProcessor = {
  processDisconnect(): void;
};

/**
 * Port of upstream `ZPlayer::end_game_event` call target.
 * Role: Provides end-game processing for player event dispatch.
 * Upstream: zplayer_events.cpp:858
 */
export type PlayerEndGameEventProcessor = {
  processEndGame(): void;
};

/**
 * Port of upstream `ZPlayer::reset_game_event` call target.
 * Role: Provides reset-game processing for player event dispatch.
 * Upstream: zplayer_events.cpp:863
 */
export type PlayerResetGameEventProcessor = {
  processResetGame(): void;
};

/**
 * Port of upstream `ZPlayer::display_login_event` mutable menu fields.
 * Role: Carries the active, login, and create-user menus controlled by loginoff events.
 * Upstream: zplayer_events.cpp:1244-1257
 */
export type PlayerDisplayLoginEventState<TMenu = unknown> = {
  activeMenu: TMenu | null;
  loginMenu: TMenu | null;
  createUserMenu: TMenu | null;
};

/**
 * Port of upstream wheel-up GUI call target.
 * Role: Receives wheel-up input from the player input event.
 * Upstream: zplayer_events.cpp:443-446
 */
export type PlayerWheelUpTarget = {
  wheelUpButton(): boolean;
};

/**
 * Port of upstream `ZPlayer::wheelup_event` call targets.
 * Role: Carries player menu/window surfaces that receive wheel-up input.
 * Upstream: zplayer_events.cpp:443-446
 */
export type PlayerWheelUpEventProcessor = {
  mainMenuWheelUp(): boolean;
  activeMenu: PlayerWheelUpTarget | null;
  guiWindow: PlayerWheelUpTarget | null;
  guiFactoryList: PlayerWheelUpTarget | null;
};

/**
 * Port of upstream wheel-down GUI call target.
 * Role: Receives wheel-down input from the player input event.
 * Upstream: zplayer_events.cpp:451-454
 */
export type PlayerWheelDownTarget = {
  wheelDownButton(): boolean;
};

/**
 * Port of upstream `ZPlayer::wheeldown_event` call targets.
 * Role: Carries player menu/window surfaces that receive wheel-down input.
 * Upstream: zplayer_events.cpp:451-454
 */
export type PlayerWheelDownEventProcessor = {
  mainMenuWheelDown(): boolean;
  activeMenu: PlayerWheelDownTarget | null;
  guiWindow: PlayerWheelDownTarget | null;
  guiFactoryList: PlayerWheelDownTarget | null;
};

/**
 * Port of upstream `ZPlayer::ProcessAddLPlayer` call target.
 * Role: Describes player processing for add-player events.
 * Upstream: zplayer_events.cpp:1164
 */
export type PlayerAddPlayerProcessor = {
  processAddLocalPlayer(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessDeleteLPlayer` call target.
 * Role: Describes player processing for delete-player events.
 * Upstream: zplayer_events.cpp:1169
 */
export type PlayerDeletePlayerProcessor = {
  processDeleteLocalPlayer(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `lasting_time`.
 * Role: Defines the news message display duration for player events.
 * Upstream: zplayer_events.cpp:683
 */
export const PLAYER_NEWS_ENTRY_DURATION_SECONDS = 10.0;
export const PLAYER_DISCONNECTED_NEWS_MESSAGE =
  "Disconnected from the game server, please restart the client.";

/**
 * Port of upstream `sizeof(driver_hit_packet)`.
 * Role: Defines the expected byte size of driver-hit effect payloads.
 * Upstream: event_handler.h:127-130
 */
export const DRIVER_HIT_PACKET_SIZE_BYTES = 4;

/**
 * Port of upstream `sizeof(crane_anim_packet)`.
 * Role: Defines the fixed packet size accepted by player crane-animation events.
 * Upstream: zplayer_events.cpp:1056
 */
export const CRANE_ANIM_PACKET_SIZE_BYTES = 9;

/**
 * Port of upstream `ZPlayer::ProcessDisconnect`.
 * Role: Reports a fixed disconnect news message to the player UI.
 * Upstream: zplayer.cpp:593-596
 */
export function processPlayerDisconnect(player: PlayerNewsEntrySink): void {
  player.addNewsEntry(PLAYER_DISCONNECTED_NEWS_MESSAGE);
}

/**
 * Port of upstream `ZPlayer::connect_event`.
 * Role: Processes a connection event and then sends the login packet.
 * Upstream: zplayer_events.cpp:615-620
 */
export function playerConnectEvent(
  player: PlayerConnectEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.processConnect();
  player.sendLogin();
}

/**
 * Port of upstream `ZPlayer::disconnect_event`.
 * Role: Processes a player disconnect event.
 * Upstream: zplayer_events.cpp:622-625
 */
export function playerDisconnectEvent(
  player: PlayerDisconnectEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.processDisconnect();
}

/**
 * Port of upstream `ZPlayer::end_game_event`.
 * Role: Processes a player end-game event.
 * Upstream: zplayer_events.cpp:856-859
 */
export function playerEndGameEvent(
  player: PlayerEndGameEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.processEndGame();
}

/**
 * Port of upstream `ZPlayer::reset_game_event`.
 * Role: Processes a player reset-game event.
 * Upstream: zplayer_events.cpp:861-864
 */
export function playerResetGameEvent(
  player: PlayerResetGameEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.processResetGame();
}

function readSingleByte(data: Uint8Array | string | null): number | null {
  if (data === null) return null;
  if (typeof data === "string") return data.length ? data.charCodeAt(0) & 0xff : null;
  return data.length ? data[0] : null;
}

/**
 * Port of upstream `ZPlayer::display_login_event`.
 * Role: Shows or hides the login/create-user menu pair from a packed loginoff payload.
 * Upstream: zplayer_events.cpp:1237-1259
 */
export function playerDisplayLoginEvent<TMenu>(
  player: PlayerDisplayLoginEventState<TMenu>,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  if (size !== 1) return;

  const showLoginByte = readSingleByte(data);
  if (showLoginByte === null) return;

  if (showLoginByte !== 0) {
    if (player.activeMenu === player.loginMenu) return;
    if (player.activeMenu === player.createUserMenu) return;

    player.activeMenu = player.loginMenu;
    return;
  }

  if (player.activeMenu === player.loginMenu) player.activeMenu = null;
  if (player.activeMenu === player.createUserMenu) player.activeMenu = null;
}

/**
 * Port of upstream `ZPlayer::wheelup_event`.
 * Role: Routes wheel-up input through player main menus and optional GUI surfaces.
 * Upstream: zplayer_events.cpp:441-447
 */
export function playerWheelUpEvent(
  player: PlayerWheelUpEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.mainMenuWheelUp();
  player.activeMenu?.wheelUpButton();
  player.guiWindow?.wheelUpButton();
  player.guiFactoryList?.wheelUpButton();
}

/**
 * Port of upstream `ZPlayer::wheeldown_event`.
 * Role: Routes wheel-down input through player main menus and optional GUI surfaces.
 * Upstream: zplayer_events.cpp:449-455
 */
export function playerWheelDownEvent(
  player: PlayerWheelDownEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.mainMenuWheelDown();
  player.activeMenu?.wheelDownButton();
  player.guiWindow?.wheelDownButton();
  player.guiFactoryList?.wheelDownButton();
}

/**
 * Port of upstream `ZPlayer::add_player_event`.
 * Role: Delegates an add-player payload to the player processor.
 * Upstream: zplayer_events.cpp:1162-1165
 */
export function playerAddPlayerEvent(
  player: PlayerAddPlayerProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processAddLocalPlayer(data, size);
}

/**
 * Port of upstream `ZPlayer::delete_player_event`.
 * Role: Delegates a delete-player payload to the player processor.
 * Upstream: zplayer_events.cpp:1167-1170
 */
export function playerDeletePlayerEvent(
  player: PlayerDeletePlayerProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processDeleteLocalPlayer(data, size);
}

/**
 * Port of upstream `ZPlayer::set_player_id_event`.
 * Role: Delegates a player-id update payload to the player processor.
 * Upstream: zplayer_events.cpp:1227-1230
 */
export function playerSetPlayerIdEvent(
  player: PlayerIdProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processPlayerId(data, size);
}

/**
 * Port of upstream `ZPlayer::set_selectable_map_list_event`.
 * Role: Delegates a selectable-map-list payload to the player processor.
 * Upstream: zplayer_events.cpp:1232-1235
 */
export function playerSetSelectableMapListEvent(
  player: PlayerSelectableMapListProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSelectableMapList(data, size);
}

/**
 * Port of upstream `ZPlayer::request_version_event`.
 * Role: Sends this player's fixed-size game-version packet when the version string fits.
 * Upstream: zplayer_events.cpp:1449-1463
 */
export function playerRequestVersionEvent(
  player: PlayerRequestVersionEventState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
  gameVersion = GAME_VERSION,
): void {
  void data;
  void size;
  void dummy;

  if (gameVersion.length + 1 >= MAX_VERSION_PACKET_CHARS) return;

  const packet = new Uint8Array(MAX_VERSION_PACKET_CHARS);
  for (let i = 0; i < gameVersion.length; i += 1) {
    packet[i] = gameVersion.charCodeAt(i) & 0xff;
  }

  player.clientSocket.sendMessage(TcpEvent.GiveVersion, packet, packet.length);
}

/**
 * Port of upstream `ZPlayer::set_player_name_event`.
 * Role: Delegates a player-name update payload to the player processor.
 * Upstream: zplayer_events.cpp:1172-1175
 */
export function playerSetPlayerNameEvent(
  player: PlayerNameProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSetLocalPlayerName(data, size);
}

/**
 * Port of upstream `ZPlayer::set_player_team_event`.
 * Role: Delegates a player-team update payload to the player processor.
 * Upstream: zplayer_events.cpp:1177-1180
 */
export function playerSetPlayerTeamEvent(
  player: PlayerTeamProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSetLocalPlayerTeam(data, size);
}

/**
 * Port of upstream `ZPlayer::set_player_mode_event`.
 * Role: Delegates a player-mode update payload to the player processor.
 * Upstream: zplayer_events.cpp:1182-1185
 */
export function playerSetPlayerModeEvent(
  player: PlayerModeProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSetLocalPlayerMode(data, size);
}

/**
 * Port of upstream `ZPlayer::set_player_ignored_event`.
 * Role: Delegates a player-ignore update payload to the player processor.
 * Upstream: zplayer_events.cpp:1187-1190
 */
export function playerSetPlayerIgnoredEvent(
  player: PlayerIgnoredProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSetLocalPlayerIgnored(data, size);
}

/**
 * Port of upstream `ZPlayer::set_player_loginfo_event`.
 * Role: Delegates a player log-info update payload to the player processor.
 * Upstream: zplayer_events.cpp:1192-1195
 */
export function playerSetPlayerLogInfoEvent(
  player: PlayerLogInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSetLocalPlayerLogInfo(data, size);
}

function refreshPlayerVoteImages(
  player: Omit<PlayerVoteInfoEventState, keyof PlayerVoteInfoProcessor>,
): void {
  if (!player.vote.voteInProgress()) return;

  player.vote.setupImages(
    player.getOurRealVotingPower(),
    player.getVotesNeeded(),
    player.getVotesFor(),
    player.getVotesAgainst(),
    player.getVoteAppendDescription(),
  );
}

/**
 * Port of upstream `ZPlayer::set_player_voteinfo_event`.
 * Role: Applies local player vote-info data and refreshes vote images during active votes.
 * Upstream: zplayer_events.cpp:1197-1205
 */
export function playerSetPlayerVoteInfoEvent(
  player: PlayerVoteInfoEventState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSetLocalPlayerVoteInfo(data, size);
  refreshPlayerVoteImages(player);
}

/**
 * Port of upstream `ZPlayer::set_vote_info_event`.
 * Role: Applies global vote-info data and refreshes vote images during active votes.
 * Upstream: zplayer_events.cpp:1217-1225
 */
export function playerSetVoteInfoEvent(
  player: PlayerGlobalVoteInfoEventState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processVoteInfo(data, size);
  refreshPlayerVoteImages(player);
}

/**
 * Port of upstream `ZPlayer::update_game_paused_event`.
 * Role: Delegates a pause-state update payload to the player processor.
 * Upstream: zplayer_events.cpp:1207-1210
 */
export function playerUpdateGamePausedEvent(
  player: PlayerGamePausedProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processUpdateGamePaused(data, size);
}

/**
 * Port of upstream `ZPlayer::update_game_speed_event`.
 * Role: Delegates a game-speed update payload to the player processor.
 * Upstream: zplayer_events.cpp:1212-1215
 */
export function playerUpdateGameSpeedEvent(
  player: PlayerGameSpeedProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processUpdateGameSpeed(data, size);
}

/**
 * Port of upstream `ZPlayer::set_settings_event`.
 * Role: Delegates a settings payload to the player processor.
 * Upstream: zplayer_events.cpp:1095-1103
 */
export function playerSetSettingsEvent(
  player: PlayerSettingsProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processZSettings(data, size);
}

/**
 * Port of upstream `ZPlayer::set_lid_open_event`.
 * Role: Delegates an object lid-state payload to the player processor.
 * Upstream: zplayer_events.cpp:1105-1121
 */
export function playerSetLidOpenEvent(
  player: PlayerObjectLidStateProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void player.processObjectLidState(data, size);
}

/**
 * Port of upstream `ZPlayer::set_zone_info_event`.
 * Role: Delegates a zone-info payload to the player processor.
 * Upstream: zplayer_events.cpp:676-679
 */
export function playerSetZoneInfoEvent(
  player: PlayerZoneInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processZoneInfo(data, size);
}

/**
 * Port of upstream `ZPlayer::set_team_event`.
 * Role: Delegates a team update payload to the player processor.
 * Upstream: zplayer_events.cpp:1365-1368
 */
export function playerSetTeamEvent(
  player: PlayerTeamAssignmentProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processSetTeam(data, size);
}

/**
 * Port of upstream `ZPlayer::set_object_loc_event`.
 * Role: Delegates an object-location payload to the player processor.
 * Upstream: zplayer_events.cpp:762-780
 */
export function playerSetObjectLocationEvent(
  player: PlayerObjectLocationProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void player.processObjectLoc(data, size);
}

/**
 * Port of upstream `ZPlayer::set_object_group_info_event`.
 * Role: Delegates an object group-info payload to the player processor.
 * Upstream: zplayer_events.cpp:1029-1047
 */
export function playerSetObjectGroupInfoEvent(
  player: PlayerObjectGroupInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void player.processObjectGroupInfo(data, size);
}

/**
 * Port of upstream `ZPlayer::set_grenade_amount_event`.
 * Role: Applies grenade-state payloads, rerenders selected HUD objects, and refreshes cursor state when selection details changed.
 * Upstream: zplayer_events.cpp:1261-1274
 */
export function playerSetGrenadeAmountEvent<TObject>(
  player: PlayerGrenadeAmountEventState<TObject>,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  const object = player.processSetGrenadeState(data, size);
  if (!object) return;

  if (player.hud.getSelectedObject() === object) {
    player.hud.reRenderAll();
  }

  if (player.selection.updateGroupMember(object)) {
    player.determineCursor();
  }
}

/**
 * Port of upstream `ZPlayer::set_building_cannon_list_event`.
 * Role: Delegates a building cannon-list payload to the player processor.
 * Upstream: zplayer_events.cpp:982-987
 */
export function playerSetBuildingCannonListEvent(
  player: PlayerBuildingCannonListProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void player.processBuildingCannonList(data, size);
}

/**
 * Port of upstream `ZPlayer::set_building_state_event`.
 * Role: Delegates a building-state payload to the player processor.
 * Upstream: zplayer_events.cpp:975-980
 */
export function playerSetBuildingStateEvent(
  player: PlayerBuildingStateProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void player.processBuildingState(data, size);
}

/**
 * Port of upstream `ZPlayer::set_build_queue_list_event`.
 * Role: Delegates a building queue-list payload to the player processor.
 * Upstream: zplayer_events.cpp:1442-1447
 */
export function playerSetBuildQueueListEvent(
  player: PlayerBuildingQueueListProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void player.processBuildingQueueList(data, size);
}

/**
 * Port of upstream `ZPlayer::fire_object_missile_event`.
 * Role: Delegates a missile-fire payload to the player processor.
 * Upstream: zplayer_events.cpp:866-869
 */
export function playerFireObjectMissileEvent(
  player: PlayerFireMissileProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  player.processFireMissile(data, size);
}

/**
 * Port of upstream `ZPlayer::set_object_waypoints_event`.
 * Role: Applies waypoint payload data and briefly displays updated waypoints when an object is returned.
 * Upstream: zplayer_events.cpp:739-750
 */
export function playerSetObjectWaypointsEvent<
  TObject extends PlayerWaypointObject,
>(
  player: PlayerWaypointProcessor<TObject>,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  const object = player.processWaypointData(data, size);
  if (!object) return;

  object.showWaypoints();
}

/**
 * Port of upstream `ZPlayer::set_object_rallypoints_event`.
 * Role: Applies rallypoint payload data without additional visual activation.
 * Upstream: zplayer_events.cpp:752-760
 */
export function playerSetObjectRallypointsEvent(
  player: PlayerRallypointProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void player.processRallypointData(data, size);
}

/**
 * Port of upstream `ZPlayer::set_object_health_event`.
 * Role: Applies object health/team payload data and triggers the object's hit effect when present.
 * Upstream: zplayer_events.cpp:845-854
 */
export function playerSetObjectHealthEvent<
  TObject extends PlayerObjectHealthObject,
>(
  player: PlayerObjectHealthTeamProcessor<TObject>,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  const object = player.processObjectHealthTeam(data, size);
  if (!object) return;

  object.doHitEffect();
}

/**
 * Port of upstream `ZPlayer::driver_hit_effect_event`.
 * Role: Applies a driver-hit effect to the referenced object when the payload is valid.
 * Upstream: zplayer_events.cpp:1142-1155
 */
export function playerDriverHitEffectEvent<TObject extends PlayerDriverHitEffectObject>(
  player: PlayerDriverHitEffectState<TObject>,
  packet: DriverHitPacket,
  size: number,
  dummy: number,
): void {
  void dummy;
  if (size !== DRIVER_HIT_PACKET_SIZE_BYTES) return;

  const object =
    player.objectList.find((candidate) => candidate.getRefId() === packet.refId) ??
    null;

  if (!object) return;

  object.doDriverHitEffect();
}

/**
 * Port of upstream `ZPlayer::do_crane_anim_event`.
 * Role: Applies crane animation state to the referenced object with an optional repair target.
 * Upstream: zplayer_events.cpp:1049-1065
 */
export function playerDoCraneAnimEvent<TObject extends PlayerCraneAnimObject>(
  player: PlayerCraneAnimState<TObject>,
  packet: CraneAnimPacket,
  size: number,
  dummy: number,
): void {
  void dummy;
  if (size !== CRANE_ANIM_PACKET_SIZE_BYTES) return;

  const object =
    player.objectList.find((candidate) => candidate.getRefId() === packet.refId) ??
    null;

  if (!object) return;

  const repairObject =
    player.objectList.find(
      (candidate) => candidate.getRefId() === packet.repairRefId,
    ) ?? null;

  object.doCraneAnim(packet.on, repairObject);
}
