import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  findLedgerRow,
  type LedgerRow,
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
