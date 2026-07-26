export type GameLoopHandlers = {
  update: (deltaSeconds: number) => void;
  render: () => void;
};

export class GameLoop {
  private readonly fixedStepSeconds = 1 / 30;
  private readonly maxFrameSeconds = 0.25;
  private readonly handlers: GameLoopHandlers;
  private animationFrame = 0;
  private previousTime = 0;
  private accumulator = 0;
  private running = false;

  constructor(handlers: GameLoopHandlers) {
    this.handlers = handlers;
  }

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.previousTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
  }

  stepForTest(deltaSeconds: number): void {
    this.advance(deltaSeconds);
    this.handlers.render();
  }

  private readonly tick = (time: number): void => {
    if (!this.running) {
      return;
    }

    const deltaSeconds = Math.min(
      (time - this.previousTime) / 1000,
      this.maxFrameSeconds,
    );
    this.previousTime = time;
    this.advance(deltaSeconds);
    this.handlers.render();
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  private advance(deltaSeconds: number): void {
    this.accumulator += deltaSeconds;
    while (this.accumulator >= this.fixedStepSeconds) {
      this.handlers.update(this.fixedStepSeconds);
      this.accumulator -= this.fixedStepSeconds;
    }
  }
}
