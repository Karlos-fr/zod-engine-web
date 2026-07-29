/**
 * Upstream: zencrypt_aes.h / zencrypt_aes.cpp
 */

/**
 * Port of upstream `_AES_ENCRYPT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zencrypt_aes.h:7
 */
export const AES_ENCRYPT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `Nb`.
 * Role: Defines the AES state width in 32-bit columns.
 * Upstream: zencrypt_aes.cpp:7
 */
export const AES_STATE_COLUMNS = 4;

/**
 * Port of upstream `xtime`.
 * Role: Multiplies one AES byte by x in the Rijndael finite field.
 * Upstream: zencrypt_aes.cpp:10
 */
export function aesXtime(value: number): number {
  const byte = value & 0xff;
  return ((byte << 1) ^ (((byte >> 7) & 1) * 0x1b)) & 0xff;
}

/**
 * Port of upstream `Multiply`.
 * Role: Multiplies two AES bytes in the Rijndael finite field.
 * Upstream: zencrypt_aes.cpp:12
 */
export function aesMultiply(value: number, multiplier: number): number {
  const byte = value & 0xff;
  const factor = multiplier & 0xff;
  const by2 = aesXtime(byte);
  const by4 = aesXtime(by2);
  const by8 = aesXtime(by4);
  const by16 = aesXtime(by8);

  return (
    ((factor & 1) * byte) ^
    (((factor >> 1) & 1) * by2) ^
    (((factor >> 2) & 1) * by4) ^
    (((factor >> 3) & 1) * by8) ^
    (((factor >> 4) & 1) * by16)
  ) & 0xff;
}

const AES_S_BOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
  0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
  0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
  0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
  0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
  0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
  0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
  0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
  0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
  0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
  0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
  0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
  0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
  0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
  0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
  0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
  0xb0, 0x54, 0xbb, 0x16,
];

const AES_INVERSE_S_BOX = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
  0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
  0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
  0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
  0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
  0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
  0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
  0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
  0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
  0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
  0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
  0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
  0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
  0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
  0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
  0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
  0x55, 0x21, 0x0c, 0x7d,
];

const AES_RCON = [
  0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
  0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a,
  0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
  0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
  0x74, 0xe8, 0xcb,
];

/**
 * Port of upstream `ZEncryptAES::getSBoxValue`.
 * Role: Looks up the AES substitution byte used by encryption rounds.
 * Upstream: zencrypt_aes.cpp:37-58
 */
export function aesGetSBoxValue(num: number): number {
  return AES_S_BOX[num & 0xff];
}

/**
 * Port of upstream `ZEncryptAES::getSBoxInvert`.
 * Role: Looks up the AES inverse substitution byte used by decryption rounds.
 * Upstream: zencrypt_aes.cpp:14-35
 */
export function aesGetSBoxInvert(num: number): number {
  return AES_INVERSE_S_BOX[num & 0xff];
}

export type AesState = number[][];

export type AesKeySchedule = {
  key: number[];
  nk: number;
  nr: number;
  roundKey: number[];
};

/**
 * Port of upstream `ZEncryptAES::AddRoundKey`.
 * Role: Applies an AES round key to the current state matrix.
 * Upstream: zencrypt_aes.cpp:150-160
 */
export function aesAddRoundKey(
  state: AesState,
  roundKey: ArrayLike<number>,
  round: number,
): void {
  const roundOffset = round * AES_STATE_COLUMNS * 4;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const keyIndex = roundOffset + i * AES_STATE_COLUMNS + j;
      state[j][i] = (state[j][i] ^ roundKey[keyIndex]) & 0xff;
    }
  }
}

/**
 * Port of upstream `ZEncryptAES::KeyExpansion`.
 * Role: Expands an AES cipher key into the round-key schedule.
 * Upstream: zencrypt_aes.cpp:61-146
 */
