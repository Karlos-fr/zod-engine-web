/**
 * Upstream: gwlogin.h
 */
import type { TexturedSurfaceRenderCommand } from "../rendering/SurfacePixels";
import {
  loadRotozoomCacheBaseImage,
  type BaseImageFileLoadState,
} from "../rendering/SurfaceLifecycle";

/**
 * Port of upstream `_ZGWLOGIN_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gwlogin.h:2
 */
export const ZGW_LOGIN_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream login window gflags subset.
 * Role: Holds login-window actions emitted to the main menu flow.
 * Upstream: gwlogin.cpp:165
 */
export type LoginWindowFlagsState = {
  doLogin: boolean;
  loginName: string;
  loginPassword: string;
  openCreateUser: boolean;
};

/**
 * Port of upstream login window initialization state.
 * Role: Tracks the login menu base image and initialization completion.
 * Upstream: gwlogin.cpp:39-41
 */
export type LoginWindowInitState = {
  baseImage: BaseImageFileLoadState;
  finishedInit: boolean;
};

/**
 * Port of upstream login button release dependency surface.
 * Role: Reports whether a local release completed a login-window button click.
 * Upstream: gwlogin.cpp:113-114
 */
export type LoginUnclickButton = {
  unClick(x: number, y: number): boolean;
};

/**
 * Port of upstream login button press dependency surface.
 * Role: Receives local click coordinates for login-window buttons.
 * Upstream: gwlogin.cpp:82-83
 */
export type LoginClickButton = {
  click(x: number, y: number): void;
};

/**
 * Port of upstream login text-box press dependency surface.
 * Role: Receives local click coordinates and toggles selected state.
 * Upstream: gwlogin.cpp:85-94
 */
export type LoginClickTextBox = {
  click(x: number, y: number): boolean;
  setSelected(selected: boolean): void;
};

/**
 * Port of upstream login text-box key dependency surface.
 * Role: Handles selection checks and key input forwarding for login fields.
 * Upstream: gwlogin.cpp:130-151
 */
export type LoginKeyPressTextBox = {
  isSelected(): boolean;
  setSelected(selected: boolean): void;
  keyPress(c: number): void;
};

/**
 * Port of upstream login gflags clear dependency surface.
 * Role: Clears transient login-window flags before processing a release.
 * Upstream: gwlogin.cpp:108
 */
export type LoginFlagsClearer = {
  clear(): void;
};

/**
 * Port of upstream `GWLogin::UnClick` dependencies.
 * Role: Holds window bounds, buttons, transient flags, and button action handlers.
 * Upstream: gwlogin.cpp:104-122
 */
export type LoginUnclickState = {
  x: number;
  y: number;
  width: number;
  height: number;
  flags: LoginFlagsClearer;
  loginButton: LoginUnclickButton;
  createButton: LoginUnclickButton;
  doLogin(): void;
  doCreate(): void;
};

/**
 * Port of upstream `GWLogin::Click` dependencies.
 * Role: Holds window bounds, buttons, and login text boxes used by a mouse press.
 * Upstream: gwlogin.cpp:75-102
 */
export type LoginClickState = {
  x: number;
  y: number;
  width: number;
  height: number;
  loginButton: LoginClickButton;
  createButton: LoginClickButton;
  loginNameBox: LoginClickTextBox;
  loginPasswordBox: LoginClickTextBox;
};

/**
 * Port of upstream `GWLogin::KeyPress` dependencies.
 * Role: Holds transient flags, text boxes, and login action used by keyboard input.
 * Upstream: gwlogin.cpp:124-154
 */
export type LoginKeyPressState = {
  flags: LoginFlagsClearer;
  loginNameBox: LoginKeyPressTextBox;
  loginPasswordBox: LoginKeyPressTextBox;
  doLogin(): void;
};

/**
 * Replacement for upstream `base_img.GetBaseSurface` used by `GWLogin::DoRender`.
 * Role: Provides the loaded login menu texture and its dimensions.
 * Upstream: gwlogin.cpp:51-60
 */
