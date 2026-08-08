import { describe, expect, it } from "vitest";
import {
  ETOUGH_SMOKE_HEADER_GUARD_PORTED,
  initToughSmokeEffect,
  processToughSmokeEffect,
  renderToughSmokeEffect,
  TOUGH_SMOKE_FRAME_COUNT,
  TOUGH_SMOKE_PROCESS_INTERVAL_SECONDS,
  type ToughSmokeInitState,
  type ToughSmokeProcessState,
} from "../src/simulation/ToughSmokeEffect";

describe("tough smoke effect", () => {
  it("adapts the etoughsmoke.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughSmokeEffect");
    const secondImport = await import("../src/simulation/ToughSmokeEffect");

    expect(ETOUGH_SMOKE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_SMOKE_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_SMOKE_HEADER_GUARD_PORTED,
    );
  });

  it("ports EToughSmoke Init as tough-smoke frame path initialization", () => {
    const state: ToughSmokeInitState = {
      renderImages: [],
      finishedInit: false,
    };

    initToughSmokeEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.renderImages).toHaveLength(TOUGH_SMOKE_FRAME_COUNT);
    expect(state.renderImages[0]).toBe("assets/units/robots/tough/smoke_n00.png");
    expect(state.renderImages[7]).toBe("assets/units/robots/tough/smoke_n07.png");
  });

  it("keeps killed tough smoke effects unchanged while processing", () => {
    const state: ToughSmokeProcessState = {
      killMe: true,
      renderIndex: 2,
      nextProcessTime: 10,
    };

    processToughSmokeEffect(state, 10);

    expect(state).toEqual({
      killMe: true,
      renderIndex: 2,
      nextProcessTime: 10,
    });
  });

  it("keeps tough smoke unchanged before the next process time", () => {
    const state: ToughSmokeProcessState = {
      killMe: false,
      renderIndex: 2,
      nextProcessTime: 10,
    };

    processToughSmokeEffect(state, 9.99);

    expect(state.renderIndex).toBe(2);
    expect(state.nextProcessTime).toBe(10);
    expect(state.killMe).toBe(false);
  });

  it("advances tough smoke frame and schedules the next process time", () => {
    const state: ToughSmokeProcessState = {
      killMe: false,
      renderIndex: 2,
      nextProcessTime: 10,
    };

    processToughSmokeEffect(state, 10);

    expect(state.renderIndex).toBe(3);
    expect(state.nextProcessTime).toBe(
      10 + TOUGH_SMOKE_PROCESS_INTERVAL_SECONDS,
    );
    expect(state.killMe).toBe(false);
  });

  it("expires tough smoke after the final frame", () => {
    const state: ToughSmokeProcessState = {
      killMe: false,
      renderIndex: TOUGH_SMOKE_FRAME_COUNT - 1,
      nextProcessTime: 10,
    };

    processToughSmokeEffect(state, 10);

    expect(state.renderIndex).toBe(TOUGH_SMOKE_FRAME_COUNT);
    expect(state.killMe).toBe(true);
  });

  it("replaces EToughSmoke DoRender with a centered map-relative smoke frame command", () => {
    const renderImages = [
      { id: "smoke-0" },
      { id: "smoke-1" },
      { id: "smoke-2" },
    ];
    const calls: unknown[] = [];
    const zmap = {
      renderZSurface(
        surface: (typeof renderImages)[number],
        x: number,
        y: number,
        renderHit: boolean,
        aboutCenter: boolean,
      ) {
        calls.push(surface, x, y, renderHit, aboutCenter);
        return {
          surface,
          x: x - 2,
          y: y - 3,
          renderHit,
          aboutCenter,
        };
      },
    };

    expect(
      renderToughSmokeEffect(
        { killMe: false, x: 24, y: 18, renderIndex: 2, renderImages },
        zmap,
      ),
    ).toEqual({
      surface: renderImages[2],
      x: 22,
      y: 15,
      renderHit: false,
      aboutCenter: true,
    });
    expect(calls).toEqual([renderImages[2], 24, 18, false, true]);
  });

  it("replaces EToughSmoke DoRender as no command for killed or missing frames", () => {
    const zmap = {
      renderZSurface() {
        throw new Error("hidden tough smoke should not render");
      },
    };

    expect(
      renderToughSmokeEffect(
        { killMe: true, x: 24, y: 18, renderIndex: 0, renderImages: [{}] },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderToughSmokeEffect(
        { killMe: false, x: 24, y: 18, renderIndex: 9, renderImages: [] },
        zmap,
      ),
    ).toBeNull();
  });
});
