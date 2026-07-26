import path from "node:path";

export const projectRoot = process.cwd();

export const upstreamRoot =
  "download/zod-zod_engine-6f2d1f82a95c7e2bcbb8338770d03e2b70b3e0b5";

export const upstreamSourceRoot = path.join(upstreamRoot, "src");
export const ledgerPath = "docs/porting/PORTING_LEDGER.md";
export const decisionsPath = "docs/porting/PORTING_DECISIONS.md";
export const contextRulesPath = "docs/porting/PORTING_CONTEXT_RULES.md";

export const sourceExtensions = new Set([".h", ".hpp", ".c", ".cpp"]);

export const ignoredPathParts = [
  `${path.sep}vsproj${path.sep}`,
  `${path.sep}libs${path.sep}`,
  `${path.sep}docs${path.sep}`,
];

export const statusValues = [
  "todo",
  "qualified",
  "in_progress",
  "ported",
  "verified",
  "blocked",
  "ignored",
] as const;

export const decisionValues = [
  "PORTER",
  "ADAPT",
  "REPLACE",
  "IGNORE",
  "DEFER",
] as const;

export type PortingStatus = (typeof statusValues)[number];
export type PortingDecision = (typeof decisionValues)[number];
