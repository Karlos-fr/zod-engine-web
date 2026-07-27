import { describe, expect, it } from "vitest";
import {
  ZOD_ENGINE_COMPANY_NAME,
  ZOD_ENGINE_FILE_DESCRIPTION,
  ZOD_ENGINE_FILE_VERSION,
  ZOD_ENGINE_INTERNAL_NAME,
  ZOD_ENGINE_LEGAL_COPYRIGHT,
  ZOD_ENGINE_LEGAL_TRADEMARKS,
  ZOD_ENGINE_ORIGINAL_FILENAME,
  ZOD_ENGINE_PRIVATE_HEADER_GUARD_PORTED,
  ZOD_ENGINE_PRODUCT_NAME,
  ZOD_ENGINE_PRODUCT_VERSION,
  ZOD_ENGINE_VERSION_BUILD,
  ZOD_ENGINE_VERSION_MAJOR,
  ZOD_ENGINE_VERSION_MINOR,
  ZOD_ENGINE_VERSION_RELEASE,
  ZOD_ENGINE_VERSION_STRING,
} from "../src/app/ZodEngineMetadata";

describe("Zod Engine metadata", () => {
  it("adapts the zod_engine_private.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/app/ZodEngineMetadata");
    const secondImport = await import("../src/app/ZodEngineMetadata");

    expect(ZOD_ENGINE_PRIVATE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZOD_ENGINE_PRIVATE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZOD_ENGINE_PRIVATE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the upstream version metadata constants", () => {
    expect(ZOD_ENGINE_VERSION_STRING).toBe("0.1.1.140");
    expect(ZOD_ENGINE_VERSION_MAJOR).toBe(0);
    expect(ZOD_ENGINE_VERSION_MINOR).toBe(1);
    expect(ZOD_ENGINE_VERSION_RELEASE).toBe(1);
    expect(ZOD_ENGINE_VERSION_BUILD).toBe(140);
  });

  it("adapts the upstream product metadata constants", () => {
    expect(ZOD_ENGINE_COMPANY_NAME).toBe("Nighsoft");
    expect(ZOD_ENGINE_FILE_DESCRIPTION).toBe(
      "An open source engine for the game Z by The Bitmap Brothers",
    );
    expect(ZOD_ENGINE_FILE_VERSION).toBe("");
    expect(ZOD_ENGINE_INTERNAL_NAME).toBe("");
    expect(ZOD_ENGINE_PRODUCT_NAME).toBe("The Zod Engine");
    expect(ZOD_ENGINE_PRODUCT_VERSION).toBe("");
    expect(ZOD_ENGINE_ORIGINAL_FILENAME).toBe("");
    expect(ZOD_ENGINE_LEGAL_COPYRIGHT).toBe("");
    expect(ZOD_ENGINE_LEGAL_TRADEMARKS).toBe("");
  });
});
