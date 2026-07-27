/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: common.cpp
 * - Symbols: clean_newline, create_folder, data_to_hex_string, distance,
 *   dirent, file_can_be_written, good_user_char, lcase, point_distance_from_line,
 *   points_within_area, points_within_distance, print_dump, sort_string_func,
 *   split, timeval, uni_pause
 * - Ledger: FUN-1BE126, FUN-B95428, FUN-5F1997, FUN-ABEA7C, STR-1D8775,
 *   FUN-1C4E95, FUN-3667DC, FUN-F3E417, FUN-BFB321, FUN-43910E, FUN-016B43,
 *   FUN-370236, STR-037FF7, FUN-72F8C3, FUN-7CC24F, FUN-9FDD49
 *
 * Porting notes:
 * - Native filesystem probes are represented with injectable browser-safe
 *   adapters.
 * - Mutable C string buffers are represented as returned JavaScript strings.
 * - Mutable C cursor pointers are represented as returned cursor values.
 * - Native C string comparison is represented with deterministic UTF-8 byte
 *   ordering for browser and Node runtimes.
 * - Native `printf` debug output is represented as returned text.
 * - Native blocking sleeps are represented as asynchronous waits.
 */

const utf8Encoder = new TextEncoder();

/**
 * Port of upstream `dirent`.
 *
 * Role:
 * - Represents a directory entry returned by platform directory iteration.
 *
 * Ledger: STR-1D8775
 * Upstream: common.cpp:344-356
 *
 * Adaptation:
 * - Represents the POSIX `d_name` and `d_type` fields as browser-safe data.
 */
export type DirectoryEntry = {
  name: string;
  type: "regular" | "directory" | "other";
};

/**
 * Result shape for the TypeScript adaptation of upstream `split`.
 *
 * Role:
 * - Carries the extracted token and replacement cursor for the mutated C
 *   destination buffer and `initial` pointer.
 *
 * Ledger: FUN-370236
 * Upstream: common.cpp:93-124
 *
 * Adaptation:
 * - Added as TypeScript support data for the ported function.
 */
export type SplitResult = {
  value: string;
  nextInitial: number;
};

/**
 * Port of upstream `timeval`.
 *
 * Role:
 * - Stores wall-clock seconds and microseconds returned by `gettimeofday`.
 *
 * Ledger: STR-037FF7
 * Upstream: common.cpp:77-87
 *
 * Adaptation:
 * - Represents the POSIX `tv_sec` and `tv_usec` fields as camelCase numeric
 *   properties.
 */
export type Timeval = {
  tvSec: number;
  tvUsec: number;
};

/**
 * Port of upstream `clean_newline`.
 *
 * Role:
 * - Truncates a line buffer at the first newline, carriage return, or null
 *   terminator observed within the inspected size.
 *
 * Ledger: FUN-1BE126
 * Upstream: common.cpp:126-145
 *
 * Adaptation:
 * - Replaces in-place `char *` mutation with a returned string prefix.
 */
export function cleanNewline(message: string, size = message.length): string {
  const limit = Math.min(Math.max(size, 0), message.length);

  for (let index = 0; index < limit; index += 1) {
    const character = message[index];

    if (character === "\r" || character === "\n" || character === "\0") {
      return message.slice(0, index);
    }
  }

  return message;
}

/**
 * Port of upstream `create_folder`.
 *
 * Role:
 * - Requests creation of a folder path through the platform filesystem.
 *
 * Ledger: FUN-B95428
 * Upstream: common.cpp:46-53
 *
 * Adaptation:
 * - Replaces direct `mkdir` access with an injectable adapter so browser code
 *   can provide storage-specific directory creation.
 */
export function createFolder(
  folderName: string,
  makeDirectory: (folderName: string) => unknown = () => {
    throw new Error("No directory creation adapter available.");
  },
): boolean {
  try {
    makeDirectory(folderName);
    return true;
  } catch {
    return false;
  }
}

/**
 * Port of upstream `data_to_hex_string`.
 *
 * Role:
 * - Converts a byte buffer into a continuous lowercase hexadecimal string.
 *
 * Ledger: FUN-5F1997
 * Upstream: common.cpp:289-303
 *
 * Notes:
 * - Each byte is formatted with two hex digits, matching upstream `%02x`.
 */
