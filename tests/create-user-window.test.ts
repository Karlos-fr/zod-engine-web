import { describe, expect, it } from "vitest";
import {
  CREATE_USER_MENU_BASE_IMAGE_PATH,
  doCancelCreateUserWindow,
  doOkCreateUserWindow,
  initCreateUserWindow,
  removeCreateUserSelections,
  unclickCreateUserWindow,
  ZGW_CREATE_USER_HEADER_GUARD_PORTED,
} from "../src/ui/CreateUserWindow";

describe("create user window", () => {
  it("adapts the gwcreateuser.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/CreateUserWindow");
    const secondImport = await import("../src/ui/CreateUserWindow");

    expect(ZGW_CREATE_USER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_CREATE_USER_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_CREATE_USER_HEADER_GUARD_PORTED,
    );
  });

  it("ports GWCreateUser DoCancel as login flag activation", () => {
    const state = {
      doCreateUser: false,
      userName: "",
      loginName: "",
      loginPassword: "",
      email: "",
      openLogin: false,
    };

    doCancelCreateUserWindow(state);

    expect(state.openLogin).toBe(true);
    expect(state.doCreateUser).toBe(false);
  });

  it("ports GWCreateUser DoOk as create-user flag and field capture", () => {
    const state = {
      doCreateUser: false,
      userName: "",
      loginName: "",
      loginPassword: "",
      email: "",
      openLogin: false,
    };

    doOkCreateUserWindow(state, {
      getUserNameText: () => "Alice Example",
      getLoginNameText: () => "alice",
      getLoginPasswordText: () => "secret",
      getEmailText: () => "alice@example.test",
    });

    expect(state).toEqual({
      doCreateUser: true,
      userName: "Alice Example",
      loginName: "alice",
      loginPassword: "secret",
      email: "alice@example.test",
      openLogin: false,
    });
  });

  it("ports GWCreateUser RemoveSelections as text field selection clearing", () => {
    const calls: Array<[string, boolean]> = [];
    const field = (name: string) => ({
      setSelected(selected: boolean) {
        calls.push([name, selected]);
      },
    });

    removeCreateUserSelections({
      loginNameBox: field("login"),
      loginPasswordBox: field("password"),
      userNameBox: field("user"),
      emailBox: field("email"),
    });

    expect(calls).toEqual([
      ["login", false],
      ["password", false],
      ["user", false],
      ["email", false],
    ]);
  });

  it("ports GWCreateUser UnClick as button release routing and bounds hit", () => {
    const calls: string[] = [];
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      flags: {
        clear: () => calls.push("clear"),
      },
      okButton: {
        unClick(x: number, y: number) {
          calls.push(`ok:${x}:${y}`);
          return true;
        },
      },
      cancelButton: {
        unClick(x: number, y: number) {
          calls.push(`cancel:${x}:${y}`);
          return true;
        },
      },
      doOk: () => calls.push("do-ok"),
      doCancel: () => calls.push("do-cancel"),
    };

    const inside = unclickCreateUserWindow(state, 30, 50);

    expect(inside).toBe(true);
    expect(calls).toEqual([
      "clear",
      "ok:20:30",
      "do-ok",
      "cancel:20:30",
      "do-cancel",
    ]);
  });

  it("ports GWCreateUser UnClick bounds checks as outside release misses", () => {
    const calls: string[] = [];
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      flags: {
        clear: () => calls.push("clear"),
      },
      okButton: {
        unClick: () => false,
      },
      cancelButton: {
        unClick: () => false,
      },
      doOk: () => calls.push("do-ok"),
      doCancel: () => calls.push("do-cancel"),
    };

    expect(unclickCreateUserWindow(state, 9, 50)).toBe(false);
    expect(unclickCreateUserWindow(state, 30, 19)).toBe(false);
    expect(unclickCreateUserWindow(state, 110, 50)).toBe(false);
    expect(unclickCreateUserWindow(state, 30, 100)).toBe(false);

    expect(calls).toEqual(["clear", "clear", "clear", "clear"]);
  });

  it("ports GWCreateUser Init as base image loading and completion flag", () => {
    const loadedFilenames: string[] = [];
    const baseSurfaces: string[] = [];
    const state = {
      baseImage: { imageFilename: "" },
      finishedInit: false,
    };

    initCreateUserWindow(
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

    expect(state.baseImage.imageFilename).toBe(CREATE_USER_MENU_BASE_IMAGE_PATH);
    expect(loadedFilenames).toEqual([CREATE_USER_MENU_BASE_IMAGE_PATH]);
    expect(baseSurfaces).toEqual([
      `surface:${CREATE_USER_MENU_BASE_IMAGE_PATH}`,
    ]);
    expect(state.finishedInit).toBe(true);
  });
});
