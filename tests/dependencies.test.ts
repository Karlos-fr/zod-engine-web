import { describe, expect, it } from "vitest";
import { resolveDependencies } from "../tools/zport/dependencies";
import { readLedger } from "../tools/zport/ledger";

describe("zport dependency resolution", () => {
  it("does not treat constructor and local method calls as external blockers", () => {
    const rows = readLedger();
    const waypoint = rows.find((row) => row.id === "CLS-959986");

    expect(waypoint).toBeDefined();

    const resolution = resolveDependencies(waypoint!, rows);

    expect(resolution.unresolvedCalls).not.toContain("waypoint");
    expect(resolution.blockedBy).not.toContain("FUN-0387EA");
    expect(resolution.blockedBy).not.toContain("FUN-1BFF68");
    expect(resolution.blockedBy).not.toContain("FUN-1D43ED");
  });
});
