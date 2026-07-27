import { describe, expect, it } from "vitest";
import { displayProperInit } from "../src/world/MapEditorUsage";

describe("map editor usage", () => {
  it("ports display_proper_init as deterministic startup help text", () => {
    expect(displayProperInit("zod-map-editor")).toBe(
      [
        "Welcome to the Zod Map Editor",
        "",
        "========================================================",
        "Command list...",
        "-f filename              - filename to be loaded / saved",
        "-d dimensions            - dimensions of a new map ",
        "-p palette               - planet palette of a new map",
        "-m mapname               - mapname of a new map",
        "-n                       - create map instead of load",
        "",
        "Eample usage...",
        "zod-map-editor -n -f filename.map -d 20x30 -p desert -m virgin_soldiers",
        "zod-map-editor -f filename.map",
        "========================================================",
        "",
      ].join("\n"),
    );
  });
});
