/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: map_editor.cpp
 * - Symbols: draw_seperator
 * - Ledger: FUN-95674C
 *
 * Porting notes:
 * - SDL screen flipping is represented as an explicit render-present callback.
 */

/**
 * Port of upstream `draw_seperator`.
 *
 * Role:
 * - Preserves the map editor separator rendering hook, which currently only
 *   presents the SDL screen when requested.
 *
 * Ledger: FUN-95674C
 * Upstream: map_editor.cpp:1769-1773
 *
 * Adaptation:
 * - Keeps the upstream `seperator` spelling in documentation only.
 * - Replaces `SDL_Flip(screen)` with an optional callback supplied by browser
 *   rendering code.
 */
export function drawMapEditorSeparator(
  flip: boolean,
  presentScreen: () => void = () => undefined,
): void {
  if (flip) {
    presentScreen();
  }
}
