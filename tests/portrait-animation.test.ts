import { describe, expect, it } from "vitest";
import {
  addPortraitAnimationFrame,
  clearPortraitRobotId,
  getPortraitBlitInfo,
  getPortraitRefId,
  initPortrait,
  isPortraitDoingAnimation,
  PORTRAIT_BASE_HEIGHT_PIXELS,
  PORTRAIT_BASE_WIDTH_PIXELS,
  PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS,
  PORTRAIT_MAX_EYES,
  PORTRAIT_MAX_HANDS,
  PORTRAIT_MAX_MOUTHS,
  PortraitAnimation,
  PortraitAnimationType,
  PortraitFrame,
  PortraitLookDirection,
  PortraitUnitGraphics,
  type PortraitObjectReference,
  setPortraitCoordinates,
  setPortraitDoRandomAnims,
  setPortraitInVehicle,
  setPortraitObject,
  setPortraitOverMap,
  setPortraitRefId,
  setPortraitRobotId,
  setPortraitTeam,
  setPortraitTerrainType,
  startPortraitAnimation,
  startPortraitRandomAnimation,
  ZPORTRAIT_HEADER_GUARD_PORTED,
} from "../src/simulation/PortraitAnimation";
import type {
  PortraitCurrentAnimationState,
  PortraitCoordinateState,
  PortraitInVehicleState,
  PortraitOverMapState,
  PortraitRandomAnimationState,
  PortraitRobotClearState,
  PortraitRefState,
  PortraitRobotIdState,
  PortraitSetObjectState,
  PortraitStartAnimationState,
  PortraitStartRandomAnimationState,
  PortraitTeamState,
  PortraitTerrainState,
} from "../src/simulation/PortraitAnimation";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  CannonType,
  PlanetType,
  RobotType,
  TeamType,
  VehicleType,
} from "../src/simulation/SimulationConstants";
import { MapObjectType } from "../src/world/MapFormat";

