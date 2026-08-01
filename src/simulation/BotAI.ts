/**
 * Upstream: zbot.h, zbot.cpp
 */

import { MapObjectType } from "../world/MapFormat";
import { setupCoreRandomizer, type CoreRandomizerState } from "./GameCore";
import { CannonType, RobotType, VehicleType } from "./SimulationConstants";
import { BuildingState } from "./entities/BuildingTypes";

/**
 * Port of upstream `_ZBOT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zbot.h:2
 */
export const ZBOT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `BuildingUnit` forward declaration.
 * Role: Provides the opaque building-unit reference used by bot build planning.
 * Upstream: zbot.h:8
 */
export type BotBuildingUnitReference = object;

/**
 * Port of upstream `BuildCombo` forward declaration.
 * Role: Provides the opaque build-combination reference used by bot build planning.
 * Upstream: zbot.h:9
 */
export type BotBuildComboReference = object;

/**
 * Port of upstream `BuildingUnit`.
 * Role: Links a production building to the unit type and id it should produce.
 * Upstream: zbot.h:139-144
 */
export class BuildingUnit {
  building: object | null;
  productionObjectType: number;
  productionObjectId: number;

  constructor(
    building: object | null = null,
    productionObjectType = 0,
    productionObjectId = 0,
  ) {
    this.building = building;
    this.productionObjectType = productionObjectType;
    this.productionObjectId = productionObjectId;
  }
}

const robotProductionNames = ["Grunt", "Psycho", "Sniper", "Tough", "Pyro", "Laser"];
const cannonProductionNames = ["Gatling", "Gun", "Howitzer", "Missile"];
const vehicleProductionNames = [
  "Jeep",
  "Light",
  "Medium",
  "Heavy",
  "APC",
  "M Missile",
  "Crane",
];

/**
 * Port of upstream `BuildCombo`.
 * Role: Stores one candidate set of bot production assignments and its target distance.
 * Upstream: zbot.h:146-153
 */
export class BuildCombo {
  buildingList: BuildingUnit[] = [];
  targetDistance = 0;

  /**
   * Port of upstream `BuildCombo::Debug`.
   * Role: Builds diagnostic lines for a bot build-combination candidate.
   * Upstream: zbot.cpp:1687-1703
   */
  debug(): string[] {
    const lines: string[] = [];

    if (this.buildingList.length) {
      lines.push(`BuildCombo - target_distance:${this.targetDistance}`);
    }

    for (const buildingUnit of this.buildingList) {
      const productionObjectType = buildingUnit.productionObjectType;
      const productionObjectId = buildingUnit.productionObjectId;
      let unitLabel: string;

      if (
        productionObjectType === MapObjectType.Robot &&
        productionObjectId >= 0 &&
        productionObjectId < RobotType.Max
      ) {
        unitLabel = robotProductionNames[productionObjectId];
      } else if (
        productionObjectType === MapObjectType.Vehicle &&
        productionObjectId >= 0 &&
        productionObjectId < VehicleType.Max
      ) {
        unitLabel = vehicleProductionNames[productionObjectId];
      } else if (
        productionObjectType === MapObjectType.Vehicle &&
        productionObjectId >= 0 &&
        productionObjectId < CannonType.Max
      ) {
        unitLabel = cannonProductionNames[productionObjectId];
      } else {
        unitLabel = `ot:${productionObjectType} oid:${productionObjectId}`;
      }

      lines.push(`BuildCombo - building:${String(buildingUnit.building)} unit:${unitLabel}`);
    }

    return lines;
  }
}

/**
 * Port of upstream `PreferredUnit`.
 * Role: Stores a bot build preference and how many matching units are already in production.
 * Upstream: zbot.h:115-137
 */
export class PreferredUnit {
  ot: number;
  oid: number;
  pValue: number;
  inProduction: number;

  constructor(ot = 255, oid = 255, pValue = 1.0) {
    this.ot = ot;
    this.oid = oid;
    this.pValue = pValue;
    this.inProduction = 0;
  }
}

