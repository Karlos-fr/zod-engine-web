/**
 * Upstream: emapobjectturrent.h
 */

import { SoundEngineSound } from "../audio/AudioService";
import { MAP_ITEM_TYPE_COUNT } from "./WorldConstants";

/**
 * Marker exported from the map object turret effect module.
 * Role: Marks an upstream header boundary.
 * Upstream: emapobjectturrent.h:2
 */
export const EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED = true;

export type MapObjectTurrentImage = {
  loadBaseImage(filename: string): void;
};

/**
 * Port of upstream `ZSDL_Surface::GetBaseSurface` use in `EMapObjectTurrent`.
 * Role: Reports whether a map-object turret effect image has a loaded base surface.
 * Upstream: emapobjectturrent.cpp:35
 */
export type MapObjectTurrentBaseImage = {
  getBaseSurface(): unknown | null;
};

/**
 * Replacement for upstream rotozoom image state used by `EMapObjectTurrent::DoRender`.
 * Role: Applies the current angle and scale before map-relative rendering.
 * Upstream: emapobjectturrent.cpp:134-135
 */
export type MapObjectTurrentRenderImage = {
  setAngle?(angle: number): void;
  setSize?(size: number): void;
};

export type MapObjectTurrentInitState = {
  objectImages: readonly MapObjectTurrentImage[];
  finishedInit: boolean;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for map-object turret debris.
 * Upstream: emapobjectturrent.cpp:139
 */
export type MapObjectTurrentRenderMap<TImage, TCommand> = {
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `EMapObjectTurrent::DoRender`.
 * Role: Holds the active object image, transform, and visibility state.
 * Upstream: emapobjectturrent.cpp:126-142
 */
export type MapObjectTurrentRenderState<TImage> = {
  killMe: boolean;
  x: number;
  y: number;
  objectIndex: number;
  angle: number;
  size: number;
  objectImages: readonly TImage[];
};

/**
 * Port of upstream `EMapObjectTurrent` construction arguments.
 * Role: Describes a map-object turret effect spawned by an object map item.
 * Upstream: emapobjectturrent.h:9
 */
export type MapObjectTurrentEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  offsetTime: number;
  objectIndex: number;
};

/**
 * Port of upstream `EToughMushroom` creation by `EMapObjectTurrent::EndExplosion`.
 * Role: Describes the mushroom effect spawned when thrown map-object debris lands.
 * Upstream: emapobjectturrent.cpp:157
 */
export type MapObjectTurrentToughMushroomSpawn<TTime = unknown> = {
  kind: "toughMushroom";
  ztime: TTime | null;
  x: number;
  y: number;
  size: number;
};

/**
 * Port of upstream `EUnitParticle` creation by `EMapObjectTurrent::EndExplosion`.
 * Role: Describes one landing particle spawned by thrown map-object debris.
 * Upstream: emapobjectturrent.cpp:162-163
 */
export type MapObjectTurrentUnitParticleSpawn<TTime = unknown> = {
  kind: "unitParticle";
  ztime: TTime | null;
  x: number;
  y: number;
  maxX: number;
  maxY: number;
};

export type MapObjectTurrentEndExplosionSpawn<TTime = unknown> =
  | MapObjectTurrentToughMushroomSpawn<TTime>
  | MapObjectTurrentUnitParticleSpawn<TTime>;

/**
 * Port of upstream restricted turret explosion sound call.
 * Role: Describes the positional sound emitted when thrown map-object debris lands.
 * Upstream: emapobjectturrent.cpp:103
 */
export type MapObjectTurrentRestrictedSoundCommand = {
  sound: SoundEngineSound | number;
  x: number;
  y: number;
};

/**
 * Port of upstream `EMapObjectTurrent::Process` mutable fields.
 * Role: Tracks thrown map-object debris flight timing, position, scale, rotation, and impact point.
 * Upstream: emapobjectturrent.cpp:91-124
 */
export type MapObjectTurrentProcessState<TTime = unknown> = {
  killMe: boolean;
  ztime: TTime | null;
  finalTime: number;
  initTime: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  dx: number;
  dy: number;
  size: number;
  rise: number;
  angle: number;
  dangle: number;
  impactSoundX: number;
  impactSoundY: number;
  targetX: number;
  targetY: number;
};

/**
 * Port of upstream `EMapObjectTurrent::Init`.
 * Role: Loads no-shadow map item images used by map object turret effects.
 * Upstream: emapobjectturrent.cpp:77-89
 */
export function initMapObjectTurrentEffect(
  state: MapObjectTurrentInitState,
): void {
  for (let i = 0; i < MAP_ITEM_TYPE_COUNT; i += 1) {
    state.objectImages[i]?.loadBaseImage(
      `assets/other/map_items/no_shadow${i}.png`,
    );
  }

  state.finishedInit = true;
}

/**
 * Replacement for upstream `EMapObjectTurrent::DoRender`.
 * Role: Builds the centered map-relative map-object turret render command.
 * Upstream: emapobjectturrent.cpp:126-142
 */
export function renderMapObjectTurrentEffect<
  TImage extends MapObjectTurrentRenderImage,
  TCommand,
>(
  state: MapObjectTurrentRenderState<TImage>,
  zmap: MapObjectTurrentRenderMap<TImage, TCommand>,
): TCommand | null {
  if (state.killMe) return null;

  const image = state.objectImages[state.objectIndex];
  if (!image) return null;

  image.setAngle?.(state.angle);
  image.setSize?.(state.size);

  return zmap.renderZSurface(image, state.x, state.y, false, true);
}

/**
 * Port of upstream `EMapObjectTurrent::EndExplosion`.
 * Role: Spawns landing mushroom and unit particles for thrown map-object debris.
 * Upstream: emapobjectturrent.cpp:144-164
 */
export function endMapObjectTurrentExplosion<TTime>(
  state: {
    ztime: TTime | null;
    targetX: number;
    targetY: number;
  },
  effectList: MapObjectTurrentEndExplosionSpawn<TTime>[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  if (!effectList) return;

  effectList.push({
    kind: "toughMushroom",
    ztime: state.ztime,
    x: state.targetX,
    y: state.targetY,
    size: 1,
  });

  const particles = 10 + (Math.trunc(randomInt(8)) % 8);
  for (let i = 0; i < particles; i += 1) {
    effectList.push({
      kind: "unitParticle",
      ztime: state.ztime,
      x: state.targetX,
      y: state.targetY,
      maxX: 65,
      maxY: 55,
    });
  }
}

/**
 * Port of upstream `EMapObjectTurrent::Process`.
 * Role: Advances thrown map-object debris and resolves landing effects at final time.
 * Upstream: emapobjectturrent.cpp:91-124
 */
export function processMapObjectTurrentEffect<TTime>(
  state: MapObjectTurrentProcessState<TTime>,
  currentTime: number,
  effectList: MapObjectTurrentEndExplosionSpawn<TTime>[] | null,
  soundCommands: MapObjectTurrentRestrictedSoundCommand[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  if (state.killMe) return;

  if (currentTime >= state.finalTime) {
    state.killMe = true;
    endMapObjectTurrentExplosion(state, effectList, randomInt);
    soundCommands?.push({
      sound: SoundEngineSound.TurrentExplosionSnd,
      x: state.impactSoundX,
      y: state.impactSoundY,
    });
    return;
  }

  const timeDifference = currentTime - state.initTime;
  state.x = state.sx + state.dx * timeDifference;
  state.y = state.sy + state.dy * timeDifference;

  state.size =
    -(state.rise / (state.finalTime - state.initTime)) *
      (timeDifference * timeDifference) +
    state.rise * timeDifference;
  state.y -= state.size * 30;
  state.size += 1;

  state.angle = normalizeMapObjectTurrentAngle(state.dangle * timeDifference);
}

function normalizeMapObjectTurrentAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}
