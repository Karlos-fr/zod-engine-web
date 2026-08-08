/**
 * Upstream: bbridge.h / bbridge.cpp
 */

import { BuildingType, PlanetType, TeamType } from "../SimulationConstants";
import type { BridgeTurrentEffectSpawn } from "../BridgeTurretEffect";
import { pointsWithinArea } from "../Common";
import { GameEntity } from "./GameEntity";
import type { MapSurfaceRenderCommand } from "../../world/GameMap";

const BRIDGE_TURRENT_EFFECT_WIDTH = 140;
const BRIDGE_TURRENT_EFFECT_HEIGHT = 140;
const BRIDGE_REVIVE_RERENDER_DELAY_SECONDS = 2.25;
const BRIDGE_PLANET_TYPE_ASSET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;

export type BridgePlanetTemplate = {
  loadBaseImage(filename: string): void;
};

export type BridgeRenderableImage = {
  unload(): void;
};

export type BridgeRenderSurfaceCache = {
  getBaseSurface(): { width: number; height: number } | { w: number; h: number } | null;
  loadNewSurface(width: number, height: number): void;
};

export type BridgeImpassableMap = {
  setImpassable(
    x: number,
    y: number,
    impassable?: boolean,
    destroyable?: boolean,
  ): void;
};

export type BridgeRenderState<TSurface> = {
  position: { x: number; y: number };
  health: number;
  maxHealth: number;
  dontStamp: boolean;
  doRerender: boolean;
  doBaseRerender: boolean;
  renderImage: TSurface | null;
  renderDamagedImage: TSurface | null;
  renderDestroyedImage: TSurface | null;
};

export type BridgeRenderMap<TSurface> = {
  permStamp(x: number, y: number, surface: TSurface): boolean;
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<TSurface>;
};

export type BridgeRenderCommand<TSurface> =
  | MapSurfaceRenderCommand<TSurface>
  | null;

/**
 * Port of upstream `BBridge::Init`.
 * Role: Loads one bridge template image per planet palette.
 * Upstream: bbridge.cpp:34-44
 */
export function initBridgePlanetTemplates(
  planetTemplates: readonly BridgePlanetTemplate[],
): void {
  for (let i = 0; i < PlanetType.Max; i += 1) {
    planetTemplates[i]?.loadBaseImage(
      `assets/planets/bridge_${BRIDGE_PLANET_TYPE_ASSET_NAMES[i]}.png`,
    );
  }
}

/**
 * Replacement for upstream `BBridge::DoRender`.
 * Role: Stamps or renders the bridge cached image selected by damage state.
 * Upstream: bbridge.cpp:72-117
 */
export function renderBridgeBase<TSurface>(
  state: BridgeRenderState<TSurface>,
  zmap: BridgeRenderMap<TSurface>,
  reRenderImages: () => void = (): void => undefined,
): BridgeRenderCommand<TSurface> {
  if (state.doRerender) reRenderImages();

  if (state.dontStamp) {
    const surface = getBridgeRenderSurface(state);
    if (!surface) return null;

    return zmap.renderZSurface(
      surface,
      state.position.x,
      state.position.y,
      false,
      false,
    );
  }

  if (!state.doBaseRerender) return null;

  const surface = getBridgeRenderSurface(state);
  if (!surface) return null;

  if (zmap.permStamp(state.position.x, state.position.y, surface)) {
    state.doBaseRerender = false;
  }

  return null;
}

function getBridgeRenderSurface<TSurface>(
  state: BridgeRenderState<TSurface>,
): TSurface | null {
  if (state.health >= state.maxHealth >> 1) return state.renderImage;
  if (!(state.health <= 0 && state.maxHealth > 0)) return state.renderDamagedImage;
  return state.renderDestroyedImage;
}

/**
 * Browser simulation entity containing the subset of `BBridge` behavior already ported.
 * Role: Represents bridge-specific behavior over the shared game-entity base.
 * Upstream: bbridge.h
 */
export class BridgeEntity extends GameEntity {
  extraLinks = 0;
  width = 0;
  height = 0;
  palette = PlanetType.Desert;
  doRerender = false;
  doBaseRerender = false;
  doReviveRerender = false;
  nextReviveRerenderTime = 0;
  lastProcessHealth = 0;
  isVertical = false;
  renderImage: BridgeRenderableImage | null = null;
  renderDamagedImage: BridgeRenderableImage | null = null;
  renderDestroyedImage: BridgeRenderableImage | null = null;