export type LoginWindowBaseImage<TTexture> = {
  texture: TTexture;
  width: number;
  height: number;
};

/**
 * Port of upstream `ZMap::GetViewShiftFull` dependency used by `GWLogin::DoRender`.
 * Role: Provides viewport shift and dimensions for centering the login window.
 * Upstream: gwlogin.cpp:57
 */
export type LoginWindowRenderViewport = {
  shiftX: number;
  shiftY: number;
  viewWidth: number;
  viewHeight: number;
};

/**
 * Replacement dependency for upstream login widget `DoRender` methods.
 * Role: Produces render commands for a login child widget at the login window origin.
 * Upstream: gwlogin.cpp:67-71
 */
export type LoginWindowWidgetRenderer<TCommand> = {
  render(x: number, y: number): readonly TCommand[];
};

/**
 * Replacement dependency for upstream login text-box `CreateRenderIfNeeded`.
 * Role: Ensures a login text-box render cache is current before widget rendering.
 * Upstream: gwlogin.cpp:48-49
 */
export type LoginWindowRenderableTextBox<TCommand> =
  LoginWindowWidgetRenderer<TCommand> & {
    createRenderIfNeeded(): void;
  };

/**
 * Replacement state for upstream `GWLogin::DoRender`.
 * Role: Holds the initialization flag, base image, and child widgets used to render the login window.
 * Upstream: gwlogin.cpp:46-71
 */
export type LoginWindowRenderState<TTexture, TWidgetCommand> = {
  finishedInit: boolean;
  x: number;
  y: number;
  baseImage: LoginWindowBaseImage<TTexture> | null;
  loginButton: LoginWindowWidgetRenderer<TWidgetCommand>;
  createButton: LoginWindowWidgetRenderer<TWidgetCommand>;
  loginNameBox: LoginWindowRenderableTextBox<TWidgetCommand>;
  loginPasswordBox: LoginWindowRenderableTextBox<TWidgetCommand>;
};

export const LOGIN_MENU_BASE_IMAGE_PATH = "assets/other/menus/login_menu.png";

/**
 * Port of upstream `GWLogin::Init`.
 * Role: Loads the login menu base image and marks initialization complete.
 * Upstream: gwlogin.cpp:37-42
 */
export function initLoginWindow<TSurface>(
  state: LoginWindowInitState,
  loadImage: (filename: string) => TSurface | null,
  loadBaseImage: (surface: TSurface | null) => void,
): void {
  loadRotozoomCacheBaseImage(
    state.baseImage,
    LOGIN_MENU_BASE_IMAGE_PATH,
    loadImage,
    loadBaseImage,
  );
  state.finishedInit = true;
}

/**
 * Replacement for upstream `GWLogin::DoRender`.
 * Role: Builds the centered login-window base command and appends child widget commands.
 * Upstream: gwlogin.cpp:44-73
 */
export function renderLoginWindow<TTexture, TWidgetCommand>(
  state: LoginWindowRenderState<TTexture, TWidgetCommand>,
  viewport: LoginWindowRenderViewport,
): Array<TexturedSurfaceRenderCommand<TTexture> | TWidgetCommand> {
  if (!state.finishedInit) return [];

  state.loginNameBox.createRenderIfNeeded();
  state.loginPasswordBox.createRenderIfNeeded();

  const baseImage = state.baseImage;
  if (!baseImage) return [];

  const x =
    ((viewport.viewWidth - baseImage.width) >> 1) + viewport.shiftX;
  const y =
    ((viewport.viewHeight - baseImage.height) >> 1) + viewport.shiftY;

  state.x = x;
  state.y = y;

  const baseCommand: TexturedSurfaceRenderCommand<TTexture> = {
    texture: baseImage.texture,
    destinationX: x,
    destinationY: y,
    width: baseImage.width,
    height: baseImage.height,
    sourceX: 0,
    sourceY: 0,
    sourceWidth: baseImage.width,
    sourceHeight: baseImage.height,
    textureLeft: 0,
    textureTop: 0,
    textureRight: 1,
    textureBottom: 1,
    scale: 1,
    angle: 0,
    alpha: 1,
  };

  return [
    baseCommand,
    ...state.loginButton.render(x, y),
    ...state.createButton.render(x, y),
    ...state.loginNameBox.render(x, y),
    ...state.loginPasswordBox.render(x, y),
  ];
}

