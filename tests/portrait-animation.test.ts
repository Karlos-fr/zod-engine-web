import { describe, expect, it } from "vitest";
import {
  getPortraitRefId,
  PORTRAIT_BASE_HEIGHT_PIXELS,
  PORTRAIT_BASE_WIDTH_PIXELS,
  PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS,
  PORTRAIT_MAX_EYES,
  PORTRAIT_MAX_HANDS,
  PORTRAIT_MAX_MOUTHS,
  PortraitAnimationType,
  PortraitFrame,
  PortraitLookDirection,
  type PortraitObjectReference,
  setPortraitDoRandomAnims,
  setPortraitRefId,
  ZPORTRAIT_HEADER_GUARD_PORTED,
} from "../src/simulation/PortraitAnimation";
import type {
  PortraitRandomAnimationState,
  PortraitRefState,
} from "../src/simulation/PortraitAnimation";
import { GameEntity } from "../src/simulation/entities/GameEntity";

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
});
