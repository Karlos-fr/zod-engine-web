/**
 * Upstream: zpsettings.cpp, zpsettings.h
 */

/**
 * Port of upstream `buf_size`.
 * Role: Defines the fixed character buffer size for the player settings file parser when reading persisted options.
 * Upstream: zpsettings.cpp:46
 */
export const PLAYER_SETTINGS_READ_BUFFER_SIZE = 500;

/**
 * Marker exported from the player settings data module.
 * Role: Marks an upstream header boundary.
 * Upstream: zpsettings.h:2
 */
export const ZPSETTINGS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZPSettings`.
 * Role: Stores player/server startup, login, database, and selectable-map settings.
 * Upstream: zpsettings.h:11-35
 */
export class ZPSettings {
  loadedFromFile = false;
  ignoreActivation = 0;
  requireLogin = 0;
  useDatabase = 0;
  useMysql = 0;
  startMapPaused = 0;
  botsStartIgnored = 0;
  allowGameSpeedChange = 0;
  selectableMapList: string[] = [];
  mysqlRootPassword = "";
  mysqlUserName = "";
  mysqlUserPassword = "";
  mysqlHostname = "";
  mysqlDbname = "";

  /**
   * Port of upstream `ZPSettings::LoadDefaults`.
   * Role: Initializes player/server settings to the native default values.
   * Upstream: zpsettings.cpp:15-32
   */
  loadDefaults(): void {
    this.loadedFromFile = false;

    this.ignoreActivation = 1;
    this.requireLogin = 0;
    this.useDatabase = 0;
    this.useMysql = 0;
    this.startMapPaused = 1;
    this.botsStartIgnored = 0;
    this.allowGameSpeedChange = 1;
    this.selectableMapList.length = 0;
    this.mysqlRootPassword = "password";
    this.mysqlUserName = "user";
    this.mysqlUserPassword = "password";
    this.mysqlHostname = "localhost";
    this.mysqlDbname = "zod_db";
  }
}
