/**
 * Ported from Zod Engine.
 * Upstream: constants.h
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Adaptation of upstream `_CONSTANTS_H_`.
 * Role: Marks the TypeScript module boundary for upstream `constants.h`.
 * Ledger: MAC-1287A5
 * Upstream: constants.h:2
 * Adaptation: ES modules already prevent repeated declaration; this exported marker keeps the ledger traceable without runtime behavior.
 */
export const CONSTANTS_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `GAME_VERSION`.
 * Role: Identifies the upstream game data and protocol version carried by this port.
 * Ledger: MAC-B78A07
 * Upstream: constants.h:9
 */
export const GAME_VERSION = "2018-01-14";

/**
 * Adaptation of upstream `MAX_PLAYER_NAME_SIZE`.
 * Role: Defines the maximum player-name field size accepted by simulation and network-facing data.
 * Ledger: MAC-F05645
 * Upstream: constants.h:11
 */
export const MAX_PLAYER_NAME_SIZE = 30;

/**
 * Adaptation of upstream `MAX_STORED_CANNONS`.
 * Role: Defines how many cannon placements or selections can be stored by simulation systems.
 * Ledger: MAC-BDECE3
 * Upstream: constants.h:20
 */
export const MAX_STORED_CANNONS = 4;

/**
 * Adaptation of upstream `DEFAULT_MAX_UNITS_PER_TEAM`.
 * Role: Defines the default per-team unit cap used by simulation setup.
 * Ledger: MAC-9E687B
 * Upstream: constants.h:21
 */
export const DEFAULT_MAX_UNITS_PER_TEAM = 70;

/**
 * Adaptation of upstream `ROAD_SPEED`.
 * Role: Defines the movement speed factor applied to road traversal.
 * Ledger: MAC-D07409
 * Upstream: constants.h:23
 */
export const ROAD_SPEED = 1.689;

/**
 * Adaptation of upstream `WATER_SPEED`.
 * Role: Defines the movement speed factor applied to water traversal.
 * Ledger: MAC-A85B9D
 * Upstream: constants.h:24
 */
export const WATER_SPEED = 0.7;

/**
 * Adaptation of upstream `LIFE_AFTER_DEATH_TIME`.
 * Role: Defines how long an object remains active after death before removal.
 * Ledger: MAC-0CDBBE
 * Upstream: constants.h:28
 */
export const LIFE_AFTER_DEATH_SECONDS = 0;

/**
 * Adaptation of upstream `MAX_BOT_BYPASS_SIZE`.
 * Role: Defines the base maximum bot bypass sizing used by bot pathing behavior.
 * Ledger: MAC-4B1E30
 * Upstream: constants.h:30
 */
export const MAX_BOT_BYPASS_SIZE = 512;

/**
 * Adaptation of upstream `MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET`.
 * Role: Defines the maximum random offset added to bot bypass sizing.
 * Ledger: MAC-3B5684
 * Upstream: constants.h:31
 */
export const MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET = 64;

/**
 * Adaptation of upstream `MAX_BUILDING_LEVELS`.
 * Role: Defines how many building upgrade levels the simulation can represent.
 * Ledger: MAC-121301
 * Upstream: constants.h:12
 */
export const MAX_BUILDING_LEVELS = 6;

/**
 * Adaptation of upstream `MAX_UNIT_HEALTH`.
 * Role: Defines the maximum health value available to unit-like simulation objects.
 * Ledger: MAC-8579DB
 * Upstream: constants.h:42
 */
export const MAX_UNIT_HEALTH = 10000;

/**
 * Adaptation of upstream `REGISTRATION_COST`.
 * Role: Defines the cost charged by registration-related simulation behavior.
 * Ledger: MAC-9232B4
 * Upstream: constants.h:33
 */
export const REGISTRATION_COST = 1;

/**
 * Adaptation of upstream `MAX_ANGLE_TYPES`.
 * Role: Defines the number of discrete angle buckets used by rotation-aware simulation objects.
 * Ledger: MAC-FD108C
 * Upstream: constants.h:15
 */
export const MAX_ANGLE_TYPES = 8;

/**
 * Adaptation of upstream `TAN1`.
 * Role: Provides the upstream tangent-of-one-radian approximation used by simulation angle math.
 * Ledger: MAC-DAF679
 * Upstream: constants.h:26
 * Notes: Preserves the upstream approximation instead of recalculating it at runtime.
 */
export const TAN1 = 1.55740772;

/**
 * Adaptation of upstream `PI`.
 * Role: Provides the upstream pi approximation used by simulation angle math.
 * Ledger: MAC-7602DF
 * Upstream: constants.h:46
 * Notes: Preserves the upstream approximation instead of replacing it with `Math.PI`.
 */
export const PI = 3.14159;

/**
 * Adaptation of upstream `VEHICLE_MOVE_ANIM_SPEED`.
 * Role: Defines the movement animation speed factor for vehicle simulation.
 * Ledger: MAC-34B895
 * Upstream: constants.h:44
 */
export const VEHICLE_MOVE_ANIMATION_SPEED = 0.1;

/**
 * Port of upstream `building_type`.
 * Role: Identifies the building variant used by simulation objects and map data.
 * Ledger: ENU-6CCCD3
 * Upstream: constants.h:103-107
 */
