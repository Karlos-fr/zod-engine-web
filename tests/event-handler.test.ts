import { describe, expect, it } from "vitest";
import {
  type AddBuildingQueuePacket,
  type AddRemovePlayerPacket,
  type AttackObjectPacket,
  type BuyRegistrationPacket,
  type ComputerMsgPacket,
  type CancelBuildingQueuePacket,
  type CraneAnimPacket,
  type DestroyObjectPacket,
  type DoPortraitAnimPacket,
  type DriverHitPacket,
  type EjectVehiclePacket,
  EVENT_HANDLER_HEADER_GUARD_PORTED,
  EventHandler,
  type FireMissilePacket,
  type LoginoffPacket,
  MAX_EVENT_TYPES,
  MAX_FUNCTIONS,
  MAX_VERSION_PACKET_CHARS,
  type ObjectGrenadeAmountPacket,
  type ObjectInitPacket,
  type ObjectTeamPacket,
  type ObjectHealthPacket,
  type PlayerIdPacket,
  OtherEvent,
  type PlayerModePacket,
  type PlaceCannonPacket,
  PreEventType,
  type RepairBuildingAnimPacket,
  type SetBuildingStatePacket,
  type SetLidStatePacket,
  type SetPlayerIntPacket,
  type SetPlayerLoginfoPacket,
  SimulationEvent,
  type SnipeObjectPacket,
  type StartBuildingPacket,
  TcpEvent,
  type TeamEndedPacket,
  type UpdateGamePausedPacket,
  UserInputEvent,
  type VersionPacket,
  type VoteInfoPacket,
  type ZoneInfoPacket,
} from "../src/simulation/EventHandler";
import { VoteType } from "../src/simulation/VotePresentation";

