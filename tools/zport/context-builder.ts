import fs from "node:fs";
import path from "node:path";
import { contextRulesPath, upstreamSourceRoot } from "./config.ts";
import { inspectFile } from "./large-file-policy.ts";
import { findLedgerRow, type LedgerRow } from "./ledger.ts";
import { readDependencyContext } from "./dependency-graph.ts";
import { readLedger } from "./ledger.ts";
import { resolveDependencies } from "./dependencies.ts";
import { extractRange } from "./symbol-extractor.ts";

export function buildContext(id: string): string {
  const row = findLedgerRow(id);
  const fullPath = path.join(upstreamSourceRoot, row.file);
  const content = fs.readFileSync(fullPath, "utf8");
  const inspection = inspectFile(fullPath);
  const dependencies = readDependencyContext(row);
  const resolution = resolveDependencies(row, readLedger());
  const rules = fs.existsSync(contextRulesPath)
    ? fs.readFileSync(contextRulesPath, "utf8")
    : "";

  return [
    `# Porting context: ${row.id}`,
    "",
    "## Ledger row",
    renderRow(row),
    "",
    "## File policy",
    `- path: ${row.file}`,
    `- bytes: ${inspection.bytes}`,
    `- lines: ${inspection.lines}`,
    `- policy: ${inspection.policy}`,
    "",
    "## Architecture and context rules",
    rules.split(/\r?\n/).slice(0, 80).join("\n"),
    "",
    "## Upstream symbol excerpt",
    "```cpp",
    extractRange(content, row.lines),
    "```",
    "",
    "## Direct includes",
    dependencies.includes.length ? dependencies.includes.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Ledger dependencies",
    resolution.dependsOn.length ? resolution.dependsOn.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Blocking dependencies",
    resolution.blockedBy.length ? resolution.blockedBy.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Unresolved calls",
    resolution.unresolvedCalls.length ? resolution.unresolvedCalls.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Candidate direct calls",
    dependencies.calls.length ? dependencies.calls.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Required action",
    "Port only this symbol. The batch field is informational only. Update tests and mark this ledger row.",
  ].join("\n");
}

function renderRow(row: LedgerRow): string {
  return [
    `- ID: ${row.id}`,
    `- Type: ${row.type}`,
    `- Symbole: ${row.symbol}`,
    `- Fichier: ${row.file}`,
    `- Lignes: ${row.lines}`,
    `- Décision: ${row.decision}`,
    `- Domaine cible: ${row.targetDomain}`,
    `- Statut: ${row.status}`,
    `- Lot: ${row.batch || "none"}`,
    `- Cible TS: ${row.targetTs || "none"}`,
    `- Notes: ${row.notes || "none"}`,
  ].join("\n");
}
