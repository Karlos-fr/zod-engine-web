import { describe, expect, it } from "vitest";
import { SoundEngineSound } from "../src/audio/AudioService";
import { GAME_VERSION } from "../src/simulation/SimulationConstants";
import { MAX_VERSION_PACKET_CHARS, TcpEvent } from "../src/simulation/EventHandler";
import { HudEndUnit } from "../src/ui/HudLayout";
import { MapObjectType } from "../src/world/MapFormat";
import { PortraitAnimationType } from "../src/simulation/PortraitAnimation";
import { SpaceBarEvent } from "../src/simulation/PlayerPresentation";
import {
  CRANE_ANIM_PACKET_SIZE_BYTES,
  DO_PORTRAIT_ANIM_PACKET_SIZE_BYTES,
  DRIVER_HIT_PACKET_SIZE_BYTES,
  processPlayerDisconnect,
  playerAddPlayerEvent,
  playerConnectEvent,
  playerDeleteObjectEvent,
  playerDeletePlayerEvent,
  playerDoCraneAnimEvent,
  playerDoPortraitAnimEvent,
  playerDisconnectEvent,
  playerDisplayLoginEvent,
  playerDriverHitEffectEvent,
  playerEndGameEvent,
  playerFireObjectMissileEvent,
  playerGetVersionEvent,
  playerPickupGrenadeEvent,
  playerResetGameEvent,
  playerRequestVersionEvent,
  playerSetBuildQueueListEvent,
  playerSetBuildingCannonListEvent,
  playerSetBuildingStateEvent,
  playerSetGrenadeAmountEvent,
  playerSetPlayerIdEvent,
  playerSetPlayerIgnoredEvent,
  playerSetLidOpenEvent,
  playerSetPlayerLogInfoEvent,
  playerSetPlayerModeEvent,
  playerSetPlayerNameEvent,
  playerSnipeObjectEvent,
  playerSetRepairBuildingAnimEvent,
  playerSetObjectHealthEvent,
  playerSetObjectTeamEvent,
  playerSetObjectGroupInfoEvent,
  playerSetObjectAttackObjectEvent,
  playerSetObjectLocationEvent,
  playerSetObjectWaypointsEvent,
  playerSetObjectRallypointsEvent,
  playerSetPlayerVoteInfoEvent,
  playerSetSelectableMapListEvent,
  playerSetSettingsEvent,
  playerSetPlayerTeamEvent,
  playerStoreMapEvent,
  playerSetTeamEvent,
  playerSetVoteInfoEvent,
  playerSetZoneInfoEvent,
  playerTeamEndedEvent,
  playerUpdateGamePausedEvent,
  playerUpdateGameSpeedEvent,
  playerWheelDownEvent,
  playerWheelUpEvent,
  PLAYER_DISCONNECTED_NEWS_MESSAGE,
  PLAYER_NEWS_ENTRY_DURATION_SECONDS,
  REPAIR_BUILDING_ANIM_PACKET_SIZE_BYTES,
  SNIPE_OBJECT_PACKET_SIZE_BYTES,
  TEAM_ENDED_PACKET_SIZE_BYTES,
} from "../src/simulation/PlayerEvents";

