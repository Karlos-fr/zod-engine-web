/**
 * Ported from Zod Engine.
 * Upstream: socket_handler.h, socket_handler.cpp
 * Symbols: _SOCKETHANDLER_H_, MAX_DATA_STORED, MAX_BUF_SIZE, max_wait
 */

/**
 * Adaptation of upstream `_SOCKETHANDLER_H_`.
 * Role: Marks the TypeScript module boundary for the future `SocketHandler` port.
 * Ledger: MAC-30BB14
 * Upstream: socket_handler.h:2
 */
export const SOCKET_HANDLER_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `MAX_DATA_STORED`.
 * Role: Defines the internal stored receive-data capacity.
 * Ledger: MAC-0318EC
 * Upstream: socket_handler.h:20
 */
export const SOCKET_MAX_DATA_STORED_BYTES = 400000;

/**
 * Adaptation of upstream `MAX_BUF_SIZE`.
 * Role: Defines the maximum packet buffer size accepted by socket reads.
 * Ledger: MAC-46123B
 * Upstream: socket_handler.h:21
 */
export const SOCKET_MAX_BUFFER_BYTES = 20000;

/**
 * Port of upstream `max_wait`.
 * Role: Limits how long `pause_for_send` waits for a socket to become writable.
 * Ledger: CON-0C67B8
 * Upstream: socket_handler.cpp:394
 */
export const SOCKET_SEND_MAX_WAIT_SECONDS = 0.5;