/**
 * Port of upstream `ZObject::GetBuildUnit` dependency surface.
 * Role: Provides the currently selected production unit for bot production accounting.
 * Upstream: zbot.cpp:1739
 */
export type BotProductionBuilding = {
  getBuildUnit(): { hasUnit: boolean; objectType: number; objectId: number };
};

/**
 * Port of upstream `ZBot::AddBuildingProductionSums`.
 * Role: Counts one building's active production against matching preferred units.
 * Upstream: zbot.cpp:1733-1747
 */
export function addBotBuildingProductionSums(
  building: BotProductionBuilding | null,
  preferredBuildList: PreferredUnit[],
): void {
  if (!building) return;

  const buildUnit = building.getBuildUnit();
  if (!buildUnit.hasUnit) return;

  const preferredUnit = preferredBuildList.find(
    (candidate) =>
      candidate.ot === buildUnit.objectType && candidate.oid === buildUnit.objectId,
  );

  if (!preferredUnit) return;

  preferredUnit.inProduction++;
}

/**
 * Port of upstream `ZBot::RemoveTargetedFromTargets`.
 * Role: Removes already-targeted objects from target candidates unless that would discard most targets.
 * Upstream: zbot.cpp:267-284
 */
export function removeBotTargetedFromTargets<TObject>(
  targetsList: TObject[],
  targetedList: TObject[],
): void {
  if (!targetsList.length) return;

  const originalTargets = [...targetsList];

  for (const targeted of targetedList) {
    for (let i = targetsList.length - 1; i >= 0; i -= 1) {
      if (targetsList[i] === targeted) {
        targetsList.splice(i, 1);
      }
    }
  }

  if (targetsList.length / originalTargets.length <= 0.25) {
    targetsList.splice(0, targetsList.length, ...originalTargets);
  }
}

/**
 * Port of upstream `max_line_dist`.
 * Role: Limits how far a candidate target may stray from a crane priority path.
 * Upstream: zbot.cpp:482
 */
export const BOT_CRANE_TARGET_MAX_LINE_DISTANCE_PIXELS = 224;

/**
 * Port of upstream `max_total_dist`.
 * Role: Limits total crane-to-target distance trusted for path-adjacent culling.
 * Upstream: zbot.cpp:483
 */
export const BOT_CRANE_TARGET_MAX_TOTAL_DISTANCE_PIXELS = 672;

/**
 * Port of upstream `percent_guns_building_max`.
 * Role: Caps the fraction of buildings that may be assigned to cannon production.
 * Upstream: zbot.cpp:1799
 */
export const BOT_MAX_GUNS_BUILDING_RATIO = 0.35;

/**
 * Port of upstream `max_combo_check`.
 * Role: Caps factory lists before expensive build-combination scoring.
 * Upstream: zbot.cpp:1946
 */
export const BOT_MAX_BUILD_COMBO_CHECK = 6;

/**
 * Port of upstream `ZBot::GetBestBuildComboIncCI`.
 * Role: Advances one bot build-combination index vector in place.
 * Upstream: zbot.cpp:1542-1567
 */
export function incrementBotBuildComboIndexes(indexes: number[], maxProductionUnits: number): boolean {
  let index = 0;

  while (true) {
    if (index >= indexes.length) {
      return false;
    }

    indexes[index]++;

    if (indexes[index] >= maxProductionUnits) {
      indexes[index] = 0;
      index++;
    } else {
      return true;
    }
  }
}

/**
 * Port of upstream `ZBot::CanBuildAt` building dependency surface.
 * Role: Provides production state and timing used by bot build-order selection.
 * Upstream: zbot.cpp:1712-1716
 */
export type BotBuildAvailabilityBuilding = {
  getBuildState(): number;
  percentageProduced(theTime: number): number;
  productionTimeTotal(): number;
  getLastSetAiBuildTime(): number;
};

/**
 * Port of upstream `ZBot::CanBuildAt`.
 * Role: Reports whether bot build selection may update a building now.
 * Upstream: zbot.cpp:1705-1731
 */
