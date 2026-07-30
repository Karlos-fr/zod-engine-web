import { describe, expect, it } from "vitest";
import {
  ETANK_DIRT_HEADER_GUARD_PORTED,
  TANK_DIRT_FRAME_INTERVAL_SECONDS,
  doRenderTankDirtEffect,
  processTankDirtEffect,
  renderTankDirtEffect,
} from "../src/simulation/TankDirtEffect";

describe("tank dirt effect", () => {
  it("adapts the etankdirt.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankDirtEffect");
    const secondImport = await import("../src/simulation/TankDirtEffect");

    expect(ETANK_DIRT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_DIRT_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_DIRT_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKDIRT_TIME as the tank dirt frame interval", () => {
    expect(TANK_DIRT_FRAME_INTERVAL_SECONDS).toBe(0.15);
  });

  it("replaces ETankDirt::TheRender as no command once the effect is killed", () => {
    const surface = { width: 12, height: 8 };

    expect(
      renderTankDirtEffect(
        {
          killme: true,
          cx: 30,
          cy: 40,
          palette: 0,
          dirtIndex: 0,
          frameIndex: 0,
        },
        [[[surface]]],
        {
          renderZSurface: () => {
            throw new Error("render should not be called");
          },
        },
      ),
    ).toBeNull();
  });

  it("replaces ETankDirt::TheRender as no command without a loaded frame", () => {
    expect(
      renderTankDirtEffect(
        {
          killme: false,
          cx: 30,
          cy: 40,
          palette: 0,
          dirtIndex: 0,
          frameIndex: 0,
        },
        [[[null]]],
        {
          renderZSurface: () => {
            throw new Error("render should not be called");
          },
        },
      ),
    ).toBeNull();
  });

  it("replaces ETankDirt::TheRender by anchoring the frame through ZMap rendering", () => {
    const surface = { width: 12, height: 8 };
    const renderCalls: Array<{
      surface: typeof surface;
      x: number;
      y: number;
      renderHit: boolean;
      aboutCenter: boolean;
    }> = [];

    const command = renderTankDirtEffect(
      {
        killme: false,
        cx: 30,
        cy: 40,
        palette: 1,
        dirtIndex: 0,
        frameIndex: 0,
      },
      [[], [[surface]]],
      {
        renderZSurface: (
          renderedSurface,
          x,
          y,
          renderHit,
          aboutCenter,
        ) => {
          renderCalls.push({
            surface: renderedSurface,
            x,
            y,
            renderHit,
            aboutCenter,
          });
          return {
            surface: renderedSurface,
            x: x - 4,
            y: y - 2,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(renderCalls).toEqual([
      {
        surface,
        x: 24,
        y: 32,
        renderHit: false,
        aboutCenter: false,
      },
    ]);
    expect(command).toEqual({
      surface,
      x: 20,
      y: 30,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces ETankDirt::DoRender as no command while pre-rendering is enabled", () => {
    const surface = { width: 12, height: 8 };

    expect(
      doRenderTankDirtEffect(
        {
          killme: false,
          doPreRender: true,
          cx: 30,
          cy: 40,
          palette: 0,
          dirtIndex: 0,
          frameIndex: 0,
        },
        [[[surface]]],
        {
          renderZSurface: () => {
            throw new Error("render should not be called");
          },
        },
      ),
    ).toBeNull();
  });

  it("replaces ETankDirt::DoRender by delegating to direct frame rendering", () => {
    const surface = { width: 12, height: 8 };

    expect(
      doRenderTankDirtEffect(
        {
          killme: false,
          doPreRender: false,
          cx: 30,
          cy: 40,
          palette: 0,
          dirtIndex: 0,
          frameIndex: 0,
        },
        [[[surface]]],
        {
          renderZSurface: (
            renderedSurface,
            x,
            y,
            renderHit,
            aboutCenter,
          ) => ({
            surface: renderedSurface,
            x,
            y,
            renderHit,
            aboutCenter,
          }),
        },
      ),
    ).toEqual({
      surface,
      x: 24,
      y: 32,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("ports ETankDirt Process as no-op once the effect is killed", () => {
    const state = {
      killme: true,
      palette: 0,
      frameIndex: 2,
      nextFrameTime: 10,
    };

    processTankDirtEffect(state, 12, [{ frameCount: 5 }]);

    expect(state).toEqual({
      killme: true,
      palette: 0,
      frameIndex: 2,
      nextFrameTime: 10,
    });
  });

  it("ports ETankDirt Process as waiting for the next frame time", () => {
    const state = {
      killme: false,
      palette: 0,
      frameIndex: 2,
      nextFrameTime: 10,
    };

    processTankDirtEffect(state, 9.9, [{ frameCount: 5 }]);

    expect(state).toEqual({
      killme: false,
      palette: 0,
      frameIndex: 2,
      nextFrameTime: 10,
    });
  });

  it("ports ETankDirt Process as frame advance and final-frame kill", () => {
    const state = {
      killme: false,
      palette: 1,
      frameIndex: 1,
      nextFrameTime: 10,
    };

    processTankDirtEffect(state, 10, [{ frameCount: 5 }, { frameCount: 3 }]);

    expect(state).toEqual({
      killme: false,
      palette: 1,
      frameIndex: 2,
      nextFrameTime: 10 + TANK_DIRT_FRAME_INTERVAL_SECONDS,
    });

    processTankDirtEffect(state, 11, [{ frameCount: 5 }, { frameCount: 3 }]);

    expect(state).toEqual({
      killme: true,
      palette: 1,
      frameIndex: 0,
      nextFrameTime: 11 + TANK_DIRT_FRAME_INTERVAL_SECONDS,
    });
  });
});
