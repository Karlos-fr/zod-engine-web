import { describe, expect, it } from "vitest";
import {
  PLAYER_SETTINGS_READ_BUFFER_SIZE,
  ZPSettings,
  ZPSETTINGS_HEADER_GUARD_PORTED,
} from "../src/data/ZPSettingsData";

describe("zp settings data", () => {
  it("ports the player settings read buffer size", () => {
    expect(PLAYER_SETTINGS_READ_BUFFER_SIZE).toBe(500);
  });

  it("adapts the zpsettings header guard to module boundaries", async () => {
    const firstImport = await import("../src/data/ZPSettingsData");
    const secondImport = await import("../src/data/ZPSettingsData");

    expect(ZPSETTINGS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZPSETTINGS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZPSETTINGS_HEADER_GUARD_PORTED,
    );
  });

  it("ports ZPSettings construction as zeroed player settings", () => {
    expect(new ZPSettings()).toEqual({
      loadedFromFile: false,
      ignoreActivation: 0,
      requireLogin: 0,
      useDatabase: 0,
      useMysql: 0,
      startMapPaused: 0,
      botsStartIgnored: 0,
      allowGameSpeedChange: 0,
      selectableMapList: [],
      mysqlRootPassword: "",
      mysqlUserName: "",
      mysqlUserPassword: "",
      mysqlHostname: "",
      mysqlDbname: "",
    });
  });

  it("ports ZPSettings::LoadDefaults as native player settings defaults", () => {
    const settings = new ZPSettings();
    settings.loadedFromFile = true;
    settings.ignoreActivation = 0;
    settings.requireLogin = 1;
    settings.useDatabase = 1;
    settings.useMysql = 1;
    settings.startMapPaused = 0;
    settings.botsStartIgnored = 1;
    settings.allowGameSpeedChange = 0;
    settings.selectableMapList.push("first.map", "second.map");
    settings.mysqlRootPassword = "changed-root";
    settings.mysqlUserName = "changed-user";
    settings.mysqlUserPassword = "changed-password";
    settings.mysqlHostname = "remote";
    settings.mysqlDbname = "changed-db";
    const selectableMapList = settings.selectableMapList;

    settings.loadDefaults();

    expect(settings).toEqual({
      loadedFromFile: false,
      ignoreActivation: 1,
      requireLogin: 0,
      useDatabase: 0,
      useMysql: 0,
      startMapPaused: 1,
      botsStartIgnored: 0,
      allowGameSpeedChange: 1,
      selectableMapList: [],
      mysqlRootPassword: "password",
      mysqlUserName: "user",
      mysqlUserPassword: "password",
      mysqlHostname: "localhost",
      mysqlDbname: "zod_db",
    });
    expect(settings.selectableMapList).toBe(selectableMapList);
  });
});
