import { describe, expect, it } from "vitest";
import {
  DRIVER_HIT_PACKET_SIZE_BYTES,
  processPlayerDisconnect,
  playerAddPlayerEvent,
  playerDeletePlayerEvent,
  playerDriverHitEffectEvent,
  playerFireObjectMissileEvent,
  playerSetBuildQueueListEvent,
  playerSetBuildingCannonListEvent,
  playerSetBuildingStateEvent,
  playerSetPlayerIdEvent,
  playerSetPlayerIgnoredEvent,
  playerSetPlayerLogInfoEvent,
  playerSetPlayerModeEvent,
  playerSetPlayerNameEvent,
  playerSetObjectHealthEvent,
  playerSetObjectWaypointsEvent,
  playerSetObjectRallypointsEvent,
  playerSetSelectableMapListEvent,
  playerSetSettingsEvent,
  playerSetPlayerTeamEvent,
  playerSetTeamEvent,
  playerSetZoneInfoEvent,
  playerUpdateGamePausedEvent,
  playerUpdateGameSpeedEvent,
  PLAYER_DISCONNECTED_NEWS_MESSAGE,
  PLAYER_NEWS_ENTRY_DURATION_SECONDS,
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
});
