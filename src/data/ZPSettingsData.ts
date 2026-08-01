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

  /**
   * Port of upstream `ZPSettings::LoadSettings`.
   * Role: Parses persisted player/server startup, login, database, and selectable-map settings entries.
   * Upstream: zpsettings.cpp:34-103
   */
  loadSettings(text: string): boolean {
    let loaded = false;

    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trimEnd();
      if (!line.length || line.startsWith("#")) continue;

      const separatorIndex = line.indexOf("=");
      const variable =
        separatorIndex === -1 ? line : line.slice(0, separatorIndex);
      const value = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);

      switch (variable) {
        case "use_database":
          this.useDatabase = Number.parseInt(value, 10) || 0;
          break;
        case "use_mysql":
          this.useMysql = Number.parseInt(value, 10) || 0;
          break;
        case "ignore_activation":
          this.ignoreActivation = Number.parseInt(value, 10) || 0;
          break;
        case "require_login":
          this.requireLogin = Number.parseInt(value, 10) || 0;
          break;
        case "start_map_paused":
          this.startMapPaused = Number.parseInt(value, 10) || 0;
          break;
        case "bots_start_ignored":
          this.botsStartIgnored = Number.parseInt(value, 10) || 0;
          break;
        case "allow_game_speed_change":
          this.allowGameSpeedChange = Number.parseInt(value, 10) || 0;
          break;
        case "selectable_map_list":
          this.selectableMapList.length = 0;
          if (value.length) this.selectableMapList.push(...value.split(","));
          break;
        case "mysql_root_password":
          this.mysqlRootPassword = value;
          break;
        case "mysql_user_name":
          this.mysqlUserName = value;
          break;
        case "mysql_user_password":
          this.mysqlUserPassword = value;
          break;
        case "mysql_hostname":
          this.mysqlHostname = value;
          break;
        case "mysql_dbname":
          this.mysqlDbname = value;
          break;
      }

      loaded = true;
    }

    this.loadedFromFile = loaded;
    return loaded;
  }

  /**
   * Port of upstream `ZPSettings::SaveSettings`.
   * Role: Serializes player/server startup, login, database, and selectable-map settings.
   * Upstream: zpsettings.cpp:105-134
   */
  saveSettings(): string {
    return [
      `ignore_activation=${this.ignoreActivation}\n`,
      `require_login=${this.requireLogin}\n`,
      `use_database=${this.useDatabase}\n`,
      `use_mysql=${this.useMysql}\n`,
      `start_map_paused=${this.startMapPaused}\n`,
      `bots_start_ignored=${this.botsStartIgnored}\n`,
      `allow_game_speed_change=${this.allowGameSpeedChange}\n`,
      `selectable_map_list=${this.selectableMapList.join(",")}\n`,
      `mysql_root_password=${this.mysqlRootPassword}\n`,
      `mysql_user_name=${this.mysqlUserName}\n`,
      `mysql_user_password=${this.mysqlUserPassword}\n`,
      `mysql_hostname=${this.mysqlHostname}\n`,
      `mysql_dbname=${this.mysqlDbname}\n`,
    ].join("");
  }
}
