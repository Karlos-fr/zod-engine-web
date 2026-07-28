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

/**
 * Replacement for upstream `ZSDL_FreeSurface`.
 * Role: Releases the current surface, when present, and clears the observable reference.
 * Upstream: zsdl.cpp:749-756
 */
export function freeSdlSurface<TSurface>(
  surface: SurfaceReference<TSurface>,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
): void {
  if (!surface.current) {
    return;
  }

  disposeSurface(surface.current);
  surface.current = null;
}
