import type { VoteType } from "./VotePresentation";

/**
 * Upstream: event_handler.h / event_handler.cpp
 */

/**
 * Port of upstream `_EVENTHANDLER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: event_handler.h:2
 */
export const EVENT_HANDLER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_VERSION_PACKET_CHARS`.
 * Role: Defines the fixed character capacity of upstream `version_packet.version`.
 * Upstream: event_handler.h:231
 */
export const MAX_VERSION_PACKET_CHARS = 50;

/**
 * Port of upstream `version_packet`.
 * Role: Carries the fixed version string buffer exchanged by version events.
 * Upstream: event_handler.h:232-235
 */
export type VersionPacket = {
  version: Uint8Array;
};

/**
 * Port of upstream `player_mode_packet`.
 * Role: Carries a player's mode value in an event payload.
 * Upstream: event_handler.h:132-135
 */
export type PlayerModePacket = {
  mode: number;
};

/**
 * Port of upstream `start_building_packet`.
 * Role: Carries the object reference and build target ids for a start-building event.
 * Upstream: event_handler.h:68-72
 */
export type StartBuildingPacket = {
  refId: number;
  objectType: number;
  objectId: number;
};

/**
 * Port of upstream `eject_vehicle_packet`.
 * Role: Carries the object reference for a vehicle ejection event.
 * Upstream: event_handler.h:96-99
 */
export type EjectVehiclePacket = {
  refId: number;
};

/**
 * Port of upstream `do_portrait_anim_packet`.
 * Role: Carries the object reference and portrait animation id for an event.
 * Upstream: event_handler.h:201-205
 */
export type DoPortraitAnimPacket = {
  refId: number;
  animId: number;
};

/**
 * Port of upstream `object_health_packet`.
 * Role: Carries the object reference and updated health value for an event.
 * Upstream: event_handler.h:46-50
 */
export type ObjectHealthPacket = {
  refId: number;
  health: number;
};

/**
 * Port of upstream `add_remove_player_packet`.
 * Role: Carries the player id for local player add/remove events.
 * Upstream: event_handler.h:137-140
 */
export type AddRemovePlayerPacket = {
  playerId: number;
};

/**
 * Port of upstream `set_building_state_packet`.
 * Role: Carries the object reference, building state, timing, and produced object ids.
 * Upstream: event_handler.h:74-81
 */
export type SetBuildingStatePacket = {
  refId: number;
  state: number;
  initOffset: number;
  productionTime: number;
  objectType: number;
  objectId: number;
};

/**
 * Port of upstream `set_player_loginfo_packet`.
 * Role: Carries account and login state details for a local player.
 * Upstream: event_handler.h:148-157
 */
export type SetPlayerLoginfoPacket = {
  playerId: number;
  databaseId: number;
  votingPower: number;
  totalGames: number;
  activated: boolean;
  loggedIn: boolean;
  botLoggedIn: boolean;
};

/**
 * Port of upstream `update_game_paused_packet`.
 * Role: Carries the game pause state for pause synchronization events.
 * Upstream: event_handler.h:159-162
 */
export type UpdateGamePausedPacket = {
  gamePaused: boolean;
};

/**
 * Port of upstream `vote_info_packet`.
 * Role: Carries the active vote state, vote type, and vote value.
 * Upstream: event_handler.h:164-169
 */
export type VoteInfoPacket = {
  inProgress: boolean;
  voteType: VoteType;
  value: number;
};

/**
 * Port of upstream `snipe_object_packet`.
 * Role: Carries the object reference targeted by a sniper event.
 * Upstream: event_handler.h:122-125
 */
export type SnipeObjectPacket = {
  refId: number;
};

/**
 * Port of upstream `destroy_object_packet`.
 * Role: Carries object destruction options and killer reference data.
 * Upstream: event_handler.h:58-66
 */
export type DestroyObjectPacket = {
  refId: number;
  fireMissileAmount: number;
  killerRefId: number;
  destroyObject: boolean;
  doFireDeath: boolean;
  doMissileDeath: boolean;
};

/**
 * Port of upstream `set_player_int_packet`.
 * Role: Carries a player id and integer value for player update events.
 * Upstream: event_handler.h:142-146
 */
export type SetPlayerIntPacket = {
  playerId: number;
  value: number;
};

/**
 * Port of upstream `fire_missile_packet`.
 * Role: Carries the firing object reference and missile target coordinates.
 * Upstream: event_handler.h:52-56
 */
export type FireMissilePacket = {
  refId: number;
  x: number;
  y: number;
};

/**
 * Port of upstream `cancel_building_queue_packet`.
 * Role: Carries queue position and object ids for cancelling a building queue item.
 * Upstream: event_handler.h:224-229
 */
export type CancelBuildingQueuePacket = {
  refId: number;
  listIndex: number;
  objectType: number;
  objectId: number;
};

/**
 * Port of upstream `object_team_packet`.
 * Role: Carries object owner and driver assignment values.
 * Upstream: event_handler.h:32-38
 */
export type ObjectTeamPacket = {
  refId: number;
  owner: number;
  driverType: number;
  driverAmount: number;
};

/**
 * Port of upstream `repair_building_anim_packet`.
 * Role: Carries repair animation state, remaining time, and sound flag.
 * Upstream: event_handler.h:108-114
 */
export type RepairBuildingAnimPacket = {
  refId: number;
  on: boolean;
  remainingTime: number;
  playSound: boolean;
};

/**
 * Port of upstream `obj_grenade_amount_packet`.
 * Role: Carries the object reference and grenade count for synchronization.
 * Upstream: event_handler.h:181-185
 */
export type ObjectGrenadeAmountPacket = {
  refId: number;
  grenadeAmount: number;
};

/**
 * Port of upstream `place_cannon_packet`.
 * Role: Carries the building reference, tile coordinates, and cannon object id.
 * Upstream: event_handler.h:83-88
 */
export type PlaceCannonPacket = {
  refId: number;
  tileX: number;
  tileY: number;
  objectId: number;
};

/**
 * Port of upstream `buy_registration_packet`.
 * Role: Carries the fixed registration purchase buffer.
 * Upstream: event_handler.h:213-216
 */
export type BuyRegistrationPacket = {
  buffer: Uint8Array;
};

/**
 * Port of upstream `crane_anim_packet`.
 * Role: Carries crane animation state and repair target references.
 * Upstream: event_handler.h:101-106
 */
export type CraneAnimPacket = {
  refId: number;
  repairRefId: number;
  on: boolean;
};

/**
 * Port of upstream `loginoff_packet`.
 * Role: Carries whether the login UI should be shown.
 * Upstream: event_handler.h:176-179
 */
export type LoginoffPacket = {
  showLogin: boolean;
};

/**
 * Port of upstream `set_lid_state_packet`.
 * Role: Carries vehicle lid open state for an object reference.
 * Upstream: event_handler.h:116-120
 */
export type SetLidStatePacket = {
  refId: number;
  lidOpen: boolean;
};

/**
 * Port of upstream `team_ended_packet`.
 * Role: Carries the ended team and whether it won.
 * Upstream: event_handler.h:207-211
 */
export type TeamEndedPacket = {
  team: number;
  won: boolean;
};

/**
 * Port of upstream `player_id_packet`.
 * Role: Carries a player id in player identity events.
 * Upstream: event_handler.h:171-174
 */
export type PlayerIdPacket = {
  playerId: number;
};

/**
 * Port of upstream `zone_info_packet`.
 * Role: Carries zone ownership information.
 * Upstream: event_handler.h:26-30
 */
export type ZoneInfoPacket = {
  zoneNumber: number;
  owner: number;
};

/**
 * Port of upstream `attack_object_packet`.
 * Role: Carries the attacker object reference and target object reference.
 * Upstream: event_handler.h:40-44
 */
export type AttackObjectPacket = {
  refId: number;
  attackObjectRefId: number;
};

/**
 * Port of upstream `computer_msg_packet`.
 * Role: Carries the object reference and computer message sound id.
 * Upstream: event_handler.h:90-94
 */
export type ComputerMsgPacket = {
  refId: number;
  sound: number;
};

/**
 * Port of upstream `add_building_queue_packet`.
 * Role: Carries the building reference and object ids for adding a queue item.
 * Upstream: event_handler.h:218-222
 */
export type AddBuildingQueuePacket = {
  refId: number;
  objectType: number;
  objectId: number;
};

/**
 * Port of upstream `object_init_packet`.
 * Role: Carries initial object position, identity, owner, links, and health.
 * Upstream: event_handler.h:14-24
 */
export type ObjectInitPacket = {
  x: number;
  y: number;
  refId: number;
  owner: number;
  objectType: number;
  objectId: number;
  buildingLevel: number;
  extraLinks: number;
  health: number;
};

/**
 * Port of upstream `driver_hit_packet`.
 * Role: Carries the object reference for a driver-hit effect event.
 * Upstream: event_handler.h:127-130
 */
export type DriverHitPacket = {
  refId: number;
};

/**
 * Port of upstream `pre_event_type`.
 * Role: Identifies the top-level event source category.
 * Upstream: event_handler.h:240-243
 */
export enum PreEventType {
  Tcp = 0,
  Sdl = 1,
  Other = 2,
}

/**
 * Port of upstream `tcp_event`.
 * Role: Identifies network event numbers exchanged through the TCP event path.
 * Upstream: event_handler.h:245-266
 */
export enum TcpEvent {
  DebugEvent = 0,
  RequestMap = 1,
  GivePlayerName = 2,
  StoreMap = 3,
  RequestObjects = 4,
  RequestZones = 5,
  AddNewObject = 6,
  SetZoneInfo = 7,
  SetName = 8,
  SetTeam = 9,
  NewsEvent = 10,
  SendWaypoints = 11,
  SendRallypoints = 12,
  SendLoc = 13,
  SetObjectTeam = 14,
  SetAttackObject = 15,
  DeleteObject = 16,
  UpdateHealth = 17,
  EndGame = 18,
  ResetGame = 19,
  FireMissile = 20,
  DestroyObject = 21,
  StartBuilding = 22,
  StopBuilding = 23,
  SetBuildingState = 24,
  SetBuiltCannonAmount = 25,
  PlaceCannon = 26,
  SendChat = 27,
  CompMsg = 28,
  ObjectGroupInfo = 29,
  EjectVehicle = 30,
  DoCraneAnim = 31,
  SetRepairAnim = 32,
  RequestSettings = 33,
  SetSettings = 34,
  SetLidOpen = 35,
  SnipeObject = 36,
  DriverHitEffect = 37,
  SetPlayerMode = 38,
  RequestPlayerList = 39,
  ClearPlayerList = 40,
  AddLocalPlayer = 41,
  DeleteLocalPlayer = 42,
  SetLocalPlayerName = 43,
  SetLocalPlayerTeam = 44,
  SetLocalPlayerMode = 45,
  SetLocalPlayerIgnored = 46,
  SetLocalPlayerLoginfo = 47,
  SetLocalPlayerVoteinfo = 48,
  SendBotBypassData = 49,
  UpdateGamePaused = 50,
  GetGamePaused = 51,
  SetGamePaused = 52,
  StartVote = 53,
  VoteYes = 54,
  VoteNo = 55,
  VotePass = 56,
  VoteInfo = 57,
  GivePlayerId = 58,
  RequestPlayerId = 59,
  RequestSelectableMapList = 60,
  GiveSelectableMapList = 61,
  SendLogin = 62,
  RequestLoginoff = 63,
  GiveLoginoff = 64,
  CreateUser = 65,
  SetGrenadeAmount = 66,
  PickupGrenadeAnim = 67,
  DoPortraitAnim = 68,
  TeamEnded = 69,
  PollBuyRegkey = 70,
  BuyRegkey = 71,
  ReturnRegkey = 72,
  GetGameSpeed = 73,
  SetGameSpeed = 74,
  UpdateGameSpeed = 75,
  AddBuildingQueue = 76,
  SetBuildingQueueList = 77,
  CancelBuildingQueue = 78,
  ReshuffleTeams = 79,
  StartBotEvent = 80,
  StopBotEvent = 81,
  SelectMap = 82,
  ResetMap = 83,
  RequestVersion = 84,
  GiveVersion = 85,
  MaxTcpEvents = 86,
}

/**
 * Replacement for upstream `sdl_event`.
 * Role: Identifies user input and viewport events handled by the browser runtime.
 * Upstream: event_handler.h:268-283
 */
export enum UserInputEvent {
  Resize = 0,
  LeftClick = 1,
  LeftRelease = 2,
  RightClick = 3,
  RightRelease = 4,
  MiddleClick = 5,
  MiddleRelease = 6,
  WheelUp = 7,
  WheelDown = 8,
  KeyDown = 9,
  KeyUp = 10,
  Motion = 11,
  MaxUserInputEvents = 12,
}

/**
 * Port of upstream `other_event`.
 * Role: Identifies connection lifecycle events handled outside TCP and SDL.
 * Upstream: event_handler.h:285-288
 */
export enum OtherEvent {
  Connect = 0,
  Disconnect = 1,
}

/**
 * Port of upstream `Event`.
 * Role: Carries an event category, event number, player id, and payload bytes.
 * Upstream: event_handler.h:290-302, event_handler.cpp:3-24
 */
export class SimulationEvent {
  player: number;
  eventType: number;
  eventNumber: number;
  data: Uint8Array | null;
  size: number;

  constructor(
    eventType: number,
    eventNumber: number,
    player: number,
    data: Uint8Array | null,
    size: number,
    copyData = true,
  ) {
    this.player = player;
    this.eventType = eventType;
    this.eventNumber = eventNumber;
    this.size = size;
    this.data = copyData ? copyEventPayload(data, size) : data;
  }
}

export type EventHandlerFunction<TParent> = (
  parent: TParent | null,
  data: Uint8Array | null,
  size: number,
  player: number,
) => void;

/**
 * Port of upstream `EventHandler`.
 * Role: Stores event callbacks and dispatches queued simulation events.
 * Upstream: event_handler.h:309-323
 */
export class EventHandler<TParent> {
  private readonly functions: Array<Array<EventHandlerFunction<TParent> | null>>;
  private readonly eventList: SimulationEvent[] = [];
  private parent: TParent | null = null;
  private readonly log: (message: string) => void;

  constructor(log: (message: string) => void = () => undefined) {
    this.log = log;
    this.functions = Array.from({ length: MAX_EVENT_TYPES }, () =>
      Array.from({ length: MAX_FUNCTIONS }, () => null),
    );
  }

  setParent(parent: TParent): void {
    this.parent = parent;
  }

  addEvent(event: SimulationEvent): void {
    this.eventList.push(event);
  }

  addFunction(
    eventType: number,
    eventNumber: number,
    callback: EventHandlerFunction<TParent>,
  ): void {
    if (!this.isEventSlotInBounds(eventType, eventNumber)) {
      this.log(
        `EventHandler::attempting to attach function to out of bounds event ${eventType}:${eventNumber}`,
      );
      return;
    }

    if (this.functions[eventType][eventNumber]) {
      this.log(
        `EventHandler::attempting to attach function already attached event ${eventType}:${eventNumber}`,
      );
    }

    this.functions[eventType][eventNumber] = callback;
  }

  processEvent(
    eventType: number,
    eventNumber: number,
    data: Uint8Array | null,
    size: number,
    player: number,
  ): number {
    if (!this.isEventSlotInBounds(eventType, eventNumber)) {
      this.log(
        `EventHandler::attempting to process invalid event ${eventType}:${eventNumber}`,
      );
      return 0;
    }

    const callback = this.functions[eventType][eventNumber];
    if (!callback) {
      this.log(`EventHandler::no function attached to event ${eventType}:${eventNumber}`);
      return 0;
    }

    callback(this.parent, data, size, player);
    return 1;
  }

  processEvents(): void {
    for (const event of this.eventList) {
      this.processEvent(
        event.eventType,
        event.eventNumber,
        event.data,
        event.size,
        event.player,
      );
    }

    this.eventList.length = 0;
  }

  getEventList(): SimulationEvent[] {
    return this.eventList;
  }

  private isEventSlotInBounds(eventType: number, eventNumber: number): boolean {
    return (
      eventType >= 0 &&
      eventType < MAX_EVENT_TYPES &&
      eventNumber >= 0 &&
      eventNumber < MAX_FUNCTIONS
    );
  }
}

function copyEventPayload(data: Uint8Array | null, size: number): Uint8Array {
  if (size <= 0) {
    return new Uint8Array(0);
  }
  if (!data) {
    throw new Error("SimulationEvent requires payload data when size is positive");
  }
  return data.slice(0, size);
}

/**
 * Port of upstream `MAX_EVENT_TYPES`.
 * Role: Defines the dispatch table height for top-level event categories.
 * Upstream: event_handler.h:304
 */
export const MAX_EVENT_TYPES = 5;

/**
 * Port of upstream `MAX_FUNCTIONS`.
 * Role: Defines the dispatch table width allocated for event functions.
 * Upstream: event_handler.h:305
 */
export const MAX_FUNCTIONS = 200;