describe("portrait animation", () => {
  it("adapts the zportrait.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/PortraitAnimation");
    const secondImport = await import("../src/simulation/PortraitAnimation");

    expect(ZPORTRAIT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZPORTRAIT_HEADER_GUARD_PORTED).toBe(
      firstImport.ZPORTRAIT_HEADER_GUARD_PORTED,
    );
  });

  it("ports the portrait ZObject forward declaration as an entity reference", () => {
    const entity = new GameEntity({
      id: "portrait-object",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const acceptsPortraitObject = (object: PortraitObjectReference): string => object.id;

    expect(acceptsPortraitObject(entity)).toBe("portrait-object");
  });

  it("adapts the portrait base dimensions", () => {
    expect(PORTRAIT_BASE_WIDTH_PIXELS).toBe(86);
    expect(PORTRAIT_BASE_HEIGHT_PIXELS).toBe(74);
  });

  it("adapts the portrait facial sprite limits", () => {
    expect(PORTRAIT_MAX_EYES).toBe(11);
    expect(PORTRAIT_MAX_HANDS).toBe(9);
    expect(PORTRAIT_MAX_MOUTHS).toBe(16);
  });

  it("ports portrait look directions", () => {
    expect(PortraitLookDirection.Straight).toBe(0);
    expect(PortraitLookDirection.Right).toBe(1);
    expect(PortraitLookDirection.Left).toBe(2);
    expect(PortraitLookDirection.MaxLookDirections).toBe(3);
  });

  it("ports portrait animation identifiers", () => {
    expect(PortraitAnimationType.YesSir).toBe(0);
    expect(PortraitAnimationType.WereOnOurWay).toBe(10);
    expect(PortraitAnimationType.TargetDestroyed).toBe(30);
    expect(PortraitAnimationType.LookRight).toBe(43);
    expect(PortraitAnimationType.GrenadesCollected).toBe(62);
    expect(PortraitAnimationType.EndL3).toBe(68);
    expect(PortraitAnimationType.MaxPortraitAnims).toBe(69);
  });

  it("ports portrait frame defaults", () => {
    expect(new PortraitFrame()).toMatchObject({
      lookDirection: PortraitLookDirection.Straight,
      mouth: 0,
      eyes: 0,
      hand: 0,
      handX: 0,
      handY: 0,
      handDoRender: false,
      headX: 4,
      headY: 2,
      duration: 0,
    });
  });

  it("ports the portrait frame duration multiplier", () => {
    expect(PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS).toBe(0.015);
  });

  it("ports ZPortrait_Anim::AddFrame as shifted frame insertion and duration refresh", () => {
    const state = { frameList: [] as PortraitFrame[], totalDuration: 0 };
    const firstFrame = new PortraitFrame();
    firstFrame.handX = 8;
    firstFrame.handY = 9;
    firstFrame.duration = 1.5;
    const secondFrame = new PortraitFrame();
    secondFrame.handX = 14;
    secondFrame.handY = 15;
    secondFrame.duration = 2.25;

    addPortraitAnimationFrame(state, firstFrame);
    firstFrame.duration = 99;
    addPortraitAnimationFrame(state, secondFrame);

    expect(firstFrame.handX).toBe(4);
    expect(firstFrame.handY).toBe(5);
    expect(secondFrame.handX).toBe(10);
    expect(secondFrame.handY).toBe(11);
    expect(state.frameList).toHaveLength(2);
    expect(state.frameList[0]).toMatchObject({
      handX: 4,
      handY: 5,
      duration: 1.5,
    });
    expect(state.frameList[1]).toMatchObject({
      handX: 10,
      handY: 11,
      duration: 2.25,
    });
    expect(state.totalDuration).toBe(3.75);
  });

  it("ports ZPortrait_Anim default construction and AddFrame forwarding", () => {
    const animation = new PortraitAnimation();
    const frame = new PortraitFrame();
    frame.handX = 6;
    frame.handY = 7;
    frame.duration = 0.5;

    animation.addFrame(frame);

    expect(animation.frameList).toHaveLength(1);
    expect(animation.frameList[0]).toMatchObject({
      handX: 2,
      handY: 3,
      duration: 0.5,
    });
    expect(animation.totalDuration).toBe(0.5);
  });

  it("ports ZPortrait_Anim assignment as an explicit independent copy", () => {
    const source = new PortraitAnimation();
    const frame = new PortraitFrame();
    frame.duration = 1.25;
    source.addFrame(frame);
    const target = new PortraitAnimation();

    expect(target.copyFrom(source)).toBe(target);
    source.frameList[0]!.duration = 99;

    expect(target.frameList).toHaveLength(1);
    expect(target.frameList[0]).not.toBe(source.frameList[0]);
    expect(target.frameList[0]).toMatchObject({ duration: 1.25 });
    expect(target.totalDuration).toBe(1.25);
    expect(target.copyFrom(target)).toBe(target);
  });

  it("ports ZPortrait_Unit_Graphics as initialized portrait surface storage", () => {
    const graphics = new PortraitUnitGraphics<string>();

    expect(graphics.head).toEqual([null, null, null]);
    expect(graphics.eyes).toHaveLength(PORTRAIT_MAX_EYES);
    expect(graphics.hand).toHaveLength(PORTRAIT_MAX_HANDS);
    expect(graphics.mouth).toHaveLength(PORTRAIT_MAX_MOUTHS);
    expect(graphics.eyes.every((surface) => surface === null)).toBe(true);
    expect(graphics.hand.every((surface) => surface === null)).toBe(true);
    expect(graphics.mouth.every((surface) => surface === null)).toBe(true);
    expect(graphics.shoulders).toBeNull();
  });

  it("ports ZPortrait Init as backdrop, unit graphics, and frame setup initialization", () => {
    const vehicleLoads: string[] = [];
    const backdropLoads = Array.from({ length: PlanetType.Max }, () => [] as string[]);
    const setupCalls: boolean[] = [];
    type TestGraphics = {
      id: string;
      loads: Array<{ robotType: number; team: number; baseId: string }>;
      load(robotType: number, team: number, baseGraphics: TestGraphics): void;
    };
    const unitGraphics: TestGraphics[][] = Array.from(
      { length: RobotType.Max },
      (_, robot) =>
        Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) => ({
          id: `${robot}-${team}`,
          loads: [] as Array<{ robotType: number; team: number; baseId: string }>,
          load(robotType: number, team: number, baseGraphics: TestGraphics) {
            this.loads.push({ robotType, team, baseId: baseGraphics.id });
          },
        })),
    );
    const state = {
      backdropVehicle: {
        loadBaseImage: (source: string) => vehicleLoads.push(source),
      },
      backdrop: backdropLoads.map((loads) => ({
        loadBaseImage: (source: string) => loads.push(source),
      })),
      unitGraphics,
      finishedInit: false,
      setupFrames() {
        setupCalls.push(this.finishedInit);
      },
    };

    initPortrait(state);

    expect(vehicleLoads).toEqual(["assets/other/hud/backdrop_vehicle.bmp"]);
    expect(backdropLoads).toEqual([
      ["assets/other/hud/backdrop_desert.bmp"],
      ["assets/other/hud/backdrop_volcanic.bmp"],
      ["assets/other/hud/backdrop_arctic.bmp"],
      ["assets/other/hud/backdrop_jungle.bmp"],
      ["assets/other/hud/backdrop_city.bmp"],
    ]);
    expect(
      unitGraphics.flatMap((robotGraphics) =>
        robotGraphics.flatMap((graphics) => graphics.loads),
      ),
    ).toHaveLength(RobotType.Max * ACTIVE_TEAM_TYPE_COUNT);
    expect(unitGraphics[RobotType.Grunt]![TeamType.Null]!.loads).toEqual([
      { robotType: RobotType.Grunt, team: TeamType.Null, baseId: "0-1" },
    ]);
    expect(unitGraphics[RobotType.Laser]![TeamType.Black]!.loads).toEqual([
      { robotType: RobotType.Laser, team: TeamType.Black, baseId: "5-1" },
    ]);
    expect(setupCalls).toEqual([false]);
    expect(state.finishedInit).toBe(true);
  });

  it("ports ZPortrait GetBlitInfo as fixed portrait viewport clipping", () => {
    expect(getPortraitBlitInfo(null, 4, 2)).toBeNull();
    expect(getPortraitBlitInfo({ width: 8, height: 8 }, 90, 2)).toBeNull();
    expect(getPortraitBlitInfo({ width: 8, height: 8 }, 4, 80)).toBeNull();
    expect(getPortraitBlitInfo({ width: 12, height: 10 }, 4, 2)).toEqual({
      sourceX: 0,
      sourceY: 0,
      width: 12,
      height: 10,
      destinationX: 4,
      destinationY: 2,
    });
    expect(getPortraitBlitInfo({ width: 16, height: 12 }, -6, -3)).toEqual({
      sourceX: 6,
      sourceY: 3,
      width: 10,
      height: 9,
      destinationX: 0,
      destinationY: 0,
    });
    expect(getPortraitBlitInfo({ width: 20, height: 12 }, 80, 70)).toEqual({
      sourceX: 0,
      sourceY: 0,
      width: 6,
      height: 4,
      destinationX: 80,
      destinationY: 70,
    });
  });

  it("ports SetRefID as active portrait reference assignment", () => {
    const state: PortraitRefState = { refId: -1 };

    setPortraitRefId(state, 42);

    expect(state.refId).toBe(42);
  });

  it("ports GetRefID as active portrait reference read", () => {
    const state: PortraitRefState = { refId: 42 };

    expect(getPortraitRefId(state)).toBe(42);
  });

  it("ports the random animation setter", () => {
    const state: PortraitRandomAnimationState = { doRandomAnims: false };

    setPortraitDoRandomAnims(state, true);
    expect(state.doRandomAnims).toBe(true);

    setPortraitDoRandomAnims(state, false);
    expect(state.doRandomAnims).toBe(false);
  });

  it("ports ZPortrait SetOverMap as over-map state assignment", () => {
    const state: PortraitOverMapState = { overMap: false };

    setPortraitOverMap(state, true);
    expect(state.overMap).toBe(true);

    setPortraitOverMap(state, false);
    expect(state.overMap).toBe(false);
  });

  it("ports ZPortrait SetCords as render-origin assignment", () => {
    const state: PortraitCoordinateState = { x: 0, y: 0 };

    setPortraitCoordinates(state, 24, 48);

    expect(state).toEqual({ x: 24, y: 48 });
  });

  it("ports ZPortrait SetTerrainType as terrain palette assignment", () => {
    const state: PortraitTerrainState = { terrain: PlanetType.Desert };

    setPortraitTerrainType(state, PlanetType.Arctic);

    expect(state.terrain).toBe(PlanetType.Arctic);
  });

  it("ports ZPortrait SetInVehicle as vehicle occupancy assignment", () => {
    const state: PortraitInVehicleState = { inVehicle: false };

    setPortraitInVehicle(state, true);

    expect(state.inVehicle).toBe(true);
  });

  it("ports ZPortrait SetTeam as team palette assignment", () => {
    const state: PortraitTeamState = { team: TeamType.Null };

    setPortraitTeam(state, TeamType.Blue);

    expect(state.team).toBe(TeamType.Blue);
  });

  it("ports ZPortrait SetRobotID as robot id assignment with render invalidation", () => {
    const state: PortraitRobotIdState = {
      oid: RobotType.Grunt,
      doRender: false,
    };

    setPortraitRobotId(state, RobotType.Sniper);
    expect(state).toEqual({
      oid: RobotType.Sniper,
      doRender: true,
    });

    state.doRender = false;
    setPortraitRobotId(state, -1);
    expect(state).toEqual({
      oid: RobotType.Grunt,
      doRender: true,
    });

    state.doRender = false;
    setPortraitRobotId(state, RobotType.Max);
    expect(state).toEqual({
      oid: RobotType.Grunt,
      doRender: true,
    });
  });

  it("ports ZPortrait DoingAnim as active animation check", () => {
    const state: PortraitCurrentAnimationState = { currentAnimation: -1 };

    expect(isPortraitDoingAnimation(state)).toBe(false);

    state.currentAnimation = PortraitAnimationType.Blink;
    expect(isPortraitDoingAnimation(state)).toBe(true);
  });

  it("ports ZPortrait StartAnim as no-op for animations without frames", () => {
    const renderFrame = new PortraitFrame();
    const state: PortraitStartAnimationState = {
      animInfo: Array.from({ length: PortraitAnimationType.MaxPortraitAnims }, () => ({
        frameList: [],
        totalDuration: 0,
      })),
      currentAnimation: -1,
      renderFrame,
      animationStartTime: 0,
    };
    let soundCount = 0;

    startPortraitAnimation(
      state,
      PortraitAnimationType.Blink,
      () => 12.5,
      () => {
        soundCount += 1;
      },
    );

    expect(state.currentAnimation).toBe(-1);
    expect(state.renderFrame).toBe(renderFrame);
    expect(state.animationStartTime).toBe(0);
    expect(soundCount).toBe(0);
  });

  it("ports ZPortrait StartAnim as first-frame activation and sound trigger", () => {
    const renderFrame = new PortraitFrame();
    const firstFrame = new PortraitFrame();
    firstFrame.duration = 0.75;
    const state: PortraitStartAnimationState = {
      animInfo: Array.from({ length: PortraitAnimationType.MaxPortraitAnims }, () => ({
        frameList: [],
        totalDuration: 0,
      })),
      currentAnimation: -1,
      renderFrame,
      animationStartTime: 0,
    };
    let soundCount = 0;
    state.animInfo[PortraitAnimationType.Salute].frameList.push(firstFrame);

    startPortraitAnimation(
      state,
      PortraitAnimationType.Salute,
      () => 42.25,
      () => {
        soundCount += 1;
      },
    );

    expect(state.currentAnimation).toBe(PortraitAnimationType.Salute);
    expect(state.renderFrame).toBe(firstFrame);
    expect(state.animationStartTime).toBe(42.25);
    expect(soundCount).toBe(1);
  });

  it("ports ZPortrait StartRandomAnim as disabled ambient animation guard", () => {
    const renderFrame = new PortraitFrame();
    const state: PortraitStartRandomAnimationState = {
      animInfo: Array.from({ length: PortraitAnimationType.MaxPortraitAnims }, () => ({
        frameList: [],
        totalDuration: 0,
      })),
      currentAnimation: -1,
      renderFrame,
      animationStartTime: 0,
      doRandomAnims: false,
    };
    let soundCount = 0;

    startPortraitRandomAnimation(
      state,
      () => 9,
      () => {
        soundCount += 1;
      },
      () => 0,
    );

    expect(state.currentAnimation).toBe(-1);
    expect(state.renderFrame).toBe(renderFrame);
    expect(state.animationStartTime).toBe(0);
    expect(soundCount).toBe(0);
  });

  it("ports ZPortrait StartRandomAnim as upstream random animation mapping", () => {
    const renderFrame = new PortraitFrame();
    const blinkFrame = new PortraitFrame();
    const angerFrame = new PortraitFrame();
    const lookRightFrame = new PortraitFrame();
    const state: PortraitStartRandomAnimationState = {
      animInfo: Array.from({ length: PortraitAnimationType.MaxPortraitAnims }, () => ({
        frameList: [],
        totalDuration: 0,
      })),
      currentAnimation: -1,
      renderFrame,
      animationStartTime: 0,
      doRandomAnims: true,
    };
    const startedSounds: number[] = [];
    state.animInfo[PortraitAnimationType.Blink].frameList.push(blinkFrame);
    state.animInfo[PortraitAnimationType.Anger].frameList.push(angerFrame);
    state.animInfo[PortraitAnimationType.LookRight].frameList.push(lookRightFrame);

    startPortraitRandomAnimation(
      state,
      () => 10,
      () => startedSounds.push(1),
      () => 0,
    );
    expect(state.currentAnimation).toBe(PortraitAnimationType.Blink);
    expect(state.renderFrame).toBe(blinkFrame);
    expect(state.animationStartTime).toBe(10);

    startPortraitRandomAnimation(
      state,
      () => 20,
      () => startedSounds.push(1),
      () => 3,
    );
    expect(state.currentAnimation).toBe(PortraitAnimationType.Anger);
    expect(state.renderFrame).toBe(angerFrame);
    expect(state.animationStartTime).toBe(20);

    startPortraitRandomAnimation(
      state,
      () => 30,
      () => startedSounds.push(1),
      () => 12,
    );
    expect(state.currentAnimation).toBe(PortraitAnimationType.LookRight);
    expect(state.renderFrame).toBe(lookRightFrame);
    expect(state.animationStartTime).toBe(30);
    expect(startedSounds).toHaveLength(3);
  });

  it("ports ZPortrait ClearRobotID as robot portrait binding reset", () => {
    const stillFrame = new PortraitFrame();
    stillFrame.duration = 1.5;
    const activeFrame = new PortraitFrame();
    activeFrame.duration = 2.5;
    const state: PortraitRobotClearState = {
      oid: RobotType.Sniper,
      inVehicle: true,
      doRender: true,
      stillFrame,
      renderFrame: activeFrame,
      currentAnimation: PortraitAnimationType.Blink,
      animationStartTime: 1234,
      refId: 99,
    };

    clearPortraitRobotId(state);

    expect(state).toMatchObject({
      oid: RobotType.Grunt,
      inVehicle: false,
      doRender: false,
      currentAnimation: -1,
      animationStartTime: 0,
      refId: -1,
    });
    expect(state.renderFrame).toBe(stillFrame);
  });

  it("ports ZPortrait SetObject null as robot portrait binding reset only", () => {
    const state = createPortraitSetObjectState();
    const stillFrame = state.stillFrame;

    setPortraitObject(state, null);

    expect(state).toMatchObject({
      oid: RobotType.Grunt,
      inVehicle: false,
      doRender: false,
      currentAnimation: -1,
      animationStartTime: 0,
      refId: -1,
    });
    expect(state.renderFrame).toBe(stillFrame);
  });

  it("ports ZPortrait SetObject as robot portrait binding", () => {
    const state = createPortraitSetObjectState();
    const object = new GameEntity({
      id: "portrait-robot",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
      refId: 42,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Sniper,
    });

    setPortraitObject(state, object);

    expect(state).toMatchObject({
      team: TeamType.Blue,
      refId: 42,
      oid: RobotType.Sniper,
      inVehicle: false,
      doRender: true,
    });
  });

  it("ports ZPortrait SetObject as vehicle and cannon driver portrait binding", () => {
    const vehicleState = createPortraitSetObjectState();
    const vehicle = new GameEntity({
      id: "portrait-vehicle",
      kind: "vehicle",
      position: { x: 0, y: 0 },
      owner: TeamType.Red,
      refId: 51,
      objectType: MapObjectType.Vehicle,
      objectId: VehicleType.Light,
    });
    vehicle.driverType = RobotType.Psycho;

    setPortraitObject(vehicleState, vehicle);

    expect(vehicleState).toMatchObject({
      team: TeamType.Red,
      refId: 51,
      oid: RobotType.Psycho,
      inVehicle: true,
      doRender: true,
    });

    const cannonState = createPortraitSetObjectState();
    const cannon = new GameEntity({
      id: "portrait-cannon",
      kind: "cannon",
      position: { x: 0, y: 0 },
      owner: TeamType.Green,
      refId: 52,
      objectType: MapObjectType.Cannon,
      objectId: CannonType.Gatling,
    });
    cannon.driverType = RobotType.Grunt;

    setPortraitObject(cannonState, cannon);

    expect(cannonState).toMatchObject({
      team: TeamType.Green,
      refId: 52,
      oid: RobotType.Grunt,
      inVehicle: true,
      doRender: true,
    });
  });

  it("ports ZPortrait SetObject as team and ref update for unsupported object types", () => {
    const state = createPortraitSetObjectState();
    const object = new GameEntity({
      id: "portrait-building",
      kind: "building",
      position: { x: 0, y: 0 },
      owner: TeamType.Yellow,
      refId: 60,
      objectType: MapObjectType.Building,
      objectId: 3,
    });

    setPortraitObject(state, object);

    expect(state).toMatchObject({
      team: TeamType.Yellow,
      refId: 60,
      oid: RobotType.Grunt,
      inVehicle: false,
      doRender: false,
    });
  });
});

function createPortraitSetObjectState(): PortraitSetObjectState {
  const stillFrame = new PortraitFrame();
  const renderFrame = new PortraitFrame();
  renderFrame.duration = 8;

  return {
    oid: RobotType.Sniper,
    inVehicle: true,
    doRender: true,
    stillFrame,
    renderFrame,
    currentAnimation: PortraitAnimationType.Blink,
    animationStartTime: 22,
    refId: 99,
    team: TeamType.Null,
  };
}