  /**
   * Port of upstream `BBridge::GetExtraLinks`.
   * Role: Reports the number of extra bridge links attached to this bridge.
   * Upstream: bbridge.cpp:422-425
   */
  override getExtraLinks(): number {
    return this.extraLinks;
  }

  /**
   * Port of upstream `BBridge::ChangePalette`.
   * Role: Updates the bridge render palette and invalidates rendering when it changes.
   * Upstream: bbridge.cpp:391-398
   */
  changePalette(palette: PlanetType): void {
    if (this.palette !== palette) {
      this.palette = palette;
      this.doRerender = true;
    }
  }

  /**
   * Port of upstream `BBridge::SetOwner`.
   * Role: Forces bridge ownership to the null team.
   * Upstream: bbridge.cpp:449-452
   */
  override setOwner(owner: TeamType): void {
    void owner;
    this.owner = TeamType.Null;
  }

  /**
   * Replacement for upstream `BBridge::UnRenderImages`.
   * Role: Releases cached bridge render surfaces and marks rendering dirty.
   * Upstream: bbridge.cpp:261-271
   */
  unRenderImages(): void {
    this.renderImage?.unload();
    this.renderDamagedImage?.unload();
    this.renderDestroyedImage?.unload();
    this.doRerender = true;
  }

  /**
   * Replacement for upstream `BBridge::IndividualReRender`.
   * Role: Ensures one bridge render cache surface matches the current bridge pixel size.
   * Upstream: bbridge.cpp:273-286
   */
  individualReRender(surface: BridgeRenderSurfaceCache): void {
    const baseSurface = surface.getBaseSurface();
    const width = baseSurface
      ? "width" in baseSurface
        ? baseSurface.width
        : baseSurface.w
      : 0;
    const height = baseSurface
      ? "height" in baseSurface
        ? baseSurface.height
        : baseSurface.h
      : 0;

    if (!baseSurface || width !== this.pixelWidth || height !== this.pixelHeight) {
      surface.loadNewSurface(this.pixelWidth, this.pixelHeight);
    }
  }

  /**
   * Port of upstream `BBridge::GetCraneEntrance`.
   * Role: Reports the two crane entrance points at either end of the bridge.
   * Upstream: bbridge.cpp:454-474
   */
  override getCraneEntrance(): {
    canEnter: boolean;
    x: number;
    y: number;
    exitX: number;
    exitY: number;
  } {
    if (this.isVertical) {
      return {
        canEnter: true,
        x: this.position.x + 32,
        y: this.position.y - 32,
        exitX: this.position.x + 32,
        exitY: this.position.y + this.pixelHeight + 32,
      };
    }

    return {
      canEnter: true,
      x: this.position.x - 31,
      y: this.position.y + 31,
      exitX: this.position.x + this.pixelWidth + 32,
      exitY: this.position.y + 32,
    };
  }

  /**
   * Port of upstream `BBridge::GetCraneCenter`.
   * Role: Reports the bridge center used by crane interactions.
   * Upstream: bbridge.cpp:476-481
   */
  override getCraneCenter(): { hasCenter: boolean; x: number; y: number } {
    return {
      hasCenter: true,
      x: this.position.x + (this.pixelWidth >> 1),
      y: this.position.y + (this.pixelHeight >> 1),
    };
  }

  /**
   * Port of upstream `BBridge::ResetStats`.
   * Role: Recomputes bridge tile dimensions, object id, pixel dimensions, and center point.
   * Upstream: bbridge.cpp:427-447
   */
  resetStats(): void {
    if (this.isVertical) {
      this.width = 4;
      this.height = 5 + this.extraLinks;
      this.objectId = BuildingType.BridgeVertical;
    } else {
      this.width = 5 + this.extraLinks;
      this.height = 4;
      this.objectId = BuildingType.BridgeHorizontal;
    }

    this.pixelWidth = this.width * 16;
    this.pixelHeight = this.height * 16;
    this.centerX = this.position.x + (this.pixelWidth >> 1);
    this.centerY = this.position.y + (this.pixelHeight >> 1);
  }

