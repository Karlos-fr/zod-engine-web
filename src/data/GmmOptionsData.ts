/**
 * Upstream: gmm_options.h
 */

/**
 * Port of upstream `MAX_GMMOPTIONS_SPEED_SETTINGS`.
 * Role: Defines the number of speed choices exposed by the graphical main menu options screen.
 * Upstream: gmm_options.h:6
 */
export const MAX_GMM_OPTIONS_SPEED_SETTINGS = 7;

/**
 * Port of upstream `gmmoption_speed_setting_value`.
 * Role: Defines the game-speed values represented by the options menu radio choices.
 * Upstream: gmm_options.h:8-11
 */
export const GMM_OPTIONS_SPEED_SETTING_VALUES = [
  0.25,
  0.5,
  0.75,
  1.0,
  1.5,
  2.0,
  4.0,
] as const;
