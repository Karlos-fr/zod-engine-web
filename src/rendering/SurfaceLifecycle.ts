/**
 * Upstream: zsdl.cpp
 */

/**
 * Browser-side replacement for an SDL surface pointer reference.
 * Role: Carries a nullable surface-like object whose ownership can be cleared.
 * Upstream: zsdl.cpp:749-756
 */
export type SurfaceReference<TSurface> = {
  current: TSurface | null;
};

export type RotozoomSurfaceAngleState<TSurface> = {
  useRenderCommands: boolean;
  angle: number;
  rotozoomSurface: SurfaceReference<TSurface>;
  rotozoomLoaded: boolean;
};

export type RotozoomSurfaceSizeState<TSurface> = {
  useRenderCommands: boolean;
  size: number;
  rotozoomSurface: SurfaceReference<TSurface>;
  rotozoomLoaded: boolean;
};

export type RotozoomSurfaceLoadState<TSurface> = {
  surface: SurfaceReference<TSurface>;
  angle: number;
  size: number;
  rotozoomSurface: SurfaceReference<TSurface>;
  rotozoomLoaded: boolean;
};

/**
 * Replacement for upstream `SDL_RotoZoomSurface`.
 * Role: Represents the browser-side state used to cache a rotated and scaled surface.
 * Upstream: zsdl.h:25-37
 */
export type RotozoomImageCacheState<TSurface> = RotozoomSurfaceLoadState<TSurface>;

/**
 * Replacement for upstream `SDL_ZoomSurface`.
 * Role: Represents the browser-side state used to cache a scaled surface.
 * Upstream: zsdl.h:39-51
 */
export type ZoomImageCacheState<TSurface> = RotozoomSurfaceLoadState<TSurface>;

/**
 * Replacement for upstream `SDL_RotateSurface`.
 * Role: Represents the browser-side state used to cache a rotated surface.
 * Upstream: zsdl.h:53-64
 */
export type RotateImageCacheState<TSurface> = RotozoomSurfaceLoadState<TSurface>;

export type BaseImageFileLoadState = {
  imageFilename: string;
};

export type BaseImageSurfaceLoadState<TSurface, TTexture> =
  RenderableSurfaceUnloadState<TSurface, TTexture> & {
    imageFilename: string;
  };

export type NewSurfaceRequest = {
  width: number;
  height: number;
  bytesPerPixel: 4;
  redMask: 0xff000000;
  greenMask: 0x0000ff00;
  blueMask: 0x00ff0000;
  alphaMask: 0x000000ff;
};

export type SurfaceAlphaState<TSurface> = {
  useRenderCommands: boolean;
  alpha: number;
  surface: SurfaceReference<TSurface>;
  rotozoomSurface: SurfaceReference<TSurface>;
};

export type SurfaceDisplayFormatState<TSurface> = SurfaceAlphaState<TSurface>;

export type SurfaceRenderingModeState = {
  useRenderCommands: boolean;
};

export type SurfaceTextureFormat = "RGBA" | "BGRA" | "RGB" | "BGR";

export type SurfaceTextureSource = {
  width: number;
  height: number;
  bytesPerPixel: number;
  redMask: number;
  pixels: ArrayBufferView;
};

export type SurfaceTextureUpload<TTexture> = {
  texture: TTexture;
  width: number;
  height: number;
  bytesPerPixel: number;
  format: SurfaceTextureFormat;
  pixels: ArrayBufferView;
};

export type RenderableSurfaceTextureState<TSurface, TTexture> = {
  surface: SurfaceReference<TSurface>;
  texture: TTexture | null;
  textureLoaded: boolean;
};

export type RenderableSurfaceUnloadState<TSurface, TTexture> = {
  surface: SurfaceReference<TSurface>;
  rotozoomSurface: SurfaceReference<TSurface>;
  texture: TTexture | null;
  textureLoaded: boolean;
  rotozoomLoaded: boolean;
};

/**
 * Replacement for upstream `ZSDL_FreeSurface`.
 * Role: Releases the current surface, when present, and clears the observable reference.
 * Upstream: zsdl.cpp:749-756
 */
export function releaseSurfaceReference<TSurface>(
  surface: SurfaceReference<TSurface>,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
): void {
  if (!surface.current) {
    return;
  }

  disposeSurface(surface.current);
  surface.current = null;
}

/**
 * Replacement for upstream `ZSDL_Surface::SetMainSoftwareSurface`.
 * Role: Stores the main software rendering surface reference.
 * Upstream: zsdl_opengl.cpp:267-270
 */
export function setMainSoftwareSurface<TSurface>(
  screen: SurfaceReference<TSurface>,
  surface: TSurface | null,
): void {
  screen.current = surface;
}

/**
 * Replacement for upstream `ZSDL_Surface::SetUseOpenGL`.
 * Role: Stores whether this surface should use the render-command rendering path.
 * Upstream: zsdl_opengl.cpp:262-265
 */
