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

  it("ports ZPSettings::LoadSettings as persisted player settings parsing", () => {
    const settings = new ZPSettings();
    const selectableMapList = settings.selectableMapList;

    expect(
      settings.loadSettings(
        [
          "# ignored comment",
          "",
          "use_database=1",
          "use_mysql=1",
          "ignore_activation=0",
          "require_login=1",
          "start_map_paused=0",
          "bots_start_ignored=1",
          "allow_game_speed_change=0",
          "selectable_map_list=alpha.map,beta.map",
          "mysql_root_password=root-pass",
          "mysql_user_name=zod-user",
          "mysql_user_password=user-pass",
          "mysql_hostname=db-host",
          "mysql_dbname=zod-prod",
          "unknown_key=still-counts-as-loaded",
        ].join("\n"),
      ),
    ).toBe(true);

    expect(settings).toEqual({
      loadedFromFile: true,
      ignoreActivation: 0,
      requireLogin: 1,
      useDatabase: 1,
      useMysql: 1,
      startMapPaused: 0,
      botsStartIgnored: 1,
      allowGameSpeedChange: 0,
      selectableMapList: ["alpha.map", "beta.map"],
      mysqlRootPassword: "root-pass",
      mysqlUserName: "zod-user",
      mysqlUserPassword: "user-pass",
      mysqlHostname: "db-host",
      mysqlDbname: "zod-prod",
    });
    expect(settings.selectableMapList).toBe(selectableMapList);
  });

  it("ports ZPSettings::LoadSettings empty input as not loaded", () => {
    const settings = new ZPSettings();
    settings.loadedFromFile = true;

    expect(settings.loadSettings("# comment only\n\n")).toBe(false);
    expect(settings.loadedFromFile).toBe(false);
  });

  it("ports ZPSettings::SaveSettings as persisted player settings text", () => {
    const settings = new ZPSettings();
    settings.ignoreActivation = 0;
    settings.requireLogin = 1;
    settings.useDatabase = 1;
    settings.useMysql = 1;
    settings.startMapPaused = 0;
    settings.botsStartIgnored = 1;
    settings.allowGameSpeedChange = 0;
    settings.selectableMapList.push("alpha.map", "beta.map");
    settings.mysqlRootPassword = "root-pass";
    settings.mysqlUserName = "zod-user";
    settings.mysqlUserPassword = "user-pass";
    settings.mysqlHostname = "db-host";
    settings.mysqlDbname = "zod-prod";

    expect(settings.saveSettings()).toBe(
      [
        "ignore_activation=0\n",
        "require_login=1\n",
        "use_database=1\n",
        "use_mysql=1\n",
        "start_map_paused=0\n",
        "bots_start_ignored=1\n",
        "allow_game_speed_change=0\n",
        "selectable_map_list=alpha.map,beta.map\n",
        "mysql_root_password=root-pass\n",
        "mysql_user_name=zod-user\n",
        "mysql_user_password=user-pass\n",
        "mysql_hostname=db-host\n",
        "mysql_dbname=zod-prod\n",
      ].join(""),
    );
  });
});