export enum BuildingType {
  FortFront = 0,
  FortBack = 1,
  Radar = 2,
  Repair = 3,
  RobotFactory = 4,
  VehicleFactory = 5,
  BridgeVertical = 6,
  BridgeHorizontal = 7,
  Max = 8,
}

/**
 * Port of upstream `cannon_type`.
 * Role: Identifies the cannon variant used by simulation objects and map data.
 * Ledger: ENU-6A6D22
 * Upstream: constants.h:73-76
 */
export enum CannonType {
  Gatling = 0,
  Gun = 1,
  Howitzer = 2,
  MissileCannon = 3,
  Max = 4,
}

/**
 * Port of upstream `item_type`.
 * Role: Identifies collectible and map item slots used by simulation gameplay.
 * Ledger: ENU-523167
 * Upstream: constants.h:115-123
 * Notes: Preserves the upstream `MA11_ITEM` spelling as `Ma11` for numeric parity and traceability.
 */
export enum ItemType {
  Flag = 0,
  Rock = 1,
  Grenades = 2,
  Rockets = 3,
  Hut = 4,
  Map0 = 5,
  Map1 = 6,
  Map2 = 7,
  Map3 = 8,
  Map4 = 9,
  Map5 = 10,
  Map6 = 11,
  Map7 = 12,
  Map8 = 13,
  Map9 = 14,
  Map10 = 15,
  Ma11 = 16,
  Map12 = 17,
  Map13 = 18,
  Map14 = 19,
  Map15 = 20,
  Map16 = 21,
  Map17 = 22,
  Map18 = 23,
  Map19 = 24,
  Map20 = 25,
  Map21 = 26,
  Max = 27,
}

/**
 * Port of upstream `player_mode`.
 * Role: Identifies whether a participant is absent, a human player, a bot, a spectator, or the system tray client.
 * Ledger: ENU-786D8C
 * Upstream: constants.h:173-176
 */
export enum PlayerConnectionMode {
  Nobody = 0,
  Player = 1,
  Bot = 2,
  Spectator = 3,
  Tray = 4,
  Max = 5,
}

/**
 * Port of upstream `planet_type`.
 * Role: Identifies the terrain tileset and planet theme used by maps.
 * Ledger: ENU-E6E6A8
 * Upstream: constants.h:48-51
 */
export enum PlanetType {
  Desert = 0,
  Volcanic = 1,
  Arctic = 2,
  Jungle = 3,
  City = 4,
  Max = 5,
}

/**
 * Port of upstream `rotation_enum`.
 * Role: Identifies the eight cardinal and diagonal sprite rotations used by simulation objects.
 * Ledger: ENU-68E0FB
 * Upstream: constants.h:200-203
 */
export enum Rotation {
  R0 = 0,
  R45 = 1,
  R90 = 2,
  R135 = 3,
  R180 = 4,
  R225 = 5,
  R270 = 6,
  R315 = 7,
}

/**
 * Port of upstream `robot_type`.
 * Role: Identifies the robot variant used by simulation objects and map data.
 * Ledger: ENU-6E67A8
 * Upstream: constants.h:58-61
 */
export enum RobotType {
  Grunt = 0,
  Psycho = 1,
  Sniper = 2,
  Tough = 3,
  Pyro = 4,
  Laser = 5,
  Max = 6,
}

/**
 * Port of upstream `team_type`.
 * Role: Identifies the owning team for players, bots, objects, and packets.
 * Ledger: ENU-A1AE9F
 * Upstream: constants.h:133-163
 * Adaptation: Unifies the upstream `ONLY_TWO_TEAMS`, default, and `USE_TEAM_COLORS` preprocessor variants into one enum while preserving each variant's `MAX_TEAM_TYPES` sentinel.
 */
export enum TeamType {
  Null = 0,
  Red = 1,
  Blue = 2,
  Green = 3,
  Yellow = 4,
  Purple = 5,
  Teal = 6,
  White = 7,
  Black = 8,
}

/**
 * Adaptation of upstream `MAX_TEAM_TYPES` conditional enum sentinels.
 * Role: Records how many team values exist under each upstream `team_type` preprocessor branch.
 * Ledger: ENU-A1AE9F
 * Upstream: constants.h:133-163
 */
export const TEAM_TYPE_MAX_COUNTS = {
  onlyTwoTeams: 3,
  defaultTeams: 5,
  teamColors: 9,
} as const;

/**
 * Adaptation of upstream `USE_TEAM_COLORS`.
 * Role: Selects the extended colored-team branch of upstream team configuration.
 * Ledger: MAC-342124
 * Upstream: constants.h:36
 */
export const USE_TEAM_COLORS = true;

/**
 * Adaptation of upstream active `MAX_TEAM_TYPES`.
 * Role: Defines the active number of teams for the web simulation build.
 * Ledger: MAC-342124
 * Upstream: constants.h:36, constants.h:145-149
 */
export const ACTIVE_TEAM_TYPE_COUNT = TEAM_TYPE_MAX_COUNTS.teamColors;

/**
 * Port of upstream `vehicle_type`.
 * Role: Identifies the vehicle variant used by simulation objects and map data.
 * Ledger: ENU-E29FE5
 * Upstream: constants.h:88-91
 */
export enum VehicleType {
  Jeep = 0,
  Light = 1,
  Medium = 2,
  Heavy = 3,
  Apc = 4,
  MissileLauncher = 5,
  Crane = 6,
  Max = 7,
}
