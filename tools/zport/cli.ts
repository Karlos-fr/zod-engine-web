#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { auditPortingComments } from "./comment-audit.ts";
import { inspectFile } from "./large-file-policy.ts";
import {
  areEquivalentLedgerOccurrences,
  findLedgerRow,
  findLedgerRows,
  readLedger,
  updateEquivalentLedgerRows,
  updateEquivalentLedgerRowsByLines,
  updateLedgerRow,
  type LedgerRow,
} from "./ledger.ts";
import { buildContext } from "./context-builder.ts";
import { scanUpstream } from "./scan-upstream.ts";
import {
  isBatchableConstant,
  selectConstantBatch,
  selectNext,
  selectRecoveryCandidates,
} from "./task-selector.ts";
import { upstreamSourceRoot } from "./config.ts";
import { extractRange } from "./symbol-extractor.ts";
import { resolveDependencies } from "./dependencies.ts";
import { findExistingSourceMatches } from "./source-search.ts";

const [, , command, ...args] = process.argv;

try {
  run(command, args);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function run(commandName = "help", argsList: string[]): void {
  switch (commandName) {
    case "scan":
      return scan();
    case "list":
      return list(argsList);
    case "status":
      return status();
    case "show":
      return show(requiredArg(argsList, 0, "id"));
    case "brief":
      return brief(requiredArg(argsList, 0, "id"));
    case "context":
      return console.log(buildContext(requiredArg(argsList, 0, "id")));
    case "deps":
      return deps(requiredArg(argsList, 0, "id"));
    case "batch":
      return batch(argsList);
    case "inspect-file":
      return inspect(argsList);
    case "next":
      return next();
    case "candidates":
    case "cycle-candidates":
      return candidates(argsList);
    case "start":
      return mark(requiredArg(argsList, 0, "id"), { status: "in_progress" });
    case "done":
      return done(argsList);
    case "done-batch":
      return doneBatch(argsList);
    case "audit-comments":
      return auditComments();
    case "block":
      return requireNoteAndMark(argsList, "blocked");
    case "ignore":
      return requireNoteAndMark(argsList, "ignored", { decision: "IGNORE" });
    case "help":
    default:
      return help();
  }
}

function scan(): void {
  const result = scanUpstream();
  console.log(`files=${result.files}`);
  console.log(`symbols=${result.symbols}`);
  console.log(`large_files=${result.largeFiles}`);
}

function list(argsList: string[]): void {
  const filters = parseOptions(argsList);
  const rows = readLedger().filter((row) => matches(row, filters));
  for (const row of rows.slice(0, Number(filters.limit || 50))) {
    console.log(
      `${row.id} ${row.status} ${row.decision} ${row.targetDomain} ${row.file} ${row.symbol}`,
    );
  }
  if (rows.length > Number(filters.limit || 50)) {
    console.log(`... ${rows.length - Number(filters.limit || 50)} more`);
  }
}

function status(): void {
  const rows = readLedger();
  const byStatus = countBy(rows, (row) => row.status);
  const byDecision = countBy(rows, (row) => row.decision);
  console.log(`total=${rows.length}`);
  console.log("status:");
  printCounts(byStatus);
  console.log("decision:");
  printCounts(byDecision);
}

function show(id: string): void {
  const row = findLedgerRow(id);
  printDuplicateIdNotice(id);
  const fullPath = path.join(upstreamSourceRoot, row.file);
  const content = fs.readFileSync(fullPath, "utf8");
  console.log(`${row.id} ${row.symbol}`);
  console.log(`${row.file}:${row.lines}`);
  console.log(`decision=${row.decision} status=${row.status} domain=${row.targetDomain}`);
  console.log("");
  console.log(extractRange(content, row.lines));
}

function brief(id: string): void {
  const rows = readLedger();
  const row = findLedgerRow(id);
  printDuplicateIdNotice(id, rows);
  const resolution = resolveDependencies(row, rows);
  const fullPath = path.join(upstreamSourceRoot, row.file);
  const content = fs.readFileSync(fullPath, "utf8");
  const existingMatches = findExistingSourceMatches(row, 6);

  console.log(`${row.id} ${row.decision} ${row.targetDomain} ${row.file}:${row.lines} ${row.symbol}`);
  console.log(`status=${row.status} type=${row.type} target=${row.targetTs || "none"}`);
  console.log(
    `blocked_by=${resolution.blockedBy.length ? resolution.blockedBy.join(",") : "none"}`,
  );
  console.log(
    `depends_on=${resolution.dependsOn.length ? resolution.dependsOn.join(",") : "none"}`,
  );
  console.log("");
  console.log("excerpt:");
  console.log(extractRange(content, row.lines));
  console.log("");
  console.log("existing_source_matches:");
  if (!existingMatches.length) {
    console.log("  none");
  } else {
    existingMatches.forEach((match) =>
      console.log(`  ${match.file}:${match.line}: ${match.text}`),
    );
  }
  console.log("");
  console.log("checklist:");
  console.log("  deps checked");
  console.log("  port only this symbol");
  console.log("  add focused tests");
  console.log("  mark done with target");
}

function inspect(argsList: string[]): void {
  const input = requiredArg(argsList, 0, "file");
  const fullPath = path.isAbsolute(input) ? input : path.join(upstreamSourceRoot, input);
  const result = inspectFile(fullPath);
  const rows = readLedger().filter((row) => row.file === input);
  console.log(input);
  console.log(`size: ${Math.round(result.bytes / 1024)} KiB`);
  console.log(`lines: ${result.lines}`);
  console.log(`policy: ${result.policy}`);
  console.log(`symbols: ${rows.length}`);
  console.log(`context mode: ${result.policy === "normal" ? "whole-file-allowed" : "symbol-only"}`);
}

function deps(id: string): void {
  const rows = readLedger();
  const row = findLedgerRow(id);
  printDuplicateIdNotice(id, rows);
  const resolution = resolveDependencies(row, rows);
  console.log(`${row.id} ${row.symbol}`);
  printList("depends_on", resolution.dependsOn);
  printList("blocked_by", resolution.blockedBy);
  printList("unresolved_calls", resolution.unresolvedCalls);
}

function next(): void {
  const row = selectNext(readLedger());
  if (!row) {
    console.log("No next task found.");
    return;
  }
  console.log(`${row.id} ${row.decision} ${row.targetDomain} ${row.file} ${row.symbol}`);
  if (row.batch) {
    console.log(`batch_hint=${row.batch}`);
  }
}

function candidates(argsList: string[]): void {
  const options = parseOptions(argsList);
  const rows = selectRecoveryCandidates(readLedger(), {
    limit: parseLimit(options.limit),
    domain: options.domain,
    file: options.file,
  });

  if (!rows.length) {
    console.log("No recovery candidates found.");
    return;
  }

  for (const candidate of rows) {
    const row = candidate.row;
    console.log(
      `${row.id} ${row.decision} ${row.targetDomain} ${row.file}:${row.lines} ${row.symbol}`,
    );
    console.log(`  reason=${candidate.reason}`);
    console.log(`  blocked_by=${candidate.blockedBy.join(",")}`);
    console.log(`  next=npm run zport -- deps ${row.id}`);
  }
}

function batch(argsList: string[]): void {
  const kind = requiredArg(argsList, 0, "kind");
  const options = parseOptions(argsList.slice(1));
  if (kind !== "constants") {
    throw new Error("batch supports only: constants");
  }

  const rows = selectConstantBatch(readLedger(), {
    limit: parseLimit(options.limit),
    file: options.file,
    domain: options.domain,
    getSourceLine,
  });

  if (!rows.length) {
    console.log("No batchable constants found.");
    return;
  }

  if (options["apply-plan"] !== undefined) {
    printConstantBatchPlan(rows);
    return;
  }

  for (const row of rows) {
    console.log(`${row.id} ${row.decision} ${row.targetDomain} ${row.file} ${row.symbol}`);
  }
}

function printConstantBatchPlan(rows: LedgerRow[]): void {
  const first = rows[0];
  const targetCandidates = [...new Set(rows.map((row) => row.targetTs).filter(Boolean))];
  console.log(`# Constant batch plan`);
  console.log(`file=${first.file}`);
  console.log(`domain=${first.targetDomain}`);
  console.log(`target=${targetCandidates.length === 1 ? targetCandidates[0] : "choose target"}`);
  console.log(`count=${rows.length}`);
  console.log("");
  for (const row of rows) {
    console.log(`${row.id} ${row.type} ${row.symbol} ${row.file}:${row.lines}`);
    console.log(`  source: ${getSourceLine(row)?.trim() || "(missing)"}`);
    const matches = findExistingSourceMatches(row, 3);
    console.log(
      `  existing: ${
        matches.length
          ? matches.map((match) => `${match.file}:${match.line}`).join(", ")
          : "none"
      }`,
    );
  }
  console.log("");
  console.log("After porting the complete plan:");
  console.log(`  npm run zport -- done-batch constants --target <path> ${rows.map((row) => row.id).join(" ")}`);
}

function getSourceLine(row: LedgerRow): string | undefined {
  const lineNumber = Number(row.lines.split("-")[0]);
  if (!Number.isInteger(lineNumber) || lineNumber < 1) {
    return undefined;
  }
  const fullPath = path.join(upstreamSourceRoot, row.file);
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }
  return fs.readFileSync(fullPath, "utf8").split(/\r?\n/)[lineNumber - 1];
}

