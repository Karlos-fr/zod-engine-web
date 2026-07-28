import { describe, expect, it } from "vitest";
import {
  checkMapEditorArgs,
  displayProperInit,
  parseMapEditorArgs,
} from "../src/world/MapEditorUsage";
import { PlanetType } from "../src/simulation/SimulationConstants";

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

  it("rejects startup options without a filename", () => {
    const result = checkMapEditorArgs("zod-map-editor", {
      filename: "",
      isNew: false,
      width: 0,
      height: 0,
      mapName: "",
    });

    expect(result.valid).toBe(false);
    expect(result.usageText).toBe(displayProperInit("zod-map-editor"));
  });

  it("rejects new-map startup options without dimensions or name", () => {
    expect(
      checkMapEditorArgs("zod-map-editor", {
        filename: "new.map",
        isNew: true,
        width: 0,
        height: 10,
        mapName: "virgin_soldiers",
      }).valid,
    ).toBe(false);
    expect(
      checkMapEditorArgs("zod-map-editor", {
        filename: "new.map",
        isNew: true,
        width: 10,
        height: 10,
        mapName: "",
      }).valid,
    ).toBe(false);
  });

  it("accepts load and new-map startup options", () => {
    expect(
      checkMapEditorArgs("zod-map-editor", {
        filename: "existing.map",
        isNew: false,
        width: 0,
        height: 0,
        mapName: "",
      }),
    ).toEqual({
      valid: true,
      usageText: null,
    });

    expect(
      checkMapEditorArgs("zod-map-editor", {
        filename: "new.map",
        isNew: true,
        width: 20,
        height: 30,
        mapName: "virgin_soldiers",
      }).valid,
    ).toBe(true);
  });

  it("ports getargs by parsing map editor startup options", () => {
    expect(
      parseMapEditorArgs([
        "zod-map-editor",
        "-n",
        "-f",
        "filename.map",
        "-d",
        "20x30",
        "-p",
        "jungle",
        "-m",
        "virgin_soldiers",
      ]),
    ).toEqual({
      filename: "filename.map",
      isNew: true,
      width: 20,
      height: 30,
      mapName: "virgin_soldiers",
      palette: PlanetType.Jungle,
    });
  });

  it("keeps getargs defaults for absent or unknown fields", () => {
    expect(parseMapEditorArgs(["zod-map-editor", "-p", "unknown"])).toEqual({
      filename: "",
      isNew: false,
      width: 0,
      height: 0,
      mapName: "",
      palette: PlanetType.Desert,
    });
  });

  it("ports getargs dimension parsing with atoi-style fallback", () => {
    expect(parseMapEditorArgs(["zod-map-editor", "-d", "12abcxnope"])).toEqual({
      filename: "",
      isNew: false,
      width: 12,
      height: 0,
      mapName: "",
      palette: PlanetType.Desert,
    });
    expect(parseMapEditorArgs(["zod-map-editor", "-d", "12-30"]).width).toBe(0);
  });
});
