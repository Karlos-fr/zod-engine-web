#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { inspectFile } from "./large-file-policy.ts";
import {
  findLedgerRow,
  readLedger,
  updateLedgerRow,
  type LedgerRow,
} from "./ledger.ts";
import { buildContext } from "./context-builder.ts";
import { scanUpstream } from "./scan-upstream.ts";
import { selectNext } from "./task-selector.ts";
import { upstreamSourceRoot } from "./config.ts";
import { extractRange } from "./symbol-extractor.ts";
import { resolveDependencies } from "./dependencies.ts";

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
    case "context":
      return console.log(buildContext(requiredArg(argsList, 0, "id")));
    case "deps":
      return deps(requiredArg(argsList, 0, "id"));
    case "inspect-file":
      return inspect(argsList);
    case "next":
      return next();
    case "start":
      return mark(requiredArg(argsList, 0, "id"), { status: "in_progress" });
    case "done":
      return done(argsList);
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
  const fullPath = path.join(upstreamSourceRoot, row.file);
  const content = fs.readFileSync(fullPath, "utf8");
  console.log(`${row.id} ${row.symbol}`);
  console.log(`${row.file}:${row.lines}`);
  console.log(`decision=${row.decision} status=${row.status} domain=${row.targetDomain}`);
  console.log("");
  console.log(extractRange(content, row.lines));
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

function done(argsList: string[]): void {
  const id = requiredArg(argsList, 0, "id");
  const options = parseOptions(argsList.slice(1));
  const target = options.target;
  const note = options.note;
  if (!target && !note) {
    throw new Error("done requires --target <path> or --note <text>");
  }
  mark(id, {
    status: "ported",
    targetTs: target || findLedgerRow(id).targetTs,
    notes: note || findLedgerRow(id).notes,
  });
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
  const row = updateLedgerRow(id, patch);
  console.log(`${row.id} ${row.status}`);
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
  context <id>
  deps <id>
  inspect-file <relative-upstream-file>
  next
  start <id>
  done <id> --target <path>
  block <id> --note <text>
  ignore <id> --note <text>`);
}
