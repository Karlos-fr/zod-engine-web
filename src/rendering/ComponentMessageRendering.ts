/**
 * Upstream: zcomp_message_engine.h
 */

import { currentTime } from "../simulation/Common";
import type { GameEntity } from "../simulation/entities/GameEntity";
import type { MapSurfaceRenderCommand } from "../world/GameMap";

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
 * Replacement for upstream `ZTime::IsPaused` in component message rendering.
 * Role: Reports whether the game clock is paused.
 * Upstream: zcomp_message_engine.cpp:266
 */
export type ComponentMessagePauseClock = {
  isPaused(): boolean;
};

/**
 * Replacement for upstream `click_to_resume_img`.
 * Role: Supplies the renderable resume prompt and its base image dimensions.
 * Upstream: zcomp_message_engine.cpp:266-280
 */
export type ComponentMessageResumeImage<TSurface> = {
  surface: TSurface;
  baseSurface: { width: number; height: number } | null;
};

/**
 * Replacement for upstream `ZCompMessageEngine::RenderResume` state.
 * Role: Holds the pause clock and resume prompt image for rendering.
 * Upstream: zcomp_message_engine.cpp:264-282
 */
export type ComponentMessageResumeRenderState<TSurface> = {
  ztime: ComponentMessagePauseClock | null;
  clickToResumeImage: ComponentMessageResumeImage<TSurface>;
};

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
 * Replacement for upstream `ZCompMessageEngine::RenderResume`.
 * Role: Builds the centered map render command for the paused-game resume prompt.
 * Upstream: zcomp_message_engine.cpp:264-282
 */
export function renderComponentMessageResume<TSurface>(
  state: ComponentMessageResumeRenderState<TSurface>,
  zmap: {
    getViewShiftFull(): {
      x: number;
      y: number;
      viewWidth: number;
      viewHeight: number;
    };
    renderZSurface(
      surface: TSurface,
      x: number,
      y: number,
      renderHit: boolean,
      aboutCenter: boolean,
    ): MapSurfaceRenderCommand<TSurface>;
  },
): MapSurfaceRenderCommand<TSurface> | null {
  if (!state.ztime?.isPaused()) return null;

  const baseSurface = state.clickToResumeImage.baseSurface;
  if (!baseSurface) return null;

  const view = zmap.getViewShiftFull();
  const x = ((view.viewWidth - baseSurface.width) >> 1) + view.x;
  const y = ((view.viewHeight - baseSurface.height) >> 1) + view.y;

  return zmap.renderZSurface(
    state.clickToResumeImage.surface,
    x,
    y,
    false,
    false,
  );
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
