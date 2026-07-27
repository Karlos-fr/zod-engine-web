import { describe, expect, it } from "vitest";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  BuildingType,
  CannonType,
  CONSTANTS_HEADER_GUARD_PORTED,
  ItemType,
  LIFE_AFTER_DEATH_SECONDS,
  MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET,
  MAX_BOT_BYPASS_SIZE,
  MAX_BUILDING_LEVELS,
  PI,
  PlanetType,
  PlayerConnectionMode,
  RobotType,
  Rotation,
  TEAM_TYPE_MAX_COUNTS,
  TeamType,
  USE_TEAM_COLORS,
  VEHICLE_MOVE_ANIMATION_SPEED,
  VehicleType,
} from "../src/simulation/SimulationConstants";

describe("simulation constants", () => {
  it("adapts the constants.h include guard to an ES module marker", () => {
    expect(CONSTANTS_HEADER_GUARD_PORTED).toBe(true);
  });

  it("adapts LIFE_AFTER_DEATH_TIME as seconds", () => {
    expect(LIFE_AFTER_DEATH_SECONDS).toBe(0);
  });

  it("adapts MAX_BOT_BYPASS_SIZE as a simulation limit", () => {
    expect(MAX_BOT_BYPASS_SIZE).toBe(512);
  });

  it("adapts MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET as a simulation limit", () => {
    expect(MAX_BOT_BYPASS_RANDOM_SIZE_OFFSET).toBe(64);
  });

  it("adapts MAX_BUILDING_LEVELS as a simulation limit", () => {
    expect(MAX_BUILDING_LEVELS).toBe(6);
  });

  it("adapts PI with the upstream approximation", () => {
    expect(PI).toBe(3.14159);
  });

  it("adapts VEHICLE_MOVE_ANIM_SPEED as an animation factor", () => {
    expect(VEHICLE_MOVE_ANIMATION_SPEED).toBe(0.1);
  });

  it("ports building_type numeric layout", () => {
    expect(BuildingType.FortFront).toBe(0);
    expect(BuildingType.FortBack).toBe(1);
    expect(BuildingType.Radar).toBe(2);
    expect(BuildingType.Repair).toBe(3);
    expect(BuildingType.RobotFactory).toBe(4);
    expect(BuildingType.VehicleFactory).toBe(5);
    expect(BuildingType.BridgeVertical).toBe(6);
    expect(BuildingType.BridgeHorizontal).toBe(7);
    expect(BuildingType.Max).toBe(8);
  });

  it("ports cannon_type numeric layout", () => {
    expect(CannonType.Gatling).toBe(0);
    expect(CannonType.Gun).toBe(1);
    expect(CannonType.Howitzer).toBe(2);
    expect(CannonType.MissileCannon).toBe(3);
    expect(CannonType.Max).toBe(4);
  });

  it("ports item_type base item values", () => {
    expect(ItemType.Flag).toBe(0);
    expect(ItemType.Rock).toBe(1);
    expect(ItemType.Grenades).toBe(2);
    expect(ItemType.Rockets).toBe(3);
    expect(ItemType.Hut).toBe(4);
  });

  it("ports item_type map item numeric layout", () => {
    expect(ItemType.Map0).toBe(5);
    expect(ItemType.Map10).toBe(15);
    expect(ItemType.Ma11).toBe(16);
    expect(ItemType.Map12).toBe(17);
    expect(ItemType.Map21).toBe(26);
    expect(ItemType.Max).toBe(27);
  });

  it("ports player_mode numeric layout", () => {
    expect(PlayerConnectionMode.Nobody).toBe(0);
    expect(PlayerConnectionMode.Player).toBe(1);
    expect(PlayerConnectionMode.Bot).toBe(2);
    expect(PlayerConnectionMode.Spectator).toBe(3);
    expect(PlayerConnectionMode.Tray).toBe(4);
    expect(PlayerConnectionMode.Max).toBe(5);
  });

  it("ports planet_type numeric layout", () => {
    expect(PlanetType.Desert).toBe(0);
    expect(PlanetType.Volcanic).toBe(1);
    expect(PlanetType.Arctic).toBe(2);
    expect(PlanetType.Jungle).toBe(3);
    expect(PlanetType.City).toBe(4);
    expect(PlanetType.Max).toBe(5);
  });

  it("ports rotation_enum numeric layout", () => {
    expect(Rotation.R0).toBe(0);
    expect(Rotation.R45).toBe(1);
    expect(Rotation.R90).toBe(2);
    expect(Rotation.R135).toBe(3);
    expect(Rotation.R180).toBe(4);
    expect(Rotation.R225).toBe(5);
    expect(Rotation.R270).toBe(6);
    expect(Rotation.R315).toBe(7);
  });

  it("ports robot_type numeric layout", () => {
    expect(RobotType.Grunt).toBe(0);
    expect(RobotType.Psycho).toBe(1);
    expect(RobotType.Sniper).toBe(2);
    expect(RobotType.Tough).toBe(3);
    expect(RobotType.Pyro).toBe(4);
    expect(RobotType.Laser).toBe(5);
    expect(RobotType.Max).toBe(6);
  });

  it("ports team_type common and default numeric layout", () => {
    expect(TeamType.Null).toBe(0);
    expect(TeamType.Red).toBe(1);
    expect(TeamType.Blue).toBe(2);
    expect(TeamType.Green).toBe(3);
    expect(TeamType.Yellow).toBe(4);
  });

  it("ports team_type conditional max sentinels", () => {
    expect(TEAM_TYPE_MAX_COUNTS.onlyTwoTeams).toBe(3);
    expect(TEAM_TYPE_MAX_COUNTS.defaultTeams).toBe(5);
    expect(TeamType.Purple).toBe(5);
    expect(TeamType.Teal).toBe(6);
    expect(TeamType.White).toBe(7);
    expect(TeamType.Black).toBe(8);
    expect(TEAM_TYPE_MAX_COUNTS.teamColors).toBe(9);
  });

  it("adapts USE_TEAM_COLORS as the active team configuration", () => {
    expect(USE_TEAM_COLORS).toBe(true);
    expect(ACTIVE_TEAM_TYPE_COUNT).toBe(TEAM_TYPE_MAX_COUNTS.teamColors);
  });

  it("ports vehicle_type numeric layout", () => {
    expect(VehicleType.Jeep).toBe(0);
    expect(VehicleType.Light).toBe(1);
    expect(VehicleType.Medium).toBe(2);
    expect(VehicleType.Heavy).toBe(3);
    expect(VehicleType.Apc).toBe(4);
    expect(VehicleType.MissileLauncher).toBe(5);
    expect(VehicleType.Crane).toBe(6);
    expect(VehicleType.Max).toBe(7);
  });
});
