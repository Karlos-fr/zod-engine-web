/**
 * Ported from Zod Engine.
 * Upstream: zobject.h
 */

import type { Vector2 } from "../../world/Vector2";
import { TeamType } from "../SimulationConstants";

/**
 * Browser simulation entity containing the subset of `ZObject` behavior already ported.
 * Role: Owns mutable runtime state for an object in the simulation world.
 * Ledger: see accessor entity comments and PORTING_LEDGER.md
 * Upstream: zobject.h
 */
export class GameEntity {
  readonly id: string;
  readonly kind: string;
  position: Vector2;
  target: Vector2 | null = null;
  speedTilesPerSecond = 2;
  aiLastSetBuildTime = 0;
  initialHealthPercent = 0;
  attackRadius = 0;
  justLeftCannon = false;
  pixelWidth = 0;
  pixelHeight = 0;
  owner: TeamType;

  constructor(options: { id: string; kind: string; position: Vector2; owner?: TeamType }) {
    this.id = options.id;
    this.kind = options.kind;
    this.position = { ...options.position };
    this.owner = options.owner ?? TeamType.Null;
  }

  issueMoveOrder(target: Vector2): void {
    this.target = { ...target };
  }

  /**
   * Port of upstream `SetLastSetAIBuildTime`.
   * Role: Records when AI production timing was last updated for this entity.
   * Ledger: FUN-242A7B
   * Upstream: zobject.h:563
   */
  setLastAiBuildTime(value: number): void {
    this.aiLastSetBuildTime = value;
  }

  /**
   * Port of upstream `GetLastSetAIBuildTime`.
   * Role: Reads the entity's last AI production timing update.
   * Ledger: FUN-3A4749
   * Upstream: zobject.h:562
   */
  getLastAiBuildTime(): number {
    return this.aiLastSetBuildTime;
  }

  /**
   * Port of upstream `GetInitialHealthPercent`.
   * Role: Reports the entity health percentage captured at spawn or load time.
   * Ledger: FUN-764999
   * Upstream: zobject.h:433
   */
  getInitialHealthPercent(): number {
    return this.initialHealthPercent;
  }

  /**
   * Port of upstream `GetCords`.
   * Role: Returns the entity's current world coordinates.
   * Ledger: FUN-7DC476
   * Upstream: zobject.h:407
   */
  getCoordinates(): Vector2 {
    return { ...this.position };
  }

  /**
   * Port of upstream `GetAttackRadius`.
   * Role: Reports the attack radius for targeting and weapon checks.
   * Ledger: FUN-A5B907
   * Upstream: zobject.h:446
   */
  getAttackRadius(): number {
    return this.attackRadius;
  }

  /**
   * Port of upstream `SetJustLeftCannon`.
   * Role: Stores whether the entity has just exited cannon control.
   * Ledger: FUN-F14D8F
   * Upstream: zobject.h:546
   */
  setJustLeftCannon(value: boolean): void {
    this.justLeftCannon = value;
  }

  /**
   * Port of upstream `GetDimensionsPixel`.
   * Role: Returns the entity sprite dimensions used for pixel-space rendering.
   * Ledger: FUN-F15DA4
   * Upstream: zobject.h:306
   */
  getPixelDimensions(): { width: number; height: number } {
    return {
      width: this.pixelWidth,
      height: this.pixelHeight,
    };
  }

  /**
   * Port of upstream `GetOwner`.
   * Role: Reports the team that owns this entity.
   * Ledger: FUN-153E7E
   * Upstream: zobject.h:304
   */
  getOwner(): TeamType {
    return this.owner;
  }

  update(deltaSeconds: number): void {
    if (!this.target) {
      return;
    }

    const dx = this.target.x - this.position.x;
    const yDistance = this.target.y - this.position.y;
    const distance = Math.hypot(dx, yDistance);

    if (distance < 0.01) {
      this.position = { ...this.target };
      this.target = null;
      return;
    }

    const step = Math.min(distance, this.speedTilesPerSecond * deltaSeconds);
    this.position.x += (dx / distance) * step;
    this.position.y += (yDistance / distance) * step;
  }
}
