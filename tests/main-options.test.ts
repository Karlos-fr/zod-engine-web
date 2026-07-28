import { describe, expect, it } from "vitest";
import {
  displayMainHelp,
  displayMainVersion,
  getopt,
  MAIN_OPTIONS_HEADER_GUARD_PORTED,
  XGETOPT_HEADER_GUARD_PORTED,
} from "../src/app/MainOptions";
import type { GetoptState } from "../src/app/MainOptions";

describe("main options", () => {
  it("adapts the main.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/app/MainOptions");
    const secondImport = await import("../src/app/MainOptions");

    expect(MAIN_OPTIONS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.MAIN_OPTIONS_HEADER_GUARD_PORTED).toBe(
      firstImport.MAIN_OPTIONS_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the xgetopt.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/app/MainOptions");
    const secondImport = await import("../src/app/MainOptions");

    expect(XGETOPT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.XGETOPT_HEADER_GUARD_PORTED).toBe(
      firstImport.XGETOPT_HEADER_GUARD_PORTED,
    );
  });

  it("ports the main executable command help text", () => {
    expect(displayMainHelp("zod")).toBe(
      [
        "",
        "==================================================================",
        "Command list...",
        "-c ip_address        - game host address",
        "-m filename          - map to be used",
        "-l filename          - map list to be used",
        "-z filename          - settings file to be used",
        "-e filename          - main server settings file to be used",
        "-n player_name       - your player name",
        "-g login_name        - your login name",
        "-i login_password    - your login password",
        "-t team              - your team",
        "-b team              - connect a bot player",
        "-w                   - run game in windowed mode",
        "-r resolution        - resolution to run the game at",
        "-d                   - run a dedicated server",
        "-h                   - display command help",
        "-s                   - no sound",
        "-u                   - no music",
        "-o                   - no opengl",
        "-k                   - use faster and blander cursor",
        "-v                   - display version and credits",
        "-a                   - run shell based tray app",
        "",
        "Example usage...",
        "zod -c localhost -r 800x600 -w",
        "zod -m level1.map -b 1 -p 1",
        "==================================================================",
        "",
      ].join("\n"),
    );
  });

  it("ports the main executable version text", () => {
    expect(displayMainVersion()).toBe(
      [
        "\nZod: A Zed Engine, Version Alpha",
        "By Michael Bok",
        "Please visit http://zod.sourceforge.net/ and http://zzone.lewe.com/",
        "",
      ].join("\n"),
    );
  });

  it("ports the OpenGL-disabled version text variant", () => {
    expect(displayMainVersion(false)).toBe(
      [
        "\nZod: A Zed Engine, Version Alpha (OpenGL Disabled)",
        "By Michael Bok",
        "Please visit http://zod.sourceforge.net/ and http://zzone.lewe.com/",
        "",
      ].join("\n"),
    );
  });

  it("ports getopt scanning for grouped short options", () => {
    const state: GetoptState = { optind: 0, optarg: null, next: null };
    const argv = ["zod", "-wsk"];

    expect(getopt(argv, "wsk", state)).toBe("w");
    expect(state).toEqual({ optind: 2, optarg: null, next: "sk" });
    expect(getopt(argv, "wsk", state)).toBe("s");
    expect(state).toEqual({ optind: 2, optarg: null, next: "k" });
    expect(getopt(argv, "wsk", state)).toBe("k");
    expect(state).toEqual({ optind: 2, optarg: null, next: "" });
    expect(getopt(argv, "wsk", state)).toBe(-1);
    expect(state.optarg).toBeNull();
  });

  it("ports getopt arguments attached to or separated from options", () => {
    const state: GetoptState = { optind: 0, optarg: null, next: null };
    const argv = ["zod", "-clocalhost", "-r", "800x600"];

    expect(getopt(argv, "c:r:", state)).toBe("c");
    expect(state).toEqual({ optind: 2, optarg: "localhost", next: null });
    expect(getopt(argv, "c:r:", state)).toBe("r");
    expect(state).toEqual({ optind: 4, optarg: "800x600", next: "" });
    expect(getopt(argv, "c:r:", state)).toBe(-1);
  });

  it("ports getopt end-of-options and non-option handling", () => {
    const stoppedByDoubleDash: GetoptState = {
      optind: 0,
      optarg: null,
      next: null,
    };
    expect(getopt(["zod", "--", "map.zod"], "m:", stoppedByDoubleDash)).toBe(
      -1,
    );
    expect(stoppedByDoubleDash).toEqual({
      optind: 2,
      optarg: "map.zod",
      next: null,
    });

    const stoppedByOperand: GetoptState = {
      optind: 0,
      optarg: null,
      next: null,
    };
    expect(getopt(["zod", "map.zod"], "m:", stoppedByOperand)).toBe(-1);
    expect(stoppedByOperand).toEqual({
      optind: 1,
      optarg: "map.zod",
      next: null,
    });
  });

  it("ports getopt error results", () => {
    const invalidOption: GetoptState = { optind: 0, optarg: null, next: null };
    expect(getopt(["zod", "-x"], "w", invalidOption)).toBe("?");
    expect(invalidOption).toEqual({ optind: 2, optarg: null, next: "" });

    const missingArgument: GetoptState = { optind: 0, optarg: null, next: null };
    expect(getopt(["zod", "-c"], "c:", missingArgument)).toBe("?");
    expect(missingArgument).toEqual({ optind: 2, optarg: null, next: "" });
  });
});
