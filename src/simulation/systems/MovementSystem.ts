import type { World } from "../World";

export function updateMovement(world: World, deltaSeconds: number): void {
  world.update(deltaSeconds);
}