export function canBotBuildAt(
  building: BotBuildAvailabilityBuilding | null,
  theTime: number,
): boolean {
  if (!building) return false;

  if (building.getBuildState() === BuildingState.Select) return true;

  const percentageProduced = building.percentageProduced(theTime);
  const totalProductionTime = building.productionTimeTotal();
  const lastSetBuildTime = building.getLastSetAiBuildTime();

  if (percentageProduced >= 0.25) return false;

  if (theTime < lastSetBuildTime + totalProductionTime * 0.35) return false;

  return true;
}

/**
 * Port of upstream `ZBot::Setup` socket dependency surface.
 * Role: Starts a bot client connection against the configured remote address.
 * Upstream: zbot.cpp:36
 */
export type BotSetupClientSocket = {
  start(remoteAddress: string): boolean;
};

/**
 * Port of upstream `ZBot::Setup` state.
 * Role: Holds randomizer state and network configuration used during bot setup.
 * Upstream: zbot.cpp:34-36
 */
export type BotSetupState = CoreRandomizerState & {
  remoteAddress: string;
  clientSocket: BotSetupClientSocket;
};

/**
 * Port of upstream `ZBot::Setup`.
 * Role: Initializes bot randomization and starts the client socket.
 * Upstream: zbot.cpp:31-38
 */
export function botSetup(
  bot: BotSetupState,
  now: () => number = Date.now,
  log: (message: string) => void = (): void => undefined,
): void {
  setupCoreRandomizer(bot, now);

  if (!bot.clientSocket.start(bot.remoteAddress)) {
    log("ZBot::Setup:socket not setup");
  }
}

/**
 * Port of upstream `ZBot::nothing_event`.
 * Role: Handles ignored bot/network events with no side effects.
 * Upstream: zbot_events.cpp:69-72
 */
export function botNothingEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot::test_event`.
 * Role: Builds the diagnostic message that the native bot printed for test events.
 * Upstream: zbot_events.cpp:74-77
 */
export function botTestEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): string | null {
  void bot;
  void dummy;

  if (!size) {
    return null;
  }

  return `ZBot::test_event:${String(data ?? "")}...`;
}

/**
 * Port of upstream `ZBot::ProcessMapDownload` call target.
 * Role: Describes bot processing for store-map events.
 * Upstream: zbot_events.cpp:95
 */
export type BotMapDownloadProcessor = {
  processMapDownload(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::end_game_event` call target.
 * Role: Provides end-game processing for bot event dispatch.
 * Upstream: zbot_events.cpp:196
 */
export type BotEndGameEventProcessor = {
  processEndGame(): void;
};

/**
 * Port of upstream `ZBot::disconnect_event` call target.
 * Role: Provides disconnect processing for bot event dispatch.
 * Upstream: zbot_events.cpp:90
 */
export type BotDisconnectEventProcessor = {
  processDisconnect(): void;
};

/**
 * Port of upstream `ZBot::reset_game_event` state and call target.
 * Role: Provides reset-game processing and bot flag-object tracking.
 * Upstream: zbot_events.cpp:201-204
 */
export type BotResetGameEventProcessor<TFlagObject = unknown> = {
  processResetGame(): void;
  flagObjectList: TFlagObject[];
};

/**
 * Port of upstream `ZBot::connect_event` call targets.
 * Role: Provides bot bypass-data sending followed by connection processing.
 * Upstream: zbot_events.cpp:83-85
 */
export type BotConnectEventProcessor = {
  sendBotBypassData(): void;
  processConnect(): void;
};

/**
 * Port of upstream `ZBot::store_map_event`.
 * Role: Delegates a map-download payload to the bot processor.
 * Upstream: zbot_events.cpp:93-96
 */
export function botStoreMapEvent(
  bot: BotMapDownloadProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processMapDownload(data, size);
}

/**
 * Port of upstream `ZBot::end_game_event`.
 * Role: Processes a bot end-game event.
 * Upstream: zbot_events.cpp:194-197
 */
export function botEndGameEvent(
  bot: BotEndGameEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  bot.processEndGame();
}

