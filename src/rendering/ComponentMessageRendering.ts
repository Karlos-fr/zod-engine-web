/**
 * Upstream: zcomp_message_engine.h
 */

import { currentTime } from "../simulation/Common";
import type { GameEntity } from "../simulation/entities/GameEntity";
import {
  BuildingType,
  MAX_STORED_CANNONS,
} from "../simulation/SimulationConstants";
import { MapObjectType } from "../world/MapFormat";
import type { MapSurfaceRenderCommand } from "../world/GameMap";
import { FontType } from "./FontEngine";

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

export const COMPONENT_MESSAGE_ROBOT_MANUFACTURED_IMAGE_PATH =
  "assets/other/comp_messages/robot_manufactured.png";
export const COMPONENT_MESSAGE_VEHICLE_MANUFACTURED_IMAGE_PATH =
  "assets/other/comp_messages/vehicle_manufactured.png";
export const COMPONENT_MESSAGE_GUN_MANUFACTURED_IMAGE_PATH =
  "assets/other/comp_messages/gun_manufactured.png";
export const COMPONENT_MESSAGE_FORT_UNDER_ATTACK_IMAGE_PATH =
  "assets/other/comp_messages/fort_under_attack.png";
export const COMPONENT_MESSAGE_GUN_IMAGE_PATH =
  "assets/other/comp_messages/gun.png";
export const COMPONENT_MESSAGE_PAUSED_IMAGE_PATH =
  "assets/other/comp_messages/paused.png";
export const COMPONENT_MESSAGE_CLICK_TO_RESUME_IMAGE_PATH =
  "assets/other/comp_messages/click_to_resume.png";

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

export type ComponentMessageGunImage<TSurface> = {
  surface: TSurface;
  baseSurface: { width: number; height: number } | null;
};

export type ComponentMessageStoredGunObject = {
  getOwner(): number;
  isDestroyed(): boolean;
  getObjectId(): { objectType: number; objectId: number };
  getBuiltCannonList(): readonly unknown[];
  getRefId(): number;
};

/**
 * Replacement for upstream `ZCompMessageEngine::RenderGuns` state.
 * Role: Holds object filtering state and stored-gun images for rendering.
 * Upstream: zcomp_message_engine.cpp:284-343
 */
export type ComponentMessageGunsRenderState<TSurface> = {
  objectList: readonly ComponentMessageStoredGunObject[] | null;
  ourTeam: number;
  gunImage: ComponentMessageGunImage<TSurface>;
  xImages: readonly ComponentMessageGunImage<TSurface>[];
};

export type ComponentMessageGunsRenderResult<TSurface> = {
  commands: Array<MapSurfaceRenderCommand<TSurface>>;
  renderedGunRefIds: number[];
};

export type ComponentMessageMainImage<TSurface> = {
  surface: TSurface;
  baseSurface: { width: number; height: number } | null;
};

/**
 * Replacement for upstream `ZCompMessageEngine::DoRender` state.
 * Role: Aggregates active message, stored-gun, and pause-resume render state.
 * Upstream: zcomp_message_engine.cpp:235-262
 */
export type ComponentMessageDoRenderState<TSurface> =
  ComponentMessageGunsRenderState<TSurface> &
    ComponentMessageResumeRenderState<TSurface> & {
      showMessageImage: ComponentMessageMainImage<TSurface> | null;
      showTheMessage: boolean;
    };

export type ComponentMessageDoRenderResult<TSurface> = {
  commands: Array<MapSurfaceRenderCommand<TSurface>>;
  renderedGunRefIds: number[];
};

export type ComponentMessageImageSet<TImage> = {
  robotManufactured: TImage;
  vehicleManufactured: TImage;
  gunManufactured: TImage;
  fortUnderAttacked: TImage;
};

export type ComponentMessageImageLoadTarget<TImage = unknown> = {
  loadBaseImage(source: string | TImage): void;
};

