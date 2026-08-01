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
 * Port of upstream `if_nameindex`.
 * Role: Carries one network interface index/name entry for MAC discovery.
 * Upstream: socket_handler.cpp:446
 */
export type SocketInterfaceNameIndex = {
  index: number;
  name: string;
};

/**
 * Port of upstream `ifreq`.
 * Role: Carries one interface request used while resolving interface hardware addresses.
 * Upstream: socket_handler.cpp:445
 */
export type SocketInterfaceRequest = {
  name: string;
  hardwareAddress: Uint8Array;
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
 * Browser-side replacement for upstream `recv(..., MSG_PEEK)`.
 * Role: Reports how many bytes are currently available without consuming them.
 * Upstream: socket_handler.cpp:106, socket_handler.cpp:125
 */
export type SocketPacketPeekReceiver = (
  byteCount: number,
) => {
  receivedAmount: number;
  data: Uint8Array;
};

/**
 * Browser-side replacement for upstream `recv`.
 * Role: Receives socket bytes into a temporary buffer before appending stored data.
 * Upstream: socket_handler.cpp:180
 */
export type SocketReceiver = (
  byteCount: number,
) => {
  receivedAmount: number;
  data: Uint8Array;
};

/**
 * Port of upstream `SocketHandler::SendMessage` call target.
 * Role: Sends a packet id with an explicit byte payload and size.
 * Upstream: socket_handler.cpp:341
 */
export type SocketMessageSender = {
  sendMessage(packId: number, data: Uint8Array, size: number): number;
};

/**
 * Browser-side replacement for upstream `send`.
 * Role: Sends already-packed socket bytes and reports the written byte count.
 * Upstream: socket_handler.cpp:322, socket_handler.cpp:324
 */
export type SocketRawSender = (data: Uint8Array) => number;

/**
 * Port of upstream `SocketHandler::socket_good_to_send` result.
 * Role: Reports send readiness and whether the socket should be killed while waiting.
 * Upstream: socket_handler.cpp:398, socket_handler.cpp:408-409
 */
export type SocketSendReadinessResult = {
  goodToSend: boolean;
  killMe: boolean;
};

/**
 * Port of upstream `SocketHandler::socket_good_to_send` call target.
 * Role: Checks whether the socket can send without blocking.
 * Upstream: socket_handler.cpp:398, socket_handler.cpp:408
 */
export type SocketSendReadinessChecker = () => SocketSendReadinessResult;

/**
 * Browser-side replacement for upstream `select` writable-socket check.
 * Role: Reports non-blocking write readiness, error readiness, and select errno.
 * Upstream: socket_handler.cpp:359-368
 */
export type SocketSelectWriteResult = {
  selectStatus: number;
  writeReady: boolean;
  errorReady: boolean;
  errno?: number;
};

export type SocketSelectWriteChecker = () => SocketSelectWriteResult;

/**
 * Browser-side replacement for upstream `current_time`.
 * Role: Supplies elapsed seconds for send wait timeout checks.
 * Upstream: socket_handler.cpp:400, socket_handler.cpp:410
 */
export type SocketClock = () => number;

/**
 * Browser-side replacement for upstream `uni_pause`.
 * Role: Pauses between send readiness polls.
 * Upstream: socket_handler.cpp:404
 */
export type SocketPause = (milliseconds: number) => void;

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
 * Port of upstream `SocketHandler::Init` mutable fields.
 * Role: Stores the socket handle, endpoint, receive-buffer state, and connection flag.
 * Upstream: socket_handler.cpp:30-39
 */
export type SocketInitState<TSocket = unknown> =
  SocketDisconnectState<TSocket> &
    SocketFastProcessState & {
      socketAddress: SocketAddressIn | null;
    };

/**
 * Browser-side replacement for upstream `ioctl` / `ioctlsocket` non-blocking setup.
 * Role: Enables non-blocking mode on the socket handle during initialization.
 * Upstream: socket_handler.cpp:41-45
 */
export type SocketNonBlockingSetter<TSocket = unknown> = (
  socket: TSocket,
  enabled: boolean,
) => void;

/**
 * Port of upstream `SocketHandler::dp_temp_buf`.
 * Role: Stores a stable copy of the processed packet payload.
 * Upstream: socket_handler.h:39, socket_handler.cpp:219
 */
export type SocketProcessState = SocketFastProcessState & {
  processTempBuffer: Uint8Array;
};

/**
 * Port of upstream `SocketHandler::DoFastProcess` output pointers.
 * Role: Carries the parsed packet id, payload size, and payload view.
 * Upstream: socket_handler.cpp:262-264
 */
export type SocketFastProcessPacket = {
  size: number;
  packId: number;
  message: Uint8Array;
};

/**
 * Port of upstream `SocketHandler::DoFastProcess` result.
 * Role: Reports whether a complete buffered packet was parsed.
 * Upstream: socket_handler.cpp:254-283
 */
export type SocketFastProcessResult =
  | { available: 0; packet: null }
  | { available: 1; packet: SocketFastProcessPacket };

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
 * Port of upstream `SocketHandler::Init`.
 * Role: Initializes socket state, resets receive cursors, and enables non-blocking mode.
 * Upstream: socket_handler.cpp:26-50
 */
export function initSocketHandler<
  TSocket,
  TState extends SocketInitState<TSocket>,
>(
  state: TState,
  socket: TSocket,
  socketAddress: SocketAddressIn,
  setNonBlocking: SocketNonBlockingSetter<TSocket> = () => {},
  logConnected: (ipAddress: string) => void = () => {},
): number {
  state.socket = socket;
  state.socketAddress = socketAddress;
  state.bufferSize = 0;
  state.fastProcessPointer = 0;
  state.connected = 1;
  state.ipAddress = socketAddress.address;

  setNonBlocking(socket, true);
  logConnected(state.ipAddress);

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
 * Port of upstream `SocketHandler::PacketAvailable`.
 * Role: Peeks packet size, rejects invalid packets, and reports complete packet availability.
 * Upstream: socket_handler.cpp:100-130
 */
export function socketPacketAvailable<
  TSocket,
  TState extends SocketRecvGoodState<TSocket>,
>(
  state: TState,
  peek: SocketPacketPeekReceiver,
  options: SocketRecvGoodOptions<TSocket> = {},
): number {
  const headerPeek = peek(Int32Array.BYTES_PER_ELEMENT);

  if (!socketRecvGood(state, headerPeek.receivedAmount, options)) return 0;
  if (headerPeek.receivedAmount !== Int32Array.BYTES_PER_ELEMENT) return 0;
  if (headerPeek.data.byteLength < Int32Array.BYTES_PER_ELEMENT) return 0;

  const dataView = new DataView(
    headerPeek.data.buffer,
    headerPeek.data.byteOffset,
    headerPeek.data.byteLength,
  );
  const packetSize = dataView.getInt32(0, true) + 8;

  if (packetSize < 8 || packetSize > SOCKET_MAX_BUFFER_BYTES) {
    disconnectSocket(state, options.closeSocket);
    return 0;
  }

  return peek(packetSize).receivedAmount === packetSize ? 1 : 0;
}

/**
 * Port of upstream `SocketHandler::GetPacket`.
 * Role: Reads one whole packet directly from the socket and exposes its parsed payload.
 * Upstream: socket_handler.cpp:132-173
 */
export function socketGetPacket<
  TSocket,
  TState extends SocketProcessState & SocketRecvGoodState<TSocket>,
>(
  state: TState,
  peek: SocketPacketPeekReceiver,
  receive: SocketReceiver,
  options: SocketRecvGoodOptions<TSocket> = {},
): SocketFastProcessResult {
  const headerPeek = peek(Int32Array.BYTES_PER_ELEMENT);

  if (!socketRecvGood(state, headerPeek.receivedAmount, options)) {
    return { available: 0, packet: null };
  }
  if (headerPeek.receivedAmount !== Int32Array.BYTES_PER_ELEMENT) {
    return { available: 0, packet: null };
  }
  if (headerPeek.data.byteLength < Int32Array.BYTES_PER_ELEMENT) {
    return { available: 0, packet: null };
  }

  const headerView = new DataView(
    headerPeek.data.buffer,
    headerPeek.data.byteOffset,
    headerPeek.data.byteLength,
  );
  const packetSize = headerView.getInt32(0, true) + 8;

  if (packetSize < 8 || packetSize > SOCKET_MAX_BUFFER_BYTES) {
    disconnectSocket(state, options.closeSocket);
    return { available: 0, packet: null };
  }

  const packetRead = receive(packetSize);

  if (!socketRecvGood(state, packetRead.receivedAmount, options)) {
    return { available: 0, packet: null };
  }
  if (packetRead.receivedAmount !== packetSize) {
    return { available: 0, packet: null };
  }
  if (packetRead.data.byteLength < packetSize) {
    return { available: 0, packet: null };
  }

  state.processTempBuffer.set(packetRead.data.subarray(0, packetSize), 0);
  const packetView = new DataView(
    state.processTempBuffer.buffer,
    state.processTempBuffer.byteOffset,
    packetSize,
  );
  const size = packetView.getInt32(0, true);
  const packId = packetView.getInt32(Int32Array.BYTES_PER_ELEMENT, true);

  if (size < 0) {
    return { available: 0, packet: null };
  }

  return {
    available: 1,
    packet: {
      size,
      packId,
      message: state.processTempBuffer.subarray(
        Int32Array.BYTES_PER_ELEMENT * 2,
        Int32Array.BYTES_PER_ELEMENT * 2 + size,
      ),
    },
  };
}

/**
 * Port of upstream `SocketHandler::DoFastProcess`.
 * Role: Parses one complete packet from the buffered receive data and advances the read cursor.
 * Upstream: socket_handler.cpp:254-283
 */
export function doSocketFastProcess<
  TState extends SocketFastProcessState,
>(state: TState): SocketFastProcessResult {
  const bufferedSize = state.bufferSize - state.fastProcessPointer;
  if (bufferedSize < Int32Array.BYTES_PER_ELEMENT * 2) {
    return { available: 0, packet: null };
  }

  const dataView = new DataView(
    state.buffer.buffer,
    state.buffer.byteOffset + state.fastProcessPointer,
    bufferedSize,
  );
  const size = dataView.getInt32(0, true);
  const packId = dataView.getInt32(Int32Array.BYTES_PER_ELEMENT, true);
  const packetSize = size + Int32Array.BYTES_PER_ELEMENT * 2;

  if (size < 0) {
    state.bufferSize = 0;
    return { available: 0, packet: null };
  }

  if (packetSize > bufferedSize) {
    return { available: 0, packet: null };
  }

  const messageStart = state.fastProcessPointer + Int32Array.BYTES_PER_ELEMENT * 2;
  const message = state.buffer.subarray(messageStart, messageStart + size);
  state.fastProcessPointer += packetSize;

  return {
    available: 1,
    packet: {
      size,
      packId,
      message,
    },
  };
}

/**
 * Port of upstream `SocketHandler::DoRecv`.
 * Role: Receives socket bytes, validates receive status, and appends them to the stored buffer.
 * Upstream: socket_handler.cpp:175-214
 */
export function doSocketRecv<
  TSocket,
  TState extends SocketFastProcessState & SocketRecvGoodState<TSocket>,
>(
  state: TState,
  receive: SocketReceiver,
  options: SocketRecvGoodOptions<TSocket> = {},
): number {
  const received = receive(SOCKET_MAX_BUFFER_BYTES);

  if (!socketRecvGood(state, received.receivedAmount, options)) return 0;

  if (received.receivedAmount + state.bufferSize > SOCKET_MAX_DATA_STORED_BYTES) {
    state.bufferSize = 0;
    return 0;
  }

  state.buffer.set(
    received.data.subarray(0, received.receivedAmount),
    state.bufferSize,
  );
  state.bufferSize += received.receivedAmount;

  return 1;
}

/**
 * Port of upstream `SocketHandler::DoProcess`.
 * Role: Parses one packet from the stored buffer, copies its payload, and compacts remaining bytes.
 * Upstream: socket_handler.cpp:216-252
 */
export function doSocketProcess<
  TState extends SocketProcessState,
>(state: TState): SocketFastProcessResult {
  if (state.bufferSize < Int32Array.BYTES_PER_ELEMENT * 2) {
    return { available: 0, packet: null };
  }

  const dataView = new DataView(
    state.buffer.buffer,
    state.buffer.byteOffset,
    state.bufferSize,
  );
  const size = dataView.getInt32(0, true);
  const packId = dataView.getInt32(Int32Array.BYTES_PER_ELEMENT, true);
  const packetSize = size + Int32Array.BYTES_PER_ELEMENT * 2;

  if (size < 0) {
    state.bufferSize = 0;
    return { available: 0, packet: null };
  }

  if (packetSize > state.bufferSize) {
    return { available: 0, packet: null };
  }

  const messageStart = Int32Array.BYTES_PER_ELEMENT * 2;
  state.processTempBuffer.set(
    state.buffer.subarray(messageStart, messageStart + size),
    0,
  );
  const message = state.processTempBuffer.subarray(0, size);

  if (packetSize < state.bufferSize) {
    state.buffer.copyWithin(0, packetSize, state.bufferSize);
  }
  state.bufferSize -= packetSize;

  return {
    available: 1,
    packet: {
      size,
      packId,
      message,
    },
  };
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
 * Port of upstream `SocketHandler::SendMessage`.
 * Role: Packs payload size, packet id, and payload bytes, then disconnects on send failure.
 * Upstream: socket_handler.cpp:302-337
 */
export function socketSendMessage<
  TSocket,
  TState extends SocketDisconnectState<TSocket>,
>(
  state: TState,
  sendRaw: SocketRawSender,
  packId: number,
  data: Uint8Array,
  size: number,
  options: SocketRecvGoodOptions<TSocket> = {},
): number {
  const packet = new Uint8Array(size + Int32Array.BYTES_PER_ELEMENT * 2);
  const dataView = new DataView(packet.buffer);
  dataView.setInt32(0, size, true);
  dataView.setInt32(Int32Array.BYTES_PER_ELEMENT, packId, true);

  if (size) {
    packet.set(data.subarray(0, size), Int32Array.BYTES_PER_ELEMENT * 2);
  }

  if (sendRaw(packet) <= 0) {
    disconnectSocket(state, options.closeSocket);
    return 0;
  }

  return 1;
}

/**
 * Port of upstream `SocketHandler::SendMessageAscii`.
 * Role: Sends an ASCII C-string payload including its terminating NUL byte.
 * Upstream: socket_handler.cpp:339-342
 */
export function socketSendMessageAscii(
  socket: SocketMessageSender,
  packId: number,
  data: string,
): number {
  const stringLength = data.indexOf("\0");
  const payloadSize = (stringLength === -1 ? data.length : stringLength) + 1;
  const payload = new Uint8Array(payloadSize);

  for (let i = 0; i < payloadSize - 1; i += 1) {
    payload[i] = data.charCodeAt(i) & 0xff;
  }

  return socket.sendMessage(packId, payload, payloadSize);
}

/**
 * Port of upstream `max_wait`.
 * Role: Limits how long `pause_for_send` waits for a socket to become writable.
 * Upstream: socket_handler.cpp:394
 */
export const SOCKET_SEND_MAX_WAIT_SECONDS = 0.5;

/**
 * Port of upstream `SocketHandler::socket_good_to_send`.
 * Role: Checks write readiness and requests socket shutdown on a bad file descriptor.
 * Upstream: socket_handler.cpp:344-390
 */
export function socketGoodToSend(
  selectWrite: SocketSelectWriteChecker,
): SocketSendReadinessResult {
  const readiness = selectWrite();

  if (readiness.selectStatus < 0) {
    return {
      goodToSend: false,
      killMe: readiness.errno === 9,
    };
  }

  if (readiness.errorReady) {
    return {
      goodToSend: false,
      killMe: false,
    };
  }

  return {
    goodToSend: readiness.writeReady,
    killMe: false,
  };
}

/**
 * Port of upstream `SocketHandler::pause_for_send`.
 * Role: Waits briefly for socket send readiness, aborting on timeout or kill signal.
 * Upstream: socket_handler.cpp:392-413
 */
export function pauseSocketForSend(
  socketGoodToSend: SocketSendReadinessChecker,
  currentTime: SocketClock,
  pause: SocketPause,
  logPause: () => void = () => {},
): number {
  let sendReadiness = socketGoodToSend();
  if (sendReadiness.goodToSend) return 1;

  const startTime = currentTime();

  do {
    pause(10);
    logPause();

    sendReadiness = socketGoodToSend();
    if (sendReadiness.goodToSend) return 1;
    if (sendReadiness.killMe) return 0;
  } while (currentTime() - startTime < SOCKET_SEND_MAX_WAIT_SECONDS);

  return 0;
}
