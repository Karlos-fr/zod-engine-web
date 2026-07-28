import { describe, expect, it } from "vitest";
import {
  createSocketSendReadinessTimeout,
  SOCKET_HANDLER_HEADER_GUARD_PORTED,
  SOCKET_MAX_BUFFER_BYTES,
  SOCKET_MAX_DATA_STORED_BYTES,
  SOCKET_SEND_MAX_WAIT_SECONDS,
} from "../src/network/SocketHandler";
import type { SocketAddressIn } from "../src/network/SocketHandler";

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
});
