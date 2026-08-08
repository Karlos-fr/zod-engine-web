import { describe, expect, it } from "vitest";
import {
  DEATH_SPARKS_MAX_DOWN,
  DEATH_SPARKS_MAX_LEFT,
  DEATH_SPARKS_MAX_RIGHT,
  DEATH_SPARKS_MAX_UP,
  EDEATH_SPARKS_HEADER_GUARD_PORTED,
  initDeathSparksEffect,
  processDeathSparksEffect,
  renderDeathSparksEffect,
  type DeathSparksInitState,
  type DeathSparksProcessState,
} from "../src/simulation/DeathSparksEffect";

describe("death sparks effect", () => {
  it("adapts the edeathsparks.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/DeathSparksEffect");
    const secondImport = await import("../src/simulation/DeathSparksEffect");

    expect(EDEATH_SPARKS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EDEATH_SPARKS_HEADER_GUARD_PORTED).toBe(
      firstImport.EDEATH_SPARKS_HEADER_GUARD_PORTED,
    );
  });

  it("ports death spark spread limits from edeathsparks.cpp", () => {
    expect(DEATH_SPARKS_MAX_UP).toBe(70);
    expect(DEATH_SPARKS_MAX_DOWN).toBe(150);
    expect(DEATH_SPARKS_MAX_LEFT).toBe(180);
    expect(DEATH_SPARKS_MAX_RIGHT).toBe(180);
  });

  it("ports EDeathSparks Init as death-spark frame path initialization", () => {
    const state: DeathSparksInitState = {
      baseImages: [],
      finishedInit: false,
    };

    initDeathSparksEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.baseImages).toEqual([
      "assets/units/vehicles/death_effects/spark_n00.png",
      "assets/units/vehicles/death_effects/spark_n01.png",
      "assets/units/vehicles/death_effects/spark_n02.png",
      "assets/units/vehicles/death_effects/spark_n03.png",
      "assets/units/vehicles/death_effects/spark_n04.png",
      "assets/units/vehicles/death_effects/spark_n05.png",
    ]);
  });

  it("leaves already killed death sparks unchanged", () => {
    const state = createDeathSparksProcessState({
      killMe: true,
      renderIndex: 2,
      x: 1,
      y: 2,
    });

    processDeathSparksEffect(state, 12);

    expect(state).toMatchObject({
      killMe: true,
      renderIndex: 2,
      x: 1,
      y: 2,
    });
  });

  it("ports EDeathSparks Process as final-time expiration", () => {
    const state = createDeathSparksProcessState({
      finalTime: 12,
      renderIndex: 5,
    });

    processDeathSparksEffect(state, 12);

    expect(state.killMe).toBe(true);
    expect(state.renderIndex).toBe(5);
  });

  it("ports EDeathSparks Process as animation wrapping and arcing movement", () => {
    const state = createDeathSparksProcessState({
      renderIndex: 5,
      nextProcessTime: 10,
      initialTime: 8,
      finalTime: 14,
      startX: 100,
      startY: 200,
      deltaX: 3,
      deltaY: -2,
      rise: 4,
    });

    processDeathSparksEffect(state, 10);

    expect(state.killMe).toBe(false);
    expect(state.renderIndex).toBe(0);
    expect(state.nextProcessTime).toBe(10.1);
    expect(state.x).toBe(106);
    expect(state.size).toBeCloseTo(5.333333333333334);
    expect(state.y).toBeCloseTo(36);
  });

  it("replaces EDeathSparks DoRender with a centered map-relative frame command", () => {
    const sizes: number[] = [];
    const baseImages = Array.from({ length: 6 }, (_value, index) => ({
      id: `spark-${index}`,
      setSize: (size: number) => sizes.push(size),
    }));
    const zmapCalls: unknown[] = [];

    const command = renderDeathSparksEffect(
      {
        killMe: false,
        x: 72,
        y: 118,
        size: 2.25,
        renderIndex: 4,
        baseImages,
      },
      {
        renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
          zmapCalls.push({ surface, x, y, renderHit, aboutCenter });
          return {
            surface,
            x: x - 10,
            y: y - 15,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(command).toEqual({
      surface: baseImages[4],
      x: 62,
      y: 103,
      renderHit: false,
      aboutCenter: true,
    });
    expect(sizes).toEqual([2.25]);
    expect(zmapCalls).toEqual([
      {
        surface: baseImages[4],
        x: 72,
        y: 118,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces EDeathSparks DoRender as no command for killed or missing frames", () => {
    const baseImages = [{ setSize: () => undefined }];
    const zmap = {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(
      renderDeathSparksEffect(
        {
          killMe: true,
          x: 0,
          y: 0,
          size: 1,
          renderIndex: 0,
          baseImages,
        },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderDeathSparksEffect(
        {
          killMe: false,
          x: 0,
          y: 0,
          size: 1,
          renderIndex: 9,
          baseImages,
        },
        zmap,
      ),
    ).toBeNull();
  });
});

function createDeathSparksProcessState(
  overrides: Partial<DeathSparksProcessState> = {},
): DeathSparksProcessState {
  return {
    killMe: false,
    renderIndex: 0,
    nextProcessTime: 0,
    initialTime: 0,
    finalTime: 10,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    rise: 0,
    size: 0,
    ...overrides,
  };
}
