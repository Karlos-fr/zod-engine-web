/**
 * Upstream: zcomp_message_engine.h
 */

import { currentTime } from "../simulation/Common";
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
 * Browser-side state for the ported subset of `ZCompMessageEngine`.
 * Role: Holds references consumed by component message rendering.
 * Upstream: zcomp_message_engine.h
 */
export class ComponentMessageEngine<
  TObject = ComponentMessageObjectReference,
  TTime = unknown,
> {
  objectList: TObject[] | null = null;
  ourTeam = 0;
  ztime: TTime | null = null;
  showMessage: ComponentMessage | number = -1;
  nextFlipTime = 0;
  showTheMessage = false;
  flipsDone = 0;
  refId = -1;

  /**
   * Port of upstream `ZCompMessageEngine::SetObjectList`.
   * Role: Stores the object list reference used for component messages.
   * Upstream: zcomp_message_engine.cpp:36-39
   */
  setObjectList(objectList: TObject[] | null): void {
    this.objectList = objectList;
  }

  /**
   * Port of upstream `ZCompMessageEngine::SetTeam`.
   * Role: Stores the local team used for component messages.
   * Upstream: zcomp_message_engine.cpp:41-44
   */
  setTeam(ourTeam: number): void {
    this.ourTeam = ourTeam;
  }

  /**
   * Port of upstream `ZCompMessageEngine::SetZTime`.
   * Role: Stores the simulation clock reference used for component messages.
   * Upstream: zcomp_message_engine.cpp:46-49
   */
  setZTime(ztime: TTime | null): void {
    this.ztime = ztime;
  }

  /**
   * Port of upstream `ZCompMessageEngine::DisplayMessage`.
   * Role: Starts displaying a component message and schedules its first flip.
   * Upstream: zcomp_message_engine.cpp:345-356
   */
  displayMessage(
    componentMessage: ComponentMessage | number,
    refId: number,
    now: () => number = currentTime,
  ): void {
    const messageTime = now();

    this.showMessage = componentMessage;
    this.nextFlipTime = messageTime + 0.3;
    this.showTheMessage = true;
    this.flipsDone = 0;
    this.refId = refId;
  }
}

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
