/**
 * Upstream: common.cpp / common.h
 */

const utf8Encoder = new TextEncoder();

/**
 * Port of upstream `_COMMON_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: common.h:2-2
 */
export const COMMON_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `dirent`.
 * Role: Represents a directory entry returned by platform directory iteration.
 * Upstream: common.cpp:344-356
 */
export type DirectoryEntry = {
  name: string;
  type: "regular" | "directory" | "other";
};

/**
 * Port of upstream `xy_struct`.
 * Role: Stores an integer coordinate pair for common simulation helpers.
 * Upstream: common.h:13-20
 */
export class XyStruct {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Port of upstream `xy_to_i`.
 * Role: Converts an x/y coordinate into the linear index for column-major common arrays.
 * Upstream: common.h:66-66
 */
export function xyToIndex(x: number, y: number, height: number): number {
  return x * height + y;
}

/**
 * Result shape for the TypeScript adaptation of upstream `split`.
 * Role: Carries the extracted token and replacement cursor for the mutated C destination buffer and `initial` pointer.
 * Upstream: common.cpp:93-124
 */
export type SplitResult = {
  value: string;
  nextInitial: number;
};

/**
 * Port of upstream `timeval`.
 * Role: Stores wall-clock seconds and microseconds returned by `gettimeofday`.
 * Upstream: common.cpp:77-87
 */
export type Timeval = {
  tvSec: number;
  tvUsec: number;
};

/**
 * Replacement for upstream `tm`.
 * Role: Stores broken-down local time fields for timestamp formatting.
 * Upstream: common.cpp:272
 */
export type LocalTimeFields = {
  seconds: number;
  minutes: number;
  hours: number;
  monthDay: number;
  month: number;
  year: number;
  weekDay: number;
  yearDay: number;
  daylightSavingTime: number;
};

/**
 * Browser-side state for upstream `current_time`.
 * Role: Stores the first sampled wall-clock timestamp for elapsed-time calculations.
 * Upstream: common.cpp:55-91
 */
export type CurrentTimeState = {
  firstSec: number;
  firstUsec: number;
};

/**
 * Browser-side state for upstream `start_stop_perf`.
 * Role: Stores the active performance timing sample.
 * Upstream: common.cpp:24-44
 */
export type StartStopPerfState = {
  perfStarted: boolean;
  lastTime: number;
};

const defaultCurrentTimeState: CurrentTimeState = {
  firstSec: 0,
  firstUsec: 0,
};

const defaultStartStopPerfState: StartStopPerfState = {
  perfStarted: false,
  lastTime: 0,
};

/**
 * Port of upstream `frand`.
 * Role: Produces a discrete random fraction in the inclusive range from zero to one for common simulation calculations.
 * Upstream: common.h:64-64
 */
export function frand(
  randomInt: () => number = () => Math.floor(Math.random() * 10001),
): number {
  return (Math.trunc(randomInt()) % 10001) / 10000.0;
}

/**
 * Port of upstream `current_time`.
 * Role: Returns elapsed wall-clock seconds from the first sampled timestamp.
 * Upstream: common.cpp:55-91
 */
export function currentTime(
  readTime: () => Timeval = readSystemTimeval,
  state: CurrentTimeState = defaultCurrentTimeState,
): number {
  const newTime = readTime();

  if (!state.firstSec) {
    state.firstSec = newTime.tvSec;
    state.firstUsec = newTime.tvUsec;
  }

  return (
    newTime.tvSec -
    state.firstSec +
    (newTime.tvUsec - state.firstUsec) * 0.000001
  );
}

function readSystemTimeval(): Timeval {
  const milliseconds = Date.now();

  return {
    tvSec: Math.floor(milliseconds / 1000),
    tvUsec: (milliseconds % 1000) * 1000,
  };
}

/**
 * Port of upstream `start_stop_perf`.
 * Role: Toggles a performance timer and reports elapsed seconds when stopping.
 * Upstream: common.cpp:24-44
 */
export function startStopPerf(
  message: string,
  readCurrentTime: () => number = () => currentTime(),
  state: StartStopPerfState = defaultStartStopPerfState,
  log: (message: string) => void = () => undefined,
): string | null {
  if (!state.perfStarted) {
    state.lastTime = readCurrentTime();
    state.perfStarted = true;
    return null;
  }

  const timeDifference = readCurrentTime() - state.lastTime;
  const output = `performance:'${message}' time:${timeDifference}`;
  log(output);
  state.perfStarted = false;

  return output;
}

/**
 * Port of upstream `isz`.
 * Role: Tests whether a floating-point value is close enough to zero for common math comparisons.
 * Upstream: common.h:49-50
 */
export function isZero(num: number): boolean {
  return num < 0.00001 && num > -0.00001;
}

/**
 * Port of upstream `is1`.
 * Role: Tests whether a floating-point value is close enough to one for common math comparisons.
 * Upstream: common.h:52-52
 */
export function isOne(num: number): boolean {
  return num < 1.00001 && num > 0.99999;
}

/**
 * Port of upstream `swap`.
 * Role: Exchanges two integer values for common utility code.
 * Upstream: common.h:55-62
 */
export function swap(a: number, b: number): [number, number] {
  return [b, a];
}

/**
 * Port of upstream `clean_newline`.
 * Role: Truncates a line buffer at the first newline, carriage return, or null terminator observed within the inspected size.
 * Upstream: common.cpp:126-145
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
 * Role: Requests creation of a folder path through the platform filesystem.
 * Upstream: common.cpp:46-53
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
 * Port of upstream `directory_filelist`.
 * Role: Returns regular file names found in a directory.
 * Upstream: common.cpp:318-365
 */
export function directoryFileList(
  folderName: string,
  readDirectory: (folderName: string) => readonly DirectoryEntry[] = () => {
    throw new Error("No directory listing adapter available.");
  },
): string[] {
  const normalizedFolderName = folderName.length === 0 ? "." : folderName;

  try {
    return readDirectory(normalizedFolderName)
      .filter((entry) => entry.type === "regular")
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

/**
 * Port of upstream `parse_filelist`.
 * Role: Keeps only filenames ending with a requested extension.
 * Upstream: common.cpp:367-389
 */
export function parseFileList(
  fileList: readonly string[],
  extension: string,
): string[] {
  const normalizedExtension = lcase(extension);

  return fileList.filter((filename) => {
    const normalizedFilename = lcase(filename);
    const position = normalizedFilename.lastIndexOf(normalizedExtension);
    const suffixPosition =
      normalizedFilename.length - normalizedExtension.length;

    return position !== -1 && position === suffixPosition;
  });
}

/**
 * Port of upstream `printd_reg`.
 * Role: Formats and appends one registration log line.
 * Upstream: common.cpp:269-287
 */
export function printdReg(
  message: string,
  readTimestamp: () => string = () => new Date().toString(),
  appendLine: (filename: string, line: string) => void = () => {
    throw new Error("No registration log adapter available.");
  },
): boolean {
  const timeBuffer = cleanNewline(readTimestamp(), 100);
  const line = `${timeBuffer.padEnd(12, " ")} :: ${message}\n`;

  try {
    appendLine("reg_log.txt", line);
    return true;
  } catch {
    return false;
  }
}

/**
 * Port of upstream `data_to_hex_string`.
 * Role: Converts a byte buffer into a continuous lowercase hexadecimal string.
 * Upstream: common.cpp:289-303
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
 * Role: Computes Euclidean distance between two integer coordinate points.
 * Upstream: common.cpp:178-184
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Port of upstream `file_can_be_written`.
 * Role: Reports whether a target path can be opened for append-style writing.
 * Upstream: common.cpp:305-316
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
 * Role: Checks whether a character is allowed in upstream user-facing text fields.
 * Upstream: common.cpp:233-243
 */
export function goodUserChar(character: string): boolean {
  if (character.length !== 1) {
    return false;
  }

  return /^[A-Za-z0-9 @._-]$/.test(character);
}

/**
 * Port of upstream `good_user_string`.
 * Role: Checks whether a user-facing text value is non-empty and well spaced.
 * Upstream: common.cpp:245-267
 */
export function goodUserString(message: string): boolean {
  if (message.length === 0) {
    return false;
  }

  for (const character of message) {
    if (!goodUserChar(character)) {
      return false;
    }
  }

  if (message.includes("  ")) {
    return false;
  }

  return message[0] !== " " && message[message.length - 1] !== " ";
}

/**
 * Port of upstream `lcase`.
 * Role: Lowercases a message buffer until the inspected size or null terminator.
 * Upstream: common.cpp:147-151, common.cpp:153-157
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
 * Role: Computes the perpendicular distance from a point to the infinite line passing through two reference points.
 * Upstream: common.cpp:186-201
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
 * Role: Determines whether a point lies inside or on the inclusive bounds of a rectangular area.
 * Upstream: common.cpp:223-231
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
 * Role: Determines whether two coordinate points are within a circular distance threshold using the upstream quick-reject and quick-accept checks.
 * Upstream: common.cpp:203-221
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
 * Role: Formats a raw byte dump for debugging message buffers.
 * Upstream: common.cpp:168-176
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
 * Role: Extracts one delimited token from a message while returning the cursor used to continue scanning.
 * Upstream: common.cpp:93-124
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
 * Role: Provides the lexicographic string ordering predicate for upstream list sorting helpers.
 * Upstream: common.cpp:391-394
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
 * Role: Pauses execution for a requested number of milliseconds.
 * Upstream: common.cpp:159-166
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
