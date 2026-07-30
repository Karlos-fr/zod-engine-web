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
 * Port of upstream `SocketHandler::connected`.
 * Role: Holds the numeric socket connection state used by the legacy network layer.
 * Upstream: socket_handler.h:43
 */
export type SocketConnectionState = {
  connected: number;
};

/**
 * Port of upstream `SocketHandler::Disconnect` mutable fields.
 * Role: Stores connection state, endpoint text, and an opaque socket handle.
 * Upstream: socket_handler.cpp:57-77
 */
export type SocketDisconnectState<TSocket = unknown> = SocketConnectionState & {
  socket: TSocket | null;
  ipAddress: string;
};

export type SocketRecvGoodState<TSocket = unknown> = SocketDisconnectState<TSocket>;

export type SocketRecvGoodOptions<TSocket = unknown> = {
  closeSocket?: (socket: TSocket) => void;
  getLastSocketError?: () => number;
};

/**
 * Port of upstream `SocketHandler` fast-process buffer fields.
 * Role: Tracks buffered packet bytes and the consumed prefix for fast processing.
 * Upstream: socket_handler.h:35-37, socket_handler.cpp:285-300
 */
export type SocketFastProcessState = {
  buffer: Uint8Array;
  bufferSize: number;
  fastProcessPointer: number;
};

/**
 * Port of upstream `SocketHandler::Connected`.
 * Role: Returns the numeric socket connection state.
 * Upstream: socket_handler.cpp:52-55
 */
export function socketConnected(state: SocketConnectionState): number {
  return state.connected;
}

/**
 * Port of upstream `SocketHandler::Disconnect`.
 * Role: Closes an active socket connection and clears endpoint state.
 * Upstream: socket_handler.cpp:57-77
 */
export function disconnectSocket<TSocket, TState extends SocketDisconnectState<TSocket>>(
  state: TState,
  closeSocket: (socket: TSocket) => void = () => {},
): number {
  if (state.connected) {
    if (state.socket !== null) {
      closeSocket(state.socket);
    }

    state.connected = 0;
    state.ipAddress = "";
  }

  return 1;
}

/**
 * Port of upstream `SocketHandler::recv_good`.
 * Role: Classifies receive results and disconnects on closed socket notifications.
 * Upstream: socket_handler.cpp:79-98
 */
export function socketRecvGood<
  TSocket,
  TState extends SocketRecvGoodState<TSocket>,
>(
  state: TState,
  receivedAmount: number,
  options: SocketRecvGoodOptions<TSocket> = {},
): number {
  const lastSocketError = options.getLastSocketError?.();
  const isClosed =
    lastSocketError === 10054 ||
    (lastSocketError === 0 && receivedAmount === 0) ||
    (lastSocketError === undefined && receivedAmount === 0);

  if (isClosed) {
    disconnectSocket(state, options.closeSocket);
    return 0;
  }

  if (receivedAmount === -1) {
    return 0;
  }

  return 1;
}

/**
 * Port of upstream `SocketHandler::ResetFastProcess`.
 * Role: Moves unprocessed bytes to the front of the receive buffer and resets the pointer.
 * Upstream: socket_handler.cpp:285-300
 */
export function resetSocketFastProcess<TState extends SocketFastProcessState>(
  state: TState,
): TState {
  if (!state.fastProcessPointer) return state;

  const remainingSize = state.bufferSize - state.fastProcessPointer;

  if (remainingSize > 0) {
    state.buffer.copyWithin(0, state.fastProcessPointer, state.bufferSize);
  }

  state.bufferSize = remainingSize;
  state.fastProcessPointer = 0;

  return state;
}

/**
 * Port of upstream `max_wait`.
 * Role: Limits how long `pause_for_send` waits for a socket to become writable.
 * Upstream: socket_handler.cpp:394
 */
export const SOCKET_SEND_MAX_WAIT_SECONDS = 0.5;