export function aesKeyExpansion(
  key: ArrayLike<number>,
  nk: number,
  nr: number,
): number[] {
  const roundKey = Array.from({ length: AES_STATE_COLUMNS * (nr + 1) * 4 }, () => 0);
  let i = 0;

  for (; i < nk; i++) {
    roundKey[i * 4] = key[i * 4] & 0xff;
    roundKey[i * 4 + 1] = key[i * 4 + 1] & 0xff;
    roundKey[i * 4 + 2] = key[i * 4 + 2] & 0xff;
    roundKey[i * 4 + 3] = key[i * 4 + 3] & 0xff;
  }

  while (i < AES_STATE_COLUMNS * (nr + 1)) {
    const temp = [
      roundKey[(i - 1) * 4],
      roundKey[(i - 1) * 4 + 1],
      roundKey[(i - 1) * 4 + 2],
      roundKey[(i - 1) * 4 + 3],
    ];

    if (i % nk === 0) {
      const k = temp[0];
      temp[0] = temp[1];
      temp[1] = temp[2];
      temp[2] = temp[3];
      temp[3] = k;

      temp[0] = aesGetSBoxValue(temp[0]);
      temp[1] = aesGetSBoxValue(temp[1]);
      temp[2] = aesGetSBoxValue(temp[2]);
      temp[3] = aesGetSBoxValue(temp[3]);

      temp[0] = (temp[0] ^ AES_RCON[i / nk]) & 0xff;
    } else if (nk > 6 && i % nk === 4) {
      temp[0] = aesGetSBoxValue(temp[0]);
      temp[1] = aesGetSBoxValue(temp[1]);
      temp[2] = aesGetSBoxValue(temp[2]);
      temp[3] = aesGetSBoxValue(temp[3]);
    }

    roundKey[i * 4] = (roundKey[(i - nk) * 4] ^ temp[0]) & 0xff;
    roundKey[i * 4 + 1] = (roundKey[(i - nk) * 4 + 1] ^ temp[1]) & 0xff;
    roundKey[i * 4 + 2] = (roundKey[(i - nk) * 4 + 2] ^ temp[2]) & 0xff;
    roundKey[i * 4 + 3] = (roundKey[(i - nk) * 4 + 3] ^ temp[3]) & 0xff;
    i++;
  }

  return roundKey;
}

/**
 * Port of upstream `ZEncryptAES::Init_Key`.
 * Role: Initializes AES key sizing and expands the supplied cipher key.
 * Upstream: zencrypt_aes.cpp:387-400
 */
export function aesInitKey(
  key: ArrayLike<number>,
  size: 128 | 192 | 256 | number,
): AesKeySchedule | null {
  if (size !== 128 && size !== 192 && size !== 256) return null;

  const nk = size / 32;
  const nr = nk + 6;
  const keyBytes = Array.from({ length: nk * 4 }, (_, index) => key[index] & 0xff);

  return {
    key: keyBytes,
    nk,
    nr,
    roundKey: aesKeyExpansion(keyBytes, nk, nr),
  };
}

/**
 * Port of upstream `ZEncryptAES::MixColumns`.
 * Role: Mixes each AES state column during encryption rounds.
 * Upstream: zencrypt_aes.cpp:327-340
 */
export function aesMixColumns(state: AesState): void {
  for (let i = 0; i < 4; i++) {
    const t = state[0][i];
    const tmp = state[0][i] ^ state[1][i] ^ state[2][i] ^ state[3][i];

    let tm = state[0][i] ^ state[1][i];
    tm = aesXtime(tm);
    state[0][i] = (state[0][i] ^ tm ^ tmp) & 0xff;

    tm = state[1][i] ^ state[2][i];
    tm = aesXtime(tm);
    state[1][i] = (state[1][i] ^ tm ^ tmp) & 0xff;

    tm = state[2][i] ^ state[3][i];
    tm = aesXtime(tm);
    state[2][i] = (state[2][i] ^ tm ^ tmp) & 0xff;

    tm = state[3][i] ^ t;
    tm = aesXtime(tm);
    state[3][i] = (state[3][i] ^ tm ^ tmp) & 0xff;
  }
}

/**
 * Port of upstream `ZEncryptAES::InvMixColumns`.
 * Role: Reverses AES column mixing during decryption rounds.
 * Upstream: zencrypt_aes.cpp:213-231
 */
