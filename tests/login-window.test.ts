import { describe, expect, it } from "vitest";
import { ZGW_LOGIN_HEADER_GUARD_PORTED } from "../src/ui/LoginWindow";

describe("login window", () => {
  it("adapts the gwlogin.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/LoginWindow");
    const secondImport = await import("../src/ui/LoginWindow");

    expect(ZGW_LOGIN_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_LOGIN_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_LOGIN_HEADER_GUARD_PORTED,
    );
  });
});
