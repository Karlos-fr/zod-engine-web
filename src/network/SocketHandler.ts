/**
 * Upstream: socket_handler.h, socket_handler.cpp
 */

/**
 * Port of upstream `_SOCKETHANDLER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: socket_handler.h:2
 */
export const SOCKET_HANDLER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_DATA_STORED`.
 * Role: Defines the internal stored receive-data capacity.
 * Upstream: socket_handler.h:20
 */
export const SOCKET_MAX_DATA_STORED_BYTES = 400000;

/**
 * Port of upstream `MAX_BUF_SIZE`.
 * Role: Defines the maximum packet buffer size for socket reads.
 * Upstream: socket_handler.h:21
 */
export const SOCKET_MAX_BUFFER_BYTES = 20000;

/**
 * Port of upstream `timeval`.
 * Role: Carries the seconds and microseconds timeout for socket readiness checks.
 * Upstream: socket_handler.cpp:349-352
 */
export type SocketTimeval = {
  tvSec: number;
  tvUsec: number;
};

/**
 * Port of upstream `timeval waitd`.
 * Role: Creates the zero-timeout value used for non-blocking socket send readiness checks.
 * Upstream: socket_handler.cpp:349-352
 */
export function createSocketSendReadinessTimeout(): SocketTimeval {
  return {
    tvSec: 0,
    tvUsec: 0,
  };
}

/**
 * Port of upstream `sockaddr_in`.
 * Role: Stores the IPv4 endpoint address for the socket handler.
 * Upstream: socket_handler.h:45
 */
export type SocketAddressIn = {
  family: "AF_INET";
  port: number;
  address: string;
};

/**
 * Port of upstream `max_wait`.
 * Role: Limits how long `pause_for_send` waits for a socket to become writable.
 * Upstream: socket_handler.cpp:394
 */
export const SOCKET_SEND_MAX_WAIT_SECONDS = 0.5;
