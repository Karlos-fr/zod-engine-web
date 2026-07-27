/**
 * Ported from Zod Engine.
 * Upstream: zsdl.cpp
 * Symbols: ZSDL_FreeSurface
 */

/**
 * Browser-side replacement for an SDL surface pointer reference.
 * Role: Carries a nullable surface-like object whose ownership can be cleared.
 * Ledger: FUN-1371A6
 * Upstream: zsdl.cpp:749-756
 */
export type SurfaceReference<TSurface> = {
  current: TSurface | null;
};

/**
 * Replacement for upstream `ZSDL_FreeSurface`.
 * Role: Releases the current surface, when present, and clears the caller-visible reference.
 * Ledger: FUN-1371A6
 * Upstream: zsdl.cpp:749-756
 * Adaptation: Replaces `SDL_FreeSurface(surface); surface = NULL;` with an optional disposer callback followed by `current = null`.
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
