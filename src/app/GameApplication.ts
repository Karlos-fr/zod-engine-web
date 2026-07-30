import { GameLoop } from "./GameLoop";
import { GameState } from "./GameState";
import { World } from "../simulation/World";
import { InputController } from "../input/InputController";
import { Canvas2DRenderer } from "../rendering/Canvas2DRenderer";
import { createVerticalSliceWorld } from "../simulation/verticalSlice";

export class GameApplication {
  private readonly state: GameState;
  private readonly world: World;
  private readonly renderer: Canvas2DRenderer;
  private readonly input: InputController;
  private readonly loop: GameLoop;

  constructor(host: HTMLElement) {
    this.state = new GameState();
    this.world = createVerticalSliceWorld();
    this.renderer = new Canvas2DRenderer(host);
    this.input = new InputController(this.renderer.domElement, this.world);
    this.loop = new GameLoop({
      update: (deltaSeconds) => this.world.update(deltaSeconds),
      render: () => this.renderer.render(this.world, this.state),
    });
  }

  start(): void {
    this.input.connect();
    this.loop.start();
  }

  stop(): void {
    this.loop.stop();
    this.input.disconnect();
    this.renderer.dispose();
  }
}
