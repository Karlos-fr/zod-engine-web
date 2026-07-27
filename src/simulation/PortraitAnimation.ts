/**
 * Ported from Zod Engine.
 * Upstream: zportrait.h / zportrait.cpp
 * Symbols: _ZPORTRAIT_H_, ZPORTRAIT_BASE_WIDTH, ZPORTRAIT_BASE_HEIGHT,
 * MAX_EYES, MAX_HANDS, MAX_MOUTHS, duration_multi
 */

/**
 * Adaptation of upstream `_ZPORTRAIT_H_`.
 * Role: Marks the TypeScript module boundary for upstream `zportrait.h`.
 * Ledger: MAC-76482F
 * Upstream: zportrait.h:2
 */
export const ZPORTRAIT_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `ZPORTRAIT_BASE_WIDTH`.
 * Role: Defines the base portrait image width.
 * Ledger: MAC-1B23C5
 * Upstream: zportrait.h:16
 */
export const PORTRAIT_BASE_WIDTH_PIXELS = 86;

/**
 * Adaptation of upstream `ZPORTRAIT_BASE_HEIGHT`.
 * Role: Defines the base portrait image height.
 * Ledger: MAC-133A59
 * Upstream: zportrait.h:17
 */
export const PORTRAIT_BASE_HEIGHT_PIXELS = 74;

/**
 * Adaptation of upstream `MAX_EYES`.
 * Role: Defines the number of eye sprite variants.
 * Ledger: MAC-D08EAE
 * Upstream: zportrait.h:19
 */
export const PORTRAIT_MAX_EYES = 11;

/**
 * Adaptation of upstream `MAX_HANDS`.
 * Role: Defines the number of hand sprite variants.
 * Ledger: MAC-8004D5
 * Upstream: zportrait.h:20
 */
export const PORTRAIT_MAX_HANDS = 9;

/**
 * Adaptation of upstream `MAX_MOUTHS`.
 * Role: Defines the number of mouth sprite variants.
 * Ledger: MAC-92052D
 * Upstream: zportrait.h:21
 */
export const PORTRAIT_MAX_MOUTHS = 16;

/**
 * Port of upstream `duration_multi`.
 * Role: Scales portrait animation frame durations.
 * Ledger: CON-6FAD49
 * Upstream: zportrait.cpp:555
 */
export const PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS = 0.015;
