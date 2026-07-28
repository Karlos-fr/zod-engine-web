import { describe, expect, it } from "vitest";
import {
  BuildListObject,
  ZBUILD_LIST_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/BuildList";

describe("build list", () => {
  it("adapts the zbuildlist.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/entities/BuildList");
    const secondImport = await import("../src/simulation/entities/BuildList");

    expect(ZBUILD_LIST_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZBUILD_LIST_HEADER_GUARD_PORTED).toBe(
      firstImport.ZBUILD_LIST_HEADER_GUARD_PORTED,
    );
  });

  it("ports buildlist_object default construction", () => {
    expect(new BuildListObject()).toEqual({
      ot: 0,
      oid: 0,
    });
  });

  it("ports buildlist_object configured construction", () => {
    expect(new BuildListObject(1, 4)).toEqual({
      ot: 1,
      oid: 4,
    });
  });

  it("ports buildlist_object clear as object type and id reset", () => {
    const buildListObject = new BuildListObject(1, 4);

    buildListObject.clear();

    expect(buildListObject).toEqual({
      ot: 0,
      oid: 0,
    });
  });
});
