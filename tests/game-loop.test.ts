import { describe, expect, it } from "vitest";
import { GameLoop } from "../src/app/GameLoop";

describe("GameLoop", () => {
  it("runs fixed updates before rendering", () => {
    let updates = 0;
    let renders = 0;
    const loop = new GameLoop({
      update: () => {
        updates += 1;
      },
      render: () => {
        renders += 1;
      },
    });

    loop.stepForTest(1 / 15);

    expect(updates).toBe(2);
    expect(renders).toBe(1);
  });
});
