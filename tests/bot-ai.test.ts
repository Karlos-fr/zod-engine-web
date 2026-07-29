import { describe, expect, it } from "vitest";
import {
  addBotBuildingProductionSums,
  botAddPlayerEvent,
  type BotBuildComboReference,
  type BotBuildingUnitReference,
  BOT_CRANE_TARGET_MAX_LINE_DISTANCE_PIXELS,
  BOT_CRANE_TARGET_MAX_TOTAL_DISTANCE_PIXELS,
  BOT_MAX_BUILD_COMBO_CHECK,
  BOT_MAX_GUNS_BUILDING_RATIO,
  botClearPlayerListEvent,
  botDeleteObjectEvent,
  botDeletePlayerEvent,
  botDoCraneAnimEvent,
  botSetBuildQueueListEvent,
  botSetBuildingStateEvent,
  botSetBuildingCannonListEvent,
  botDisplayLoginEvent,
  botDisplayNewsEvent,
  botDriverHitEffectEvent,
  botFireObjectMissileEvent,
  botNothingEvent,
  botSetGrenadeAmountEvent,
  botSetComputerMessageEvent,
  botSetLidOpenEvent,
  botSetObjectGroupInfoEvent,
  botSetObjectHealthEvent,
  botSetObjectLocationEvent,
  botSetObjectAttackObjectEvent,
  botSetObjectRallypointsEvent,
  botSetObjectWaypointsEvent,
  botSetObjectTeamEvent,
  botSetPlayerIdEvent,
  botSetPlayerIgnoredEvent,
  botSetPlayerLogInfoEvent,
  botSetPlayerModeEvent,
  botSetPlayerNameEvent,
  botSetPlayerTeamEvent,
  botSetPlayerVoteInfoEvent,
  botSetRepairBuildingAnimEvent,
  botSetSettingsEvent,
  botSetSelectableMapListEvent,
  botSetTeamEvent,
  botSetVoteInfoEvent,
  botSetZoneInfoEvent,
  botSnipeObjectEvent,
  botStoreMapEvent,
  botTestEvent,
  botUpdateGamePausedEvent,
  botUpdateGameSpeedEvent,
  BuildCombo,
  BuildingUnit,
  PreferredUnit,
  removeBotTargetedFromTargets,
  ZBOT_HEADER_GUARD_PORTED,
} from "../src/simulation/BotAI";
import { MapObjectType } from "../src/world/MapFormat";
import { CannonType, RobotType, VehicleType } from "../src/simulation/SimulationConstants";

