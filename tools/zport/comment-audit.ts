import fs from "node:fs";
import path from "node:path";
import { projectRoot } from "./config.ts";

export type CommentAuditIssue = {
  file: string;
  line: number;
  message: string;
  text: string;
};

const forbiddenPatterns: Array<[RegExp, string]> = [
  [/\bLedger:\s*/, "ledger id belongs in the ledger, not source comments"],
  [/\bDepends on\b/i, "dependency graph belongs in the CLI"],
  [/\bUses\b/, "dependency graph belongs in the CLI"],
  [/\bCalled by\b/i, "caller graph belongs in the CLI"],
  [/\bRequired before\b/i, "porting order belongs in the CLI"],
  [/\bSelected by zport\b/i, "selection reason belongs in the CLI"],
  [/\bPorted with\b/i, "porting mechanics belong in the ledger"],
  [/\bneeded by\b/i, "dependency wording belongs in the CLI"],
];

const ignoredDirectories = new Set([
  ".git",
  "dist",
  "download",
  "node_modules",
]);

/**
 * Role: Checks ported-source comments against the compact comment norm.
 */
export function auditPortingComments(): CommentAuditIssue[] {
  const issues: CommentAuditIssue[] = [];
  for (const file of listTypeScriptFiles(path.join(projectRoot, "src"))) {
    const relativeFile = path.relative(projectRoot, file);
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      for (const [pattern, message] of forbiddenPatterns) {
        if (!pattern.test(line)) {
          continue;
        }
        issues.push({
          file: relativeFile,
          line: index + 1,
          message,
          text: line.trim(),
        });
      }
    }
  }
  return issues;
}

function listTypeScriptFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTypeScriptFiles(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".ts")) {
      files.push(fullPath);
    }
  }
  return files.sort();
}
