import { describe, expect, it } from "vitest";
import { ZGW_CREATE_USER_HEADER_GUARD_PORTED } from "../src/ui/CreateUserWindow";

describe("create user window", () => {
  it("adapts the gwcreateuser.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/CreateUserWindow");
    const secondImport = await import("../src/ui/CreateUserWindow");

    expect(ZGW_CREATE_USER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_CREATE_USER_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_CREATE_USER_HEADER_GUARD_PORTED,
    );
  });
});
