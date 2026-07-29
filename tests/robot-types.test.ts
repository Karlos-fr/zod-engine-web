import { describe, expect, it } from "vitest";
import {
  RGRUNT_HEADER_GUARD_PORTED,
  RLASER_HEADER_GUARD_PORTED,
  ROBOT_GRENADE_TIME_INTERVAL_SECONDS,
  RPSYCHO_HEADER_GUARD_PORTED,
  RPYRO_HEADER_GUARD_PORTED,
  RSNIPER_HEADER_GUARD_PORTED,
  RTOUGH_HEADER_GUARD_PORTED,
  ZROBOT_HEADER_GUARD_PORTED,
  playGruntSelectedWav,
  playLaserSelectedWav,
  playPsychoSelectedWav,
  playPyroSelectedWav,
  playSniperSelectedWav,
  playToughSelectedWav,
} from "../src/simulation/entities/RobotTypes";

describe("robot types", () => {
  it("adapts the robot grenade time interval macro", () => {
    expect(ROBOT_GRENADE_TIME_INTERVAL_SECONDS).toBe(0.15);
  });

  it("adapts the zrobot header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/RobotTypes");
    const secondImport = await import("../src/simulation/entities/RobotTypes");

    expect(ZROBOT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZROBOT_HEADER_GUARD_PORTED).toBe(
      firstImport.ZROBOT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the rgrunt header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/RobotTypes");
    const secondImport = await import("../src/simulation/entities/RobotTypes");

    expect(RGRUNT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.RGRUNT_HEADER_GUARD_PORTED).toBe(
      firstImport.RGRUNT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the rlaser header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/RobotTypes");
    const secondImport = await import("../src/simulation/entities/RobotTypes");

    expect(RLASER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.RLASER_HEADER_GUARD_PORTED).toBe(
      firstImport.RLASER_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the rpsycho header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/RobotTypes");
    const secondImport = await import("../src/simulation/entities/RobotTypes");

    expect(RPSYCHO_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.RPSYCHO_HEADER_GUARD_PORTED).toBe(
      firstImport.RPSYCHO_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the rpyro header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/RobotTypes");
    const secondImport = await import("../src/simulation/entities/RobotTypes");

    expect(RPYRO_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.RPYRO_HEADER_GUARD_PORTED).toBe(
      firstImport.RPYRO_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the rsniper header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/RobotTypes");
    const secondImport = await import("../src/simulation/entities/RobotTypes");

    expect(RSNIPER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.RSNIPER_HEADER_GUARD_PORTED).toBe(
      firstImport.RSNIPER_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the rtough header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/RobotTypes");
    const secondImport = await import("../src/simulation/entities/RobotTypes");

    expect(RTOUGH_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.RTOUGH_HEADER_GUARD_PORTED).toBe(
      firstImport.RTOUGH_HEADER_GUARD_PORTED,
    );
  });

  it("ports RGrunt PlaySelectedWav as a disabled selection sound hook", () => {
    expect(playGruntSelectedWav()).toBeUndefined();
  });

  it("ports RLaser PlaySelectedWav as a disabled selection sound hook", () => {
    expect(playLaserSelectedWav()).toBeUndefined();
  });

  it("ports RPsycho PlaySelectedWav as a disabled selection sound hook", () => {
    expect(playPsychoSelectedWav()).toBeUndefined();
  });

  it("ports RPyro PlaySelectedWav as a disabled selection sound hook", () => {
    expect(playPyroSelectedWav()).toBeUndefined();
  });

  it("ports RSniper PlaySelectedWav as a disabled selection sound hook", () => {
    expect(playSniperSelectedWav()).toBeUndefined();
  });

  it("ports RTough PlaySelectedWav as a disabled selection sound hook", () => {
    expect(playToughSelectedWav()).toBeUndefined();
  });
});
