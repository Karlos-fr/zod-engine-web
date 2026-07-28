/**
 * Upstream: zsettings.cpp, zsettings.h
 */
import {
  CannonType,
  RobotType,
  VehicleType,
} from "../simulation/SimulationConstants";

/**
 * Port of upstream `run_past_radius`.
 * Role: Defines the radius for unit settings when allowing movement to run past a target point.
 * Upstream: zsettings.cpp:16
 */
export const RUN_PAST_RADIUS = 1.3;

/**
 * Port of upstream `buf_size`.
 * Role: Defines the fixed character buffer size for the global settings file parser when reading persisted unit and gameplay options.
 * Upstream: zsettings.cpp:404
 */
export const GLOBAL_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the global settings data module.
 * Role: Marks an upstream header boundary.
 * Upstream: zsettings.h:2
 */
export const ZSETTINGS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZUnit_Settings`.
 * Role: Stores per-unit movement, attack, health, build-time, and runtime settings.
 * Upstream: zsettings.h:14-52
 */
export class ZUnitSettings {
  groupAmount = 0;
  moveSpeed = 0;
  attackRadius = 0;
  attackDamage = 0;
  attackDamageChance = 0;
  attackDamageRadius = 0;
  attackMissileSpeed = 0;
  attackSpeed = 0;
  attackSnipeChance = 0;
  health = 0;
  buildTime = 0;
  maxRunTime = 0;

  /**
   * Port of upstream `ZUnit_Settings::SaveLine`.
   * Role: Serializes one unit settings block using the persisted settings file format.
   * Upstream: zsettings.cpp:624-639
   */
  saveLine(objName: string): string {
    return [
      "",
      `${objName}.group_amount=${this.groupAmount}`,
      `${objName}.move_speed=${this.moveSpeed}`,
      `${objName}.attack_radius=${this.attackRadius}`,
      `${objName}.attack_damage=${formatDoubleSetting(this.attackDamage)}`,
      `${objName}.attack_damage_chance=${formatDoubleSetting(this.attackDamageChance)}`,
      `${objName}.attack_damage_radius=${this.attackDamageRadius}`,
      `${objName}.attack_missile_speed=${this.attackMissileSpeed}`,
      `${objName}.attack_speed=${formatDoubleSetting(this.attackSpeed)}`,
      `${objName}.attack_snipe_chance=${formatDoubleSetting(this.attackSnipeChance)}`,
      `${objName}.health=${formatDoubleSetting(this.health)}`,
      `${objName}.build_time=${this.buildTime}`,
      `${objName}.max_run_time=${formatDoubleSetting(this.maxRunTime)}`,
    ].join("\n") + "\n";
  }

  /**
   * Port of upstream `ZUnit_Settings::ReadEntry`.
   * Role: Applies one persisted unit setting variable/value pair.
   * Upstream: zsettings.cpp:641-669
   */
  readEntry(variable: string, value: string): void {
    if (variable === "group_amount") {
      this.groupAmount = parseIntegerSetting(value);
    } else if (variable === "move_speed") {
      this.moveSpeed = parseIntegerSetting(value);
    } else if (variable === "attack_radius") {
      this.attackRadius = parseIntegerSetting(value);
    } else if (variable === "attack_damage") {
      this.attackDamage = parseFloatSetting(value);
    } else if (variable === "attack_damage_chance") {
      this.attackDamageChance = parseFloatSetting(value);
    } else if (variable === "attack_damage_radius") {
      this.attackDamageRadius = parseIntegerSetting(value);
    } else if (variable === "attack_missile_speed") {
      this.attackMissileSpeed = parseIntegerSetting(value);
    } else if (variable === "attack_speed") {
      this.attackSpeed = parseFloatSetting(value);
    } else if (variable === "attack_snipe_chance") {
      this.attackSnipeChance = parseFloatSetting(value);
    } else if (variable === "health") {
      this.health = parseFloatSetting(value);
    } else if (variable === "build_time") {
      this.buildTime = parseIntegerSetting(value);
    } else if (variable === "max_run_time") {
      this.maxRunTime = parseFloatSetting(value);
    }
  }

  /**
   * Port of upstream `ZUnit_Settings::CensorNegatives`.
   * Role: Clamps invalid negative settings and chance values outside their upper bound.
   * Upstream: zsettings.cpp:292-308
   */
  censorNegatives(): void {
    this.groupAmount = Math.max(0, this.groupAmount);
    this.moveSpeed = Math.max(0, this.moveSpeed);
    this.attackRadius = Math.max(0, this.attackRadius);
    this.attackDamage = Math.max(0, this.attackDamage);
    this.attackDamageChance = Math.max(0, this.attackDamageChance);
    this.attackDamageRadius = Math.max(0, this.attackDamageRadius);
    this.attackMissileSpeed = Math.max(0, this.attackMissileSpeed);
    this.attackSpeed = Math.max(0, this.attackSpeed);
    this.attackSnipeChance = Math.max(0, this.attackSnipeChance);
    this.health = Math.max(0, this.health);
    this.buildTime = Math.max(0, this.buildTime);

    this.attackDamageChance = Math.min(1.0, this.attackDamageChance);
    this.attackSnipeChance = Math.min(1.0, this.attackSnipeChance);
  }

  /**
   * Port of upstream `ZUnit_Settings::CensorNonWeaponUnit`.
   * Role: Removes weapon attack settings from non-weapon units.
   * Upstream: zsettings.cpp:321-330
   */
  censorNonWeaponUnit(): void {
    this.attackRadius = 0;
    this.attackDamage = 0;
    this.attackDamageChance = 0;
    this.attackDamageRadius = 0;
    this.attackMissileSpeed = 0;
    this.attackSpeed = 0;
    this.attackSnipeChance = 0;
  }

  /**
   * Port of upstream `ZUnit_Settings::CensorNonMissileUnit`.
   * Role: Removes missile-only attack settings from non-missile units.
   * Upstream: zsettings.cpp:310-314
   */
  censorNonMissileUnit(): void {
    this.attackDamageRadius = 0;
    this.attackMissileSpeed = 0;
  }

  /**
   * Port of upstream `ZUnit_Settings::CensorMissileUnit`.
   * Role: Removes direct-hit attack chance from missile units.
   * Upstream: zsettings.cpp:316-319
   */
  censorMissileUnit(): void {
    this.attackDamageChance = 0;
  }
}

/**
 * Port of upstream `ZSettings`.
 * Role: Stores global game settings and per-unit settings tables.
 * Upstream: zsettings.h:54-104
 */
export class ZSettings {
  robotSettings: ZUnitSettings[];
  vehicleSettings: ZUnitSettings[];
  cannonSettings: ZUnitSettings[];

  fortBuildingHealth = 0;
  robotBuildingHealth = 0;
  vehicleBuildingHealth = 0;
  repairBuildingHealth = 0;
  radarBuildingHealth = 0;
  bridgeBuildingHealth = 0;

  rockItemHealth = 0;
  grenadesItemHealth = 0;
  rocketsItemHealth = 0;
  hutItemHealth = 0;
  mapItemHealth = 0;

  grenadeDamage = 0;
  grenadeDamageRadius = 0;
  grenadeMissileSpeed = 0;
  grenadeAttackSpeed = 0;
  mapItemTurrentDamage = 0;

  agroDistance = 0;
  autoGrabVehicleDistance = 0;
  autoGrabFlagDistance = 0;
  buildingAutoRepairTime = 0;
  buildingAutoRepairRandomAdditionalTime = 0;
  maxTurrentHorizontalDistance = 0;
  maxTurrentVerticalDistance = 0;
  grenadesPerBox = 0;
  partiallyDamagedUnitSpeed = 0;
  damagedUnitSpeed = 0;
  runUnitSpeed = 0;
  runRechargeRate = 0;
  hutAnimalMax = 0;
  hutAnimalMin = 0;
  hutAnimalRoamDistance = 0;

  constructor() {
    this.robotSettings = createUnitSettingsTable(RobotType.Max);
    this.vehicleSettings = createUnitSettingsTable(VehicleType.Max);
    this.cannonSettings = createUnitSettingsTable(CannonType.Max);
  }

  /**
   * Port of upstream `ZSettings::SetDefaults`.
   * Role: Initializes gameplay balance defaults for units, buildings, items, and behavior tuning.
   * Upstream: zsettings.cpp:13-290
   */
  setDefaults(): void {
    setUnitDefaults(this.robotSettings[RobotType.Grunt], {
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
    setUnitDefaults(this.robotSettings[RobotType.Psycho], {
      groupAmount: 3,
      moveSpeed: 12,
      attackRadius: 120,
      attackDamage: 0.002617,
      attackDamageChance: 0.65,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0.1,
      attackSnipeChance: 0.3,
      health: 13.0 / 74,
      buildTime: 1 * 60 + 38,
      maxRunTime: (RUN_PAST_RADIUS * 120) / 12,
    });
    setUnitDefaults(this.robotSettings[RobotType.Sniper], {
      groupAmount: 3,
      moveSpeed: 14,
      attackRadius: 144,
      attackDamage: 0.007008,
      attackDamageChance: 0.8,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0.4,
      attackSnipeChance: 0.8,
      health: 13.0 / 74,
      buildTime: 2 * 60 + 28,
      maxRunTime: (RUN_PAST_RADIUS * 144) / 14,
    });
    setUnitDefaults(this.robotSettings[RobotType.Tough], {
      groupAmount: 2,
      moveSpeed: 12,
      attackRadius: 120,
      attackDamage: 40.0 / 240,
      attackDamageChance: 0,
      attackDamageRadius: 40,
      attackMissileSpeed: 150,
      attackSpeed: 1.442,
      attackSnipeChance: 0.0,
      health: 25.0 / 74,
      buildTime: 1 * 60 + 56,
      maxRunTime: (0.5 * RUN_PAST_RADIUS * 120) / 12,
    });
    setUnitDefaults(this.robotSettings[RobotType.Pyro], {
      groupAmount: 4,
      moveSpeed: 12,
      attackRadius: 120,
      attackDamage: 0.010486,
      attackDamageChance: 0.7,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0.1,
      attackSnipeChance: 0.0,
      health: 20.0 / 74,
      buildTime: 2 * 60 + 41,
      maxRunTime: (RUN_PAST_RADIUS * 120) / 12,
    });
    setUnitDefaults(this.robotSettings[RobotType.Laser], {
      groupAmount: 4,
      moveSpeed: 14,
      attackRadius: 136,
      attackDamage: 0.017799,
      attackDamageChance: 0.7,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0.4,
      attackSnipeChance: 0.6,
      health: 15.0 / 74,
      buildTime: 2 * 60 + 59,
      maxRunTime: (RUN_PAST_RADIUS * 136) / 14,
    });

    setUnitDefaults(this.vehicleSettings[VehicleType.Jeep], {
      groupAmount: 0,
      moveSpeed: 17,
      attackRadius: 120,
      attackDamage: 0.0027067,
      attackDamageChance: 0.65,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0.1,
      attackSnipeChance: 0.4,
      health: 13.0 / 74,
      buildTime: 1 * 60 + 21,
      maxRunTime: (RUN_PAST_RADIUS * 120) / 17,
    });
    setUnitDefaults(this.vehicleSettings[VehicleType.Light], {
      groupAmount: 0,
      moveSpeed: 14,
      attackRadius: 120,
      attackDamage: 50.0 / 240,
      attackDamageChance: 0,
      attackDamageRadius: 40,
      attackMissileSpeed: 225,
      attackSpeed: 1.128,
      attackSnipeChance: 0.0,
      health: 25.0 / 74,
      buildTime: 2 * 60 + 17,
      maxRunTime: (RUN_PAST_RADIUS * 120) / 14,
    });
    setUnitDefaults(this.vehicleSettings[VehicleType.Medium], {
      groupAmount: 0,
      moveSpeed: 12,
      attackRadius: 128,
      attackDamage: 80.0 / 240,
      attackDamageChance: 0,
      attackDamageRadius: 45,
      attackMissileSpeed: 160,
      attackSpeed: 2.336,
      attackSnipeChance: 0.0,
      health: 50.0 / 74,
      buildTime: 3 * 60 + 45,
      maxRunTime: (RUN_PAST_RADIUS * 128) / 12,
    });
    setUnitDefaults(this.vehicleSettings[VehicleType.Heavy], {
      groupAmount: 0,
      moveSpeed: 9,
      attackRadius: 144,
      attackDamage: 120.0 / 240,
      attackDamageChance: 0,
      attackDamageRadius: 50,
      attackMissileSpeed: 135,
      attackSpeed: 4.088,
      attackSnipeChance: 0.0,
      health: 62.0 / 74,
      buildTime: 5 * 60 + 9,
      maxRunTime: (0.7 * RUN_PAST_RADIUS * 144) / 9,
    });
    setUnitDefaults(this.vehicleSettings[VehicleType.Apc], {
      groupAmount: 0,
      moveSpeed: 14,
      attackRadius: 0,
      attackDamage: 0,
      attackDamageChance: 0,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0,
      attackSnipeChance: 0.0,
      health: 50.0 / 74,
      buildTime: 1 * 60 + 58,
      maxRunTime: (RUN_PAST_RADIUS * 120) / 14,
    });
    setUnitDefaults(this.vehicleSettings[VehicleType.MissileLauncher], {
      groupAmount: 0,
      moveSpeed: 6,
      attackRadius: 160,
      attackDamage: 62.0 / 74,
      attackDamageChance: 0,
      attackDamageRadius: 80,
      attackMissileSpeed: 70,
      attackSpeed: 4.454,
      attackSnipeChance: 0.0,
      health: 50.0 / 74,
      buildTime: 6 * 60 + 13,
      maxRunTime: (0.5 * RUN_PAST_RADIUS * 160) / 6,
    });
    setUnitDefaults(this.vehicleSettings[VehicleType.Crane], {
      groupAmount: 0,
      moveSpeed: 14,
      attackRadius: 0,
      attackDamage: 0,
      attackDamageChance: 0,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0,
      attackSnipeChance: 0.0,
      health: 1.0,
      buildTime: 1 * 60 + 37,
      maxRunTime: (0.7 * RUN_PAST_RADIUS * 0) / 14,
    });

    setUnitDefaults(this.cannonSettings[CannonType.Gatling], {
      groupAmount: 0,
      moveSpeed: 0,
      attackRadius: 120,
      attackDamage: 0.00397566,
      attackDamageChance: 0.65,
      attackDamageRadius: 0,
      attackMissileSpeed: 0,
      attackSpeed: 0.1,
      attackSnipeChance: 0.4,
      health: 13.0 / 74,
      buildTime: 1 * 60 + 36,
    });
    setUnitDefaults(this.cannonSettings[CannonType.Gun], {
      groupAmount: 0,
      moveSpeed: 0,
      attackRadius: 128,
      attackDamage: 75.0 / 240,
      attackDamageChance: 0,
      attackDamageRadius: 40,
      attackMissileSpeed: 225,
      attackSpeed: 2.254,
      attackSnipeChance: 0.0,
      health: 25.0 / 74,
      buildTime: 2 * 60 + 5,
    });
    setUnitDefaults(this.cannonSettings[CannonType.Howitzer], {
      groupAmount: 0,
      moveSpeed: 0,
      attackRadius: 200,
      attackDamage: 100.0 / 240,
      attackDamageChance: 0,
      attackDamageRadius: 40,
      attackMissileSpeed: 95,
      attackSpeed: 4.86,
      attackSnipeChance: 0.0,
      health: 25.0 / 74,
      buildTime: 2 * 60 + 59,
    });
    setUnitDefaults(this.cannonSettings[CannonType.MissileCannon], {
      groupAmount: 0,
      moveSpeed: 0,
      attackRadius: 144,
      attackDamage: 200.0 / 240,
      attackDamageChance: 0,
      attackDamageRadius: 50,
      attackMissileSpeed: 128,
      attackSpeed: 1.124,
      attackSnipeChance: 0.0,
      health: 25.0 / 74,
      buildTime: 3 * 60 + 2,
    });

    this.fortBuildingHealth = 10000.0 / 240;
    this.robotBuildingHealth = 2000.0 / 240;
    this.vehicleBuildingHealth = 2000.0 / 240;
    this.repairBuildingHealth = 2000.0 / 240;
    this.radarBuildingHealth = 2000.0 / 240;
    this.bridgeBuildingHealth = 2000.0 / 240;

    this.rockItemHealth = 30.0 / 240;
    this.grenadesItemHealth = 40.0 / 240;
    this.rocketsItemHealth = 40.0 / 240;
    this.hutItemHealth = 40.0 / 240;
    this.mapItemHealth = 40.0 / 240;

    this.grenadeDamage = 40.0 / 240;
    this.grenadeDamageRadius = 30;
    this.grenadeMissileSpeed = 40;
    this.grenadeAttackSpeed = 2.254;
    this.mapItemTurrentDamage = 50.0 / 240;

    this.agroDistance = 40;
    this.autoGrabVehicleDistance = 220;
    this.autoGrabFlagDistance = 220;
    this.buildingAutoRepairTime = 10 * 60;
    this.buildingAutoRepairRandomAdditionalTime = 60;
    this.maxTurrentHorizontalDistance = 300;
    this.maxTurrentVerticalDistance = 300;
    this.grenadesPerBox = 20;
    this.partiallyDamagedUnitSpeed = 0.9;
    this.damagedUnitSpeed = 0.8;
    this.runUnitSpeed = 1.8;
    this.runRechargeRate = 0.3;
    this.hutAnimalMax = 5;
    this.hutAnimalMin = 3;
    this.hutAnimalRoamDistance = 7 * 16;
  }

  /**
   * Port of upstream `ZSettings::CensorSettings`.
   * Role: Forces settings into ranges and categories expected by gameplay code.
   * Upstream: zsettings.cpp:332-390
   */
  censorSettings(): void {
    this.robotSettings[RobotType.Grunt].censorNonMissileUnit();
    this.robotSettings[RobotType.Psycho].censorNonMissileUnit();
    this.robotSettings[RobotType.Sniper].censorNonMissileUnit();
    this.robotSettings[RobotType.Pyro].censorNonMissileUnit();
    this.robotSettings[RobotType.Laser].censorNonMissileUnit();
    this.vehicleSettings[VehicleType.Jeep].censorNonMissileUnit();
    this.cannonSettings[CannonType.Gatling].censorNonMissileUnit();

    this.robotSettings[RobotType.Tough].censorMissileUnit();
    this.vehicleSettings[VehicleType.Light].censorMissileUnit();
    this.vehicleSettings[VehicleType.Medium].censorMissileUnit();
    this.vehicleSettings[VehicleType.Heavy].censorMissileUnit();
    this.vehicleSettings[VehicleType.MissileLauncher].censorMissileUnit();
    this.cannonSettings[CannonType.Gun].censorMissileUnit();
    this.cannonSettings[CannonType.Howitzer].censorMissileUnit();
    this.cannonSettings[CannonType.MissileCannon].censorMissileUnit();

    this.vehicleSettings[VehicleType.Apc].censorMissileUnit();
    this.vehicleSettings[VehicleType.Crane].censorMissileUnit();

    for (const cannonSetting of this.cannonSettings) {
      cannonSetting.moveSpeed = 0;
    }

    for (const robotSetting of this.robotSettings) {
      robotSetting.censorNegatives();
    }
    for (const vehicleSetting of this.vehicleSettings) {
      vehicleSetting.censorNegatives();
    }
    for (const cannonSetting of this.cannonSettings) {
      cannonSetting.censorNegatives();
    }

    this.agroDistance = Math.max(0, this.agroDistance);
    this.autoGrabVehicleDistance = Math.max(0, this.autoGrabVehicleDistance);
    this.autoGrabFlagDistance = Math.max(0, this.autoGrabFlagDistance);
    this.buildingAutoRepairTime = Math.max(0, this.buildingAutoRepairTime);
    this.buildingAutoRepairRandomAdditionalTime = Math.max(
      0,
      this.buildingAutoRepairRandomAdditionalTime,
    );
    this.maxTurrentHorizontalDistance = Math.max(
      0,
      this.maxTurrentHorizontalDistance,
    );
    this.maxTurrentVerticalDistance = Math.max(
      0,
      this.maxTurrentVerticalDistance,
    );
    this.grenadesPerBox = Math.min(99, Math.max(0, this.grenadesPerBox));

    this.grenadeDamage = Math.max(0, this.grenadeDamage);
    this.grenadeDamageRadius = Math.max(0, this.grenadeDamageRadius);
    this.mapItemTurrentDamage = Math.max(0, this.mapItemTurrentDamage);
    this.partiallyDamagedUnitSpeed = Math.max(
      0,
      this.partiallyDamagedUnitSpeed,
    );
    this.damagedUnitSpeed = Math.max(0, this.damagedUnitSpeed);
    this.runUnitSpeed = Math.max(0, this.runUnitSpeed);
    this.runRechargeRate = Math.min(1, Math.max(0, this.runRechargeRate));
    this.hutAnimalMax = Math.max(0, this.hutAnimalMax);
    this.hutAnimalMin = Math.max(0, this.hutAnimalMin);
    this.hutAnimalRoamDistance = Math.max(0, this.hutAnimalRoamDistance);
  }

  /**
   * Port of upstream `ZSettings::SaveSettings`.
   * Role: Serializes all unit, building, item, and global settings using the persisted settings file format.
   * Upstream: zsettings.cpp:554-622
   */
  saveSettings(): string {
    const output: string[] = [];
    const typeName = "unit";

    for (let i = 0; i < RobotType.Max; i += 1) {
      output.push(
        this.robotSettings[i].saveLine(`${typeName}.${ROBOT_TYPE_NAMES[i]}`),
      );
    }
    for (let i = 0; i < VehicleType.Max; i += 1) {
      output.push(
        this.vehicleSettings[i].saveLine(
          `${typeName}.${VEHICLE_TYPE_NAMES[i]}`,
        ),
      );
    }
    for (let i = 0; i < CannonType.Max; i += 1) {
      output.push(
        this.cannonSettings[i].saveLine(`${typeName}.${CANNON_TYPE_NAMES[i]}`),
      );
    }

    output.push("\n");
    output.push(
      `building.fort.health=${formatDoubleSetting(this.fortBuildingHealth)}\n`,
    );
    output.push(
      `building.robot.health=${formatDoubleSetting(
        this.robotBuildingHealth,
      )}\n`,
    );
    output.push(
      `building.vehicle.health=${formatDoubleSetting(
        this.vehicleBuildingHealth,
      )}\n`,
    );
    output.push(
      `building.repair.health=${formatDoubleSetting(
        this.repairBuildingHealth,
      )}\n`,
    );
    output.push(
      `building.radar.health=${formatDoubleSetting(this.radarBuildingHealth)}\n`,
    );
    output.push(
      `building.bridge.health=${formatDoubleSetting(
        this.bridgeBuildingHealth,
      )}\n`,
    );

    output.push("\n");
    output.push(
      `map_item.rock.health=${formatDoubleSetting(this.rockItemHealth)}\n`,
    );
    output.push(
      `map_item.grenades.health=${formatDoubleSetting(
        this.grenadesItemHealth,
      )}\n`,
    );
    output.push(
      `map_item.rockets.health=${formatDoubleSetting(
        this.rocketsItemHealth,
      )}\n`,
    );
    output.push(
      `map_item.hut.health=${formatDoubleSetting(this.hutItemHealth)}\n`,
    );
    output.push(
      `map_item.map_item.health=${formatDoubleSetting(this.mapItemHealth)}\n`,
    );

    output.push("\n");
    output.push(
      `map_item.grenades.grenade_damage=${formatDoubleSetting(
        this.grenadeDamage,
      )}\n`,
    );
    output.push(
      `map_item.grenades.grenade_damage_radius=${this.grenadeDamageRadius}\n`,
    );
    output.push(
      `map_item.grenades.grenade_missile_speed=${this.grenadeMissileSpeed}\n`,
    );
    output.push(
      `map_item.grenades.grenade_attack_speed=${formatDoubleSetting(
        this.grenadeAttackSpeed,
      )}\n`,
    );
    output.push(
      `map_item.map_item.map_item_turrent_damage=${formatDoubleSetting(
        this.mapItemTurrentDamage,
      )}\n`,
    );

    output.push("\n");
    output.push(`global.global.agro_distance=${this.agroDistance}\n`);
    output.push(
      `global.global.auto_grab_vehicle_distance=${this.autoGrabVehicleDistance}\n`,
    );
    output.push(
      `global.global.auto_grab_flag_distance=${this.autoGrabFlagDistance}\n`,
    );
    output.push(
      `global.global.building_auto_repair_time=${this.buildingAutoRepairTime}\n`,
    );
    output.push(
      `global.global.building_auto_repair_random_additional_time=${this.buildingAutoRepairRandomAdditionalTime}\n`,
    );
    output.push(
      `global.global.max_turrent_horizontal_distance=${this.maxTurrentHorizontalDistance}\n`,
    );
    output.push(
      `global.global.max_turrent_vertical_distance=${this.maxTurrentVerticalDistance}\n`,
    );
    output.push(`global.global.grenades_per_box=${this.grenadesPerBox}\n`);
    output.push(
      `global.global.partially_damaged_unit_speed=${formatDoubleSetting(
        this.partiallyDamagedUnitSpeed,
      )}\n`,
    );
    output.push(
      `global.global.damaged_unit_speed=${formatDoubleSetting(
        this.damagedUnitSpeed,
      )}\n`,
    );
    output.push(
      `global.global.run_unit_speed=${formatDoubleSetting(
        this.runUnitSpeed,
      )}\n`,
    );
    output.push(
      `global.global.run_recharge_rate=${formatDoubleSetting(
        this.runRechargeRate,
      )}\n`,
    );
    output.push(`global.global.hut_animal_max=${this.hutAnimalMax}\n`);
    output.push(`global.global.hut_animal_min=${this.hutAnimalMin}\n`);
    output.push(
      `global.global.hut_animal_roam_distance=${this.hutAnimalRoamDistance}\n`,
    );

    return output.join("");
  }
}

function parseIntegerSetting(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseFloatSetting(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDoubleSetting(value: number): string {
  return value.toFixed(6);
}

function createUnitSettingsTable(count: number): ZUnitSettings[] {
  return Array.from({ length: count }, () => new ZUnitSettings());
}

const ROBOT_TYPE_NAMES = [
  "grunt",
  "psycho",
  "sniper",
  "tough",
  "pyro",
  "laser",
] as const;

const VEHICLE_TYPE_NAMES = [
  "jeep",
  "light",
  "medium",
  "heavy",
  "apc",
  "missile_launcher",
  "crane",
] as const;

const CANNON_TYPE_NAMES = [
  "gatling",
  "gun",
  "howitzer",
  "missile_cannon",
] as const;

type UnitSettingsDefaults = {
  groupAmount: number;
  moveSpeed: number;
  attackRadius: number;
  attackDamage: number;
  attackDamageChance: number;
  attackDamageRadius: number;
  attackMissileSpeed: number;
  attackSpeed: number;
  attackSnipeChance: number;
  health: number;
  buildTime: number;
  maxRunTime?: number;
};

function setUnitDefaults(
  settings: ZUnitSettings,
  defaults: UnitSettingsDefaults,
): void {
  settings.groupAmount = defaults.groupAmount;
  settings.moveSpeed = defaults.moveSpeed;
  settings.attackRadius = defaults.attackRadius;
  settings.attackDamage = defaults.attackDamage;
  settings.attackDamageChance = defaults.attackDamageChance;
  settings.attackDamageRadius = defaults.attackDamageRadius;
  settings.attackMissileSpeed = defaults.attackMissileSpeed;
  settings.attackSpeed = defaults.attackSpeed;
  settings.attackSnipeChance = defaults.attackSnipeChance;
  settings.health = defaults.health;
  settings.buildTime = defaults.buildTime;
  settings.maxRunTime = defaults.maxRunTime ?? 0;
}
