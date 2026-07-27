import type { Vector2 } from "../../world/Vector2";

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

  constructor(options: { id: string; kind: string; position: Vector2 }) {
    this.id = options.id;
    this.kind = options.kind;
    this.position = { ...options.position };
  }

  issueMoveOrder(target: Vector2): void {
    this.target = { ...target };
  }

  setLastAiBuildTime(value: number): void {
    this.aiLastSetBuildTime = value;
  }

  getLastAiBuildTime(): number {
    return this.aiLastSetBuildTime;
  }

  getInitialHealthPercent(): number {
    return this.initialHealthPercent;
  }

  getCoordinates(): Vector2 {
    return { ...this.position };
  }

  getAttackRadius(): number {
    return this.attackRadius;
  }

  setJustLeftCannon(value: boolean): void {
    this.justLeftCannon = value;
  }

  getPixelDimensions(): { width: number; height: number } {
    return {
      width: this.pixelWidth,
      height: this.pixelHeight,
    };
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