export type ComponentMessageInitState<TImage = unknown> = {
  robotManufacturedImage: ComponentMessageImageLoadTarget<TImage>;
  vehicleManufacturedImage: ComponentMessageImageLoadTarget<TImage>;
  gunManufacturedImage: ComponentMessageImageLoadTarget<TImage>;
  fortUnderAttackedImage: ComponentMessageImageLoadTarget<TImage>;
  gunImage: ComponentMessageImageLoadTarget<TImage>;
  pausedImage: ComponentMessageImageLoadTarget<TImage>;
  clickToResumeImage: ComponentMessageImageLoadTarget<TImage>;
  xImages: readonly ComponentMessageImageLoadTarget<TImage>[];
};

export type ComponentMessageTextRenderer<TImage> = (
  font: FontType,
  text: string,
) => TImage;

/**
 * Port of upstream `ZCompMessageEngine::Init`.
 * Role: Loads component-message images and renders stored-gun count labels.
 * Upstream: zcomp_message_engine.cpp:51-69
 */
export function initComponentMessageEngine<TImage>(
  state: ComponentMessageInitState<TImage>,
  renderText: ComponentMessageTextRenderer<TImage>,
): void {
  state.robotManufacturedImage.loadBaseImage(
    COMPONENT_MESSAGE_ROBOT_MANUFACTURED_IMAGE_PATH,
  );
  state.vehicleManufacturedImage.loadBaseImage(
    COMPONENT_MESSAGE_VEHICLE_MANUFACTURED_IMAGE_PATH,
  );
  state.gunManufacturedImage.loadBaseImage(
    COMPONENT_MESSAGE_GUN_MANUFACTURED_IMAGE_PATH,
  );
  state.fortUnderAttackedImage.loadBaseImage(
    COMPONENT_MESSAGE_FORT_UNDER_ATTACK_IMAGE_PATH,
  );
  state.gunImage.loadBaseImage(COMPONENT_MESSAGE_GUN_IMAGE_PATH);
  state.pausedImage.loadBaseImage(COMPONENT_MESSAGE_PAUSED_IMAGE_PATH);
  state.clickToResumeImage.loadBaseImage(
    COMPONENT_MESSAGE_CLICK_TO_RESUME_IMAGE_PATH,
  );

  for (let i = 0; i < MAX_RENDERABLE_STORED_GUNS; i += 1) {
    state.xImages[i]?.loadBaseImage(
      renderText(FontType.SmallWhite, `X${i + 1}`),
    );
  }
}

/**
 * Browser-side state for the ported subset of `ZCompMessageEngine`.
 * Role: Holds references consumed by component message rendering.
 * Upstream: zcomp_message_engine.h
 */
export class ComponentMessageEngine<
  TObject = ComponentMessageObjectReference,
  TTime = unknown,
  TImage = unknown,
