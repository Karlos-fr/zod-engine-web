/**
 * Upstream: zplayer.h / zplayer.cpp
 */

import type { SoundSetting } from "../audio/AudioService";
import { MainMenuType } from "../ui/MainMenuBase";
import { MapObjectType } from "../world/MapFormat";
import { currentTime } from "./Common";
import { VehicleType } from "./SimulationConstants";
import type { SimulationTime } from "./SimulationTime";

/**
 * Port of upstream `_ZPLAYER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zplayer.h:2
 */
export const ZPLAYER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_STORED_SPACE_BAR_EVENTS`.
 * Role: Defines how many space-bar focus events are retained.
 * Upstream: zplayer.h:106
 */
export const PLAYER_MAX_STORED_SPACE_BAR_EVENTS = 5;

/**
 * Port of upstream `SPACE_BAR_EVENT_LIFETIME`.
 * Role: Defines how long space-bar focus events remain valid.
 * Upstream: zplayer.h:107
 */
export const PLAYER_SPACE_BAR_EVENT_LIFETIME_SECONDS = 10;

/**
 * Port of upstream `ASCII_DOWN_MAX`.
 * Role: Defines how many lowercase ASCII key states are tracked by the player.
 * Upstream: zplayer.h:152
 */
export const PLAYER_ASCII_DOWN_MAX = 26;

/**
 * Port of upstream `key_event`.
 * Role: Stores a raw key code and Unicode value received by the player input layer.
 * Upstream: zplayer.h:44-48
 */
export type PlayerKeyEvent = {
  theKey: number;
  theUnicode: number;
};

/**
 * Port of upstream `news_entry`.
 * Role: Stores one timed player news message and its rendered text image.
 * Upstream: zplayer.h:35-42
 */
export type PlayerNewsEntry<TTextImage = unknown> = {
  red: number;
  green: number;
  blue: number;
  message: string;
  deathTime: number;
  textImage: TTextImage;
};

/**
 * Port of upstream `mouse_button_info`.
 * Role: Stores mouse button screen/map coordinates and click-origin flags.
 * Upstream: zplayer.h:95-104
 */
export type MouseButtonInfo = {
  x: number;
  y: number;
  mapX: number;
  mapY: number;
  down: boolean;
  startedOverHud: boolean;
  startedOverGui: boolean;
};

export type PlayerMouseButtonState = {
  mbutton: Pick<MouseButtonInfo, "down">;
  rbutton: Pick<MouseButtonInfo, "down">;
};

/**
 * Port of upstream `ZPlayer::LoadMainMenu` call target.
 * Role: Provides the minimal player UI action needed by menu button handling.
 * Upstream: zplayer.cpp:1623
 */
export type PlayerMainMenuLoader = {
  loadMainMenu(menuType: MainMenuType): void;
};

/**
 * Port of upstream `ZGuiMainMenuBase::Move` call target.
 * Role: Provides the minimal main-menu API needed by player main-menu movement.
 * Upstream: zplayer.cpp:3131-3132
 */
export type PlayerMainMenuMover = {
  move(px: number, py: number): void;
};

/**
 * Port of upstream `gui_menu_list` movement field.
 * Role: Holds active main menus that move with player viewport scaling.
 * Upstream: zplayer.cpp:3131
 */
export type PlayerMainMenuMoveState = {
  guiMenuList: PlayerMainMenuMover[];
};

/**
 * Port of upstream `sound_setting` field usage in `ZPlayer`.
 * Role: Provides the minimal player audio state needed by sound-setting helpers.
 * Upstream: zplayer.cpp:3901
 */
export type PlayerSoundSettingState = {
  soundSetting: SoundSetting;
};

export type PlayerInfoListState<TPlayerInfo = unknown> = {
  playerInfo: TPlayerInfo[];
};

export type PlayerMouseScrollState = {
  mouseX: number;
  mouseY: number;
  screenWidth: number;
  screenHeight: number;
  inputGrabbed: boolean;
};

/**
 * Port of upstream `mouse_x`, `mouse_y`, `init_w`, and `init_h` field usage in `ZPlayer`.
 * Role: Provides the player viewport state needed for mouse-to-map conversion.
 * Upstream: zplayer.cpp:2715-2716
 */
export type PlayerMouseMapHudState = {
  mouseX: number;
  mouseY: number;
  initW: number;
  initH: number;
};

/**
 * Port of upstream `place_cannon` placement fields in `ZPlayer`.
 * Role: Tracks whether cannon placement is active and the target map tile.
 * Upstream: zplayer.cpp:3537, zplayer.cpp:3544-3545
 */
export type PlayerPlaceCannonState = {
  placeCannon: boolean;
  mouseX: number;
  mouseY: number;
  placeCannonTileX: number;
  placeCannonTileY: number;
};

/**
 * Port of upstream `ZMap::GetMapCoords` call target.
 * Role: Provides the minimal map API needed by player mouse-to-map conversion.
 * Upstream: zplayer.cpp:2715
 */
export type PlayerMapCoordsProvider = {
  getMapCoords(mouseX: number, mouseY: number): { x: number; y: number };
};

/**
 * Port of upstream `ZMap::GetViewShift` call target.
 * Role: Provides the current map view shift for cannon placement coordinates.
 * Upstream: zplayer.cpp:3539
 */
export type PlayerViewShiftProvider = {
  getViewShift(): { x: number; y: number };
};

/**
 * Port of upstream `ZHud::OverMiniMap` call target.
 * Role: Provides the minimal HUD API that may remap mouse coordinates through the minimap.
 * Upstream: zplayer.cpp:2716
 */
export type PlayerHudMiniMapProvider = {
  overMiniMap(
    mouseX: number,
    mouseY: number,
    initW: number,
    initH: number,
    mapX: number,
    mapY: number,
  ): { mapX: number; mapY: number };
};

export type PlayerDimensionState = {
  prevW: number;
  initW: number;
  prevH: number;
  initH: number;
};

export type PlayerInitialDimensionState = Pick<
  PlayerDimensionState,
  "initW" | "initH"
>;

export type PlayerScrollKeyState = {
  leftDown: boolean;
  rightDown: boolean;
  upDown: boolean;
  downDown: boolean;
};

export type PlayerModifierKeyState = {
  leftShiftDown: boolean;
  rightShiftDown: boolean;
  leftCtrlDown: boolean;
  rightCtrlDown: boolean;
  leftAltDown: boolean;
  rightAltDown: boolean;
};

export type PlayerLoginState = {
  loginName: string;
  loginPassword: string;
};

export type PlayerAsciiState = {
  asciiDown: boolean[];
};

export type PlayerAnimalState<TAnimal = unknown> = {
  birdList: TAnimal[];
};

export type PlayerFactoryListGuiState = {
  guiFactoryList: { toggleShow(): void } | null;
};

export type PlayerCursorState = {
  disableZCursor: boolean;
};

export type PlayerPlacementCursorState = {
  pcursorDeathTime: number;
  pcursorX: number;
  pcursorY: number;
};

/**
 * Replacement for upstream process/audio shutdown calls.
 * Role: Provides browser-hosted lifecycle actions used when the player exits.
 * Upstream: zplayer.cpp:2312-2313
 */
export type PlayerExitProgramActions = {
  closeAudio: () => void;
  exit: (code: number) => void;
};

/**
 * Port of upstream `SpaceBarEvent` lifetime fields.
 * Role: Stores the creation timestamp used to expire a space-bar focus event.
 * Upstream: zplayer.h:109-150
 */
export type SpaceBarEventLifetimeState = {
  creationTime: number;
};

/**
 * Port of upstream `selection_info` ztime pointer field.
 * Role: Holds the simulation clock used by player selection state.
 * Upstream: zplayer.h:79
 */
export type PlayerSelectionZTimeState = {
  ztime: SimulationTime | null;
};

export type PlayerSelectionClearState = {
  haveExplosives: boolean;
  canPickupGrenades: boolean;
  canMove: boolean;
  canEquip: boolean;
  canAttack: boolean;
  canRepair: boolean;
  canBeRepaired: boolean;
  selectedList: unknown[];
};

export type PlayerSelectionClearAllState = PlayerSelectionClearState & {
  quickGroups: unknown[][];
};

export type PlayerSelectedWaypointDevListSource = {
  getWayPointDevList(): unknown[];
};

export type PlayerSelectedWaypointDevListState = {
  selectedList: PlayerSelectedWaypointDevListSource[];
};

export type PlayerObjectSelectionState<TObject = unknown> = {
  selectedList: TObject[];
};

/**
 * Port of upstream `ZHud::SetSelectedObject` call target.
 * Role: Provides the HUD selection assignment used by player selection forwarding.
 * Upstream: zplayer.cpp:3037, zplayer.cpp:3040
 */
export type PlayerHudSelectionTarget<TObject = unknown> = {
  setSelectedObject(selectedObject: TObject | null): void;
};

/**
 * Port of upstream player HUD-selection state.
 * Role: Holds selected objects and the HUD target that receives a chosen selection.
 * Upstream: zplayer.cpp:3032-3041
 */
export type PlayerHudSelectedState<TObject = unknown> = {
  selectedList: TObject[];
  hud: PlayerHudSelectionTarget<TObject>;
};

export type PlayerSelectionCenteredObject = {
  getCenterCoords(): { x: number; y: number };
};

export type PlayerSelectionQuickGroupObject = {
  setGroup(group: number): void;
};

export type PlayerSelectionQuickGroupState<
  TObject extends PlayerSelectionQuickGroupObject,
> = {
  selectedList: TObject[];
  quickGroups: TObject[][];
};

export type PlayerSelectionGroupDetailsObject = {
  getObjectId(): { objectType: number; objectId: number };
  hasExplosives(): boolean;
  canAttack(): boolean;
  canBeRepaired(): boolean;
  canPickupGrenades(): boolean;
  showWaypoints(): void;
};

export type PlayerSelectionGroupDetailsState = {
  haveExplosives: boolean;
  canPickupGrenades: boolean;
  canMove: boolean;
  canEquip: boolean;
  canAttack: boolean;
  canRepair: boolean;
  canBeRepaired: boolean;
  selectedList: PlayerSelectionGroupDetailsObject[];
};

export type PlayerSelectionDeleteObjectState =
  PlayerSelectionGroupDetailsState & {
    quickGroups: PlayerSelectionGroupDetailsObject[][];
  };

export type PlayerSelectionGroupDetailsQuickGroupObject =
  PlayerSelectionGroupDetailsObject & PlayerSelectionQuickGroupObject;

export type PlayerSelectionLoadGroupState = Omit<
  PlayerSelectionGroupDetailsState,
  "selectedList"
> & {
  selectedList: PlayerSelectionGroupDetailsQuickGroupObject[];
  quickGroups: PlayerSelectionGroupDetailsQuickGroupObject[][];
};

/**
 * Port of upstream `SpaceBarEvent`.
 * Role: Stores a retained space-bar focus action for object selection or GUI opening.
 * Upstream: zplayer.h:109-150
 */
export class SpaceBarEvent {
  refId = -1;
  selectObject = false;
  openGui = false;
  creationTime: number;

  constructor(refId = -1, selectObject = false, openGui = false, now = currentTime()) {
    this.clear();
    this.refId = refId;
    this.selectObject = selectObject;
    this.openGui = openGui;
    this.creationTime = now;
  }

  /**
   * Port of upstream `SpaceBarEvent::clear`.
   * Role: Resets the retained action target and action flags.
   * Upstream: zplayer.h:122-127
   */
  clear(): void {
    this.refId = -1;
    this.selectObject = false;
    this.openGui = false;
  }

  /**
   * Port of upstream `SpaceBarEvent::past_lifetime`.
   * Role: Reports whether the retained space-bar focus action has expired.
   * Upstream: zplayer.h:129-132
   */
  pastLifetime(now = currentTime()): boolean {
    return isPastSpaceBarEventLifetime(this, now);
  }

  /**
   * Port of upstream `SpaceBarEvent::operator==`.
   * Role: Compares retained space-bar focus actions by object reference id only.
   * Upstream: zplayer.h:139-149
   */
  equals(other: SpaceBarEvent): boolean {
    return other === this || other.refId === this.refId;
  }
}

/**
 * Port of upstream `space_event_list` field usage in `ZPlayer`.
 * Role: Holds retained space-bar focus events in newest-first order.
 * Upstream: zplayer.cpp:3944-3957
 */
export type PlayerSpaceBarEventListState = {
  spaceEventList: SpaceBarEvent[];
};

/**
 * Port of upstream `ZPlayer::AddSpaceBarEvent`.
 * Role: Inserts a newest space-bar event, removing duplicates and retaining the bounded history.
 * Upstream: zplayer.cpp:3941-3958
 */
export function addPlayerSpaceBarEvent(
  state: PlayerSpaceBarEventListState,
  newEvent: SpaceBarEvent,
): void {
  state.spaceEventList = state.spaceEventList.filter(
    (event) => !newEvent.equals(event),
  );
  state.spaceEventList.unshift(newEvent);

  if (state.spaceEventList.length >= PLAYER_MAX_STORED_SPACE_BAR_EVENTS) {
    state.spaceEventList.length = PLAYER_MAX_STORED_SPACE_BAR_EVENTS;
  }
}

/**
 * Port of upstream `mouse_button_info` constructor.
 * Role: Creates a cleared mouse button interaction state.
 * Upstream: zplayer.h:95-104
 */
export function createMouseButtonInfo(): MouseButtonInfo {
  return {
    x: 0,
    y: 0,
    mapX: 0,
    mapY: 0,
    down: false,
    startedOverHud: false,
    startedOverGui: false,
  };
}

/**
 * Port of upstream `ZPlayer::rclick_event`.
 * Role: Records that the right mouse button is held.
 * Upstream: zplayer_events.cpp:385-388
 */
export function playerRightClickEvent(
  player: PlayerMouseButtonState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.rbutton.down = true;
}

/**
 * Port of upstream `ZPlayer::mclick_event`.
 * Role: Records that the middle mouse button is held.
 * Upstream: zplayer_events.cpp:431-434
 */
export function playerMiddleClickEvent(
  player: PlayerMouseButtonState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.mbutton.down = true;
}

/**
 * Port of upstream `ZPlayer::munclick_event`.
 * Role: Records that the middle mouse button is released.
 * Upstream: zplayer_events.cpp:436-439
 */
export function playerMiddleUnclickEvent(
  player: PlayerMouseButtonState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.mbutton.down = false;
}

/**
 * Port of upstream `ZPlayer::test_event`.
 * Role: Builds the diagnostic message that the native player printed for test events.
 * Upstream: zplayer_events.cpp:610-613
 */
export function playerTestEvent(
  player: object | null,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): string | null {
  void player;
  void dummy;

  if (!size) {
    return null;
  }

  return `ZPlayer::test_event:${String(data ?? "")}...`;
}

/**
 * Port of upstream `ZPlayer::clear_player_list_event`.
 * Role: Clears tracked player metadata.
 * Upstream: zplayer_events.cpp:1157-1160
 */
export function clearPlayerInfoListEvent(
  player: PlayerInfoListState,
  data: Uint8Array | string | null,
  size: number,
  dummy: number,
): void {
  void data;
  void size;
  void dummy;
  player.playerInfo.length = 0;
}

/**
 * Port of upstream `ZPlayer::DoMouseScrollRight`.
 * Role: Reports whether grabbed mouse input is at the right screen edge.
 * Upstream: zplayer.cpp:1889-1892
 */
export function doPlayerMouseScrollRight(state: PlayerMouseScrollState): boolean {
  return state.mouseX > state.screenWidth - 10 && state.inputGrabbed;
}

/**
 * Port of upstream `ZPlayer::DoMouseScrollLeft`.
 * Role: Reports whether grabbed mouse input is at the left screen edge.
 * Upstream: zplayer.cpp:1894-1897
 */
export function doPlayerMouseScrollLeft(state: PlayerMouseScrollState): boolean {
  return state.mouseX < 10 && state.inputGrabbed;
}

/**
 * Port of upstream `ZPlayer::DoMouseScrollUp`.
 * Role: Reports whether grabbed mouse input is at the top screen edge.
 * Upstream: zplayer.cpp:1899-1902
 */
export function doPlayerMouseScrollUp(state: PlayerMouseScrollState): boolean {
  return state.mouseY < 10 && state.inputGrabbed;
}

/**
 * Port of upstream `ZPlayer::DoMouseScrollDown`.
 * Role: Reports whether grabbed mouse input is at the bottom screen edge.
 * Upstream: zplayer.cpp:1904-1907
 */
export function doPlayerMouseScrollDown(state: PlayerMouseScrollState): boolean {
  return state.mouseY > state.screenHeight - 10 && state.inputGrabbed;
}

/**
 * Port of upstream `ZPlayer::SetDimensions`.
 * Role: Updates initial and previous player viewport dimensions when positive.
 * Upstream: zplayer.cpp:325-329
 */
export function setPlayerDimensions(
  state: PlayerDimensionState,
  width: number,
  height: number,
): void {
  if (width > 0) {
    state.prevW = width;
    state.initW = width;
  }

  if (height > 0) {
    state.prevH = height;
    state.initH = height;
  }
}

/**
 * Port of upstream `ZPlayer::IsOverHUD`.
 * Role: Reports whether a rectangle overlaps the player's reserved HUD area.
 * Upstream: zplayer.cpp:3121-3127
 */
export function isPlayerOverHud(
  state: PlayerInitialDimensionState,
  x: number,
  y: number,
  width: number,
  height: number,
  hudWidth = 100,
  hudHeight = 36,
): boolean {
  if (x + width >= state.initW - hudWidth) return true;
  if (y + height >= state.initH - hudHeight) return true;

  return false;
}

/**
 * Port of upstream `ZPlayer::MapCoordsOfMouseWithHud`.
 * Role: Converts the player mouse position to map coordinates, allowing HUD minimap override.
 * Upstream: zplayer.cpp:2713-2717
 */
export function mapCoordsOfPlayerMouseWithHud(
  state: PlayerMouseMapHudState,
  map: PlayerMapCoordsProvider,
  hud: PlayerHudMiniMapProvider,
): { mapX: number; mapY: number } {
  const mapCoords = map.getMapCoords(state.mouseX, state.mouseY);

  return hud.overMiniMap(
    state.mouseX,
    state.mouseY,
    state.initW,
    state.initH,
    mapCoords.x,
    mapCoords.y,
  );
}

/**
 * Port of upstream `ZPlayer::SetPlaceCannonCords`.
 * Role: Updates cannon placement tile coordinates from mouse position and map view shift.
 * Upstream: zplayer.cpp:3532-3548
 */
export function setPlayerPlaceCannonCoords(
  state: PlayerPlaceCannonState,
  map: PlayerViewShiftProvider,
): void {
  if (!state.placeCannon) return;

  const viewShift = map.getViewShift();
  const mapX = state.mouseX + viewShift.x;
  const mapY = state.mouseY + viewShift.y;

  state.placeCannonTileX = Math.trunc(mapX / 16);
  state.placeCannonTileY = Math.trunc(mapY / 16);
}

/**
 * Port of upstream `ZPlayer::ShowPcursor`.
 * Role: Shows the placement cursor at a map point for three seconds.
 * Upstream: zplayer.cpp:2056-2063
 */
export function showPlayerPlacementCursor(
  state: PlayerPlacementCursorState,
  mouseX: number,
  mouseY: number,
  now: number,
): void {
  state.pcursorDeathTime = now + 3.0;
  state.pcursorX = mouseX;
  state.pcursorY = mouseY;
}

/**
 * Port of upstream `ZPlayer::DoKeyScrollRight`.
 * Role: Reports rightward keyboard scroll unless the opposite direction is held.
 * Upstream: zplayer.cpp:1909-1912
 */
export function doPlayerKeyScrollRight(state: PlayerScrollKeyState): boolean {
  return state.rightDown && !state.leftDown;
}

/**
 * Port of upstream `ZPlayer::DoKeyScrollLeft`.
 * Role: Reports leftward keyboard scroll unless the opposite direction is held.
 * Upstream: zplayer.cpp:1914-1917
 */
export function doPlayerKeyScrollLeft(state: PlayerScrollKeyState): boolean {
  return !state.rightDown && state.leftDown;
}

/**
 * Port of upstream `ZPlayer::DoKeyScrollUp`.
 * Role: Reports upward keyboard scroll unless the opposite direction is held.
 * Upstream: zplayer.cpp:1919-1922
 */
export function doPlayerKeyScrollUp(state: PlayerScrollKeyState): boolean {
  return state.upDown && !state.downDown;
}

/**
 * Port of upstream `ZPlayer::DoKeyScrollDown`.
 * Role: Reports downward keyboard scroll unless the opposite direction is held.
 * Upstream: zplayer.cpp:1924-1927
 */
export function doPlayerKeyScrollDown(state: PlayerScrollKeyState): boolean {
  return !state.upDown && state.downDown;
}

/**
 * Port of upstream `ZPlayer::ShiftDown`.
 * Role: Reports whether either shift key is held.
 * Upstream: zplayer.cpp:3106-3109
 */
export function isPlayerShiftDown(state: PlayerModifierKeyState): boolean {
  return state.leftShiftDown || state.rightShiftDown;
}

/**
 * Port of upstream `ZPlayer::CtrlDown`.
 * Role: Reports whether either control key is held.
 * Upstream: zplayer.cpp:3111-3114
 */
export function isPlayerCtrlDown(state: PlayerModifierKeyState): boolean {
  return state.leftCtrlDown || state.rightCtrlDown;
}

/**
 * Port of upstream `ZPlayer::AltDown`.
 * Role: Reports whether either alt key is held.
 * Upstream: zplayer.cpp:3116-3119
 */
export function isPlayerAltDown(state: PlayerModifierKeyState): boolean {
  return state.leftAltDown || state.rightAltDown;
}

/**
 * Port of upstream `ZPlayer::SetLoginName`.
 * Role: Stores the player login name.
 * Upstream: zplayer.cpp:267-270
 */
export function setPlayerLoginName(state: PlayerLoginState, loginName: string): void {
  state.loginName = loginName;
}

/**
 * Port of upstream `ZPlayer::SetLoginPassword`.
 * Role: Stores the player login password.
 * Upstream: zplayer.cpp:272-275
 */
export function setPlayerLoginPassword(
  state: PlayerLoginState,
  loginPassword: string,
): void {
  state.loginPassword = loginPassword;
}

/**
 * Port of upstream `ZPlayer::ClearAsciiStates`.
 * Role: Clears every tracked ASCII key state.
 * Upstream: zplayer.cpp:3081-3084
 */
export function clearPlayerAsciiStates(state: PlayerAsciiState): void {
  for (let i = 0; i < PLAYER_ASCII_DOWN_MAX; i += 1) {
    state.asciiDown[i] = false;
  }
}

/**
 * Port of upstream `ZPlayer::SetAsciiState`.
 * Role: Updates one lowercase ASCII key state when the key is tracked.
 * Upstream: zplayer.cpp:3086-3094
 */
export function setPlayerAsciiState(
  state: PlayerAsciiState,
  charCode: number,
  isDown: boolean,
): void {
  const index = charCode - "a".charCodeAt(0);

  if (index < 0) return;
  if (index >= PLAYER_ASCII_DOWN_MAX) return;

  state.asciiDown[index] = isDown;
}

/**
 * Port of upstream `ZPlayer::AsciiDown`.
 * Role: Reads one lowercase ASCII key state when the key is tracked.
 * Upstream: zplayer.cpp:3096-3104
 */
export function isPlayerAsciiDown(
  state: PlayerAsciiState,
  charCode: number,
): boolean {
  const index = charCode - "a".charCodeAt(0);

  if (index < 0) return false;
  if (index >= PLAYER_ASCII_DOWN_MAX) return false;

  return state.asciiDown[index];
}

/**
 * Port of upstream `ZPlayer::ClearAnimals`.
 * Role: Removes tracked bird animation references.
 * Upstream: zplayer.cpp:588-591
 */
export function clearPlayerAnimals(state: PlayerAnimalState): void {
  state.birdList.length = 0;
}

/**
 * Port of upstream `ZPlayer::A_Button`.
 * Role: Button hook with no upstream behavior.
 * Upstream: zplayer.cpp:1600-1603
 */
export function playerAButton(): void {}

/**
 * Port of upstream `ZPlayer::B_Button`.
 * Role: Toggles the factory-list GUI when it is available.
 * Upstream: zplayer.cpp:1605-1608
 */
export function playerBButton(state: PlayerFactoryListGuiState): void {
  state.guiFactoryList?.toggleShow();
}

/**
 * Port of upstream `ZPlayer::D_Button`.
 * Role: Button hook with no upstream behavior.
 * Upstream: zplayer.cpp:1610-1613
 */
export function playerDButton(): void {}

/**
 * Port of upstream `ZPlayer::Menu_Button`.
 * Role: Opens the main menu screen from the player button hook.
 * Upstream: zplayer.cpp:1621-1624
 */
export function playerMenuButton(player: PlayerMainMenuLoader): void {
  player.loadMainMenu(MainMenuType.MainMain);
}

/**
 * Port of upstream `ZPlayer::MainMenuMove`.
 * Role: Applies a movement scale to every active main-menu overlay.
 * Upstream: zplayer.cpp:3129-3133
 */
export function movePlayerMainMenus(
  state: PlayerMainMenuMoveState,
  px: number,
  py: number,
): void {
  for (const menu of state.guiMenuList) {
    menu.move(px, py);
  }
}

/**
 * Port of upstream `ZPlayer::T_Button`.
 * Role: Button hook with no upstream behavior.
 * Upstream: zplayer.cpp:1632-1635
 */
export function playerTButton(): void {}

/**
 * Port of upstream `ZPlayer::Z_Button`.
 * Role: Button hook with no upstream behavior.
 * Upstream: zplayer.cpp:1643-1646
 */
export function playerZButton(): void {}

/**
 * Port of upstream `ZPlayer::DisableCursor`.
 * Role: Stores whether the Z cursor should be disabled.
 * Upstream: zplayer.cpp:282-285
 */
export function disablePlayerCursor(
  state: PlayerCursorState,
  disableZCursor: boolean,
): void {
  state.disableZCursor = disableZCursor;
}

/**
 * Port of upstream `ZPlayer::SetSoundsOff`.
 * Role: Toggles music playback opposite to the requested sounds-off flag.
 * Upstream: zplayer.cpp:287-290
 */
export function setPlayerSoundsOff(
  soundsOff: boolean,
  setMusicOn: (musicOn: boolean) => void,
): void {
  setMusicOn(!soundsOff);
}

/**
 * Port of upstream `ZPlayer::SetMusicOff`.
 * Role: Toggles music playback opposite to the requested music-off flag.
 * Upstream: zplayer.cpp:292-296
 */
export function setPlayerMusicOff(
  musicOff: boolean,
  setMusicOn: (musicOn: boolean) => void,
): void {
  setMusicOn(!musicOff);
}

/**
 * Port of upstream `ZPlayer::SetNextSoundSetting`.
 * Role: Advances the current audio setting through the player sound-setting setter.
 * Upstream: zplayer.cpp:3899-3902
 */
export function setNextPlayerSoundSetting(
  state: PlayerSoundSettingState,
  setSoundSetting: (soundSetting: number) => void,
): void {
  setSoundSetting(state.soundSetting + 1);
}

/**
 * Port of upstream `ZPlayer::ExitProgram`.
 * Role: Closes audio and requests application exit with the native success code.
 * Upstream: zplayer.cpp:2310-2314
 */
export function exitPlayerProgram(actions: PlayerExitProgramActions): void {
  actions.closeAudio();
  actions.exit(0);
}

/**
 * Port of upstream `past_lifetime`.
 * Role: Reports whether a space-bar focus event has exceeded its active lifetime.
 * Upstream: zplayer.h:129-132
 */
export function isPastSpaceBarEventLifetime(
  event: SpaceBarEventLifetimeState,
  now = currentTime(),
): boolean {
  return now > event.creationTime + PLAYER_SPACE_BAR_EVENT_LIFETIME_SECONDS;
}

/**
 * Port of upstream `selection_info::SetZTime`.
 * Role: Stores the simulation clock reference for player selection state.
 * Upstream: zplayer.h:53
 */
export function setPlayerSelectionZTime(
  state: PlayerSelectionZTimeState,
  ztime: SimulationTime,
): void {
  state.ztime = ztime;
}

/**
 * Port of upstream `selection_info::Clear`.
 * Role: Resets selection capabilities and removes all selected object references.
 * Upstream: zplayer.h:55-65
 */
export function clearPlayerSelectionInfo(state: PlayerSelectionClearState): void {
  state.haveExplosives = false;
  state.canPickupGrenades = false;
  state.canMove = false;
  state.canEquip = false;
  state.canAttack = false;
  state.canRepair = false;
  state.canBeRepaired = false;
  state.selectedList.length = 0;
}

/**
 * Port of upstream `selection_info::ClearAll`.
 * Role: Resets current selection state and clears all quick-selection groups.
 * Upstream: zplayer.h:66-71
 */
export function clearAllPlayerSelectionInfo(
  state: PlayerSelectionClearAllState,
): void {
  clearPlayerSelectionInfo(state);

  for (let i = 0; i < 10; i += 1) {
    state.quickGroups[i]?.splice(0);
  }
}

/**
 * Port of upstream `selection_info::ObjectIsSelected`.
 * Role: Reports whether the exact object reference is currently selected.
 * Upstream: zplayer.cpp:141-150
 */
export function isPlayerObjectSelected<TObject>(
  state: PlayerObjectSelectionState<TObject>,
  object: TObject | null,
): boolean {
  if (!object) return false;

  return state.selectedList.includes(object);
}

/**
 * Port of upstream `ZPlayer::GiveHudSelected`.
 * Role: Forwards a random selected object to the HUD or clears HUD selection when empty.
 * Upstream: zplayer.cpp:3032-3041
 */
export function givePlayerHudSelected<TObject>(
  state: PlayerHudSelectedState<TObject>,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  if (state.selectedList.length) {
    const choice = Math.trunc(randomInt()) % state.selectedList.length;
    state.hud.setSelectedObject(state.selectedList[choice] ?? null);
    return;
  }

  state.hud.setSelectedObject(null);
}

/**
 * Port of upstream `selection_info::AverageCoordsOfSelected`.
 * Role: Returns the average center coordinates of the current selection.
 * Upstream: zplayer.cpp:22-43
 */
export function averageCoordsOfPlayerSelection(
  state: PlayerObjectSelectionState<PlayerSelectionCenteredObject>,
): { x: number; y: number } | null {
  if (!state.selectedList.length) return null;

  let x = 0;
  let y = 0;

  for (const selected of state.selectedList) {
    const center = selected.getCenterCoords();
    x += center.x;
    y += center.y;
  }

  return {
    x: Math.trunc(x / state.selectedList.length),
    y: Math.trunc(y / state.selectedList.length),
  };
}

/**
 * Port of upstream `selection_info::SetGroup`.
 * Role: Stores current selection into a quick group and updates unit group numbers.
 * Upstream: zplayer.cpp:70-89
 */
export function setPlayerSelectionGroup<
  TObject extends PlayerSelectionQuickGroupObject,
>(state: PlayerSelectionQuickGroupState<TObject>, group: number): void {
  const previousGroup = state.quickGroups[group] ?? [];

  for (const selected of previousGroup) {
    selected.setGroup(-1);
  }

  state.quickGroups[group] = [...state.selectedList];

  for (const selected of state.selectedList) {
    selected.setGroup(group);
  }
}

/**
 * Port of upstream `selection_info::LoadGroup`.
 * Role: Loads a quick group into the current selection and refreshes group details.
 * Upstream: zplayer.cpp:57-68
 */
export function loadPlayerSelectionGroup(
  state: PlayerSelectionLoadGroupState,
  group: number,
): void {
  state.selectedList = [...(state.quickGroups[group] ?? [])];

  for (const selected of state.selectedList) {
    selected.setGroup(group);
  }

  setupPlayerSelectionGroupDetails(state, false);
}

/**
 * Port of upstream `selection_info::SetupGroupDetails`.
 * Role: Recomputes selected-group action flags and refreshes selected waypoints.
 * Upstream: zplayer.cpp:107-139
 */
export function setupPlayerSelectionGroupDetails(
  state: PlayerSelectionGroupDetailsState,
  showWaypoints: boolean,
): void {
  void showWaypoints;

  state.haveExplosives = false;
  state.canPickupGrenades = false;
  state.canMove = false;
  state.canEquip = false;
  state.canAttack = false;

  for (const selected of state.selectedList) {
    const { objectType, objectId } = selected.getObjectId();

    if (objectType === MapObjectType.Robot) state.canEquip = true;
    if (objectType !== MapObjectType.Cannon) state.canMove = true;
    if (objectType === MapObjectType.Vehicle && objectId === VehicleType.Crane) {
      state.canRepair = true;
    }

    if (selected.hasExplosives()) state.haveExplosives = true;
    if (selected.canAttack()) state.canAttack = true;
    if (selected.canBeRepaired()) state.canBeRepaired = true;
    if (selected.canPickupGrenades()) state.canPickupGrenades = true;

    selected.showWaypoints();
  }
}

/**
 * Port of upstream `selection_info::UpdateGroupMember`.
 * Role: Refreshes selected-group details only when the object is selected.
 * Upstream: zplayer.cpp:91-105
 */
export function updatePlayerSelectionGroupMember(
  state: PlayerSelectionGroupDetailsState,
  object: PlayerSelectionGroupDetailsObject,
): boolean {
  if (!state.selectedList.includes(object)) return false;

  setupPlayerSelectionGroupDetails(state, false);
  return true;
}

/**
 * Port of upstream `selection_info::RemoveFromSelected`.
 * Role: Removes an object from the selected list and refreshes group action flags.
 * Upstream: zplayer.cpp:16-20
 */
export function removePlayerObjectFromSelection(
  state: PlayerSelectionGroupDetailsState,
  object: PlayerSelectionGroupDetailsObject,
): void {
  for (let i = 0; i < state.selectedList.length; ) {
    if (state.selectedList[i] === object) {
      state.selectedList.splice(i, 1);
    } else {
      i += 1;
    }
  }

  setupPlayerSelectionGroupDetails(state, false);
}

/**
 * Port of upstream `selection_info::DeleteObject`.
 * Role: Removes an object from current selection and quick groups, then refreshes flags.
 * Upstream: zplayer.cpp:6-14
 */
export function deletePlayerObjectFromSelection(
  state: PlayerSelectionDeleteObjectState,
  object: PlayerSelectionGroupDetailsObject,
): void {
  for (let i = 0; i < state.selectedList.length; ) {
    if (state.selectedList[i] === object) {
      state.selectedList.splice(i, 1);
    } else {
      i += 1;
    }
  }

  for (let groupIndex = 0; groupIndex < 10; groupIndex += 1) {
    const quickGroup = state.quickGroups[groupIndex];
    if (!quickGroup) continue;

    for (let i = 0; i < quickGroup.length; ) {
      if (quickGroup[i] === object) {
        quickGroup.splice(i, 1);
      } else {
        i += 1;
      }
    }
  }

  setupPlayerSelectionGroupDetails(state, false);
}

/**
 * Port of upstream `selection_info::GroupIsSelected`.
 * Role: Reports whether a quick group exactly matches the current selection order.
 * Upstream: zplayer.cpp:45-55
 */
export function isPlayerSelectionGroupSelected<TObject>(
  state: { selectedList: TObject[]; quickGroups: TObject[][] },
  group: number,
): boolean {
  if (!state.selectedList.length) return false;

  const quickGroup = state.quickGroups[group] ?? [];
  if (state.selectedList.length !== quickGroup.length) return false;

  for (let i = 0; i < state.selectedList.length; i += 1) {
    if (state.selectedList[i] !== quickGroup[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Port of upstream `ZPlayer::ClearDevWayPointsOfSelected`.
 * Role: Clears development waypoint lists for every selected object.
 * Upstream: zplayer.cpp:2707-2711
 */
export function clearPlayerSelectedDevWaypoints(
  state: PlayerSelectedWaypointDevListState,
): void {
  for (const selected of state.selectedList) {
    selected.getWayPointDevList().length = 0;
  }
}

/**
 * Port of upstream `max_items`.
 * Role: Defines the number of graphics initialization steps tracked by load progress.
 * Upstream: zplayer.cpp:476
 */
export const PLAYER_GRAPHICS_LOAD_ITEM_COUNT = 81;

/**
 * Port of upstream `lasting_time`.
 * Role: Defines how long player news entries remain active.
 * Upstream: zplayer.cpp:600
 */
export const PLAYER_NEWS_ACTIVE_DURATION_SECONDS = 17.0;

/**
 * Port of upstream `shift_tick`.
 * Role: Defines the animation tick for the drag-selection shift marker.
 * Upstream: zplayer.cpp:1378
 */
export const PLAYER_SELECTION_SHIFT_TICK_SECONDS = 0.1;

/**
 * Port of upstream `shift_speed`.
 * Role: Defines keyboard edge-scroll speed in map pixels per second.
 * Upstream: zplayer.cpp:1932
 */
export const PLAYER_SCROLL_SPEED_PIXELS_PER_SECOND = 400;

/**
 * Port of upstream `y_int`.
 * Role: Defines vertical spacing between rendered news entries.
 * Upstream: zplayer.cpp:2068
 */
export const PLAYER_NEWS_ROW_SPACING_PIXELS = 15;

/**
 * Port of upstream `start_fade_time`.
 * Role: Defines when rendered news entries begin fading.
 * Upstream: zplayer.cpp:2069
 */
export const PLAYER_NEWS_FADE_START_SECONDS = 5;

/**
 * Port of upstream `max_news_history`.
 * Role: Defines the maximum number of news entries kept for rendering.
 * Upstream: zplayer.cpp:2070
 */
export const PLAYER_MAX_NEWS_HISTORY = 50;

/**
 * Port of upstream `fade_per_second`.
 * Role: Defines splash screen fade speed.
 * Upstream: zplayer.cpp:2413
 */
export const PLAYER_SPLASH_FADE_PER_SECOND = 5;