export function setSurfaceUseRenderCommands(
  state: SurfaceRenderingModeState,
  useRenderCommands: boolean,
): void {
  state.useRenderCommands = useRenderCommands;
}

/**
 * Replacement for upstream `ZSDL_Surface::SetAngle`.
 * Role: Stores the surface rotation angle and invalidates cached software rotozoom output when needed.
 * Upstream: zsdl_opengl.cpp:302-313
 */
export function setRotozoomSurfaceAngle<TSurface>(
  state: RotozoomSurfaceAngleState<TSurface>,
  angle: number,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
): void {
  if (!state.useRenderCommands && state.angle !== angle) {
    releaseSurfaceReference(state.rotozoomSurface, disposeSurface);
    state.rotozoomLoaded = false;
  }

  state.angle = angle;
}

/**
 * Replacement for upstream `ZSDL_Surface::SetSize`.
 * Role: Stores surface scale and invalidates cached software rotozoom output when needed.
 * Upstream: zsdl_opengl.cpp:289-300
 */
export function setRotozoomSurfaceSize<TSurface>(
  state: RotozoomSurfaceSizeState<TSurface>,
  size: number,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
): void {
  if (!state.useRenderCommands && state.size !== size) {
    releaseSurfaceReference(state.rotozoomSurface, disposeSurface);
    state.rotozoomLoaded = false;
  }

  state.size = size;
}

/**
 * Replacement for upstream `ZSDL_Surface::SetAlpha`.
 * Role: Stores surface alpha and applies it to software surfaces when not using GL rendering.
 * Upstream: zsdl_opengl.cpp:315-324
 */
