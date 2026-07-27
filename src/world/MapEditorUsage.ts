/**
 * Ported from Zod Engine.
 * Upstream: map_editor.cpp
 * Symbols: display_proper_init
 */

/**
 * Port of upstream `display_proper_init`.
 * Role: Builds the startup usage text shown by the standalone Zod map editor.
 * Ledger: FUN-B2CCDC
 * Upstream: map_editor.cpp:550-565
 * Adaptation: Returns text instead of writing directly to stdout with `printf`. * - Preserves upstream wording, including the `Eample usage` typo.
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