describe("bot AI", () => {
  it("adapts the zbot.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/BotAI");
    const secondImport = await import("../src/simulation/BotAI");

    expect(ZBOT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZBOT_HEADER_GUARD_PORTED).toBe(firstImport.ZBOT_HEADER_GUARD_PORTED);
  });

  it("ports crane target culling distance limits", () => {
    expect(BOT_CRANE_TARGET_MAX_LINE_DISTANCE_PIXELS).toBe(14 * 16);
    expect(BOT_CRANE_TARGET_MAX_TOTAL_DISTANCE_PIXELS).toBe(42 * 16);
  });

  it("ports build-order heuristic limits", () => {
    expect(BOT_MAX_GUNS_BUILDING_RATIO).toBe(0.35);
    expect(BOT_MAX_BUILD_COMBO_CHECK).toBe(6);
  });

  it("ports the bot BuildingUnit forward declaration as an opaque reference", () => {
    const buildingUnit = { objectType: 1, objectId: 2 };
    const reference: BotBuildingUnitReference = buildingUnit;

    expect(reference).toBe(buildingUnit);
  });

  it("ports the bot BuildCombo forward declaration as an opaque reference", () => {
    const buildCombo = { buildList: [], value: 0 };
    const reference: BotBuildComboReference = buildCombo;

    expect(reference).toBe(buildCombo);
  });

  it("ports BuildingUnit default construction", () => {
    expect(new BuildingUnit()).toEqual({
      building: null,
      productionObjectType: 0,
      productionObjectId: 0,
    });
  });

  it("ports BuildingUnit configured construction", () => {
    const building = { id: "factory" };

    expect(new BuildingUnit(building, MapObjectType.Robot, RobotType.Grunt)).toEqual({
      building,
      productionObjectType: MapObjectType.Robot,
      productionObjectId: RobotType.Grunt,
    });
  });

  it("ports BuildCombo default construction", () => {
    expect(new BuildCombo()).toMatchObject({
      buildingList: [],
      targetDistance: 0,
    });
  });

  it("ports PreferredUnit default construction", () => {
    expect(new PreferredUnit()).toEqual({
      ot: 255,
      oid: 255,
      pValue: 1,
      inProduction: 0,
    });
  });

  it("ports PreferredUnit configured construction", () => {
    expect(new PreferredUnit(2, 7, 1.5)).toEqual({
      ot: 2,
      oid: 7,
      pValue: 1.5,
      inProduction: 0,
    });
  });

  it("ports ZBot AddBuildingProductionSums as no-op without a building", () => {
    const preferredBuildList = [new PreferredUnit(MapObjectType.Robot, RobotType.Grunt)];

    addBotBuildingProductionSums(null, preferredBuildList);

    expect(preferredBuildList[0].inProduction).toBe(0);
  });

  it("ports ZBot AddBuildingProductionSums as no-op without a build unit", () => {
    const preferredBuildList = [new PreferredUnit(MapObjectType.Robot, RobotType.Grunt)];

    addBotBuildingProductionSums(
      {
        getBuildUnit: () => ({
          hasUnit: false,
          objectType: MapObjectType.Robot,
          objectId: RobotType.Grunt,
        }),
      },
      preferredBuildList,
    );

    expect(preferredBuildList[0].inProduction).toBe(0);
  });

  it("ports ZBot AddBuildingProductionSums as preferred unit production accounting", () => {
    const preferredBuildList = [
      new PreferredUnit(MapObjectType.Robot, RobotType.Grunt),
      new PreferredUnit(MapObjectType.Vehicle, VehicleType.Jeep),
      new PreferredUnit(MapObjectType.Vehicle, VehicleType.Jeep),
    ];

    addBotBuildingProductionSums(
      {
        getBuildUnit: () => ({
          hasUnit: true,
          objectType: MapObjectType.Vehicle,
          objectId: VehicleType.Jeep,
        }),
      },
      preferredBuildList,
    );

    expect(preferredBuildList.map((unit) => unit.inProduction)).toEqual([0, 1, 0]);
  });

  it("ports ZBot RemoveTargetedFromTargets as no-op without targets", () => {
    const targeted = [{ id: "targeted" }];
    const targets: Array<{ id: string }> = [];

    removeBotTargetedFromTargets(targets, targeted);

    expect(targets).toEqual([]);
  });

  it("ports ZBot RemoveTargetedFromTargets as targeted candidate removal", () => {
    const targetA = { id: "a" };
    const targetB = { id: "b" };
    const targetC = { id: "c" };
    const targets = [targetA, targetB, targetC];

    removeBotTargetedFromTargets(targets, [targetB]);

    expect(targets).toEqual([targetA, targetC]);
  });

  it("ports ZBot RemoveTargetedFromTargets rollback when most targets are removed", () => {
    const targetA = { id: "a" };
    const targetB = { id: "b" };
    const targetC = { id: "c" };
    const targetD = { id: "d" };
    const targets = [targetA, targetB, targetC, targetD];

    removeBotTargetedFromTargets(targets, [targetA, targetB, targetC]);

    expect(targets).toEqual([targetA, targetB, targetC, targetD]);
  });

  it("builds no BuildCombo debug lines for an empty combo", () => {
    expect(new BuildCombo().debug()).toEqual([]);
  });

  it("builds BuildCombo debug lines for robot and vehicle units", () => {
    const combo = new BuildCombo();
    combo.targetDistance = 12.5;
    const robotBuilding = { id: "robot-factory" };
    const vehicleBuilding = { id: "vehicle-factory" };
    combo.buildingList.push(
      {
        building: robotBuilding,
        productionObjectType: MapObjectType.Robot,
        productionObjectId: RobotType.Pyro,
      },
      {
        building: vehicleBuilding,
        productionObjectType: MapObjectType.Vehicle,
        productionObjectId: VehicleType.MissileLauncher,
      },
    );

    expect(combo.debug()).toEqual([
      "BuildCombo - target_distance:12.5",
      `BuildCombo - building:${String(robotBuilding)} unit:Pyro`,
      `BuildCombo - building:${String(vehicleBuilding)} unit:M Missile`,
    ]);
  });

  it("preserves BuildCombo debug fallback for cannon production entries", () => {
    const combo = new BuildCombo();
    const building = { id: "cannon-factory" };
    combo.buildingList.push({
      building,
      productionObjectType: MapObjectType.Cannon,
      productionObjectId: CannonType.Gun,
    });

    expect(combo.debug()).toEqual([
      "BuildCombo - target_distance:0",
      `BuildCombo - building:${String(building)} unit:ot:${MapObjectType.Cannon} oid:${CannonType.Gun}`,
    ]);
  });

  it("builds BuildCombo fallback debug lines for unknown production entries", () => {
    const combo = new BuildCombo();
    combo.buildingList.push({
      building: null,
      productionObjectType: 99,
      productionObjectId: 88,
    });

    expect(combo.debug()).toEqual([
      "BuildCombo - target_distance:0",
      "BuildCombo - building:null unit:ot:99 oid:88",
    ]);
  });

  it("ports ZBot nothing_event as a no-op handler", () => {
    const bot = { touched: false };

    expect(botNothingEvent(bot, "payload", 7, 1)).toBeUndefined();
    expect(bot).toEqual({ touched: false });
  });

  it("ports ZBot display_news_event as a no-op handler", () => {
    const bot = { touched: false };

    expect(botDisplayNewsEvent(bot, "news", 4, 0)).toBeUndefined();
    expect(bot).toEqual({ touched: false });
  });

  it("ports ZBot test_event as a diagnostic message builder", () => {
    expect(botTestEvent(null, "payload", 7, 0)).toBe("ZBot::test_event:payload...");
    expect(botTestEvent(null, "payload", 0, 0)).toBeNull();
  });

  it("ports ZBot store_map_event as map-download payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processMapDownload: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([9, 4, 1]);

    botStoreMapEvent(bot, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports disabled bot message and animation events as no-op handlers", () => {
    const bot = { touched: false };

    expect(botSetComputerMessageEvent(bot, "message", 7, 0)).toBeUndefined();
    expect(botDoCraneAnimEvent(bot, "crane", 5, 0)).toBeUndefined();
    expect(botSetRepairBuildingAnimEvent(bot, "repair", 6, 0)).toBeUndefined();
    expect(bot).toEqual({ touched: false });
  });

  it("ports ZBot set_settings_event as settings payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processZSettings: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([5, 6, 7]);

    botSetSettingsEvent(bot, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZBot set_lid_open_event as object lid-state payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processObjectLidState: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "vehicle" };
      },
    };

    botSetLidOpenEvent(bot, "lid", 3, 99);

    expect(calls).toEqual(["lid", 3]);
  });

  it("ports ZBot set_building_cannon_list_event as building-cannon-list payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processBuildingCannonList: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "building" };
      },
    };
    const data = new Uint8Array([8, 1]);

    botSetBuildingCannonListEvent(bot, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZBot set_object_group_info_event as object-group-info payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processObjectGroupInfo: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };

    botSetObjectGroupInfoEvent(bot, "group", 5, 99);

    expect(calls).toEqual(["group", 5]);
  });

  it("ports ZBot set_object_health_event as object-health/team payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processObjectHealthTeam: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };
    const data = new Uint8Array([4, 9, 2]);

    botSetObjectHealthEvent(bot, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZBot set_object_team_event as object-team payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processObjectTeam: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };

    botSetObjectTeamEvent(bot, "team", 4, 99);

    expect(calls).toEqual(["team", 4]);
  });

  it("ports ZBot set_building_state_event as building-state payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processBuildingState: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "building" };
      },
    };
    const data = new Uint8Array([1, 3, 5]);

    botSetBuildingStateEvent(bot, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZBot set_object_loc_event as object-location payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processObjectLoc: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };

    botSetObjectLocationEvent(bot, "loc", 3, 99);

    expect(calls).toEqual(["loc", 3]);
  });

  it("ports ZBot set_object_waypoints_event as waypoint payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processWaypointData: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };
    const data = new Uint8Array([5, 1, 8]);

    botSetObjectWaypointsEvent(bot, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZBot set_object_rallypoints_event as rallypoint payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processRallypointData: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "building" };
      },
    };

    botSetObjectRallypointsEvent(bot, "rally", 5, 99);

    expect(calls).toEqual(["rally", 5]);
  });

  it("ports ZBot set_object_attack_object_event as object attack-target payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processObjectAttackObject: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "object" };
      },
    };
    const data = new Uint8Array([7, 0]);

    botSetObjectAttackObjectEvent(bot, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZBot delete_object_event as object deletion cleanup fanout", () => {
    const deletedObject = { id: "deleted" };
    const calls: unknown[] = [];
    const bot = {
      objectList: [
        { removeObject: (object: typeof deletedObject) => calls.push("first", object) },
        { removeObject: (object: typeof deletedObject) => calls.push("second", object) },
      ],
      processDeleteObject: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return deletedObject;
      },
    };

    botDeleteObjectEvent(bot, "delete-object", 13, 99);

    expect(calls).toEqual([
      "delete-object",
      13,
      "first",
      deletedObject,
      "second",
      deletedObject,
    ]);
  });

  it("ports ZBot delete_object_event null deletion as no cleanup", () => {
    const calls: unknown[] = [];
    const bot = {
      objectList: [
        { removeObject: (object: unknown) => calls.push("remove", object) },
      ],
      processDeleteObject: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return null;
      },
    };

    botDeleteObjectEvent(bot, "missing-object", 14, 99);

    expect(calls).toEqual(["missing-object", 14]);
  });

  it("ports ZBot set_build_queue_list_event as building queue-list payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processBuildingQueueList: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
        return { id: "building" };
      },
    };

    botSetBuildQueueListEvent(bot, "queue", 5, 99);

    expect(calls).toEqual(["queue", 5]);
  });

  it("ports bot visual effect events marked unnecessary upstream as no-op handlers", () => {
    const bot = { touched: false };

    expect(botFireObjectMissileEvent(bot, "missile", 7, 0)).toBeUndefined();
    expect(botSnipeObjectEvent(bot, "snipe", 5, 0)).toBeUndefined();
    expect(botDriverHitEffectEvent(bot, "driver", 6, 0)).toBeUndefined();
    expect(bot).toEqual({ touched: false });
  });

  it("ports ZBot clear_player_list_event as player info clearing", () => {
    const bot = { playerInfo: [{ name: "red" }, { name: "blue" }] };

    botClearPlayerListEvent(bot, null, 0, 0);

    expect(bot.playerInfo).toEqual([]);
  });

  it("ports ZBot add_player_event as add-player payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processAddLocalPlayer: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([1, 2, 3]);

    botAddPlayerEvent(bot, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZBot delete_player_event as delete-player payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processDeleteLocalPlayer: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    botDeletePlayerEvent(bot, "delete-player", 13, 99);

    expect(calls).toEqual(["delete-player", 13]);
  });

  it("ports ZBot set_player_id_event as player-id payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processPlayerId: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([4, 2]);

    botSetPlayerIdEvent(bot, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZBot set_selectable_map_list_event as map-list payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSelectableMapList: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    botSetSelectableMapListEvent(bot, "maps", 4, 99);

    expect(calls).toEqual(["maps", 4]);
  });

  it("ports ZBot set_player_name_event as player-name payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetLocalPlayerName: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    botSetPlayerNameEvent(bot, "blue", 4, 99);

    expect(calls).toEqual(["blue", 4]);
  });

  it("ports ZBot set_player_team_event as player-team payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetLocalPlayerTeam: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([2]);

    botSetPlayerTeamEvent(bot, data, 1, 99);

    expect(calls).toEqual([data, 1]);
  });

  it("ports ZBot set_player_mode_event as player-mode payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetLocalPlayerMode: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([1]);

    botSetPlayerModeEvent(bot, data, 1, 99);

    expect(calls).toEqual([data, 1]);
  });

  it("ports ZBot set_player_ignored_event as player-ignored payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetLocalPlayerIgnored: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    botSetPlayerIgnoredEvent(bot, "ignored", 7, 99);

    expect(calls).toEqual(["ignored", 7]);
  });

  it("ports ZBot set_player_loginfo_event as player-log-info payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetLocalPlayerLogInfo: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([9, 8, 7]);

    botSetPlayerLogInfoEvent(bot, data, 3, 99);

    expect(calls).toEqual([data, 3]);
  });

  it("ports ZBot set_player_voteinfo_event as player-vote-info payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetLocalPlayerVoteInfo: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    botSetPlayerVoteInfoEvent(bot, "player-vote", 11, 99);

    expect(calls).toEqual(["player-vote", 11]);
  });

  it("ports ZBot update_game_paused_event as pause payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processUpdateGamePaused: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    botUpdateGamePausedEvent(bot, "paused", 6, 99);

    expect(calls).toEqual(["paused", 6]);
  });

  it("ports ZBot update_game_speed_event as speed payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processUpdateGameSpeed: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([2, 0]);

    botUpdateGameSpeedEvent(bot, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZBot set_vote_info_event as vote payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processVoteInfo: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };

    botSetVoteInfoEvent(bot, "vote", 4, 99);

    expect(calls).toEqual(["vote", 4]);
  });

  it("ports ZBot set_team_event as team payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetTeam: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([3]);

    botSetTeamEvent(bot, data, 1, 99);

    expect(calls).toEqual([data, 1]);
  });

  it("ports ZBot set_grenade_amount_event as grenade-state payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processSetGrenadeState: (
        data: Uint8Array | string | null,
        size: number,
      ) => {
        calls.push(data, size);
      },
    };

    botSetGrenadeAmountEvent(bot, "grenades", 8, 99);

    expect(calls).toEqual(["grenades", 8]);
  });

  it("ports ZBot set_zone_info_event as zone payload delegation", () => {
    const calls: unknown[] = [];
    const bot = {
      processZoneInfo: (data: Uint8Array | string | null, size: number) => {
        calls.push(data, size);
      },
    };
    const data = new Uint8Array([7, 1]);

    botSetZoneInfoEvent(bot, data, 2, 99);

    expect(calls).toEqual([data, 2]);
  });

  it("ports ZBot display_login_event as a no-op handler", () => {
    const bot = { touched: false };

    expect(botDisplayLoginEvent(bot, "login", 5, 0)).toBeUndefined();
    expect(bot).toEqual({ touched: false });
  });
});
