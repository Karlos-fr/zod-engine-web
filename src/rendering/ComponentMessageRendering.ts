/**
 * Upstream: zcomp_message_engine.h
 */

import type { GameEntity } from "../simulation/entities/GameEntity";

/**
 * Port of upstream `_ZCOMP_MESSAGE_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zcomp_message_engine.h:2
 */
export const ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Replacement for upstream `MAX_RENDERABLE_STORED_GUNS`.
 * Role: Caps how many stored guns the component message renderer may display.
 * Upstream: zcomp_message_engine.h:9
 */
export const MAX_RENDERABLE_STORED_GUNS = 8;

/**
 * Port of upstream `comp_message`.
 * Role: Identifies the component message category shown by the message renderer.
 * Upstream: zcomp_message_engine.h:11-15
 */
export enum ComponentMessage {
  RobotManufactured = 0,
  VehicleManufactured = 1,
  GunManufactured = 2,
  Fort = 3,
}

/**
 * Port of upstream `ZObject` forward declaration.
 * Role: Provides the entity reference type used by component message rendering.
 * Upstream: zcomp_message_engine.h:17
 */
export type ComponentMessageObjectReference = GameEntity;

/**
 * Port of upstream `comp_msg_flags`.
 * Role: Carries actions requested by the component message renderer.
 * Upstream: zcomp_message_engine.h:19-36
 */
export class ComponentMessageFlags {
  openGui = false;
  selectObject = false;
  resumeGame = false;
  refId = -1;

  constructor() {
    this.clear();
  }

  /**
   * Port of upstream `comp_msg_flags::Clear`.
   * Role: Resets component message actions and reference id.
   * Upstream: zcomp_message_engine.h:24-30
   */
  clear(): void {
    this.refId = -1;
    this.openGui = false;
    this.selectObject = false;
    this.resumeGame = false;
  }
}
