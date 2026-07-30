import { describe, expect, it } from "vitest";
import {
  createSocketSendReadinessTimeout,
  SOCKET_HANDLER_HEADER_GUARD_PORTED,
  SOCKET_MAX_BUFFER_BYTES,
  SOCKET_MAX_DATA_STORED_BYTES,
  SOCKET_SEND_MAX_WAIT_SECONDS,
  disconnectSocket,
  resetSocketFastProcess,
  socketRecvGood,
  socketConnected,
} from "../src/network/SocketHandler";
import type {
  SocketAddressIn,
  SocketDisconnectState,
  SocketFastProcessState,
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

    const result = socketRecvGood(state, 0, {
      closeSocket: (closedSocket) => closed.push(closedSocket),
    });

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
});
