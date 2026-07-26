import * as THREE from "three";
import type { GameEntity } from "../simulation/entities/GameEntity";

export class EntityView {
  readonly group = new THREE.Group();
  private readonly meshes = new Map<string, THREE.Mesh>();

  sync(entities: Map<string, GameEntity>, selectedEntityId: string | null): void {
    for (const entity of entities.values()) {
      let mesh = this.meshes.get(entity.id);
      if (!mesh) {
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.5, 0.7),
          new THREE.MeshBasicMaterial({ color: 0xb9d6ff }),
        );
        this.meshes.set(entity.id, mesh);
        this.group.add(mesh);
      }
      mesh.position.set(entity.position.x, 0.3, entity.position.y);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.color.set(entity.id === selectedEntityId ? 0xffdc5c : 0xb9d6ff);
    }
  }
}
