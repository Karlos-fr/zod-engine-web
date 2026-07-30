import { describe, expect, it } from "vitest";
import {
  doPreRenderTrackEffect,
  ETRACK_HEADER_GUARD_PORTED,
  processTrackEffect,
  TRACK_EFFECT_FRAME_1_SECONDS,
  TRACK_EFFECT_FRAME_2_SECONDS,
  TRACK_EFFECT_KILL_SECONDS,
  TrackEffectType,
  type TrackEffectPreRenderState,
  type TrackEffectProcessState,
} from "../src/simulation/TrackEffect";
import type { MapSurfaceRenderCommand } from "../src/world/GameMap";

describe("track effect", () => {
  it("adapts the etrack.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TrackEffect");
    const secondImport = await import("../src/simulation/TrackEffect");

    expect(ETRACK_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETRACK_HEADER_GUARD_PORTED).toBe(
      firstImport.ETRACK_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETRACK_TYPE as track effect identifiers", () => {
    expect(TrackEffectType.Tank).toBe(0);
    expect(TrackEffectType.Jeep).toBe(1);
    expect(TrackEffectType.MaxTrackTypes).toBe(2);
  });

  it("keeps killed track effects unchanged while processing", () => {
    const state: TrackEffectProcessState = {
      killMe: true,
      startTime: 10,
      tileIndex: 2,
    };

    processTrackEffect(state, 14);

    expect(state).toEqual({
      killMe: true,
      startTime: 10,
      tileIndex: 2,
    });
  });

  it("uses the first tile before the fade thresholds", () => {
    const state: TrackEffectProcessState = {
      killMe: false,
      startTime: 10,
      tileIndex: 2,
    };

    processTrackEffect(state, 10 + TRACK_EFFECT_FRAME_1_SECONDS - 0.01);

    expect(state.killMe).toBe(false);
    expect(state.tileIndex).toBe(0);
  });

  it("advances to the second tile at the first fade threshold", () => {
    const state: TrackEffectProcessState = {
      killMe: false,
      startTime: 10,
      tileIndex: 0,
    };

    processTrackEffect(state, 10 + TRACK_EFFECT_FRAME_1_SECONDS);

    expect(state.killMe).toBe(false);
    expect(state.tileIndex).toBe(1);
  });

  it("advances to the third tile at the second fade threshold", () => {
    const state: TrackEffectProcessState = {
      killMe: false,
      startTime: 0,
      tileIndex: 0,
    };

    processTrackEffect(state, TRACK_EFFECT_FRAME_2_SECONDS);

    expect(state.killMe).toBe(false);
    expect(state.tileIndex).toBe(2);
  });

  it("expires the track effect at the kill threshold", () => {
    const state: TrackEffectProcessState = {
      killMe: false,
      startTime: 0,
      tileIndex: 0,
    };

    processTrackEffect(state, TRACK_EFFECT_KILL_SECONDS);

    expect(state.killMe).toBe(true);
    expect(state.tileIndex).toBe(0);
  });

  it("replaces ETrack DoPreRender as render commands for enabled track marks", () => {
    const surface = { id: "track" };
    const state = createPreRenderState(surface);
    state.layTrack = [true, true];
    state.x = [30, 40];
    state.y = [50, 60];
    const commands = doPreRenderTrackEffect(state, createTrackMap());

    expect(commands).toEqual([
      {
        surface,
        x: 20,
        y: 45,
        renderHit: false,
        aboutCenter: true,
      },
      {
        surface,
        x: 30,
        y: 55,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces ETrack DoPreRender by skipping killed or disabled track marks", () => {
    const surface = { id: "track" };
    const killed = createPreRenderState(surface);
    killed.killMe = true;
    const oneTrack = createPreRenderState(surface);
    oneTrack.layTrack = [false, true];

    expect(doPreRenderTrackEffect(killed, createTrackMap())).toEqual([]);
    expect(doPreRenderTrackEffect(oneTrack, createTrackMap())).toEqual([
      {
        surface,
        x: 30,
        y: 55,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces ETrack DoPreRender as empty commands when the current track surface is missing", () => {
    const state = createPreRenderState({ id: "track" });
    state.tileIndex = 2;

    expect(doPreRenderTrackEffect(state, createTrackMap())).toEqual([]);
  });
});

function createPreRenderState<TSurface>(
  surface: TSurface,
): TrackEffectPreRenderState<TSurface> {
  return {
    killMe: false,
    trackImages: [[[[surface]]]],
    type: 0,
    palette: 0,
    direction: 0,
    tileIndex: 0,
    layTrack: [true, true],
    x: [30, 40],
    y: [50, 60],
  };
}

function createTrackMap<TSurface>(): {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<TSurface>;
} {
  return {
    renderZSurface(surface, x, y, renderHit, aboutCenter) {
      return {
        surface,
        x: x - 10,
        y: y - 5,
        renderHit,
        aboutCenter,
      };
    },
  };
}
