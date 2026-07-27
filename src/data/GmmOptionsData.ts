/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: gmm_options.h
 * - Symbols: MAX_GMMOPTIONS_SPEED_SETTINGS
 * - Ledger: MAC-732E6A
 *
 * Porting notes:
 * - C preprocessor menu option limits are represented as named constants.
 */

/**
 * Port of upstream `MAX_GMMOPTIONS_SPEED_SETTINGS`.
 *
 * Role:
 * - Defines the number of speed choices exposed by the graphical main menu
 *   options screen.
 *
 * Ledger: MAC-732E6A
 * Upstream: gmm_options.h:6
 *
 * Adaptation:
 * - Replaces the C macro with a typed TypeScript constant.
 */
export const MAX_GMM_OPTIONS_SPEED_SETTINGS = 7;
