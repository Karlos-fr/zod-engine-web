/**
 * Ported from Zod Engine.
 * Upstream: rgrunt.h, rlaser.h, rpsycho.h, rpyro.h, rsniper.h, rtough.h,
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Adaptation of upstream `GRENADE_TIME_INT`.
 * Role: Defines the seconds between robot grenade animation/process ticks.
 * Ledger: MAC-360A73
 * Upstream: zrobot.cpp:5
 */
export const ROBOT_GRENADE_TIME_INTERVAL_SECONDS = 0.15;

/**
 * Marker exported from the robot type module.
 * Role: Marks the TypeScript module boundary for upstream `zrobot.h`.
 * Ledger: MAC-AFC09B
 * Upstream: zrobot.h:2
 */
export const ZROBOT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 * Role: Marks the TypeScript module boundary for upstream `rgrunt.h`.
 * Ledger: MAC-83E82D
 * Upstream: rgrunt.h:2
 */
export const RGRUNT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 * Role: Marks the TypeScript module boundary for upstream `rlaser.h`.
 * Ledger: MAC-326648
 * Upstream: rlaser.h:2
 */
export const RLASER_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 * Role: Marks the TypeScript module boundary for upstream `rpsycho.h`.
 * Ledger: MAC-615B4E
 * Upstream: rpsycho.h:2
 */
export const RPSYCHO_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 * Role: Marks the TypeScript module boundary for upstream `rpyro.h`.
 * Ledger: MAC-CBCAA9
 * Upstream: rpyro.h:2
 */
export const RPYRO_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 * Role: Marks the TypeScript module boundary for upstream `rsniper.h`.
 * Ledger: MAC-6CD6B8
 * Upstream: rsniper.h:2
 */
export const RSNIPER_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the robot type module.
 * Role: Marks the TypeScript module boundary for upstream `rtough.h`.
 * Ledger: MAC-8B80D8
 * Upstream: rtough.h:2
 */
export const RTOUGH_HEADER_GUARD_PORTED = true;
