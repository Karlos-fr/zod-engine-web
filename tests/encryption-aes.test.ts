import { describe, expect, it } from "vitest";
import {
  AES_ENCRYPT_HEADER_GUARD_PORTED,
  AES_STATE_COLUMNS,
  aesMultiply,
  aesXtime,
} from "../src/simulation/EncryptionAES";

describe("AES encryption constants", () => {
  it("adapts the zencrypt_aes.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/EncryptionAES");
    const secondImport = await import("../src/simulation/EncryptionAES");

    expect(AES_ENCRYPT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.AES_ENCRYPT_HEADER_GUARD_PORTED).toBe(
      firstImport.AES_ENCRYPT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the upstream Nb macro as the AES state column count", () => {
    expect(AES_STATE_COLUMNS).toBe(4);
  });

  it("adapts xtime as AES finite-field byte multiplication", () => {
    expect(aesXtime(0x01)).toBe(0x02);
    expect(aesXtime(0x57)).toBe(0xae);
    expect(aesXtime(0x80)).toBe(0x1b);
  });

  it("adapts Multiply as AES finite-field byte multiplication", () => {
    expect(aesMultiply(0x57, 0x13)).toBe(0xfe);
    expect(aesMultiply(0xdb, 0x09)).toBe(0x59);
    expect(aesMultiply(0xdb, 0x0b)).toBe(0xf4);
    expect(aesMultiply(0xdb, 0x0d)).toBe(0x18);
    expect(aesMultiply(0xdb, 0x0e)).toBe(0x6e);
  });
});
