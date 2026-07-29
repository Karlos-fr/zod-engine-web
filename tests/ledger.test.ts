import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  areEquivalentLedgerOccurrences,
  findLedgerRow,
  type LedgerRow,
  mergeRows,
  updateEquivalentLedgerRows,
  updateEquivalentLedgerRowsByLines,
  updateLedgerRow,
  writeLedger,
} from "../tools/zport/ledger.ts";

describe("ledger duplicate IDs", () => {
  it("targets the actionable occurrence", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zport-ledger-"));
    const file = path.join(directory, "ledger.md");
    writeLedger(
      [
        row({ lines: "10-10", status: "ported" }),
        row({ lines: "20-20", status: "todo" }),
      ],
      file,
    );

    expect(findLedgerRow("CON-SAME", file).lines).toBe("20-20");
    updateLedgerRow("CON-SAME", { status: "ported" }, file);
    expect(
      fs
        .readFileSync(file, "utf8")
        .split("\n")
        .filter((line) => line.includes("| CON-SAME |") && line.includes("| ported |")),
    ).toHaveLength(2);
  });

  it("updates equivalent duplicate occurrences together", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zport-ledger-"));
    const file = path.join(directory, "ledger.md");
    writeLedger(
      [
        row({ lines: "10-10" }),
        row({ lines: "10-10" }),
      ],
      file,
    );

    const updatedRows = updateEquivalentLedgerRows(
      "CON-SAME",
      { status: "ported", targetTs: "src/constants.ts" },
      file,
    );

    expect(updatedRows).toHaveLength(2);
    expect(
      fs
        .readFileSync(file, "utf8")
        .split("\n")
        .filter(
          (line) =>
            line.includes("| CON-SAME |") &&
            line.includes("| ported |") &&
            line.includes("| src/constants.ts |"),
        ),
    ).toHaveLength(2);
  });

  it("rejects ambiguous duplicate occurrences", () => {
    const duplicateRows = [
      row({ symbol: "`same`" }),
      row({ symbol: "`other`" }),
    ];

    expect(areEquivalentLedgerOccurrences(duplicateRows)).toBe(false);

    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zport-ledger-"));
    const file = path.join(directory, "ledger.md");
    writeLedger(duplicateRows, file);

    expect(() =>
      updateEquivalentLedgerRows("CON-SAME", { status: "ported" }, file),
    ).toThrow("Ambiguous duplicate ledger id");
  });

  it("rejects same-symbol duplicate IDs on different upstream ranges", () => {
    expect(
      areEquivalentLedgerOccurrences([
        row({ lines: "217-289" }),
        row({ lines: "291-689" }),
      ]),
    ).toBe(false);
  });

  it("updates duplicate occurrences by upstream range", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zport-ledger-"));
    const file = path.join(directory, "ledger.md");
    writeLedger(
      [
        row({ lines: "217-289" }),
        row({ lines: "291-689" }),
      ],
      file,
    );

    const updatedRows = updateEquivalentLedgerRowsByLines(
      "CON-SAME",
      "217-289",
      { status: "ported", targetTs: "src/forward.ts" },
      file,
    );

    expect(updatedRows).toHaveLength(1);
    const content = fs.readFileSync(file, "utf8");
    expect(content).toContain(
      "| CON-SAME | constant | `same` | file.cpp | 217-289 | PORTER | simulation | ported |  | src/forward.ts |",
    );
    expect(content).toContain(
      "| CON-SAME | constant | `same` | file.cpp | 291-689 | PORTER | simulation | todo |",
    );
  });

  it("writes computed porting statistics before the ledger table", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zport-ledger-"));
    const file = path.join(directory, "ledger.md");
    writeLedger(
      [
        row({ id: "CON-A", status: "ported" }),
        row({ id: "CON-B", status: "verified" }),
        row({ id: "CON-C", status: "todo" }),
        row({ id: "CON-D", status: "blocked" }),
      ],
      file,
    );

    const content = fs.readFileSync(file, "utf8");
    expect(content.indexOf("## Statistiques")).toBeLessThan(
      content.indexOf("| ID | Type | Symbole |"),
    );
    expect(content).toContain("Avancement du portage : 2/4 (50.00%).");
    expect(content).toContain("| blocked | 1 | 25.00% |");
    expect(content).toContain("| ported | 1 | 25.00% |");
    expect(content).toContain("| todo | 1 | 25.00% |");
    expect(content).toContain("| verified | 1 | 25.00% |");
    expect(content).toContain("| total | 4 | 100.00% |");
  });

  it("keeps same-symbol upstream ranges distinct when merging scanned rows", () => {
    const existing = [
      row({ id: "MET-OLD-A", lines: "10-20", status: "ported" }),
      row({ id: "MET-OLD-B", lines: "22-30", status: "todo" }),
    ];
    const scanned = [
      row({ id: "MET-NEW-A", lines: "10-20" }),
      row({ id: "MET-NEW-B", lines: "22-30" }),
    ];

    expect(mergeRows(existing, scanned).map((mergedRow) => mergedRow.id)).toEqual([
      "MET-OLD-A",
      "MET-OLD-B",
    ]);
  });

});

function row(overrides: Partial<LedgerRow>): LedgerRow {
  return {
    id: "CON-SAME",
    type: "constant",
    symbol: "`same`",
    file: "file.cpp",
    lines: "1-1",
    decision: "PORTER",
    targetDomain: "simulation",
    status: "todo",
    batch: "",
    targetTs: "",
    notes: "",
    dependsOn: "",
    blockedBy: "",
    ...overrides,
  };
}
