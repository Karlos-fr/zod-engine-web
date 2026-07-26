import * as THREE from "three";
import type { GameState } from "../app/GameState";
import type { World } from "../simulation/World";
import { CameraController } from "./CameraController";
import { EntityView } from "./EntityView";
import { TerrainView } from "./TerrainView";

export class ThreeRenderer {
  readonly domElement: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly cameraController: CameraController;
  private readonly terrainView = new TerrainView();
  private readonly entityView = new EntityView();

  constructor(private readonly host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.domElement = this.renderer.domElement;
    this.host.appendChild(this.domElement);
    this.scene.background = new THREE.Color(0x101318);
    this.cameraController = new CameraController();
    this.scene.add(this.terrainView.group, this.entityView.group);
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  render(world: World, state: GameState): void {
    this.terrainView.sync(world.map);
    this.entityView.sync(world.entities, state.selectedEntityId);
    this.renderer.render(this.scene, this.cameraController.camera);
  }

  dispose(): void {
    window.removeEventListener("resize", this.resize);
    this.renderer.dispose();
    this.domElement.remove();
  }

  private readonly resize = (): void => {
    const width = this.host.clientWidth || window.innerWidth;
    const height = this.host.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.cameraController.resize(width, height);
  };
}
