import { describe, expect, it } from "vitest";
import { FontType } from "../src/rendering/FontEngine";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  ComponentMessage,
  ComponentMessageEngine,
  ComponentMessageFlags,
  COMPONENT_MESSAGE_CLICK_TO_RESUME_IMAGE_PATH,
  COMPONENT_MESSAGE_FORT_UNDER_ATTACK_IMAGE_PATH,
  COMPONENT_MESSAGE_GUN_IMAGE_PATH,
  COMPONENT_MESSAGE_GUN_MANUFACTURED_IMAGE_PATH,
  COMPONENT_MESSAGE_PAUSED_IMAGE_PATH,
  COMPONENT_MESSAGE_ROBOT_MANUFACTURED_IMAGE_PATH,
  COMPONENT_MESSAGE_VEHICLE_MANUFACTURED_IMAGE_PATH,
  initComponentMessageEngine,
  renderComponentMessageEngine,
  renderComponentMessageGuns,
  renderComponentMessageResume,
  type ComponentMessageDoRenderState,
  type ComponentMessageGunsRenderState,
  type ComponentMessageObjectReference,
  type ComponentMessageResumeRenderState,
  MAX_RENDERABLE_STORED_GUNS,
  ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED,
} from "../src/rendering/ComponentMessageRendering";
import { BuildingType, TeamType } from "../src/simulation/SimulationConstants";
import { MapObjectType } from "../src/world/MapFormat";

