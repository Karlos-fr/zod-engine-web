/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zsdl.cpp
 * - Symbols: padding, the_len
 * - Ledger: CON-3EF127, CON-ECF527
 *
 * Porting notes:
 * - SDL selection-box drawing values are exposed as named renderer constants.
 */

/**
 * Replacement for upstream `padding`.
 *
 * Role:
 * - Defines the pixel margin added around a selected object's bounds.
 *
 * Ledger: CON-ECF527
 * Upstream: zsdl.cpp:182
 *
 * Adaptation:
 * - Replaces the C++ local constant with a named TypeScript export for the
 *   future selection-box renderer port.
 */
export const SELECTION_BOX_PADDING_PIXELS = 3;

/**
 * Replacement for upstream `the_len`.
 *
 * Role:
 * - Defines the pixel length of each visible corner segment in a selection box.
 *
 * Ledger: CON-3EF127
 * Upstream: zsdl.cpp:183
 *
 * Adaptation:
 * - Replaces the C++ local constant with a named TypeScript export for the
 *   future selection-box renderer port.
 */
export const SELECTION_BOX_CORNER_LENGTH_PIXELS = 5;
