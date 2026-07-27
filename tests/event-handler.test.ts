import { describe, expect, it } from "vitest";
import {
  EVENT_HANDLER_HEADER_GUARD_PORTED,
  MAX_EVENT_TYPES,
  MAX_FUNCTIONS,
  MAX_VERSION_PACKET_CHARS,
} from "../src/simulation/EventHandler";

describe("event handler", () => {
  it("adapts the event_handler.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/EventHandler");
    const secondImport = await import("../src/simulation/EventHandler");

    expect(EVENT_HANDLER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EVENT_HANDLER_HEADER_GUARD_PORTED).toBe(
      firstImport.EVENT_HANDLER_HEADER_GUARD_PORTED,
    );
  });

  it("ports MAX_VERSION_PACKET_CHARS as the version packet capacity", () => {
    expect(MAX_VERSION_PACKET_CHARS).toBe(50);
  });

  it("ports MAX_EVENT_TYPES as the event category dispatch height", () => {
    expect(MAX_EVENT_TYPES).toBe(5);
  });

  it("ports MAX_FUNCTIONS as the event function dispatch width", () => {
    expect(MAX_FUNCTIONS).toBe(200);
  });
});
