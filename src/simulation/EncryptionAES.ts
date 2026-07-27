/**
 * Ported from Zod Engine.
 * Upstream: zencrypt_aes.h / zencrypt_aes.cpp
 * Symbols: _AES_ENCRYPT_H_, Nb
 */

/**
 * Adaptation of upstream `_AES_ENCRYPT_H_`.
 * Role: Marks the TypeScript module boundary for upstream `zencrypt_aes.h`.
 * Ledger: MAC-8E4254
 * Upstream: zencrypt_aes.h:7
 */
export const AES_ENCRYPT_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `Nb`.
 * Role: Defines the AES state width in 32-bit columns.
 * Ledger: MAC-CE6227
 * Upstream: zencrypt_aes.cpp:7
 */
export const AES_STATE_COLUMNS = 4;
