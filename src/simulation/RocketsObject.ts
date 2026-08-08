/**
 * Upstream: orockets.h
 */

/**
 * Port of upstream `_OROCKETS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: orockets.h:2
 */
export const OROCKETS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ORockets::render_img` source.
 * Role: Identifies the browser asset used to render rocket pickup objects.
 * Upstream: orockets.cpp:24
 */
export const ROCKETS_OBJECT_IMAGE_PATH = "assets/other/map_items/rockets.png";

/**
 * Replacement for upstream `ORockets::render_img`.
 * Role: Holds the loaded rocket pickup render asset.
 * Upstream: orockets.h:16
 */
export type RocketsObjectRenderState<TImage> = {
  renderImage: TImage | null;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a map-relative render command for a rocket pickup object.
 * Upstream: orockets.cpp:33
 */
export type RocketsObjectRenderMap<TImage, TCommand> = {
  renderZSurface(surface: TImage, x: number, y: number): TCommand;
};

/**
 * Replacement state for upstream `ORockets::DoRender`.
 * Role: Holds the rocket pickup image and map-space location used for object rendering.
 * Upstream: orockets.cpp:27-41
 */
export type RocketsObjectDoRenderState<TImage> = {
  renderImage: TImage | null;
  position: {
    x: number;
    y: number;
  };
};

/**
 * Port of upstream `ORockets::Init`.
 * Role: Loads the shared rocket pickup render asset through the browser asset loader.
 * Upstream: orockets.cpp:22-25
 */
export function initRocketsObjectImage<TImage>(
  state: RocketsObjectRenderState<TImage>,
  loadImage: (path: string) => TImage,
): void {
  state.renderImage = loadImage(ROCKETS_OBJECT_IMAGE_PATH);
}

/**
 * Replacement for upstream `ORockets::DoRender`.
 * Role: Builds the map-relative rocket pickup render command.
 * Upstream: orockets.cpp:27-41
 */
export function renderRocketsObject<TImage, TCommand>(
  state: RocketsObjectDoRenderState<TImage>,
  map: RocketsObjectRenderMap<TImage, TCommand>,
): TCommand | null {
  if (!state.renderImage) return null;

  return map.renderZSurface(
    state.renderImage,
    state.position.x,
    state.position.y,
  );
}

/**
 * Port of upstream `ORockets::Process`.
 * Role: Reports no per-tick processing work for rocket pickup objects.
 * Upstream: orockets.cpp:43-46
 */
export function processRocketsObject(): number {
  return 0;
}

/**
 * Port of upstream `ORockets::SetOwner`.
 * Role: Ignores ownership changes for rocket pickup objects.
 * Upstream: orockets.cpp:48-51
 */
export function setRocketsObjectOwner(owner: number): void {
  void owner;
}
