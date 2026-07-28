import { getopt, type GetoptState } from "../app/MainOptions";
import { PlanetType } from "../simulation/SimulationConstants";

/**
 * Upstream: map_editor.cpp
 */

/**
 * Browser-side replacement for map editor startup globals.
 * Role: Stores the map editor startup fields needed for argument validation.
 * Upstream: map_editor.cpp:567-585
 */
export type MapEditorStartupOptions = {
  filename: string;
  isNew: boolean;
  width: number;
  height: number;
  mapName: string;
};

/**
 * Browser-side replacement for map editor argument globals.
 * Role: Stores the parsed startup fields set by map editor command-line options.
 * Upstream: map_editor.cpp:587-631
 */
export type MapEditorParsedArgs = MapEditorStartupOptions & {
  palette: PlanetType;
};

/**
 * Browser-side result for map editor startup validation.
 * Role: Carries whether startup options are valid and the usage text to display when invalid.
 * Upstream: map_editor.cpp:567-585
 */
export type MapEditorStartupValidation = {
  valid: boolean;
  usageText: string | null;
};

/**
 * Port of upstream `display_proper_init`.
 * Role: Builds the startup usage text shown by the standalone Zod map editor.
 * Upstream: map_editor.cpp:550-565
 */
export function displayProperInit(execCommand: string): string {
  return [
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
    `${execCommand} -n -f filename.map -d 20x30 -p desert -m virgin_soldiers`,
    `${execCommand} -f filename.map`,
    "========================================================",
    "",
  ].join("\n");
}

/**
 * Port of upstream `checkargs`.
 * Role: Validates the startup options required by the standalone map editor.
 * Upstream: map_editor.cpp:567-585
 */
export function checkMapEditorArgs(
  execCommand: string,
  options: MapEditorStartupOptions,
): MapEditorStartupValidation {
  if (options.filename.length === 0) {
    return {
      valid: false,
      usageText: displayProperInit(execCommand),
    };
  }

  if (
    options.isNew &&
    (options.width === 0 || options.height === 0 || options.mapName.length === 0)
  ) {
    return {
      valid: false,
      usageText: displayProperInit(execCommand),
    };
  }

  return {
    valid: true,
    usageText: null,
  };
}

/**
 * Port of upstream `getargs`.
 * Role: Parses standalone map editor command-line options into startup fields.
 * Upstream: map_editor.cpp:587-631
 */
export function parseMapEditorArgs(argv: readonly string[]): MapEditorParsedArgs {
  const options: MapEditorParsedArgs = {
    filename: "",
    isNew: false,
    width: 0,
    height: 0,
    mapName: "",
    palette: PlanetType.Desert,
  };
  const state: GetoptState = { optind: 0, optarg: null, next: null };

  let option = getopt(argv, "f:d:p:m:n", state);
  while (option !== -1) {
    switch (option) {
      case "f":
        if (state.optarg === null) {
          return options;
        }
        options.filename = state.optarg;
        break;
      case "d":
        if (state.optarg === null) {
          return options;
        }
        parseMapEditorDimensions(state.optarg, options);
        break;
      case "p":
        if (state.optarg === null) {
          return options;
        }
        options.palette = parseMapEditorPalette(state.optarg);
        break;
      case "m":
        if (state.optarg === null) {
          return options;
        }
        options.mapName = state.optarg;
        break;
      case "n":
        options.isNew = true;
        break;
    }

    option = getopt(argv, "f:d:p:m:n", state);
  }

  return options;
}

const mapEditorPlanetTypeNames: ReadonlyArray<[string, PlanetType]> = [
  ["desert", PlanetType.Desert],
  ["volcanic", PlanetType.Volcanic],
  ["arctic", PlanetType.Arctic],
  ["jungle", PlanetType.Jungle],
  ["city", PlanetType.City],
];

function parseMapEditorDimensions(
  dimensions: string,
  options: MapEditorParsedArgs,
): void {
  const separatorIndex = dimensions.indexOf("x");
  if (separatorIndex === -1) {
    return;
  }

  options.width = parseAtoi(dimensions.slice(0, separatorIndex));
  options.height = parseAtoi(dimensions.slice(separatorIndex + 1));
}

function parseMapEditorPalette(name: string): PlanetType {
  return (
    mapEditorPlanetTypeNames.find(([planetName]) => planetName === name)?.[1] ??
    PlanetType.Desert
  );
}

function parseAtoi(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
