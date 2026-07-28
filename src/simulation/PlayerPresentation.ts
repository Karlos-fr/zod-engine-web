/**
 * Upstream: zplayer.h / zplayer.cpp
 */

/**
 * Port of upstream `_ZPLAYER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zplayer.h:2
 */
export const ZPLAYER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_STORED_SPACE_BAR_EVENTS`.
 * Role: Defines how many space-bar focus events are retained.
 * Upstream: zplayer.h:106
 */
export const PLAYER_MAX_STORED_SPACE_BAR_EVENTS = 5;

/**
 * Port of upstream `SPACE_BAR_EVENT_LIFETIME`.
 * Role: Defines how long space-bar focus events remain valid.
 * Upstream: zplayer.h:107
 */
export const PLAYER_SPACE_BAR_EVENT_LIFETIME_SECONDS = 10;

/**
 * Port of upstream `ASCII_DOWN_MAX`.
 * Role: Defines how many lowercase ASCII key states are tracked by the player.
 * Upstream: zplayer.h:152
 */
export const PLAYER_ASCII_DOWN_MAX = 26;

/**
 * Port of upstream `key_event`.
 * Role: Stores a raw key code and Unicode value received by the player input layer.
 * Upstream: zplayer.h:44-48
 */
export type PlayerKeyEvent = {
  theKey: number;
  theUnicode: number;
};

/**
 * Port of upstream `mouse_button_info`.
 * Role: Stores mouse button screen/map coordinates and click-origin flags.
 * Upstream: zplayer.h:95-104
 */
export type MouseButtonInfo = {
  x: number;
  y: number;
  mapX: number;
  mapY: number;
  down: boolean;
  startedOverHud: boolean;
  startedOverGui: boolean;
};

/**
 * Port of upstream `mouse_button_info` constructor.
 * Role: Creates a cleared mouse button interaction state.
 * Upstream: zplayer.h:95-104
 */
export function createMouseButtonInfo(): MouseButtonInfo {
  return {
    x: 0,
    y: 0,
    mapX: 0,
    mapY: 0,
    down: false,
    startedOverHud: false,
    startedOverGui: false,
  };
}

/**
 * Port of upstream `max_items`.
 * Role: Defines the number of graphics initialization steps tracked by load progress.
 * Upstream: zplayer.cpp:476
 */
export const PLAYER_GRAPHICS_LOAD_ITEM_COUNT = 81;

/**
 * Port of upstream `lasting_time`.
 * Role: Defines how long player news entries remain active.
 * Upstream: zplayer.cpp:600
 */
export const PLAYER_NEWS_ACTIVE_DURATION_SECONDS = 17.0;

/**
 * Port of upstream `shift_tick`.
 * Role: Defines the animation tick for the drag-selection shift marker.
 * Upstream: zplayer.cpp:1378
 */
export const PLAYER_SELECTION_SHIFT_TICK_SECONDS = 0.1;

/**
 * Port of upstream `shift_speed`.
 * Role: Defines keyboard edge-scroll speed in map pixels per second.
 * Upstream: zplayer.cpp:1932
 */
export const PLAYER_SCROLL_SPEED_PIXELS_PER_SECOND = 400;

/**
 * Port of upstream `y_int`.
 * Role: Defines vertical spacing between rendered news entries.
 * Upstream: zplayer.cpp:2068
 */
export const PLAYER_NEWS_ROW_SPACING_PIXELS = 15;

/**
 * Port of upstream `start_fade_time`.
 * Role: Defines when rendered news entries begin fading.
 * Upstream: zplayer.cpp:2069
 */
export const PLAYER_NEWS_FADE_START_SECONDS = 5;

/**
 * Port of upstream `max_news_history`.
 * Role: Defines the maximum number of news entries kept for rendering.
 * Upstream: zplayer.cpp:2070
 */
export const PLAYER_MAX_NEWS_HISTORY = 50;

/**
 * Port of upstream `fade_per_second`.
 * Role: Defines splash screen fade speed.
 * Upstream: zplayer.cpp:2413
 */
export const PLAYER_SPLASH_FADE_PER_SECOND = 5;
