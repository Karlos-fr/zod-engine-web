import { describe, expect, it } from "vitest";
import {
  CannonType,
  RobotType,
  VehicleType,
} from "../src/simulation/SimulationConstants";
import {
  GLOBAL_SETTINGS_READ_BUFFER_SIZE,
  RUN_PAST_RADIUS,
  ZSettings,
  ZUnitSettings,
  ZSETTINGS_HEADER_GUARD_PORTED,
} from "../src/data/ZSettingsData";

describe("z settings data", () => {
  it("ports the run past radius", () => {
    expect(RUN_PAST_RADIUS).toBe(1.3);
  });

  it("ports the global settings read buffer size", () => {
    expect(GLOBAL_SETTINGS_READ_BUFFER_SIZE).toBe(500);
  });

  it("ports ZUnit_Settings construction as zeroed unit settings", () => {
    expect(new ZUnitSettings()).toEqual({
      groupAmount: 0,
      moveSpeed: 0,
      attackRadius: 0,
      attackDamage: 0,
      attackDamageChance: 0,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0,
      attackSnipeChance: 0,
      health: 0,
      buildTime: 0,
      maxRunTime: 0,
    });
  });

  it("ports ZUnit_Settings::ReadEntry as unit setting assignment by variable name", () => {
    const settings = new ZUnitSettings();

    settings.readEntry("group_amount", "2");
    settings.readEntry("move_speed", "10");
    settings.readEntry("attack_radius", "80");
    settings.readEntry("attack_damage", "1.5");
    settings.readEntry("attack_damage_chance", "0.25");
    settings.readEntry("attack_damage_radius", "12");
    settings.readEntry("attack_missile_speed", "64");
    settings.readEntry("attack_speed", "2.75");
    settings.readEntry("attack_snipe_chance", "0.125");
    settings.readEntry("health", "9.5");
    settings.readEntry("build_time", "30");
    settings.readEntry("max_run_time", "4.5");

    expect(settings).toEqual({
      groupAmount: 2,
      moveSpeed: 10,
      attackRadius: 80,
      attackDamage: 1.5,
      attackDamageChance: 0.25,
      attackDamageRadius: 12,
      attackMissileSpeed: 64,
      attackSpeed: 2.75,
      attackSnipeChance: 0.125,
      health: 9.5,
      buildTime: 30,
      maxRunTime: 4.5,
    });
  });

  it("ports ZUnit_Settings::ReadEntry atoi and atof fallback behavior", () => {
    const settings = new ZUnitSettings();

    settings.readEntry("group_amount", "bad");
    settings.readEntry("attack_damage", "bad");
    settings.readEntry("unknown", "99");

    expect(settings.groupAmount).toBe(0);
    expect(settings.attackDamage).toBe(0);
    expect(settings.health).toBe(0);
  });

  it("ports ZUnit_Settings::SaveLine as persisted unit settings lines", () => {
    const settings = new ZUnitSettings();
    settings.groupAmount = 2;
    settings.moveSpeed = 10;
    settings.attackRadius = 80;
    settings.attackDamage = 1.5;
    settings.attackDamageChance = 0.25;
    settings.attackDamageRadius = 12;
    settings.attackMissileSpeed = 64;
    settings.attackSpeed = 2.75;
    settings.attackSnipeChance = 0.125;
    settings.health = 9.5;
    settings.buildTime = 30;
    settings.maxRunTime = 4.5;

    expect(settings.saveLine("robot.grunt")).toBe(
      [
        "",
        "robot.grunt.group_amount=2",
        "robot.grunt.move_speed=10",
        "robot.grunt.attack_radius=80",
        "robot.grunt.attack_damage=1.500000",
        "robot.grunt.attack_damage_chance=0.250000",
        "robot.grunt.attack_damage_radius=12",
        "robot.grunt.attack_missile_speed=64",
        "robot.grunt.attack_speed=2.750000",
        "robot.grunt.attack_snipe_chance=0.125000",
        "robot.grunt.health=9.500000",
        "robot.grunt.build_time=30",
        "robot.grunt.max_run_time=4.500000",
        "",
      ].join("\n"),
    );
  });

  it("ports ZUnit_Settings::CensorNegatives as lower and chance upper clamps", () => {
    const settings = new ZUnitSettings();
    settings.groupAmount = -1;
    settings.moveSpeed = -2;
    settings.attackRadius = -3;
    settings.attackDamage = -4;
    settings.attackDamageChance = 1.5;
    settings.attackDamageRadius = -5;
    settings.attackMissileSpeed = -6;
    settings.attackSpeed = -7;
    settings.attackSnipeChance = 2;
    settings.health = -8;
    settings.buildTime = -9;
    settings.maxRunTime = -10;

    settings.censorNegatives();

    expect(settings).toMatchObject({
      groupAmount: 0,
      moveSpeed: 0,
      attackRadius: 0,
      attackDamage: 0,
      attackDamageChance: 1,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0,
      attackSnipeChance: 1,
      health: 0,
      buildTime: 0,
      maxRunTime: -10,
    });
  });

  it("ports ZUnit_Settings::CensorNonWeaponUnit as attack settings reset", () => {
    const settings = new ZUnitSettings();
    settings.groupAmount = 3;
    settings.moveSpeed = 9;
    settings.attackRadius = 40;
    settings.attackDamage = 8;
    settings.attackDamageChance = 0.5;
    settings.attackDamageRadius = 12;
    settings.attackMissileSpeed = 60;
    settings.attackSpeed = 2;
    settings.attackSnipeChance = 0.25;
    settings.health = 30;

    settings.censorNonWeaponUnit();

    expect(settings).toMatchObject({
      groupAmount: 3,
      moveSpeed: 9,
      attackRadius: 0,
      attackDamage: 0,
      attackDamageChance: 0,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0,
      attackSnipeChance: 0,
      health: 30,
    });
  });

  it("ports ZUnit_Settings::CensorNonMissileUnit as missile settings reset", () => {
    const settings = new ZUnitSettings();
    settings.attackDamage = 8;
    settings.attackDamageChance = 0.5;
    settings.attackDamageRadius = 12;
    settings.attackMissileSpeed = 60;

    settings.censorNonMissileUnit();

    expect(settings).toMatchObject({
      attackDamage: 8,
      attackDamageChance: 0.5,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
    });
  });

  it("ports ZUnit_Settings::CensorMissileUnit as attack chance reset", () => {
    const settings = new ZUnitSettings();
    settings.attackDamage = 8;
    settings.attackDamageChance = 0.75;
    settings.attackMissileSpeed = 12;

    settings.censorMissileUnit();

    expect(settings.attackDamageChance).toBe(0);
    expect(settings.attackDamage).toBe(8);
    expect(settings.attackMissileSpeed).toBe(12);
  });

  it("ports ZSettings construction as zeroed settings tables", () => {
    const settings = new ZSettings();

    expect(settings.robotSettings).toHaveLength(RobotType.Max);
    expect(settings.vehicleSettings).toHaveLength(VehicleType.Max);
    expect(settings.cannonSettings).toHaveLength(CannonType.Max);
    expect(settings.robotSettings[0]).toBeInstanceOf(ZUnitSettings);
    expect(settings.robotSettings[0]).not.toBe(settings.robotSettings[1]);
    expect(settings).toMatchObject({
      fortBuildingHealth: 0,
      robotBuildingHealth: 0,
      vehicleBuildingHealth: 0,
      repairBuildingHealth: 0,
      radarBuildingHealth: 0,
      bridgeBuildingHealth: 0,
      rockItemHealth: 0,
      grenadesItemHealth: 0,
      rocketsItemHealth: 0,
      hutItemHealth: 0,
      mapItemHealth: 0,
      grenadeDamage: 0,
      grenadeDamageRadius: 0,
      grenadeMissileSpeed: 0,
      grenadeAttackSpeed: 0,
      mapItemTurrentDamage: 0,
      agroDistance: 0,
      autoGrabVehicleDistance: 0,
      autoGrabFlagDistance: 0,
      buildingAutoRepairTime: 0,
      buildingAutoRepairRandomAdditionalTime: 0,
      maxTurrentHorizontalDistance: 0,
      maxTurrentVerticalDistance: 0,
      grenadesPerBox: 0,
      partiallyDamagedUnitSpeed: 0,
      damagedUnitSpeed: 0,
      runUnitSpeed: 0,
      runRechargeRate: 0,
      hutAnimalMax: 0,
      hutAnimalMin: 0,
      hutAnimalRoamDistance: 0,
    });
  });

  it("ports ZSettings::SetDefaults as upstream gameplay defaults", () => {
    const settings = new ZSettings();

    settings.setDefaults();

    expect(settings.robotSettings[RobotType.Grunt]).toEqual({
      groupAmount: 3,
      moveSpeed: 14,
      attackRadius: 120,
      attackDamage: 0.0011046,
      attackDamageChance: 0.7,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0.5,
      attackSnipeChance: 0.3,
      health: 8.0 / 74,
      buildTime: 1 * 60 + 12,
      maxRunTime: (RUN_PAST_RADIUS * 120) / 14,
    });
    expect(settings.robotSettings[RobotType.Tough]).toMatchObject({
      groupAmount: 2,
      moveSpeed: 12,
      attackRadius: 120,
      attackDamage: 40.0 / 240,
      attackDamageRadius: 40,
      attackMissileSpeed: 150,
      attackSpeed: 1.442,
      health: 25.0 / 74,
      buildTime: 1 * 60 + 56,
      maxRunTime: (0.5 * RUN_PAST_RADIUS * 120) / 12,
    });
    expect(settings.vehicleSettings[VehicleType.Jeep]).toMatchObject({
      moveSpeed: 17,
      attackDamage: 0.0027067,
      attackDamageChance: 0.65,
      health: 13.0 / 74,
      buildTime: 1 * 60 + 21,
      maxRunTime: (RUN_PAST_RADIUS * 120) / 17,
    });
    expect(settings.vehicleSettings[VehicleType.MissileLauncher]).toMatchObject({
      moveSpeed: 6,
      attackRadius: 160,
      attackDamage: 62.0 / 74,
      attackDamageRadius: 80,
      attackMissileSpeed: 70,
      attackSpeed: 4.454,
      health: 50.0 / 74,
      buildTime: 6 * 60 + 13,
      maxRunTime: (0.5 * RUN_PAST_RADIUS * 160) / 6,
    });
    expect(settings.vehicleSettings[VehicleType.Crane]).toMatchObject({
      moveSpeed: 14,
      attackRadius: 0,
      health: 1.0,
      buildTime: 1 * 60 + 37,
      maxRunTime: 0,
    });
    expect(settings.cannonSettings[CannonType.Gatling]).toMatchObject({
      moveSpeed: 0,
      attackRadius: 120,
      attackDamage: 0.00397566,
      attackDamageChance: 0.65,
      health: 13.0 / 74,
      buildTime: 1 * 60 + 36,
      maxRunTime: 0,
    });
    expect(settings.cannonSettings[CannonType.Howitzer]).toMatchObject({
      attackRadius: 200,
      attackDamage: 100.0 / 240,
      attackDamageRadius: 40,
      attackMissileSpeed: 95,
      attackSpeed: 4.86,
      health: 25.0 / 74,
      buildTime: 2 * 60 + 59,
      maxRunTime: 0,
    });
    expect(settings).toMatchObject({
      fortBuildingHealth: 10000.0 / 240,
      robotBuildingHealth: 2000.0 / 240,
      vehicleBuildingHealth: 2000.0 / 240,
      repairBuildingHealth: 2000.0 / 240,
      radarBuildingHealth: 2000.0 / 240,
      bridgeBuildingHealth: 2000.0 / 240,
      rockItemHealth: 30.0 / 240,
      grenadesItemHealth: 40.0 / 240,
      rocketsItemHealth: 40.0 / 240,
      hutItemHealth: 40.0 / 240,
      mapItemHealth: 40.0 / 240,
      grenadeDamage: 40.0 / 240,
      grenadeDamageRadius: 30,
      grenadeMissileSpeed: 40,
      grenadeAttackSpeed: 2.254,
      mapItemTurrentDamage: 50.0 / 240,
      agroDistance: 40,
      autoGrabVehicleDistance: 220,
      autoGrabFlagDistance: 220,
      buildingAutoRepairTime: 10 * 60,
      buildingAutoRepairRandomAdditionalTime: 60,
      maxTurrentHorizontalDistance: 300,
      maxTurrentVerticalDistance: 300,
      grenadesPerBox: 20,
      partiallyDamagedUnitSpeed: 0.9,
      damagedUnitSpeed: 0.8,
      runUnitSpeed: 1.8,
      runRechargeRate: 0.3,
      hutAnimalMax: 5,
      hutAnimalMin: 3,
      hutAnimalRoamDistance: 7 * 16,
    });
  });

  it("ports ZSettings::CensorSettings as unit category and global range clamps", () => {
    const settings = new ZSettings();

    settings.robotSettings[RobotType.Grunt].attackDamageRadius = 15;
    settings.robotSettings[RobotType.Grunt].attackMissileSpeed = 20;
    settings.robotSettings[RobotType.Tough].attackDamageChance = 0.75;
    settings.vehicleSettings[VehicleType.Apc].attackDamageChance = 0.5;
    settings.vehicleSettings[VehicleType.Apc].attackMissileSpeed = 30;
    settings.vehicleSettings[VehicleType.Crane].attackDamageChance = 0.25;
    settings.vehicleSettings[VehicleType.Crane].attackDamage = 10;
    settings.cannonSettings[CannonType.Gatling].attackDamageRadius = 40;
    settings.cannonSettings[CannonType.Gatling].attackMissileSpeed = 50;
    settings.cannonSettings[CannonType.Gatling].moveSpeed = 8;
    settings.cannonSettings[CannonType.Gun].attackDamageChance = 0.9;
    settings.cannonSettings[CannonType.Gun].moveSpeed = -4;
    settings.robotSettings[RobotType.Psycho].health = -9;
    settings.robotSettings[RobotType.Sniper].attackDamageChance = 2;

    settings.agroDistance = -1;
    settings.autoGrabVehicleDistance = -2;
    settings.autoGrabFlagDistance = -3;
    settings.buildingAutoRepairTime = -4;
    settings.buildingAutoRepairRandomAdditionalTime = -5;
    settings.maxTurrentHorizontalDistance = -6;
    settings.maxTurrentVerticalDistance = -7;
    settings.grenadesPerBox = 120;
    settings.grenadeDamage = -8;
    settings.grenadeDamageRadius = -9;
    settings.mapItemTurrentDamage = -10;
    settings.partiallyDamagedUnitSpeed = -11;
    settings.damagedUnitSpeed = -12;
    settings.runUnitSpeed = -13;
    settings.runRechargeRate = 2;
    settings.hutAnimalMax = -14;
    settings.hutAnimalMin = -15;
    settings.hutAnimalRoamDistance = -16;

    settings.censorSettings();

    expect(settings.robotSettings[RobotType.Grunt]).toMatchObject({
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
    });
    expect(settings.robotSettings[RobotType.Tough].attackDamageChance).toBe(0);
    expect(settings.vehicleSettings[VehicleType.Apc]).toMatchObject({
      attackDamageChance: 0,
      attackMissileSpeed: 30,
    });
    expect(settings.vehicleSettings[VehicleType.Crane]).toMatchObject({
      attackDamage: 10,
      attackDamageChance: 0,
    });
    expect(settings.cannonSettings[CannonType.Gatling]).toMatchObject({
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      moveSpeed: 0,
    });
    expect(settings.cannonSettings[CannonType.Gun]).toMatchObject({
      attackDamageChance: 0,
      moveSpeed: 0,
    });
    expect(settings.robotSettings[RobotType.Psycho].health).toBe(0);
    expect(settings.robotSettings[RobotType.Sniper].attackDamageChance).toBe(1);
    expect(settings).toMatchObject({
      agroDistance: 0,
      autoGrabVehicleDistance: 0,
      autoGrabFlagDistance: 0,
      buildingAutoRepairTime: 0,
      buildingAutoRepairRandomAdditionalTime: 0,
      maxTurrentHorizontalDistance: 0,
      maxTurrentVerticalDistance: 0,
      grenadesPerBox: 99,
      grenadeDamage: 0,
      grenadeDamageRadius: 0,
      mapItemTurrentDamage: 0,
      partiallyDamagedUnitSpeed: 0,
      damagedUnitSpeed: 0,
      runUnitSpeed: 0,
      runRechargeRate: 1,
      hutAnimalMax: 0,
      hutAnimalMin: 0,
      hutAnimalRoamDistance: 0,
    });
  });

  it("ports ZSettings::SaveSettings as persisted settings text", () => {
    const settings = new ZSettings();

    settings.setDefaults();

    const serialized = settings.saveSettings();

    expect(
      serialized.startsWith(
        [
          "",
          "unit.grunt.group_amount=3",
          "unit.grunt.move_speed=14",
          "unit.grunt.attack_radius=120",
          "unit.grunt.attack_damage=0.001105",
          "unit.grunt.attack_damage_chance=0.700000",
          "unit.grunt.attack_damage_radius=0",
          "unit.grunt.attack_missile_speed=0",
          "unit.grunt.attack_speed=0.500000",
          "unit.grunt.attack_snipe_chance=0.300000",
          "unit.grunt.health=0.108108",
          "unit.grunt.build_time=72",
          "unit.grunt.max_run_time=11.142857",
          "",
        ].join("\n"),
      ),
    ).toBe(true);
    expect(serialized).toContain("\nunit.missile_launcher.group_amount=0\n");
    expect(serialized).toContain("\nunit.missile_cannon.group_amount=0\n");
    expect(serialized).toContain(
      [
        "",
        "building.fort.health=41.666667",
        "building.robot.health=8.333333",
        "building.vehicle.health=8.333333",
        "building.repair.health=8.333333",
        "building.radar.health=8.333333",
        "building.bridge.health=8.333333",
        "",
        "map_item.rock.health=0.125000",
        "map_item.grenades.health=0.166667",
        "map_item.rockets.health=0.166667",
        "map_item.hut.health=0.166667",
        "map_item.map_item.health=0.166667",
        "",
        "map_item.grenades.grenade_damage=0.166667",
        "map_item.grenades.grenade_damage_radius=30",
        "map_item.grenades.grenade_missile_speed=40",
        "map_item.grenades.grenade_attack_speed=2.254000",
        "map_item.map_item.map_item_turrent_damage=0.208333",
        "",
      ].join("\n"),
    );
    expect(
      serialized.endsWith(
        [
          "global.global.agro_distance=40",
          "global.global.auto_grab_vehicle_distance=220",
          "global.global.auto_grab_flag_distance=220",
          "global.global.building_auto_repair_time=600",
          "global.global.building_auto_repair_random_additional_time=60",
          "global.global.max_turrent_horizontal_distance=300",
          "global.global.max_turrent_vertical_distance=300",
          "global.global.grenades_per_box=20",
          "global.global.partially_damaged_unit_speed=0.900000",
          "global.global.damaged_unit_speed=0.800000",
          "global.global.run_unit_speed=1.800000",
          "global.global.run_recharge_rate=0.300000",
          "global.global.hut_animal_max=5",
          "global.global.hut_animal_min=3",
          "global.global.hut_animal_roam_distance=112",
          "",
        ].join("\n"),
      ),
    ).toBe(true);
  });

  it("adapts the zsettings header guard to module boundaries", async () => {
    const firstImport = await import("../src/data/ZSettingsData");
    const secondImport = await import("../src/data/ZSettingsData");

    expect(ZSETTINGS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZSETTINGS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZSETTINGS_HEADER_GUARD_PORTED,
    );
  });
});
