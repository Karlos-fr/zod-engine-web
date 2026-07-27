/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: rgrunt.h, rlaser.h, rpsycho.h, rpyro.h, rsniper.h, rtough.h,
 *   zrobot.cpp, zrobot.h
 * - Symbols: _RGRUNT_H_, _RLASER_H_, _RPSYCHO_H_, _RPYRO_H_, _RSNIPER_H_,
 *   _RTOUGH_H_, _ZROBOT_H_, GRENADE_TIME_INT
 * - Ledger: MAC-326648, MAC-360A73, MAC-615B4E, MAC-6CD6B8,
 *   MAC-83E82D, MAC-8B80D8, MAC-AFC09B, MAC-CBCAA9
 *
 * Porting notes:
 * - Robot header guards are replaced by ES module boundaries.
 */

/**
 * Adaptation of upstream `GRENADE_TIME_INT`.
 *
 * Role:
 * - Defines the seconds between robot grenade animation/process ticks.
 *
 * Ledger: MAC-360A73
 * Upstream: zrobot.cpp:5
 *
 * Adaptation:
 * - Replaces the C preprocessor macro with a named TypeScript constant.
 */
export const ROBOT_GRENADE_TIME_INTERVAL_SECONDS = 0.15;

/**
 * Marker exported from the robot type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `zrobot.h` include
 *   guard before the full `ZRobot` base class is ported.
 *
 * Ledger: MAC-AFC09B
 * Upstream: zrobot.h:2
 *
 * Adaptation:
 * - Replaces the C `_ZROBOT_H_` header guard with TypeScript module loading.
 */
export const ZROBOT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `rgrunt.h` include
 *   guard before the full `RGrunt` class is ported.
 *
 * Ledger: MAC-83E82D
 * Upstream: rgrunt.h:2
 *
 * Adaptation:
 * - Replaces the C `_RGRUNT_H_` header guard with TypeScript module loading.
 */
export const RGRUNT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `rlaser.h` include
 *   guard before the full `RLaser` class is ported.
 *
 * Ledger: MAC-326648
 * Upstream: rlaser.h:2
 *
 * Adaptation:
 * - Replaces the C `_RLASER_H_` header guard with TypeScript module loading.
 */
export const RLASER_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `rpsycho.h` include
 *   guard before the full `RPsycho` class is ported.
 *
 * Ledger: MAC-615B4E
 * Upstream: rpsycho.h:2
 *
 * Adaptation:
 * - Replaces the C `_RPSYCHO_H_` header guard with TypeScript module loading.
 */
export const RPSYCHO_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `rpyro.h` include guard
 *   before the full `RPyro` class is ported.
 *
 * Ledger: MAC-CBCAA9
 * Upstream: rpyro.h:2
 *
 * Adaptation:
 * - Replaces the C `_RPYRO_H_` header guard with TypeScript module loading.
 */
export const RPYRO_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `rsniper.h` include
 *   guard before the full `RSniper` class is ported.
 *
 * Ledger: MAC-6CD6B8
 * Upstream: rsniper.h:2
 *
 * Adaptation:
 * - Replaces the C `_RSNIPER_H_` header guard with TypeScript module loading.
 */
export const RSNIPER_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `rtough.h` include
 *   guard before the full `RTough` class is ported.
 *
 * Ledger: MAC-8B80D8
 * Upstream: rtough.h:2
 *
 * Adaptation:
 * - Replaces the C `_RTOUGH_H_` header guard with TypeScript module loading.
 */
export const RTOUGH_HEADER_GUARD_PORTED = true;
