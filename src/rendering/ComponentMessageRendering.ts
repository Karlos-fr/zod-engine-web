/**
 * Ported from Zod Engine.
 * Upstream: zcomp_message_engine.h
 */

/**
 * Port of upstream `_ZCOMP_MESSAGE_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-DE6F98
 * Upstream: zcomp_message_engine.h:2
 */
export const ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Replacement for upstream `MAX_RENDERABLE_STORED_GUNS`.
 * Role: Caps how many stored guns the component message renderer may display.
 * Ledger: MAC-154053
 * Upstream: zcomp_message_engine.h:9
 */
export const MAX_RENDERABLE_STORED_GUNS = 8;

/**
 * Port of upstream `comp_message`.
 * Role: Identifies the component message category shown by the message renderer.
 * Ledger: ENU-CC08D5
 * Upstream: zcomp_message_engine.h:11-15
 */
export enum ComponentMessage {
  RobotManufactured = 0,
  VehicleManufactured = 1,
  GunManufactured = 2,
  Fort = 3,
}
