import { describe, expect, it } from "vitest";
import {
  AES_ENCRYPT_HEADER_GUARD_PORTED,
  AES_STATE_COLUMNS,
  ZEncryptAES,
  aesAddRoundKey,
  aesCipher,
  aesDecrypt,
  aesEncrypt,
  aesInitKey,
  aesInvCipher,
  aesInvShiftRows,
  aesGetSBoxInvert,
  aesGetSBoxValue,
  aesInvMixColumns,
  aesInvSubBytes,
  aesKeyExpansion,
  aesMixColumns,
  aesMultiply,
  aesShiftRows,
  aesSubBytes,
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

  it("ports ZEncryptAES getSBoxValue as AES substitution lookup", () => {
    expect(aesGetSBoxValue(0x00)).toBe(0x63);
    expect(aesGetSBoxValue(0x53)).toBe(0xed);
    expect(aesGetSBoxValue(0xff)).toBe(0x16);
    expect(aesGetSBoxValue(0x153)).toBe(0xed);
  });

  it("ports ZEncryptAES getSBoxInvert as AES inverse substitution lookup", () => {
    expect(aesGetSBoxInvert(0x00)).toBe(0x52);
    expect(aesGetSBoxInvert(0x63)).toBe(0x00);
    expect(aesGetSBoxInvert(0xed)).toBe(0x53);
    expect(aesGetSBoxInvert(0x1ed)).toBe(0x53);
  });

  it("ports ZEncryptAES AddRoundKey as round-key XOR over AES state columns", () => {
    const state = [
      [0x00, 0x10, 0x20, 0x30],
      [0x01, 0x11, 0x21, 0x31],
      [0x02, 0x12, 0x22, 0x32],
      [0x03, 0x13, 0x23, 0x33],
    ];
    const roundKey = Array.from({ length: 32 }, (_, index) => index);

    aesAddRoundKey(state, roundKey, 1);

    expect(state).toEqual([
      [0x10, 0x04, 0x38, 0x2c],
      [0x10, 0x04, 0x38, 0x2c],
      [0x10, 0x04, 0x38, 0x2c],
      [0x10, 0x04, 0x38, 0x2c],
    ]);
  });

  it("keeps ZEncryptAES AddRoundKey state values in unsigned byte range", () => {
    const state = [
      [0xff, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x00, 0x00],
    ];
    const roundKey = Array.from({ length: 16 }, () => 0);
    roundKey[0] = 0x1ff;

    aesAddRoundKey(state, roundKey, 0);

    expect(state[0][0]).toBe(0);
  });

  it("ports ZEncryptAES KeyExpansion as AES round-key schedule generation", () => {
    const key = Array.from({ length: 16 }, (_, index) => index);

    const roundKey = aesKeyExpansion(key, 4, 10);

    expect(roundKey).toHaveLength(176);
    expect(roundKey.slice(0, 16)).toEqual(key);
    expect(roundKey.slice(16, 32)).toEqual([
      0xd6, 0xaa, 0x74, 0xfd, 0xd2, 0xaf, 0x72, 0xfa, 0xda, 0xa6, 0x78, 0xf1,
      0xd6, 0xab, 0x76, 0xfe,
    ]);
    expect(roundKey.slice(160, 176)).toEqual([
      0x13, 0x11, 0x1d, 0x7f, 0xe3, 0x94, 0x4a, 0x17, 0xf3, 0x07, 0xa7, 0x8b,
      0x4d, 0x2b, 0x30, 0xc5,
    ]);
  });

  it("ports ZEncryptAES Init_Key as AES key schedule initialization", () => {
    const key = Array.from({ length: 16 }, (_, index) => index);

    expect(aesInitKey(key, 64)).toBeNull();

    const schedule = aesInitKey(key, 128);

    expect(schedule).not.toBeNull();
    expect(schedule?.nk).toBe(4);
    expect(schedule?.nr).toBe(10);
    expect(schedule?.key).toEqual(key);
    expect(schedule?.roundKey.slice(160, 176)).toEqual([
      0x13, 0x11, 0x1d, 0x7f, 0xe3, 0x94, 0x4a, 0x17, 0xf3, 0x07, 0xa7, 0x8b,
      0x4d, 0x2b, 0x30, 0xc5,
    ]);
  });

  it("ports ZEncryptAES Cipher as one-block AES encryption", () => {
    const key = Array.from({ length: 16 }, (_, index) => index);
    const input = [
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
      0xcc, 0xdd, 0xee, 0xff,
    ];
    const roundKey = aesKeyExpansion(key, 4, 10);

    const output = aesCipher(input, roundKey, 10);

    expect(output).toEqual([
      0x69, 0xc4, 0xe0, 0xd8, 0x6a, 0x7b, 0x04, 0x30, 0xd8, 0xcd, 0xb7, 0x80,
      0x70, 0xb4, 0xc5, 0x5a,
    ]);
  });

  it("ports ZEncryptAES AES_Encrypt as repeated block encryption", () => {
    const schedule = aesInitKey(
      Array.from({ length: 16 }, (_, index) => index),
      128,
    );
    if (!schedule) throw new Error("expected valid AES schedule");
    const block = [
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
      0xcc, 0xdd, 0xee, 0xff,
    ];
    const encryptedBlock = [
      0x69, 0xc4, 0xe0, 0xd8, 0x6a, 0x7b, 0x04, 0x30, 0xd8, 0xcd, 0xb7, 0x80,
      0x70, 0xb4, 0xc5, 0x5a,
    ];

    expect(aesEncrypt([...block, ...block], 32, schedule)).toEqual([
      ...encryptedBlock,
      ...encryptedBlock,
    ]);
  });

  it("ports ZEncryptAES AES_Decrypt as repeated block decryption", () => {
    const schedule = aesInitKey(
      Array.from({ length: 16 }, (_, index) => index),
      128,
    );
    if (!schedule) throw new Error("expected valid AES schedule");
    const block = [
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
      0xcc, 0xdd, 0xee, 0xff,
    ];
    const input = [...block, ...block];

    expect(aesDecrypt(aesEncrypt(input, 32, schedule), 32, schedule)).toEqual(
      input,
    );
  });

  it("ports ZEncryptAES class as stateful AES key and block helper", () => {
    const aes = new ZEncryptAES();
    const key = Array.from({ length: 16 }, (_, index) => index);
    const input = [
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
      0xcc, 0xdd, 0xee, 0xff,
    ];
    const encrypted = [
      0x69, 0xc4, 0xe0, 0xd8, 0x6a, 0x7b, 0x04, 0x30, 0xd8, 0xcd, 0xb7, 0x80,
      0x70, 0xb4, 0xc5, 0x5a,
    ];

    expect(aes.nr).toBe(0);
    expect(aes.nk).toBe(0);
    expect(aes.aesEncrypt(input, 16)).toEqual(Array.from({ length: 16 }, () => 0));

    expect(aes.initKey(key, 64)).toBe(0);
    expect(aes.nr).toBe(0);
    expect(aes.nk).toBe(0);

    expect(aes.initKey(key, 128)).toBe(1);
    expect(aes.nr).toBe(10);
    expect(aes.nk).toBe(4);
    expect(aes.key).toEqual(key);
    expect(aes.roundKey).toHaveLength(176);
    expect(aes.aesEncrypt(input, 16)).toEqual(encrypted);
    expect(aes.aesDecrypt(encrypted, 16)).toEqual(input);
  });

  it("ports ZEncryptAES InvCipher as one-block AES decryption", () => {
    const key = Array.from({ length: 16 }, (_, index) => index);
    const input = [
      0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
      0xcc, 0xdd, 0xee, 0xff,
    ];
    const encrypted = [
      0x69, 0xc4, 0xe0, 0xd8, 0x6a, 0x7b, 0x04, 0x30, 0xd8, 0xcd, 0xb7, 0x80,
      0x70, 0xb4, 0xc5, 0x5a,
    ];
    const roundKey = aesKeyExpansion(key, 4, 10);

    expect(aesInvCipher(encrypted, roundKey, 10)).toEqual(input);
    expect(aesInvCipher(aesCipher(input, roundKey, 10), roundKey, 10)).toEqual(
      input,
    );
  });

  it("ports ZEncryptAES MixColumns as AES column mixing", () => {
    const state = [
      [0xdb, 0x00, 0x00, 0x00],
      [0x13, 0x00, 0x00, 0x00],
      [0x53, 0x00, 0x00, 0x00],
      [0x45, 0x00, 0x00, 0x00],
    ];

    aesMixColumns(state);

    expect(state).toEqual([
      [0x8e, 0x00, 0x00, 0x00],
      [0x4d, 0x00, 0x00, 0x00],
      [0xa1, 0x00, 0x00, 0x00],
      [0xbc, 0x00, 0x00, 0x00],
    ]);
  });

  it("ports ZEncryptAES InvMixColumns as inverse AES column mixing", () => {
    const originalState = [
      [0xdb, 0x00, 0x00, 0x00],
      [0x13, 0x00, 0x00, 0x00],
      [0x53, 0x00, 0x00, 0x00],
      [0x45, 0x00, 0x00, 0x00],
    ];
    const state = originalState.map((row) => [...row]);

    aesMixColumns(state);
    aesInvMixColumns(state);

    expect(state).toEqual(originalState);
  });

  it("ports ZEncryptAES SubBytes as in-place AES state substitution", () => {
    const state = [
      [0x00, 0x53, 0xff, 0x10],
      [0x20, 0x30, 0x40, 0x50],
      [0x60, 0x70, 0x80, 0x90],
      [0xa0, 0xb0, 0xc0, 0xd0],
    ];

    aesSubBytes(state);

    expect(state).toEqual([
      [0x63, 0xed, 0x16, 0xca],
      [0xb7, 0x04, 0x09, 0x53],
      [0xd0, 0x51, 0xcd, 0x60],
      [0xe0, 0xe7, 0xba, 0x70],
    ]);
  });

  it("ports ZEncryptAES ShiftRows as row-offset left rotations", () => {
    const state = [
      [0x00, 0x01, 0x02, 0x03],
      [0x10, 0x11, 0x12, 0x13],
      [0x20, 0x21, 0x22, 0x23],
      [0x30, 0x31, 0x32, 0x33],
    ];

    aesShiftRows(state);

    expect(state).toEqual([
      [0x00, 0x01, 0x02, 0x03],
      [0x11, 0x12, 0x13, 0x10],
      [0x22, 0x23, 0x20, 0x21],
      [0x33, 0x30, 0x31, 0x32],
    ]);
  });

  it("ports ZEncryptAES InvShiftRows as row-offset right rotations", () => {
    const originalState = [
      [0x00, 0x01, 0x02, 0x03],
      [0x10, 0x11, 0x12, 0x13],
      [0x20, 0x21, 0x22, 0x23],
      [0x30, 0x31, 0x32, 0x33],
    ];
    const state = originalState.map((row) => [...row]);

    aesShiftRows(state);
    aesInvShiftRows(state);

    expect(state).toEqual(originalState);
  });

  it("ports ZEncryptAES InvSubBytes as in-place AES inverse substitution", () => {
    const originalState = [
      [0x00, 0x53, 0xff, 0x10],
      [0x20, 0x30, 0x40, 0x50],
      [0x60, 0x70, 0x80, 0x90],
      [0xa0, 0xb0, 0xc0, 0xd0],
    ];
    const state = originalState.map((row) => [...row]);

    aesSubBytes(state);
    aesInvSubBytes(state);

    expect(state).toEqual(originalState);
  });
});
