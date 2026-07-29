/**
 * Upstream: gwcreateuser.h
 */
import {
  loadRotozoomCacheBaseImage,
  type BaseImageFileLoadState,
} from "../rendering/SurfaceLifecycle";

/**
 * Port of upstream `_ZGWCREATEUSER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gwcreateuser.h:2
 */
export const ZGW_CREATE_USER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream create-user gflags subset.
 * Role: Holds create-user window actions emitted to the main menu flow.
 * Upstream: gwcreateuser.cpp:210
 */
export type CreateUserWindowFlagsState = {
  doCreateUser: boolean;
  userName: string;
  loginName: string;
  loginPassword: string;
  email: string;
  openLogin: boolean;
};

/**
 * Port of upstream create-user text-box access.
 * Role: Provides the text submitted by the create-user window controls.
 * Upstream: gwcreateuser.cpp:201-204
 */
export type CreateUserWindowFieldsSource = {
  getUserNameText: () => string;
  getLoginNameText: () => string;
  getLoginPasswordText: () => string;
  getEmailText: () => string;
};

/**
 * Port of upstream text-box selection dependency surface.
 * Role: Provides selection assignment for create-user text fields.
 * Upstream: gwcreateuser.cpp:191-194
 */
export type CreateUserSelectableField = {
  setSelected(selected: boolean): void;
};

/**
 * Port of upstream create-user text-box selection fields.
 * Role: Holds the editable fields cleared by create-user focus removal.
 * Upstream: gwcreateuser.cpp:191-194
 */
export type CreateUserSelectionState = {
  loginNameBox: CreateUserSelectableField;
  loginPasswordBox: CreateUserSelectableField;
  userNameBox: CreateUserSelectableField;
  emailBox: CreateUserSelectableField;
};

/**
 * Port of upstream create-user button release dependency surface.
 * Role: Reports whether a local release completed a button click.
 * Upstream: gwcreateuser.cpp:134-135
 */
export type CreateUserUnclickButton = {
  unClick(x: number, y: number): boolean;
};

/**
 * Port of upstream create-user gflags clear dependency surface.
 * Role: Clears transient create-user window flags before processing a release.
 * Upstream: gwcreateuser.cpp:129
 */
export type CreateUserFlagsClearer = {
  clear(): void;
};

/**
 * Port of upstream `GWCreateUser::UnClick` dependencies.
 * Role: Holds window bounds, buttons, transient flags, and button action handlers.
 * Upstream: gwcreateuser.cpp:125-143
 */
export type CreateUserUnclickState = {
  x: number;
  y: number;
  width: number;
  height: number;
  flags: CreateUserFlagsClearer;
  okButton: CreateUserUnclickButton;
  cancelButton: CreateUserUnclickButton;
  doOk(): void;
  doCancel(): void;
};

/**
 * Port of upstream create-user window initialization state.
 * Role: Tracks the create-user menu base image and initialization completion.
 * Upstream: gwcreateuser.cpp:46-48
 */
export type CreateUserWindowInitState = {
  baseImage: BaseImageFileLoadState;
  finishedInit: boolean;
};

export const CREATE_USER_MENU_BASE_IMAGE_PATH =
  "assets/other/menus/create_user_menu.png";

/**
 * Port of upstream `GWCreateUser::Init`.
 * Role: Loads the create-user menu base image and marks initialization complete.
 * Upstream: gwcreateuser.cpp:44-49
 */
export function initCreateUserWindow<TSurface>(
  state: CreateUserWindowInitState,
  loadImage: (filename: string) => TSurface | null,
  loadBaseImage: (surface: TSurface | null) => void,
): void {
  loadRotozoomCacheBaseImage(
    state.baseImage,
    CREATE_USER_MENU_BASE_IMAGE_PATH,
    loadImage,
    loadBaseImage,
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `GWCreateUser::RemoveSelections`.
 * Role: Clears focus selection from every create-user text field.
 * Upstream: gwcreateuser.cpp:189-195
 */
export function removeCreateUserSelections(
  state: CreateUserSelectionState,
): void {
  state.loginNameBox.setSelected(false);
  state.loginPasswordBox.setSelected(false);
  state.userNameBox.setSelected(false);
  state.emailBox.setSelected(false);
}

/**
 * Port of upstream `GWCreateUser::UnClick`.
 * Role: Processes a mouse release against create-user buttons and reports whether it stayed inside the window.
 * Upstream: gwcreateuser.cpp:125-143
 */
export function unclickCreateUserWindow(
  state: CreateUserUnclickState,
  x: number,
  y: number,
): boolean {
  state.flags.clear();

  const localX = x - state.x;
  const localY = y - state.y;

  if (state.okButton.unClick(localX, localY)) state.doOk();
  if (state.cancelButton.unClick(localX, localY)) state.doCancel();

  if (x < state.x) return false;
  if (y < state.y) return false;
  if (x >= state.x + state.width) return false;
  if (y >= state.y + state.height) return false;

  return true;
}

/**
 * Port of upstream `GWCreateUser::DoOk`.
 * Role: Requests user creation using the current create-user form fields.
 * Upstream: gwcreateuser.cpp:197-205
 */
export function doOkCreateUserWindow(
  state: CreateUserWindowFlagsState,
  fields: CreateUserWindowFieldsSource,
): void {
  state.doCreateUser = true;
  state.userName = fields.getUserNameText();
  state.loginName = fields.getLoginNameText();
  state.loginPassword = fields.getLoginPasswordText();
  state.email = fields.getEmailText();
}

/**
 * Port of upstream `GWCreateUser::DoCancel`.
 * Role: Requests returning to the login flow from the create-user window.
 * Upstream: gwcreateuser.cpp:207-211
 */
export function doCancelCreateUserWindow(
  state: CreateUserWindowFlagsState,
): void {
  state.openLogin = true;
}
