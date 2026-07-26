import { GameEntity } from "./entities/GameEntity";
import { World } from "./World";
import { GameMap } from "../world/GameMap";

export function createVerticalSliceWorld(): World {
  const map = GameMap.createFlat({ width: 24, height: 16 });
  const world = new World(map);
  world.addEntity(
    new GameEntity({
      id: "robot-1",
      kind: "robot",
      position: { x: 8, y: 8 },
    }),
  );
  return world;
}
