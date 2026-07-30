import type { GameState } from "../app/GameState";
import type { World } from "../simulation/World";
import type { GameEntity } from "../simulation/entities/GameEntity";
import type { GameMap } from "../world/GameMap";
import { getScreenDimensions } from "./CanvasRendererInitialization";

const TILE_SIZE = 32;
const GRID_COLOR = "#24313b";
const BACKGROUND_COLOR = "#101318";
const TERRAIN_COLOR = "#365f3c";
const ENTITY_COLOR = "#b9d6ff";
const SELECTED_ENTITY_COLOR = "#ffdc5c";

export class Canvas2DRenderer {
  readonly domElement: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly host: HTMLElement) {
    this.domElement = document.createElement("canvas");
    this.domElement.className = "game-canvas";
    const context = this.domElement.getContext("2d");
    if (!context) {
      throw new Error("Canvas2D rendering context is not available");
    }
    this.context = context;
    this.host.appendChild(this.domElement);
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  render(world: World, state: GameState): void {
    this.resize();
    this.clear();
    this.renderTerrain(world.map);
    for (const entity of world.entities.values()) {
      this.renderEntity(entity, entity.id === state.selectedEntityId);
    }
  }

  dispose(): void {
    window.removeEventListener("resize", this.resize);
    this.domElement.remove();
  }

  private readonly resize = (): void => {
    const { width, height } = getScreenDimensions(this.host, window);
    const pixelRatio = window.devicePixelRatio || 1;
    const displayWidth = Math.max(1, Math.floor(width));
    const displayHeight = Math.max(1, Math.floor(height));
    const canvasWidth = Math.max(1, Math.floor(displayWidth * pixelRatio));
    const canvasHeight = Math.max(1, Math.floor(displayHeight * pixelRatio));

    if (this.domElement.width !== canvasWidth || this.domElement.height !== canvasHeight) {
      this.domElement.width = canvasWidth;
      this.domElement.height = canvasHeight;
      this.domElement.style.width = `${displayWidth}px`;
      this.domElement.style.height = `${displayHeight}px`;
      this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
  };

  private clear(): void {
    this.context.fillStyle = BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.domElement.clientWidth, this.domElement.clientHeight);
  }

  private renderTerrain(map: GameMap): void {
    const width = map.width * TILE_SIZE;
    const height = map.height * TILE_SIZE;

    this.context.fillStyle = TERRAIN_COLOR;
    this.context.fillRect(0, 0, width, height);
    this.context.strokeStyle = GRID_COLOR;
    this.context.lineWidth = 1;
    this.context.beginPath();
    for (let x = 0; x <= map.width; x += 1) {
      this.context.moveTo(x * TILE_SIZE + 0.5, 0);
      this.context.lineTo(x * TILE_SIZE + 0.5, height);
    }
    for (let y = 0; y <= map.height; y += 1) {
      this.context.moveTo(0, y * TILE_SIZE + 0.5);
      this.context.lineTo(width, y * TILE_SIZE + 0.5);
    }
    this.context.stroke();
  }

  private renderEntity(entity: GameEntity, selected: boolean): void {
    const size = TILE_SIZE * 0.7;
    const x = entity.position.x * TILE_SIZE - size / 2;
    const y = entity.position.y * TILE_SIZE - size / 2;

    this.context.fillStyle = selected ? SELECTED_ENTITY_COLOR : ENTITY_COLOR;
    this.context.fillRect(x, y, size, size);
    this.context.strokeStyle = "#111820";
    this.context.lineWidth = 2;
    this.context.strokeRect(x, y, size, size);
  }
}
