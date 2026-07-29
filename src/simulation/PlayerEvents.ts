/**
 * Upstream: zplayer_events.cpp
 */
import type { DriverHitPacket } from "./EventHandler";

/**
 * Port of upstream `ZPlayer::ProcessPlayerID` call target.
 * Role: Provides the minimal player API needed by the player-id event wrapper.
 * Upstream: zplayer_events.cpp:1229
 */
export type PlayerIdProcessor = {
  processPlayerId(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSelectableMapList` call target.
 * Role: Provides the minimal player API needed by the selectable-map-list event wrapper.
 * Upstream: zplayer_events.cpp:1234
 */
export type PlayerSelectableMapListProcessor = {
  processSelectableMapList(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerName` call target.
 * Role: Provides the minimal player API needed by the player-name event wrapper.
 * Upstream: zplayer_events.cpp:1174
 */
export type PlayerNameProcessor = {
  processSetLocalPlayerName(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerTeam` call target.
 * Role: Provides the minimal player API needed by the player-team event wrapper.
 * Upstream: zplayer_events.cpp:1179
 */
export type PlayerTeamProcessor = {
  processSetLocalPlayerTeam(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerMode` call target.
 * Role: Provides the minimal player API needed by the player-mode event wrapper.
 * Upstream: zplayer_events.cpp:1184
 */
export type PlayerModeProcessor = {
  processSetLocalPlayerMode(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetLPlayerIgnored` call target.
 * Role: Provides the minimal player API needed by the player-ignored event wrapper.
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
 * Role: Provides the minimal player API needed by the player-log-info event wrapper.
 * Upstream: zplayer_events.cpp:1194
 */
export type PlayerLogInfoProcessor = {
  processSetLocalPlayerLogInfo(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZPlayer::ProcessUpdateGamePaused` call target.
 * Role: Provides the minimal player API needed by the pause-state event wrapper.
 * Upstream: zplayer_events.cpp:1209
 */
export type PlayerGamePausedProcessor = {
  processUpdateGamePaused(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessUpdateGameSpeed` call target.
 * Role: Provides the minimal player API needed by the game-speed event wrapper.
 * Upstream: zplayer_events.cpp:1214
 */
export type PlayerGameSpeedProcessor = {
  processUpdateGameSpeed(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessZSettings` call target.
 * Role: Provides the minimal player API needed by the settings event wrapper.
 * Upstream: zplayer_events.cpp:1097
 */
export type PlayerSettingsProcessor = {
  processZSettings(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessZoneInfo` call target.
 * Role: Provides the minimal player API needed by the zone-info event wrapper.
 * Upstream: zplayer_events.cpp:678
 */
export type PlayerZoneInfoProcessor = {
  processZoneInfo(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessSetTeam` call target.
 * Role: Provides the minimal player API needed by the team event wrapper.
 * Upstream: zplayer_events.cpp:1367
 */
export type PlayerTeamAssignmentProcessor = {
  processSetTeam(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessFireMissile` call target.
 * Role: Provides the minimal player API needed by the missile-fire event wrapper.
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
 * Role: Provides the minimal player API needed by the object-waypoints event wrapper.
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
 * Role: Provides the minimal player API needed by the object-rallypoints event wrapper.
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
 * Role: Provides the minimal player API needed by the object-health event wrapper.
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
 * Port of upstream `ZPlayer::ProcessBuildingCannonList` call target.
 * Role: Provides the minimal player API needed by the building-cannon-list event wrapper.
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
 * Role: Provides the minimal player API needed by the building-state event wrapper.
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
 * Role: Provides the minimal player API needed by the build-queue-list event wrapper.
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
 * Role: Provides the minimal player API needed by disconnect handling.
 * Upstream: zplayer.cpp:595
 */
export type PlayerNewsEntrySink = {
  addNewsEntry(message: string): void;
};

/**
 * Port of upstream `ZPlayer::ProcessAddLPlayer` call target.
 * Role: Provides the minimal player API needed by the add-player event wrapper.
 * Upstream: zplayer_events.cpp:1164
 */
export type PlayerAddPlayerProcessor = {
  processAddLocalPlayer(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZPlayer::ProcessDeleteLPlayer` call target.
 * Role: Provides the minimal player API needed by the delete-player event wrapper.
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
 * Port of upstream `ZPlayer::ProcessDisconnect`.
 * Role: Reports a fixed disconnect news message to the player UI.
 * Upstream: zplayer.cpp:593-596
 */
export function processPlayerDisconnect(player: PlayerNewsEntrySink): void {
  player.addNewsEntry(PLAYER_DISCONNECTED_NEWS_MESSAGE);
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
