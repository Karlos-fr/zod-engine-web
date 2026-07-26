import type { GameEntity } from "./entities/GameEntity";
import type { GameMap } from "../world/GameMap";

export class World {
  readonly entities = new Map<string, GameEntity>();

  constructor(readonly map: GameMap) {}

  addEntity(entity: GameEntity): void {
    this.entities.set(entity.id, entity);
  }

  update(deltaSeconds: number): void {
    for (const entity of this.entities.values()) {
      entity.update(deltaSeconds);
    }
  }
}