describe("component message rendering constants", () => {
  it("adapts the zcomp_message_engine.h include guard to module boundaries", async () => {
    const firstImport = await import("../src/rendering/ComponentMessageRendering");
    const secondImport = await import("../src/rendering/ComponentMessageRendering");

    expect(ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED,
    );
  });

  it("replaces the max renderable stored guns macro", () => {
    expect(MAX_RENDERABLE_STORED_GUNS).toBe(8);
  });

  it("ports component message categories", () => {
    expect(ComponentMessage.RobotManufactured).toBe(0);
    expect(ComponentMessage.VehicleManufactured).toBe(1);
    expect(ComponentMessage.GunManufactured).toBe(2);
    expect(ComponentMessage.Fort).toBe(3);
  });

  it("ports ZCompMessageEngine Init as static image loading", () => {
    const loads: Array<[string, string]> = [];
    const makeTarget = (id: string) => ({
      loadBaseImage: (source: string) => loads.push([id, source]),
    });

    initComponentMessageEngine(
      {
        robotManufacturedImage: makeTarget("robot"),
        vehicleManufacturedImage: makeTarget("vehicle"),
        gunManufacturedImage: makeTarget("gun-manufactured"),
        fortUnderAttackedImage: makeTarget("fort"),
        gunImage: makeTarget("gun"),
        pausedImage: makeTarget("paused"),
        clickToResumeImage: makeTarget("resume"),
        xImages: [],
      },
      (font, text) => `${font}:${text}`,
    );

    expect(loads).toEqual([
      ["robot", COMPONENT_MESSAGE_ROBOT_MANUFACTURED_IMAGE_PATH],
      ["vehicle", COMPONENT_MESSAGE_VEHICLE_MANUFACTURED_IMAGE_PATH],
      ["gun-manufactured", COMPONENT_MESSAGE_GUN_MANUFACTURED_IMAGE_PATH],
      ["fort", COMPONENT_MESSAGE_FORT_UNDER_ATTACK_IMAGE_PATH],
      ["gun", COMPONENT_MESSAGE_GUN_IMAGE_PATH],
      ["paused", COMPONENT_MESSAGE_PAUSED_IMAGE_PATH],
      ["resume", COMPONENT_MESSAGE_CLICK_TO_RESUME_IMAGE_PATH],
    ]);
  });

  it("ports ZCompMessageEngine Init as stored gun count text rendering", () => {
    const rendered: Array<[FontType, string]> = [];
    const loads: Array<[number, string]> = [];

    initComponentMessageEngine(
      {
        robotManufacturedImage: { loadBaseImage: () => undefined },
        vehicleManufacturedImage: { loadBaseImage: () => undefined },
        gunManufacturedImage: { loadBaseImage: () => undefined },
        fortUnderAttackedImage: { loadBaseImage: () => undefined },
        gunImage: { loadBaseImage: () => undefined },
        pausedImage: { loadBaseImage: () => undefined },
        clickToResumeImage: { loadBaseImage: () => undefined },
        xImages: Array.from({ length: MAX_RENDERABLE_STORED_GUNS }, (_, index) => ({
          loadBaseImage: (source: string) => loads.push([index, source]),
        })),
      },
      (font, text) => {
        rendered.push([font, text]);
        return `image:${text}`;
      },
    );

    expect(rendered).toEqual([
      [FontType.SmallWhite, "X1"],
      [FontType.SmallWhite, "X2"],
      [FontType.SmallWhite, "X3"],
      [FontType.SmallWhite, "X4"],
      [FontType.SmallWhite, "X5"],
      [FontType.SmallWhite, "X6"],
      [FontType.SmallWhite, "X7"],
      [FontType.SmallWhite, "X8"],
    ]);
    expect(loads).toEqual([
      [0, "image:X1"],
      [1, "image:X2"],
      [2, "image:X3"],
      [3, "image:X4"],
      [4, "image:X5"],
      [5, "image:X6"],
      [6, "image:X7"],
      [7, "image:X8"],
    ]);
  });

  it("ports the ZObject forward declaration as a component message entity reference", () => {
    const entity = new GameEntity({
      id: "entity",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const reference: ComponentMessageObjectReference = entity;

    expect(reference).toBe(entity);
  });

  it("ports ZCompMessageEngine SetObjectList as object-list reference assignment", () => {
    const engine = new ComponentMessageEngine<GameEntity>();
    const objectList = [
      new GameEntity({
        id: "entity",
        kind: "robot",
        position: { x: 1, y: 2 },
      }),
    ];

    engine.setObjectList(objectList);

    expect(engine.objectList).toBe(objectList);
  });

  it("ports ZCompMessageEngine SetTeam as local team assignment", () => {
    const engine = new ComponentMessageEngine();

    engine.setTeam(3);

    expect(engine.ourTeam).toBe(3);
  });

  it("ports ZCompMessageEngine SetZTime as clock reference assignment", () => {
    const engine = new ComponentMessageEngine<unknown, { now: number }>();
    const ztime = { now: 12.5 };

    engine.setZTime(ztime);

    expect(engine.ztime).toBe(ztime);
  });

  it("ports ZCompMessageEngine DisplayMessage as message display scheduling", () => {
    const engine = new ComponentMessageEngine();
    engine.flipsDone = 4;

    engine.displayMessage(ComponentMessage.VehicleManufactured, 88, () => 10.25);

    expect(engine).toMatchObject({
      showMessage: ComponentMessage.VehicleManufactured,
      nextFlipTime: 10.55,
      showTheMessage: true,
      flipsDone: 0,
      refId: 88,
    });
  });

  it("ports ZCompMessageEngine Process as message image selection before flip time", () => {
    const engine = new ComponentMessageEngine<unknown, unknown, string>();
    engine.showMessage = ComponentMessage.GunManufactured;
    engine.nextFlipTime = 10;
    engine.showTheMessage = true;
    engine.flipsDone = 2;

    engine.process(9.99, {
      robotManufactured: "robot",
      vehicleManufactured: "vehicle",
      gunManufactured: "gun",
      fortUnderAttacked: "fort",
    });

    expect(engine.showMessageImage).toBe("gun");
    expect(engine.showTheMessage).toBe(true);
    expect(engine.flipsDone).toBe(2);
    expect(engine.nextFlipTime).toBe(10);
  });

  it("ports ZCompMessageEngine Process as timed visibility flip", () => {
    const engine = new ComponentMessageEngine<unknown, unknown, string>();
    engine.showMessage = ComponentMessage.VehicleManufactured;
    engine.nextFlipTime = 10;
    engine.showTheMessage = true;
    engine.flipsDone = 4;

    engine.process(10, {
      robotManufactured: "robot",
      vehicleManufactured: "vehicle",
      gunManufactured: "gun",
      fortUnderAttacked: "fort",
    });

    expect(engine.showMessageImage).toBe("vehicle");
    expect(engine.showTheMessage).toBe(false);
    expect(engine.flipsDone).toBe(5);
    expect(engine.nextFlipTime).toBe(10.3);
    expect(engine.finalTime).toBe(0);
  });

  it("ports ZCompMessageEngine Process as final display timeout scheduling", () => {
    const engine = new ComponentMessageEngine<unknown, unknown, string>();
    engine.showMessage = ComponentMessage.Fort;
    engine.nextFlipTime = 20;
    engine.showTheMessage = false;
    engine.flipsDone = 9;

    engine.process(20, {
      robotManufactured: "robot",
      vehicleManufactured: "vehicle",
      gunManufactured: "gun",
      fortUnderAttacked: "fort",
    });

    expect(engine.showMessageImage).toBe("fort");
    expect(engine.showTheMessage).toBe(true);
    expect(engine.flipsDone).toBe(10);
    expect(engine.nextFlipTime).toBe(20.3);
    expect(engine.finalTime).toBe(25);
  });

  it("ports ZCompMessageEngine Process as expiry after final time", () => {
    const engine = new ComponentMessageEngine<unknown, unknown, string>();
    engine.showMessage = ComponentMessage.RobotManufactured;
    engine.showMessageImage = "robot";
    engine.showTheMessage = true;
    engine.flipsDone = 10;
    engine.finalTime = 25;

    engine.process(24.99, {
      robotManufactured: "robot",
      vehicleManufactured: "vehicle",
      gunManufactured: "gun",
      fortUnderAttacked: "fort",
    });

    expect(engine.showMessage).toBe(ComponentMessage.RobotManufactured);
    expect(engine.showMessageImage).toBe("robot");
    expect(engine.showTheMessage).toBe(true);

    engine.process(25, {
      robotManufactured: "robot",
      vehicleManufactured: "vehicle",
      gunManufactured: "gun",
      fortUnderAttacked: "fort",
    });

    expect(engine.showMessage).toBe(-1);
    expect(engine.showMessageImage).toBeNull();
    expect(engine.showTheMessage).toBe(false);
  });

  it("replaces ZCompMessageEngine RenderResume as no command while unpaused", () => {
    const state: ComponentMessageResumeRenderState<string> = {
      ztime: { isPaused: () => false },
      clickToResumeImage: {
        surface: "resume",
        baseSurface: { width: 80, height: 20 },
      },
    };

    const command = renderComponentMessageResume(state, {
      getViewShiftFull: () => {
        throw new Error("view shift should not be read");
      },
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    });

    expect(command).toBeNull();
  });

  it("replaces ZCompMessageEngine RenderResume as no command without an image", () => {
    const state: ComponentMessageResumeRenderState<string> = {
      ztime: { isPaused: () => true },
      clickToResumeImage: {
        surface: "resume",
        baseSurface: null,
      },
    };

    const command = renderComponentMessageResume(state, {
      getViewShiftFull: () => {
        throw new Error("view shift should not be read");
      },
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    });

    expect(command).toBeNull();
  });

  it("replaces ZCompMessageEngine RenderResume as a centered map surface command", () => {
    const calls: unknown[] = [];
    const state: ComponentMessageResumeRenderState<string> = {
      ztime: { isPaused: () => true },
      clickToResumeImage: {
        surface: "resume",
        baseSurface: { width: 81, height: 21 },
      },
    };

    const command = renderComponentMessageResume(state, {
      getViewShiftFull: () => ({
        x: 12,
        y: 34,
        viewWidth: 640,
        viewHeight: 480,
      }),
      renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
        calls.push([surface, x, y, renderHit, aboutCenter]);
        return { surface, x: x - 12, y: y - 34, renderHit, aboutCenter };
      },
    });

    expect(calls).toEqual([["resume", 291, 263, false, false]]);
    expect(command).toEqual({
      surface: "resume",
      x: 279,
      y: 229,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces ZCompMessageEngine RenderGuns as no commands without objects or gun image", () => {
    const noObjects = createGunsRenderState({ objectList: null });
    const noGunImage = createGunsRenderState({
      gunImage: { surface: "gun", baseSurface: null },
    });
    const zmap = createComponentMessageRenderMap();

    expect(renderComponentMessageGuns(noObjects, zmap)).toEqual({
      commands: [],
      renderedGunRefIds: [],
    });
    expect(renderComponentMessageGuns(noGunImage, zmap)).toEqual({
      commands: [],
      renderedGunRefIds: [],
    });
  });

  it("replaces ZCompMessageEngine RenderGuns as stored-gun indicator commands", () => {
    const calls: unknown[] = [];
    const state = createGunsRenderState({
      objectList: [
        createStoredGunObject({
          refId: 11,
          owner: TeamType.Red,
          objectId: BuildingType.FortFront,
          builtCannonList: [1],
        }),
        createStoredGunObject({
          refId: 22,
          owner: TeamType.Red,
          objectId: BuildingType.VehicleFactory,
          builtCannonList: [1, 2, 3],
        }),
      ],
    });

    const result = renderComponentMessageGuns(
      state,
      createComponentMessageRenderMap(calls),
    );

    expect(calls).toEqual([
      ["gun", 18, 28, false, false],
      ["gun", 18, 46, false, false],
      ["x3", 38, 49, false, false],
    ]);
    expect(result.commands).toEqual([
      { surface: "gun", x: 18, y: 28, renderHit: false, aboutCenter: false },
      { surface: "gun", x: 18, y: 46, renderHit: false, aboutCenter: false },
      { surface: "x3", x: 38, y: 49, renderHit: false, aboutCenter: false },
    ]);
    expect(result.renderedGunRefIds).toEqual([11, 22]);
  });

  it("replaces ZCompMessageEngine RenderGuns filtering and render limit", () => {
    const accepted = Array.from(
      { length: MAX_RENDERABLE_STORED_GUNS + 1 },
      (_value, index) =>
        createStoredGunObject({
          refId: 100 + index,
          owner: TeamType.Red,
          objectId:
            index % 2 === 0
              ? BuildingType.RobotFactory
              : BuildingType.FortBack,
          builtCannonList: [index],
        }),
    );
    const state = createGunsRenderState({
      objectList: [
        createStoredGunObject({
          refId: 1,
          owner: TeamType.Blue,
          objectId: BuildingType.FortFront,
          builtCannonList: [1],
        }),
        createStoredGunObject({
          refId: 2,
          owner: TeamType.Red,
          objectId: BuildingType.Radar,
          builtCannonList: [1],
        }),
        createStoredGunObject({
          refId: 3,
          owner: TeamType.Red,
          objectId: BuildingType.FortFront,
          builtCannonList: [1],
          destroyed: true,
        }),
        createStoredGunObject({
          refId: 4,
          owner: TeamType.Red,
          objectType: MapObjectType.Vehicle,
          objectId: 0,
          builtCannonList: [1],
        }),
        createStoredGunObject({
          refId: 5,
          owner: TeamType.Red,
          objectId: BuildingType.FortFront,
          builtCannonList: [],
        }),
        ...accepted,
      ],
    });

    const result = renderComponentMessageGuns(
      state,
      createComponentMessageRenderMap(),
    );

    expect(result.renderedGunRefIds).toEqual([
      100, 101, 102, 103, 104, 105, 106, 107,
    ]);
    expect(result.commands).toHaveLength(MAX_RENDERABLE_STORED_GUNS);
  });

  it("replaces ZCompMessageEngine DoRender as message, guns, and resume command aggregation", () => {
    const calls: unknown[] = [];
    const state = createDoRenderState({
      showMessageImage: {
        surface: "message",
        baseSurface: { width: 101, height: 20 },
      },
      showTheMessage: true,
      objectList: [
        createStoredGunObject({
          refId: 44,
          owner: TeamType.Red,
          objectId: BuildingType.FortFront,
          builtCannonList: [1, 2],
        }),
      ],
      ztime: { isPaused: () => true },
    });

    const result = renderComponentMessageEngine(
      state,
      createComponentMessageRenderMap(calls),
    );

    expect(calls).toEqual([
      ["message", 279, 40, false, false],
      ["gun", 18, 28, false, false],
      ["x2", 38, 31, false, false],
      ["resume", 300, 250, false, false],
    ]);
    expect(result.renderedGunRefIds).toEqual([44]);
    expect(result.commands).toHaveLength(4);
  });

  it("replaces ZCompMessageEngine DoRender message guard cases", () => {
    const hidden = createDoRenderState({
      showMessageImage: {
        surface: "message",
        baseSurface: { width: 100, height: 20 },
      },
      showTheMessage: false,
    });
    const missingBase = createDoRenderState({
      showMessageImage: { surface: "message", baseSurface: null },
      showTheMessage: true,
    });

    expect(
      renderComponentMessageEngine(hidden, createComponentMessageRenderMap()),
    ).toEqual({ commands: [], renderedGunRefIds: [] });
    expect(
      renderComponentMessageEngine(missingBase, createComponentMessageRenderMap()),
    ).toEqual({ commands: [], renderedGunRefIds: [] });
  });

  it("ports comp_msg_flags default construction through Clear", () => {
    expect(new ComponentMessageFlags()).toEqual({
      refId: -1,
      openGui: false,
      selectObject: false,
      resumeGame: false,
    });
  });

  it("ports comp_msg_flags Clear as action flag reset", () => {
    const flags = new ComponentMessageFlags();
    flags.refId = 42;
    flags.openGui = true;
    flags.selectObject = true;
    flags.resumeGame = true;

    flags.clear();

    expect(flags).toEqual({
      refId: -1,
      openGui: false,
      selectObject: false,
      resumeGame: false,
    });
  });
});

type StoredGunObjectOptions = {
  refId: number;
  owner: number;
  objectType?: number;
  objectId: number;
  builtCannonList: readonly unknown[];
  destroyed?: boolean;
};

function createGunsRenderState(
  overrides: Partial<ComponentMessageGunsRenderState<string>> = {},
): ComponentMessageGunsRenderState<string> {
  return {
    objectList: [],
    ourTeam: TeamType.Red,
    gunImage: { surface: "gun", baseSurface: { width: 16, height: 16 } },
    xImages: Array.from({ length: MAX_RENDERABLE_STORED_GUNS }, (_value, index) => ({
      surface: `x${index + 1}`,
      baseSurface: { width: 8, height: 8 },
    })),
    ...overrides,
  };
}

function createStoredGunObject(options: StoredGunObjectOptions) {
  return {
    getOwner: () => options.owner,
    isDestroyed: () => options.destroyed ?? false,
    getObjectId: () => ({
      objectType: options.objectType ?? MapObjectType.Building,
      objectId: options.objectId,
    }),
    getBuiltCannonList: () => options.builtCannonList,
    getRefId: () => options.refId,
  };
}

function createDoRenderState(
  overrides: Partial<ComponentMessageDoRenderState<string>> = {},
): ComponentMessageDoRenderState<string> {
  return {
    ...createGunsRenderState(),
    ztime: { isPaused: () => false },
    clickToResumeImage: {
      surface: "resume",
      baseSurface: { width: 60, height: 20 },
    },
    showMessageImage: null,
    showTheMessage: false,
    ...overrides,
  };
}

function createComponentMessageRenderMap(calls: unknown[] = []) {
  return {
    getViewShiftFull: () => ({
      x: 10,
      y: 20,
      viewWidth: 640,
      viewHeight: 480,
    }),
    renderZSurface(
      surface: string,
      x: number,
      y: number,
      renderHit: boolean,
      aboutCenter: boolean,
    ) {
      calls.push([surface, x, y, renderHit, aboutCenter]);
      return { surface, x, y, renderHit, aboutCenter };
    },
  };
}