/**
 * Port of upstream login text-box access.
 * Role: Provides the text submitted by the login window controls.
 * Upstream: gwlogin.cpp:159-160
 */
export type LoginWindowCredentialsSource = {
  getLoginNameText: () => string;
  getLoginPasswordText: () => string;
};

/**
 * Port of upstream `GWLogin::UnClick`.
 * Role: Processes a mouse release against login buttons and reports whether it stayed inside the window.
 * Upstream: gwlogin.cpp:104-122
 */
export function unclickLoginWindow(
  state: LoginUnclickState,
  x: number,
  y: number,
): boolean {
  state.flags.clear();

  const localX = x - state.x;
  const localY = y - state.y;

  if (state.loginButton.unClick(localX, localY)) state.doLogin();
  if (state.createButton.unClick(localX, localY)) state.doCreate();

  if (x < state.x) return false;
  if (y < state.y) return false;
  if (x >= state.x + state.width) return false;
  if (y >= state.y + state.height) return false;

  return true;
}

/**
 * Port of upstream `GWLogin::Click`.
 * Role: Processes a mouse press against login buttons and text boxes, then reports whether it stayed inside the window.
 * Upstream: gwlogin.cpp:75-102
 */
export function clickLoginWindow(
  state: LoginClickState,
  x: number,
  y: number,
): boolean {
  const localX = x - state.x;
  const localY = y - state.y;

  state.loginButton.click(localX, localY);
  state.createButton.click(localX, localY);

  if (state.loginNameBox.click(localX, localY)) {
    state.loginNameBox.setSelected(true);
    state.loginPasswordBox.setSelected(false);
  }

  if (state.loginPasswordBox.click(localX, localY)) {
    state.loginNameBox.setSelected(false);
    state.loginPasswordBox.setSelected(true);
  }

  if (x < state.x) return false;
  if (y < state.y) return false;
  if (x >= state.x + state.width) return false;
  if (y >= state.y + state.height) return false;

  return true;
}

/**
 * Port of upstream `GWLogin::KeyPress`.
 * Role: Routes tab, enter, and text input for the login window.
 * Upstream: gwlogin.cpp:124-154
 */
export function keyPressLoginWindow(
  state: LoginKeyPressState,
  c: number,
): boolean {
  state.flags.clear();

  if (c === 9) {
    if (state.loginNameBox.isSelected()) {
      state.loginNameBox.setSelected(false);
      state.loginPasswordBox.setSelected(true);
    } else {
      state.loginNameBox.setSelected(true);
      state.loginPasswordBox.setSelected(false);
    }

    return true;
  }

  if (c === 13) {
    state.doLogin();
    return true;
  }

  if (state.loginNameBox.isSelected()) {
    state.loginNameBox.keyPress(c);
  } else if (state.loginPasswordBox.isSelected()) {
    state.loginPasswordBox.keyPress(c);
  }

  return true;
}

/**
 * Port of upstream `GWLogin::DoLogin`.
 * Role: Requests login using the current login-name and password fields.
 * Upstream: gwlogin.cpp:156-161
 */
export function doLoginWindow(
  state: LoginWindowFlagsState,
  credentials: LoginWindowCredentialsSource,
): void {
  state.doLogin = true;
  state.loginName = credentials.getLoginNameText();
  state.loginPassword = credentials.getLoginPasswordText();
}

/**
 * Port of upstream `GWLogin::DoCreate`.
 * Role: Requests opening the create-user flow from the login window.
 * Upstream: gwlogin.cpp:163-166
 */
export function doCreateLoginWindow(state: LoginWindowFlagsState): void {
  state.openCreateUser = true;
}
