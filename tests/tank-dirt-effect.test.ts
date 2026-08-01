import { describe, expect, it } from "vitest";
import { PlanetType } from "../src/simulation/SimulationConstants";
import {
  ETANK_DIRT_HEADER_GUARD_PORTED,
  TANK_DIRT_FRAME_INTERVAL_SECONDS,
  createTankDirtGraphics,
  doRenderTankDirtEffect,
  initTankDirtEffect,
  loadTankDirtGraphics,
  processTankDirtEffect,
  renderTankDirtEffect,
  type TankDirtGraphics,
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

  it("ports tank_dirt_graphics construction as empty graphics state", () => {
    expect(createTankDirtGraphics()).toEqual({
      tankDirt: [],
      dirtVariants: 0,
      frameCount: 0,
    });
  });

  it("ports tank_dirt_graphics LoadGraphics as default palette frames", () => {
    const loaded: string[] = [];
    const graphics: TankDirtGraphics<string> = {
      tankDirt: [],
      dirtVariants: 0,
      frameCount: 0,
    };

    loadTankDirtGraphics(graphics, PlanetType.Desert, (filename) => {
      loaded.push(filename);
      return filename;
    });

    expect(graphics.dirtVariants).toBe(2);
    expect(graphics.frameCount).toBe(5);
    expect(loaded).toHaveLength(10);
    expect(loaded[0]).toBe(
      "assets/units/vehicles/tank_dirt/tank_dirt_0_desert_n00.png",
    );
    expect(loaded[9]).toBe(
      "assets/units/vehicles/tank_dirt/tank_dirt_1_desert_n04.png",
    );
  });

  it("ports tank_dirt_graphics LoadGraphics palette-specific frame counts", () => {
    const jungle: TankDirtGraphics<string> = {
      tankDirt: [],
      dirtVariants: 0,
      frameCount: 0,
    };
    const city: TankDirtGraphics<string> = {
      tankDirt: [["stale"]],
      dirtVariants: 9,
      frameCount: 9,
    };

    loadTankDirtGraphics(jungle, PlanetType.Jungle, (filename) => filename);
    loadTankDirtGraphics(city, PlanetType.City, (filename) => filename);

    expect(jungle.dirtVariants).toBe(1);
    expect(jungle.frameCount).toBe(6);
    expect(jungle.tankDirt[0]).toHaveLength(6);
    expect(jungle.tankDirt[0][5]).toBe(
      "assets/units/vehicles/tank_dirt/tank_dirt_0_jungle_n05.png",
    );
    expect(city).toEqual({
      tankDirt: [],
      dirtVariants: 0,
      frameCount: 0,
    });
  });

  it("ports ETankDirt Init as loading every planet palette", () => {
    const graphics = Array.from({ length: PlanetType.Max }, () => ({
      tankDirt: [] as string[][],
      dirtVariants: 0,
      frameCount: 0,
    }));
    const loaded: string[] = [];
    const state = { graphics, finishedInit: false };

    initTankDirtEffect(state, (filename) => {
      loaded.push(filename);
      return filename;
    });

    expect(state.finishedInit).toBe(true);
    expect(graphics[PlanetType.Desert].frameCount).toBe(5);
    expect(graphics[PlanetType.Volcanic].frameCount).toBe(5);
    expect(graphics[PlanetType.Arctic].frameCount).toBe(5);
    expect(graphics[PlanetType.Jungle].frameCount).toBe(6);
    expect(graphics[PlanetType.City].frameCount).toBe(0);
    expect(loaded).toHaveLength(36);
    expect(loaded).toContain(
      "assets/units/vehicles/tank_dirt/tank_dirt_1_arctic_n04.png",
    );
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
