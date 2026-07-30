import { describe, expect, it } from "vitest";
import { shutdownBrowserRuntime } from "../src/app/BrowserRuntimeLifecycle";

describe("browser runtime lifecycle", () => {
  it("replaces ZSDL_Quit with ordered shutdown hooks", () => {
    const calls: string[] = [];

    shutdownBrowserRuntime({
      closeAudio: () => calls.push("closeAudio"),
      shutdownRenderer: () => calls.push("shutdownRenderer"),
    });

    expect(calls).toEqual(["closeAudio", "shutdownRenderer"]);
  });
});
