/**
 * Ported from Zod Engine.
 * Upstream: zobject.cpp
 */
import { PI } from "../SimulationConstants";

/**
 * Port of upstream `max_units_in_type`.
 * Role: Defines the maximum unit variants tracked within an upstream unit type.
 * Ledger: CON-169286
 * Upstream: zobject.cpp:496
 */
export const MAX_UNITS_PER_TYPE = 7;

/**
 * Port of upstream `glvl`.
 * Role: Defines the shared grayscale level for entity image processing code.
 * Ledger: CON-18C48E
 * Upstream: zobject.cpp:1122, zobject.cpp:1370
 */
export const GLVL = 170;

/**
 * Port of upstream `min_stamina`.
 * Role: Defines the lower stamina threshold for entity behavior.
 * Ledger: CON-223BBB
 * Upstream: zobject.cpp:2095
 */
export const MIN_STAMINA = 0.3;

/**
 * Web-side epsilon for coarse entity Z comparisons.
 * Role: Provides a named tolerance for entity depth calculations.
 * Ledger: CON-39029D
 * Upstream: zobject.cpp:1603
 */
export const Z_EPSILON = 0.00001;

/**
 * Port of repeated upstream `z` local constants.
 * Role: Provides the fine tolerance for repeated entity Z calculations.
 * Ledger: CON-39029D
 * Upstream: zobject.cpp:1603, zobject.cpp:2488, zobject.cpp:2591,
 * zobject.cpp:2676, zobject.cpp:2703, zobject.cpp:2922,
 * zobject.cpp:3100
 */
export const Z_FINE_EPSILON = 0.000001;

/**
 * Port of upstream `bar_y_shift`.
 * Role: Defines the vertical offset for drawing entity status bars.
 * Ledger: CON-633D10
 * Upstream: zobject.cpp:628
 */
export const BAR_Y_SHIFT = -8;

/**
 * Port of upstream `bar_x_shift`.
 * Role: Defines the horizontal offset for drawing entity status bars.
 * Ledger: CON-C7751F
 * Upstream: zobject.cpp:627
 */
export const BAR_X_SHIFT = -3;

/**
 * Port of upstream `b_r`.
 * Role: Defines the red channel value used for the entity status bar background.
 * Ledger: CON-6FAE47
 * Upstream: zobject.cpp:623
 */
export const BAR_RED = 0;

/**
 * Port of upstream `hover_name_y_shift`.
 * Role: Defines the vertical offset for the entity hover name label.
 * Ledger: CON-98106E
 * Upstream: zobject.cpp:563
 */
export const HOVER_NAME_Y_SHIFT = -19;

/**
 * Port of upstream `dots`.
 * Role: Defines how many dotted markers an entity UI indicator uses.
 * Ledger: CON-A3B238
 * Upstream: zobject.cpp:715, zobject.cpp:1039
 */
export const DOT_COUNT = 10;

/**
 * Port of upstream `PI_shift`.
 * Role: Defines the angular spacing between dotted entity UI markers.
 * Ledger: CON-22DE38
 * Upstream: zobject.cpp:716, zobject.cpp:1040
 */
export const ENTITY_PI_SHIFT_RADIANS = (PI / 2) / DOT_COUNT;

/**
 * Port of upstream `max_dist`.
 * Role: Defines the maximum distance at which an entity status bar is shown.
 * Ledger: CON-BE1C5B
 * Upstream: zobject.cpp:629
 */
export const MAX_BAR_DISTANCE = 30 + 6;

/**
 * Port of upstream `y_r`.
 * Role: Defines the red channel value used for the yellow status bar color.
 * Ledger: CON-C105A3
 * Upstream: zobject.cpp:622
 */
export const BAR_YELLOW_RED = 247;

/**
 * Port of upstream `g_r`.
 * Role: Defines the red channel value used for the green status bar color.
 * Ledger: CON-EAA140
 * Upstream: zobject.cpp:621
 */
export const BAR_GREEN_RED = 82;