export function setRenderableSurfaceAlpha<TSurface>(
  state: SurfaceAlphaState<TSurface>,
  alpha: number,
  applyAlpha: (surface: TSurface, alpha: number) => void = (): void =>
    undefined,
): void {
  state.alpha = alpha;

  if (state.useRenderCommands) {
    return;
  }

  if (state.surface.current) {
    applyAlpha(state.surface.current, alpha);
  }
  if (state.rotozoomSurface.current) {
    applyAlpha(state.rotozoomSurface.current, alpha);
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::UseDisplayFormat`.
 * Role: Converts the software surface to display format and reapplies its alpha state.
 * Upstream: zsdl_opengl.cpp:158-171
 */
export function useRenderableSurfaceDisplayFormat<TSurface>(
  state: SurfaceDisplayFormatState<TSurface>,
  convertSurface: (surface: TSurface) => TSurface,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
  applyAlpha: (surface: TSurface, alpha: number) => void = (): void =>
    undefined,
): void {
  if (!state.surface.current || state.useRenderCommands) {
    return;
  }

  const previousSurface = state.surface.current;
  state.surface.current = convertSurface(previousSurface);
  disposeSurface(previousSurface);
  setRenderableSurfaceAlpha(state, state.alpha, applyAlpha);
}

/**
 * Replacement for upstream `ZSDL_Surface::LoadBaseImage`.
 * Role: Loads an image file and forwards the resulting surface to the base image loader.
 * Upstream: zsdl_opengl.cpp:105-113
 */
export function loadBaseImageFromFile<TSurface>(
  state: BaseImageFileLoadState,
  filename: string,
  loadImage: (filename: string) => TSurface | null,
  loadBaseImage: (surface: TSurface | null) => void,
): void {
  state.imageFilename = filename;
  loadBaseImage(loadImage(filename));
}

/**
 * Replacement for upstream `SDL_RotoZoomSurface::LoadBaseImage`.
 * Role: Loads the base image used by the rotated and scaled surface cache.
 * Upstream: zsdl.cpp:16-19
 */
export function loadRotozoomCacheBaseImage<TSurface>(
  state: BaseImageFileLoadState,
  filename: string,
  loadImage: (filename: string) => TSurface | null,
  loadBaseImage: (surface: TSurface | null) => void,
): void {
  loadBaseImageFromFile(state, filename, loadImage, loadBaseImage);
}

/**
 * Replacement for upstream `SDL_ZoomSurface::LoadBaseImage`.
 * Role: Loads the base image used by the scaled surface cache.
 * Upstream: zsdl.cpp:78-81
 */
export function loadZoomCacheBaseImage<TSurface>(
  state: BaseImageFileLoadState,
  filename: string,
  loadImage: (filename: string) => TSurface | null,
  loadBaseImage: (surface: TSurface | null) => void,
): void {
  loadBaseImageFromFile(state, filename, loadImage, loadBaseImage);
}

/**
 * Replacement for upstream `SDL_RotateSurface::LoadBaseImage`.
 * Role: Loads the base image used by the rotated surface cache.
 * Upstream: zsdl.cpp:128-131
 */
export function loadRotateCacheBaseImage<TSurface>(
  state: BaseImageFileLoadState,
  filename: string,
  loadImage: (filename: string) => TSurface | null,
  loadBaseImage: (surface: TSurface | null) => void,
): void {
  loadBaseImageFromFile(state, filename, loadImage, loadBaseImage);
}

/**
 * Replacement for upstream `ZSDL_Surface::LoadNewSurface`.
 * Role: Creates a blank 32-bit surface, stores it as the base image, and clears it to black.
 * Upstream: zsdl_opengl.cpp:115-129
 */
export function loadNewRenderableSurface<TSurface>(
  width: number,
  height: number,
  createSurface: (request: NewSurfaceRequest) => TSurface | null,
  loadBaseImage: (surface: TSurface | null) => void,
  fillSurface: (
    region: { x: number; y: number; width: number; height: number },
    red: number,
    green: number,
    blue: number,
  ) => void,
): TSurface | null {
  const surface = createSurface({
    width,
    height,
    bytesPerPixel: 4,
    redMask: 0xff000000,
    greenMask: 0x0000ff00,
    blueMask: 0x00ff0000,
    alphaMask: 0x000000ff,
  });

  loadBaseImage(surface);

  if (surface) {
    fillSurface({ x: 0, y: 0, width, height }, 0, 0, 0);
  }

  return surface;
}

/**
 * Replacement for upstream `ZSDL_Surface::LoadBaseImage`.
 * Role: Replaces the base software surface with an alpha-capable image surface.
 * Upstream: zsdl_opengl.cpp:131-156
 */
export function loadBaseImageSurface<TSurface, TTexture>(
  state: BaseImageSurfaceLoadState<TSurface, TTexture>,
  surface: TSurface | null,
  deleteSurface: boolean,
  convertToAlphaSurface: (surface: TSurface) => TSurface | null,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  unloadRenderableSurface(state, disposeSurface, deleteTexture);
  state.surface.current = surface;

  if (!state.surface.current) {
    return;
  }

  const alphaSurface = convertToAlphaSurface(state.surface.current);
  if (deleteSurface) {
    disposeSurface(state.surface.current);
  }
  state.surface.current = alphaSurface;
}

/**
 * Replacement for upstream `ZSDL_Surface::LoadRotoZoomSurface`.
 * Role: Creates and stores a rotated/scaled software surface cache.
 * Upstream: zsdl_opengl.cpp:185-206
 */
export function loadRotozoomSurfaceCache<TSurface>(
  state: RotozoomSurfaceLoadState<TSurface>,
  createRotozoomSurface: (
    surface: TSurface,
    angle: number,
    size: number,
  ) => TSurface | null,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
): boolean {
  if (!state.surface.current) {
    return false;
  }

  releaseSurfaceReference(state.rotozoomSurface, disposeSurface);

  const rotozoomSurface = createRotozoomSurface(
    state.surface.current,
    state.angle,
    state.size,
  );
  if (!rotozoomSurface) {
    state.rotozoomLoaded = false;
    return false;
  }

  state.rotozoomSurface.current = rotozoomSurface;
  state.rotozoomLoaded = true;

  return true;
}

/**
 * Replacement for upstream `ZSDL_Surface::LoadGLtexture`.
 * Role: Creates a browser texture from the software surface and records texture ownership.
 * Upstream: zsdl_opengl.cpp:208-260
 */
export function loadSurfaceTexture<TSurface, TTexture>(
  state: RenderableSurfaceTextureState<TSurface, TTexture>,
  getTextureSource: (surface: TSurface) => SurfaceTextureSource,
  createTexture: () => TTexture,
  uploadTexture: (upload: SurfaceTextureUpload<TTexture>) => void,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): boolean {
  if (!state.surface.current) {
    return false;
  }

  if (state.textureLoaded && state.texture !== null) {
    deleteTexture(state.texture);
  }

  const source = getTextureSource(state.surface.current);
  const format = getSurfaceTextureFormat(source);
  if (!format) {
    return false;
  }

  const texture = createTexture();
  uploadTexture({
    texture,
    width: source.width,
    height: source.height,
    bytesPerPixel: source.bytesPerPixel,
    format,
    pixels: source.pixels,
  });

  state.texture = texture;
  state.textureLoaded = true;

  return true;
}

function getSurfaceTextureFormat(
  source: SurfaceTextureSource,
): SurfaceTextureFormat | null {
  if (source.bytesPerPixel === 4) {
    return source.redMask === 0x000000ff ? "RGBA" : "BGRA";
  }
  if (source.bytesPerPixel === 3) {
    return source.redMask === 0x000000ff ? "RGB" : "BGR";
  }

  return null;
}

/**
 * Replacement for upstream `ZSDL_Surface::Unload`.
 * Role: Releases software surfaces and texture state owned by a renderable surface.
 * Upstream: zsdl_opengl.cpp:86-98
 */
export function unloadRenderableSurface<TSurface, TTexture>(
  state: RenderableSurfaceUnloadState<TSurface, TTexture>,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  releaseSurfaceReference(state.surface, disposeSurface);
  releaseSurfaceReference(state.rotozoomSurface, disposeSurface);

  if (state.textureLoaded && state.texture !== null) {
    deleteTexture(state.texture);
  }

  state.texture = null;
  state.textureLoaded = false;
  state.rotozoomLoaded = false;
}