export function dataToHexString(data: readonly number[], size = data.length): string {
  const limit = Math.min(Math.max(size, 0), data.length);
  let output = "";

  for (let index = 0; index < limit; index += 1) {
    output += (data[index] & 0xff).toString(16).padStart(2, "0");
  }

  return output;
}

/**
 * Port of upstream `distance`.
 *
 * Role:
 * - Computes Euclidean distance between two integer coordinate points.
 *
 * Ledger: FUN-ABEA7C
 * Upstream: common.cpp:178-184
 *
 * Notes:
 * - Preserves upstream `sqrt((dx * dx) + (dy * dy))` behavior.
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Port of upstream `file_can_be_written`.
 *
 * Role:
 * - Reports whether a target path can be opened for append-style writing.
 *
 * Ledger: FUN-1C4E95
 * Upstream: common.cpp:305-316
 *
 * Adaptation:
 * - Replaces direct `fopen(filename, "a")` access with an injectable probe so
 *   browser code can provide storage-specific write checks.
 */
export function fileCanBeWritten(
  filename: string,
  openForAppend: (filename: string) => unknown = () => {
    throw new Error("No append probe available.");
  },
): boolean {
  try {
    openForAppend(filename);
    return true;
  } catch {
    return false;
  }
}

/**
 * Port of upstream `good_user_char`.
 *
 * Role:
 * - Checks whether a character is allowed in upstream user-facing text fields.
 *
 * Ledger: FUN-7CC24F
 * Upstream: common.cpp:233-243
 *
 * Notes:
 * - Mirrors C `isalnum` for ASCII alphanumeric characters and preserves the
 *   explicit punctuation allow-list.
 */
export function goodUserChar(character: string): boolean {
  if (character.length !== 1) {
    return false;
  }

  return /^[A-Za-z0-9 @._-]$/.test(character);
}

/**
 * Port of upstream `lcase`.
 *
 * Role:
 * - Lowercases a message buffer until the inspected size or null terminator.
 *
 * Ledger: FUN-9FDD49
 * Upstream: common.cpp:147-151, common.cpp:153-157
 *
 * Adaptation:
 * - Replaces in-place `char *` mutation with a returned string.
 * - Also covers the upstream `string &` overload by defaulting `messageSize`
 *   to the full string length.
 */
export function lcase(message: string, messageSize = message.length): string {
  const limit = Math.min(Math.max(messageSize, 0), message.length);
  let output = "";
  let index = 0;

  for (; index < limit; index += 1) {
    const character = message[index];

    if (character === "\0") {
      return `${output}${message.slice(index)}`;
    }

    output += character.toLowerCase();
  }

  return `${output}${message.slice(index)}`;
}

/**
 * Port of upstream `point_distance_from_line`.
 *
 * Role:
 * - Computes the perpendicular distance from a point to the infinite line
 *   passing through two reference points.
 *
 * Ledger: FUN-3667DC
 * Upstream: common.cpp:186-201
 *
 * Notes:
 * - Uses the same `|A*x + B*y + C| / sqrt(A^2 + B^2)` formula as upstream.
 */
export function pointDistanceFromLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  px: number,
  py: number,
): number {
  const a = -1 * (y1 - y2);
  const b = x1 - x2;
  const c = -1 * (a * x1 + b * y1);
  const under = Math.sqrt(a * a + b * b);

  return Math.abs(a * px + b * py + c) / under;
}

/**
 * Port of upstream `points_within_area`.
 *
 * Role:
 * - Determines whether a point lies inside or on the inclusive bounds of a
 *   rectangular area.
 *
 * Ledger: FUN-F3E417
 * Upstream: common.cpp:223-231
 *
 * Notes:
 * - Preserves upstream inclusive `ax + aw` and `ay + ah` edge checks.
 */
export function pointsWithinArea(
  px: number,
  py: number,
  ax: number,
  ay: number,
  aw: number,
  ah: number,
): boolean {
  if (px < ax) return false;
  if (py < ay) return false;
  if (px > ax + aw) return false;
  if (py > ay + ah) return false;

  return true;
}

/**
 * Port of upstream `points_within_distance`.
 *
 * Role:
 * - Determines whether two coordinate points are within a circular distance
 *   threshold using the upstream quick-reject and quick-accept checks.
 *
 * Ledger: FUN-BFB321
 * Upstream: common.cpp:203-221
 *
 * Notes:
 * - Preserves the upstream integer truncation of `distance * sin(45)`.
 */