export function aesInvMixColumns(state: AesState): void {
  for (let i = 0; i < 4; i++) {
    const a = state[0][i];
    const b = state[1][i];
    const c = state[2][i];
    const d = state[3][i];

    state[0][i] =
      (aesMultiply(a, 0x0e) ^
        aesMultiply(b, 0x0b) ^
        aesMultiply(c, 0x0d) ^
        aesMultiply(d, 0x09)) &
      0xff;
    state[1][i] =
      (aesMultiply(a, 0x09) ^
        aesMultiply(b, 0x0e) ^
        aesMultiply(c, 0x0b) ^
        aesMultiply(d, 0x0d)) &
      0xff;
    state[2][i] =
      (aesMultiply(a, 0x0d) ^
        aesMultiply(b, 0x09) ^
        aesMultiply(c, 0x0e) ^
        aesMultiply(d, 0x0b)) &
      0xff;
    state[3][i] =
      (aesMultiply(a, 0x0b) ^
        aesMultiply(b, 0x0d) ^
        aesMultiply(c, 0x09) ^
        aesMultiply(d, 0x0e)) &
      0xff;
  }
}

/**
 * Port of upstream `ZEncryptAES::SubBytes`.
 * Role: Substitutes each AES state byte during encryption rounds.
 * Upstream: zencrypt_aes.cpp:280-291
 */
export function aesSubBytes(state: AesState): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = aesGetSBoxValue(state[i][j]);
    }
  }
}

/**
 * Port of upstream `ZEncryptAES::ShiftRows`.
 * Role: Rotates AES state rows left during encryption rounds.
 * Upstream: zencrypt_aes.cpp:296-322
 */
export function aesShiftRows(state: AesState): void {
  let temp = state[1][0];
  state[1][0] = state[1][1];
  state[1][1] = state[1][2];
  state[1][2] = state[1][3];
  state[1][3] = temp;

  temp = state[2][0];
  state[2][0] = state[2][2];
  state[2][2] = temp;

  temp = state[2][1];
  state[2][1] = state[2][3];
  state[2][3] = temp;

  temp = state[3][0];
  state[3][0] = state[3][3];
  state[3][3] = state[3][2];
  state[3][2] = state[3][1];
  state[3][1] = temp;
}

/**
 * Port of upstream `ZEncryptAES::InvShiftRows`.
 * Role: Rotates AES state rows right during decryption rounds.
 * Upstream: zencrypt_aes.cpp:180-206
 */
export function aesInvShiftRows(state: AesState): void {
  let temp = state[1][3];
  state[1][3] = state[1][2];
  state[1][2] = state[1][1];
  state[1][1] = state[1][0];
  state[1][0] = temp;

  temp = state[2][0];
  state[2][0] = state[2][2];
  state[2][2] = temp;

  temp = state[2][1];
  state[2][1] = state[2][3];
  state[2][3] = temp;

  temp = state[3][0];
  state[3][0] = state[3][1];
  state[3][1] = state[3][2];
  state[3][2] = state[3][3];
  state[3][3] = temp;
}

/**
 * Port of upstream `ZEncryptAES::InvSubBytes`.
 * Role: Applies inverse AES byte substitution during decryption rounds.
 * Upstream: zencrypt_aes.cpp:164-175
 */
export function aesInvSubBytes(state: AesState): void {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[i][j] = aesGetSBoxInvert(state[i][j]);
    }
  }
}

/**
 * Port of upstream `ZEncryptAES::Cipher`.
 * Role: Encrypts one AES state block using an expanded round-key schedule.
 * Upstream: zencrypt_aes.cpp:343-385
 */
export function aesCipher(
  input: ArrayLike<number>,
  roundKey: ArrayLike<number>,
  nr: number,
): number[] {
  const state: AesState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[j][i] = input[i * 4 + j] & 0xff;
    }
  }

  aesAddRoundKey(state, roundKey, 0);

  for (let round = 1; round < nr; round++) {
    aesSubBytes(state);
    aesShiftRows(state);
    aesMixColumns(state);
    aesAddRoundKey(state, roundKey, round);
  }

  aesSubBytes(state);
  aesShiftRows(state);
  aesAddRoundKey(state, roundKey, nr);

  const output = Array.from({ length: 16 }, () => 0);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      output[i * 4 + j] = state[j][i];
    }
  }

  return output;
}

