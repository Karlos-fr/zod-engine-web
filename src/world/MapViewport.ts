/**
 * Upstream: zsdl_opengl.cpp
 */

export type MapViewportBlitRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MapViewportBlitInfo = {
  fromRect: MapViewportBlitRect;
  toRect: MapViewportBlitRect;
};

export type MapViewportBlitState = {
  screenWidth: number;
  screenHeight: number;
  mapPlaceX: number;
  mapPlaceY: number;
  hasHud: boolean;
  hudWidth: number;
  hudHeight: number;
};

/**
 * Port of upstream `ZSDL_Surface::SetMapPlace`.
 * Role: Stores the current map origin used when mapping world pixels to the viewport.
 * Upstream: zsdl_opengl.cpp:278-282
 */
export function setMapViewportOrigin(
  state: { mapPlaceX: number; mapPlaceY: number },
  x: number,
  y: number,
): void {
  state.mapPlaceX = x;
  state.mapPlaceY = y;
}

/**
 * Port of upstream `ZSDL_Surface::SetScreenDimensions`.
 * Role: Stores the screen dimensions used to calculate the visible map viewport.
 * Upstream: zsdl_opengl.cpp:272-276
 */
export function setMapViewportScreenDimensions(
  state: { screenWidth: number; screenHeight: number },
  width: number,
  height: number,
): void {
  state.screenWidth = width;
  state.screenHeight = height;
}

/**
 * Port of upstream `ZSDL_Surface::SetHasHud`.
 * Role: Stores whether HUD dimensions should reduce the map viewport area.
 * Upstream: zsdl_opengl.cpp:284-287
 */
export function setMapViewportHasHud(
  state: { hasHud: boolean },
  hasHud: boolean,
): void {
  state.hasHud = hasHud;
}

/**
 * Port of upstream `ZSDL_Surface::GetMapBlitInfo`.
 * Role: Calculates clipped source and viewport rectangles for map-space blits.
 * Upstream: zsdl_opengl.cpp:811-867
 */
export function getMapViewportBlitInfo(
  state: MapViewportBlitState,
  source: { width: number; height: number } | null,
  x: number,
  y: number,
): MapViewportBlitInfo | null {
  if (!source) {
    return null;
  }

  let viewWidth = state.screenWidth - state.mapPlaceX;
  let viewHeight = state.screenHeight - state.mapPlaceY;

  if (state.hasHud) {
    viewWidth -= state.hudWidth;
    viewHeight -= state.hudHeight;
  }

  if (x > viewWidth || y > viewHeight) {
    return null;
  }
  if (x + source.width < 0 || y + source.height < 0) {
    return null;
  }

  const visibleLeft = Math.max(0, x);
  const visibleTop = Math.max(0, y);
  const visibleRight = Math.min(viewWidth, x + source.width);
  const visibleBottom = Math.min(viewHeight, y + source.height);

  return {
    fromRect: {
      x: visibleLeft - x,
      y: visibleTop - y,
      width: visibleRight - visibleLeft,
      height: visibleBottom - visibleTop,
    },
    toRect: {
      x: visibleLeft,
      y: visibleTop,
      width: 0,
      height: 0,
    },
  };
}
