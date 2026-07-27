/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zsdl.cpp
 * - Symbols: ZSDL_FreeSurface
 * - Ledger: FUN-1371A6
 *
 * Porting notes:
 * - SDL pointer ownership is represented with nullable TypeScript references.
 */

/**
 * Browser-side replacement for an SDL surface pointer reference.
 *
 * Role:
 * - Carries a nullable surface-like object whose ownership can be cleared.
 *
 * Ledger: FUN-1371A6
 * Upstream: zsdl.cpp:749-756
 */
export type SurfaceReference<TSurface> = {
  current: TSurface | null;
};

/**
 * Replacement for upstream `ZSDL_FreeSurface`.
 *
 * Role:
 * - Releases the current surface, when present, and clears the caller-visible
 *   reference.
 *
 * Ledger: FUN-1371A6
 * Upstream: zsdl.cpp:749-756
 *
 * Adaptation:
 * - Replaces `SDL_FreeSurface(surface); surface = NULL;` with an optional
 *   disposer callback followed by `current = null`.
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
