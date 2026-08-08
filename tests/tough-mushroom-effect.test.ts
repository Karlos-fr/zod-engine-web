import { describe, expect, it } from "vitest";
import {
  ETOUGH_MUSHROOM_HEADER_GUARD_PORTED,
  initToughMushroomEffect,
  processToughMushroomEffect,
  renderToughMushroomEffect,
  TOUGH_MUSHROOM_FRAME_SHIFT_Y,
  TOUGH_MUSHROOM_FRAME_COUNT,
  TOUGH_MUSHROOM_PROCESS_INTERVAL_SECONDS,
  type ToughMushroomInitState,
  type ToughMushroomProcessState,
} from "../src/simulation/ToughMushroomEffect";

describe("tough mushroom effect", () => {
  it("adapts the etoughmushroom.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughMushroomEffect");
    const secondImport = await import("../src/simulation/ToughMushroomEffect");

    expect(ETOUGH_MUSHROOM_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_MUSHROOM_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_MUSHROOM_HEADER_GUARD_PORTED,
    );
  });

  it("ports EToughMushroom Init as tough mushroom base image initialization", () => {
    const state: ToughMushroomInitState = {
      baseImages: [],
      finishedInit: false,
    };

    initToughMushroomEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.baseImages).toHaveLength(TOUGH_MUSHROOM_FRAME_COUNT);
    expect(state.baseImages[0]).toBe(
      "assets/units/robots/tough/mushroom_n00.png",
    );
    expect(state.baseImages[11]).toBe(
      "assets/units/robots/tough/mushroom_n11.png",
    );
  });

  it("keeps killed tough mushroom effects unchanged while processing", () => {
    const state: ToughMushroomProcessState = {
      killMe: true,
      renderIndex: 2,
      nextProcessTime: 10,
    };

    processToughMushroomEffect(state, 10);

    expect(state).toEqual({
      killMe: true,
      renderIndex: 2,
      nextProcessTime: 10,
    });
  });

  it("keeps tough mushroom unchanged before the next process time", () => {
    const state: ToughMushroomProcessState = {
      killMe: false,
      renderIndex: 2,
      nextProcessTime: 10,
    };

    processToughMushroomEffect(state, 9.99);

    expect(state.renderIndex).toBe(2);
    expect(state.nextProcessTime).toBe(10);
    expect(state.killMe).toBe(false);
  });

  it("advances tough mushroom frame and schedules the next process time", () => {
    const state: ToughMushroomProcessState = {
      killMe: false,
      renderIndex: 2,
      nextProcessTime: 10,
    };

    processToughMushroomEffect(state, 10);

    expect(state.renderIndex).toBe(3);
    expect(state.nextProcessTime).toBe(
      10 + TOUGH_MUSHROOM_PROCESS_INTERVAL_SECONDS,
    );
    expect(state.killMe).toBe(false);
  });

  it("expires tough mushroom after the final frame", () => {
    const state: ToughMushroomProcessState = {
      killMe: false,
      renderIndex: TOUGH_MUSHROOM_FRAME_COUNT - 1,
      nextProcessTime: 10,
    };

    processToughMushroomEffect(state, 10);

    expect(state.renderIndex).toBe(TOUGH_MUSHROOM_FRAME_COUNT);
    expect(state.killMe).toBe(true);
  });

  it("replaces EToughMushroom DoRender with a scaled map-relative frame command", () => {
    const sizes: number[] = [];
    const baseImages = Array.from({ length: TOUGH_MUSHROOM_FRAME_COUNT }, (_, index) => ({
      id: `mushroom-${index}`,
      setSize(size: number) {
        sizes.push(size);
      },
    }));
    const calls: unknown[] = [];
    const zmap = {
      renderZSurface(
        surface: (typeof baseImages)[number],
        x: number,
        y: number,
        renderHit: boolean,
        aboutCenter: boolean,
      ) {
        calls.push(surface, x, y, renderHit, aboutCenter);
        return {
          surface,
          x: x - 12,
          y: y - 6,
          renderHit,
          aboutCenter,
        };
      },
    };

    expect(
      renderToughMushroomEffect(
        {
          killMe: false,
          x: 40,
          y: 80,
          zoomSize: 1.5,
          renderIndex: 2,
          baseImages,
        },
        zmap,
      ),
    ).toEqual({
      surface: baseImages[2],
      x: 28,
      y: 77,
      renderHit: false,
      aboutCenter: false,
    });
    expect(sizes).toEqual([1.5]);
    expect(calls).toEqual([
      baseImages[2],
      40,
      80 + TOUGH_MUSHROOM_FRAME_SHIFT_Y[2] * 1.5,
      false,
      false,
    ]);
  });

  it("replaces EToughMushroom DoRender as no command for killed or missing frames", () => {
    const zmap = {
      renderZSurface() {
        throw new Error("hidden tough mushrooms should not render");
      },
    };

    expect(
      renderToughMushroomEffect(
        {
          killMe: true,
          x: 40,
          y: 80,
          zoomSize: 1.5,
          renderIndex: 0,
          baseImages: [{}],
        },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderToughMushroomEffect(
        {
          killMe: false,
          x: 40,
          y: 80,
          zoomSize: 1.5,
          renderIndex: 99,
          baseImages: [],
        },
        zmap,
      ),
    ).toBeNull();
  });
});
