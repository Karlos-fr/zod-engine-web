import { describe, expect, it } from "vitest";
import {
  clickLoginWindow,
  doCreateLoginWindow,
  doLoginWindow,
  initLoginWindow,
  keyPressLoginWindow,
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

  it("ports GWLogin Click as button press routing and login-name selection", () => {
    const calls: string[] = [];
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      loginButton: {
        click: (x: number, y: number) => calls.push(`login:${x}:${y}`),
      },
      createButton: {
        click: (x: number, y: number) => calls.push(`create:${x}:${y}`),
      },
      loginNameBox: {
        click: (x: number, y: number) => {
          calls.push(`name-click:${x}:${y}`);
          return true;
        },
        setSelected: (selected: boolean) => calls.push(`name-selected:${selected}`),
      },
      loginPasswordBox: {
        click: (x: number, y: number) => {
          calls.push(`pass-click:${x}:${y}`);
          return false;
        },
        setSelected: (selected: boolean) => calls.push(`pass-selected:${selected}`),
      },
    };

    const inside = clickLoginWindow(state, 30, 50);

    expect(inside).toBe(true);
    expect(calls).toEqual([
      "login:20:30",
      "create:20:30",
      "name-click:20:30",
      "name-selected:true",
      "pass-selected:false",
      "pass-click:20:30",
    ]);
  });

  it("ports GWLogin Click as password selection and bounds checks", () => {
    const calls: string[] = [];
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      loginButton: {
        click: (x: number, y: number) => calls.push(`login:${x}:${y}`),
      },
      createButton: {
        click: (x: number, y: number) => calls.push(`create:${x}:${y}`),
      },
      loginNameBox: {
        click: () => false,
        setSelected: (selected: boolean) => calls.push(`name-selected:${selected}`),
      },
      loginPasswordBox: {
        click: () => true,
        setSelected: (selected: boolean) => calls.push(`pass-selected:${selected}`),
      },
    };

    expect(clickLoginWindow(state, 9, 50)).toBe(false);
    expect(clickLoginWindow(state, 30, 19)).toBe(false);
    expect(clickLoginWindow(state, 110, 50)).toBe(false);
    expect(clickLoginWindow(state, 30, 100)).toBe(false);

    expect(calls).toEqual([
      "login:-1:30",
      "create:-1:30",
      "name-selected:false",
      "pass-selected:true",
      "login:20:-1",
      "create:20:-1",
      "name-selected:false",
      "pass-selected:true",
      "login:100:30",
      "create:100:30",
      "name-selected:false",
      "pass-selected:true",
      "login:20:80",
      "create:20:80",
      "name-selected:false",
      "pass-selected:true",
    ]);
  });

  it("ports GWLogin KeyPress as tab selection toggle from login name", () => {
    const calls: string[] = [];
    const state = {
      flags: { clear: () => calls.push("clear") },
      loginNameBox: {
        isSelected: () => true,
        setSelected: (selected: boolean) => calls.push(`name-selected:${selected}`),
        keyPress: (c: number) => calls.push(`name-key:${c}`),
      },
      loginPasswordBox: {
        isSelected: () => false,
        setSelected: (selected: boolean) => calls.push(`pass-selected:${selected}`),
        keyPress: (c: number) => calls.push(`pass-key:${c}`),
      },
      doLogin: () => calls.push("do-login"),
    };

    expect(keyPressLoginWindow(state, 9)).toBe(true);

    expect(calls).toEqual([
      "clear",
      "name-selected:false",
      "pass-selected:true",
    ]);
  });

  it("ports GWLogin KeyPress as tab selection toggle to login name", () => {
    const calls: string[] = [];
    const state = {
      flags: { clear: () => calls.push("clear") },
      loginNameBox: {
        isSelected: () => false,
        setSelected: (selected: boolean) => calls.push(`name-selected:${selected}`),
        keyPress: (c: number) => calls.push(`name-key:${c}`),
      },
      loginPasswordBox: {
        isSelected: () => true,
        setSelected: (selected: boolean) => calls.push(`pass-selected:${selected}`),
        keyPress: (c: number) => calls.push(`pass-key:${c}`),
      },
      doLogin: () => calls.push("do-login"),
    };

    expect(keyPressLoginWindow(state, 9)).toBe(true);

    expect(calls).toEqual([
      "clear",
      "name-selected:true",
      "pass-selected:false",
    ]);
  });

  it("ports GWLogin KeyPress as enter login action", () => {
    const calls: string[] = [];
    const state = {
      flags: { clear: () => calls.push("clear") },
      loginNameBox: {
        isSelected: () => true,
        setSelected: (selected: boolean) => calls.push(`name-selected:${selected}`),
        keyPress: (c: number) => calls.push(`name-key:${c}`),
      },
      loginPasswordBox: {
        isSelected: () => false,
        setSelected: (selected: boolean) => calls.push(`pass-selected:${selected}`),
        keyPress: (c: number) => calls.push(`pass-key:${c}`),
      },
      doLogin: () => calls.push("do-login"),
    };

    expect(keyPressLoginWindow(state, 13)).toBe(true);

    expect(calls).toEqual(["clear", "do-login"]);
  });

  it("ports GWLogin KeyPress as forwarding to the selected text box", () => {
    const calls: string[] = [];
    const state = {
      flags: { clear: () => calls.push("clear") },
      loginNameBox: {
        isSelected: () => false,
        setSelected: (selected: boolean) => calls.push(`name-selected:${selected}`),
        keyPress: (c: number) => calls.push(`name-key:${c}`),
      },
      loginPasswordBox: {
        isSelected: () => true,
        setSelected: (selected: boolean) => calls.push(`pass-selected:${selected}`),
        keyPress: (c: number) => calls.push(`pass-key:${c}`),
      },
      doLogin: () => calls.push("do-login"),
    };

    expect(keyPressLoginWindow(state, "a".charCodeAt(0))).toBe(true);

    expect(calls).toEqual(["clear", "pass-key:97"]);
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
