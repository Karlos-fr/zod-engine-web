import type { LedgerRow } from "./ledger.ts";
import { isDependencyClear } from "./dependencies.ts";

const domainOrder = [
  "data",
  "world",
  "simulation",
  "rendering",
  "input",
  "assets",
  "audio",
  "ui",
  "network",
  "tooling",
];

const batchOrder = [
  "map-format",
  "map-core",
  "entity-core",
  "navigation-basic",
  "movement-basic",
  "rendering-basic",
  "selection-orders",
  "robot-basic",
  "vehicle-basic",
];

export function selectNext(rows: LedgerRow[]): LedgerRow | undefined {
  return rows
    .filter((row) => ["todo", "qualified"].includes(row.status))
    .filter((row) => !["IGNORE", "DEFER"].includes(row.decision))
    .filter(isDependencyClear)
    .sort(compareRows)[0];
}

function compareRows(a: LedgerRow, b: LedgerRow): number {
  return (
    scoreMapFormat(a) - scoreMapFormat(b) ||
    scoreBatch(a.batch) - scoreBatch(b.batch) ||
    scoreDomain(a.targetDomain) - scoreDomain(b.targetDomain) ||
    a.file.localeCompare(b.file) ||
    a.id.localeCompare(b.id)
  );
}

function scoreMapFormat(row: LedgerRow): number {
  const text = `${row.file} ${row.symbol}`.toLowerCase();
  if (text.includes("zmap.h `map_basics`")) return 0;
  if (text.includes("zmap.h `zmap`")) return 1;
  if (text.includes("zmap.cpp `zmap::read`")) return 2;
  if (text.includes("zmap.cpp `zmap::write`")) return 3;
  if (text.includes("zmap.cpp") || text.includes("zmap.h")) return 10;
  return 50;
}

function scoreDomain(domain: string): number {
  const index = domainOrder.indexOf(domain);
  return index === -1 ? 999 : index;
}

function scoreBatch(batch: string): number {
  const index = batchOrder.indexOf(batch);
  return index === -1 ? 999 : index;
}
