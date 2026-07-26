import { GameLoop } from "./GameLoop";
import { GameState } from "./GameState";
import { World } from "../simulation/World";
import { InputController } from "../input/InputController";
import { ThreeRenderer } from "../rendering/ThreeRenderer";
import { createVerticalSliceWorld } from "../simulation/verticalSlice";

export class GameApplication {
  private readonly state: GameState;
  private readonly world: World;
  private readonly renderer: ThreeRenderer;
  private readonly input: InputController;
  private readonly loop: GameLoop;

  constructor(host: HTMLElement) {
    this.state = new GameState();
    this.world = createVerticalSliceWorld();
    this.renderer = new ThreeRenderer(host);
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
