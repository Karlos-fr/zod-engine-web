/**
 * Upstream: bbridge.h / bbridge.cpp
 */

import { BuildingType, PlanetType, TeamType } from "../SimulationConstants";
import type { BridgeTurrentEffectSpawn } from "../BridgeTurretEffect";
import { GameEntity } from "./GameEntity";

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
  isVertical = false;

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
}
