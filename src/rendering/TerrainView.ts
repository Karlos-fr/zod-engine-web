import * as THREE from "three";
import type { GameMap } from "../world/GameMap";

export class TerrainView {
  readonly group = new THREE.Group();
  private renderedKey = "";

  sync(map: GameMap): void {
    const key = `${map.width}x${map.height}`;
    if (key === this.renderedKey) {
      return;
    }
    this.renderedKey = key;
    this.group.clear();

    const geometry = new THREE.BoxGeometry(map.width, 0.1, map.height);
    const material = new THREE.MeshBasicMaterial({ color: 0x3c6f42 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(map.width / 2, -0.05, map.height / 2);
    this.group.add(mesh);

    const grid = new THREE.GridHelper(Math.max(map.width, map.height), Math.max(map.width, map.height));
    grid.position.set(map.width / 2, 0.01, map.height / 2);
    this.group.add(grid);
  }
}