function done(argsList: string[]): void {
  const id = requiredArg(argsList, 0, "id");
  const options = parseOptions(argsList.slice(1));
  const target = options.target;
  const targetSymbol = options["target-symbol"];
  const note = options.note;
  const lines = options.lines;
  if (!target && !targetSymbol && !note) {
    throw new Error("done requires --target <path>, --target-symbol <name>, or --note <text>");
  }
  const rows = lines
    ? findLedgerRows(id).filter((row) => row.lines === lines)
    : findLedgerRows(id);
  if (lines && !rows.length) {
    throw new Error(`Unknown ledger id and lines: ${id} ${lines}`);
  }
  const currentRow = lines ? rows[0] : findLedgerRow(id);
  const patch = {
    status: "ported",
    targetSymbol: targetSymbol || currentRow.targetSymbol,
    targetTs: target || currentRow.targetTs,
    notes: note || currentRow.notes,
  };

  if (rows.length > 1) {
    if (!areEquivalentLedgerOccurrences(rows)) {
      throw new Error(
        `Ambiguous duplicate ledger id: ${id}. Use a unique id before marking this symbol.`,
      );
    }
    const updatedRows = updateEquivalentLedgerRows(id, patch);
    console.log(`${id} ported (${updatedRows.length} equivalent occurrences)`);
    return;
  }

  if (lines) {
    const updatedRows = updateEquivalentLedgerRowsByLines(id, lines, patch);
    console.log(`${id} ported (${updatedRows.length} occurrence at ${lines})`);
    return;
  }

  mark(id, patch);
}

