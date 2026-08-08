import { describe, expect, it } from "vitest";
import {
  clickCreateUserWindow,
  CREATE_USER_MENU_BASE_IMAGE_PATH,
  doCancelCreateUserWindow,
  doOkCreateUserWindow,
  initCreateUserWindow,
  keyPressCreateUserWindow,
  removeCreateUserSelections,
  renderCreateUserWindow,
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

  it("ports GWCreateUser Click as button press routing and field focus", () => {
    const calls: string[] = [];
    const field = (name: string, clicked: boolean) => ({
      click(x: number, y: number) {
        calls.push(`${name}-click:${x}:${y}`);
        return clicked;
      },
      setSelected(selected: boolean) {
        calls.push(`${name}-selected:${selected}`);
      },
    });
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      okButton: {
        click: (x: number, y: number) => calls.push(`ok:${x}:${y}`),
      },
      cancelButton: {
        click: (x: number, y: number) => calls.push(`cancel:${x}:${y}`),
      },
      loginNameBox: field("login", true),
      loginPasswordBox: field("password", false),
      userNameBox: field("user", false),
      emailBox: field("email", false),
    };

    const inside = clickCreateUserWindow(state, 30, 50);

    expect(inside).toBe(true);
    expect(calls).toEqual([
      "ok:20:30",
      "cancel:20:30",
      "login-click:20:30",
      "login-selected:false",
      "password-selected:false",
      "user-selected:false",
      "email-selected:false",
      "login-selected:true",
      "password-click:20:30",
      "user-click:20:30",
      "email-click:20:30",
    ]);
  });

  it("ports GWCreateUser Click as repeated selection removal for later matching fields", () => {
    const calls: string[] = [];
    const field = (name: string, clicked: boolean) => ({
      click: () => {
        calls.push(`${name}-click`);
        return clicked;
      },
      setSelected: (selected: boolean) => calls.push(`${name}-selected:${selected}`),
    });
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      okButton: { click: () => calls.push("ok") },
      cancelButton: { click: () => calls.push("cancel") },
      loginNameBox: field("login", false),
      loginPasswordBox: field("password", true),
      userNameBox: field("user", true),
      emailBox: field("email", false),
    };

    expect(clickCreateUserWindow(state, 30, 50)).toBe(true);

    expect(calls).toEqual([
      "ok",
      "cancel",
      "login-click",
      "password-click",
      "login-selected:false",
      "password-selected:false",
      "user-selected:false",
      "email-selected:false",
      "password-selected:true",
      "user-click",
      "login-selected:false",
      "password-selected:false",
      "user-selected:false",
      "email-selected:false",
      "user-selected:true",
      "email-click",
    ]);
  });

  it("ports GWCreateUser Click bounds checks after press routing", () => {
    const calls: string[] = [];
    const field = () => ({
      click: () => false,
      setSelected: (selected: boolean) => calls.push(`selected:${selected}`),
    });
    const state = {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
      okButton: {
        click: (x: number, y: number) => calls.push(`ok:${x}:${y}`),
      },
      cancelButton: {
        click: (x: number, y: number) => calls.push(`cancel:${x}:${y}`),
      },
      loginNameBox: field(),
      loginPasswordBox: field(),
      userNameBox: field(),
      emailBox: field(),
    };

    expect(clickCreateUserWindow(state, 9, 50)).toBe(false);
    expect(clickCreateUserWindow(state, 30, 19)).toBe(false);
    expect(clickCreateUserWindow(state, 110, 50)).toBe(false);
    expect(clickCreateUserWindow(state, 30, 100)).toBe(false);

    expect(calls).toEqual([
      "ok:-1:30",
      "cancel:-1:30",
      "ok:20:-1",
      "cancel:20:-1",
      "ok:100:30",
      "cancel:100:30",
      "ok:20:80",
      "cancel:20:80",
    ]);
  });

  it("ports GWCreateUser KeyPress as tab cycle from user name to login name", () => {
    const calls: string[] = [];
    const field = (name: string, selected: boolean) => ({
      isSelected: () => selected,
      keyPress: (c: number) => calls.push(`${name}-key:${c}`),
      setSelected: (nextSelected: boolean) =>
        calls.push(`${name}-selected:${nextSelected}`),
    });
    const state = {
      flags: { clear: () => calls.push("clear") },
      loginNameBox: field("login", false),
      loginPasswordBox: field("password", false),
      userNameBox: field("user", true),
      emailBox: field("email", false),
      doOk: () => calls.push("do-ok"),
    };

    expect(keyPressCreateUserWindow(state, 9)).toBe(true);

    expect(calls).toEqual([
      "clear",
      "login-selected:false",
      "password-selected:false",
      "user-selected:false",
      "email-selected:false",
      "login-selected:true",
    ]);
  });

  it("ports GWCreateUser KeyPress as tab cycle through login, password, email, and user fields", () => {
    const runTab = (
      selectedField: "login" | "password" | "email",
    ): string[] => {
      const calls: string[] = [];
      const field = (name: string) => ({
        isSelected: () => name === selectedField,
        keyPress: (c: number) => calls.push(`${name}-key:${c}`),
        setSelected: (selected: boolean) => calls.push(`${name}-selected:${selected}`),
      });

      keyPressCreateUserWindow(
        {
          flags: { clear: () => calls.push("clear") },
          loginNameBox: field("login"),
          loginPasswordBox: field("password"),
          userNameBox: field("user"),
          emailBox: field("email"),
          doOk: () => calls.push("do-ok"),
        },
        9,
      );

      return calls;
    };

    expect(runTab("login")).toEqual([
      "clear",
      "login-selected:false",
      "password-selected:false",
      "user-selected:false",
      "email-selected:false",
      "password-selected:true",
    ]);
    expect(runTab("password")).toEqual([
      "clear",
      "login-selected:false",
      "password-selected:false",
      "user-selected:false",
      "email-selected:false",
      "email-selected:true",
    ]);
    expect(runTab("email")).toEqual([
      "clear",
      "login-selected:false",
      "password-selected:false",
      "user-selected:false",
      "email-selected:false",
      "user-selected:true",
    ]);
  });

  it("ports GWCreateUser KeyPress as enter create-user action", () => {
    const calls: string[] = [];
    const field = () => ({
      isSelected: () => false,
      keyPress: (c: number) => calls.push(`key:${c}`),
      setSelected: (selected: boolean) => calls.push(`selected:${selected}`),
    });

    expect(
      keyPressCreateUserWindow(
        {
          flags: { clear: () => calls.push("clear") },
          loginNameBox: field(),
          loginPasswordBox: field(),
          userNameBox: field(),
          emailBox: field(),
          doOk: () => calls.push("do-ok"),
        },
        13,
      ),
    ).toBe(true);

    expect(calls).toEqual(["clear", "do-ok"]);
  });

  it("ports GWCreateUser KeyPress as forwarding to the selected text field", () => {
    const calls: string[] = [];
    const field = (name: string, selected: boolean) => ({
      isSelected: () => selected,
      keyPress: (c: number) => calls.push(`${name}-key:${c}`),
      setSelected: (nextSelected: boolean) =>
        calls.push(`${name}-selected:${nextSelected}`),
    });

    expect(
      keyPressCreateUserWindow(
        {
          flags: { clear: () => calls.push("clear") },
          loginNameBox: field("login", false),
          loginPasswordBox: field("password", false),
          userNameBox: field("user", false),
          emailBox: field("email", true),
          doOk: () => calls.push("do-ok"),
        },
        "z".charCodeAt(0),
      ),
    ).toBe(true);

    expect(calls).toEqual(["clear", "email-key:122"]);
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

  it("replaces GWCreateUser DoRender with centered base and child widget commands", () => {
    const calls: string[] = [];
    const widget = (id: string) => ({
      render(x: number, y: number) {
        calls.push(`${id}:${x}:${y}`);
        return [{ kind: id, x, y }];
      },
    });
    const textBox = (id: string) => ({
      createRenderIfNeeded() {
        calls.push(`${id}:create-render`);
      },
      render(x: number, y: number) {
        calls.push(`${id}:${x}:${y}`);
        return [{ kind: id, x, y }];
      },
    });
    const state = {
      finishedInit: true,
      x: 0,
      y: 0,
      baseImage: {
        texture: { textureId: "create-user" },
        width: 160,
        height: 90,
      },
      okButton: widget("ok-button"),
      cancelButton: widget("cancel-button"),
      loginNameBox: textBox("login-name"),
      loginPasswordBox: textBox("login-password"),
      userNameBox: textBox("user-name"),
      emailBox: textBox("email"),
    };

    const commands = renderCreateUserWindow(state, {
      shiftX: 3,
      shiftY: 5,
      viewWidth: 360,
      viewHeight: 220,
    });

    expect(state.x).toBe(103);
    expect(state.y).toBe(70);
    expect(calls).toEqual([
      "login-name:create-render",
      "login-password:create-render",
      "user-name:create-render",
      "email:create-render",
      "ok-button:103:70",
      "cancel-button:103:70",
      "login-name:103:70",
      "login-password:103:70",
      "user-name:103:70",
      "email:103:70",
    ]);
    expect(commands).toEqual([
      {
        texture: { textureId: "create-user" },
        destinationX: 103,
        destinationY: 70,
        width: 160,
        height: 90,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 160,
        sourceHeight: 90,
        textureLeft: 0,
        textureTop: 0,
        textureRight: 1,
        textureBottom: 1,
        scale: 1,
        angle: 0,
        alpha: 1,
      },
      { kind: "ok-button", x: 103, y: 70 },
      { kind: "cancel-button", x: 103, y: 70 },
      { kind: "login-name", x: 103, y: 70 },
      { kind: "login-password", x: 103, y: 70 },
      { kind: "user-name", x: 103, y: 70 },
      { kind: "email", x: 103, y: 70 },
    ]);
  });

  it("replaces GWCreateUser DoRender guard and missing-image cases", () => {
    const calls: string[] = [];
    const state = {
      finishedInit: false,
      x: 10,
      y: 20,
      baseImage: null,
      okButton: { render: () => [{ kind: "ok" }] },
      cancelButton: { render: () => [{ kind: "cancel" }] },
      loginNameBox: {
        createRenderIfNeeded: () => calls.push("login-create"),
        render: () => [{ kind: "login" }],
      },
      loginPasswordBox: {
        createRenderIfNeeded: () => calls.push("password-create"),
        render: () => [{ kind: "password" }],
      },
      userNameBox: {
        createRenderIfNeeded: () => calls.push("user-create"),
        render: () => [{ kind: "user" }],
      },
      emailBox: {
        createRenderIfNeeded: () => calls.push("email-create"),
        render: () => [{ kind: "email" }],
      },
    };
    const viewport = {
      shiftX: 0,
      shiftY: 0,
      viewWidth: 100,
      viewHeight: 100,
    };

    expect(renderCreateUserWindow(state, viewport)).toEqual([]);
    expect(calls).toEqual([]);

    state.finishedInit = true;
    expect(renderCreateUserWindow(state, viewport)).toEqual([]);
    expect(calls).toEqual([
      "login-create",
      "password-create",
      "user-create",
      "email-create",
    ]);
    expect(state.x).toBe(10);
    expect(state.y).toBe(20);
  });
});
