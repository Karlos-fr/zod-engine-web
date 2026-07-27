/**
 * Ported from Zod Engine.
 * Upstream: gwproduction.h, gwproduction.cpp
 * Symbols: see entity comments
 */

/**
 * Adaptation of upstream `_ZGWPRODUCTION_H_`.
 * Role: Marks the TypeScript module boundary for upstream `gwproduction.h`.
 * Ledger: MAC-E5E713
 * Upstream: gwproduction.h:2
 */
export const ZGW_PRODUCTION_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `GWP_SELECTOR_CENTER_X`.
 * Role: Defines the x-offset used to center the full unit selector from the production window placement point.
 * Ledger: MAC-E11730
 * Upstream: gwproduction.h:102
 */
export const PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS = 24;

/**
 * Adaptation of upstream `GWP_SELECTOR_CENTER_Y`.
 * Role: Defines the y-offset used to center the full unit selector from the production window placement point.
 * Ledger: MAC-C595B0
 * Upstream: gwproduction.h:103
 */
export const PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS = 21;

/**
 * Port of upstream `button_h`.
 * Role: Defines the vertical height step used by production queue buttons.
 * Ledger: CON-41D8B4
 * Upstream: gwproduction.cpp:190
 */
export const PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS = 13;

/**
 * Port of upstream `button_margin`.
 * Role: Defines the vertical gap between production queue buttons.
 * Ledger: CON-8F3C4C
 * Upstream: gwproduction.cpp:191
 */
export const PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS = 1;
