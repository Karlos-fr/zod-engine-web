import { describe, expect, it } from "vitest";
import { selectConstantBatch, selectNext } from "../tools/zport/task-selector.ts";
import type { LedgerRow } from "../tools/zport/ledger.ts";

describe("task selector", () => {
  it("skips symbols blocked by unported dependencies", () => {
    const rows: LedgerRow[] = [
      row({
        id: "MET-BLOCKED",
        symbol: "`ZMap::Write`",
        file: "zmap.cpp",
        blockedBy: "STR-MAP-ZONE",
      }),
      row({
        id: "STR-MAP-ZONE",
        type: "struct",
        symbol: "`map_zone`",
        file: "zmap.h",
      }),
    ];

    expect(selectNext(rows)?.id).toBe("STR-MAP-ZONE");
  });

  it("selects a bounded homogeneous batch of unblocked constants", () => {
    const rows: LedgerRow[] = [
      row({
        id: "MAC-A",
        type: "macro",
        symbol: "`A`",
        file: "constants.h",
        lines: "1-1",
        decision: "ADAPT",
        targetDomain: "simulation",
      }),
      row({
        id: "MAC-B",
        type: "macro",
        symbol: "`B`",
        file: "constants.h",
        lines: "2-2",
        decision: "ADAPT",
        targetDomain: "simulation",
      }),
      row({
        id: "MAC-BLOCKED",
        type: "macro",
        symbol: "`BLOCKED`",
        file: "constants.h",
        lines: "3-3",
        decision: "ADAPT",
        targetDomain: "simulation",
        blockedBy: "MAC-DEP",
      }),
      row({
        id: "MAC-FUNCTION",
        type: "macro",
        symbol: "`FUNCTION_MACRO(x)`",
        file: "constants.h",
        lines: "4-4",
        decision: "ADAPT",
        targetDomain: "simulation",
      }),
      row({
        id: "FUN-C",
        type: "function",
        symbol: "`c`",
        file: "constants.h",
        lines: "5-5",
        decision: "PORTER",
        targetDomain: "simulation",
      }),
      row({
        id: "MAC-OTHER-FILE",
        type: "macro",
        symbol: "`OTHER`",
        file: "other.h",
        lines: "1-1",
        decision: "ADAPT",
        targetDomain: "simulation",
      }),
    ];

    expect(selectConstantBatch(rows, { limit: 10 }).map((entry) => entry.id)).toEqual([
      "MAC-A",
      "MAC-B",
    ]);
    expect(selectConstantBatch(rows, { limit: 1 }).map((entry) => entry.id)).toEqual([
      "MAC-A",
    ]);
  });

  it("filters constant batches by upstream file and target domain", () => {
    const rows: LedgerRow[] = [
      row({
        id: "MAC-SIM",
        type: "macro",
        symbol: "`SIM`",
        file: "simulation.h",
        decision: "ADAPT",
        targetDomain: "simulation",
      }),
      row({
        id: "MAC-UI",
        type: "macro",
        symbol: "`UI`",
        file: "ui.h",
        decision: "ADAPT",
        targetDomain: "ui",
      }),
      row({
        id: "MAC-SIM-OTHER",
        type: "macro",
        symbol: "`SIM_OTHER`",
        file: "other.h",
        decision: "ADAPT",
        targetDomain: "simulation",
      }),
    ];

    expect(
      selectConstantBatch(rows, {
        file: "ui.h",
        domain: "ui",
        limit: 10,
      }).map((entry) => entry.id),
    ).toEqual(["MAC-UI"]);
  });

  it("deduplicates repeated ledger ids in constant batches", () => {
    const rows: LedgerRow[] = [
      row({
        id: "CON-DUP",
        type: "constant",
        symbol: "`value`",
        file: "effects.cpp",
        lines: "1-1",
        targetDomain: "simulation",
      }),
      row({
        id: "CON-DUP",
        type: "constant",
        symbol: "`value`",
        file: "effects.cpp",
        lines: "2-2",
        targetDomain: "simulation",
      }),
    ];

    expect(selectConstantBatch(rows, { limit: 10 }).map((entry) => entry.id)).toEqual([
      "CON-DUP",
    ]);
  });

  it("skips macro functions when source lines are available", () => {
    const rows: LedgerRow[] = [
      row({
        id: "MAC-FUNCTION-SOURCE",
        type: "macro",
        symbol: "`xtime`",
        file: "zencrypt_aes.cpp",
        lines: "10-10",
        targetDomain: "simulation",
      }),
      row({
        id: "MAC-SCALAR",
        type: "macro",
        symbol: "`Nb`",
        file: "zencrypt_aes.cpp",
        lines: "7-7",
        targetDomain: "simulation",
      }),
    ];

    expect(
      selectConstantBatch(rows, {
        limit: 10,
        getSourceLine: (entry) =>
          entry.id === "MAC-FUNCTION-SOURCE" ? "#define xtime(x) ((x<<1))" : "#define Nb 4",
      }).map((entry) => entry.id),
    ).toEqual(["MAC-SCALAR"]);
  });
});

function row(overrides: Partial<LedgerRow>): LedgerRow {
  return {
    id: "ID",
    type: "method",
    symbol: "`Symbol`",
    file: "file.cpp",
    lines: "1-1",
    decision: "PORTER",
    targetDomain: "world",
    status: "todo",
    batch: "map-core",
    targetTs: "",
    notes: "",
    dependsOn: "",
    blockedBy: "",
    ...overrides,
  };
}
