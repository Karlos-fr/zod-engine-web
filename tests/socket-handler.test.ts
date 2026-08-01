import { describe, expect, it } from "vitest";
import {
  createSocketSendReadinessTimeout,
  SOCKET_HANDLER_HEADER_GUARD_PORTED,
  SOCKET_MAX_BUFFER_BYTES,
  SOCKET_MAX_DATA_STORED_BYTES,
  SOCKET_SEND_MAX_WAIT_SECONDS,
  doSocketFastProcess,
  doSocketProcess,
  doSocketRecv,
  disconnectSocket,
  initSocketHandler,
  pauseSocketForSend,
  resetSocketFastProcess,
  socketGetPacket,
  socketGoodToSend,
  socketSendMessageAscii,
  socketPacketAvailable,
  socketRecvGood,
  socketSendMessage,
  socketConnected,
} from "../src/network/SocketHandler";
import type {
  SocketAddressIn,
  SocketDisconnectState,
  SocketFastProcessState,
  SocketInterfaceNameIndex,
  SocketInterfaceRequest,
  SocketInitState,
  SocketProcessState,
} from "../src/network/SocketHandler";

describe("socket handler", () => {
  it("adapts the socket_handler.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/network/SocketHandler");
    const secondImport = await import("../src/network/SocketHandler");

    expect(SOCKET_HANDLER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.SOCKET_HANDLER_HEADER_GUARD_PORTED).toBe(
      firstImport.SOCKET_HANDLER_HEADER_GUARD_PORTED,
    );
  });

  it("ports socket storage and packet buffer sizes", () => {
    expect(SOCKET_MAX_DATA_STORED_BYTES).toBe(400000);
    expect(SOCKET_MAX_BUFFER_BYTES).toBe(20000);
  });

  it("ports max_wait as the send wait timeout", () => {
    expect(SOCKET_SEND_MAX_WAIT_SECONDS).toBe(0.5);
  });

  it("ports the zero timeval used by send readiness checks", () => {
    expect(createSocketSendReadinessTimeout()).toEqual({
      tvSec: 0,
      tvUsec: 0,
    });
  });

  it("ports SocketHandler socket_good_to_send as write readiness", () => {
    expect(
      socketGoodToSend(() => ({
        selectStatus: 1,
        writeReady: true,
        errorReady: false,
      })),
    ).toEqual({
      goodToSend: true,
      killMe: false,
    });
  });

  it("ports SocketHandler socket_good_to_send as not ready when write flag is absent", () => {
    expect(
      socketGoodToSend(() => ({
        selectStatus: 0,
        writeReady: false,
        errorReady: false,
      })),
    ).toEqual({
      goodToSend: false,
      killMe: false,
    });
  });

  it("ports SocketHandler socket_good_to_send as not ready when error flag is set", () => {
    expect(
      socketGoodToSend(() => ({
        selectStatus: 1,
        writeReady: true,
        errorReady: true,
      })),
    ).toEqual({
      goodToSend: false,
      killMe: false,
    });
  });

  it("ports SocketHandler socket_good_to_send as kill signal for bad descriptor", () => {
    expect(
      socketGoodToSend(() => ({
        selectStatus: -1,
        writeReady: false,
        errorReady: false,
        errno: 9,
      })),
    ).toEqual({
      goodToSend: false,
      killMe: true,
    });
  });

  it("ports SocketHandler socket_good_to_send as non-killing select failure", () => {
    expect(
      socketGoodToSend(() => ({
        selectStatus: -1,
        writeReady: false,
        errorReady: false,
        errno: 11,
      })),
    ).toEqual({
      goodToSend: false,
      killMe: false,
    });
  });

  it("ports SocketHandler pause_for_send as immediate send readiness", () => {
    let checks = 0;
    const result = pauseSocketForSend(
      () => {
        checks += 1;
        return { goodToSend: true, killMe: false };
      },
      () => {
        throw new Error("currentTime should not be called");
      },
      () => {
        throw new Error("pause should not be called");
      },
    );

    expect(result).toBe(1);
    expect(checks).toBe(1);
  });

  it("ports SocketHandler pause_for_send as readiness after one pause", () => {
    const checks = [
      { goodToSend: false, killMe: false },
      { goodToSend: true, killMe: false },
    ];
    const pauses: number[] = [];
    let logs = 0;

    const result = pauseSocketForSend(
      () => checks.shift() ?? { goodToSend: false, killMe: false },
      () => 12,
      (milliseconds) => pauses.push(milliseconds),
      () => {
        logs += 1;
      },
    );

    expect(result).toBe(1);
    expect(pauses).toEqual([10]);
    expect(logs).toBe(1);
  });

  it("ports SocketHandler pause_for_send as kill signal during wait", () => {
    const checks = [
      { goodToSend: false, killMe: false },
      { goodToSend: false, killMe: true },
    ];

    const result = pauseSocketForSend(
      () => checks.shift() ?? { goodToSend: false, killMe: false },
      () => 20,
      () => undefined,
    );

    expect(result).toBe(0);
  });

  it("ports SocketHandler pause_for_send as timeout after max wait", () => {
    const times = [30, 30.2, 30.51];
    const pauses: number[] = [];

    const result = pauseSocketForSend(
      () => ({ goodToSend: false, killMe: false }),
      () => times.shift() ?? 30.51,
      (milliseconds) => pauses.push(milliseconds),
    );

    expect(result).toBe(0);
    expect(pauses).toEqual([10, 10]);
  });

  it("ports the IPv4 socket endpoint shape", () => {
    const endpoint: SocketAddressIn = {
      family: "AF_INET",
      port: 3000,
      address: "127.0.0.1",
    };

    expect(endpoint).toMatchObject({
      family: "AF_INET",
      port: expect.any(Number),
      address: expect.any(String),
    });
  });

  it("ports if_nameindex as a network interface index/name entry", () => {
    const interfaceEntry: SocketInterfaceNameIndex = {
      index: 2,
      name: "eth0",
    };

    expect(interfaceEntry).toEqual({
      index: 2,
      name: "eth0",
    });
  });

  it("ports ifreq as a network interface hardware-address request", () => {
    const interfaceRequest: SocketInterfaceRequest = {
      name: "eth0",
      hardwareAddress: new Uint8Array([0, 17, 34, 51, 68, 85]),
    };

    expect(interfaceRequest.name).toBe("eth0");
    expect(Array.from(interfaceRequest.hardwareAddress)).toEqual([
      0,
      17,
      34,
      51,
      68,
      85,
    ]);
  });

  it("ports SocketHandler Init as socket state initialization", () => {
    const socket = { fd: 29 };
    const endpoint: SocketAddressIn = {
      family: "AF_INET",
      port: 3001,
      address: "192.0.2.29",
    };
    const nonBlockingCalls: Array<{
      socket: typeof socket;
      enabled: boolean;
    }> = [];
    const logs: string[] = [];
    const state: SocketInitState<typeof socket> = {
      connected: 0,
      socket: null,
      socketAddress: null,
      ipAddress: "",
      buffer: new Uint8Array([1, 2, 3, 4]),
      bufferSize: 4,
      fastProcessPointer: 2,
    };

    const result = initSocketHandler(
      state,
      socket,
      endpoint,
      (targetSocket, enabled) => nonBlockingCalls.push({ socket: targetSocket, enabled }),
      (ipAddress) => logs.push(`socket connected:${ipAddress}`),
    );

    expect(result).toBe(1);
    expect(state.socket).toBe(socket);
    expect(state.socketAddress).toBe(endpoint);
    expect(state.connected).toBe(1);
    expect(state.ipAddress).toBe("192.0.2.29");
    expect(state.bufferSize).toBe(0);
    expect(state.fastProcessPointer).toBe(0);
    expect(nonBlockingCalls).toEqual([{ socket, enabled: true }]);
    expect(logs).toEqual(["socket connected:192.0.2.29"]);
  });

  it("ports SocketHandler Connected as numeric connection-state read", () => {
    expect(socketConnected({ connected: 0 })).toBe(0);
    expect(socketConnected({ connected: 1 })).toBe(1);
  });

  it("ports SocketHandler Disconnect as close and state cleanup when connected", () => {
    const socket = { fd: 12 };
    const closed: Array<typeof socket> = [];
    const state: SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.10",
    };

    const result = disconnectSocket<typeof socket, SocketDisconnectState<typeof socket>>(state, (closedSocket) => {
      closed.push(closedSocket);
    });

    expect(result).toBe(1);
    expect(closed).toEqual([socket]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
  });

  it("ports SocketHandler Disconnect as no-op close when already disconnected", () => {
    const socket = { fd: 12 };
    const closed: Array<typeof socket> = [];
    const state: SocketDisconnectState<typeof socket> = {
      connected: 0,
      socket,
      ipAddress: "192.0.2.10",
    };

    const result = disconnectSocket<typeof socket, SocketDisconnectState<typeof socket>>(state, (closedSocket) => {
      closed.push(closedSocket);
    });

    expect(result).toBe(1);
    expect(closed).toEqual([]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("192.0.2.10");
  });

  it("ports SocketHandler recv_good as disconnect on a closed POSIX receive", () => {
    const socket = { fd: 12 };
    const closed: Array<typeof socket> = [];
    const state: SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.10",
    };

    const result = socketRecvGood<typeof socket, SocketDisconnectState<typeof socket>>(
      state,
      0,
      {
        closeSocket: (closedSocket) => closed.push(closedSocket),
      },
    );

    expect(result).toBe(0);
    expect(closed).toEqual([socket]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
  });

  it("ports SocketHandler recv_good as disconnect on Winsock connection reset", () => {
    const socket = { fd: 13 };
    const state: SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.11",
    };

    const result = socketRecvGood(state, -1, {
      getLastSocketError: () => 10054,
    });

    expect(result).toBe(0);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
  });

  it("ports SocketHandler recv_good as no packet yet for -1 receive results", () => {
    const state: SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.12",
    };

    expect(socketRecvGood(state, -1)).toBe(0);
    expect(state.connected).toBe(1);
    expect(state.ipAddress).toBe("192.0.2.12");
  });

  it("ports SocketHandler recv_good as true for positive receive results", () => {
    const state: SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.13",
    };

    expect(socketRecvGood(state, 12)).toBe(1);
    expect(state.connected).toBe(1);
    expect(state.ipAddress).toBe("192.0.2.13");
  });

  it("ports SocketHandler PacketAvailable as unavailable when size header is partial", () => {
    const state: SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.14",
    };
    const peekSizes: number[] = [];

    const result = socketPacketAvailable(state, (byteCount) => {
      peekSizes.push(byteCount);
      return {
        receivedAmount: 2,
        data: new Uint8Array([12, 0]),
      };
    });

    expect(result).toBe(0);
    expect(peekSizes).toEqual([4]);
    expect(state.connected).toBe(1);
  });

  it("ports SocketHandler PacketAvailable through recv_good close handling", () => {
    const socket = { fd: 15 };
    const closed: Array<typeof socket> = [];
    const state: SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.15",
    };

    const result = socketPacketAvailable(
      state,
      () => ({
        receivedAmount: 0,
        data: new Uint8Array(),
      }),
      { closeSocket: (closedSocket: typeof socket) => closed.push(closedSocket) },
    );

    expect(result).toBe(0);
    expect(closed).toEqual([socket]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
  });

  it("ports SocketHandler PacketAvailable as disconnect on invalid packet size", () => {
    const socket = { fd: 16 };
    const closed: Array<typeof socket> = [];
    const state: SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.16",
    };
    const header = new Uint8Array(4);
    new DataView(header.buffer).setInt32(0, SOCKET_MAX_BUFFER_BYTES, true);

    const result = socketPacketAvailable(
      state,
      () => ({
        receivedAmount: 4,
        data: header,
      }),
      { closeSocket: (closedSocket: typeof socket) => closed.push(closedSocket) },
    );

    expect(result).toBe(0);
    expect(closed).toEqual([socket]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
  });

  it("ports SocketHandler PacketAvailable as full packet availability check", () => {
    const state: SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.17",
    };
    const header = new Uint8Array(4);
    new DataView(header.buffer).setInt32(0, 12, true);
    const peekSizes: number[] = [];
    const receivedAmounts = [4, 20];

    const result = socketPacketAvailable(state, (byteCount) => {
      peekSizes.push(byteCount);
      return {
        receivedAmount: receivedAmounts.shift() ?? 0,
        data: header,
      };
    });

    expect(result).toBe(1);
    expect(peekSizes).toEqual([4, 20]);
    expect(state.connected).toBe(1);
  });

  it("ports SocketHandler GetPacket as unavailable when size header is partial", () => {
    const state: SocketProcessState & SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.25",
      buffer: new Uint8Array(16),
      bufferSize: 0,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(32),
    };
    let receives = 0;

    const result = socketGetPacket(
      state,
      () => ({
        receivedAmount: 2,
        data: new Uint8Array([4, 0]),
      }),
      () => {
        receives += 1;
        return { receivedAmount: 0, data: new Uint8Array() };
      },
    );

    expect(result).toEqual({ available: 0, packet: null });
    expect(receives).toBe(0);
    expect(state.connected).toBe(1);
  });

  it("ports SocketHandler GetPacket as disconnect on invalid packet size", () => {
    const socket = { fd: 26 };
    const closed: Array<typeof socket> = [];
    const state: SocketProcessState & SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.26",
      buffer: new Uint8Array(16),
      bufferSize: 0,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(32),
    };
    const header = new Uint8Array(4);
    new DataView(header.buffer).setInt32(0, SOCKET_MAX_BUFFER_BYTES, true);

    const result = socketGetPacket(
      state,
      () => ({
        receivedAmount: 4,
        data: header,
      }),
      () => ({ receivedAmount: 0, data: new Uint8Array() }),
      { closeSocket: (closedSocket: typeof socket) => closed.push(closedSocket) },
    );

    expect(result).toEqual({ available: 0, packet: null });
    expect(closed).toEqual([socket]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
  });

  it("ports SocketHandler GetPacket as unavailable on short full-packet read", () => {
    const state: SocketProcessState & SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.27",
      buffer: new Uint8Array(16),
      bufferSize: 0,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(32),
    };
    const header = new Uint8Array(4);
    new DataView(header.buffer).setInt32(0, 4, true);

    const result = socketGetPacket(
      state,
      () => ({
        receivedAmount: 4,
        data: header,
      }),
      () => ({
        receivedAmount: 8,
        data: new Uint8Array([4, 0, 0, 0, 83, 0, 0, 0]),
      }),
    );

    expect(result).toEqual({ available: 0, packet: null });
    expect(state.connected).toBe(1);
  });

  it("ports SocketHandler GetPacket as direct whole-packet receive", () => {
    const state: SocketProcessState & SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.28",
      buffer: new Uint8Array(16),
      bufferSize: 0,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(32),
    };
    const header = new Uint8Array(4);
    new DataView(header.buffer).setInt32(0, 4, true);
    const receiveSizes: number[] = [];

    const result = socketGetPacket(
      state,
      () => ({
        receivedAmount: 4,
        data: header,
      }),
      (byteCount) => {
        receiveSizes.push(byteCount);
        return {
          receivedAmount: 12,
          data: new Uint8Array([4, 0, 0, 0, 84, 0, 0, 0, 10, 20, 30, 40]),
        };
      },
    );

    expect(result.available).toBe(1);
    expect(result.packet).toEqual({
      size: 4,
      packId: 84,
      message: new Uint8Array([10, 20, 30, 40]),
    });
    expect(receiveSizes).toEqual([12]);
    expect(Array.from(state.processTempBuffer.slice(0, 12))).toEqual([
      4,
      0,
      0,
      0,
      84,
      0,
      0,
      0,
      10,
      20,
      30,
      40,
    ]);
  });

  it("ports SocketHandler DoFastProcess as unavailable before packet header", () => {
    const state: SocketFastProcessState = {
      buffer: new Uint8Array([1, 2, 3, 4, 5, 6, 7]),
      bufferSize: 7,
      fastProcessPointer: 0,
    };

    expect(doSocketFastProcess(state)).toEqual({
      available: 0,
      packet: null,
    });
    expect(state.fastProcessPointer).toBe(0);
    expect(state.bufferSize).toBe(7);
  });

  it("ports SocketHandler DoFastProcess as unavailable for a partial packet", () => {
    const buffer = new Uint8Array(12);
    const dataView = new DataView(buffer.buffer);
    dataView.setInt32(0, 8, true);
    dataView.setInt32(4, 44, true);
    const state: SocketFastProcessState = {
      buffer,
      bufferSize: 12,
      fastProcessPointer: 0,
    };

    expect(doSocketFastProcess(state)).toEqual({
      available: 0,
      packet: null,
    });
    expect(state.fastProcessPointer).toBe(0);
    expect(state.bufferSize).toBe(12);
  });

  it("ports SocketHandler DoFastProcess as buffer clear on negative size", () => {
    const buffer = new Uint8Array(8);
    const dataView = new DataView(buffer.buffer);
    dataView.setInt32(0, -1, true);
    dataView.setInt32(4, 45, true);
    const state: SocketFastProcessState = {
      buffer,
      bufferSize: 8,
      fastProcessPointer: 0,
    };

    expect(doSocketFastProcess(state)).toEqual({
      available: 0,
      packet: null,
    });
    expect(state.fastProcessPointer).toBe(0);
    expect(state.bufferSize).toBe(0);
  });

  it("ports SocketHandler DoFastProcess as packet parse and cursor advance", () => {
    const buffer = new Uint8Array([
      99,
      99,
      4,
      0,
      0,
      0,
      46,
      0,
      0,
      0,
      10,
      20,
      30,
      40,
      77,
    ]);
    const state: SocketFastProcessState = {
      buffer,
      bufferSize: 15,
      fastProcessPointer: 2,
    };

    const result = doSocketFastProcess(state);

    expect(result.available).toBe(1);
    expect(result.packet).toEqual({
      size: 4,
      packId: 46,
      message: new Uint8Array([10, 20, 30, 40]),
    });
    expect(state.fastProcessPointer).toBe(14);
    expect(state.bufferSize).toBe(15);
  });

  it("ports SocketHandler DoRecv as receive append into stored buffer", () => {
    const state: SocketFastProcessState & SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.21",
      buffer: new Uint8Array(SOCKET_MAX_DATA_STORED_BYTES),
      bufferSize: 2,
      fastProcessPointer: 0,
    };
    state.buffer.set([90, 91], 0);
    const receiveSizes: number[] = [];

    const result = doSocketRecv(state, (byteCount) => {
      receiveSizes.push(byteCount);
      return {
        receivedAmount: 3,
        data: new Uint8Array([10, 20, 30, 40]),
      };
    });

    expect(result).toBe(1);
    expect(receiveSizes).toEqual([SOCKET_MAX_BUFFER_BYTES]);
    expect(state.bufferSize).toBe(5);
    expect(Array.from(state.buffer.slice(0, 5))).toEqual([90, 91, 10, 20, 30]);
  });

  it("ports SocketHandler DoRecv through recv_good close handling", () => {
    const socket = { fd: 22 };
    const closed: Array<typeof socket> = [];
    const state: SocketFastProcessState & SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.22",
      buffer: new Uint8Array(SOCKET_MAX_DATA_STORED_BYTES),
      bufferSize: 2,
      fastProcessPointer: 0,
    };

    const result = doSocketRecv(
      state,
      () => ({
        receivedAmount: 0,
        data: new Uint8Array(),
      }),
      { closeSocket: (closedSocket: typeof socket) => closed.push(closedSocket) },
    );

    expect(result).toBe(0);
    expect(closed).toEqual([socket]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
    expect(state.bufferSize).toBe(2);
  });

  it("ports SocketHandler DoRecv as no append when no packet is ready", () => {
    const state: SocketFastProcessState & SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.23",
      buffer: new Uint8Array(SOCKET_MAX_DATA_STORED_BYTES),
      bufferSize: 1,
      fastProcessPointer: 0,
    };
    state.buffer[0] = 99;

    const result = doSocketRecv(state, () => ({
      receivedAmount: -1,
      data: new Uint8Array([10, 20]),
    }));

    expect(result).toBe(0);
    expect(state.connected).toBe(1);
    expect(state.bufferSize).toBe(1);
    expect(state.buffer[0]).toBe(99);
  });

  it("ports SocketHandler DoRecv as stored buffer clear on oversize", () => {
    const state: SocketFastProcessState & SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.24",
      buffer: new Uint8Array(SOCKET_MAX_DATA_STORED_BYTES),
      bufferSize: SOCKET_MAX_DATA_STORED_BYTES - 1,
      fastProcessPointer: 0,
    };

    const result = doSocketRecv(state, () => ({
      receivedAmount: 2,
      data: new Uint8Array([10, 20]),
    }));

    expect(result).toBe(0);
    expect(state.connected).toBe(1);
    expect(state.bufferSize).toBe(0);
  });

  it("ports SocketHandler DoProcess as unavailable before packet header", () => {
    const state: SocketProcessState = {
      buffer: new Uint8Array([1, 2, 3, 4, 5, 6, 7]),
      bufferSize: 7,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(16),
    };

    expect(doSocketProcess(state)).toEqual({
      available: 0,
      packet: null,
    });
    expect(state.bufferSize).toBe(7);
  });

  it("ports SocketHandler DoProcess as unavailable for a partial packet", () => {
    const buffer = new Uint8Array(12);
    const dataView = new DataView(buffer.buffer);
    dataView.setInt32(0, 8, true);
    dataView.setInt32(4, 80, true);
    const state: SocketProcessState = {
      buffer,
      bufferSize: 12,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(16),
    };

    expect(doSocketProcess(state)).toEqual({
      available: 0,
      packet: null,
    });
    expect(state.bufferSize).toBe(12);
  });

  it("ports SocketHandler DoProcess as buffer clear on negative size", () => {
    const buffer = new Uint8Array(8);
    const dataView = new DataView(buffer.buffer);
    dataView.setInt32(0, -1, true);
    dataView.setInt32(4, 81, true);
    const state: SocketProcessState = {
      buffer,
      bufferSize: 8,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(16),
    };

    expect(doSocketProcess(state)).toEqual({
      available: 0,
      packet: null,
    });
    expect(state.bufferSize).toBe(0);
  });

  it("ports SocketHandler DoProcess as payload copy and remaining-buffer compaction", () => {
    const buffer = new Uint8Array([
      4,
      0,
      0,
      0,
      82,
      0,
      0,
      0,
      10,
      20,
      30,
      40,
      99,
      100,
    ]);
    const state: SocketProcessState = {
      buffer,
      bufferSize: 14,
      fastProcessPointer: 0,
      processTempBuffer: new Uint8Array(16),
    };

    const result = doSocketProcess(state);

    expect(result.available).toBe(1);
    expect(result.packet).toEqual({
      size: 4,
      packId: 82,
      message: new Uint8Array([10, 20, 30, 40]),
    });
    expect(Array.from(state.processTempBuffer.slice(0, 4))).toEqual([
      10,
      20,
      30,
      40,
    ]);
    expect(state.bufferSize).toBe(2);
    expect(Array.from(state.buffer.slice(0, 2))).toEqual([99, 100]);
  });

  it("ports ResetFastProcess as no-op when the fast-process pointer is zero", () => {
    const state: SocketFastProcessState = {
      buffer: new Uint8Array([1, 2, 3, 4]),
      bufferSize: 4,
      fastProcessPointer: 0,
    };

    expect(resetSocketFastProcess(state)).toBe(state);
    expect(Array.from(state.buffer)).toEqual([1, 2, 3, 4]);
    expect(state.bufferSize).toBe(4);
    expect(state.fastProcessPointer).toBe(0);
  });

  it("ports ResetFastProcess by moving remaining bytes to the buffer front", () => {
    const state: SocketFastProcessState = {
      buffer: new Uint8Array([10, 20, 30, 40, 50, 60]),
      bufferSize: 5,
      fastProcessPointer: 2,
    };

    resetSocketFastProcess(state);

    expect(Array.from(state.buffer.slice(0, 3))).toEqual([30, 40, 50]);
    expect(state.bufferSize).toBe(3);
    expect(state.fastProcessPointer).toBe(0);
  });

  it("ports ResetFastProcess by clearing size when all buffered bytes were consumed", () => {
    const state: SocketFastProcessState = {
      buffer: new Uint8Array([10, 20, 30, 40]),
      bufferSize: 3,
      fastProcessPointer: 3,
    };

    resetSocketFastProcess(state);

    expect(state.bufferSize).toBe(0);
    expect(state.fastProcessPointer).toBe(0);
  });

  it("ports SocketHandler SendMessageAscii as NUL-terminated send delegation", () => {
    const calls: Array<{ packId: number; data: number[]; size: number }> = [];
    const result = socketSendMessageAscii(
      {
        sendMessage: (packId, data, size) => {
          calls.push({ packId, data: Array.from(data), size });
          return 17;
        },
      },
      9,
      "hi",
    );

    expect(result).toBe(17);
    expect(calls).toEqual([{ packId: 9, data: [104, 105, 0], size: 3 }]);
  });

  it("ports SocketHandler SendMessageAscii strlen behavior for embedded NUL", () => {
    const calls: Array<{ data: number[]; size: number }> = [];

    socketSendMessageAscii(
      {
        sendMessage: (_packId, data, size) => {
          calls.push({ data: Array.from(data), size });
          return 1;
        },
      },
      4,
      "ok\0ignored",
    );

    expect(calls).toEqual([{ data: [111, 107, 0], size: 3 }]);
  });

  it("ports SocketHandler SendMessage as size and packet-id packing without payload", () => {
    const sentPackets: number[][] = [];
    const state: SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.18",
    };

    const result = socketSendMessage(
      state,
      (packet) => {
        sentPackets.push(Array.from(packet));
        return packet.length;
      },
      70,
      new Uint8Array(),
      0,
    );

    expect(result).toBe(1);
    expect(sentPackets).toEqual([[0, 0, 0, 0, 70, 0, 0, 0]]);
    expect(state.connected).toBe(1);
  });

  it("ports SocketHandler SendMessage as binary payload packing", () => {
    const sentPackets: number[][] = [];
    const state: SocketDisconnectState<null> = {
      connected: 1,
      socket: null,
      ipAddress: "192.0.2.19",
    };

    const result = socketSendMessage(
      state,
      (packet) => {
        sentPackets.push(Array.from(packet));
        return packet.length;
      },
      71,
      new Uint8Array([10, 20, 30, 40]),
      3,
    );

    expect(result).toBe(1);
    expect(sentPackets).toEqual([[3, 0, 0, 0, 71, 0, 0, 0, 10, 20, 30]]);
  });

  it("ports SocketHandler SendMessage as disconnect on send failure", () => {
    const socket = { fd: 20 };
    const closed: Array<typeof socket> = [];
    const state: SocketDisconnectState<typeof socket> = {
      connected: 1,
      socket,
      ipAddress: "192.0.2.20",
    };

    const result = socketSendMessage(
      state,
      () => 0,
      72,
      new Uint8Array([1]),
      1,
      { closeSocket: (closedSocket: typeof socket) => closed.push(closedSocket) },
    );

    expect(result).toBe(0);
    expect(closed).toEqual([socket]);
    expect(state.connected).toBe(0);
    expect(state.ipAddress).toBe("");
  });
});