describe("player events", () => {
  it("ports the news entry display duration", () => {
    expect(PLAYER_NEWS_ENTRY_DURATION_SECONDS).toBe(10.0);
  });

  it("ports ZPlayer ProcessDisconnect as a fixed news entry", () => {
    const messages: string[] = [];

    processPlayerDisconnect({
      addNewsEntry: (message) => messages.push(message),
    });

    expect(messages).toEqual([PLAYER_DISCONNECTED_NEWS_MESSAGE]);
  });

  it("ports ZPlayer connect_event as connect processing then login send", () => {
    const calls: string[] = [];

    playerConnectEvent(
      {
        processConnect: () => calls.push("process-connect"),
        sendLogin: () => calls.push("send-login"),
      },
      "ignored",
      7,
      99,
    );

    expect(calls).toEqual(["process-connect", "send-login"]);
  });

  it("ports ZPlayer disconnect_event as disconnect processing", () => {
    const calls: string[] = [];

    playerDisconnectEvent(
      {
        processDisconnect: () => calls.push("process-disconnect"),
      },
      "ignored",
      7,
      99,
    );

    expect(calls).toEqual(["process-disconnect"]);
  });

  it("ports ZPlayer store_map_event as map download only until loaded", () => {
    const calls: unknown[] = [];
    const player = createStoreMapPlayer(calls, false);
    const data = new Uint8Array([1, 2, 3]);

    playerStoreMapEvent(player, data, 3, 99);

    expect(calls).toEqual(["download", data, 3, "loaded"]);
  });

  it("ports ZPlayer store_map_event as post-load map and HUD setup", () => {
    const calls: unknown[] = [];
    const player = createStoreMapPlayer(calls, true);
    player.graphicsLoaded = true;

    playerStoreMapEvent(player, "map", 7, 99);

    expect(calls).toEqual([
      "download",
      "map",
      7,
      "loaded",
      "view",
      700,
      564,
      "basics",
      "terrain",
      4,
      "minimap",
      "animals",
      "music",
      4,
    ]);
  });

  it("ports ZPlayer store_map_event without music before graphics load", () => {
    const calls: unknown[] = [];
    const player = createStoreMapPlayer(calls, true);
    player.graphicsLoaded = false;

    playerStoreMapEvent(player, null, 0, 99);

    expect(calls).toContain("animals");
    expect(calls).not.toContain("music");
  });

  it("ports ZPlayer end_game_event as end-game processing", () => {
    const calls: string[] = [];

    playerEndGameEvent(
      {
        processEndGame: () => calls.push("process-end-game"),
      },
      null,
      0,
      99,
    );

    expect(calls).toEqual(["process-end-game"]);
  });

  it("ports ZPlayer reset_game_event as reset-game processing", () => {
    const calls: string[] = [];

    playerResetGameEvent(
      {
        processResetGame: () => calls.push("process-reset-game"),
      },
      null,
      0,
      99,
    );

    expect(calls).toEqual(["process-reset-game"]);
  });

  it("ports ZPlayer request_version_event as fixed version packet send", () => {
    const calls: Array<{ packId: TcpEvent; data: Uint8Array; size: number }> = [];

    playerRequestVersionEvent(
      {
        clientSocket: {
          sendMessage(packId: TcpEvent, data: Uint8Array, size: number) {
            calls.push({ packId, data: new Uint8Array(data), size });
            return 1;
          },
        },
      },
      "ignored",
      7,
      99,
    );

    const expected = new Uint8Array(MAX_VERSION_PACKET_CHARS);
    for (let i = 0; i < GAME_VERSION.length; i += 1) {
      expected[i] = GAME_VERSION.charCodeAt(i);
    }

    expect(calls).toEqual([
      {
        packId: TcpEvent.GiveVersion,
        data: expected,
        size: MAX_VERSION_PACKET_CHARS,
      },
    ]);
  });

  it("ports ZPlayer request_version_event oversized version guard", () => {
    const calls: unknown[] = [];

    playerRequestVersionEvent(
      {
        clientSocket: {
          sendMessage(packId: TcpEvent, data: Uint8Array, size: number) {
            calls.push(packId, data, size);
            return 1;
          },
        },
      },
      null,
      0,
      99,
      "x".repeat(MAX_VERSION_PACKET_CHARS - 1),
    );

    expect(calls).toEqual([]);
  });

  it("ports ZPlayer get_version_event invalid packet size guard", () => {
    const messages: string[] = [];

    playerGetVersionEvent(
      { addNewsEntry: (message) => messages.push(message) },
      new Uint8Array(MAX_VERSION_PACKET_CHARS),
      MAX_VERSION_PACKET_CHARS - 1,
      99,
    );

    expect(messages).toEqual([]);
  });

  it("ports ZPlayer get_version_event as matching server version news", () => {
    const messages: string[] = [];
    const packet = new Uint8Array(MAX_VERSION_PACKET_CHARS);
    for (let i = 0; i < GAME_VERSION.length; i += 1) {
      packet[i] = GAME_VERSION.charCodeAt(i);
    }

    playerGetVersionEvent(
      { addNewsEntry: (message) => messages.push(message) },
      packet,
      packet.length,
      99,
    );

    expect(messages).toEqual([`the server version is ${GAME_VERSION}`]);
  });

  it("ports ZPlayer get_version_event as mismatch news with NUL termination", () => {
    const messages: string[] = [];
    const packet = new Uint8Array(MAX_VERSION_PACKET_CHARS).fill("x".charCodeAt(0));
    packet[0] = "2".charCodeAt(0);
    packet[1] = ".".charCodeAt(0);
    packet[2] = "0".charCodeAt(0);
    packet[3] = 0;

    playerGetVersionEvent(
      { addNewsEntry: (message) => messages.push(message) },
      packet,
      packet.length,
      99,
      "1.0",
    );

    expect(messages).toEqual([
      "the server version is 2.0, which mismatches our version 1.0",
    ]);
  });

  it("ports ZPlayer team_ended_event invalid packet and non-local team guards", () => {
    const state = {
      ourTeam: 2,
      objectList: [
        {
          getOwner: () => 2,
          getObjectId: () => ({ objectType: MapObjectType.Robot, objectId: 1 }),
          getDriverType: () => 4,
        },
      ],
      zhud: {
        doEndAnimations: false,
        doEndAnimationsWon: false,
        nextEndAnimTime: 9,
        endAnimations: [] as HudEndUnit[],
      },
    };

    playerTeamEndedEvent(state, { team: 2, won: true }, 1, 99);
    playerTeamEndedEvent(
      state,
      { team: 3, won: true },
      TEAM_ENDED_PACKET_SIZE_BYTES,
      99,
    );

    expect(state.zhud).toEqual({
      doEndAnimations: false,
      doEndAnimationsWon: false,
      nextEndAnimTime: 9,
      endAnimations: [],
    });
  });

  it("ports ZPlayer team_ended_event as local team HUD end animations", () => {
    const packet = new Uint8Array(TEAM_ENDED_PACKET_SIZE_BYTES);
    new DataView(packet.buffer).setInt32(0, 2, true);
    packet[4] = 1;
    const state = {
      ourTeam: 2,
      objectList: [
        {
          getOwner: () => 2,
          getObjectId: () => ({ objectType: MapObjectType.Cannon, objectId: 3 }),
          getDriverType: () => 4,
        },
        {
          getOwner: () => 2,
          getObjectId: () => ({ objectType: MapObjectType.Vehicle, objectId: 5 }),
          getDriverType: () => 6,
        },
        {
          getOwner: () => 2,
          getObjectId: () => ({ objectType: MapObjectType.Robot, objectId: 7 }),
          getDriverType: () => 8,
        },
        {
          getOwner: () => 2,
          getObjectId: () => ({ objectType: MapObjectType.Building, objectId: 9 }),
          getDriverType: () => 10,
        },
        {
          getOwner: () => 1,
          getObjectId: () => ({ objectType: MapObjectType.Robot, objectId: 11 }),
          getDriverType: () => 12,
        },
      ],
      zhud: {
        doEndAnimations: false,
        doEndAnimationsWon: false,
        nextEndAnimTime: 9,
        endAnimations: [] as HudEndUnit[],
      },
    };

    playerTeamEndedEvent(state, packet, packet.length, 99);

    expect(state.zhud.doEndAnimations).toBe(true);
    expect(state.zhud.doEndAnimationsWon).toBe(true);
    expect(state.zhud.nextEndAnimTime).toBe(0);
    expect(state.zhud.endAnimations).toEqual([
      new HudEndUnit(MapObjectType.Cannon, 3, 4),
      new HudEndUnit(MapObjectType.Vehicle, 5, 6),
      new HudEndUnit(MapObjectType.Robot, 7, 7),
    ]);
  });

  it("ports ZPlayer do_portrait_anim_event guard exits", () => {
    const calls: unknown[] = [];
    const object = { refId: 42, getOwner: () => 2 };
    const state = {
      ourTeam: 2,
      objectList: [object],
      aportrait: {
        doingAnim: () => false,
        setObject: (value: typeof object) => calls.push(["set", value.refId]),
        startAnim: (animation: number) => calls.push(["anim", animation]),
      },
      spaceEventList: [] as SpaceBarEvent[],
    };

    playerDoPortraitAnimEvent(
      state,
      { refId: 42, animId: PortraitAnimationType.GunCaptured },
      1,
      99,
    );
    playerDoPortraitAnimEvent(
      { ...state, objectList: [] },
      { refId: 42, animId: PortraitAnimationType.GunCaptured },
      DO_PORTRAIT_ANIM_PACKET_SIZE_BYTES,
      99,
    );
    playerDoPortraitAnimEvent(
      { ...state, ourTeam: 3 },
      { refId: 42, animId: PortraitAnimationType.GunCaptured },
      DO_PORTRAIT_ANIM_PACKET_SIZE_BYTES,
      99,
    );
    playerDoPortraitAnimEvent(
      {
        ...state,
        aportrait: {
          ...state.aportrait,
          doingAnim: () => true,
        },
      },
      { refId: 42, animId: PortraitAnimationType.GunCaptured },
      DO_PORTRAIT_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer do_portrait_anim_event as allowed animation and focus storage", () => {
    const calls: unknown[] = [];
    const object = { refId: 42, getOwner: () => 2 };
    const packet = new Uint8Array(DO_PORTRAIT_ANIM_PACKET_SIZE_BYTES);
    new DataView(packet.buffer).setInt32(0, 42, true);
    new DataView(packet.buffer).setInt32(4, PortraitAnimationType.VehicleCaptured, true);
    const state = {
      ourTeam: 2,
      objectList: [object],
      aportrait: {
        doingAnim: () => false,
        setObject: (value: typeof object) => calls.push(["set", value.refId]),
        startAnim: (animation: number) => calls.push(["anim", animation]),
      },
      spaceEventList: [] as SpaceBarEvent[],
    };

    playerDoPortraitAnimEvent(state, packet, packet.length, 99);

    expect(calls).toEqual([
      ["set", 42],
      ["anim", PortraitAnimationType.VehicleCaptured],
    ]);
    expect(state.spaceEventList).toHaveLength(1);
    expect(state.spaceEventList[0]).toMatchObject({
      refId: 42,
      selectObject: true,
      openGui: false,
    });
  });

  it("ports ZPlayer do_portrait_anim_event as object binding for ignored animation ids", () => {
    const calls: unknown[] = [];
    const object = { refId: 42, getOwner: () => 2 };
    const state = {
      ourTeam: 2,
      objectList: [object],
      aportrait: {
        doingAnim: () => false,
        setObject: (value: typeof object) => calls.push(["set", value.refId]),
        startAnim: (animation: number) => calls.push(["anim", animation]),
      },
      spaceEventList: [] as SpaceBarEvent[],
    };

    playerDoPortraitAnimEvent(
      state,
      { refId: 42, animId: PortraitAnimationType.Blink },
      DO_PORTRAIT_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([["set", 42]]);
    expect(state.spaceEventList[0]).toMatchObject({
      refId: 42,
      selectObject: true,
    });
  });

  it("ports ZPlayer pickup_grenade_event guard exits", () => {
    const calls: unknown[] = [];
    const object = {
      refId: 42,
      getOwner: () => 2,
      doPickupGrenadeAnim: () => calls.push("pickup"),
    };
    const state = {
      ourTeam: 2,
      objectList: [object],
      aportrait: {
        doingAnim: () => false,
        setObject: (value: typeof object) => calls.push(["set", value.refId]),
        startAnim: (animation: number) => calls.push(["anim", animation]),
      },
      spaceEventList: [] as SpaceBarEvent[],
    };

    playerPickupGrenadeEvent(state, { refId: 42 }, 1, 99);
    playerPickupGrenadeEvent({ ...state, objectList: [] }, { refId: 42 }, 4, 99);

    expect(calls).toEqual([]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer pickup_grenade_event as pickup animation without local portrait feedback", () => {
    const calls: unknown[] = [];
    const object = {
      refId: 42,
      getOwner: () => 3,
      doPickupGrenadeAnim: () => calls.push("pickup"),
    };
    const state = {
      ourTeam: 2,
      objectList: [object],
      aportrait: {
        doingAnim: () => false,
        setObject: (value: typeof object) => calls.push(["set", value.refId]),
        startAnim: (animation: number) => calls.push(["anim", animation]),
      },
      spaceEventList: [] as SpaceBarEvent[],
    };

    playerPickupGrenadeEvent(state, { refId: 42 }, 4, 99);

    expect(calls).toEqual(["pickup"]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer pickup_grenade_event as local portrait feedback and focus storage", () => {
    const calls: unknown[] = [];
    const packet = new Uint8Array(4);
    new DataView(packet.buffer).setInt32(0, 42, true);
    const object = {
      refId: 42,
      getOwner: () => 2,
      doPickupGrenadeAnim: () => calls.push("pickup"),
    };
    const state = {
      ourTeam: 2,
      objectList: [object],
      aportrait: {
        doingAnim: () => false,
        setObject: (value: typeof object) => calls.push(["set", value.refId]),
        startAnim: (animation: number) => calls.push(["anim", animation]),
      },
      spaceEventList: [] as SpaceBarEvent[],
    };

    playerPickupGrenadeEvent(state, packet, packet.length, 99);

    expect(calls).toEqual([
      "pickup",
      ["set", 42],
      ["anim", PortraitAnimationType.GrenadesCollected],
    ]);
    expect(state.spaceEventList[0]).toMatchObject({
      refId: 42,
      selectObject: true,
    });
  });

  it("ports ZPlayer pickup_grenade_event as no portrait feedback during active portrait animation", () => {
    const calls: unknown[] = [];
    const object = {
      refId: 42,
      getOwner: () => 2,
      doPickupGrenadeAnim: () => calls.push("pickup"),
    };
    const state = {
      ourTeam: 2,
      objectList: [object],
      aportrait: {
        doingAnim: () => true,
        setObject: (value: typeof object) => calls.push(["set", value.refId]),
        startAnim: (animation: number) => calls.push(["anim", animation]),
      },
      spaceEventList: [] as SpaceBarEvent[],
    };

    playerPickupGrenadeEvent(state, { refId: 42 }, 4, 99);

    expect(calls).toEqual(["pickup"]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer snipe_object_event guard exits", () => {
    const object = createSnipeObject(42, 80, 120, 2);
    const state = {
      objectList: [object],
      ztime: { tick: 7 },
      effectList: [],
    };

    playerSnipeObjectEvent(state, { refId: 42 }, 1, 99);
    playerSnipeObjectEvent({ ...state, objectList: [] }, { refId: 42 }, 4, 99);

    expect(state.effectList).toEqual([]);
  });

  it("ports ZPlayer snipe_object_event as robot turret effect spawn", () => {
    const object = createSnipeObject(42, 80, 120, 2);
    const state = {
      objectList: [object],
      ztime: { tick: 7 },
      effectList: [] as Array<{
        ztime: { tick: number } | null;
        x: number;
        y: number;
        owner: number;
      }>,
    };
    const packet = new Uint8Array(SNIPE_OBJECT_PACKET_SIZE_BYTES);
    new DataView(packet.buffer).setInt32(0, 42, true);

    playerSnipeObjectEvent(state, packet, packet.length, 99);

    expect(state.effectList).toEqual([
      {
        ztime: state.ztime,
        x: 80,
        y: 116,
        owner: 2,
      },
    ]);
  });

  it("ports ZPlayer set_repair_building_anim_event guard exits", () => {
    const calls: unknown[] = [];
    const object = createRepairAnimObject(42, 2, calls);
    const state = {
      ourTeam: 2,
      objectList: [object],
      spaceEventList: [] as SpaceBarEvent[],
      playWav: (sound: SoundEngineSound) => calls.push(["sound", sound]),
    };

    playerSetRepairBuildingAnimEvent(
      state,
      { refId: 42, on: true, remainingTime: 3.5, playSound: true },
      1,
      99,
    );
    playerSetRepairBuildingAnimEvent(
      { ...state, objectList: [] },
      { refId: 42, on: true, remainingTime: 3.5, playSound: true },
      REPAIR_BUILDING_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer set_repair_building_anim_event as repair start sound for local owner", () => {
    const calls: unknown[] = [];
    const object = createRepairAnimObject(42, 2, calls);
    const state = {
      ourTeam: 2,
      objectList: [object],
      spaceEventList: [] as SpaceBarEvent[],
      playWav: (sound: SoundEngineSound) => calls.push(["sound", sound]),
    };
    const packet = new Uint8Array(REPAIR_BUILDING_ANIM_PACKET_SIZE_BYTES);
    const view = new DataView(packet.buffer);
    view.setInt32(0, 42, true);
    packet[4] = 1;
    view.setFloat64(8, 3.5, true);
    packet[16] = 1;

    playerSetRepairBuildingAnimEvent(state, packet, packet.length, 99);

    expect(calls).toEqual([
      ["anim", true, 3.5],
      ["sound", SoundEngineSound.CompStartingRepairSnd],
    ]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer set_repair_building_anim_event as repair finished focus event", () => {
    const calls: unknown[] = [];
    const object = createRepairAnimObject(42, 2, calls);
    const state = {
      ourTeam: 2,
      objectList: [object],
      spaceEventList: [] as SpaceBarEvent[],
      playWav: (sound: SoundEngineSound) => calls.push(["sound", sound]),
    };

    playerSetRepairBuildingAnimEvent(
      state,
      { refId: 42, on: false, remainingTime: 0.25, playSound: true },
      REPAIR_BUILDING_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([
      ["anim", false, 0.25],
      ["sound", SoundEngineSound.CompVehicleRepairedSnd],
    ]);
    expect(state.spaceEventList[0]).toMatchObject({
      refId: 42,
      selectObject: false,
      openGui: false,
    });
  });

  it("ports ZPlayer set_repair_building_anim_event as silent non-local animation", () => {
    const calls: unknown[] = [];
    const object = createRepairAnimObject(42, 3, calls);
    const state = {
      ourTeam: 2,
      objectList: [object],
      spaceEventList: [] as SpaceBarEvent[],
      playWav: (sound: SoundEngineSound) => calls.push(["sound", sound]),
    };

    playerSetRepairBuildingAnimEvent(
      state,
      { refId: 42, on: false, remainingTime: 1.25, playSound: true },
      REPAIR_BUILDING_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([["anim", false, 1.25]]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer set_object_team_event as unit refresh without processed object", () => {
    const calls: unknown[] = [];
    const player = {
      ourTeam: 2,
      processObjectTeam: (data: Uint8Array | string | null, size: number) => {
        calls.push(["process", data, size]);
        return null;
      },
      deleteObjectFromSelection: (object: unknown) => calls.push(["delete", object]),
      processChangeObjectAmount: () => calls.push("change-amount"),
    };

    playerSetObjectTeamEvent(player, "team", 4, 99);

    expect(calls).toEqual([["process", "team", 4], "change-amount"]);
  });

  it("ports ZPlayer set_object_team_event as preserving local owned selection", () => {
    const calls: unknown[] = [];
    const object = { getOwner: () => 2 };
    const player = {
      ourTeam: 2,
      processObjectTeam: () => object,
      deleteObjectFromSelection: (value: typeof object) => calls.push(["delete", value]),
      processChangeObjectAmount: () => calls.push("change-amount"),
    };

    playerSetObjectTeamEvent(player, new Uint8Array([1]), 1, 99);

    expect(calls).toEqual(["change-amount"]);
  });

  it("ports ZPlayer set_object_team_event as deselecting objects lost to another team", () => {
    const calls: unknown[] = [];
    const object = { id: "lost-object", getOwner: () => 3 };
    const player = {
      ourTeam: 2,
      processObjectTeam: (data: Uint8Array | string | null, size: number) => {
        calls.push([
          "process",
          data instanceof Uint8Array ? [...data] : data,
          size,
        ]);
        return object;
      },
      deleteObjectFromSelection: (value: typeof object) =>
        calls.push(["delete", value.id]),
      processChangeObjectAmount: () => calls.push("change-amount"),
    };

    playerSetObjectTeamEvent(player, new Uint8Array([7]), 1, 99);

    expect(calls).toEqual([
      ["process", [7], 1],
      ["delete", "lost-object"],
      "change-amount",
    ]);
  });

  it("ports ZPlayer set_object_attack_object_event guard exits", () => {
    const calls: unknown[] = [];
    const target = createAttackAlertTarget(42, 2);
    const object = { getAttackObject: () => target };
    const state = createAttackAlertState(object, calls);

    playerSetObjectAttackObjectEvent(
      { ...state, processObjectAttackObject: () => null },
      new Uint8Array([1]),
      1,
      99,
      () => 0,
    );
    playerSetObjectAttackObjectEvent(
      { ...state, processObjectAttackObject: () => ({ getAttackObject: () => null }) },
      new Uint8Array([1]),
      1,
      99,
      () => 0,
    );
    playerSetObjectAttackObjectEvent(
      {
        ...state,
        processObjectAttackObject: () => ({
          getAttackObject: () => createAttackAlertTarget(43, 3),
        }),
      },
      new Uint8Array([1]),
      1,
      99,
      () => 0,
    );
    playerSetObjectAttackObjectEvent(
      {
        ...state,
        zhud: {
          ...state.zhud,
          getARefId: () => 7,
        },
      },
      new Uint8Array([1]),
      1,
      99,
      () => 0,
    );
    playerSetObjectAttackObjectEvent(state, new Uint8Array([1]), 1, 99, () => 4);

    expect(calls).toEqual([
      ["process", [1], 1],
      ["process", [1], 1],
      ["process", [1], 1],
      ["process", [1], 1],
      ["process", [1], 1],
    ]);
    expect(state.spaceEventList).toEqual([]);
  });

  it("ports ZPlayer set_object_attack_object_event as local under-attack alert", () => {
    const calls: unknown[] = [];
    const target = createAttackAlertTarget(42, 2);
    const object = { getAttackObject: () => target };
    const state = createAttackAlertState(object, calls);
    const data = new Uint8Array([3, 5]);

    playerSetObjectAttackObjectEvent(state, data, data.length, 99, () => 0);

    expect(calls).toEqual([
      ["process", [3, 5], 2],
      ["set-a-ref-id", 42],
      ["set-portrait-object", 42],
      ["start-portrait-anim", PortraitAnimationType.WereUnderAttack],
    ]);
    expect(state.spaceEventList[0]).toMatchObject({
      refId: 42,
      selectObject: true,
      openGui: false,
    });
  });

  it("ports ZPlayer set_object_attack_object_event as ARefID only during active portrait", () => {
    const calls: unknown[] = [];
    const target = createAttackAlertTarget(42, 2);
    const object = { getAttackObject: () => target };
    const state = createAttackAlertState(object, calls, true);

    playerSetObjectAttackObjectEvent(state, new Uint8Array([1]), 1, 99, () => 0);

    expect(calls).toEqual([
      ["process", [1], 1],
      ["set-a-ref-id", 42],
    ]);
    expect(state.spaceEventList[0]).toMatchObject({
      refId: 42,
      selectObject: true,
    });
  });

  it("ports ZPlayer display_login_event as no-op for invalid packet size", () => {
    const loginMenu = { id: "login" };
    const state = {
      activeMenu: null as typeof loginMenu | null,
      loginMenu,
      createUserMenu: { id: "create" },
    };

    playerDisplayLoginEvent(state, new Uint8Array([1]), 0, 99);
    playerDisplayLoginEvent(state, new Uint8Array([1, 0]), 2, 99);

    expect(state.activeMenu).toBeNull();
  });

  it("ports ZPlayer display_login_event as login menu display", () => {
    const loginMenu = { id: "login" };
    const createUserMenu = { id: "create" };
    const state = {
      activeMenu: null as typeof loginMenu | typeof createUserMenu | null,
      loginMenu,
      createUserMenu,
    };

    playerDisplayLoginEvent(state, new Uint8Array([1]), 1, 99);

    expect(state.activeMenu).toBe(loginMenu);
  });

  it("ports ZPlayer display_login_event as preserving already active auth menu", () => {
    const loginMenu = { id: "login" };
    const createUserMenu = { id: "create" };
    const state = {
      activeMenu: createUserMenu as typeof loginMenu | typeof createUserMenu | null,
      loginMenu,
      createUserMenu,
    };

    playerDisplayLoginEvent(state, "\x01", 1, 99);

    expect(state.activeMenu).toBe(createUserMenu);
  });

  it("ports ZPlayer display_login_event as hiding active auth menus", () => {
    const loginMenu = { id: "login" };
    const createUserMenu = { id: "create" };
    const otherMenu = { id: "other" };
    const state = {
      activeMenu: loginMenu as
        | typeof loginMenu
        | typeof createUserMenu
        | typeof otherMenu
        | null,
      loginMenu,
      createUserMenu,
    };

    playerDisplayLoginEvent(state, new Uint8Array([0]), 1, 99);
    expect(state.activeMenu).toBeNull();

    state.activeMenu = createUserMenu;
    playerDisplayLoginEvent(state, new Uint8Array([0]), 1, 99);
    expect(state.activeMenu).toBeNull();

    state.activeMenu = otherMenu;
    playerDisplayLoginEvent(state, new Uint8Array([0]), 1, 99);
    expect(state.activeMenu).toBe(otherMenu);
  });

  it("ports ZPlayer wheelup_event as wheel-up routing to GUI surfaces", () => {
    const calls: string[] = [];

    playerWheelUpEvent(
      {
        mainMenuWheelUp() {
          calls.push("main-menu");
          return true;
        },
        activeMenu: {
          wheelUpButton() {
            calls.push("active-menu");
            return false;
          },
        },
        guiWindow: {
          wheelUpButton() {
            calls.push("gui-window");
            return true;
          },
        },
        guiFactoryList: {
          wheelUpButton() {
            calls.push("factory-list");
            return false;
          },
        },
      },
      "ignored",
      7,
      99,
    );

    expect(calls).toEqual([
      "main-menu",
      "active-menu",
      "gui-window",
      "factory-list",
    ]);
  });

  it("ports ZPlayer wheelup_event with optional GUI surfaces absent", () => {
    const calls: string[] = [];

    playerWheelUpEvent(
      {
        mainMenuWheelUp() {
          calls.push("main-menu");
          return false;
        },
        activeMenu: null,
        guiWindow: null,
        guiFactoryList: null,
      },
      null,
      0,
      99,
    );

    expect(calls).toEqual(["main-menu"]);
  });

  it("ports ZPlayer wheeldown_event as wheel-down routing to GUI surfaces", () => {
    const calls: string[] = [];

    playerWheelDownEvent(
      {
        mainMenuWheelDown() {
          calls.push("main-menu");
          return true;
        },
        activeMenu: {
          wheelDownButton() {
            calls.push("active-menu");
            return false;
          },
        },
        guiWindow: {
          wheelDownButton() {
            calls.push("gui-window");
            return true;
          },
        },
        guiFactoryList: {
          wheelDownButton() {
            calls.push("factory-list");
            return false;
          },
        },
      },
      "ignored",
      7,
      99,
    );

    expect(calls).toEqual([
      "main-menu",
      "active-menu",
      "gui-window",
      "factory-list",
    ]);
  });

  it("ports ZPlayer wheeldown_event with optional GUI surfaces absent", () => {
    const calls: string[] = [];

    playerWheelDownEvent(
      {
        mainMenuWheelDown() {
          calls.push("main-menu");
          return false;
        },
        activeMenu: null,
        guiWindow: null,
        guiFactoryList: null,
      },
      null,
      0,
      99,
    );

    expect(calls).toEqual(["main-menu"]);
  });

  it("ports ZPlayer add_player_event as add-player payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processAddLocalPlayer: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([1, 2, 3]);

    playerAddPlayerEvent(player, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZPlayer delete_player_event as delete-player payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processDeleteLocalPlayer: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    playerDeletePlayerEvent(player, "delete-player", 13, 99);

    expect(calls).toEqual(["delete-player", 13]);
  });

  it("ports ZPlayer delete_object_event as object deletion payload delegation", () => {
    const calls: unknown[] = [];
    const deletedObject = { id: "deleted-object" };
    const player = {
      processDeleteObject: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
        return deletedObject;
      },
    };
    const data = new Uint8Array([5, 7]);

    playerDeleteObjectEvent(player, data, data.length, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZPlayer set_player_id_event as player-id payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processPlayerId: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([4, 2]);

    playerSetPlayerIdEvent(player, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZPlayer set_selectable_map_list_event as map-list payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processSelectableMapList: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    playerSetSelectableMapListEvent(player, "maps", 4, 99);

    expect(calls).toEqual(["maps", 4]);
  });

  it("ports ZPlayer set_player_name_event as player-name payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processSetLocalPlayerName: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    playerSetPlayerNameEvent(player, "green", 5, 99);

    expect(calls).toEqual(["green", 5]);
  });

  it("ports ZPlayer set_player_team_event as player-team payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processSetLocalPlayerTeam: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([2]);

    playerSetPlayerTeamEvent(player, data, 1, 99);

    expect(calls).toEqual([data, 1]);
  });

  it("ports ZPlayer set_player_mode_event as player-mode payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processSetLocalPlayerMode: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    playerSetPlayerModeEvent(player, "mode", 4, 99);

    expect(calls).toEqual(["mode", 4]);
  });

  it("ports ZPlayer set_player_ignored_event as player-ignored payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processSetLocalPlayerIgnored: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([1]);

    playerSetPlayerIgnoredEvent(player, data, 1, 99);

    expect(calls).toEqual([data, 1]);
  });

  it("ports ZPlayer set_player_loginfo_event as player-log-info payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processSetLocalPlayerLogInfo: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    playerSetPlayerLogInfoEvent(player, "player-log", 10, 99);

    expect(calls).toEqual(["player-log", 10]);
  });

  it("ports ZPlayer set_player_voteinfo_event as payload delegation without inactive vote refresh", () => {
    const calls: unknown[] = [];
    const player = {
      processSetLocalPlayerVoteInfo: (
        data: Uint8Array | string | null,
        size: number,
      ) => calls.push("process", data, size),
      vote: {
        voteInProgress: () => false,
        setupImages: () => calls.push("setup-images"),
      },
      getOurRealVotingPower: () => 2,
      getVotesNeeded: () => 3,
      getVotesFor: () => 4,
      getVotesAgainst: () => 5,
      getVoteAppendDescription: () => "description",
    };

    playerSetPlayerVoteInfoEvent(player, "player-vote", 11, 99);

    expect(calls).toEqual(["process", "player-vote", 11]);
  });

  it("ports ZPlayer set_player_voteinfo_event as active vote image refresh", () => {
    const calls: unknown[] = [];
    const player = {
      processSetLocalPlayerVoteInfo: (
        data: Uint8Array | string | null,
        size: number,
      ) => calls.push("process", data, size),
      vote: {
        voteInProgress: () => true,
        setupImages(
          realVotingPower: number,
          votesNeeded: number,
          votesFor: number,
          votesAgainst: number,
          appendDescription: string,
        ) {
          calls.push(
            "setup-images",
            realVotingPower,
            votesNeeded,
            votesFor,
            votesAgainst,
            appendDescription,
          );
        },
      },
      getOurRealVotingPower: () => 7,
      getVotesNeeded: () => 8,
      getVotesFor: () => 9,
      getVotesAgainst: () => 10,
      getVoteAppendDescription: () => "map change",
    };
    const data = new Uint8Array([1, 2]);

    playerSetPlayerVoteInfoEvent(player, data, 2, 99);

    expect(calls).toEqual([
      "process",
      data,
      2,
      "setup-images",
      7,
      8,
      9,
      10,
      "map change",
    ]);
  });

  it("ports ZPlayer set_vote_info_event as payload delegation without inactive vote refresh", () => {
    const calls: unknown[] = [];
    const player = {
      processVoteInfo: (data: Uint8Array | string | null, size: number) =>
        calls.push("process", data, size),
      vote: {
        voteInProgress: () => false,
        setupImages: () => calls.push("setup-images"),
      },
      getOurRealVotingPower: () => 2,
      getVotesNeeded: () => 3,
      getVotesFor: () => 4,
      getVotesAgainst: () => 5,
      getVoteAppendDescription: () => "description",
    };

    playerSetVoteInfoEvent(player, "vote", 4, 99);

    expect(calls).toEqual(["process", "vote", 4]);
  });

  it("ports ZPlayer set_vote_info_event as active vote image refresh", () => {
    const calls: unknown[] = [];
    const player = {
      processVoteInfo: (data: Uint8Array | string | null, size: number) =>
        calls.push("process", data, size),
      vote: {
        voteInProgress: () => true,
        setupImages(
          realVotingPower: number,
          votesNeeded: number,
          votesFor: number,
          votesAgainst: number,
          appendDescription: string,
        ) {
          calls.push(
            "setup-images",
            realVotingPower,
            votesNeeded,
            votesFor,
            votesAgainst,
            appendDescription,
          );
        },
      },
      getOurRealVotingPower: () => 11,
      getVotesNeeded: () => 12,
      getVotesFor: () => 13,
      getVotesAgainst: () => 14,
      getVoteAppendDescription: () => "speed vote",
    };
    const data = new Uint8Array([9]);

    playerSetVoteInfoEvent(player, data, 1, 99);

    expect(calls).toEqual([
      "process",
      data,
      1,
      "setup-images",
      11,
      12,
      13,
      14,
      "speed vote",
    ]);
  });

  it("ports ZPlayer update_game_paused_event as pause payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processUpdateGamePaused: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([1]);

    playerUpdateGamePausedEvent(player, data, 1, 99);

    expect(calls).toEqual([data, 1]);
  });

  it("ports ZPlayer update_game_speed_event as speed payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processUpdateGameSpeed: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    playerUpdateGameSpeedEvent(player, "speed", 5, 99);

    expect(calls).toEqual(["speed", 5]);
  });

  it("ports ZPlayer set_settings_event as settings payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processZSettings: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([6, 2, 8]);

    playerSetSettingsEvent(player, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZPlayer set_lid_open_event as object lid-state payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processObjectLidState: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "ignored" };
      },
    };
    const data = new Uint8Array([42, 1]);

    playerSetLidOpenEvent(player, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZPlayer set_zone_info_event as zone payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processZoneInfo: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([7, 1]);

    playerSetZoneInfoEvent(player, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZPlayer set_team_event as team payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processSetTeam: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };

    playerSetTeamEvent(player, "team", 4, 99);

    expect(calls).toEqual(["team", 4]);
  });

  it("ports ZPlayer set_object_loc_event as object-location payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processObjectLoc: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };
    const data = new Uint8Array([7, 3]);

    playerSetObjectLocationEvent(player, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZPlayer set_object_group_info_event as object-group-info payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processObjectGroupInfo: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };

    playerSetObjectGroupInfoEvent(player, "group", 5, 99);

    expect(calls).toEqual(["group", 5]);
  });

  it("ports ZPlayer set_grenade_amount_event as HUD and cursor refresh for affected selection", () => {
    const object = { id: "unit" };
    const calls: unknown[] = [];
    const data = new Uint8Array([3, 1]);
    const player = {
      processSetGrenadeState: (
        payload: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push("process", payload, size);
        return object;
      },
      hud: {
        getSelectedObject: () => object,
        reRenderAll: () => calls.push("rerender"),
      },
      selection: {
        updateGroupMember: (updatedObject: typeof object) => {
          calls.push("update", updatedObject);
          return true;
        },
      },
      determineCursor: () => calls.push("cursor"),
    };

    playerSetGrenadeAmountEvent(player, data, 2, 99);

    expect(calls).toEqual([
      "process",
      data,
      2,
      "rerender",
      "update",
      object,
      "cursor",
    ]);
  });

  it("ports ZPlayer set_grenade_amount_event as no-op when payload does not resolve an object", () => {
    const calls: string[] = [];
    const player = {
      processSetGrenadeState: () => {
        calls.push("process");
        return null;
      },
      hud: {
        getSelectedObject: () => {
          calls.push("selected");
          return null;
        },
        reRenderAll: () => calls.push("rerender"),
      },
      selection: {
        updateGroupMember: () => {
          calls.push("update");
          return true;
        },
      },
      determineCursor: () => calls.push("cursor"),
    };

    playerSetGrenadeAmountEvent(player, null, 0, 99);

    expect(calls).toEqual(["process"]);
  });

  it("ports ZPlayer set_grenade_amount_event without selected HUD match or group change", () => {
    const object = { id: "unit" };
    const calls: unknown[] = [];
    const player = {
      processSetGrenadeState: () => object,
      hud: {
        getSelectedObject: () => ({ id: "other" }),
        reRenderAll: () => calls.push("rerender"),
      },
      selection: {
        updateGroupMember: (updatedObject: typeof object) => {
          calls.push("update", updatedObject);
          return false;
        },
      },
      determineCursor: () => calls.push("cursor"),
    };

    playerSetGrenadeAmountEvent(player, "grenade", 7, 99);

    expect(calls).toEqual(["update", object]);
  });

  it("ports ZPlayer set_building_cannon_list_event as building-cannon-list payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processBuildingCannonList: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "building" };
      },
    };
    const data = new Uint8Array([8, 1]);

    playerSetBuildingCannonListEvent(player, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZPlayer set_building_state_event as building-state payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processBuildingState: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "building" };
      },
    };

    playerSetBuildingStateEvent(player, "state", 5, 99);

    expect(calls).toEqual(["state", 5]);
  });

  it("ports ZPlayer set_build_queue_list_event as building queue-list payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processBuildingQueueList: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "building" };
      },
    };
    const data = new Uint8Array([3, 4]);

    playerSetBuildQueueListEvent(player, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZPlayer fire_object_missile_event as missile payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processFireMissile: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([5, 4, 3]);

    playerFireObjectMissileEvent(player, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZPlayer set_object_waypoints_event as waypoint update and display", () => {
    const calls: unknown[] = [];
    const waypointObject = {
      showWaypoints: () => calls.push("show-waypoints"),
    };
    const player = {
      processWaypointData: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return waypointObject;
      },
    };
    const data = new Uint8Array([1, 4, 9]);

    playerSetObjectWaypointsEvent(player, data, 3, 99);

    expect(calls).toEqual([data, 3, "show-waypoints"]);
  });

  it("ports ZPlayer set_object_waypoints_event null object as no display", () => {
    const calls: unknown[] = [];
    const player = {
      processWaypointData: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return null;
      },
    };

    playerSetObjectWaypointsEvent(player, "waypoints", 9, 99);

    expect(calls).toEqual(["waypoints", 9]);
  });

  it("ports ZPlayer set_object_rallypoints_event as rallypoint payload delegation", () => {
    const calls: unknown[] = [];
    const player = {
      processRallypointData: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };
    const data = new Uint8Array([2, 8, 1]);

    playerSetObjectRallypointsEvent(player, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZPlayer set_object_health_event as health update and hit effect", () => {
    const calls: unknown[] = [];
    const healthObject = {
      doHitEffect: () => calls.push("hit-effect"),
    };
    const player = {
      processObjectHealthTeam: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return healthObject;
      },
    };
    const data = new Uint8Array([9, 5, 1]);

    playerSetObjectHealthEvent(player, data, 3, 99);

    expect(calls).toEqual([data, 3, "hit-effect"]);
  });

  it("ports ZPlayer set_object_health_event null object as no hit effect", () => {
    const calls: unknown[] = [];
    const player = {
      processObjectHealthTeam: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return null;
      },
    };

    playerSetObjectHealthEvent(player, "health", 6, 99);

    expect(calls).toEqual(["health", 6]);
  });

  it("ports ZPlayer driver_hit_effect_event as referenced object effect trigger", () => {
    const calls: string[] = [];
    const target = {
      getRefId: () => 42,
      doDriverHitEffect: () => calls.push("driver-hit"),
    };
    const player = {
      objectList: [
        {
          getRefId: () => 7,
          doDriverHitEffect: () => calls.push("wrong-object"),
        },
        target,
      ],
    };

    playerDriverHitEffectEvent(
      player,
      { refId: 42 },
      DRIVER_HIT_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual(["driver-hit"]);
  });

  it("ports ZPlayer driver_hit_effect_event guard exits", () => {
    const calls: string[] = [];
    const player = {
      objectList: [
        {
          getRefId: () => 42,
          doDriverHitEffect: () => calls.push("driver-hit"),
        },
      ],
    };

    playerDriverHitEffectEvent(player, { refId: 42 }, 0, 99);
    playerDriverHitEffectEvent(
      player,
      { refId: 99 },
      DRIVER_HIT_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([]);
  });

  it("ports ZPlayer do_crane_anim_event as referenced crane animation routing", () => {
    const calls: unknown[] = [];
    const repairObject = {
      getRefId: () => 77,
      doCraneAnim: () => calls.push("repair-object"),
    };
    const targetObject = {
      getRefId: () => 42,
      doCraneAnim(on: boolean, repairTarget: unknown) {
        calls.push(on, repairTarget);
      },
    };
    const player = {
      objectList: [
        {
          getRefId: () => 7,
          doCraneAnim: () => calls.push("wrong-object"),
        },
        targetObject,
        repairObject,
      ],
    };

    playerDoCraneAnimEvent(
      player,
      { refId: 42, repairRefId: 77, on: true },
      CRANE_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([true, repairObject]);
  });

  it("ports ZPlayer do_crane_anim_event guard exits", () => {
    const calls: unknown[] = [];
    const targetObject = {
      getRefId: () => 42,
      doCraneAnim(on: boolean, repairTarget: unknown) {
        calls.push(on, repairTarget);
      },
    };
    const player = {
      objectList: [targetObject],
    };

    playerDoCraneAnimEvent(
      player,
      { refId: 42, repairRefId: 0, on: true },
      0,
      99,
    );
    playerDoCraneAnimEvent(
      player,
      { refId: 99, repairRefId: 0, on: true },
      CRANE_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([]);
  });

  it("ports ZPlayer do_crane_anim_event as nullable repair target lookup", () => {
    const calls: unknown[] = [];
    const targetObject = {
      getRefId: () => 42,
      doCraneAnim(on: boolean, repairTarget: unknown) {
        calls.push(on, repairTarget);
      },
    };
    const player = {
      objectList: [targetObject],
    };

    playerDoCraneAnimEvent(
      player,
      { refId: 42, repairRefId: 99, on: false },
      CRANE_ANIM_PACKET_SIZE_BYTES,
      99,
    );

    expect(calls).toEqual([false, null]);
  });
});

function createStoreMapPlayer(calls: unknown[], loaded: boolean) {
  return {
    initWidth: 800,
    initHeight: 600,
    graphicsLoaded: false,
    zmap: {
      loaded: () => {
        calls.push("loaded");
        return loaded;
      },
      setViewingDimensions(width: number, height: number) {
        calls.push("view", width, height);
      },
      getMapBasics: () => {
        calls.push("basics");
        return { terrainType: 4 };
      },
    },
    zhud: {
      setTerrainType(terrainType: number) {
        calls.push("terrain", terrainType);
      },
      minimap: {
        setupBoundaries() {
          calls.push("minimap");
        },
      },
    },
    processMapDownload(data: Uint8Array | string | null, size: number) {
      calls.push("download", data, size);
    },
    initAnimals() {
      calls.push("animals");
    },
    playPlanetMusic(terrainType: number) {
      calls.push("music", terrainType);
    },
  };
}

function createAttackAlertTarget(refId: number, owner: number) {
  return {
    getOwner: () => owner,
    getRefId: () => refId,
  };
}

function createSnipeObject(refId: number, x: number, y: number, owner: number) {
  return {
    getRefId: () => refId,
    getCenterCoords: () => ({ x, y }),
    getOwner: () => owner,
  };
}

function createRepairAnimObject(refId: number, owner: number, calls: unknown[]) {
  return {
    getRefId: () => refId,
    getOwner: () => owner,
    doRepairBuildingAnim: (on: boolean, remainingTime: number) => {
      calls.push(["anim", on, remainingTime]);
    },
  };
}

function createAttackAlertState<TObject extends { getAttackObject(): unknown }>(
  object: TObject,
  calls: unknown[],
  portraitAnimating = false,
) {
  return {
    ourTeam: 2,
    zhud: {
      getARefId: () => -1,
      setARefId: (refId: number) => calls.push(["set-a-ref-id", refId]),
      aportrait: {
        doingAnim: () => portraitAnimating,
        setObject: (target: { getRefId(): number }) =>
          calls.push(["set-portrait-object", target.getRefId()]),
        startAnim: (animation: PortraitAnimationType) =>
          calls.push(["start-portrait-anim", animation]),
      },
    },
    spaceEventList: [] as SpaceBarEvent[],
    processObjectAttackObject(data: Uint8Array | string | null, size: number) {
      calls.push([
        "process",
        data instanceof Uint8Array ? [...data] : data,
        size,
      ]);
      return object;
    },
  };
}