  /**
   * Port of upstream `BBridge::SetIsVertical`.
   * Role: Updates bridge orientation, invalidates rendering, and recomputes bridge stats when changed.
   * Upstream: bbridge.cpp:400-409
   */
  setIsVertical(isVertical: boolean): void {
    if (this.isVertical !== isVertical) {
      this.isVertical = isVertical;
      this.doRerender = true;
      this.resetStats();
    }
  }

  /**
   * Port of upstream `BBridge::SetExtraLinks`.
   * Role: Updates bridge span length, invalidates rendering, and recomputes bridge stats when changed.
   * Upstream: bbridge.cpp:411-420
   */
  setExtraLinks(extraLinks: number): void {
    if (this.extraLinks !== extraLinks) {
      this.extraLinks = extraLinks;
      this.doRerender = true;
      this.resetStats();
    }
  }

  /**
   * Port of upstream `BBridge::DoExplosions`.
   * Role: Starts non-reversed bridge turret explosion effects.
   * Upstream: bbridge.cpp:125-128
   */
  doExplosions(
    effectList: BridgeTurrentEffectSpawn[] | null,
    randomInt: (maxExclusive: number) => number = (maxExclusive) =>
      Math.floor(Math.random() * maxExclusive),
  ): void {
    this.doTurrentEffect(false, effectList, randomInt);
  }

  /**
   * Port of upstream `BBridge::DoDeathEffect`.
   * Role: Starts bridge death explosion effects and invalidates the base render.
   * Upstream: bbridge.cpp:119-123
   */
  doDeathEffect(
    doFireDeath: boolean,
    doMissileDeath: boolean,
    effectList: BridgeTurrentEffectSpawn[] | null,
    randomInt: (maxExclusive: number) => number = (maxExclusive) =>
      Math.floor(Math.random() * maxExclusive),
  ): void {
    void doFireDeath;
    void doMissileDeath;
    this.doExplosions(effectList, randomInt);
    this.doBaseRerender = true;
  }

  /**
   * Port of upstream `BBridge::DoReviveEffect`.
   * Role: Schedules bridge revive rerendering and starts reversed turret effects.
   * Upstream: bbridge.cpp:130-138
   */
  doReviveEffect(
    currentTime: number,
    effectList: BridgeTurrentEffectSpawn[] | null,
    randomInt: (maxExclusive: number) => number = (maxExclusive) =>
      Math.floor(Math.random() * maxExclusive),
  ): void {
    this.doReviveRerender = true;
    this.nextReviveRerenderTime =
      currentTime + BRIDGE_REVIVE_RERENDER_DELAY_SECONDS;
    this.doTurrentEffect(true, effectList, randomInt);
  }

  /**
   * Port of upstream `BBridge::DoTurrentEffect`.
   * Role: Spawns bridge turret effect descriptors along the bridge span.
   * Upstream: bbridge.cpp:140-166
   */
  doTurrentEffect(
    isReversed: boolean,
    effectList: BridgeTurrentEffectSpawn[] | null,
    randomInt: (maxExclusive: number) => number = (maxExclusive) =>
      Math.floor(Math.random() * maxExclusive),
  ): void {
    if (this.isVertical) {
      const x = this.position.x + 16;
      let y = this.position.y + 16 + 5 + randomInt(10);

      while (y < this.pixelHeight + this.position.y - 16) {
        if (effectList) {
          effectList.push({
            x: x + randomInt(32),
            y,
            palette: this.palette,
            width: BRIDGE_TURRENT_EFFECT_WIDTH,
            height: BRIDGE_TURRENT_EFFECT_HEIGHT,
            isReversed,
          });
        }

        y += 5 + randomInt(10);
      }

      return;
    }

    let x = this.position.x + 16 + 5 + randomInt(10);
    const y = this.position.y + 16;

    while (x < this.pixelWidth + this.position.x - 16) {
      if (effectList) {
        effectList.push({
          x,
          y: y + randomInt(32),
          palette: this.palette,
          width: BRIDGE_TURRENT_EFFECT_WIDTH,
          height: BRIDGE_TURRENT_EFFECT_HEIGHT,
          isReversed,
        });
      }

      x += 5 + randomInt(10);
    }
  }