/**
 * Port of upstream `ZEncryptAES::InvCipher`.
 * Role: Decrypts one AES state block using an expanded round-key schedule.
 * Upstream: zencrypt_aes.cpp:234-276
 */
export function aesInvCipher(
  input: ArrayLike<number>,
  roundKey: ArrayLike<number>,
  nr: number,
): number[] {
  const state: AesState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      state[j][i] = input[i * 4 + j] & 0xff;
    }
  }

  aesAddRoundKey(state, roundKey, nr);

  for (let round = nr - 1; round > 0; round--) {
    aesInvShiftRows(state);
    aesInvSubBytes(state);
    aesAddRoundKey(state, roundKey, round);
    aesInvMixColumns(state);
  }

  aesInvShiftRows(state);
  aesInvSubBytes(state);
  aesAddRoundKey(state, roundKey, 0);

  const output = Array.from({ length: 16 }, () => 0);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      output[i * 4 + j] = state[j][i];
    }
  }

  return output;
}

/**
 * Port of upstream `ZEncryptAES::AES_Encrypt`.
 * Role: Encrypts input bytes as consecutive AES blocks.
 * Upstream: zencrypt_aes.cpp:402-411
 */
export function aesEncrypt(
  input: ArrayLike<number>,
  inSize: number,
  schedule: AesKeySchedule,
): number[] {
  const output = Array.from({ length: inSize }, () => 0);

  for (let i = 0; i < inSize; i += 16) {
    const block = Array.from({ length: 16 }, (_, index) => input[i + index] ?? 0);
    const encrypted = aesCipher(block, schedule.roundKey, schedule.nr);

    for (let j = 0; j < 16 && i + j < inSize; j++) {
      output[i + j] = encrypted[j];
    }
  }

  return output;
}

/**
 * Port of upstream `ZEncryptAES::AES_Decrypt`.
 * Role: Decrypts input bytes as consecutive AES blocks.
 * Upstream: zencrypt_aes.cpp:413-422
 */
export function aesDecrypt(
  input: ArrayLike<number>,
  inSize: number,
  schedule: AesKeySchedule,
): number[] {
  const output = Array.from({ length: inSize }, () => 0);

  for (let i = 0; i < inSize; i += 16) {
    const block = Array.from({ length: 16 }, (_, index) => input[i + index] ?? 0);
    const decrypted = aesInvCipher(block, schedule.roundKey, schedule.nr);

    for (let j = 0; j < 16 && i + j < inSize; j++) {
      output[i + j] = decrypted[j];
    }
  }

  return output;
}

/**
 * Port of upstream `ZEncryptAES`.
 * Role: Holds AES key schedule state and exposes block encryption helpers.
 * Upstream: zencrypt_aes.h:9-47
 */
export class ZEncryptAES {
  private schedule: AesKeySchedule | null = null;

  get nr(): number {
    return this.schedule?.nr ?? 0;
  }

  get nk(): number {
    return this.schedule?.nk ?? 0;
  }

  get key(): number[] {
    return this.schedule?.key ?? [];
  }

  get roundKey(): number[] {
    return this.schedule?.roundKey ?? [];
  }

  initKey(key: ArrayLike<number>, size: 128 | 192 | 256 | number): 0 | 1 {
    const schedule = aesInitKey(key, size);
    if (!schedule) return 0;

    this.schedule = schedule;
    return 1;
  }

  aesEncrypt(input: ArrayLike<number>, inSize: number): number[] {
    if (!this.schedule) return Array.from({ length: inSize }, () => 0);
    return aesEncrypt(input, inSize, this.schedule);
  }

  aesDecrypt(input: ArrayLike<number>, inSize: number): number[] {
    if (!this.schedule) return Array.from({ length: inSize }, () => 0);
    return aesDecrypt(input, inSize, this.schedule);
  }
}