export function pointsWithinDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  distanceLimit: number,
): boolean {
  if (x2 < x1 - distanceLimit) return false;
  if (x2 > x1 + distanceLimit) return false;
  if (y2 < y1 - distanceLimit) return false;
  if (y2 > y1 + distanceLimit) return false;

  const shortDistance = Math.trunc(distanceLimit * 0.707106781);
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);

  if (dx < shortDistance && dy < shortDistance) {
    return true;
  }

  if (Math.sqrt(dx * dx + dy * dy) > distanceLimit) {
    return false;
  }

  return true;
}

/**
 * Port of upstream `print_dump`.
 *
 * Role:
 * - Formats a raw byte dump for debugging message buffers.
 *
 * Ledger: FUN-43910E
 * Upstream: common.cpp:168-176
 *
 * Adaptation:
 * - Replaces direct `printf` output with a returned string.
 */
export function printDump(message: string, size: number, name: string): string {
  const limit = Math.min(Math.max(size, 0), message.length);
  const bytes: string[] = [];

  for (let index = 0; index < limit; index += 1) {
    bytes.push((message.charCodeAt(index) & 0xff).toString(16).padStart(2, "0"));
  }

  return `raw dump:${name}:${bytes.join(" ")}${bytes.length > 0 ? " " : ""}`;
}

/**
 * Port of upstream `split`.
 *
 * Role:
 * - Extracts one delimited token from a message while returning the cursor used
 *   to continue scanning.
 *
 * Ledger: FUN-370236
 * Upstream: common.cpp:93-124
 *
 * Adaptation:
 * - Replaces destination-buffer mutation and `int *initial` mutation with a
 *   returned token and next cursor.
 */
export function split(
  message: string,
  delimiter: string,
  initial: number,
  destinationSize: number,
  messageSize = message.length,
): SplitResult {
  const limit = Math.min(Math.max(messageSize, 0), message.length);
  const start = Math.max(initial, 0);
  const tokenCharacters: string[] = [];
  let cursor = start;

  for (; cursor < limit; cursor += 1) {
    const character = message[cursor];

    if (character === "\0" || character === delimiter) {
      break;
    }

    if (tokenCharacters.length < destinationSize) {
      tokenCharacters.push(character);
    }
  }

  const value =
    tokenCharacters.length < destinationSize
      ? tokenCharacters.join("")
      : tokenCharacters.slice(0, Math.max(destinationSize - 1, 0)).join("");
  const nextInitial =
    cursor >= message.length || message[cursor] === "\0" ? cursor : cursor + 1;

  return { value, nextInitial };
}

/**
 * Port of upstream `sort_string_func`.
 *
 * Role:
 * - Provides the lexicographic string ordering predicate used by upstream list
 *   sorting helpers.
 *
 * Ledger: FUN-016B43
 * Upstream: common.cpp:391-394
 *
 * Adaptation:
 * - Replaces `strcmp(a.c_str(), b.c_str()) < 0` with equivalent byte-wise
 *   comparison of UTF-8 encoded JavaScript strings.
 */
export function sortStringFunc(a: string, b: string): boolean {
  const aBytes = utf8Encoder.encode(a);
  const bBytes = utf8Encoder.encode(b);
  const sharedLength = Math.min(aBytes.length, bBytes.length);

  for (let index = 0; index < sharedLength; index += 1) {
    const difference = aBytes[index] - bBytes[index];

    if (difference !== 0) {
      return difference < 0;
    }
  }

  return aBytes.length < bBytes.length;
}

/**
 * Port of upstream `uni_pause`.
 *
 * Role:
 * - Pauses execution for a requested number of milliseconds.
 *
 * Ledger: FUN-72F8C3
 * Upstream: common.cpp:159-166
 *
 * Adaptation:
 * - Replaces blocking `Sleep` / `usleep` calls with an asynchronous scheduler.
 */
export function uniPause(
  milliseconds: number,
  pauseFor: (milliseconds: number) => Promise<void> | void = (duration) =>
    new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, duration);
    }),
): Promise<void> {
  return Promise.resolve(pauseFor(milliseconds));
}
