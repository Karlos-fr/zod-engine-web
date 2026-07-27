import { describe, expect, it } from "vitest";
import {
  cleanNewline,
  COMMON_HEADER_GUARD_PORTED,
  createFolder,
  dataToHexString,
  type DirectoryEntry,
  distance,
  fileCanBeWritten,
  frand,
  goodUserChar,
  isOne,
  isZero,
  lcase,
  pointDistanceFromLine,
  pointsWithinArea,
  pointsWithinDistance,
  printDump,
  split,
  sortStringFunc,
  swap,
  type Timeval,
  uniPause,
  XyStruct,
  xyToIndex,
} from "../src/simulation/Common";

describe("common", () => {
  it("adapts the common.h include guard to an ES module marker", () => {
    expect(COMMON_HEADER_GUARD_PORTED).toBe(true);
  });

  it("ports clean_newline by truncating at carriage returns or line feeds", () => {
    expect(cleanNewline("ready\r\n")).toBe("ready");
    expect(cleanNewline("ready\nnext")).toBe("ready");
  });

  it("preserves clean_newline size and null terminator behavior", () => {
    expect(cleanNewline("ready\nnext", 5)).toBe("ready\nnext");
    expect(cleanNewline("ready\0ignored")).toBe("ready");
  });

  it("ports create_folder through a directory creation adapter", () => {
    const created: string[] = [];

    expect(
      createFolder("saves", (folderName) => {
        created.push(folderName);
      }),
    ).toBe(true);
    expect(created).toEqual(["saves"]);
  });

  it("reports create_folder failures when directory creation fails", () => {
    expect(
      createFolder("locked", () => {
        throw new Error("locked");
      }),
    ).toBe(false);
    expect(createFolder("browser-only")).toBe(false);
  });

  it("ports data_to_hex_string as continuous lowercase hex", () => {
    expect(dataToHexString([0, 1, 10, 255])).toBe("00010aff");
  });

  it("preserves data_to_hex_string size and byte-width behavior", () => {
    expect(dataToHexString([0x12, 0x34, 0x56], 2)).toBe("1234");
    expect(dataToHexString([0x123])).toBe("23");
  });

  it("ports distance as Euclidean point distance", () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
    expect(distance(7, -2, 7, -2)).toBe(0);
    expect(distance(-2, -3, 1, 1)).toBe(5);
  });

  it("ports dirent as directory entry data", () => {
    const entry: DirectoryEntry = { name: "map.zod", type: "regular" };

    expect(entry).toEqual({ name: "map.zod", type: "regular" });
  });

  it("ports xy_struct constructors for coordinate data", () => {
    expect(new XyStruct()).toEqual({ x: 0, y: 0 });
    expect(new XyStruct(12, -4)).toEqual({ x: 12, y: -4 });
  });

  it("ports xy_to_i as column-major coordinate indexing", () => {
    expect(xyToIndex(0, 0, 8)).toBe(0);
    expect(xyToIndex(3, 4, 8)).toBe(28);
    expect(xyToIndex(5, 2, 10)).toBe(52);
  });

  it("ports swap by returning the exchanged integer pair", () => {
    expect(swap(3, 7)).toEqual([7, 3]);
    expect(swap(-2, 5)).toEqual([5, -2]);
  });

  it("ports file_can_be_written through an append-open probe", () => {
    const opened: string[] = [];

    expect(
      fileCanBeWritten("save.dat", (filename) => {
        opened.push(filename);
      }),
    ).toBe(true);
    expect(opened).toEqual(["save.dat"]);
  });

  it("reports file_can_be_written failures when append open fails", () => {
    expect(
      fileCanBeWritten("locked.dat", () => {
        throw new Error("locked");
      }),
    ).toBe(false);
    expect(fileCanBeWritten("browser-only.dat")).toBe(false);
  });

  it("ports frand as rand modulo 10001 over 10000", () => {
    expect(frand(() => 0)).toBe(0);
    expect(frand(() => 1234)).toBe(0.1234);
    expect(frand(() => 10000)).toBe(1);
    expect(frand(() => 10001)).toBe(0);
  });

  it("ports good_user_char allowed ASCII characters", () => {
    for (const character of ["A", "z", "0", "9", " ", "@", ".", "_", "-"]) {
      expect(goodUserChar(character)).toBe(true);
    }
  });

  it("rejects good_user_char disallowed or multi-character input", () => {
    for (const character of ["!", "\n", "/", "é", "ab", ""]) {
      expect(goodUserChar(character)).toBe(false);
    }
  });

  it("ports is1 with strict upstream tolerance around one", () => {
    expect(isOne(1)).toBe(true);
    expect(isOne(0.999991)).toBe(true);
    expect(isOne(1.000009)).toBe(true);
    expect(isOne(0.99999)).toBe(false);
    expect(isOne(1.00001)).toBe(false);
  });

  it("ports isz with strict upstream tolerance around zero", () => {
    expect(isZero(0)).toBe(true);
    expect(isZero(0.000009)).toBe(true);
    expect(isZero(-0.000009)).toBe(true);
    expect(isZero(0.00001)).toBe(false);
    expect(isZero(-0.00001)).toBe(false);
  });

  it("ports lcase by lowercasing within the inspected size", () => {
    expect(lcase("Alpha BETA")).toBe("alpha beta");
    expect(lcase("Alpha BETA", 5)).toBe("alpha BETA");
  });

  it("preserves lcase null terminator stop behavior", () => {
    expect(lcase("ABC\0DEF")).toBe("abc\0DEF");
  });

  it("ports point_distance_from_line for horizontal and diagonal lines", () => {
    expect(pointDistanceFromLine(0, 0, 10, 0, 5, 3)).toBe(3);
    expect(pointDistanceFromLine(0, 0, 10, 10, 10, 0)).toBeCloseTo(
      Math.sqrt(50),
    );
  });

  it("preserves point_distance_from_line degenerate-line math behavior", () => {
    expect(Number.isNaN(pointDistanceFromLine(1, 1, 1, 1, 1, 1))).toBe(true);
  });

  it("ports points_within_area with inclusive rectangle bounds", () => {
    expect(pointsWithinArea(10, 20, 10, 20, 5, 6)).toBe(true);
    expect(pointsWithinArea(15, 26, 10, 20, 5, 6)).toBe(true);
    expect(pointsWithinArea(12, 23, 10, 20, 5, 6)).toBe(true);
  });

  it("rejects points outside points_within_area bounds", () => {
    expect(pointsWithinArea(9, 20, 10, 20, 5, 6)).toBe(false);
    expect(pointsWithinArea(10, 19, 10, 20, 5, 6)).toBe(false);
    expect(pointsWithinArea(16, 20, 10, 20, 5, 6)).toBe(false);
    expect(pointsWithinArea(10, 27, 10, 20, 5, 6)).toBe(false);
  });

  it("ports points_within_distance quick reject and exact distance checks", () => {
    expect(pointsWithinDistance(0, 0, 11, 0, 10)).toBe(false);
    expect(pointsWithinDistance(0, 0, 6, 8, 10)).toBe(true);
    expect(pointsWithinDistance(0, 0, 8, 8, 10)).toBe(false);
  });

  it("preserves points_within_distance truncated quick-accept threshold", () => {
    expect(pointsWithinDistance(0, 0, 6, 6, 10)).toBe(true);
    expect(pointsWithinDistance(0, 0, 7, 0, 10)).toBe(true);
  });

  it("ports print_dump as a raw hex dump formatter", () => {
    expect(printDump("Az\n", 3, "packet")).toBe("raw dump:packet:41 7a 0a ");
  });

  it("preserves print_dump size bounds", () => {
    expect(printDump("ABC", 2, "short")).toBe("raw dump:short:41 42 ");
    expect(printDump("ABC", 0, "empty")).toBe("raw dump:empty:");
  });

  it("ports split by extracting a token and advancing past the delimiter", () => {
    expect(split("red,blue", ",", 0, 16)).toEqual({
      value: "red",
      nextInitial: 4,
    });
  });

  it("ports timeval as seconds and microseconds data", () => {
    const now: Timeval = { tvSec: 12, tvUsec: 345 };

    expect(now).toEqual({ tvSec: 12, tvUsec: 345 });
  });

  it("preserves split destination cap and null terminator behavior", () => {
    expect(split("abcdef,rest", ",", 0, 4)).toEqual({
      value: "abc",
      nextInitial: 7,
    });
    expect(split("abc\0rest", ",", 0, 16)).toEqual({
      value: "abc",
      nextInitial: 3,
    });
  });

  it("preserves split message-size bounds", () => {
    expect(split("alpha,beta", ",", 0, 16, 5)).toEqual({
      value: "alpha",
      nextInitial: 6,
    });
  });

  it("ports sort_string_func as a strict lexicographic predicate", () => {
    expect(sortStringFunc("alpha", "bravo")).toBe(true);
    expect(sortStringFunc("bravo", "alpha")).toBe(false);
    expect(sortStringFunc("alpha", "alpha")).toBe(false);
  });

  it("preserves strcmp prefix and ASCII case ordering", () => {
    expect(sortStringFunc("map", "map2")).toBe(true);
    expect(sortStringFunc("map2", "map")).toBe(false);
    expect(sortStringFunc("Alpha", "alpha")).toBe(true);
  });

  it("ports uni_pause as an asynchronous millisecond pause", async () => {
    const durations: number[] = [];

    await uniPause(25, (milliseconds) => {
      durations.push(milliseconds);
    });

    expect(durations).toEqual([25]);
  });
});
