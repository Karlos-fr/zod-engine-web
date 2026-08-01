import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  ComponentMessage,
  ComponentMessageEngine,
  ComponentMessageFlags,
  renderComponentMessageResume,
  type ComponentMessageObjectReference,
  type ComponentMessageResumeRenderState,
  MAX_RENDERABLE_STORED_GUNS,
  ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED,
} from "../src/rendering/ComponentMessageRendering";

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