function doneBatch(argsList: string[]): void {
  const kind = requiredArg(argsList, 0, "kind");
  if (kind !== "constants") {
    throw new Error("done-batch supports only: constants");
  }

  const options = parseOptions(argsList.slice(1));
  const target = options.target;
  const note = options.note;
  const ids = argsList.slice(1).filter((value, index, list) => {
    if (value.startsWith("--")) {
      return false;
    }
    return index === 0 || !list[index - 1]?.startsWith("--");
  });

  if (!target && !note) {
    throw new Error("done-batch constants requires --target <path> or --note <text>");
  }
  if (!ids.length) {
    throw new Error("done-batch constants requires at least one id");
  }

  const rows = readLedger();
  const selectedRows = ids.map((id) => findLedgerRow(id));
  const invalidRows = selectedRows.filter(
    (row) => !isBatchableConstant(row, { getSourceLine }),
  );
  if (invalidRows.length) {
    throw new Error(
      `done-batch constants accepts only batchable todo constants/macros: ${invalidRows
        .map((row) => row.id)
        .join(",")}`,
    );
  }
  const blockedRows = selectedRows.filter(
    (row) => resolveDependencies(row, rows).blockedBy.length > 0,
  );
  if (blockedRows.length) {
    throw new Error(
      `done-batch constants refuses blocked ids: ${blockedRows.map((row) => row.id).join(",")}`,
    );
  }

  for (const id of ids) {
    const currentRow = findLedgerRow(id);
    const patch = {
      status: "ported",
      targetTs: target || currentRow.targetTs,
      notes: note || currentRow.notes,
    };
    const duplicateRows = findLedgerRows(id);
    if (duplicateRows.length > 1) {
      updateEquivalentLedgerRows(id, patch);
    } else {
      updateLedgerRow(id, patch);
    }
  }
  console.log(`ported ${ids.length} constants/macros`);
}