  /**
   * Port of upstream `BBridge::Process`.
   * Role: Detects bridge damage threshold transitions and completes delayed revive rerendering.
   * Upstream: bbridge.cpp:46-70
   */
  override process(
    currentTime = 0,
    effectList: BridgeTurrentEffectSpawn[] | null = null,
    randomInt: (maxExclusive: number) => number = (maxExclusive) =>
      Math.floor(Math.random() * maxExclusive),
  ): number {
    if (this.lastProcessHealth !== this.health) {
      const halfHealth = this.maxHealth >> 1;

      if (
        this.lastProcessHealth >= halfHealth &&
        this.health !== 0 &&
        this.health < halfHealth
      ) {
        this.doExplosions(effectList, randomInt);
        this.doBaseRerender = true;
      }

      this.lastProcessHealth = this.health;
    }

    if (
      this.doReviveRerender &&
      currentTime >= this.nextReviveRerenderTime
    ) {
      this.doReviveRerender = false;
      this.doBaseRerender = true;
    }

    return 1;
  }

  /**
   * Port of upstream `BBridge::ImpassCenter`.
   * Role: Updates passability for the bridge center tiles.
   * Upstream: bbridge.cpp:196-222
   */
  impassCenter(tmap: BridgeImpassableMap, impassable: boolean): void {
    let tileX = Math.trunc(this.position.x / 16);
    let tileY = Math.trunc(this.position.y / 16);
    const endX = tileX + this.width;
    const endY = tileY + this.height;

    if (this.isVertical) {
      for (; tileY < endY; tileY += 1) {
        tmap.setImpassable(tileX + 1, tileY, impassable);
        tmap.setImpassable(tileX + 2, tileY, impassable);
      }

      return;
    }

    for (; tileX < endX; tileX += 1) {
      tmap.setImpassable(tileX, tileY + 1, impassable);
      tmap.setImpassable(tileX, tileY + 2, impassable);
    }
  }

  /**
   * Port of upstream `BBridge::SetDestroyMapImpassables`.
   * Role: Marks bridge center tiles as blocked when the bridge is destroyed.
   * Upstream: bbridge.cpp:224-227
   */
  override setDestroyMapImpassables(tmap: BridgeImpassableMap): void {
    this.impassCenter(tmap, true);
  }

  /**
   * Port of upstream `BBridge::UnSetDestroyMapImpassables`.
   * Role: Clears bridge center tile blockage after destroy-time passability changes.
   * Upstream: bbridge.cpp:229-232
   */
  override unsetDestroyMapImpassables(tmap: BridgeImpassableMap): void {
    this.impassCenter(tmap, false);
  }

  /**
   * Port of upstream `BBridge::SetMapImpassables`.
   * Role: Marks the bridge edge rails as blocked while leaving the center passable.
   * Upstream: bbridge.cpp:168-194
   */
  override setMapImpassables(tmap: BridgeImpassableMap): void {
    let tileX = Math.trunc(this.position.x / 16);
    let tileY = Math.trunc(this.position.y / 16);
    const endX = tileX + this.width;
    const endY = tileY + this.height;

    if (this.isVertical) {
      for (; tileY < endY; tileY += 1) {
        tmap.setImpassable(tileX, tileY);
        tmap.setImpassable(tileX + 3, tileY);
      }

      return;
    }

    for (; tileX < endX; tileX += 1) {
      tmap.setImpassable(tileX, tileY);
      tmap.setImpassable(tileX, tileY + 3);
    }
  }

  /**
   * Port of upstream `BBridge::UnderCursorCanAttack`.
   * Role: Restricts bridge attack targeting to destroyed bridges or exposed edge sections.
   * Upstream: bbridge.cpp:234-259
   */
  override underCursorCanAttack(mapX: number, mapY: number): boolean {
    const localX = mapX - this.position.x;
    const localY = mapY - this.position.y;

    if (this.isDestroyed()) return true;

    if (this.isVertical) {
      if (pointsWithinArea(localX, localY, 0, 0, 16, this.pixelHeight)) {
        return true;
      }

      return pointsWithinArea(localX, localY, 16 * 3, 0, 16, this.pixelHeight);
    }

    if (pointsWithinArea(localX, localY, 0, 0, this.pixelWidth, 16)) {
      return true;
    }

    return pointsWithinArea(localX, localY, 0, 16 * 3, this.pixelWidth, 16);
  }
}
