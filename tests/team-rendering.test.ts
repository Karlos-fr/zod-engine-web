import { describe, expect, it } from "vitest";
import { TeamType } from "../src/simulation/SimulationConstants";
import {
  TEAM_RENDERING_BASE_TEAM,
  TEAM_RENDERING_PALETTE_MAX,
  ZTEAM_HEADER_GUARD_PORTED,
} from "../src/simulation/TeamRendering";

describe("team rendering", () => {
  it("adapts the zteam.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TeamRendering");
    const secondImport = await import("../src/simulation/TeamRendering");

    expect(ZTEAM_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZTEAM_HEADER_GUARD_PORTED).toBe(
      firstImport.ZTEAM_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the base recoloring team", () => {
    expect(TEAM_RENDERING_BASE_TEAM).toBe(TeamType.Red);
  });

  it("adapts the team palette replacement slot count", () => {
    expect(TEAM_RENDERING_PALETTE_MAX).toBe(16);
  });
});
