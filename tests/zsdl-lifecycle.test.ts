import { describe, expect, it } from "vitest";
import { quitZsdl } from "../src/app/ZsdlLifecycle";

describe("ZSDL lifecycle", () => {
  it("replaces ZSDL_Quit with ordered shutdown hooks", () => {
    const calls: string[] = [];

    quitZsdl({
      closeAudio: () => calls.push("closeAudio"),
      quitSdl: () => calls.push("quitSdl"),
    });

    expect(calls).toEqual(["closeAudio", "quitSdl"]);
  });
});
