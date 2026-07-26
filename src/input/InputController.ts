import type { World } from "../simulation/World";

export class InputController {
  constructor(
    private readonly element: HTMLElement,
    private readonly world: World,
  ) {}

  connect(): void {
    this.element.addEventListener("click", this.handleClick);
  }

  disconnect(): void {
    this.element.removeEventListener("click", this.handleClick);
  }

  private readonly handleClick = (): void => {
    const entity = this.world.entities.values().next().value;
    if (!entity) {
      return;
    }
    entity.issueMoveOrder({
      x: 4 + Math.random() * 16,
      y: 4 + Math.random() * 8,
    });
  };
}
