import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  initGruntFireImages,
  initLaserFireImages,
  initPsychoFireImages,
  initPyroFireImages,
  initSniperFireImages,
  initToughFireImages,
  playLaserSelectedAnim,
  playGruntSelectedAnim,
  playPsychoSelectedAnim,
  playPyroSelectedAnim,
  playSniperSelectedAnim,
  playToughSelectedAnim,
  RobotEntity,
} from "../src/simulation/entities/RobotEntity";
import { RobotObjectMode } from "../src/simulation/entities/RobotEntity";
import { PortraitAnimationType } from "../src/simulation/PortraitAnimation";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  MAX_ANGLE_TYPES,
  TeamType,
} from "../src/simulation/SimulationConstants";

describe("robot entity", () => {
  it("ports ZRobot CanSetWaypoints as enabled waypoint orders", () => {
    const entity = new RobotEntity({
      id: "robot-waypoint",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetWaypoints()).toBe(true);
  });

  it("ports ZRobot GetGrenadeAmount from the robot inventory", () => {
    const entity = new RobotEntity({
      id: "robot-0",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.grenadeAmount = 4;

    expect(entity.getGrenadeAmount()).toBe(4);
  });

  it("ports ZRobot SetGrenadeAmount as bounded grenade inventory assignment", () => {
    const entity = new RobotEntity({
      id: "robot-set-grenades",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.setGrenadeAmount(99);
    expect(entity.grenadeAmount).toBe(99);

    entity.setGrenadeAmount(-1);
    expect(entity.grenadeAmount).toBe(0);

    entity.setGrenadeAmount(100);
    expect(entity.grenadeAmount).toBe(0);
  });

  it("ports ZRobot CanHaveGrenades as enabled grenade inventory", () => {
    const entity = new RobotEntity({
      id: "robot-3",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canHaveGrenades()).toBe(true);
  });

  it("ports ZRobot CanPickupGrenades when no grenades are carried", () => {
    const entity = new RobotEntity({
      id: "robot-1",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    expect(entity.canPickupGrenades()).toBe(true);
  });

  it("ports ZRobot CanPickupGrenades when grenades are already carried", () => {
    const entity = new RobotEntity({
      id: "robot-2",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.grenadeAmount = 2;

    expect(entity.canPickupGrenades()).toBe(false);
  });

  it("ports ZRobot CanThrowGrenades when the robot carries grenades", () => {
    const entity = new RobotEntity({
      id: "robot-4",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.grenadeAmount = 1;

    expect(entity.canThrowGrenades()).toBe(true);
  });

  it("ports ZRobot CanThrowGrenades through group leader inventory", () => {
    const entity = new RobotEntity({
      id: "robot-5",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const leader = new RobotEntity({
      id: "robot-leader",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    leader.grenadeAmount = 2;
    entity.setGroupLeader(leader);

    expect(entity.canThrowGrenades()).toBe(true);
  });

  it("ports robot object modes used by ZRobot attack state", () => {
    expect(RobotObjectMode.Walking).toBe(4);
    expect(RobotObjectMode.Standing).toBe(5);
    expect(RobotObjectMode.Attacking).toBe(10);
    expect(RobotObjectMode.PickupUpGrenades).toBe(11);
    expect(RobotObjectMode.PickupDownGrenades).toBe(12);
  });

  it("ports RGrunt Init as team-colored firing image initialization", () => {
    const loaded: Array<[number, number, number, string | { id: string } | null]> =
      [];
    const made: Array<[number, { id: string } | null]> = [];
    const baseSurfaces = Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
      Array.from({ length: 5 }, (_, frame) => ({
        id: `red-base-${rotation}-${frame}`,
      })),
    );
    const fireImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
        Array.from({ length: 5 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red
              ? baseSurfaces[rotation]?.[frame] ?? null
              : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push([team, rotation, frame, source]);
          },
        })),
      ),
    );

    initGruntFireImages({ fireImages }, (team, surface) => {
      made.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * MAX_ANGLE_TYPES * 5);
    expect(loaded.slice(0, 3)).toEqual([
      [TeamType.Red, 0, 0, "assets/units/robots/grunt/fire_red_r000_n00.png"],
      [TeamType.Red, 0, 1, "assets/units/robots/grunt/fire_red_r000_n01.png"],
      [TeamType.Red, 0, 2, "assets/units/robots/grunt/fire_red_r000_n02.png"],
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      2,
      3,
      { id: "team-2-red-base-2-3" },
    ]);
    expect(loaded).toContainEqual([
      TeamType.Black,
      7,
      4,
      { id: "team-8-red-base-7-4" },
    ]);
    expect(made).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * MAX_ANGLE_TYPES * 5);
    expect(made[0]).toEqual([TeamType.Blue, baseSurfaces[0]?.[0]]);
  });

  it("ports RLaser Init as team-colored firing image initialization", () => {
    const loaded: Array<[number, number, number, string | { id: string } | null]> =
      [];
    const baseSurfaces = Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
      Array.from({ length: 3 }, (_, frame) => ({
        id: `laser-red-base-${rotation}-${frame}`,
      })),
    );
    const fireImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
        Array.from({ length: 3 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red
              ? baseSurfaces[rotation]?.[frame] ?? null
              : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push([team, rotation, frame, source]);
          },
        })),
      ),
    );

    initLaserFireImages({ fireImages }, (team, surface) => ({
      id: `team-${team}-${surface?.id ?? "null"}`,
    }));

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * MAX_ANGLE_TYPES * 3);
    expect(loaded.slice(0, 3)).toEqual([
      [TeamType.Red, 0, 0, "assets/units/robots/laser/fire_red_r000_n00.png"],
      [TeamType.Red, 0, 1, "assets/units/robots/laser/fire_red_r000_n01.png"],
      [TeamType.Red, 0, 2, "assets/units/robots/laser/fire_red_r000_n02.png"],
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      7,
      2,
      { id: "team-2-laser-red-base-7-2" },
    ]);
  });

  it("ports RPsycho Init as team-colored firing image initialization", () => {
    const loaded: Array<[number, number, number, string | { id: string } | null]> =
      [];
    const baseSurfaces = Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
      Array.from({ length: 2 }, (_, frame) => ({
        id: `psycho-red-base-${rotation}-${frame}`,
      })),
    );
    const fireImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
        Array.from({ length: 2 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red
              ? baseSurfaces[rotation]?.[frame] ?? null
              : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push([team, rotation, frame, source]);
          },
        })),
      ),
    );

    initPsychoFireImages({ fireImages }, (team, surface) => ({
      id: `team-${team}-${surface?.id ?? "null"}`,
    }));

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * MAX_ANGLE_TYPES * 2);
    expect(loaded.slice(0, 2)).toEqual([
      [TeamType.Red, 0, 0, "assets/units/robots/psycho/fire_red_r000_n00.png"],
      [TeamType.Red, 0, 1, "assets/units/robots/psycho/fire_red_r000_n01.png"],
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      6,
      1,
      { id: "team-2-psycho-red-base-6-1" },
    ]);
  });

  it("ports RPyro Init as team-colored firing image initialization", () => {
    const loaded: Array<[number, number, number, string | { id: string } | null]> =
      [];
    const baseSurfaces = Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
      Array.from({ length: 3 }, (_, frame) => ({
        id: `pyro-red-base-${rotation}-${frame}`,
      })),
    );
    const fireImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
        Array.from({ length: 3 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red
              ? baseSurfaces[rotation]?.[frame] ?? null
              : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push([team, rotation, frame, source]);
          },
        })),
      ),
    );

    initPyroFireImages({ fireImages }, (team, surface) => ({
      id: `team-${team}-${surface?.id ?? "null"}`,
    }));

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * MAX_ANGLE_TYPES * 3);
    expect(loaded.slice(0, 3)).toEqual([
      [TeamType.Red, 0, 0, "assets/units/robots/pyro/fire_red_r000_n00.png"],
      [TeamType.Red, 0, 1, "assets/units/robots/pyro/fire_red_r000_n01.png"],
      [TeamType.Red, 0, 2, "assets/units/robots/pyro/fire_red_r000_n02.png"],
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      5,
      2,
      { id: "team-2-pyro-red-base-5-2" },
    ]);
  });

  it("ports RSniper Init as shared grunt firing image initialization", () => {
    const loaded: Array<[number, number, number, string | { id: string } | null]> =
      [];
    const baseSurfaces = Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
      Array.from({ length: 5 }, (_, frame) => ({
        id: `sniper-red-base-${rotation}-${frame}`,
      })),
    );
    const fireImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
        Array.from({ length: 5 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red
              ? baseSurfaces[rotation]?.[frame] ?? null
              : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push([team, rotation, frame, source]);
          },
        })),
      ),
    );

    initSniperFireImages({ fireImages }, (team, surface) => ({
      id: `team-${team}-${surface?.id ?? "null"}`,
    }));

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * MAX_ANGLE_TYPES * 5);
    expect(loaded.slice(0, 2)).toEqual([
      [TeamType.Red, 0, 0, "assets/units/robots/grunt/fire_red_r000_n00.png"],
      [TeamType.Red, 0, 1, "assets/units/robots/grunt/fire_red_r000_n01.png"],
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      4,
      4,
      { id: "team-2-sniper-red-base-4-4" },
    ]);
  });

  it("ports RTough Init as team-colored firing image initialization", () => {
    const loaded: Array<[number, number, number, string | { id: string } | null]> =
      [];
    const baseSurfaces = Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
      Array.from({ length: 3 }, (_, frame) => ({
        id: `tough-red-base-${rotation}-${frame}`,
      })),
    );
    const fireImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: MAX_ANGLE_TYPES }, (_, rotation) =>
        Array.from({ length: 3 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red
              ? baseSurfaces[rotation]?.[frame] ?? null
              : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push([team, rotation, frame, source]);
          },
        })),
      ),
    );

    initToughFireImages({ fireImages }, (team, surface) => ({
      id: `team-${team}-${surface?.id ?? "null"}`,
    }));

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * MAX_ANGLE_TYPES * 3);
    expect(loaded.slice(0, 3)).toEqual([
      [TeamType.Red, 0, 0, "assets/units/robots/tough/fire_red_r000_n00.png"],
      [TeamType.Red, 0, 1, "assets/units/robots/tough/fire_red_r000_n01.png"],
      [TeamType.Red, 0, 2, "assets/units/robots/tough/fire_red_r000_n02.png"],
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      3,
      2,
      { id: "team-2-tough-red-base-3-2" },
    ]);
  });

  it("ports RGrunt PlaySelectedAnim as grunt-specific portrait choices", () => {
    const startedAnimations: PortraitAnimationType[] = [];
    const portrait = {
      startAnim(animation: PortraitAnimationType): void {
        startedAnimations.push(animation);
      },
    };

    playGruntSelectedAnim(portrait, () => 0);
    for (const randomValue of [0, 1, 2, 3]) {
      const randomValues = [1, randomValue];
      playGruntSelectedAnim(portrait, () => randomValues.shift() ?? 0);
    }

    expect(startedAnimations).toEqual([
      PortraitAnimationType.GruntsReporting,
      PortraitAnimationType.YesSir,
      PortraitAnimationType.YesSir3,
      PortraitAnimationType.UnitReporting1,
      PortraitAnimationType.UnitReporting2,
    ]);
  });

  it("ports RLaser PlaySelectedAnim as laser-specific portrait choices", () => {
    const startedAnimations: PortraitAnimationType[] = [];
    const portrait = {
      startAnim(animation: PortraitAnimationType): void {
        startedAnimations.push(animation);
      },
    };

    playLaserSelectedAnim(portrait, () => 0);
    for (const randomValue of [0, 1, 2, 3]) {
      const randomValues = [1, randomValue];
      playLaserSelectedAnim(portrait, () => randomValues.shift() ?? 0);
    }

    expect(startedAnimations).toEqual([
      PortraitAnimationType.LasersReporting,
      PortraitAnimationType.YesSir,
      PortraitAnimationType.YesSir3,
      PortraitAnimationType.UnitReporting1,
      PortraitAnimationType.UnitReporting2,
    ]);
  });

  it("ports RPsycho PlaySelectedAnim as psycho-specific portrait choices", () => {
    const startedAnimations: PortraitAnimationType[] = [];
    const portrait = {
      startAnim(animation: PortraitAnimationType): void {
        startedAnimations.push(animation);
      },
    };

    playPsychoSelectedAnim(portrait, () => 0);
    for (const randomValue of [0, 1, 2, 3]) {
      const randomValues = [1, randomValue];
      playPsychoSelectedAnim(portrait, () => randomValues.shift() ?? 0);
    }

    expect(startedAnimations).toEqual([
      PortraitAnimationType.PsychosReporting,
      PortraitAnimationType.YesSir,
      PortraitAnimationType.YesSir3,
      PortraitAnimationType.UnitReporting1,
      PortraitAnimationType.UnitReporting2,
    ]);
  });

  it("ports RPyro PlaySelectedAnim as pyro-specific portrait choices", () => {
    const startedAnimations: PortraitAnimationType[] = [];
    const portrait = {
      startAnim(animation: PortraitAnimationType): void {
        startedAnimations.push(animation);
      },
    };

    playPyroSelectedAnim(portrait, () => 0);
    for (const randomValue of [0, 1, 2, 3]) {
      const randomValues = [1, randomValue];
      playPyroSelectedAnim(portrait, () => randomValues.shift() ?? 0);
    }

    expect(startedAnimations).toEqual([
      PortraitAnimationType.PyrosReporting,
      PortraitAnimationType.YesSir,
      PortraitAnimationType.YesSir3,
      PortraitAnimationType.UnitReporting1,
      PortraitAnimationType.UnitReporting2,
    ]);
  });

  it("ports RSniper PlaySelectedAnim as sniper-specific portrait choices", () => {
    const startedAnimations: PortraitAnimationType[] = [];
    const portrait = {
      startAnim(animation: PortraitAnimationType): void {
        startedAnimations.push(animation);
      },
    };

    playSniperSelectedAnim(portrait, () => 0);
    for (const randomValue of [0, 1, 2, 3]) {
      const randomValues = [1, randomValue];
      playSniperSelectedAnim(portrait, () => randomValues.shift() ?? 0);
    }

    expect(startedAnimations).toEqual([
      PortraitAnimationType.SnipersReporting,
      PortraitAnimationType.YesSir,
      PortraitAnimationType.YesSir3,
      PortraitAnimationType.UnitReporting1,
      PortraitAnimationType.UnitReporting2,
    ]);
  });

  it("ports RTough PlaySelectedAnim as tough-specific portrait choices", () => {
    const startedAnimations: PortraitAnimationType[] = [];
    const portrait = {
      startAnim(animation: PortraitAnimationType): void {
        startedAnimations.push(animation);
      },
    };

    playToughSelectedAnim(portrait, () => 0);
    for (const randomValue of [0, 1, 2, 3]) {
      const randomValues = [1, randomValue];
      playToughSelectedAnim(portrait, () => randomValues.shift() ?? 0);
    }

    expect(startedAnimations).toEqual([
      PortraitAnimationType.ToughsReporting,
      PortraitAnimationType.YesSir,
      PortraitAnimationType.YesSir3,
      PortraitAnimationType.UnitReporting1,
      PortraitAnimationType.UnitReporting2,
    ]);
  });

  it("ports ZRobot DoPickupGrenadeAnim guard exits", () => {
    class NoGrenadeRobotEntity extends RobotEntity {
      override canHaveGrenades(): boolean {
        return false;
      }
    }
    const noGrenadeEntity = new NoGrenadeRobotEntity({
      id: "robot-no-grenades",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    noGrenadeEntity.actionIndex = 5;

    noGrenadeEntity.doPickupGrenadeAnim();

    expect(noGrenadeEntity.mode).toBe(RobotObjectMode.Standing);
    expect(noGrenadeEntity.actionIndex).toBe(5);

    const attackingEntity = new RobotEntity({
      id: "robot-attacking",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    attackingEntity.mode = RobotObjectMode.Attacking;
    attackingEntity.actionIndex = 5;

    attackingEntity.doPickupGrenadeAnim();

    expect(attackingEntity.mode).toBe(RobotObjectMode.Attacking);
    expect(attackingEntity.actionIndex).toBe(5);
  });

  it("ports ZRobot DoPickupGrenadeAnim as directional pickup animation start", () => {
    const upEntity = new RobotEntity({
      id: "robot-pickup-up",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    upEntity.direction = 3;
    upEntity.actionIndex = 5;

    upEntity.doPickupGrenadeAnim();

    expect(upEntity.mode).toBe(RobotObjectMode.PickupUpGrenades);
    expect(upEntity.actionIndex).toBe(0);

    const downEntity = new RobotEntity({
      id: "robot-pickup-down",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    downEntity.direction = 4;
    downEntity.actionIndex = 5;

    downEntity.doPickupGrenadeAnim();

    expect(downEntity.mode).toBe(RobotObjectMode.PickupDownGrenades);
    expect(downEntity.actionIndex).toBe(0);
  });

  it("ports ZRobot RecalcDirection as walking direction refresh", () => {
    const entity = new RobotEntity({
      id: "robot-recalc-direction",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.mode = RobotObjectMode.Standing;
    entity.actionIndex = 4;
    entity.direction = 6;
    entity.locationDeltaX = 1;
    entity.locationDeltaY = 0;

    entity.recalcDirection();

    expect(entity.mode).toBe(RobotObjectMode.Walking);
    expect(entity.actionIndex).toBe(0);
    expect(entity.direction).toBe(0);
  });

  it("ports ZRobot RecalcDirection as walking continuation without animation reset", () => {
    const entity = new RobotEntity({
      id: "robot-recalc-direction-walking",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.mode = RobotObjectMode.Walking;
    entity.actionIndex = 4;
    entity.direction = 6;
    entity.locationDeltaX = 0;
    entity.locationDeltaY = 1;

    entity.recalcDirection();

    expect(entity.mode).toBe(RobotObjectMode.Walking);
    expect(entity.actionIndex).toBe(4);
    expect(entity.direction).toBe(6);
  });

  it("ports ZRobot RecalcDirection zero-vector handling as standing mode", () => {
    const entity = new RobotEntity({
      id: "robot-recalc-direction-standing",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    entity.mode = RobotObjectMode.Attacking;
    entity.actionIndex = 4;
    entity.direction = 2;
    entity.locationDeltaX = 0;
    entity.locationDeltaY = 0;

    entity.recalcDirection();

    expect(entity.mode).toBe(RobotObjectMode.Standing);
    expect(entity.actionIndex).toBe(4);
    expect(entity.direction).toBe(2);
  });

  it("ports ZRobot SetAttackObject as attack mode and timing update", () => {
    const entity = new RobotEntity({
      id: "robot-attacker",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target",
      kind: "vehicle",
      position: { x: 10, y: 0 },
    });
    entity.actionIndex = 5;

    entity.setAttackObject(target, 12);

    expect(entity.getAttackObject()).toBe(target);
    expect(entity.mode).toBe(RobotObjectMode.Attacking);
    expect(entity.actionIndex).toBe(0);
    expect(entity.nextAttackTime).toBeCloseTo(12.1);
  });

  it("ports ZRobot SetAttackObject null target as conditional standing fallback", () => {
    const entity = new RobotEntity({
      id: "robot-clear-attack",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.mode = RobotObjectMode.Attacking;
    entity.setAttackObject(null);
    expect(entity.mode).toBe(RobotObjectMode.Standing);

    entity.mode = RobotObjectMode.Walking;
    entity.setAttackObject(null);
    expect(entity.mode).toBe(RobotObjectMode.Walking);

    entity.mode = RobotObjectMode.Standing;
    entity.setAttackObject(null);
    expect(entity.mode).toBe(RobotObjectMode.Standing);
  });
});
