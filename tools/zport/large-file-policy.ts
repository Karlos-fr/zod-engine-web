import fs from "node:fs";

export type FilePolicy = "normal" | "large" | "huge" | "binary";

export type FileInspection = {
  path: string;
  bytes: number;
  lines: number;
  policy: FilePolicy;
};

export function inspectFile(filePath: string): FileInspection {
  const buffer = fs.readFileSync(filePath);
  const bytes = buffer.byteLength;

  if (buffer.includes(0)) {
    return { path: filePath, bytes, lines: 0, policy: "binary" };
  }

  const content = buffer.toString("utf8");
  const lines = content.split(/\r?\n/).length;
  let policy: FilePolicy = "normal";

  if (bytes > 200 * 1024 || lines > 3000) {
    policy = "huge";
  } else if (bytes > 80 * 1024 || lines > 1200) {
    policy = "large";
  }

  return { path: filePath, bytes, lines, policy };
}

export function canIncludeWholeFile(policy: FilePolicy): boolean {
  return policy === "normal";
}