function requireNoteAndMark(
  argsList: string[],
  statusValue: string,
  extra: Partial<LedgerRow> = {},
): void {
  const id = requiredArg(argsList, 0, "id");
  const options = parseOptions(argsList.slice(1));
  if (!options.note) {
    throw new Error(`${statusValue} requires --note <text>`);
  }
  mark(id, { ...extra, status: statusValue, notes: options.note });
}

function mark(id: string, patch: Partial<LedgerRow>): void {
  printDuplicateIdNotice(id);
  const row = updateLedgerRow(id, patch);
  console.log(`${row.id} ${row.status}`);
}

function auditComments(): void {
  const issues = auditPortingComments();
  if (!issues.length) {
    console.log("Comment audit passed.");
    return;
  }
  for (const issue of issues) {
    console.log(`${issue.file}:${issue.line}: ${issue.message}`);
    console.log(`  ${issue.text}`);
  }
  process.exitCode = 1;
}

function printDuplicateIdNotice(id: string, rows = readLedger()): void {
  const matchingRows = rows.filter((row) => row.id === id);
  if (matchingRows.length < 2) {
    return;
  }
  const equivalence = areEquivalentLedgerOccurrences(matchingRows)
    ? "equivalent occurrences"
    : "ambiguous collision";
  console.warn(`warning: duplicate ledger id ${id} (${matchingRows.length} ${equivalence})`);
  for (const row of matchingRows) {
    console.warn(`  ${row.status} ${row.file}:${row.lines} ${row.symbol}`);
  }
}

function matches(row: LedgerRow, filters: Record<string, string>): boolean {
  return (
    (!filters.status || row.status === filters.status) &&
    (!filters.decision || row.decision === filters.decision) &&
    (!filters.domain || row.targetDomain === filters.domain) &&
    (!filters.file || row.file.includes(filters.file)) &&
    (!filters.batch || row.batch === filters.batch)
  );
}

function parseOptions(argsList: string[]): Record<string, string> {
  const options: Record<string, string> = {};
  for (let index = 0; index < argsList.length; index += 1) {
    const value = argsList[index];
    if (!value.startsWith("--")) {
      continue;
    }
    const key = value.slice(2);
    options[key] = argsList[index + 1] || "";
    index += 1;
  }
  return options;
}

function parseLimit(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("--limit must be a positive integer");
  }
  return limit;
}

function countBy(rows: LedgerRow[], getKey: (row: LedgerRow) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = getKey(row) || "(empty)";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function printCounts(counts: Map<string, number>): void {
  for (const [key, value] of [...counts.entries()].sort()) {
    console.log(`  ${key}: ${value}`);
  }
}

function printList(label: string, values: string[]): void {
  console.log(`${label}:`);
  if (!values.length) {
    console.log("  none");
    return;
  }
  values.forEach((value) => console.log(`  ${value}`));
}

function requiredArg(argsList: string[], index: number, name: string): string {
  const value = argsList[index];
  if (!value) {
    throw new Error(`Missing required argument: ${name}`);
  }
  return value;
}

function help(): void {
  console.log(`zport commands:
  scan
  list [--status value] [--decision value] [--domain value] [--file text] [--batch value]
  status
  show <id>
  brief <id>
  context <id>
  deps <id>
  batch constants [--limit 10] [--file relative-upstream-file] [--domain value] [--apply-plan]
      Propose a homogeneous batch of unblocked one-line constants/macros.
      Functions, methods, classes, structs and enums remain one-symbol tasks.
  candidates [--limit 20] [--domain value] [--file text]
      List blocked but promising recovery candidates, including direct cycles.
  cycle-candidates [--limit 20] [--domain value] [--file text]
      Alias for candidates.
  inspect-file <relative-upstream-file>
  next
  start <id>
  done <id> --target <path> [--target-symbol <name>]
  done <id> --target-symbol <name>
  done <id> --lines <range> --target <path> [--target-symbol <name>]
      Equivalent duplicate ids are marked together; ambiguous duplicate ids are refused.
  done-batch constants --target <path> <id>...
      Marks a validated batch of unblocked one-line constants/macros.
  audit-comments
  block <id> --note <text>
  ignore <id> --note <text>`);
}
