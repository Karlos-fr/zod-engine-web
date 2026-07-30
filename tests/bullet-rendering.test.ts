import { describe, expect, it } from "vitest";
import { renderBullet } from "../src/rendering/BulletRendering";
import { TeamType } from "../src/simulation/SimulationConstants";

describe("bullet rendering", () => {
  it("replaces EBullet::DoRender with a team-colored 2x2 fill command", () => {
    expect(
      renderBullet(
        { x: 14, y: 9, owner: TeamType.Blue, killme: false },
        { shiftX: 4, shiftY: 3, viewWidth: 20, viewHeight: 10 },
      ),
    ).toEqual({
      region: {
        x: 10,
        y: 6,
        width: 2,
        height: 2,
      },
      color: {
        red: 19,
        green: 55,
        blue: 251,
        alpha: 255,
      },
      clear: false,
    });
  });

  it("keeps EBullet::DoRender no-op behavior for killed and offscreen bullets", () => {
    const viewport = { shiftX: 4, shiftY: 3, viewWidth: 20, viewHeight: 10 };

    expect(renderBullet({ x: 14, y: 9, owner: TeamType.Red, killme: true }, viewport)).toBeNull();
    expect(renderBullet({ x: 3, y: 9, owner: TeamType.Red, killme: false }, viewport)).toBeNull();
    expect(renderBullet({ x: 14, y: 2, owner: TeamType.Red, killme: false }, viewport)).toBeNull();
    expect(renderBullet({ x: 25, y: 9, owner: TeamType.Red, killme: false }, viewport)).toBeNull();
    expect(renderBullet({ x: 14, y: 14, owner: TeamType.Red, killme: false }, viewport)).toBeNull();
  });
});
