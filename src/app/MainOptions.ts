/**
 * Upstream: main.h, xgetopt.h
 */

/**
 * Port of upstream `_MAIN_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: main.h:2
 */
export const MAIN_OPTIONS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `XGETOPT_H`.
 * Role: Marks an upstream header boundary.
 * Upstream: xgetopt.h:20
 */
export const XGETOPT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `getopt` state.
 * Role: Tracks the current option index, option argument, and grouped-option cursor.
 * Upstream: xgetopt.h:29-90
 */
export type GetoptState = {
  optind: number;
  optarg: string | null;
  next: string | null;
};

/**
 * Port of upstream `getopt`.
 * Role: Reads the next short command-line option from an argument vector.
 * Upstream: xgetopt.h:29-90
 */
export function getopt(
  argv: readonly string[],
  optstring: string,
  state: GetoptState,
): string | -1 {
  if (state.optind === 0) {
    state.next = null;
  }

  state.optarg = null;

  if (state.next === null || state.next.length === 0) {
    if (state.optind === 0) {
      state.optind += 1;
    }

    const current = argv[state.optind];
    if (
      state.optind >= argv.length ||
      current === undefined ||
      current[0] !== "-" ||
      current[1] === undefined
    ) {
      state.optarg = state.optind < argv.length ? argv[state.optind] : null;
      return -1;
    }

    if (current === "--") {
      state.optind += 1;
      state.optarg = state.optind < argv.length ? argv[state.optind] : null;
      return -1;
    }

    state.next = current.slice(1);
    state.optind += 1;
  }

  const option = state.next[0];
  state.next = state.next.slice(1);

  const optionIndex = optstring.indexOf(option);
  if (optionIndex === -1 || option === ":") {
    return "?";
  }

  if (optstring[optionIndex + 1] === ":") {
    if (state.next.length > 0) {
      state.optarg = state.next;
      state.next = null;
    } else if (state.optind < argv.length) {
      state.optarg = argv[state.optind];
      state.optind += 1;
    } else {
      return "?";
    }
  }

  return option;
}

/**
 * Port of upstream `display_help`.
 * Role: Builds the startup command help text for the main game executable.
 * Upstream: main.cpp:179-208
 */
export function displayMainHelp(shellCommand: string): string {
  return [
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
    `${shellCommand} -c localhost -r 800x600 -w`,
    `${shellCommand} -m level1.map -b 1 -p 1`,
    "==================================================================",
    "",
  ].join("\n");
}

/**
 * Port of upstream `display_version`.
 * Role: Builds the startup version and credits text for the main game executable.
 * Upstream: main.cpp:210-219
 */
export function displayMainVersion(useCanvasRenderer = true): string {
  return [
    useCanvasRenderer
      ? "\nZod: A Zed Engine, Version Alpha"
      : "\nZod: A Zed Engine, Version Alpha (OpenGL Disabled)",
    "By Michael Bok",
    "Please visit http://zod.sourceforge.net/ and http://zzone.lewe.com/",
    "",
  ].join("\n");
}
