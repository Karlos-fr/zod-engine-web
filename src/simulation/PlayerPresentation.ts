/**
 * Upstream: zplayer.h / zplayer.cpp
 */

import type { SoundSetting } from "../audio/AudioService";
import { HUD_HEIGHT_PIXELS, HUD_WIDTH_PIXELS, HudButton } from "../ui/HudLayout";
import { MainMenuType } from "../ui/MainMenuBase";
import { AMBIENT_BIRD_SQUARE_TILES_PER_BIRD } from "../world/BirdMap";
import { MapObjectType } from "../world/MapFormat";
import { currentTime } from "./Common";
import { TcpEvent, type PlaceCannonPacket } from "./EventHandler";
import { BuildingType, TeamType, VehicleType } from "./SimulationConstants";
import {
  crossReferenceUnits,
  UnitCrossReference,
  type UnitCrossReferenceTable,
} from "./UnitRating";
import { WaypointMode } from "./entities/EntityTypes";
import type { GameEntity } from "./entities/GameEntity";
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
 * Role: Opens main-menu screens from player UI actions.
 * Upstream: zplayer.cpp:1623
 */
export type PlayerMainMenuLoader = {
  loadMainMenu(menuType: MainMenuType): void;
};

/**
 * Port of upstream `ZGuiMainMenuBase::Move` call target.
 * Role: Moves a main-menu entry during player viewport scaling.
 * Upstream: zplayer.cpp:3131-3132
 */
export type PlayerMainMenuMover = {
  move(px: number, py: number): void;
};

/**
 * Port of upstream `ZGuiMainMenuBase::Motion` call target.
 * Role: Moves a main-menu entry from player mouse motion and reports whether it consumed input.
 * Upstream: zplayer.cpp:3141-3148
 */
export type PlayerMainMenuMotionTarget = {
  getCoords(): { x: number; y: number };
  motion(mouseX: number, mouseY: number): boolean;
  getDimensions(): { width: number; height: number };
};

/**
 * Port of upstream `ZGuiMainMenuBase::WheelUpButton` call target.
 * Role: Attempts to consume wheel-up input on a player main-menu entry.
 * Upstream: zplayer.cpp:3163
 */