> {
  objectList: TObject[] | null = null;
  ourTeam = 0;
  ztime: TTime | null = null;
  showMessage: ComponentMessage | number = -1;
  showMessageImage: TImage | null = null;
  nextFlipTime = 0;
  showTheMessage = false;
  flipsDone = 0;
  finalTime = 0;
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

  /**
   * Port of upstream `ZCompMessageEngine::Process`.
   * Role: Selects the active message image, flips visibility, and expires finished messages.
   * Upstream: zcomp_message_engine.cpp:196-233
   */
  process(theTime: number, images: ComponentMessageImageSet<TImage>): void {
    if (this.showMessage === -1) return;

    switch (this.showMessage) {
      case ComponentMessage.RobotManufactured:
        this.showMessageImage = images.robotManufactured;
        break;
      case ComponentMessage.VehicleManufactured:
        this.showMessageImage = images.vehicleManufactured;
        break;
      case ComponentMessage.GunManufactured:
        this.showMessageImage = images.gunManufactured;
        break;
      case ComponentMessage.Fort:
        this.showMessageImage = images.fortUnderAttacked;
        break;
      default:
        this.showMessageImage = null;
        break;
    }

    if (this.flipsDone < 10) {
      if (theTime >= this.nextFlipTime) {
        this.flipsDone += 1;
        this.showTheMessage = !this.showTheMessage;
        this.nextFlipTime = theTime + 0.3;

        if (this.flipsDone === 10) {
          this.finalTime = theTime + 5;
        }
      }

      return;
    }

    if (theTime >= this.finalTime) {
      this.showMessage = -1;
      this.showMessageImage = null;
      this.showTheMessage = false;
    }
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
 * Replacement for upstream `ZCompMessageEngine::RenderGuns`.
 * Role: Builds stored-gun indicator commands and tracks the rendered building refs.
 * Upstream: zcomp_message_engine.cpp:284-343
 */
export function renderComponentMessageGuns<TSurface>(
  state: ComponentMessageGunsRenderState<TSurface>,
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
): ComponentMessageGunsRenderResult<TSurface> {
  const commands: Array<MapSurfaceRenderCommand<TSurface>> = [];
  const renderedGunRefIds: number[] = [];

  if (!state.objectList) return { commands, renderedGunRefIds };

  const gunBaseSurface = state.gunImage.baseSurface;
  if (!gunBaseSurface) return { commands, renderedGunRefIds };

  const view = zmap.getViewShiftFull();
  const x = 8 + view.x;
  let y = 8 + view.y;

  for (const object of state.objectList) {
    if (object.getOwner() !== state.ourTeam) continue;
    if (object.isDestroyed()) continue;

    const objectId = object.getObjectId();
    if (!isStoredGunBuildingObject(objectId.objectType, objectId.objectId)) {
      continue;
    }

    const cannonAmount = object.getBuiltCannonList().length;
    if (!cannonAmount) continue;

    commands.push(zmap.renderZSurface(state.gunImage.surface, x, y, false, false));

    if (cannonAmount > 1 && cannonAmount <= MAX_STORED_CANNONS) {
      const multiplierImage = state.xImages[cannonAmount - 1];
      if (multiplierImage?.baseSurface) {
        commands.push(
          zmap.renderZSurface(
            multiplierImage.surface,
            x + gunBaseSurface.width + 4,
            y + 3,
            false,
            false,
          ),
        );
      }
    }

    renderedGunRefIds.push(object.getRefId());
    if (renderedGunRefIds.length >= MAX_RENDERABLE_STORED_GUNS) break;

    y += 2 + gunBaseSurface.height;
  }

  return { commands, renderedGunRefIds };
}

function isStoredGunBuildingObject(objectType: number, objectId: number): boolean {
  if (objectType !== MapObjectType.Building) return false;

  return (
    objectId === BuildingType.FortFront ||
    objectId === BuildingType.FortBack ||
    objectId === BuildingType.RobotFactory ||
    objectId === BuildingType.VehicleFactory
  );
}

/**
 * Replacement for upstream `ZCompMessageEngine::DoRender`.
 * Role: Builds active component message, stored-gun, and pause-resume commands in upstream order.
 * Upstream: zcomp_message_engine.cpp:235-262
 */
export function renderComponentMessageEngine<TSurface>(
  state: ComponentMessageDoRenderState<TSurface>,
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
): ComponentMessageDoRenderResult<TSurface> {
  const commands: Array<MapSurfaceRenderCommand<TSurface>> = [];

  if (state.showMessageImage && state.showTheMessage) {
    const baseSurface = state.showMessageImage.baseSurface;
    if (baseSurface) {
      const view = zmap.getViewShiftFull();
      const x = ((view.viewWidth - baseSurface.width) >> 1) + view.x;
      const y = 20 + view.y;

      commands.push(
        zmap.renderZSurface(
          state.showMessageImage.surface,
          x,
          y,
          false,
          false,
        ),
      );
    }
  }

  const guns = renderComponentMessageGuns(state, zmap);
  commands.push(...guns.commands);

  const resume = renderComponentMessageResume(state, zmap);
  if (resume) commands.push(resume);

  return {
    commands,
    renderedGunRefIds: guns.renderedGunRefIds,
  };
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
