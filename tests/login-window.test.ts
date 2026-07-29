import { describe, expect, it } from "vitest";
import {
  doCreateLoginWindow,
  doLoginWindow,
  initLoginWindow,
  LOGIN_MENU_BASE_IMAGE_PATH,
  unclickLoginWindow,
  ZGW_LOGIN_HEADER_GUARD_PORTED,
} from "../src/ui/LoginWindow";

describe("login window", () => {
  it("adapts the gwlogin.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/LoginWindow");
    const secondImport = await import("../src/ui/LoginWindow");

    expect(ZGW_LOGIN_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_LOGIN_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_LOGIN_HEADER_GUARD_PORTED,
    );
  });

  it("ports GWLogin DoCreate as create-user flag activation", () => {
    const state = {
      doLogin: false,
      loginName: "",
      loginPassword: "",
      openCreateUser: false,
    };

    doCreateLoginWindow(state);

    expect(state.openCreateUser).toBe(true);
  });

  it("ports GWLogin DoLogin as login flag and credential capture", () => {
    const state = {
      doLogin: false,
      loginName: "",
      loginPassword: "",
      openCreateUser: false,
    };

    doLoginWindow(state, {
      getLoginNameText: () => "alice",
      getLoginPasswordText: () => "secret",
    });

    expect(state.doLogin).toBe(true);
    expect(state.loginName).toBe("alice");
    expect(state.loginPassword).toBe("secret");
    expect(state.openCreateUser).toBe(false);
  });

  it("ports GWLogin UnClick as button release routing and bounds hit", () => {
    const calls: string[] = [];
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      flags: {
        clear: () => calls.push("clear"),
      },
      loginButton: {
        unClick(x: number, y: number) {
          calls.push(`login:${x}:${y}`);
          return true;
        },
      },
      createButton: {
        unClick(x: number, y: number) {
          calls.push(`create:${x}:${y}`);
          return true;
        },
      },
      doLogin: () => calls.push("do-login"),
      doCreate: () => calls.push("do-create"),
    };

    const inside = unclickLoginWindow(state, 30, 50);

    expect(inside).toBe(true);
    expect(calls).toEqual([
      "clear",
      "login:20:30",
      "do-login",
      "create:20:30",
      "do-create",
    ]);
  });

  it("ports GWLogin UnClick bounds checks as outside release misses", () => {
    const calls: string[] = [];
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      flags: {
        clear: () => calls.push("clear"),
      },
      loginButton: {
        unClick: () => false,
      },
      createButton: {
        unClick: () => false,
      },
      doLogin: () => calls.push("do-login"),
      doCreate: () => calls.push("do-create"),
    };

    expect(unclickLoginWindow(state, 9, 50)).toBe(false);
    expect(unclickLoginWindow(state, 30, 19)).toBe(false);
    expect(unclickLoginWindow(state, 110, 50)).toBe(false);
    expect(unclickLoginWindow(state, 30, 100)).toBe(false);

    expect(calls).toEqual(["clear", "clear", "clear", "clear"]);
  });

  it("ports GWLogin Init as base image loading and completion flag", () => {
    const loadedFilenames: string[] = [];
    const baseSurfaces: string[] = [];
    const state = {
      baseImage: { imageFilename: "" },
      finishedInit: false,
    };

    initLoginWindow(
      state,
      (filename) => {
        loadedFilenames.push(filename);
        return `surface:${filename}`;
      },
      (surface) => {
        if (surface) {
          baseSurfaces.push(surface);
        }
      },
    );

    expect(state.baseImage.imageFilename).toBe(LOGIN_MENU_BASE_IMAGE_PATH);
    expect(loadedFilenames).toEqual([LOGIN_MENU_BASE_IMAGE_PATH]);
    expect(baseSurfaces).toEqual([`surface:${LOGIN_MENU_BASE_IMAGE_PATH}`]);
    expect(state.finishedInit).toBe(true);
  });
});
