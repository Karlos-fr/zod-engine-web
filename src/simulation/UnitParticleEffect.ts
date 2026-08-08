/**
 * Upstream: eunitparticle.h
 */

/**
 * Port of upstream `_EUNITPARTICLE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: eunitparticle.h:2
 */
export const EUNIT_PARTICLE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EUnitParticle` sprite frame count.
 * Role: Defines how many unit-particle frames are loaded during initialization.
 * Upstream: eunitparticle.cpp:48-52
 */
export const UNIT_PARTICLE_FRAME_COUNT = 20;

/**
 * Port of upstream `EUnitParticle` image state.
 * Role: Stores loaded unit-particle frame asset paths.
 * Upstream: eunitparticle.cpp:43-53
 */
export type UnitParticleInitState = {
  baseImages: string[];
};

/**
 * Port of upstream `EUnitParticle::Process` mutable fields.
 * Role: Tracks unit-particle animation, lifetime, and ballistic motion.
 * Upstream: eunitparticle.cpp:55-88
 */
export type UnitParticleProcessState = {
  killme: boolean;
  ztime: { ztime: number } | null;
  initTime: number;
  finalTime: number;
  nextProcessTime: number;
  renderIndex: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  rise: number;
  size: number;
};

/**
 * Replacement for upstream `ZSDL_Surface::SetSize` dependency.
 * Role: Provides the scale update applied to the unit-particle frame before rendering.
 * Upstream: eunitparticle.cpp:98
 */
export type UnitParticleRenderImage = {
  setSize?(size: number): void;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a map-relative render command for a unit-particle frame.
 * Upstream: eunitparticle.cpp:102
 */
export type UnitParticleRenderMap<TImage, TCommand> = {
  renderZSurface(surface: TImage, x: number, y: number): TCommand;
};

/**
 * Replacement state for upstream `EUnitParticle::DoRender`.
 * Role: Holds the active unit-particle frame, scale, and visibility state.
 * Upstream: eunitparticle.cpp:90-105
 */
export type UnitParticleRenderState<TImage> = {
  killme: boolean;
  x: number;
  y: number;
  size: number;
  renderIndex: number;
  baseImages: readonly TImage[];
};

/**
 * Port of upstream `EUnitParticle::Init`.
 * Role: Initializes unit-particle frame asset paths.
 * Upstream: eunitparticle.cpp:43-53
 */
export function initUnitParticleEffect(state: UnitParticleInitState): void {
  state.baseImages = Array.from(
    { length: UNIT_PARTICLE_FRAME_COUNT },
    (_value, index) =>
      `assets/other/particles/unit_particle_n${index.toString().padStart(2, "0")}.png`,
  );
}

/**
 * Port of upstream `EUnitParticle::Process`.
 * Role: Advances unit-particle animation, lifetime, and ballistic position.
 * Upstream: eunitparticle.cpp:55-88
 */
export function processUnitParticleEffect(
  state: UnitParticleProcessState,
): void {
  const currentTime = state.ztime?.ztime ?? 0;

  if (state.killme) return;

  if (currentTime >= state.finalTime) {
    state.killme = true;
    return;
  }

  if (currentTime >= state.nextProcessTime) {
    state.renderIndex += 1;
    if (state.renderIndex >= UNIT_PARTICLE_FRAME_COUNT) state.renderIndex = 0;

    state.nextProcessTime = currentTime + 0.03;
  }

  const timeDifference = currentTime - state.initTime;

  state.x = state.startX + state.deltaX * timeDifference;
  state.y = state.startY + state.deltaY * timeDifference;
  state.size =
    -(state.rise / (state.finalTime - state.initTime)) *
      (timeDifference * timeDifference) +
    state.rise * timeDifference;
  state.size += 1;
  state.y -= (state.size - 1) * 65;
  state.size = 1;
}

/**
 * Replacement for upstream `EUnitParticle::DoRender`.
 * Role: Builds the map-relative scaled unit-particle frame render command.
 * Upstream: eunitparticle.cpp:90-105
 */
export function renderUnitParticleEffect<
  TImage extends UnitParticleRenderImage,
  TCommand,
>(
  state: UnitParticleRenderState<TImage>,
  zmap: UnitParticleRenderMap<TImage, TCommand>,
): TCommand | null {
  if (state.killme) return null;

  const image = state.baseImages[state.renderIndex];
  if (!image) return null;

  image.setSize?.(state.size);

  return zmap.renderZSurface(image, state.x, state.y);
}