describe("event handler", () => {
  it("adapts the event_handler.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/EventHandler");
    const secondImport = await import("../src/simulation/EventHandler");

    expect(EVENT_HANDLER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EVENT_HANDLER_HEADER_GUARD_PORTED).toBe(
      firstImport.EVENT_HANDLER_HEADER_GUARD_PORTED,
    );
  });

  it("ports MAX_VERSION_PACKET_CHARS as the version packet capacity", () => {
    expect(MAX_VERSION_PACKET_CHARS).toBe(50);
  });

  it("ports version_packet as a fixed version buffer payload shape", () => {
    const packet = {
      version: new Uint8Array(MAX_VERSION_PACKET_CHARS),
    } satisfies VersionPacket;

    packet.version[0] = 49;

    expect(packet.version).toHaveLength(MAX_VERSION_PACKET_CHARS);
    expect(packet.version[0]).toBe(49);
  });

  it("ports player_mode_packet as a mode payload shape", () => {
    const packet = { mode: 3 } satisfies PlayerModePacket;

    expect(packet.mode).toBe(3);
  });

  it("ports start_building_packet as a build target payload shape", () => {
    const packet = {
      refId: 12,
      objectType: 2,
      objectId: 7,
    } satisfies StartBuildingPacket;

    expect(packet).toEqual({ refId: 12, objectType: 2, objectId: 7 });
  });

  it("ports eject_vehicle_packet as an object reference payload shape", () => {
    const packet = { refId: 42 } satisfies EjectVehiclePacket;

    expect(packet.refId).toBe(42);
  });

  it("ports do_portrait_anim_packet as a portrait animation payload shape", () => {
    const packet = { refId: 5, animId: 9 } satisfies DoPortraitAnimPacket;

    expect(packet).toEqual({ refId: 5, animId: 9 });
  });

  it("ports object_health_packet as a health update payload shape", () => {
    const packet = { refId: 14, health: 87 } satisfies ObjectHealthPacket;

    expect(packet).toEqual({ refId: 14, health: 87 });
  });

  it("ports add_remove_player_packet as a player id payload shape", () => {
    const packet = { playerId: 2 } satisfies AddRemovePlayerPacket;

    expect(packet.playerId).toBe(2);
  });

  it("ports set_building_state_packet as a building state payload shape", () => {
    const packet = {
      refId: 18,
      state: 1,
      initOffset: 0.25,
      productionTime: 4.5,
      objectType: 3,
      objectId: 6,
    } satisfies SetBuildingStatePacket;

    expect(packet).toEqual({
      refId: 18,
      state: 1,
      initOffset: 0.25,
      productionTime: 4.5,
      objectType: 3,
      objectId: 6,
    });
  });

  it("ports set_player_loginfo_packet as a player log info payload shape", () => {
    const packet = {
      playerId: 2,
      databaseId: 91,
      votingPower: 4,
      totalGames: 17,
      activated: true,
      loggedIn: false,
      botLoggedIn: true,
    } satisfies SetPlayerLoginfoPacket;

    expect(packet).toEqual({
      playerId: 2,
      databaseId: 91,
      votingPower: 4,
      totalGames: 17,
      activated: true,
      loggedIn: false,
      botLoggedIn: true,
    });
  });

  it("ports update_game_paused_packet as a pause state payload shape", () => {
    const packet = { gamePaused: true } satisfies UpdateGamePausedPacket;

    expect(packet.gamePaused).toBe(true);
  });

  it("ports vote_info_packet as a vote state payload shape", () => {
    const packet = {
      inProgress: true,
      voteType: VoteType.ChangeMap,
      value: 12,
    } satisfies VoteInfoPacket;

    expect(packet).toEqual({
      inProgress: true,
      voteType: VoteType.ChangeMap,
      value: 12,
    });
  });

  it("ports snipe_object_packet as a target reference payload shape", () => {
    const packet = { refId: 31 } satisfies SnipeObjectPacket;

    expect(packet.refId).toBe(31);
  });

  it("ports destroy_object_packet as an object destruction payload shape", () => {
    const packet = {
      refId: 8,
      fireMissileAmount: 2,
      killerRefId: 4,
      destroyObject: true,
      doFireDeath: false,
      doMissileDeath: true,
    } satisfies DestroyObjectPacket;

    expect(packet).toEqual({
      refId: 8,
      fireMissileAmount: 2,
      killerRefId: 4,
      destroyObject: true,
      doFireDeath: false,
      doMissileDeath: true,
    });
  });

  it("ports set_player_int_packet as a player integer payload shape", () => {
    const packet = { playerId: 3, value: 99 } satisfies SetPlayerIntPacket;

    expect(packet).toEqual({ playerId: 3, value: 99 });
  });

  it("ports fire_missile_packet as a target coordinate payload shape", () => {
    const packet = { refId: 6, x: 128, y: 256 } satisfies FireMissilePacket;

    expect(packet).toEqual({ refId: 6, x: 128, y: 256 });
  });

  it("ports cancel_building_queue_packet as a queue cancellation payload shape", () => {
    const packet = {
      refId: 11,
      listIndex: 2,
      objectType: 1,
      objectId: 9,
    } satisfies CancelBuildingQueuePacket;

    expect(packet).toEqual({
      refId: 11,
      listIndex: 2,
      objectType: 1,
      objectId: 9,
    });
  });

  it("ports object_team_packet as an ownership payload shape", () => {
    const packet = {
      refId: 12,
      owner: 1,
      driverType: 2,
      driverAmount: 3,
    } satisfies ObjectTeamPacket;

    expect(packet).toEqual({
      refId: 12,
      owner: 1,
      driverType: 2,
      driverAmount: 3,
    });
  });

  it("ports repair_building_anim_packet as a repair animation payload shape", () => {
    const packet = {
      refId: 15,
      on: true,
      remainingTime: 6.75,
      playSound: false,
    } satisfies RepairBuildingAnimPacket;

    expect(packet).toEqual({
      refId: 15,
      on: true,
      remainingTime: 6.75,
      playSound: false,
    });
  });

  it("ports obj_grenade_amount_packet as a grenade count payload shape", () => {
    const packet = {
      refId: 19,
      grenadeAmount: 5,
    } satisfies ObjectGrenadeAmountPacket;

    expect(packet).toEqual({ refId: 19, grenadeAmount: 5 });
  });

  it("ports place_cannon_packet as a cannon placement payload shape", () => {
    const packet = {
      refId: 20,
      tileX: 7,
      tileY: 8,
      objectId: 4,
    } satisfies PlaceCannonPacket;

    expect(packet).toEqual({ refId: 20, tileX: 7, tileY: 8, objectId: 4 });
  });

  it("ports buy_registration_packet as a fixed byte buffer payload shape", () => {
    const buffer = new Uint8Array(16);
    buffer[0] = 65;
    const packet = { buffer } satisfies BuyRegistrationPacket;

    expect(packet.buffer).toHaveLength(16);
    expect(packet.buffer[0]).toBe(65);
  });

  it("ports crane_anim_packet as a crane animation payload shape", () => {
    const packet = {
      refId: 22,
      repairRefId: 23,
      on: true,
    } satisfies CraneAnimPacket;

    expect(packet).toEqual({ refId: 22, repairRefId: 23, on: true });
  });

  it("ports loginoff_packet as a login visibility payload shape", () => {
    const packet = { showLogin: false } satisfies LoginoffPacket;

    expect(packet.showLogin).toBe(false);
  });

  it("ports set_lid_state_packet as a lid state payload shape", () => {
    const packet = { refId: 24, lidOpen: true } satisfies SetLidStatePacket;

    expect(packet).toEqual({ refId: 24, lidOpen: true });
  });

  it("ports team_ended_packet as a team result payload shape", () => {
    const packet = { team: 1, won: true } satisfies TeamEndedPacket;

    expect(packet).toEqual({ team: 1, won: true });
  });

  it("ports player_id_packet as a player id payload shape", () => {
    const packet = { playerId: 7 } satisfies PlayerIdPacket;

    expect(packet.playerId).toBe(7);
  });

  it("ports zone_info_packet as a zone ownership payload shape", () => {
    const packet = { zoneNumber: 3, owner: 1 } satisfies ZoneInfoPacket;

    expect(packet).toEqual({ zoneNumber: 3, owner: 1 });
  });

  it("ports attack_object_packet as an attack target payload shape", () => {
    const packet = {
      refId: 25,
      attackObjectRefId: 26,
    } satisfies AttackObjectPacket;

    expect(packet).toEqual({ refId: 25, attackObjectRefId: 26 });
  });

  it("ports computer_msg_packet as a computer message payload shape", () => {
    const packet = { refId: 27, sound: 3 } satisfies ComputerMsgPacket;

    expect(packet).toEqual({ refId: 27, sound: 3 });
  });

  it("ports add_building_queue_packet as a queue addition payload shape", () => {
    const packet = {
      refId: 28,
      objectType: 2,
      objectId: 10,
    } satisfies AddBuildingQueuePacket;

    expect(packet).toEqual({ refId: 28, objectType: 2, objectId: 10 });
  });

  it("ports object_init_packet as an object initialization payload shape", () => {
    const packet = {
      x: 12,
      y: 34,
      refId: 29,
      owner: 1,
      objectType: 2,
      objectId: 3,
      buildingLevel: 4,
      extraLinks: 5,
      health: 100,
    } satisfies ObjectInitPacket;

    expect(packet).toEqual({
      x: 12,
      y: 34,
      refId: 29,
      owner: 1,
      objectType: 2,
      objectId: 3,
      buildingLevel: 4,
      extraLinks: 5,
      health: 100,
    });
  });

  it("ports driver_hit_packet as a driver-hit effect payload shape", () => {
    const packet = { refId: 30 } satisfies DriverHitPacket;

    expect(packet.refId).toBe(30);
  });

  it("ports pre_event_type as top-level event categories", () => {
    expect(PreEventType.Tcp).toBe(0);
    expect(PreEventType.Sdl).toBe(1);
    expect(PreEventType.Other).toBe(2);
  });

  it("ports other_event as connection lifecycle event numbers", () => {
    expect(OtherEvent.Connect).toBe(0);
    expect(OtherEvent.Disconnect).toBe(1);
  });

  it("ports tcp_event as TCP event numbers", () => {
    expect(TcpEvent.DebugEvent).toBe(0);
    expect(TcpEvent.RequestMap).toBe(1);
    expect(TcpEvent.FireMissile).toBe(20);
    expect(TcpEvent.AddLocalPlayer).toBe(41);
    expect(TcpEvent.RequestSelectableMapList).toBe(60);
    expect(TcpEvent.RequestVersion).toBe(84);
    expect(TcpEvent.GiveVersion).toBe(85);
    expect(TcpEvent.MaxTcpEvents).toBe(86);
  });

  it("replaces sdl_event as browser user input event numbers", () => {
    expect(UserInputEvent.Resize).toBe(0);
    expect(UserInputEvent.LeftClick).toBe(1);
    expect(UserInputEvent.LeftRelease).toBe(2);
    expect(UserInputEvent.RightClick).toBe(3);
    expect(UserInputEvent.RightRelease).toBe(4);
    expect(UserInputEvent.MiddleClick).toBe(5);
    expect(UserInputEvent.MiddleRelease).toBe(6);
    expect(UserInputEvent.WheelUp).toBe(7);
    expect(UserInputEvent.WheelDown).toBe(8);
    expect(UserInputEvent.KeyDown).toBe(9);
    expect(UserInputEvent.KeyUp).toBe(10);
    expect(UserInputEvent.Motion).toBe(11);
    expect(UserInputEvent.MaxUserInputEvents).toBe(12);
  });

  it("ports Event with copied payload storage by default", () => {
    const payload = new Uint8Array([1, 2, 3, 4]);
    const event = new SimulationEvent(2, 7, 3, payload, 3);

    payload[0] = 99;

    expect(event.eventType).toBe(2);
    expect(event.eventNumber).toBe(7);
    expect(event.player).toBe(3);
    expect(event.size).toBe(3);
    expect(event.data).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("ports Event with borrowed payload storage when copying is disabled", () => {
    const payload = new Uint8Array([5, 6]);
    const event = new SimulationEvent(1, 4, 2, payload, 2, false);

    payload[1] = 8;

    expect(event.data).toBe(payload);
    expect(event.data).toEqual(new Uint8Array([5, 8]));
  });

  it("ports MAX_EVENT_TYPES as the event category dispatch height", () => {
    expect(MAX_EVENT_TYPES).toBe(5);
  });

  it("ports MAX_FUNCTIONS as the event function dispatch width", () => {
    expect(MAX_FUNCTIONS).toBe(200);
  });

  it("ports EventHandler event queue access and dispatch", () => {
    const handler = new EventHandler<{ name: string }>();
    const parent = { name: "core" };
    const calls: unknown[] = [];
    const event = new SimulationEvent(
      PreEventType.Tcp,
      TcpEvent.FireMissile,
      7,
      new Uint8Array([1, 2, 3]),
      2,
    );

    handler.setParent(parent);
    handler.addFunction(PreEventType.Tcp, TcpEvent.FireMissile, (...args) => {
      calls.push(args);
    });
    handler.addEvent(event);

    expect(handler.getEventList()).toEqual([event]);
    handler.processEvents();

    expect(calls).toEqual([[parent, new Uint8Array([1, 2]), 2, 7]]);
    expect(handler.getEventList()).toEqual([]);
  });

  it("ports EventHandler direct event processing result codes", () => {
    const logs: string[] = [];
    const handler = new EventHandler<object>(logs.push.bind(logs));

    expect(handler.processEvent(PreEventType.Tcp, TcpEvent.FireMissile, null, 0, 0)).toBe(0);
    expect(logs).toEqual([
      `EventHandler::no function attached to event ${PreEventType.Tcp}:${TcpEvent.FireMissile}`,
    ]);

    handler.addFunction(PreEventType.Tcp, TcpEvent.FireMissile, () => undefined);
    expect(handler.processEvent(PreEventType.Tcp, TcpEvent.FireMissile, null, 0, 0)).toBe(1);
  });

  it("ports EventHandler bounds checks for callback registration", () => {
    const logs: string[] = [];
    const handler = new EventHandler<object>(logs.push.bind(logs));

    handler.addFunction(MAX_EVENT_TYPES, 0, () => undefined);
    handler.addFunction(0, MAX_FUNCTIONS, () => undefined);

    expect(logs).toEqual([
      `EventHandler::attempting to attach function to out of bounds event ${MAX_EVENT_TYPES}:0`,
      `EventHandler::attempting to attach function to out of bounds event 0:${MAX_FUNCTIONS}`,
    ]);
  });
});
