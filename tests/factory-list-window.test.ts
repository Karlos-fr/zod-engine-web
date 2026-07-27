import { describe, expect, it } from "vitest";
import { ZGW_FACTORY_LIST_HEADER_GUARD_PORTED } from "../src/ui/FactoryListWindow";

describe("factory list window", () => {
  it("adapts the gwfactory_list.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/FactoryListWindow");
    const secondImport = await import("../src/ui/FactoryListWindow");

    expect(ZGW_FACTORY_LIST_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_FACTORY_LIST_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_FACTORY_LIST_HEADER_GUARD_PORTED,
    );
  });
});
