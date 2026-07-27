import fs from "node:fs";
import path from "node:path";
import { ledgerPath } from "./config.ts";
import {
  ledgerColumns,
  parseMarkdownTable,
  renderMarkdownTable,
  type TableRow,
} from "./markdown-table.ts";

export type LedgerRow = {
  id: string;
  type: string;
  symbol: string;
  file: string;
  lines: string;
  decision: string;
  targetDomain: string;
  status: string;
  batch: string;
  targetTs: string;
  notes: string;
  dependsOn: string;
  blockedBy: string;
};

const preamble = `# Référentiel de portage

Ce fichier est généré et maintenu par \`zport\`. Chaque ligne représente un
symbole upstream ou une décision explicite de portage.

`;

export function readLedger(filePath = ledgerPath): LedgerRow[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return parseMarkdownTable(fs.readFileSync(filePath, "utf8")).map(fromTableRow);
}

export function writeLedger(rows: LedgerRow[], filePath = ledgerPath): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const sorted = [...rows].sort((a, b) => a.id.localeCompare(b.id));
  fs.writeFileSync(
    filePath,
    `${preamble}${renderPortingStatistics(sorted)}\n\n${renderMarkdownTable(sorted.map(toTableRow))}\n`,
    "utf8",
  );
}

export function renderPortingStatistics(rows: LedgerRow[]): string {
  const total = rows.length;
  const statusCounts = countByStatus(rows);
  const completed = (statusCounts.get("ported") ?? 0) + (statusCounts.get("verified") ?? 0);
  const statuses = [...statusCounts.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );

  const lines = [
    "## Statistiques",
    "",
    `Avancement du portage : ${completed}/${total} (${formatPercentage(completed, total)}).`,
    "",
    "| Statut | Nombre | Pourcentage |",
    "|---|---:|---:|",
  ];

  for (const [status, count] of statuses) {
    lines.push(`| ${status} | ${count} | ${formatPercentage(count, total)} |`);
  }

  lines.push(`| total | ${total} | ${formatPercentage(total, total)} |`);

  return lines.join("\n");
}

export function mergeRows(existing: LedgerRow[], scanned: LedgerRow[]): LedgerRow[] {
  const existingByKey = new Map(existing.map((row) => [stableKey(row), row]));

  return scanned.map((row) => {
    const previous = existingByKey.get(stableKey(row));
    if (!previous) {
      return row;
    }

    return {
      ...row,
      id: previous.id || row.id,
      decision: previous.decision || row.decision,
      targetDomain: previous.targetDomain || row.targetDomain,
      status: previous.status || row.status,
      batch: previous.batch || row.batch,
      targetTs: previous.targetTs || row.targetTs,
      notes: previous.notes || row.notes,
      dependsOn: row.dependsOn || previous.dependsOn,
      blockedBy: row.blockedBy || previous.blockedBy,
    };
  });
}

export function updateLedgerRow(
  id: string,
  patch: Partial<LedgerRow>,
  filePath = ledgerPath,
): LedgerRow {
  const rows = readLedger(filePath);
  const index = findPreferredRowIndex(rows, id);
  if (index === -1) {
    throw new Error(`Unknown ledger id: ${id}`);
  }
  rows[index] = { ...rows[index], ...patch };
  writeLedger(rows, filePath);
  return rows[index];
}

export function findLedgerRow(id: string, filePath = ledgerPath): LedgerRow {
  const rows = readLedger(filePath);
  const index = findPreferredRowIndex(rows, id);
  const row = index === -1 ? undefined : rows[index];
  if (!row) {
    throw new Error(`Unknown ledger id: ${id}`);
  }
  return row;
}

function findPreferredRowIndex(rows: LedgerRow[], id: string): number {
  const actionableIndex = rows.findIndex(
    (row) => row.id === id && (row.status === "todo" || row.status === "in_progress"),
  );
  if (actionableIndex !== -1) {
    return actionableIndex;
  }
  return rows.findIndex((row) => row.id === id);
}

export function toTableRow(row: LedgerRow): TableRow {
  return {
    [ledgerColumns[0]]: row.id,
    [ledgerColumns[1]]: row.type,
    [ledgerColumns[2]]: row.symbol,
    [ledgerColumns[3]]: row.file,
    [ledgerColumns[4]]: row.lines,
    [ledgerColumns[5]]: row.decision,
    [ledgerColumns[6]]: row.targetDomain,
    [ledgerColumns[7]]: row.status,
    [ledgerColumns[8]]: row.batch,
    [ledgerColumns[9]]: row.targetTs,
    [ledgerColumns[10]]: row.notes,
    [ledgerColumns[11]]: row.dependsOn,
    [ledgerColumns[12]]: row.blockedBy,
  };
}

function fromTableRow(row: TableRow): LedgerRow {
  return {
    id: row.ID,
    type: row.Type,
    symbol: row.Symbole,
    file: row.Fichier,
    lines: row.Lignes,
    decision: row["Décision"],
    targetDomain: row["Domaine cible"],
    status: row.Statut,
    batch: row.Lot,
    targetTs: row["Cible TS"],
    notes: row.Notes,
    dependsOn: row["Depends On"] ?? "",
    blockedBy: row["Blocked By"] ?? "",
  };
}

function stableKey(row: LedgerRow): string {
  return `${row.type}:${row.file}:${row.symbol}`;
}

function countByStatus(rows: LedgerRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const status = row.status || "(empty)";
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }
  return counts;
}

function formatPercentage(value: number, total: number): string {
  if (total === 0) {
    return "0.00%";
  }
  return `${((value / total) * 100).toFixed(2)}%`;
}