/**
 * Port of upstream `ZBot::disconnect_event`.
 * Role: Processes a bot disconnect event.
 * Upstream: zbot_events.cpp:88-91
 */
export function botDisconnectEvent(
  bot: BotDisconnectEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  bot.processDisconnect();
}

/**
 * Port of upstream `ZBot::reset_game_event`.
 * Role: Processes a bot reset-game event and clears tracked flag objects.
 * Upstream: zbot_events.cpp:199-205
 */
export function botResetGameEvent(
  bot: BotResetGameEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  bot.processResetGame();
  bot.flagObjectList.length = 0;
}

/**
 * Port of upstream `ZBot::connect_event`.
 * Role: Sends bot bypass data before processing the connection.
 * Upstream: zbot_events.cpp:79-86
 */
export function botConnectEvent(
  bot: BotConnectEventProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  bot.sendBotBypassData();
  bot.processConnect();
}

/**
 * Port of upstream `ZBot::display_news_event`.
 * Role: Ignores server news-display events in the bot event layer.
 * Upstream: zbot_events.cpp:127-130
 */
export function botDisplayNewsEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot::set_computer_message_event`.
 * Role: Ignores computer-message events that the native bot left disabled.
 * Upstream: zbot_events.cpp:262-265
 */
export function botSetComputerMessageEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot::do_crane_anim_event`.
 * Role: Ignores crane animation events in the headless bot simulation layer.
 * Upstream: zbot_events.cpp:274-277
 */
export function botDoCraneAnimEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot::set_repair_building_anim_event`.
 * Role: Ignores repair-building animation events in the headless bot simulation layer.
 * Upstream: zbot_events.cpp:279-282
 */
export function botSetRepairBuildingAnimEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot::ProcessZSettings` call target.
 * Role: Describes bot processing for settings events.
 * Upstream: zbot_events.cpp:286
 */
