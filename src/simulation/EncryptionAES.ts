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