export type PlayerMainMenuWheelUpTarget = {
  wheelUpButton(): boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase::WheelDownButton` call target.
 * Role: Attempts to consume wheel-down input on a player main-menu entry.
 * Upstream: zplayer.cpp:3172
 */
export type PlayerMainMenuWheelDownTarget = {
  wheelDownButton(): boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase::KeyPress` call target.
 * Role: Attempts to consume keyboard input on a player main-menu entry.
 * Upstream: zplayer.cpp:3181
 */
export type PlayerMainMenuKeyPressTarget = {
  keyPress(c: number): boolean;
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
 * Port of upstream `gui_menu_list` motion field.
 * Role: Holds active main menus that receive player mouse motion.
 * Upstream: zplayer.cpp:3137
 */
export type PlayerMainMenuMotionState = PlayerInitialDimensionState & {
  mouseX: number;
  mouseY: number;
  guiMenuList: PlayerMainMenuMotionTarget[];
  hud: {
    reRenderAll(): void;
  };
};

/**
 * Port of upstream `gui_menu_list` wheel-up field.
 * Role: Holds active main menus that receive player wheel-up input.
 * Upstream: zplayer.cpp:3162
 */
export type PlayerMainMenuWheelUpState = {
  guiMenuList: PlayerMainMenuWheelUpTarget[];
};

/**
 * Port of upstream `gui_menu_list` wheel-down field.
 * Role: Holds active main menus that receive player wheel-down input.
 * Upstream: zplayer.cpp:3171
 */
export type PlayerMainMenuWheelDownState = {
  guiMenuList: PlayerMainMenuWheelDownTarget[];
};

/**
 * Port of upstream `gui_menu_list` key-press field.
 * Role: Holds active main menus that receive player keyboard input.
 * Upstream: zplayer.cpp:3180
 */
export type PlayerMainMenuKeyPressState = {
  guiMenuList: PlayerMainMenuKeyPressTarget[];
};

/**
 * Port of upstream `ZGuiMainMenuBase::DoKillMe` close target.
 * Role: Closes the first visible player main-menu overlay.
 * Upstream: zplayer.cpp:3591
 */
export type PlayerMainMenuCloseTarget = {
  doKillMe(): void;
};

/**
 * Port of upstream factory-list visibility and toggle targets.
 * Role: Reports and toggles the factory-list GUI used by player close handling.
 * Upstream: zplayer.cpp:3596-3598
 */
export type PlayerFactoryListCloseTarget = {
  isVisible(): boolean;
  toggleShow(): void;
};

/**
 * Port of upstream GUI window close target.
 * Role: Closes the selected production/building GUI window.
 * Upstream: zplayer.cpp:3603
 */
export type PlayerGuiWindowCloseTarget = {
  doKillMe(): void;
};

/**
 * Port of upstream `ZPlayer::CloseCurrentMainMenuEtc` fields.
 * Role: Holds player GUI surfaces closed in visibility priority order.
 * Upstream: zplayer.cpp:3584-3604
 */
export type PlayerCloseCurrentMainMenuEtcState = {
  guiMenuList: PlayerMainMenuCloseTarget[];
  guiFactoryList: PlayerFactoryListCloseTarget | null;
  guiWindow: PlayerGuiWindowCloseTarget | null;
};

/**
 * Port of upstream `ZPlayer::InitMenus` mutable fields.
 * Role: Holds the active login/create-user menu state owned by the player.
 * Upstream: zplayer.cpp:3816-3819
 */
export type PlayerMenuInitState<TTime, TLoginMenu, TCreateUserMenu> = {
  ztime: TTime;
  activeMenu: TLoginMenu | TCreateUserMenu | null;
  loginMenu: TLoginMenu | null;
  createUserMenu: TCreateUserMenu | null;
};

/**
 * Replacement for upstream `GWLogin` and `GWCreateUser` constructors.
 * Role: Creates one player-owned GUI menu with the player simulation clock.
 * Upstream: zplayer.cpp:3818-3819
 */
export type PlayerMenuFactory<TTime, TMenu> = (ztime: TTime) => TMenu;

/**
 * Port of upstream `ZPlayer` client socket send surface.
 * Role: Sends one TCP event payload through the player client socket.
 * Upstream: zplayer.cpp:3777
 */
export type PlayerClientMessageSender = {
  sendMessage(packId: TcpEvent, data: Uint8Array | null, size: number): number;
};

/**
 * Port of upstream `ZPlayer` ASCII client socket send surface.
 * Role: Sends one TCP event with a NUL-terminated ASCII payload.
 * Upstream: zplayer.cpp:3802
 */
export type PlayerClientAsciiMessageSender = {
  sendMessageAscii(packId: TcpEvent, data: string): number;
};

/**
 * Port of upstream `ZPlayer::SendLogin` socket target.
 * Role: Supports login-state requests and optional credential submission.
 * Upstream: zplayer.cpp:3783, zplayer.cpp:3792
 */
export type PlayerLoginMessageSender = PlayerClientMessageSender &
  PlayerClientAsciiMessageSender;

/**
 * Port of upstream `ZHud::SetUnitAmount` call target.
 * Role: Updates the player HUD with available unit count for the local team.
 * Upstream: zplayer.cpp:3078
 */
export type PlayerUnitAmountHud = {
  setUnitAmount(unitAmount: number): void;
};

/**
 * Port of upstream `SetTeam` call targets used by `ZPlayer::SetPlayerTeam`.
 * Role: Receives the local player team from the player controller.
 * Upstream: zplayer.cpp:302-305
 */
export type PlayerTeamTarget = {
  setTeam(team: TeamType): void;
};

/**
 * Port of upstream `ZHud` call targets used by `ZPlayer::SetPlayerTeam`.
 * Role: Receives team, selection, rerender, and unit-count updates.
 * Upstream: zplayer.cpp:303, zplayer.cpp:311-312, zplayer.cpp:3078
 */
export type PlayerTeamHud<TObject = unknown> = PlayerUnitAmountHud &
  PlayerTeamTarget &
  PlayerHudSelectionTarget<TObject> & {
    reRenderAll(): void;
  };

/**
 * Port of upstream `ZPlayer::ProcessChangeObjectAmount` state and call targets.
 * Role: Provides button refresh, unit-limit checks, and team unit counts for HUD updates.
 * Upstream: zplayer.cpp:3074-3078
 */
export type PlayerChangeObjectAmountState = {
  ourTeam: number;
  teamUnitsAvailable: number[];
  hud: PlayerUnitAmountHud;
  reSetupButtons(): void;
  checkUnitLimitReached(): void;
};

/**
 * Port of upstream `ZPlayer::SetPlayerTeam` state and call targets.
 * Role: Stores local team state and resets team-scoped UI, selection, and focus state.
 * Upstream: zplayer.cpp:298-323
 */
export type PlayerSetTeamState<TObject = unknown> =
  PlayerSelectionClearAllState &
    PlayerSpaceBarEventListState &
    Omit<PlayerChangeObjectAmountState, "hud" | "ourTeam"> & {
      ourTeam: TeamType;
      cursor: PlayerTeamTarget;
      hud: PlayerTeamHud<TObject>;
      componentMessage: PlayerTeamTarget;
      guiFactoryList: PlayerTeamTarget | null;
      refindOurFortRefId(): void;
      determineCursor(): void;
    };

/**
 * Port of upstream `ZPlayer::OrderlySelectUnitType` call target.
 * Role: Selects the next buildable unit category for player button shortcuts.
 * Upstream: zplayer.cpp:1618, zplayer.cpp:1629, zplayer.cpp:1640
 */
export type PlayerUnitTypeSelector = {
  orderlySelectUnitType(objectType: MapObjectType): void;
};

/**
 * Port of upstream `ZPlayer::HandleButton` call targets.
 * Role: Provides player HUD button actions for dispatch.
 * Upstream: zplayer.cpp:1588-1596
 */
export type PlayerHudButtonHandler = {
  aButton(): void;
  bButton(): void;
  dButton(): void;
  gButton(): void;
  menuButton(): void;
  rButton(): void;
  tButton(): void;
  vButton(): void;
  zButton(): void;
};

/**
 * Port of upstream `sound_setting` field usage in `ZPlayer`.
 * Role: Holds the player sound setting state.
 * Upstream: zplayer.cpp:3901
 */
export type PlayerSoundSettingState = {
  soundSetting: SoundSetting;
};

/**
 * Port of upstream `use_opengl` rendering flag in `ZPlayer`.
 * Role: Stores whether player rendering uses Canvas command output.
 * Upstream: zplayer.cpp:262-265
 */
export type PlayerCanvasRenderingState = {
  useCanvasRendering: boolean;
};

export type PlayerPassiveEngagableState = {
  passiveEngagableObjectList: GameEntity[];
};

export type PlayerFortRefState = {
  fortRefId: number;
  ourTeam: TeamType;
  objectList: GameEntity[];
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
 * Port of upstream `ZPlayer::StartMouseScrolling` fields.
 * Role: Holds mouse edge-scroll carry and timestamps reset when entering screen-edge scroll zones.
 * Upstream: zplayer.cpp:1862-1887
 */
export type PlayerStartMouseScrollingState = PlayerMouseScrollState & {
  horzScrollOver: number;
  vertScrollOver: number;
  lastHorzScrollTime: number;
  lastVertScrollTime: number;
};

/**
 * Port of upstream `mouse_x`, `mouse_y`, `init_w`, and `init_h` field usage in `ZPlayer`.
 * Role: Holds player viewport fields used for mouse-to-map conversion.
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

export type PlayerPlaceCannonRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ZPlayer::RenderPlaceCannon`.
 * Role: Tracks the active cannon placement marker image and target map tile.
 * Upstream: zplayer.cpp:3550-3564
 */
export type PlayerPlaceCannonRenderState<TSurface> = Pick<
  PlayerPlaceCannonState,
  "placeCannon" | "placeCannonTileX" | "placeCannonTileY"
> & {
  placementImage: TSurface | null;
};

/**
 * Port of upstream `ZPlayer::DoPlaceCannon` mutable fields.
 * Role: Stores the pending cannon placement payload fields.
 * Upstream: zplayer.cpp:3570-3577
 */
export type PlayerDoPlaceCannonState = Pick<
  PlayerPlaceCannonState,
  "placeCannon" | "placeCannonTileX" | "placeCannonTileY"
> & {
  placeCannonRefId: number;
  placeCannonObjectId: number;
};

/**
 * Port of upstream `sizeof(place_cannon_packet)`.
 * Role: Matches the raw C packet size, including trailing struct padding.
 * Upstream: event_handler.h:83-88
 */
export const PLAYER_PLACE_CANNON_PACKET_SIZE_BYTES = 16;

/**
 * Port of upstream `ZMap::GetMapCoords` call target.
 * Role: Converts player mouse coordinates into map coordinates.
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
 * Port of upstream `ZMap::GetViewShiftFull` call target.
 * Role: Provides the current map view shift and viewport dimensions for camera focusing.
 * Upstream: zplayer.cpp:1780
 */
export type PlayerViewShiftFullProvider = {
  getViewShiftFull(): {
    x: number;
    y: number;
    viewWidth: number;
    viewHeight: number;
  };
};

/**
 * Port of upstream `ZPlayer::FocusCameraTo` fields.
 * Role: Holds the active smooth camera-focus destination and timing.
 * Upstream: zplayer.cpp:1775-1800
 */
export type PlayerFocusCameraState = {
  zmap: PlayerViewShiftFullProvider;
  focusToX: number;
  focusToY: number;
  focusToOriginalDistance: number;
  lastFocusToTime: number;
  finalFocusToTime: number;
  doFocusTo: boolean;
};

export type PlayerFocusFortMap = {
  loaded(): boolean;
  getViewShiftFull(): {
    x: number;
    y: number;
    viewWidth: number;
    viewHeight: number;
  };
  setViewShift(x: number, y: number): void;
};

export type PlayerFocusFortObject = {
  getOwner(): TeamType;
  getObjectId(): { objectType: number; objectId: number };
  getCenterCoords(): { x: number; y: number };
};

/**
 * Port of upstream `ZPlayer::FocusCameraToFort` state.
 * Role: Holds map and object data needed to center the camera on the local fort.
 * Upstream: zplayer.cpp:1743-1773
 */
export type PlayerFocusCameraToFortState = {
  ourTeam: TeamType;
  objectList: readonly PlayerFocusFortObject[];
  zmap: PlayerFocusFortMap;
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

/**
 * Replacement for upstream `SDL_SetVideoMode` in player resize handling.
 * Role: Receives the requested display mode after a player viewport resize.
 * Upstream: zplayer_events.cpp:173-185
 */
export type PlayerResizeVideoModeTarget = {
  setVideoMode(options: {
    width: number;
    height: number;
    bitsPerPixel: number;
    useOpenGl: boolean;
    resizable: boolean;
    fullscreen: boolean;
    hardwareSurface: boolean;
    doubleBuffer: boolean;
  }): void;
};

/**
 * Port of upstream resize rendering surfaces.
 * Role: Receives screen, HUD, and map dimension refreshes after a player resize.
 * Upstream: zplayer_events.cpp:178-192
 */
export type PlayerResizeRenderTargets = {
  resetOpenGlViewPort(width: number, height: number): void;
  setScreenDimensions(width: number, height: number): void;
  hud: { reRenderAll(): void };
  zmap: { setViewingDimensions(width: number, height: number): void };
};

/**
 * Port of upstream `ZPlayer::resize_event` state.
 * Role: Holds resize flags, dimensions, render targets, and main-menu motion handling.
 * Upstream: zplayer_events.cpp:169-200
 */
export type PlayerResizeEventState = PlayerDimensionState &
  PlayerResizeRenderTargets & {
    useOpenGl: boolean;
    isWindowed: boolean;
    mainMenuMove(widthScale: number, heightScale: number): void;
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

export type PlayerAnimalMapBasics = {
  width: number;
  height: number;
  terrainType: number;
};

export type PlayerAnimalMapBasicsProvider = {
  getMapBasics(): PlayerAnimalMapBasics;
};

export type PlayerAmbientBirdOptions = {
  terrainType: number;
  mapWidthPixels: number;
  mapHeightPixels: number;
};

export type PlayerAmbientBirdFactory<TAnimal> = (
  options: PlayerAmbientBirdOptions,
) => TAnimal;

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
 * Replacement for upstream `ZCursor::Render` in player placement feedback.
 * Role: Renders a placement cursor at map coordinates.
 * Upstream: zplayer.cpp:2018
 */
export type PlayerPlacementCursorRenderer<TCommand> = (
  x: number,
  y: number,
  restrictToMap: boolean,
) => TCommand | null;

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

export type PlayerDevWaypoint = {
  mode: number;
  refId: number;
};

export type PlayerDevWaypointObject = {
  getWayPointDevList(): PlayerDevWaypoint[];
  getObjectId(): { objectType: number; objectId: number };
};

export type PlayerDevWaypointsNoWayState = {
  selectedList: PlayerDevWaypointObject[];
  unitCrossReferences: UnitCrossReferenceTable | null;
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

export type PlayerSelectableZObject = PlayerSelectionGroupDetailsObject & {
  getGroupLeader(): PlayerSelectableZObject | null;
  selectable(): boolean;
  getOwner(): number;
};

export type PlayerSelectZObjectState<
  TObject extends PlayerSelectableZObject = PlayerSelectableZObject,
> = Omit<PlayerSelectionGroupDetailsState, "selectedList"> & {
  ourTeam: number;
  selectedList: TObject[];
  hud: PlayerHudSelectionTarget<TObject>;
  determineCursor(): void;
  clearDevWaypointsOfSelected(): void;
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

export type PlayerLoadControlGroupObject =
  PlayerSelectionGroupDetailsQuickGroupObject &
    PlayerSelectionCenteredObject &
    PlayerSelectedWaypointDevListSource;

/**
 * Port of upstream `ZPlayer::LoadControlGroup` fields.
 * Role: Holds quick-group selection state and player refresh hooks used when loading a control group.
 * Upstream: zplayer.cpp:2719-2738
 */
export type PlayerLoadControlGroupState<
  TObject extends PlayerLoadControlGroupObject = PlayerLoadControlGroupObject,
> = Omit<PlayerSelectionLoadGroupState, "selectedList" | "quickGroups"> & {
  selectedList: TObject[];
  quickGroups: TObject[][];
  hud: PlayerHudSelectionTarget<TObject>;
  focusCameraTo(mapX: number, mapY: number): void;
  determineCursor(): void;
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
 * Port of upstream `ZPlayer::StartMouseScrolling`.
 * Role: Resets edge-scroll carry and timestamps when grabbed input enters a screen-edge scroll zone.
 * Upstream: zplayer.cpp:1862-1887
 */
export function startPlayerMouseScrolling(
  state: PlayerStartMouseScrollingState,
  newMouseX: number,
  newMouseY: number,
  now = currentTime(),
): void {
  if (!state.inputGrabbed) return;

  if (!(state.mouseX < 10) && newMouseX < 10) {
    state.horzScrollOver = 0;
    state.lastHorzScrollTime = now;
  } else if (
    !(state.mouseX > state.screenWidth - 10) &&
    newMouseX > state.screenWidth - 10
  ) {
    state.horzScrollOver = 0;
    state.lastHorzScrollTime = now;
  }

  if (!(state.mouseY < 10) && newMouseY < 10) {
    state.vertScrollOver = 0;
    state.lastVertScrollTime = now;
  } else if (
    !(state.mouseY > state.screenHeight - 10) &&
    newMouseY > state.screenHeight - 10
  ) {
    state.vertScrollOver = 0;
    state.lastVertScrollTime = now;
  }
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
 * Port of upstream `ZPlayer::resize_event`.
 * Role: Refreshes display mode, viewport surfaces, HUD/map dimensions, and scaled menus.
 * Upstream: zplayer_events.cpp:169-200
 */
export function playerResizeEvent(
  player: PlayerResizeEventState,
  videoMode: PlayerResizeVideoModeTarget,
): void {
  videoMode.setVideoMode({
    width: player.initW,
    height: player.initH,
    bitsPerPixel: player.useOpenGl ? 0 : 32,
    useOpenGl: player.useOpenGl,
    resizable: true,
    fullscreen: !player.isWindowed,
    hardwareSurface: !player.useOpenGl,
    doubleBuffer: !player.useOpenGl,
  });

  if (player.useOpenGl) {
    player.resetOpenGlViewPort(player.initW, player.initH);
  }

  player.setScreenDimensions(player.initW, player.initH);
  player.hud.reRenderAll();
  player.zmap.setViewingDimensions(
    player.initW - HUD_WIDTH_PIXELS,
    player.initH - HUD_HEIGHT_PIXELS,
  );

  if (player.prevW && player.prevH) {
    player.mainMenuMove(player.initW / player.prevW, player.initH / player.prevH);
  }

  player.prevW = player.initW;
  player.prevH = player.initH;
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
 * Port of upstream `ZPlayer::FocusCameraTo`.
 * Role: Starts a smooth camera focus toward a map coordinate centered in the current viewport.
 * Upstream: zplayer.cpp:1775-1800
 */
export function focusPlayerCameraTo(
  state: PlayerFocusCameraState,
  mapX: number,
  mapY: number,
  now = currentTime(),
): void {
  const viewShift = state.zmap.getViewShiftFull();

  state.focusToX = mapX - (viewShift.viewWidth >> 1);
  state.focusToY = mapY - (viewShift.viewHeight >> 1);

  if (viewShift.x === state.focusToX && viewShift.y === state.focusToY) {
    return;
  }

  const dx = state.focusToX - viewShift.x;
  const dy = state.focusToY - viewShift.y;
  state.focusToOriginalDistance = Math.sqrt(dx * dx + dy * dy);
  state.lastFocusToTime = now;
  state.finalFocusToTime = now + 0.7;
  state.doFocusTo = true;
}

/**
 * Port of upstream `ZPlayer::FocusCameraToFort`.
 * Role: Centers the map view on the first owned fort building.
 * Upstream: zplayer.cpp:1743-1773
 */
export function focusPlayerCameraToFort(
  state: PlayerFocusCameraToFortState,
): void {
  if (!state.zmap.loaded()) return;
  if (state.ourTeam === TeamType.Null) return;

  for (const object of state.objectList) {
    if (object.getOwner() !== state.ourTeam) continue;

    const objectId = object.getObjectId();
    if (objectId.objectType !== MapObjectType.Building) continue;
    if (
      objectId.objectId !== BuildingType.FortFront &&
      objectId.objectId !== BuildingType.FortBack
    ) {
      continue;
    }

    const viewShift = state.zmap.getViewShiftFull();
    const center = object.getCenterCoords();
    state.zmap.setViewShift(
      center.x - (viewShift.viewWidth >> 1),
      center.y - (viewShift.viewWidth >> 1),
    );
    return;
  }
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
 * Replacement for upstream `ZPlayer::RenderPlaceCannon`.
 * Role: Builds the map-relative cannon placement marker render command.
 * Upstream: zplayer.cpp:3550-3564
 */
export function renderPlayerPlaceCannon<TSurface, TCommand>(
  state: PlayerPlaceCannonRenderState<TSurface>,
  zmap: PlayerPlaceCannonRenderMap<TSurface, TCommand>,
): TCommand | null {
  if (!state.placeCannon || !state.placementImage) return null;

  return zmap.renderZSurface(
    state.placementImage,
    state.placeCannonTileX * 16,
    state.placeCannonTileY * 16,
    false,
    false,
  );
}

/**
 * Port of upstream `place_cannon_packet` byte layout used by `ZPlayer::DoPlaceCannon`.
 * Role: Encodes the raw cannon-placement payload sent to the server.
 * Upstream: event_handler.h:83-88, zplayer.cpp:3574-3579
 */
export function encodePlayerPlaceCannonPacket(
  packet: PlaceCannonPacket,
): Uint8Array {
  const data = new Uint8Array(PLAYER_PLACE_CANNON_PACKET_SIZE_BYTES);
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  view.setInt32(0, packet.refId, true);
  view.setInt32(4, packet.tileX, true);
  view.setInt32(8, packet.tileY, true);
  data[12] = packet.objectId & 0xff;

  return data;
}

/**
 * Port of upstream `ZPlayer::DoPlaceCannon`.
 * Role: Sends the pending cannon-placement packet once and clears placement mode.
 * Upstream: zplayer.cpp:3566-3582
 */
export function doPlayerPlaceCannon(
  state: PlayerDoPlaceCannonState,
  clientSocket: PlayerClientMessageSender,
): boolean {
  if (!state.placeCannon) return false;

  state.placeCannon = false;

  const packet = encodePlayerPlaceCannonPacket({
    refId: state.placeCannonRefId,
    tileX: state.placeCannonTileX,
    tileY: state.placeCannonTileY,
    objectId: state.placeCannonObjectId,
  });

  clientSocket.sendMessage(TcpEvent.PlaceCannon, packet, packet.length);

  return true;
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
 * Replacement for upstream `ZPlayer::RenderPreviousCursor`.
 * Role: Renders the temporary placement cursor while its lifetime is active.
 * Upstream: zplayer.cpp:2005-2020
 */
export function renderPlayerPreviousCursor<TCommand>(
  state: PlayerPlacementCursorState,
  now: number,
  renderCursor: PlayerPlacementCursorRenderer<TCommand>,
): TCommand | null {
  if (now >= state.pcursorDeathTime) return null;

  return renderCursor(state.pcursorX, state.pcursorY, true);
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
 * Port of upstream `ZPlayer::SendVotePass`.
 * Role: Sends a pass-vote TCP event without a payload.
 * Upstream: zplayer.cpp:3775-3778
 */
export function sendPlayerVotePass(clientSocket: PlayerClientMessageSender): number {
  return clientSocket.sendMessage(TcpEvent.VotePass, null, 0);
}

/**
 * Port of upstream `ZPlayer::SendVoteNo`.
 * Role: Sends a no-vote TCP event without a payload.
 * Upstream: zplayer.cpp:3770-3773
 */
export function sendPlayerVoteNo(clientSocket: PlayerClientMessageSender): number {
  return clientSocket.sendMessage(TcpEvent.VoteNo, null, 0);
}

/**
 * Port of upstream `ZPlayer::SendVoteYes`.
 * Role: Sends a yes-vote TCP event without a payload.
 * Upstream: zplayer.cpp:3765-3768
 */
export function sendPlayerVoteYes(clientSocket: PlayerClientMessageSender): number {
  return clientSocket.sendMessage(TcpEvent.VoteYes, null, 0);
}

/**
 * Port of upstream `ZPlayer::SendSetPaused`.
 * Role: Sends the requested pause state as the packed game-paused TCP payload.
 * Upstream: zplayer.cpp:3805-3812
 */
export function sendPlayerSetPaused(
  clientSocket: PlayerClientMessageSender,
  paused: boolean,
): number {
  const packet = new Uint8Array([paused ? 1 : 0]);
  return clientSocket.sendMessage(TcpEvent.SetGamePaused, packet, packet.length);
}

/**
 * Port of upstream `ZPlayer::SendLogin`.
 * Role: Requests login-off state and submits stored credentials when both are present.
 * Upstream: zplayer.cpp:3780-3794
 */
export function sendPlayerLogin(
  clientSocket: PlayerLoginMessageSender,
  loginName: string,
  loginPassword: string,
): void {
  clientSocket.sendMessage(TcpEvent.RequestLoginoff, null, 0);

  if (loginName.length && loginPassword.length) {
    clientSocket.sendMessageAscii(
      TcpEvent.SendLogin,
      `${loginName},${loginPassword}`,
    );
  }
}

/**
 * Port of upstream `ZPlayer::SendCreateUser`.
 * Role: Sends create-user fields as the comma-separated ASCII payload expected by the server.
 * Upstream: zplayer.cpp:3796-3803
 */
export function sendPlayerCreateUser(
  clientSocket: PlayerClientAsciiMessageSender,
  username: string,
  loginName: string,
  loginPassword: string,
  email: string,
): number {
  return clientSocket.sendMessageAscii(
    TcpEvent.CreateUser,
    `${username},${loginName},${loginPassword},${email}`,
  );
}

/**
 * Port of upstream `ZPlayer::ProcessChangeObjectAmount`.
 * Role: Refreshes unit cycling buttons, checks unit limits, and updates the HUD unit amount.
 * Upstream: zplayer.cpp:3071-3079
 */
export function processPlayerChangeObjectAmount(
  state: PlayerChangeObjectAmountState,
): void {
  state.reSetupButtons();
  state.checkUnitLimitReached();
  state.hud.setUnitAmount(state.teamUnitsAvailable[state.ourTeam] ?? 0);
}

/**
 * Port of upstream `ZPlayer::SetPlayerTeam`.
 * Role: Applies the local team and resets team-scoped UI, selection, focus, and unit counts.
 * Upstream: zplayer.cpp:298-323
 */
export function setPlayerTeam<TObject>(
  state: PlayerSetTeamState<TObject>,
  playerTeam: TeamType,
): void {
  state.ourTeam = playerTeam;

  state.cursor.setTeam(state.ourTeam);
  state.hud.setTeam(state.ourTeam);
  state.componentMessage.setTeam(state.ourTeam);
  state.guiFactoryList?.setTeam(state.ourTeam);

  state.refindOurFortRefId();

  clearAllPlayerSelectionInfo(state);
  state.hud.setSelectedObject(null);
  state.hud.reRenderAll();

  state.spaceEventList.length = 0;

  state.determineCursor();
  processPlayerChangeObjectAmount(state);
}

/**
 * Replacement for upstream `ZPlayer::SetUseOpenGL`.
 * Role: Stores the player Canvas rendering path flag.
 * Upstream: zplayer.cpp:262-265
 */
export function setPlayerCanvasRendering(
  state: PlayerCanvasRenderingState,
  useCanvasRendering: boolean,
): void {
  state.useCanvasRendering = useCanvasRendering;
}

/**
 * Port of upstream `ZPlayer::RefindOurFortRefID`.
 * Role: Refreshes the reference id for the first owned fort in object-list order.
 * Upstream: zplayer.cpp:3879-3897
 */
export function refindPlayerFortRefId(state: PlayerFortRefState): void {
  state.fortRefId = -1;

  for (const object of state.objectList) {
    if (object.getOwner() !== state.ourTeam) continue;

    const objectId = object.getObjectId();
    if (
      objectId.objectType === MapObjectType.Building &&
      (objectId.objectId === BuildingType.FortFront ||
        objectId.objectId === BuildingType.FortBack)
    ) {
      state.fortRefId = object.getRefId();
      break;
    }
  }
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
 * Port of upstream `ZPlayer::InitAnimals`.
 * Role: Rebuilds ambient bird instances for the current map size and terrain.
 * Upstream: zplayer.cpp:573-586
 */
export function initPlayerAnimals<TAnimal>(
  state: PlayerAnimalState<TAnimal>,
  zmap: PlayerAnimalMapBasicsProvider,
  createBird: PlayerAmbientBirdFactory<TAnimal>,
): void {
  clearPlayerAnimals(state);

  const mapBasics = zmap.getMapBasics();
  const birds = Math.trunc(
    (mapBasics.height * mapBasics.width) / AMBIENT_BIRD_SQUARE_TILES_PER_BIRD,
  );

  for (let i = 0; i < birds; i += 1) {
    state.birdList.push(
      createBird({
        terrainType: mapBasics.terrainType,
        mapWidthPixels: mapBasics.width * 16,
        mapHeightPixels: mapBasics.height * 16,
      }),
    );
  }
}

/**
 * Port of upstream `ZPlayer::A_Button`.
 * Role: Button hook with no upstream behavior.
 * Upstream: zplayer.cpp:1600-1603
 */
export function playerAButton(): void {}

/**
 * Port of upstream `ZPlayer::InitMenus`.
 * Role: Clears the active GUI menu and creates login and create-user menus.
 * Upstream: zplayer.cpp:3814-3820
 */
export function initPlayerMenus<TTime, TLoginMenu, TCreateUserMenu>(
  state: PlayerMenuInitState<TTime, TLoginMenu, TCreateUserMenu>,
  createLoginMenu: PlayerMenuFactory<TTime, TLoginMenu>,
  createCreateUserMenu: PlayerMenuFactory<TTime, TCreateUserMenu>,
): void {
  state.activeMenu = null;
  state.loginMenu = createLoginMenu(state.ztime);
  state.createUserMenu = createCreateUserMenu(state.ztime);
}

/**
 * Port of upstream `ZPlayer::HandleButton`.
 * Role: Dispatches a HUD button to its matching player button action.
 * Upstream: zplayer.cpp:1584-1598
 */
export function handlePlayerButton(
  player: PlayerHudButtonHandler,
  button: HudButton | number,
): void {
  switch (button) {
    case HudButton.A:
      player.aButton();
      break;
    case HudButton.B:
      player.bButton();
      break;
    case HudButton.D:
      player.dButton();
      break;
    case HudButton.G:
      player.gButton();
      break;
    case HudButton.Menu:
      player.menuButton();
      break;
    case HudButton.R:
      player.rButton();
      break;
    case HudButton.T:
      player.tButton();
      break;
    case HudButton.V:
      player.vButton();
      break;
    case HudButton.Z:
      player.zButton();
      break;
    default:
      break;
  }
}

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
 * Port of upstream `ZPlayer::G_Button`.
 * Role: Selects the next cannon unit type for the player shortcut.
 * Upstream: zplayer.cpp:1615-1619
 */
export function playerGButton(player: PlayerUnitTypeSelector): void {
  player.orderlySelectUnitType(MapObjectType.Cannon);
}

/**
 * Port of upstream `ZPlayer::Menu_Button`.
 * Role: Opens the main menu screen from the player button hook.
 * Upstream: zplayer.cpp:1621-1624
 */
export function playerMenuButton(player: PlayerMainMenuLoader): void {
  player.loadMainMenu(MainMenuType.MainMain);
}

/**
 * Port of upstream `ZPlayer::R_Button`.
 * Role: Selects the next robot unit type for the player shortcut.
 * Upstream: zplayer.cpp:1626-1630
 */
export function playerRButton(player: PlayerUnitTypeSelector): void {
  player.orderlySelectUnitType(MapObjectType.Robot);
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
 * Port of upstream `ZPlayer::MainMenuMotion`.
 * Role: Routes mouse motion through active main menus and refreshes HUD overlap regions.
 * Upstream: zplayer.cpp:3135-3158
 */
export function motionPlayerMainMenus(
  state: PlayerMainMenuMotionState,
): boolean {
  for (const menu of state.guiMenuList) {
    const previousCoords = menu.getCoords();

    if (menu.motion(state.mouseX, state.mouseY)) {
      const coords = menu.getCoords();
      const dimensions = menu.getDimensions();

      if (
        isPlayerOverHud(
          state,
          coords.x,
          coords.y,
          dimensions.width,
          dimensions.height,
        ) ||
        isPlayerOverHud(
          state,
          previousCoords.x,
          previousCoords.y,
          dimensions.width,
          dimensions.height,
        )
      ) {
        state.hud.reRenderAll();
      }

      return true;
    }
  }

  return false;
}

/**
 * Port of upstream `ZPlayer::MainMenuWheelUp`.
 * Role: Routes wheel-up input through active main menus until one consumes it.
 * Upstream: zplayer.cpp:3160-3167
 */
export function wheelUpPlayerMainMenus(
  state: PlayerMainMenuWheelUpState,
): boolean {
  for (const menu of state.guiMenuList) {
    if (menu.wheelUpButton()) {
      return true;
    }
  }

  return false;
}

/**
 * Port of upstream `ZPlayer::MainMenuWheelDown`.
 * Role: Routes wheel-down input through active main menus until one consumes it.
 * Upstream: zplayer.cpp:3169-3176
 */
export function wheelDownPlayerMainMenus(
  state: PlayerMainMenuWheelDownState,
): boolean {
  for (const menu of state.guiMenuList) {
    if (menu.wheelDownButton()) {
      return true;
    }
  }

  return false;
}

/**
 * Port of upstream `ZPlayer::MainMenuKeyPress`.
 * Role: Routes keyboard input through active main menus until one consumes it.
 * Upstream: zplayer.cpp:3178-3185
 */
export function keyPressPlayerMainMenus(
  state: PlayerMainMenuKeyPressState,
  c: number,
): boolean {
  for (const menu of state.guiMenuList) {
    if (menu.keyPress(c)) {
      return true;
    }
  }

  return false;
}

/**
 * Port of upstream `ZPlayer::CloseCurrentMainMenuEtc`.
 * Role: Closes the top-priority player GUI surface: main menu, visible factory list, then active GUI window.
 * Upstream: zplayer.cpp:3584-3604
 */
export function closePlayerCurrentMainMenuEtc(
  state: PlayerCloseCurrentMainMenuEtcState,
): void {
  const activeMenu = state.guiMenuList[0];
  if (activeMenu) {
    activeMenu.doKillMe();
    return;
  }

  if (state.guiFactoryList?.isVisible()) {
    state.guiFactoryList.toggleShow();
    return;
  }

  state.guiWindow?.doKillMe();
}

/**
 * Port of upstream `ZPlayer::T_Button`.
 * Role: Button hook with no upstream behavior.
 * Upstream: zplayer.cpp:1632-1635
 */
export function playerTButton(): void {}

/**
 * Port of upstream `ZPlayer::V_Button`.
 * Role: Selects the next vehicle unit type for the player shortcut.
 * Upstream: zplayer.cpp:1637-1641
 */
export function playerVButton(player: PlayerUnitTypeSelector): void {
  player.orderlySelectUnitType(MapObjectType.Vehicle);
}

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
 * Port of upstream `ZPlayer::SelectZObject`.
 * Role: Selects an owned selectable object or its group leader and refreshes player selection side effects.
 * Upstream: zplayer.cpp:2504-2522
 */
export function selectPlayerZObject<TObject extends PlayerSelectableZObject>(
  state: PlayerSelectZObjectState<TObject>,
  object: TObject | null,
): boolean {
  if (!object) return false;

  const groupLeader = object.getGroupLeader();
  const selectedObject = (groupLeader ?? object) as TObject;

  if (!selectedObject.selectable()) return false;
  if (selectedObject.getOwner() !== state.ourTeam) return false;

  clearPlayerSelectionInfo(state);
  state.selectedList.push(selectedObject);
  setupPlayerSelectionGroupDetails(state, false);
  state.determineCursor();
  givePlayerHudSelected(state);
  state.clearDevWaypointsOfSelected();

  return true;
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
 * Port of upstream `ZPlayer::LoadControlGroup`.
 * Role: Jumps to an already selected quick group or restores it and refreshes player selection UI.
 * Upstream: zplayer.cpp:2719-2738
 */
export function loadPlayerControlGroup(
  state: PlayerLoadControlGroupState,
  group: number,
): void {
  if (group < 0) return;
  if (group >= 10) return;

  if (isPlayerSelectionGroupSelected(state, group)) {
    const average = averageCoordsOfPlayerSelection(state);
    if (average) {
      state.focusCameraTo(average.x, average.y);
    }
    return;
  }

  loadPlayerSelectionGroup(state, group);
  state.determineCursor();
  clearPlayerSelectedDevWaypoints(state);
  givePlayerHudSelected(state);
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
 * Port of upstream `ZPlayer::DevWayPointsNoWay`.
 * Role: Reports whether the selected unit's first attack waypoint targets a unit it is rated to lose against.
 * Upstream: zplayer.cpp:2897-2921
 */
export function playerDevWaypointsNoWay(
  state: PlayerDevWaypointsNoWayState,
  getObjectFromId: (refId: number) => PlayerDevWaypointObject | null,
): boolean {
  if (state.selectedList.length !== 1) return false;

  const selected = state.selectedList[0];
  const waypoint = selected?.getWayPointDevList()[0];

  if (!selected || !waypoint) return false;
  if (waypoint.mode !== WaypointMode.Attack) return false;

  const victim = getObjectFromId(waypoint.refId);
  if (!victim) return false;

  const attackerId = selected.getObjectId();
  const victimId = victim.getObjectId();

  return (
    crossReferenceUnits(
      state,
      attackerId.objectType,
      attackerId.objectId,
      victimId.objectType,
      victimId.objectId,
    ) === UnitCrossReference.WillDie
  );
}

/**
 * Port of upstream `ZPlayer::UnitNearHostiles`.
 * Role: Reports whether a unit is near a live passive-engageable hostile object.
 * Upstream: zplayer.cpp:2740-2758
 */
export function unitNearPlayerHostiles(
  state: PlayerPassiveEngagableState,
  object: GameEntity | null,
): boolean {
  if (!object) return false;

  for (const enemyObject of state.passiveEngagableObjectList) {
    if (object === enemyObject) continue;
    if (object.getOwner() === enemyObject.getOwner()) continue;
    if (enemyObject.getOwner() === TeamType.Null) continue;
    if (enemyObject.isDestroyed()) continue;
    if (!object.withinAgroRadiusObject(enemyObject)) continue;

    return true;
  }

  return false;
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
