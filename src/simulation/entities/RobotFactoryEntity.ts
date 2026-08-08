/**
 * Upstream: brobot.h
 */

import type { GameMap } from "../../world/GameMap";
import type { MapSurfaceRenderCommand } from "../../world/GameMap";
import {
  BuildingEntity,
  BuildingState,
  type BuildingShowTimeTextRenderer,
} from "./BuildingTypes";

export type RobotFactoryBaseImages<TSurface> = ReadonlyArray<
  ReadonlyArray<TSurface | null | undefined> | null | undefined
>;

export type RobotFactoryRenderState<TSurface> = {
  position: { x: number; y: number };
  palette: number;
  owner: number;
  destroyed: boolean;
  dontStamp: boolean;
  doBaseRerender: boolean;
  baseImages: RobotFactoryBaseImages<TSurface>;
  destroyedBaseImages: RobotFactoryBaseImages<TSurface>;
};

export type RobotFactoryRenderMap<TSurface> = {
  permStamp(x: number, y: number, surface: TSurface): boolean;
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<TSurface>;
};

export type RobotFactoryRenderCommand<TSurface> =
  | MapSurfaceRenderCommand<TSurface>
  | null;

/**
 * Replacement for upstream `BRobot::DoRender`.
 * Role: Stamps or renders the robot factory base image selected by palette, owner, and destruction state.
 * Upstream: brobot.cpp:174-211
 */
export function renderRobotFactoryBase<TSurface>(
  state: RobotFactoryRenderState<TSurface>,
  zmap: RobotFactoryRenderMap<TSurface>,
): RobotFactoryRenderCommand<TSurface> {
  if (!state.dontStamp) {
    if (!state.doBaseRerender) return null;

    const surface = getRobotFactoryBaseSurface(state);
    if (!surface) return null;

    if (zmap.permStamp(state.position.x, state.position.y, surface)) {
      state.doBaseRerender = false;
    }

    return null;
  }

  const surface = getRobotFactoryBaseSurface(state);
  if (!surface) return null;

  return zmap.renderZSurface(
    surface,
    state.position.x,
    state.position.y,
    false,
    false,
  );
}

function getRobotFactoryBaseSurface<TSurface>(
  state: RobotFactoryRenderState<TSurface>,
): TSurface | null | undefined {
  const images = state.destroyed ? state.destroyedBaseImages : state.baseImages;
  return images[state.palette]?.[state.owner];
}

/**
 * Browser simulation entity containing the subset of `BRobot` behavior already ported.
 * Role: Represents robot factory behavior over the base game entity.
 * Upstream: brobot.h
 */
export class RobotFactoryEntity extends BuildingEntity {
  spinIndex = 0;
  greenBoxIndex = 0;
  robotIndex = 0;
  exhaustIndex = 0;
  singleLightOn = [false, false, false];
  lastProcessTime = 0;

  /**
   * Port of upstream `BRobot::Process`.
   * Role: Advances robot-factory animation frames and refreshes production countdown display.
   * Upstream: brobot.cpp:135-172
   */
  override process<TImage = unknown>(
    currentTime = this.ztime?.ztime ?? 0,
    processBuildingEffects: ((currentTime: number) => void) | null = null,
    renderShowTimeText: BuildingShowTimeTextRenderer<TImage> = (_font, text) =>
      text as TImage,
    randomInt: (maxExclusive: number) => number = (maxExclusive) =>
      Math.floor(Math.random() * maxExclusive),
  ): number {
    const minIntervalTime = 0.25;

    processBuildingEffects?.(currentTime);

    if (currentTime - this.lastProcessTime >= minIntervalTime) {
      this.lastProcessTime = currentTime;

      this.spinIndex += 1;
      if (this.spinIndex >= 8) this.spinIndex = 0;

      this.greenBoxIndex += 1;
      if (this.greenBoxIndex >= 6) this.greenBoxIndex = 0;

      this.robotIndex += 1;
      if (this.robotIndex >= 2) this.robotIndex = 0;

      this.exhaustIndex += 1;
      if (this.exhaustIndex >= 13) this.exhaustIndex = 0;

      if (randomInt(3) === 0) {
        for (let i = 0; i < 3; i += 1) {
          this.singleLightOn[i] = randomInt(2) !== 0;
        }
      }
    }

    if (this.buildState !== BuildingState.Select) {
      this.resetShowTime(
        Math.trunc(this.productionTimeLeft(currentTime)),
        renderShowTimeText,
      );
    } else {
      this.resetShowTime(-1, renderShowTimeText);
    }

    return 1;
  }

  /**
   * Port of upstream `BRobot::SetMapImpassables`.
   * Role: Marks the robot factory footprint as blocked on the pathfinding map.
   * Upstream: brobot.cpp:459-475
   */
  override setMapImpassables(tmap: GameMap): void {
    const tileX = Math.trunc(this.position.x / 16);
    const tileY = Math.trunc(this.position.y / 16);
    const endX = tileX + this.width;
    const endY = tileY + this.height;

    for (let x = tileX; x < endX; x += 1) {
      for (let y = tileY; y < endY; y += 1) {
        tmap.setImpassable(x, y);
      }
    }
  }

  /**
   * Port of upstream `CanSetRallypoints`.
   * Role: Reports whether robot factories can set rally points.
   * Upstream: brobot.h:20
   */
  override canSetRallypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `ProducesUnits`.
   * Role: Reports whether robot factories can produce units.
   * Upstream: brobot.h:21
   */
  override producesUnits(): boolean {
    return true;
  }

  /**
   * Port of upstream `BRobot::GetCraneEntrance`.
   * Role: Reports the robot factory crane entrance and exit point below the building.
   * Upstream: brobot.cpp:477-482
   */
  override getCraneEntrance(): {
    canEnter: boolean;
    x: number;
    y: number;
    exitX: number;
    exitY: number;
  } {
    const x = this.position.x + 35;
    const y = this.position.y + this.pixelHeight + 32;

    return {
      canEnter: true,
      x,
      y,
      exitX: x,
      exitY: y,
    };
  }

  /**
   * Port of upstream `BRobot::GetCraneCenter`.
   * Role: Reports the robot factory crane interaction center.
   * Upstream: brobot.cpp:484-489
   */
  override getCraneCenter(): { hasCenter: boolean; x: number; y: number } {
    return {
      hasCenter: true,
      x: this.position.x + 35,
      y: this.position.y + 32,
    };
  }
}
