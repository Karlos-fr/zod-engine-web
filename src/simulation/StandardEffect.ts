/**
 * Upstream: estandard.h
 */

/**
 * Port of upstream `_ESTANDARD_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: estandard.h:2
 */
export const ESTANDARD_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `estandard_objects`.
 * Role: Identifies the standard death/fire effect sprite set.
 * Upstream: estandard.h:6-9
 */
export enum StandardEffectObject {
  BigSmoke = 0,
  LittleFire = 1,
  SmallFireSmoke = 2,
  Fire = 3,
}

/**
 * Port of upstream `EStandard::Init` frame loop count.
 * Role: Defines how many frames are loaded for each standard effect sprite set.
 * Upstream: estandard.cpp:71-84
 */
export const STANDARD_EFFECT_FRAME_COUNT = 4;

/**
 * Port of upstream `EStandard` vertical sort field.
 * Role: Provides the bottom-y value used to order standard effects for rendering.
 * Upstream: estandard.h:31
 */
export type StandardEffectSortState = {
  by: number;
};

/**
 * Port of upstream `EStandard::Process` frame cadence.
 * Role: Advances standard effect sprite frames at the original fixed interval.
 * Upstream: estandard.cpp:98
 */
export const STANDARD_EFFECT_PROCESS_INTERVAL_SECONDS = 0.15;

/**
 * Port of upstream `EStandard::Process` mutable fields.
 * Role: Captures the render frame state updated by the process step.
 * Upstream: estandard.cpp:89-102
 */
export type StandardEffectProcessState = {
  killMe: boolean;
  renderIndex: number;
  maxRender: number;
  nextProcessTime: number;
};

/**
 * Port of upstream `EStandard` image fields.
 * Role: Stores standard smoke/fire frame asset paths initialized by `EStandard::Init`.
 * Upstream: estandard.cpp:73-83
 */
export type StandardEffectInitState = {
  bigSmokeFrames: string[];
  littleFireFrames: string[];
  smallFireSmokeFrames: string[];
  fireFrames: string[];
  finishedInit: boolean;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a map-relative render command for a standard effect frame.
 * Upstream: estandard.cpp:110
 */
export type StandardEffectRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `EStandard::DoRender`.
 * Role: Holds the active standard effect frame sequence and visibility state.
 * Upstream: estandard.cpp:104-113
 */
export type StandardEffectRenderState<TSurface> = {
  killMe: boolean;
  x: number;
  y: number;
  renderIndex: number;
  renderImages: readonly TSurface[];
};

/**
 * Port of upstream `sort_estandards_func`.
 * Role: Orders standard effects by their bottom-y render coordinate.
 * Upstream: estandard.cpp:115-118
 */
export function isStandardEffectBefore(
  a: StandardEffectSortState,
  b: StandardEffectSortState,
): boolean {
  return a.by < b.by;
}

/**
 * Port of upstream `EStandard::Init`.
 * Role: Initializes standard smoke/fire frame asset paths and marks initialization complete.
 * Upstream: estandard.cpp:66-87
 */
export function initStandardEffect(state: StandardEffectInitState): void {
  const frameIndexes = Array.from(
    { length: STANDARD_EFFECT_FRAME_COUNT },
    (_value, index) => index.toString().padStart(2, "0"),
  );

  state.bigSmokeFrames = frameIndexes.map(
    (index) =>
      `assets/units/vehicles/death_effects/big_smoke_n${index}.png`,
  );
  state.littleFireFrames = frameIndexes.map(
    (index) =>
      `assets/units/vehicles/death_effects/little_fire_n${index}.png`,
  );
  state.smallFireSmokeFrames = frameIndexes.map(
    (index) =>
      `assets/units/vehicles/death_effects/small_fire_smoke_n${index}.png`,
  );
  state.fireFrames = frameIndexes.map(
    (index) => `assets/units/vehicles/death_effects/fire_n${index}.png`,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `EStandard::Process`.
 * Role: Advances the current render frame when the effect reaches its process time.
 * Upstream: estandard.cpp:89-102
 */
export function processStandardEffect(
  state: StandardEffectProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextProcessTime) {
    state.renderIndex += 1;
    if (state.renderIndex >= state.maxRender) state.renderIndex = 0;

    state.nextProcessTime =
    currentTime + STANDARD_EFFECT_PROCESS_INTERVAL_SECONDS;
  }
}

/**
 * Replacement for upstream `EStandard::DoRender`.
 * Role: Builds the map-relative standard effect frame render command.
 * Upstream: estandard.cpp:104-113
 */
export function renderStandardEffect<TSurface, TCommand>(
  state: StandardEffectRenderState<TSurface>,
  zmap: StandardEffectRenderMap<TSurface, TCommand>,
): TCommand | null {
  if (state.killMe) return null;

  const surface = state.renderImages[state.renderIndex];
  if (!surface) return null;

  return zmap.renderZSurface(surface, state.x, state.y, false, false);
}