export type BotSettingsProcessor = {
  processZSettings(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessObjectLidState` call target.
 * Role: Describes bot processing for lid-open events.
 * Upstream: zbot_events.cpp:293
 */
export type BotObjectLidStateProcessor = {
  processObjectLidState(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::ProcessBuildingCannonList` call target.
 * Role: Describes bot processing for building-cannon-list events.
 * Upstream: zbot_events.cpp:259
 */
export type BotBuildingCannonListProcessor = {
  processBuildingCannonList(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::ProcessObjectGroupInfo` call target.
 * Role: Describes bot processing for object-group-info events.
 * Upstream: zbot_events.cpp:271
 */
export type BotObjectGroupInfoProcessor = {
  processObjectGroupInfo(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::ProcessObjectHealthTeam` call target.
 * Role: Describes bot processing for object-health events.
 * Upstream: zbot_events.cpp:191
 */
export type BotObjectHealthTeamProcessor = {
  processObjectHealthTeam(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::ProcessObjectTeam` call target.
 * Role: Describes bot processing for object-team events.
 * Upstream: zbot_events.cpp:163
 */
export type BotObjectTeamProcessor = {
  processObjectTeam(data: Uint8Array | string | null, size: number): unknown;
};

/**
 * Port of upstream `ZBot::ProcessBuildingState` call target.
 * Role: Describes bot processing for building-state events.
 * Upstream: zbot_events.cpp:252
 */
export type BotBuildingStateProcessor = {
  processBuildingState(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::ProcessObjectLoc` call target.
 * Role: Describes bot processing for object-location events.
 * Upstream: zbot_events.cpp:156
 */
export type BotObjectLocationProcessor = {
  processObjectLoc(data: Uint8Array | string | null, size: number): unknown;
};

/**
 * Port of upstream `ZBot::ProcessWaypointData` call target.
 * Role: Describes bot processing for object-waypoints events.
 * Upstream: zbot_events.cpp:136
 */
export type BotObjectWaypointsProcessor = {
  processWaypointData(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::ProcessRallypointData` call target.
 * Role: Describes bot processing for object-rallypoints events.
 * Upstream: zbot_events.cpp:146
 */
export type BotObjectRallypointsProcessor = {
  processRallypointData(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::ProcessObjectAttackObject` call target.
 * Role: Describes bot processing for object-attack-object events.
 * Upstream: zbot_events.cpp:170
 */
export type BotObjectAttackObjectProcessor = {
  processObjectAttackObject(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZObject::RemoveObject` dependency surface.
 * Role: Provides reference cleanup for bot objects after object deletion.
 * Upstream: zbot_events.cpp:183-184
 */
export type BotObjectRemovalReference<TObject = unknown> = {
  removeObject(object: TObject): void;
};

/**
 * Port of upstream `ZBot::ProcessDeleteObject` call target and object list.
 * Role: Provides deletion processing and object references cleaned by the delete-object event wrapper.
 * Upstream: zbot_events.cpp:177, zbot_events.cpp:183-184
 */
export type BotDeleteObjectProcessor<TObject = unknown> = {
  objectList: BotObjectRemovalReference<TObject>[];
  processDeleteObject(
    data: Uint8Array | string | null,
    size: number,
  ): TObject | null;
};

/**
 * Port of upstream `ZBot::ProcessBuildingQueueList` call target.
 * Role: Describes bot processing for build-queue-list events.
 * Upstream: zbot_events.cpp:395
 */
export type BotBuildingQueueListProcessor = {
  processBuildingQueueList(
    data: Uint8Array | string | null,
    size: number,
  ): unknown;
};

/**
 * Port of upstream `ZBot::set_settings_event`.
 * Role: Delegates a settings payload to the bot processor.
 * Upstream: zbot_events.cpp:284-287
 */
export function botSetSettingsEvent(
  bot: BotSettingsProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processZSettings(data, size);
}

/**
 * Port of upstream `ZBot::set_lid_open_event`.
 * Role: Delegates an object lid-state payload to the bot processor.
 * Upstream: zbot_events.cpp:289-294
 */
export function botSetLidOpenEvent(
  bot: BotObjectLidStateProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processObjectLidState(data, size);
}

/**
 * Port of upstream `ZBot::set_building_cannon_list_event`.
 * Role: Delegates a building cannon-list payload to the bot processor.
 * Upstream: zbot_events.cpp:255-260
 */
export function botSetBuildingCannonListEvent(
  bot: BotBuildingCannonListProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processBuildingCannonList(data, size);
}

/**
 * Port of upstream `ZBot::set_object_group_info_event`.
 * Role: Delegates an object group-info payload to the bot processor.
 * Upstream: zbot_events.cpp:267-272
 */
export function botSetObjectGroupInfoEvent(
  bot: BotObjectGroupInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processObjectGroupInfo(data, size);
}

/**
 * Port of upstream `ZBot::set_object_health_event`.
 * Role: Delegates an object health/team payload to the bot processor.
 * Upstream: zbot_events.cpp:187-192
 */
export function botSetObjectHealthEvent(
  bot: BotObjectHealthTeamProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processObjectHealthTeam(data, size);
}

/**
 * Port of upstream `ZBot::set_object_team_event`.
 * Role: Delegates an object-team payload to the bot processor.
 * Upstream: zbot_events.cpp:159-164
 */
export function botSetObjectTeamEvent(
  bot: BotObjectTeamProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processObjectTeam(data, size);
}

/**
 * Port of upstream `ZBot::set_building_state_event`.
 * Role: Delegates a building-state payload to the bot processor.
 * Upstream: zbot_events.cpp:248-253
 */
export function botSetBuildingStateEvent(
  bot: BotBuildingStateProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processBuildingState(data, size);
}

/**
 * Port of upstream `ZBot::set_object_loc_event`.
 * Role: Delegates an object-location payload to the bot processor.
 * Upstream: zbot_events.cpp:152-157
 */
export function botSetObjectLocationEvent(
  bot: BotObjectLocationProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processObjectLoc(data, size);
}

/**
 * Port of upstream `ZBot::set_object_waypoints_event`.
 * Role: Delegates an object-waypoints payload to the bot processor.
 * Upstream: zbot_events.cpp:132-140
 */
export function botSetObjectWaypointsEvent(
  bot: BotObjectWaypointsProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processWaypointData(data, size);
}

/**
 * Port of upstream `ZBot::set_object_rallypoints_event`.
 * Role: Delegates an object-rallypoints payload to the bot processor.
 * Upstream: zbot_events.cpp:142-150
 */
export function botSetObjectRallypointsEvent(
  bot: BotObjectRallypointsProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processRallypointData(data, size);
}

/**
 * Port of upstream `ZBot::set_object_attack_object_event`.
 * Role: Delegates an object attack-target payload to the bot processor.
 * Upstream: zbot_events.cpp:166-171
 */
export function botSetObjectAttackObjectEvent(
  bot: BotObjectAttackObjectProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processObjectAttackObject(data, size);
}

/**
 * Port of upstream `ZBot::delete_object_event`.
 * Role: Processes object deletion and clears stale references from every bot object.
 * Upstream: zbot_events.cpp:173-185
 */
export function botDeleteObjectEvent<TObject>(
  bot: BotDeleteObjectProcessor<TObject>,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  const object = bot.processDeleteObject(data, size);
  if (!object) return;

  for (const listedObject of bot.objectList) {
    listedObject.removeObject(object);
  }
}

/**
 * Port of upstream `ZBot::set_build_queue_list_event`.
 * Role: Delegates a building queue-list payload to the bot processor.
 * Upstream: zbot_events.cpp:391-396
 */
export function botSetBuildQueueListEvent(
  bot: BotBuildingQueueListProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  void bot.processBuildingQueueList(data, size);
}

/**
 * Port of upstream `ZBot::fire_object_missile_event`.
 * Role: Ignores missile visual effects because the native bot disabled this processing.
 * Upstream: zbot_events.cpp:207-212
 */
export function botFireObjectMissileEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot::snipe_object_event`.
 * Role: Ignores snipe-object visual events that the native bot marked unnecessary.
 * Upstream: zbot_events.cpp:296-299
 */
export function botSnipeObjectEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot::driver_hit_effect_event`.
 * Role: Ignores driver-hit visual effect events that the native bot marked unnecessary.
 * Upstream: zbot_events.cpp:301-304
 */
export function botDriverHitEffectEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}

/**
 * Port of upstream `ZBot` player_info collection.
 * Role: Holds player metadata tracked by bot event handlers.
 * Upstream: zbot.h, zbot_events.cpp:308
 */
export type BotPlayerInfoState<TPlayerInfo = unknown> = {
  playerInfo: TPlayerInfo[];
};

/**
 * Port of upstream `ZBot::ProcessAddLPlayer` call target.
 * Role: Describes bot processing for add-player events.
 * Upstream: zbot_events.cpp:313
 */
export type BotAddPlayerProcessor = {
  processAddLocalPlayer(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessDeleteLPlayer` call target.
 * Role: Describes bot processing for delete-player events.
 * Upstream: zbot_events.cpp:318
 */
export type BotDeletePlayerProcessor = {
  processDeleteLocalPlayer(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessPlayerID` call target.
 * Role: Describes bot processing for player-id events.
 * Upstream: zbot_events.cpp:368
 */
export type BotPlayerIdProcessor = {
  processPlayerId(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessSelectableMapList` call target.
 * Role: Describes bot processing for selectable-map-list events.
 * Upstream: zbot_events.cpp:373
 */
export type BotSelectableMapListProcessor = {
  processSelectableMapList(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZBot::ProcessSetLPlayerName` call target.
 * Role: Describes bot processing for player-name events.
 * Upstream: zbot_events.cpp:323
 */
export type BotPlayerNameProcessor = {
  processSetLocalPlayerName(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessSetLPlayerTeam` call target.
 * Role: Describes bot processing for player-team events.
 * Upstream: zbot_events.cpp:328
 */
export type BotPlayerTeamProcessor = {
  processSetLocalPlayerTeam(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessSetLPlayerMode` call target.
 * Role: Describes bot processing for player-mode events.
 * Upstream: zbot_events.cpp:333
 */
export type BotPlayerModeProcessor = {
  processSetLocalPlayerMode(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessSetLPlayerIgnored` call target.
 * Role: Describes bot processing for player-ignored events.
 * Upstream: zbot_events.cpp:338
 */
export type BotPlayerIgnoredProcessor = {
  processSetLocalPlayerIgnored(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZBot::ProcessSetLPlayerLogInfo` call target.
 * Role: Describes bot processing for player-log-info events.
 * Upstream: zbot_events.cpp:343
 */
export type BotPlayerLogInfoProcessor = {
  processSetLocalPlayerLogInfo(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZBot::ProcessSetLPlayerVoteInfo` call target.
 * Role: Describes bot processing for player-vote-info events.
 * Upstream: zbot_events.cpp:348
 */
export type BotPlayerVoteInfoProcessor = {
  processSetLocalPlayerVoteInfo(
    data: Uint8Array | string | null,
    size: number,
  ): void;
};

/**
 * Port of upstream `ZBot::ProcessUpdateGamePaused` call target.
 * Role: Describes bot processing for pause-state events.
 * Upstream: zbot_events.cpp:353
 */
export type BotGamePausedProcessor = {
  processUpdateGamePaused(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessUpdateGameSpeed` call target.
 * Role: Describes bot processing for game-speed events.
 * Upstream: zbot_events.cpp:358
 */
export type BotGameSpeedProcessor = {
  processUpdateGameSpeed(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessVoteInfo` call target.
 * Role: Describes bot processing for vote-info events.
 * Upstream: zbot_events.cpp:363
 */
export type BotVoteInfoProcessor = {
  processVoteInfo(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessSetTeam` call target.
 * Role: Describes bot processing for team events.
 * Upstream: zbot_events.cpp:388
 */
export type BotTeamProcessor = {
  processSetTeam(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessSetGrenadeState` call target.
 * Role: Describes bot processing for grenade-state events.
 * Upstream: zbot_events.cpp:383
 */
export type BotGrenadeStateProcessor = {
  processSetGrenadeState(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::ProcessZoneInfo` call target.
 * Role: Describes bot processing for zone-info events.
 * Upstream: zbot_events.cpp:124
 */
export type BotZoneInfoProcessor = {
  processZoneInfo(data: Uint8Array | string | null, size: number): void;
};

/**
 * Port of upstream `ZBot::clear_player_list_event`.
 * Role: Clears tracked player metadata.
 * Upstream: zbot_events.cpp:306-309
 */
export function botClearPlayerListEvent(
  bot: BotPlayerInfoState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  bot.playerInfo.length = 0;
}

/**
 * Port of upstream `ZBot::add_player_event`.
 * Role: Delegates an add-player payload to the bot processor.
 * Upstream: zbot_events.cpp:311-314
 */
export function botAddPlayerEvent(
  bot: BotAddPlayerProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processAddLocalPlayer(data, size);
}

/**
 * Port of upstream `ZBot::delete_player_event`.
 * Role: Delegates a delete-player payload to the bot processor.
 * Upstream: zbot_events.cpp:316-319
 */
export function botDeletePlayerEvent(
  bot: BotDeletePlayerProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processDeleteLocalPlayer(data, size);
}

/**
 * Port of upstream `ZBot::set_player_id_event`.
 * Role: Delegates a player-id update payload to the bot processor.
 * Upstream: zbot_events.cpp:366-369
 */
export function botSetPlayerIdEvent(
  bot: BotPlayerIdProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processPlayerId(data, size);
}

/**
 * Port of upstream `ZBot::set_selectable_map_list_event`.
 * Role: Delegates a selectable-map-list payload to the bot processor.
 * Upstream: zbot_events.cpp:371-374
 */
export function botSetSelectableMapListEvent(
  bot: BotSelectableMapListProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSelectableMapList(data, size);
}

/**
 * Port of upstream `ZBot::set_player_name_event`.
 * Role: Delegates a player-name update payload to the bot processor.
 * Upstream: zbot_events.cpp:321-324
 */
export function botSetPlayerNameEvent(
  bot: BotPlayerNameProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetLocalPlayerName(data, size);
}

/**
 * Port of upstream `ZBot::set_player_team_event`.
 * Role: Delegates a player-team update payload to the bot processor.
 * Upstream: zbot_events.cpp:326-329
 */
export function botSetPlayerTeamEvent(
  bot: BotPlayerTeamProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetLocalPlayerTeam(data, size);
}

/**
 * Port of upstream `ZBot::set_player_mode_event`.
 * Role: Delegates a player-mode update payload to the bot processor.
 * Upstream: zbot_events.cpp:331-334
 */
export function botSetPlayerModeEvent(
  bot: BotPlayerModeProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetLocalPlayerMode(data, size);
}

/**
 * Port of upstream `ZBot::set_player_ignored_event`.
 * Role: Delegates a player-ignore update payload to the bot processor.
 * Upstream: zbot_events.cpp:336-339
 */
export function botSetPlayerIgnoredEvent(
  bot: BotPlayerIgnoredProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetLocalPlayerIgnored(data, size);
}

/**
 * Port of upstream `ZBot::set_player_loginfo_event`.
 * Role: Delegates a player log-info update payload to the bot processor.
 * Upstream: zbot_events.cpp:341-344
 */
export function botSetPlayerLogInfoEvent(
  bot: BotPlayerLogInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetLocalPlayerLogInfo(data, size);
}

/**
 * Port of upstream `ZBot::set_player_voteinfo_event`.
 * Role: Delegates a player vote-info update payload to the bot processor.
 * Upstream: zbot_events.cpp:346-349
 */
export function botSetPlayerVoteInfoEvent(
  bot: BotPlayerVoteInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetLocalPlayerVoteInfo(data, size);
}

/**
 * Port of upstream `ZBot::update_game_paused_event`.
 * Role: Delegates a pause-state update payload to the bot processor.
 * Upstream: zbot_events.cpp:351-354
 */
export function botUpdateGamePausedEvent(
  bot: BotGamePausedProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processUpdateGamePaused(data, size);
}

/**
 * Port of upstream `ZBot::update_game_speed_event`.
 * Role: Delegates a game-speed update payload to the bot processor.
 * Upstream: zbot_events.cpp:356-359
 */
export function botUpdateGameSpeedEvent(
  bot: BotGameSpeedProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processUpdateGameSpeed(data, size);
}

/**
 * Port of upstream `ZBot::set_vote_info_event`.
 * Role: Delegates a vote-info payload to the bot processor.
 * Upstream: zbot_events.cpp:361-364
 */
export function botSetVoteInfoEvent(
  bot: BotVoteInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processVoteInfo(data, size);
}

/**
 * Port of upstream `ZBot::set_team_event`.
 * Role: Delegates a team update payload to the bot processor.
 * Upstream: zbot_events.cpp:386-389
 */
export function botSetTeamEvent(
  bot: BotTeamProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetTeam(data, size);
}

/**
 * Port of upstream `ZBot::set_grenade_amount_event`.
 * Role: Delegates a grenade-state payload to the bot processor.
 * Upstream: zbot_events.cpp:381-384
 */
export function botSetGrenadeAmountEvent(
  bot: BotGrenadeStateProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processSetGrenadeState(data, size);
}

/**
 * Port of upstream `ZBot::set_zone_info_event`.
 * Role: Delegates a zone-info payload to the bot processor.
 * Upstream: zbot_events.cpp:122-125
 */
export function botSetZoneInfoEvent(
  bot: BotZoneInfoProcessor,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void dummy;
  bot.processZoneInfo(data, size);
}

/**
 * Port of upstream `ZBot::display_login_event`.
 * Role: Ignores login-display events in the bot event layer.
 * Upstream: zbot_events.cpp:376-379
 */
export function botDisplayLoginEvent(
  bot: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void bot;
  void data;
  void size;
  void dummy;
}
