/**
 * Upstream: etrack.h
 */

import type { MapSurfaceRenderCommand } from "../world/GameMap";
import {
  MAX_ANGLE_TYPES,
  PlanetType,
} from "./SimulationConstants";

/**
 * Port of upstream `_ETRACK_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etrack.h:2
 */
export const ETRACK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETRACK_TYPE`.
 * Role: Identifies the vehicle track effect sprite set.
 * Upstream: etrack.h:6-9
 */
export enum TrackEffectType {
  Tank = 0,
  Jeep = 1,
  MaxTrackTypes = 2,
}

/**
 * Port of upstream `ETrack::Process` frame timing thresholds.
 * Role: Defines when track marks advance frames and expire.
 * Upstream: etrack.cpp:82-84
 */
export const TRACK_EFFECT_FRAME_1_SECONDS = 3.3;
export const TRACK_EFFECT_FRAME_2_SECONDS = 3.6;
export const TRACK_EFFECT_KILL_SECONDS = 3.9;

/**
 * Port of upstream `ETrack::Process` mutable fields.
 * Role: Captures the track effect lifetime and tile image index.
 * Upstream: etrack.cpp:73-86
 */
export type TrackEffectProcessState = {
  killMe: boolean;
  startTime: number;
  tileIndex: number;
};

export type TrackEffectPreRenderState<TSurface> = {
  killMe: boolean;
  trackImages: readonly (readonly (readonly (readonly TSurface[])[])[])[];
  type: number;
  palette: number;
  direction: number;
  tileIndex: number;
  layTrack: readonly boolean[];
  x: readonly number[];
  y: readonly number[];
};

/**
 * Port of upstream `ETrack::Init` mutable fields.
 * Role: Holds loaded vehicle track effect images and the initialization flag.
 * Upstream: etrack.cpp:45-71
 */
export type TrackEffectInitState<TImage = unknown> = {
  trackImages: TImage[][][][];
  finishedInit: boolean;
};

/**
 * Replacement for upstream `ZSDL_Surface::LoadBaseImage`.
 * Role: Loads one vehicle track effect image asset.
 * Upstream: etrack.cpp:65
 */
export type TrackEffectImageLoader<TImage> = (filename: string) => TImage;

const TRACK_EFFECT_TYPE_NAMES = ["tank", "jeep"] as const;
const TRACK_EFFECT_PLANET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;
const TRACK_EFFECT_ROTATIONS = [0, 45, 90, 135] as const;

/**
 * Port of upstream `ETrack::Init`.
 * Role: Loads vehicle track effect images and mirrors the first four rotations to the opposite buckets.
 * Upstream: etrack.cpp:45-71
 */
export function initTrackEffect<TImage>(
  state: TrackEffectInitState<TImage>,
  loadImage: TrackEffectImageLoader<TImage>,
): void {
  for (let type = 0; type < TrackEffectType.MaxTrackTypes; type += 1) {
    state.trackImages[type] ??= [];

    for (let planet = 0; planet < PlanetType.Max; planet += 1) {
      if (planet === PlanetType.City) continue;
      if (type === TrackEffectType.Jeep && planet !== PlanetType.Desert) {
        continue;
      }

      state.trackImages[type][planet] ??= [];

      for (let rotation = 0; rotation < TRACK_EFFECT_ROTATIONS.length; rotation += 1) {
        state.trackImages[type][planet][rotation] ??= [];

        for (let frame = 0; frame < 3; frame += 1) {
          state.trackImages[type][planet][rotation][frame] = loadImage(
            `assets/units/vehicles/track_effects/${TRACK_EFFECT_TYPE_NAMES[type]}_track_${TRACK_EFFECT_PLANET_NAMES[planet]}_r${TRACK_EFFECT_ROTATIONS[
              rotation
            ]
              .toString()
              .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          );
        }

        state.trackImages[type][planet][rotation + (MAX_ANGLE_TYPES >> 1)] =
          state.trackImages[type][planet][rotation];
      }
    }
  }

  state.finishedInit = true;
}

/**
 * Port of upstream `ETrack::Process`.
 * Role: Advances the track tile index as it ages and expires old track marks.
 * Upstream: etrack.cpp:73-86
 */
export function processTrackEffect(
  state: TrackEffectProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  const delta = currentTime - state.startTime;

  if (delta >= TRACK_EFFECT_KILL_SECONDS) state.killMe = true;
  else if (delta >= TRACK_EFFECT_FRAME_2_SECONDS) state.tileIndex = 2;
  else if (delta >= TRACK_EFFECT_FRAME_1_SECONDS) state.tileIndex = 1;
  else state.tileIndex = 0;
}

/**
 * Replacement for upstream `ETrack::DoPreRender`.
 * Role: Builds map render commands for enabled vehicle track marks.
 * Upstream: etrack.cpp:88-95
 */
export function doPreRenderTrackEffect<TSurface>(
  state: TrackEffectPreRenderState<TSurface>,
  zmap: {
    renderZSurface(
      surface: TSurface,
      x: number,
      y: number,
      renderHit: boolean,
      aboutCenter: boolean,
    ): MapSurfaceRenderCommand<TSurface>;
  },
): Array<MapSurfaceRenderCommand<TSurface>> {
  if (state.killMe) return [];

  const surface =
    state.trackImages[state.type]?.[state.palette]?.[state.direction]?.[
      state.tileIndex
    ];
  if (surface === undefined) return [];

  const commands: Array<MapSurfaceRenderCommand<TSurface>> = [];
  for (let i = 0; i < 2; i += 1) {
    if (state.layTrack[i]) {
      commands.push(
        zmap.renderZSurface(surface, state.x[i] ?? 0, state.y[i] ?? 0, false, true),
      );
    }
  }

  return commands;
}
