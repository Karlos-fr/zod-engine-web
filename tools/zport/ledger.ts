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
    `${preamble}${renderMarkdownTable(sorted.map(toTableRow))}\n`,
    "utf8",
  );
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
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) {
    throw new Error(`Unknown ledger id: ${id}`);
  }
  rows[index] = { ...rows[index], ...patch };
  writeLedger(rows, filePath);
  return rows[index];
}

export function findLedgerRow(id: string, filePath = ledgerPath): LedgerRow {
  const row = readLedger(filePath).find((entry) => entry.id === id);
  if (!row) {
    throw new Error(`Unknown ledger id: ${id}`);
  }
  return row;
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
