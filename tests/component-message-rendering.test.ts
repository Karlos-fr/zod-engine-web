import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  ComponentMessage,
  ComponentMessageFlags,
  type ComponentMessageObjectReference,
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
