import { describe, expect, it } from "vitest";
import { SoundSetting } from "../src/audio/AudioService";
import {
  BuildingType,
  RobotType,
  TeamType,
  VehicleType,
} from "../src/simulation/SimulationConstants";
import { SimulationTime } from "../src/simulation/SimulationTime";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { TcpEvent } from "../src/simulation/EventHandler";
import { HudButton } from "../src/ui/HudLayout";
import { MainMenuType } from "../src/ui/MainMenuBase";
import { MapObjectType } from "../src/world/MapFormat";
import {
  addPlayerSpaceBarEvent,
  averageCoordsOfPlayerSelection,
  clearAllPlayerSelectionInfo,
  clearPlayerAnimals,
  clearPlayerAsciiStates,
  clearPlayerInfoListEvent,
  clearPlayerSelectionInfo,
  clearPlayerSelectedDevWaypoints,
  closePlayerCurrentMainMenuEtc,
  createMouseButtonInfo,
  deletePlayerObjectFromSelection,
  disablePlayerCursor,
  doPlayerKeyScrollDown,
  doPlayerKeyScrollLeft,
  doPlayerKeyScrollRight,
  doPlayerKeyScrollUp,
  doPlayerMouseScrollDown,
  doPlayerMouseScrollLeft,
  doPlayerMouseScrollRight,
  doPlayerMouseScrollUp,
  exitPlayerProgram,
  focusPlayerCameraTo,
  focusPlayerCameraToFort,
  givePlayerHudSelected,
  handlePlayerButton,
  initPlayerMenus,
  initPlayerAnimals,
  isPastSpaceBarEventLifetime,
  isPlayerAsciiDown,
  isPlayerAltDown,
  isPlayerCtrlDown,
  isPlayerObjectSelected,
  isPlayerOverHud,
  isPlayerSelectionGroupSelected,
  isPlayerShiftDown,
  keyPressPlayerMainMenus,
  loadPlayerControlGroup,
  loadPlayerSelectionGroup,
  mapCoordsOfPlayerMouseWithHud,
  motionPlayerMainMenus,
  movePlayerMainMenus,
  PLAYER_ASCII_DOWN_MAX,
  PLAYER_GRAPHICS_LOAD_ITEM_COUNT,
  PLAYER_MAX_NEWS_HISTORY,
  PLAYER_MAX_STORED_SPACE_BAR_EVENTS,
  PLAYER_NEWS_ACTIVE_DURATION_SECONDS,
  PLAYER_NEWS_FADE_START_SECONDS,
  PLAYER_NEWS_ROW_SPACING_PIXELS,
  PLAYER_SCROLL_SPEED_PIXELS_PER_SECOND,
  PLAYER_SELECTION_SHIFT_TICK_SECONDS,
  PLAYER_SPACE_BAR_EVENT_LIFETIME_SECONDS,
  PLAYER_SPLASH_FADE_PER_SECOND,
  processPlayerChangeObjectAmount,
  playerDevWaypointsNoWay,
  playerMiddleClickEvent,
  playerMiddleUnclickEvent,
  refindPlayerFortRefId,
  playerRightClickEvent,
  playerTestEvent,
  renderPlayerPlaceCannon,
  renderPlayerPreviousCursor,
  playerAButton,
  playerBButton,
  playerDButton,
  playerGButton,
  playerMenuButton,
  playerRButton,
  playerResizeEvent,
  playerTButton,
  playerVButton,
  playerZButton,
  removePlayerObjectFromSelection,
  setPlayerDimensions,
  setPlayerAsciiState,
  setPlayerLoginName,
  setPlayerLoginPassword,
  sendPlayerCreateUser,
  sendPlayerLogin,
  sendPlayerSetPaused,
  sendPlayerVoteNo,
  sendPlayerVotePass,
  sendPlayerVoteYes,
  setPlayerMusicOff,
  setNextPlayerSoundSetting,
  selectPlayerZObject,
  setPlayerPlaceCannonCoords,
  setPlayerSelectionZTime,
  setPlayerSelectionGroup,
  setPlayerSoundsOff,
  setPlayerCanvasRendering,
  setupPlayerSelectionGroupDetails,
  showPlayerPlacementCursor,
  SpaceBarEvent,
  startPlayerMouseScrolling,
  unitNearPlayerHostiles,
  updatePlayerSelectionGroupMember,
  wheelDownPlayerMainMenus,
  wheelUpPlayerMainMenus,
  ZPLAYER_HEADER_GUARD_PORTED,
} from "../src/simulation/PlayerPresentation";
import type {
  PlayerKeyEvent,
  PlayerNewsEntry,
} from "../src/simulation/PlayerPresentation";
import { WaypointMode } from "../src/simulation/entities/EntityTypes";
import {
  initUnitCrossReferenceTable,
  insertUnitCrossReference,
  UnitCrossReference,
} from "../src/simulation/UnitRating";

describe("player presentation constants", () => {
  it("adapts the zplayer.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/PlayerPresentation");
    const secondImport = await import("../src/simulation/PlayerPresentation");

    expect(ZPLAYER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZPLAYER_HEADER_GUARD_PORTED).toBe(
      firstImport.ZPLAYER_HEADER_GUARD_PORTED,
    );
  });

  it("ports the graphics load progress item count", () => {
    expect(PLAYER_GRAPHICS_LOAD_ITEM_COUNT).toBe(81);
  });

  it("ports the player news timing and layout constants", () => {
    expect(PLAYER_NEWS_ACTIVE_DURATION_SECONDS).toBe(17.0);
    expect(PLAYER_NEWS_ROW_SPACING_PIXELS).toBe(15);
    expect(PLAYER_NEWS_FADE_START_SECONDS).toBe(5);
    expect(PLAYER_MAX_NEWS_HISTORY).toBe(50);
  });

  it("ports the player interaction animation constants", () => {
    expect(PLAYER_SELECTION_SHIFT_TICK_SECONDS).toBe(0.1);
    expect(PLAYER_SCROLL_SPEED_PIXELS_PER_SECOND).toBe(400);
    expect(PLAYER_SPLASH_FADE_PER_SECOND).toBe(5);
  });

  it("adapts the space-bar focus event retention constants", () => {
    expect(PLAYER_MAX_STORED_SPACE_BAR_EVENTS).toBe(5);
    expect(PLAYER_SPACE_BAR_EVENT_LIFETIME_SECONDS).toBe(10);
  });

  it("adapts the lowercase ASCII key state count", () => {
    expect(PLAYER_ASCII_DOWN_MAX).toBe(26);
  });

  it("ports player key events", () => {
    const event: PlayerKeyEvent = {
      theKey: 97,
      theUnicode: 65,
    };

    expect(event).toEqual({
      theKey: 97,
      theUnicode: 65,
    });
  });

  it("ports player news entries with color, message, lifetime, and text image", () => {
    const textImage = { id: "rendered-text" };
    const entry: PlayerNewsEntry<typeof textImage> = {
      red: 10,
      green: 20,
      blue: 30,
      message: "Unit ready",
      deathTime: 42.5,
      textImage,
    };

    expect(entry).toEqual({
      red: 10,
      green: 20,
      blue: 30,
      message: "Unit ready",
      deathTime: 42.5,
      textImage: { id: "rendered-text" },
    });
  });

  it("ports cleared mouse button interaction state", () => {
    expect(createMouseButtonInfo()).toEqual({
      x: 0,
      y: 0,
      mapX: 0,
      mapY: 0,
      down: false,
      startedOverHud: false,
      startedOverGui: false,
    });
  });

  it("ports ZPlayer rclick_event as right button down", () => {
    const player = {
      mbutton: createMouseButtonInfo(),
      rbutton: createMouseButtonInfo(),
    };

    playerRightClickEvent(player, null, 0, 0);

    expect(player.rbutton.down).toBe(true);
    expect(player.mbutton.down).toBe(false);
  });

  it("ports ZPlayer middle mouse click and unclick events", () => {
    const player = {
      mbutton: createMouseButtonInfo(),
      rbutton: createMouseButtonInfo(),
    };

    playerMiddleClickEvent(player, null, 0, 0);
    expect(player.mbutton.down).toBe(true);

    playerMiddleUnclickEvent(player, null, 0, 0);
    expect(player.mbutton.down).toBe(false);
  });

  it("ports ZPlayer test_event as a diagnostic message builder", () => {
    expect(playerTestEvent(null, "payload", 7, 0)).toBe(
      "ZPlayer::test_event:payload...",
    );
    expect(playerTestEvent(null, "payload", 0, 0)).toBeNull();
  });

  it("ports ZPlayer clear_player_list_event as player info clearing", () => {
    const player = { playerInfo: [{ name: "red" }, { name: "blue" }] };

    clearPlayerInfoListEvent(player, null, 0, 0);

    expect(player.playerInfo).toEqual([]);
  });

  it("ports ZPlayer mouse edge scroll checks with grabbed input", () => {
    const state = {
      mouseX: 795,
      mouseY: 5,
      screenWidth: 800,
      screenHeight: 600,
      inputGrabbed: true,
    };

    expect(doPlayerMouseScrollRight(state)).toBe(true);
    expect(doPlayerMouseScrollUp(state)).toBe(true);
    expect(doPlayerMouseScrollLeft(state)).toBe(false);
    expect(doPlayerMouseScrollDown(state)).toBe(false);

    state.mouseX = 4;
    state.mouseY = 595;
    expect(doPlayerMouseScrollLeft(state)).toBe(true);
    expect(doPlayerMouseScrollDown(state)).toBe(true);

    state.inputGrabbed = false;
    expect(doPlayerMouseScrollLeft(state)).toBe(false);
    expect(doPlayerMouseScrollDown(state)).toBe(false);
  });

  it("ports ZPlayer StartMouseScrolling as edge-entry timer reset", () => {
    const state = {
      mouseX: 20,
      mouseY: 20,
      screenWidth: 800,
      screenHeight: 600,
      inputGrabbed: true,
      horzScrollOver: 4.5,
      vertScrollOver: 3.5,
      lastHorzScrollTime: 1,
      lastVertScrollTime: 2,
    };

    startPlayerMouseScrolling(state, 5, 595, 12.5);

    expect(state.horzScrollOver).toBe(0);
    expect(state.vertScrollOver).toBe(0);
    expect(state.lastHorzScrollTime).toBe(12.5);
    expect(state.lastVertScrollTime).toBe(12.5);
  });

  it("ports ZPlayer StartMouseScrolling as no-op when input is not grabbed", () => {
    const state = {
      mouseX: 20,
      mouseY: 20,
      screenWidth: 800,
      screenHeight: 600,
      inputGrabbed: false,
      horzScrollOver: 4.5,
      vertScrollOver: 3.5,
      lastHorzScrollTime: 1,
      lastVertScrollTime: 2,
    };

    startPlayerMouseScrolling(state, 5, 595, 12.5);

    expect(state.horzScrollOver).toBe(4.5);
    expect(state.vertScrollOver).toBe(3.5);
    expect(state.lastHorzScrollTime).toBe(1);
    expect(state.lastVertScrollTime).toBe(2);
  });

  it("ports ZPlayer StartMouseScrolling as no reset while already in edge zones", () => {
    const state = {
      mouseX: 5,
      mouseY: 595,
      screenWidth: 800,
      screenHeight: 600,
      inputGrabbed: true,
      horzScrollOver: 4.5,
      vertScrollOver: 3.5,
      lastHorzScrollTime: 1,
      lastVertScrollTime: 2,
    };

    startPlayerMouseScrolling(state, 4, 596, 12.5);

    expect(state.horzScrollOver).toBe(4.5);
    expect(state.vertScrollOver).toBe(3.5);
    expect(state.lastHorzScrollTime).toBe(1);
    expect(state.lastVertScrollTime).toBe(2);
  });

  it("ports ZPlayer SetDimensions as positive viewport dimension updates", () => {
    const state = {
      prevW: 10,
      initW: 20,
      prevH: 30,
      initH: 40,
    };

    setPlayerDimensions(state, 800, 600);
    expect(state).toEqual({
      prevW: 800,
      initW: 800,
      prevH: 600,
      initH: 600,
    });

    setPlayerDimensions(state, 0, -1);
    expect(state).toEqual({
      prevW: 800,
      initW: 800,
      prevH: 600,
      initH: 600,
    });
  });

  it("ports ZPlayer resize_event as OpenGL windowed viewport refresh", () => {
    const calls: unknown[] = [];
    const state = {
      useOpenGl: true,
      isWindowed: true,
      initW: 800,
      initH: 600,
      prevW: 400,
      prevH: 300,
      resetOpenGlViewPort: (width: number, height: number) =>
        calls.push(["viewport", width, height]),
      setScreenDimensions: (width: number, height: number) =>
        calls.push(["screen", width, height]),
      hud: { reRenderAll: () => calls.push("hud") },
      zmap: {
        setViewingDimensions: (width: number, height: number) =>
          calls.push(["map-view", width, height]),
      },
      mainMenuMove: (widthScale: number, heightScale: number) =>
        calls.push(["menu", widthScale, heightScale]),
    };

    playerResizeEvent(state, {
      setVideoMode: (options) => calls.push(["video", options]),
    });

    expect(calls).toEqual([
      [
        "video",
        {
          width: 800,
          height: 600,
          bitsPerPixel: 0,
          useOpenGl: true,
          resizable: true,
          fullscreen: false,
          hardwareSurface: false,
          doubleBuffer: false,
        },
      ],
      ["viewport", 800, 600],
      ["screen", 800, 600],
      "hud",
      ["map-view", 700, 564],
      ["menu", 2, 2],
    ]);
    expect(state.prevW).toBe(800);
    expect(state.prevH).toBe(600);
  });

  it("ports ZPlayer resize_event as software fullscreen refresh without menu ratio", () => {
    const calls: unknown[] = [];
    const state = {
      useOpenGl: false,
      isWindowed: false,
      initW: 1024,
      initH: 768,
      prevW: 0,
      prevH: 768,
      resetOpenGlViewPort: (width: number, height: number) =>
        calls.push(["viewport", width, height]),
      setScreenDimensions: (width: number, height: number) =>
        calls.push(["screen", width, height]),
      hud: { reRenderAll: () => calls.push("hud") },
      zmap: {
        setViewingDimensions: (width: number, height: number) =>
          calls.push(["map-view", width, height]),
      },
      mainMenuMove: (widthScale: number, heightScale: number) =>
        calls.push(["menu", widthScale, heightScale]),
    };

    playerResizeEvent(state, {
      setVideoMode: (options) => calls.push(["video", options]),
    });

    expect(calls).toEqual([
      [
        "video",
        {
          width: 1024,
          height: 768,
          bitsPerPixel: 32,
          useOpenGl: false,
          resizable: true,
          fullscreen: true,
          hardwareSurface: true,
          doubleBuffer: true,
        },
      ],
      ["screen", 1024, 768],
      "hud",
      ["map-view", 924, 732],
    ]);
    expect(state.prevW).toBe(1024);
    expect(state.prevH).toBe(768);
  });

  it("ports ZPlayer IsOverHUD as inclusive reserved HUD overlap", () => {
    const state = {
      initW: 800,
      initH: 600,
    };

    expect(isPlayerOverHud(state, 699, 100, 1, 1)).toBe(true);
    expect(isPlayerOverHud(state, 100, 563, 1, 1)).toBe(true);
    expect(isPlayerOverHud(state, 698, 100, 1, 1)).toBe(false);
    expect(isPlayerOverHud(state, 100, 562, 1, 1)).toBe(false);
  });

  it("ports ZPlayer MapCoordsOfMouseWithHud as map conversion followed by minimap override", () => {
    const calls: unknown[] = [];
    const state = { mouseX: 20, mouseY: 30, initW: 640, initH: 480 };

    const coords = mapCoordsOfPlayerMouseWithHud(
      state,
      {
        getMapCoords: (mouseX, mouseY) => {
          calls.push(["map", mouseX, mouseY]);
          return { x: mouseX + 100, y: mouseY + 200 };
        },
      },
      {
        overMiniMap: (mouseX, mouseY, initW, initH, mapX, mapY) => {
          calls.push(["hud", mouseX, mouseY, initW, initH, mapX, mapY]);
          return { mapX: mapX + 1, mapY: mapY + 2 };
        },
      },
    );

    expect(calls).toEqual([
      ["map", 20, 30],
      ["hud", 20, 30, 640, 480, 120, 230],
    ]);
    expect(coords).toEqual({ mapX: 121, mapY: 232 });
  });

  it("keeps ZPlayer SetPlaceCannonCords unchanged when placement is inactive", () => {
    const state = {
      placeCannon: false,
      mouseX: 20,
      mouseY: 30,
      placeCannonTileX: 4,
      placeCannonTileY: 5,
    };

    setPlayerPlaceCannonCoords(state, {
      getViewShift: () => {
        throw new Error("getViewShift should not be called");
      },
    });

    expect(state.placeCannonTileX).toBe(4);
    expect(state.placeCannonTileY).toBe(5);
  });

  it("ports ZPlayer SetPlaceCannonCords as shifted mouse tile coordinates", () => {
    const state = {
      placeCannon: true,
      mouseX: 20,
      mouseY: 30,
      placeCannonTileX: 0,
      placeCannonTileY: 0,
    };

    setPlayerPlaceCannonCoords(state, {
      getViewShift: () => ({ x: 28, y: 51 }),
    });

    expect(state.placeCannonTileX).toBe(3);
    expect(state.placeCannonTileY).toBe(5);
  });

  it("replaces ZPlayer RenderPlaceCannon as no command when placement is inactive", () => {
    expect(
      renderPlayerPlaceCannon(
        {
          placeCannon: false,
          placeCannonTileX: 3,
          placeCannonTileY: 5,
          placementImage: "ok-marker",
        },
        {
          renderZSurface() {
            throw new Error("renderZSurface should not be called");
          },
        },
      ),
    ).toBeNull();
  });

  it("replaces ZPlayer RenderPlaceCannon with the placement marker command", () => {
    const calls: Array<[string, number, number, boolean, boolean]> = [];

    const command = renderPlayerPlaceCannon(
      {
        placeCannon: true,
        placeCannonTileX: 3,
        placeCannonTileY: 5,
        placementImage: "ok-marker",
      },
      {
        renderZSurface(surface, x, y, renderHit, aboutCenter) {
          calls.push([surface, x, y, renderHit, aboutCenter]);
          return { surface, x, y, renderHit, aboutCenter };
        },
      },
    );

    expect(calls).toEqual([["ok-marker", 48, 80, false, false]]);
    expect(command).toEqual({
      surface: "ok-marker",
      x: 48,
      y: 80,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("ports ZPlayer ShowPcursor as placement cursor position and lifetime", () => {
    const state = {
      pcursorDeathTime: 0,
      pcursorX: 0,
      pcursorY: 0,
    };

    showPlayerPlacementCursor(state, 32, 48, 12.5);

    expect(state).toEqual({
      pcursorDeathTime: 15.5,
      pcursorX: 32,
      pcursorY: 48,
    });
  });

  it("replaces ZPlayer RenderPreviousCursor as no command after cursor expiry", () => {
    const state = {
      pcursorDeathTime: 15.5,
      pcursorX: 32,
      pcursorY: 48,
    };

    expect(
      renderPlayerPreviousCursor(state, 15.5, () => {
        throw new Error("cursor renderer should not be called");
      }),
    ).toBeNull();
  });

  it("replaces ZPlayer RenderPreviousCursor by rendering the active placement cursor", () => {
    const calls: unknown[] = [];
    const state = {
      pcursorDeathTime: 15.5,
      pcursorX: 32,
      pcursorY: 48,
    };

    const command = renderPlayerPreviousCursor(state, 15.49, (
      x,
      y,
      restrictToMap,
    ) => {
      calls.push([x, y, restrictToMap]);
      return { x, y, restrictToMap };
    });

    expect(calls).toEqual([[32, 48, true]]);
    expect(command).toEqual({ x: 32, y: 48, restrictToMap: true });
  });

  it("ports ZPlayer key scroll checks with opposite-direction cancellation", () => {
    const state = {
      leftDown: false,
      rightDown: true,
      upDown: true,
      downDown: false,
    };

    expect(doPlayerKeyScrollRight(state)).toBe(true);
    expect(doPlayerKeyScrollUp(state)).toBe(true);

    state.leftDown = true;
    state.downDown = true;
    expect(doPlayerKeyScrollRight(state)).toBe(false);
    expect(doPlayerKeyScrollLeft(state)).toBe(false);
    expect(doPlayerKeyScrollUp(state)).toBe(false);
    expect(doPlayerKeyScrollDown(state)).toBe(false);

    state.rightDown = false;
    state.upDown = false;
    expect(doPlayerKeyScrollLeft(state)).toBe(true);
    expect(doPlayerKeyScrollDown(state)).toBe(true);
  });

  it("ports ZPlayer ShiftDown and AltDown as either-side modifier checks", () => {
    const state = {
      leftShiftDown: false,
      rightShiftDown: false,
      leftCtrlDown: false,
      rightCtrlDown: false,
      leftAltDown: false,
      rightAltDown: false,
    };

    expect(isPlayerShiftDown(state)).toBe(false);
    expect(isPlayerCtrlDown(state)).toBe(false);
    expect(isPlayerAltDown(state)).toBe(false);

    state.rightShiftDown = true;
    state.rightCtrlDown = true;
    state.leftAltDown = true;
    expect(isPlayerShiftDown(state)).toBe(true);
    expect(isPlayerCtrlDown(state)).toBe(true);
    expect(isPlayerAltDown(state)).toBe(true);
  });

  it("ports ZPlayer login name and password setters", () => {
    const state = { loginName: "", loginPassword: "" };

    setPlayerLoginName(state, "player");
    setPlayerLoginPassword(state, "secret");

    expect(state).toEqual({ loginName: "player", loginPassword: "secret" });
  });

  it("ports ZPlayer SendVotePass as a pass-vote message send", () => {
    const calls: Array<{
      packId: TcpEvent;
      data: Uint8Array | null;
      size: number;
    }> = [];
    const result = sendPlayerVotePass({
      sendMessage: (packId, data, size) => {
        calls.push({ packId, data, size });
        return 23;
      },
    });

    expect(result).toBe(23);
    expect(calls).toEqual([{ packId: TcpEvent.VotePass, data: null, size: 0 }]);
  });

  it("ports ZPlayer SendVoteNo as a no-vote message send", () => {
    const calls: Array<{
      packId: TcpEvent;
      data: Uint8Array | null;
      size: number;
    }> = [];
    const result = sendPlayerVoteNo({
      sendMessage: (packId, data, size) => {
        calls.push({ packId, data, size });
        return 24;
      },
    });

    expect(result).toBe(24);
    expect(calls).toEqual([{ packId: TcpEvent.VoteNo, data: null, size: 0 }]);
  });

  it("ports ZPlayer SendVoteYes as a yes-vote message send", () => {
    const calls: Array<{
      packId: TcpEvent;
      data: Uint8Array | null;
      size: number;
    }> = [];
    const result = sendPlayerVoteYes({
      sendMessage: (packId, data, size) => {
        calls.push({ packId, data, size });
        return 25;
      },
    });

    expect(result).toBe(25);
    expect(calls).toEqual([{ packId: TcpEvent.VoteYes, data: null, size: 0 }]);
  });

  it("ports ZPlayer SendSetPaused as a packed pause-state message send", () => {
    const calls: Array<{
      packId: TcpEvent;
      data: Uint8Array | null;
      size: number;
    }> = [];
    const clientSocket = {
      sendMessage(packId: TcpEvent, data: Uint8Array | null, size: number) {
        calls.push({ packId, data: data ? new Uint8Array(data) : null, size });
        return 26 + calls.length;
      },
    };

    expect(sendPlayerSetPaused(clientSocket, true)).toBe(27);
    expect(sendPlayerSetPaused(clientSocket, false)).toBe(28);

    expect(calls).toEqual([
      {
        packId: TcpEvent.SetGamePaused,
        data: new Uint8Array([1]),
        size: 1,
      },
      {
        packId: TcpEvent.SetGamePaused,
        data: new Uint8Array([0]),
        size: 1,
      },
    ]);
  });

  it("ports ZPlayer SendLogin as an unconditional login-state request", () => {
    const calls: Array<
      | {
          kind: "message";
          packId: TcpEvent;
          data: Uint8Array | null;
          size: number;
        }
      | { kind: "ascii"; packId: TcpEvent; data: string }
    > = [];

    sendPlayerLogin(
      {
        sendMessage: (packId, data, size) => {
          calls.push({ kind: "message", packId, data, size });
          return 32;
        },
        sendMessageAscii: (packId, data) => {
          calls.push({ kind: "ascii", packId, data });
          return 33;
        },
      },
      "",
      "secret",
    );

    expect(calls).toEqual([
      {
        kind: "message",
        packId: TcpEvent.RequestLoginoff,
        data: null,
        size: 0,
      },
    ]);
  });

  it("ports ZPlayer SendLogin as a credential ASCII send when credentials exist", () => {
    const calls: Array<
      | {
          kind: "message";
          packId: TcpEvent;
          data: Uint8Array | null;
          size: number;
        }
      | { kind: "ascii"; packId: TcpEvent; data: string }
    > = [];

    sendPlayerLogin(
      {
        sendMessage: (packId, data, size) => {
          calls.push({ kind: "message", packId, data, size });
          return 34;
        },
        sendMessageAscii: (packId, data) => {
          calls.push({ kind: "ascii", packId, data });
          return 35;
        },
      },
      "player",
      "secret",
    );

    expect(calls).toEqual([
      {
        kind: "message",
        packId: TcpEvent.RequestLoginoff,
        data: null,
        size: 0,
      },
      {
        kind: "ascii",
        packId: TcpEvent.SendLogin,
        data: "player,secret",
      },
    ]);
  });

  it("ports ZPlayer SendCreateUser as a create-user ASCII message send", () => {
    const calls: Array<{ packId: TcpEvent; data: string }> = [];
    const result = sendPlayerCreateUser(
      {
        sendMessageAscii: (packId, data) => {
          calls.push({ packId, data });
          return 31;
        },
      },
      "user",
      "login",
      "pass",
      "email@example.test",
    );

    expect(result).toBe(31);
    expect(calls).toEqual([
      {
        packId: TcpEvent.CreateUser,
        data: "user,login,pass,email@example.test",
      },
    ]);
  });

  it("ports ZPlayer ProcessChangeObjectAmount as button refresh and HUD unit amount update", () => {
    const calls: Array<string | number> = [];

    processPlayerChangeObjectAmount({
      ourTeam: TeamType.Blue,
      teamUnitsAvailable: [3, 7, 11],
      hud: {
        setUnitAmount: (unitAmount) => {
          calls.push("set-unit-amount", unitAmount);
        },
      },
      reSetupButtons: () => calls.push("re-setup-buttons"),
      checkUnitLimitReached: () => calls.push("check-unit-limit-reached"),
    });

    expect(calls).toEqual([
      "re-setup-buttons",
      "check-unit-limit-reached",
      "set-unit-amount",
      11,
    ]);
  });

  it("replaces ZPlayer SetUseOpenGL as player Canvas rendering path assignment", () => {
    const state = { useCanvasRendering: false };

    setPlayerCanvasRendering(state, true);
    expect(state.useCanvasRendering).toBe(true);

    setPlayerCanvasRendering(state, false);
    expect(state.useCanvasRendering).toBe(false);
  });

  it("ports ZPlayer RefindOurFortRefID as reset when no owned fort exists", () => {
    const enemyFort = createPlayerBuilding(
      "enemy-fort",
      TeamType.Red,
      BuildingType.FortFront,
      7,
    );
    const state = {
      fortRefId: 99,
      ourTeam: TeamType.Blue,
      objectList: [
        createPlayerUnit("owned-unit", TeamType.Blue, 0, 0),
        enemyFort,
      ],
    };

    refindPlayerFortRefId(state);

    expect(state.fortRefId).toBe(-1);
  });

  it("ports ZPlayer RefindOurFortRefID as first owned fort lookup", () => {
    const wrongOwner = createPlayerBuilding(
      "wrong-owner",
      TeamType.Red,
      BuildingType.FortFront,
      11,
    );
    const ownedRadar = createPlayerBuilding(
      "owned-radar",
      TeamType.Blue,
      BuildingType.Radar,
      12,
    );
    const ownedBackFort = createPlayerBuilding(
      "owned-back-fort",
      TeamType.Blue,
      BuildingType.FortBack,
      13,
    );
    const ownedFrontFort = createPlayerBuilding(
      "owned-front-fort",
      TeamType.Blue,
      BuildingType.FortFront,
      14,
    );
    const state = {
      fortRefId: -1,
      ourTeam: TeamType.Blue,
      objectList: [wrongOwner, ownedRadar, ownedBackFort, ownedFrontFort],
    };

    refindPlayerFortRefId(state);

    expect(state.fortRefId).toBe(13);
  });

  it("ports ZPlayer ClearAsciiStates over the tracked ASCII range", () => {
    const state = { asciiDown: Array.from({ length: PLAYER_ASCII_DOWN_MAX + 2 }, () => true) };

    clearPlayerAsciiStates(state);

    expect(state.asciiDown.slice(0, PLAYER_ASCII_DOWN_MAX)).toEqual(
      Array.from({ length: PLAYER_ASCII_DOWN_MAX }, () => false),
    );
    expect(state.asciiDown[PLAYER_ASCII_DOWN_MAX]).toBe(true);
    expect(state.asciiDown[PLAYER_ASCII_DOWN_MAX + 1]).toBe(true);
  });

  it("ports ZPlayer SetAsciiState as bounded lowercase key state update", () => {
    const state = {
      asciiDown: Array.from({ length: PLAYER_ASCII_DOWN_MAX }, () => false),
    };

    setPlayerAsciiState(state, "a".charCodeAt(0), true);
    setPlayerAsciiState(state, "z".charCodeAt(0), true);
    setPlayerAsciiState(state, "A".charCodeAt(0), true);
    setPlayerAsciiState(state, "{".charCodeAt(0), true);

    expect(state.asciiDown[0]).toBe(true);
    expect(state.asciiDown[PLAYER_ASCII_DOWN_MAX - 1]).toBe(true);
    expect(state.asciiDown.slice(1, PLAYER_ASCII_DOWN_MAX - 1)).toEqual(
      Array.from({ length: PLAYER_ASCII_DOWN_MAX - 2 }, () => false),
    );

    setPlayerAsciiState(state, "a".charCodeAt(0), false);

    expect(state.asciiDown[0]).toBe(false);
  });

  it("ports ZPlayer AsciiDown as bounded lowercase key state read", () => {
    const state = {
      asciiDown: Array.from({ length: PLAYER_ASCII_DOWN_MAX }, () => false),
    };
    state.asciiDown[1] = true;

    expect(isPlayerAsciiDown(state, "b".charCodeAt(0))).toBe(true);
    expect(isPlayerAsciiDown(state, "c".charCodeAt(0))).toBe(false);
    expect(isPlayerAsciiDown(state, "A".charCodeAt(0))).toBe(false);
    expect(isPlayerAsciiDown(state, "{".charCodeAt(0))).toBe(false);
  });

  it("ports ZPlayer ClearAnimals as bird list clearing", () => {
    const bird = { id: "bird" };
    const state = { birdList: [bird] };
    const birdList = state.birdList;

    clearPlayerAnimals(state);

    expect(state.birdList).toBe(birdList);
    expect(state.birdList).toEqual([]);
  });

  it("ports ZPlayer InitAnimals as ambient bird creation for map basics", () => {
    const state = { birdList: [{ id: 99 }] };
    const calls: Array<{
      terrainType: number;
      mapWidthPixels: number;
      mapHeightPixels: number;
    }> = [];

    initPlayerAnimals(
      state,
      {
        getMapBasics: () => ({ width: 50, height: 26, terrainType: 3 }),
      },
      (options) => {
        calls.push(options);
        return { id: calls.length, ...options };
      },
    );

    expect(calls).toEqual([
      { terrainType: 3, mapWidthPixels: 800, mapHeightPixels: 416 },
      { terrainType: 3, mapWidthPixels: 800, mapHeightPixels: 416 },
    ]);
    expect(state.birdList).toEqual([
      { id: 1, terrainType: 3, mapWidthPixels: 800, mapHeightPixels: 416 },
      { id: 2, terrainType: 3, mapWidthPixels: 800, mapHeightPixels: 416 },
    ]);
  });

  it("ports ZPlayer InitAnimals as clearing without birds on small maps", () => {
    const state = { birdList: [{ id: "old" }] };

    initPlayerAnimals(
      state,
      {
        getMapBasics: () => ({ width: 10, height: 10, terrainType: 1 }),
      },
      () => ({ id: "new" }),
    );

    expect(state.birdList).toEqual([]);
  });

  it("ports ZPlayer InitMenus as login and create-user menu construction", () => {
    const ztime = { now: 12 };
    const calls: Array<{ kind: string; ztime: typeof ztime }> = [];
    const state = {
      ztime,
      activeMenu: { kind: "login", ztime } as
        | { kind: "login"; ztime: typeof ztime }
        | { kind: "create-user"; ztime: typeof ztime }
        | null,
      loginMenu: null as { kind: "login"; ztime: typeof ztime } | null,
      createUserMenu: null as { kind: "create-user"; ztime: typeof ztime } | null,
    };

    initPlayerMenus(
      state,
      (menuZTime) => {
        calls.push({ kind: "login", ztime: menuZTime });
        return { kind: "login", ztime: menuZTime };
      },
      (menuZTime) => {
        calls.push({ kind: "create-user", ztime: menuZTime });
        return { kind: "create-user", ztime: menuZTime };
      },
    );

    expect(state.activeMenu).toBeNull();
    expect(state.loginMenu).toEqual({ kind: "login", ztime });
    expect(state.createUserMenu).toEqual({ kind: "create-user", ztime });
    expect(calls).toEqual([
      { kind: "login", ztime },
      { kind: "create-user", ztime },
    ]);
  });

  it("ports ZPlayer FocusCameraTo as centered camera focus timing", () => {
    const state = {
      zmap: {
        getViewShiftFull: () => ({
          x: 20,
          y: 30,
          viewWidth: 320,
          viewHeight: 240,
        }),
      },
      focusToX: 0,
      focusToY: 0,
      focusToOriginalDistance: 0,
      lastFocusToTime: 0,
      finalFocusToTime: 0,
      doFocusTo: false,
    };

    focusPlayerCameraTo(state, 300, 210, 12.5);

    expect(state.focusToX).toBe(140);
    expect(state.focusToY).toBe(90);
    expect(state.focusToOriginalDistance).toBeCloseTo(Math.sqrt(120 ** 2 + 60 ** 2));
    expect(state.lastFocusToTime).toBe(12.5);
    expect(state.finalFocusToTime).toBe(13.2);
    expect(state.doFocusTo).toBe(true);
  });

  it("ports ZPlayer FocusCameraTo already-centered early return", () => {
    const state = {
      zmap: {
        getViewShiftFull: () => ({
          x: 140,
          y: 90,
          viewWidth: 320,
          viewHeight: 240,
        }),
      },
      focusToX: 0,
      focusToY: 0,
      focusToOriginalDistance: 99,
      lastFocusToTime: 7,
      finalFocusToTime: 8,
      doFocusTo: false,
    };

    focusPlayerCameraTo(state, 300, 210, 12.5);

    expect(state.focusToX).toBe(140);
    expect(state.focusToY).toBe(90);
    expect(state.focusToOriginalDistance).toBe(99);
    expect(state.lastFocusToTime).toBe(7);
    expect(state.finalFocusToTime).toBe(8);
    expect(state.doFocusTo).toBe(false);
  });

  it("ports ZPlayer FocusCameraToFort guard exits", () => {
    const calls: unknown[] = [];
    const state = {
      ourTeam: TeamType.Null,
      objectList: [
        createFocusFortObject({
          owner: TeamType.Red,
          objectType: MapObjectType.Building,
          objectId: BuildingType.FortFront,
          centerX: 300,
          centerY: 400,
        }),
      ],
      zmap: createFocusFortMap(calls, false),
    };

    focusPlayerCameraToFort(state);
    expect(calls).toEqual(["loaded"]);

    state.zmap = createFocusFortMap(calls, true);
    focusPlayerCameraToFort(state);
    expect(calls).toEqual(["loaded", "loaded"]);
  });

  it("ports ZPlayer FocusCameraToFort as first owned fort camera jump", () => {
    const calls: unknown[] = [];
    const state = {
      ourTeam: TeamType.Blue,
      objectList: [
        createFocusFortObject({
          owner: TeamType.Red,
          objectType: MapObjectType.Building,
          objectId: BuildingType.FortFront,
          centerX: 100,
          centerY: 200,
        }),
        createFocusFortObject({
          owner: TeamType.Blue,
          objectType: MapObjectType.Vehicle,
          objectId: VehicleType.Light,
          centerX: 300,
          centerY: 400,
        }),
        createFocusFortObject({
          owner: TeamType.Blue,
          objectType: MapObjectType.Building,
          objectId: BuildingType.FortBack,
          centerX: 600,
          centerY: 700,
        }),
        createFocusFortObject({
          owner: TeamType.Blue,
          objectType: MapObjectType.Building,
          objectId: BuildingType.FortFront,
          centerX: 900,
          centerY: 1000,
        }),
      ],
      zmap: createFocusFortMap(calls, true),
    };

    focusPlayerCameraToFort(state);

    expect(calls).toEqual(["loaded", "view", "set", 440, 540]);
  });

  it("ports empty player button hooks as no-op functions", () => {
    expect(playerAButton()).toBeUndefined();
    expect(playerDButton()).toBeUndefined();
    expect(playerTButton()).toBeUndefined();
    expect(playerZButton()).toBeUndefined();
  });

  it("ports ZPlayer HandleButton as HUD button dispatch", () => {
    const calls: string[] = [];
    const player = {
      aButton: () => calls.push("A"),
      bButton: () => calls.push("B"),
      dButton: () => calls.push("D"),
      gButton: () => calls.push("G"),
      menuButton: () => calls.push("Menu"),
      rButton: () => calls.push("R"),
      tButton: () => calls.push("T"),
      vButton: () => calls.push("V"),
      zButton: () => calls.push("Z"),
    };

    handlePlayerButton(player, HudButton.A);
    handlePlayerButton(player, HudButton.B);
    handlePlayerButton(player, HudButton.D);
    handlePlayerButton(player, HudButton.G);
    handlePlayerButton(player, HudButton.Menu);
    handlePlayerButton(player, HudButton.R);
    handlePlayerButton(player, HudButton.T);
    handlePlayerButton(player, HudButton.V);
    handlePlayerButton(player, HudButton.Z);
    handlePlayerButton(player, HudButton.MaxHudButtons);

    expect(calls).toEqual(["A", "B", "D", "G", "Menu", "R", "T", "V", "Z"]);
  });

  it("ports ZPlayer B_Button as factory-list GUI toggle", () => {
    let toggles = 0;
    const state = {
      guiFactoryList: {
        toggleShow(): void {
          toggles += 1;
        },
      },
    };

    playerBButton(state);
    expect(toggles).toBe(1);

    playerBButton({ guiFactoryList: null });
    expect(toggles).toBe(1);
  });

  it("ports ZPlayer G_Button as orderly cannon type selection", () => {
    const calls: MapObjectType[] = [];

    playerGButton({
      orderlySelectUnitType: (objectType) => calls.push(objectType),
    });

    expect(calls).toEqual([MapObjectType.Cannon]);
  });

  it("ports ZPlayer R_Button as orderly robot type selection", () => {
    const calls: MapObjectType[] = [];

    playerRButton({
      orderlySelectUnitType: (objectType) => calls.push(objectType),
    });

    expect(calls).toEqual([MapObjectType.Robot]);
  });

  it("ports ZPlayer V_Button as orderly vehicle type selection", () => {
    const calls: MapObjectType[] = [];

    playerVButton({
      orderlySelectUnitType: (objectType) => calls.push(objectType),
    });

    expect(calls).toEqual([MapObjectType.Vehicle]);
  });

  it("ports ZPlayer Menu_Button as main-menu opening", () => {
    const calls: MainMenuType[] = [];

    playerMenuButton({
      loadMainMenu: (menuType) => calls.push(menuType),
    });

    expect(calls).toEqual([MainMenuType.MainMain]);
  });

  it("ports ZPlayer MainMenuMove as movement relay for active menus", () => {
    const calls: Array<[string, number, number]> = [];
    const state = {
      guiMenuList: [
        {
          move(px: number, py: number) {
            calls.push(["first", px, py]);
          },
        },
        {
          move(px: number, py: number) {
            calls.push(["second", px, py]);
          },
        },
      ],
    };

    movePlayerMainMenus(state, 2, 0.5);

    expect(calls).toEqual([
      ["first", 2, 0.5],
      ["second", 2, 0.5],
    ]);
  });

  it("ports ZPlayer MainMenuMotion as first-consuming main-menu routing", () => {
    const calls: unknown[] = [];
    const state = {
      initW: 800,
      initH: 600,
      mouseX: 11,
      mouseY: 22,
      hud: {
        reRenderAll: () => calls.push("hud"),
      },
      guiMenuList: [
        {
          getCoords: () => ({ x: 10, y: 10 }),
          motion(mouseX: number, mouseY: number) {
            calls.push(["first", mouseX, mouseY]);
            return false;
          },
          getDimensions: () => ({ width: 20, height: 20 }),
        },
        {
          getCoords: () => ({ x: 720, y: 10 }),
          motion(mouseX: number, mouseY: number) {
            calls.push(["second", mouseX, mouseY]);
            return true;
          },
          getDimensions: () => ({ width: 20, height: 20 }),
        },
        {
          getCoords: () => ({ x: 30, y: 30 }),
          motion() {
            calls.push("third");
            return true;
          },
          getDimensions: () => ({ width: 20, height: 20 }),
        },
      ],
    };

    expect(motionPlayerMainMenus(state)).toBe(true);
    expect(calls).toEqual([
      ["first", 11, 22],
      ["second", 11, 22],
      "hud",
    ]);
  });

  it("ports ZPlayer MainMenuMotion HUD refresh from previous menu position", () => {
    const calls: string[] = [];
    let moved = false;
    const state = {
      initW: 800,
      initH: 600,
      mouseX: 11,
      mouseY: 22,
      hud: {
        reRenderAll: () => calls.push("hud"),
      },
      guiMenuList: [
        {
          getCoords: () => (moved ? { x: 20, y: 20 } : { x: 720, y: 20 }),
          motion() {
            moved = true;
            return true;
          },
          getDimensions: () => ({ width: 20, height: 20 }),
        },
      ],
    };

    expect(motionPlayerMainMenus(state)).toBe(true);
    expect(calls).toEqual(["hud"]);
  });

  it("ports ZPlayer MainMenuMotion unhandled and non-HUD paths", () => {
    const calls: unknown[] = [];
    const unhandled = {
      initW: 800,
      initH: 600,
      mouseX: 11,
      mouseY: 22,
      hud: {
        reRenderAll: () => calls.push("hud-unhandled"),
      },
      guiMenuList: [
        {
          getCoords: () => ({ x: 20, y: 20 }),
          motion: () => false,
          getDimensions: () => ({ width: 20, height: 20 }),
        },
      ],
    };
    const awayFromHud = {
      initW: 800,
      initH: 600,
      mouseX: 11,
      mouseY: 22,
      hud: {
        reRenderAll: () => calls.push("hud-away"),
      },
      guiMenuList: [
        {
          getCoords: () => ({ x: 20, y: 20 }),
          motion: () => true,
          getDimensions: () => ({ width: 20, height: 20 }),
        },
      ],
    };

    expect(motionPlayerMainMenus(unhandled)).toBe(false);
    expect(motionPlayerMainMenus(awayFromHud)).toBe(true);
    expect(calls).toEqual([]);
  });

  it("ports ZPlayer MainMenuWheelUp as first-consuming main-menu routing", () => {
    const calls: string[] = [];
    const handled = wheelUpPlayerMainMenus({
      guiMenuList: [
        {
          wheelUpButton() {
            calls.push("first");
            return false;
          },
        },
        {
          wheelUpButton() {
            calls.push("second");
            return true;
          },
        },
        {
          wheelUpButton() {
            calls.push("third");
            return true;
          },
        },
      ],
    });

    expect(handled).toBe(true);
    expect(calls).toEqual(["first", "second"]);
  });

  it("ports ZPlayer MainMenuWheelUp unhandled path", () => {
    const calls: string[] = [];
    const handled = wheelUpPlayerMainMenus({
      guiMenuList: [
        {
          wheelUpButton() {
            calls.push("first");
            return false;
          },
        },
        {
          wheelUpButton() {
            calls.push("second");
            return false;
          },
        },
      ],
    });

    expect(handled).toBe(false);
    expect(calls).toEqual(["first", "second"]);
  });

  it("ports ZPlayer MainMenuWheelDown as first-consuming main-menu routing", () => {
    const calls: string[] = [];
    const handled = wheelDownPlayerMainMenus({
      guiMenuList: [
        {
          wheelDownButton() {
            calls.push("first");
            return false;
          },
        },
        {
          wheelDownButton() {
            calls.push("second");
            return true;
          },
        },
        {
          wheelDownButton() {
            calls.push("third");
            return true;
          },
        },
      ],
    });

    expect(handled).toBe(true);
    expect(calls).toEqual(["first", "second"]);
  });

  it("ports ZPlayer MainMenuWheelDown unhandled path", () => {
    const calls: string[] = [];
    const handled = wheelDownPlayerMainMenus({
      guiMenuList: [
        {
          wheelDownButton() {
            calls.push("first");
            return false;
          },
        },
        {
          wheelDownButton() {
            calls.push("second");
            return false;
          },
        },
      ],
    });

    expect(handled).toBe(false);
    expect(calls).toEqual(["first", "second"]);
  });

  it("ports ZPlayer MainMenuKeyPress as first-consuming main-menu routing", () => {
    const calls: Array<[string, number]> = [];
    const handled = keyPressPlayerMainMenus(
      {
        guiMenuList: [
          {
            keyPress(c: number) {
              calls.push(["first", c]);
              return false;
            },
          },
          {
            keyPress(c: number) {
              calls.push(["second", c]);
              return true;
            },
          },
          {
            keyPress(c: number) {
              calls.push(["third", c]);
              return true;
            },
          },
        ],
      },
      65,
    );

    expect(handled).toBe(true);
    expect(calls).toEqual([
      ["first", 65],
      ["second", 65],
    ]);
  });

  it("ports ZPlayer MainMenuKeyPress unhandled path", () => {
    const calls: Array<[string, number]> = [];
    const handled = keyPressPlayerMainMenus(
      {
        guiMenuList: [
          {
            keyPress(c: number) {
              calls.push(["first", c]);
              return false;
            },
          },
          {
            keyPress(c: number) {
              calls.push(["second", c]);
              return false;
            },
          },
        ],
      },
      13,
    );

    expect(handled).toBe(false);
    expect(calls).toEqual([
      ["first", 13],
      ["second", 13],
    ]);
  });

  it("ports ZPlayer CloseCurrentMainMenuEtc as first main-menu close priority", () => {
    const calls: string[] = [];

    closePlayerCurrentMainMenuEtc({
      guiMenuList: [
        {
          doKillMe() {
            calls.push("menu");
          },
        },
      ],
      guiFactoryList: {
        isVisible: () => true,
        toggleShow() {
          calls.push("factory");
        },
      },
      guiWindow: {
        doKillMe() {
          calls.push("window");
        },
      },
    });

    expect(calls).toEqual(["menu"]);
  });

  it("ports ZPlayer CloseCurrentMainMenuEtc as visible factory-list toggle priority", () => {
    const calls: string[] = [];

    closePlayerCurrentMainMenuEtc({
      guiMenuList: [],
      guiFactoryList: {
        isVisible: () => true,
        toggleShow() {
          calls.push("factory");
        },
      },
      guiWindow: {
        doKillMe() {
          calls.push("window");
        },
      },
    });

    expect(calls).toEqual(["factory"]);
  });

  it("ports ZPlayer CloseCurrentMainMenuEtc as active GUI window fallback", () => {
    const calls: string[] = [];

    closePlayerCurrentMainMenuEtc({
      guiMenuList: [],
      guiFactoryList: {
        isVisible: () => false,
        toggleShow() {
          calls.push("factory");
        },
      },
      guiWindow: {
        doKillMe() {
          calls.push("window");
        },
      },
    });

    expect(calls).toEqual(["window"]);
  });

  it("ports ZPlayer CloseCurrentMainMenuEtc empty surfaces as a no-op", () => {
    closePlayerCurrentMainMenuEtc({
      guiMenuList: [],
      guiFactoryList: null,
      guiWindow: null,
    });
  });

  it("ports ZPlayer DisableCursor as cursor-disabled state assignment", () => {
    const state = { disableZCursor: false };

    disablePlayerCursor(state, true);
    expect(state.disableZCursor).toBe(true);

    disablePlayerCursor(state, false);
    expect(state.disableZCursor).toBe(false);
  });

  it("ports ZPlayer SetSoundsOff as inverted music toggle", () => {
    const calls: boolean[] = [];

    setPlayerSoundsOff(true, (musicOn) => calls.push(musicOn));
    setPlayerSoundsOff(false, (musicOn) => calls.push(musicOn));

    expect(calls).toEqual([false, true]);
  });

  it("ports ZPlayer SetMusicOff as inverted music toggle", () => {
    const calls: boolean[] = [];

    setPlayerMusicOff(true, (musicOn) => calls.push(musicOn));
    setPlayerMusicOff(false, (musicOn) => calls.push(musicOn));

    expect(calls).toEqual([false, true]);
  });

  it("ports ZPlayer SetNextSoundSetting as incremented sound-setting delegation", () => {
    const calls: number[] = [];

    setNextPlayerSoundSetting(
      { soundSetting: SoundSetting.Sound75 },
      (soundSetting) => calls.push(soundSetting),
    );
    setNextPlayerSoundSetting(
      { soundSetting: SoundSetting.Sound100 },
      (soundSetting) => calls.push(soundSetting),
    );

    expect(calls).toEqual([
      SoundSetting.Sound100,
      SoundSetting.MaxSoundSettings,
    ]);
  });

  it("ports ZPlayer ExitProgram as audio shutdown before application exit", () => {
    const calls: string[] = [];

    exitPlayerProgram({
      closeAudio: () => calls.push("close-audio"),
      exit: (code) => calls.push(`exit:${code}`),
    });

    expect(calls).toEqual(["close-audio", "exit:0"]);
  });

  it("ports space-bar event lifetime expiry", () => {
    const event = { creationTime: 20 };

    expect(isPastSpaceBarEventLifetime(event, 29.999)).toBe(false);
    expect(isPastSpaceBarEventLifetime(event, 30)).toBe(false);
    expect(isPastSpaceBarEventLifetime(event, 30.001)).toBe(true);
  });

  it("ports SpaceBarEvent default construction", () => {
    expect(new SpaceBarEvent(undefined, undefined, undefined, 20)).toEqual({
      refId: -1,
      selectObject: false,
      openGui: false,
      creationTime: 20,
    });
  });

  it("ports SpaceBarEvent configured construction", () => {
    expect(new SpaceBarEvent(42, true, true, 20)).toEqual({
      refId: 42,
      selectObject: true,
      openGui: true,
      creationTime: 20,
    });
  });

  it("ports SpaceBarEvent clear without changing creation time", () => {
    const event = new SpaceBarEvent(42, true, true, 20);

    event.clear();

    expect(event).toEqual({
      refId: -1,
      selectObject: false,
      openGui: false,
      creationTime: 20,
    });
  });

  it("ports SpaceBarEvent past_lifetime using the stored creation time", () => {
    const event = new SpaceBarEvent(42, false, false, 20);

    expect(event.pastLifetime(30)).toBe(false);
    expect(event.pastLifetime(30.001)).toBe(true);
  });

  it("ports SpaceBarEvent equality by reference id only", () => {
    const event = new SpaceBarEvent(42, true, false, 20);
    const matchingEvent = new SpaceBarEvent(42, false, true, 99);
    const otherEvent = new SpaceBarEvent(7, true, false, 20);

    expect(event.equals(event)).toBe(true);
    expect(event.equals(matchingEvent)).toBe(true);
    expect(event.equals(otherEvent)).toBe(false);
  });

  it("ports ZPlayer AddSpaceBarEvent as newest-first insertion with duplicate removal", () => {
    const oldDuplicate = new SpaceBarEvent(42, false, true, 10);
    const otherEvent = new SpaceBarEvent(7, true, false, 11);
    const newEvent = new SpaceBarEvent(42, true, false, 12);
    const state = {
      spaceEventList: [oldDuplicate, otherEvent],
    };

    addPlayerSpaceBarEvent(state, newEvent);

    expect(state.spaceEventList).toEqual([newEvent, otherEvent]);
  });

  it("ports ZPlayer AddSpaceBarEvent as bounded retained history", () => {
    const state = {
      spaceEventList: [
        new SpaceBarEvent(1, false, false, 1),
        new SpaceBarEvent(2, false, false, 2),
        new SpaceBarEvent(3, false, false, 3),
        new SpaceBarEvent(4, false, false, 4),
        new SpaceBarEvent(5, false, false, 5),
      ],
    };
    const newEvent = new SpaceBarEvent(6, true, false, 6);

    addPlayerSpaceBarEvent(state, newEvent);

    expect(state.spaceEventList.map((event) => event.refId)).toEqual([
      6,
      1,
      2,
      3,
      4,
    ]);
  });

  it("ports selection_info::SetZTime as simulation clock reference assignment", () => {
    const ztime = new SimulationTime();
    const state = { ztime: null };

    setPlayerSelectionZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });

  it("ports selection_info::Clear as selection capability reset", () => {
    const selectedObject = {};
    const state = {
      haveExplosives: true,
      canPickupGrenades: true,
      canMove: true,
      canEquip: true,
      canAttack: true,
      canRepair: true,
      canBeRepaired: true,
      selectedList: [selectedObject],
    };

    clearPlayerSelectionInfo(state);

    expect(state).toEqual({
      haveExplosives: false,
      canPickupGrenades: false,
      canMove: false,
      canEquip: false,
      canAttack: false,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [],
    });
  });

  it("ports selection_info::ClearAll as selection and quick-group reset", () => {
    const quickGroups = Array.from({ length: 11 }, (_, index) => [
      { refId: index },
    ]);
    const state = {
      haveExplosives: true,
      canPickupGrenades: true,
      canMove: true,
      canEquip: true,
      canAttack: true,
      canRepair: true,
      canBeRepaired: true,
      selectedList: [{ refId: 99 }],
      quickGroups,
    };

    clearAllPlayerSelectionInfo(state);

    expect(state.selectedList).toEqual([]);
    expect(state.haveExplosives).toBe(false);
    expect(state.canPickupGrenades).toBe(false);
    expect(state.canMove).toBe(false);
    expect(state.canEquip).toBe(false);
    expect(state.canAttack).toBe(false);
    expect(state.canRepair).toBe(false);
    expect(state.canBeRepaired).toBe(false);
    expect(state.quickGroups.slice(0, 10)).toEqual([
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ]);
    expect(state.quickGroups[10]).toEqual([{ refId: 10 }]);
  });

  it("ports selection_info::ObjectIsSelected as exact selected-object lookup", () => {
    const selectedObject = { refId: 1 };
    const sameShapeObject = { refId: 1 };
    const state = { selectedList: [selectedObject] };

    expect(isPlayerObjectSelected(state, selectedObject)).toBe(true);
    expect(isPlayerObjectSelected(state, sameShapeObject)).toBe(false);
    expect(isPlayerObjectSelected(state, null)).toBe(false);
  });

  it("ports ZPlayer GiveHudSelected as random selected object forwarding", () => {
    const first = { refId: 1 };
    const second = { refId: 2 };
    const calls: Array<typeof first | typeof second | null> = [];
    const state = {
      selectedList: [first, second],
      hud: {
        setSelectedObject(selectedObject: typeof first | typeof second | null) {
          calls.push(selectedObject);
        },
      },
    };

    givePlayerHudSelected(state, () => 3);

    expect(calls).toEqual([second]);
  });

  it("ports ZPlayer GiveHudSelected as HUD selection clear when selection is empty", () => {
    const calls: Array<unknown | null> = [];
    const state = {
      selectedList: [],
      hud: {
        setSelectedObject(selectedObject: unknown | null) {
          calls.push(selectedObject);
        },
      },
    };

    givePlayerHudSelected(state, () => {
      throw new Error("randomInt should not be called");
    });

    expect(calls).toEqual([null]);
  });

  it("ports ZPlayer SelectZObject guard exits without changing selection", () => {
    const object = createSelectablePlayerObject({
      selectable: false,
      owner: TeamType.Red,
    });
    const state = createSelectZObjectState([createSelectablePlayerObject()]);

    expect(selectPlayerZObject(state, null)).toBe(false);
    expect(selectPlayerZObject(state, object)).toBe(false);
    expect(
      selectPlayerZObject(
        state,
        createSelectablePlayerObject({ owner: TeamType.Blue }),
      ),
    ).toBe(false);

    expect(state.selectedList).toHaveLength(1);
    expect(state.calls).toEqual([]);
  });

  it("ports ZPlayer SelectZObject as selecting the group leader and refreshing selection hooks", () => {
    const leader = createSelectablePlayerObject({
      objectType: MapObjectType.Robot,
      owner: TeamType.Red,
      canAttack: true,
      canPickupGrenades: true,
    });
    const member = createSelectablePlayerObject({
      groupLeader: leader,
      owner: TeamType.Red,
    });
    const previous = createSelectablePlayerObject({
      owner: TeamType.Red,
    });
    const state = createSelectZObjectState([previous]);

    expect(selectPlayerZObject(state, member)).toBe(true);

    expect(state.selectedList).toEqual([leader]);
    expect(state.canEquip).toBe(true);
    expect(state.canAttack).toBe(true);
    expect(state.canPickupGrenades).toBe(true);
    expect(leader.showWaypointsCalls).toBe(1);
    expect(state.calls).toEqual([
      "determine-cursor",
      ["hud", leader],
      "clear-dev-waypoints",
    ]);
  });

  it("ports selection_info::AverageCoordsOfSelected as null for empty selection", () => {
    expect(averageCoordsOfPlayerSelection({ selectedList: [] })).toBeNull();
  });

  it("ports selection_info::AverageCoordsOfSelected as truncated center average", () => {
    const calls: string[] = [];
    const state = {
      selectedList: [
        {
          getCenterCoords: () => {
            calls.push("first");
            return { x: 10, y: 20 };
          },
        },
        {
          getCenterCoords: () => {
            calls.push("second");
            return { x: 15, y: 25 };
          },
        },
        {
          getCenterCoords: () => {
            calls.push("third");
            return { x: 20, y: 40 };
          },
        },
      ],
    };

    expect(averageCoordsOfPlayerSelection(state)).toEqual({ x: 15, y: 28 });
    expect(calls).toEqual(["first", "second", "third"]);
  });

  it("ports selection_info::SetGroup as quick-group replacement", () => {
    const groupCalls: string[] = [];
    const previousObject = {
      id: "previous",
      setGroup: (group: number) => groupCalls.push(`previous:${group}`),
    };
    const selectedObject = {
      id: "selected",
      setGroup: (group: number) => groupCalls.push(`selected:${group}`),
    };
    const selectedAgain = {
      id: "selected-again",
      setGroup: (group: number) => groupCalls.push(`selected-again:${group}`),
    };
    const state = {
      selectedList: [selectedObject, selectedAgain],
      quickGroups: [[previousObject]],
    };

    setPlayerSelectionGroup(state, 0);

    expect(state.quickGroups[0]).toEqual([selectedObject, selectedAgain]);
    expect(state.quickGroups[0]).not.toBe(state.selectedList);
    expect(groupCalls).toEqual([
      "previous:-1",
      "selected:0",
      "selected-again:0",
    ]);

    state.selectedList.length = 0;
    expect(state.quickGroups[0]).toEqual([selectedObject, selectedAgain]);
  });

  it("ports selection_info::LoadGroup as quick-group selection restore", () => {
    const calls: string[] = [];
    const groupedObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Robot,
        objectId: RobotType.Grunt,
      }),
      hasExplosives: () => true,
      canAttack: () => false,
      canBeRepaired: () => false,
      canPickupGrenades: () => true,
      setGroup: (group: number) => calls.push(`grouped:${group}`),
      showWaypoints: () => calls.push("grouped:waypoints"),
    };
    const craneObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Vehicle,
        objectId: VehicleType.Crane,
      }),
      hasExplosives: () => false,
      canAttack: () => true,
      canBeRepaired: () => true,
      canPickupGrenades: () => false,
      setGroup: (group: number) => calls.push(`crane:${group}`),
      showWaypoints: () => calls.push("crane:waypoints"),
    };
    const state = {
      haveExplosives: false,
      canPickupGrenades: false,
      canMove: false,
      canEquip: false,
      canAttack: false,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [],
      quickGroups: [[], [], [groupedObject, craneObject]],
    };

    loadPlayerSelectionGroup(state, 2);

    expect(state.selectedList).toEqual([groupedObject, craneObject]);
    expect(state.selectedList).not.toBe(state.quickGroups[2]);
    expect(state.haveExplosives).toBe(true);
    expect(state.canPickupGrenades).toBe(true);
    expect(state.canMove).toBe(true);
    expect(state.canEquip).toBe(true);
    expect(state.canAttack).toBe(true);
    expect(state.canRepair).toBe(true);
    expect(state.canBeRepaired).toBe(true);
    expect(calls).toEqual([
      "grouped:2",
      "crane:2",
      "grouped:waypoints",
      "crane:waypoints",
    ]);
  });

  it("ports selection_info::SetupGroupDetails as selected capability refresh", () => {
    const waypointCalls: string[] = [];
    const state = {
      haveExplosives: true,
      canPickupGrenades: true,
      canMove: false,
      canEquip: false,
      canAttack: true,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [
        {
          getObjectId: () => ({
            objectType: MapObjectType.Robot,
            objectId: RobotType.Grunt,
          }),
          hasExplosives: () => true,
          canAttack: () => false,
          canBeRepaired: () => false,
          canPickupGrenades: () => true,
          showWaypoints: () => waypointCalls.push("robot"),
        },
        {
          getObjectId: () => ({
            objectType: MapObjectType.Vehicle,
            objectId: VehicleType.Crane,
          }),
          hasExplosives: () => false,
          canAttack: () => true,
          canBeRepaired: () => true,
          canPickupGrenades: () => false,
          showWaypoints: () => waypointCalls.push("crane"),
        },
      ],
    };

    setupPlayerSelectionGroupDetails(state, false);

    expect(state.haveExplosives).toBe(true);
    expect(state.canPickupGrenades).toBe(true);
    expect(state.canMove).toBe(true);
    expect(state.canEquip).toBe(true);
    expect(state.canAttack).toBe(true);
    expect(state.canRepair).toBe(true);
    expect(state.canBeRepaired).toBe(true);
    expect(waypointCalls).toEqual(["robot", "crane"]);
  });

  it("ports selection_info::UpdateGroupMember as selected member refresh", () => {
    const waypointCalls: string[] = [];
    const selectedObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Vehicle,
        objectId: VehicleType.Crane,
      }),
      hasExplosives: () => false,
      canAttack: () => true,
      canBeRepaired: () => true,
      canPickupGrenades: () => false,
      showWaypoints: () => waypointCalls.push("selected"),
    };
    const state = {
      haveExplosives: true,
      canPickupGrenades: true,
      canMove: false,
      canEquip: true,
      canAttack: false,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [selectedObject],
    };

    expect(updatePlayerSelectionGroupMember(state, selectedObject)).toBe(true);

    expect(state.haveExplosives).toBe(false);
    expect(state.canPickupGrenades).toBe(false);
    expect(state.canMove).toBe(true);
    expect(state.canEquip).toBe(false);
    expect(state.canAttack).toBe(true);
    expect(state.canRepair).toBe(true);
    expect(state.canBeRepaired).toBe(true);
    expect(waypointCalls).toEqual(["selected"]);
  });

  it("ports selection_info::UpdateGroupMember as false for unselected object", () => {
    const waypointCalls: string[] = [];
    const selectedObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Robot,
        objectId: RobotType.Grunt,
      }),
      hasExplosives: () => true,
      canAttack: () => true,
      canBeRepaired: () => false,
      canPickupGrenades: () => false,
      showWaypoints: () => waypointCalls.push("selected"),
    };
    const unselectedObject = {
      ...selectedObject,
      showWaypoints: () => waypointCalls.push("unselected"),
    };
    const state = {
      haveExplosives: false,
      canPickupGrenades: false,
      canMove: false,
      canEquip: false,
      canAttack: false,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [selectedObject],
    };

    expect(updatePlayerSelectionGroupMember(state, unselectedObject)).toBe(false);

    expect(state.haveExplosives).toBe(false);
    expect(state.canAttack).toBe(false);
    expect(waypointCalls).toEqual([]);
  });

  it("ports selection_info::RemoveFromSelected as identity removal and refresh", () => {
    const waypointCalls: string[] = [];
    const selectedObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Robot,
        objectId: RobotType.Grunt,
      }),
      hasExplosives: () => true,
      canAttack: () => true,
      canBeRepaired: () => false,
      canPickupGrenades: () => false,
      showWaypoints: () => waypointCalls.push("removed"),
    };
    const remainingObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Cannon,
        objectId: 0,
      }),
      hasExplosives: () => false,
      canAttack: () => false,
      canBeRepaired: () => false,
      canPickupGrenades: () => false,
      showWaypoints: () => waypointCalls.push("remaining"),
    };
    const state = {
      haveExplosives: true,
      canPickupGrenades: true,
      canMove: true,
      canEquip: true,
      canAttack: true,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [selectedObject, remainingObject, selectedObject],
    };

    removePlayerObjectFromSelection(state, selectedObject);

    expect(state.selectedList).toEqual([remainingObject]);
    expect(state.haveExplosives).toBe(false);
    expect(state.canPickupGrenades).toBe(false);
    expect(state.canMove).toBe(false);
    expect(state.canEquip).toBe(false);
    expect(state.canAttack).toBe(false);
    expect(waypointCalls).toEqual(["remaining"]);
  });

  it("ports selection_info::DeleteObject as selected and quick-group removal", () => {
    const waypointCalls: string[] = [];
    const deletedObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Robot,
        objectId: RobotType.Grunt,
      }),
      hasExplosives: () => true,
      canAttack: () => true,
      canBeRepaired: () => false,
      canPickupGrenades: () => false,
      showWaypoints: () => waypointCalls.push("deleted"),
    };
    const remainingObject = {
      getObjectId: () => ({
        objectType: MapObjectType.Vehicle,
        objectId: VehicleType.Crane,
      }),
      hasExplosives: () => false,
      canAttack: () => false,
      canBeRepaired: () => true,
      canPickupGrenades: () => false,
      showWaypoints: () => waypointCalls.push("remaining"),
    };
    const quickGroups = Array.from({ length: 11 }, () => [
      deletedObject,
      remainingObject,
      deletedObject,
    ]);
    const state = {
      haveExplosives: true,
      canPickupGrenades: true,
      canMove: false,
      canEquip: true,
      canAttack: true,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [deletedObject, remainingObject],
      quickGroups,
    };

    deletePlayerObjectFromSelection(state, deletedObject);

    expect(state.selectedList).toEqual([remainingObject]);
    expect(state.quickGroups.slice(0, 10)).toEqual(
      Array.from({ length: 10 }, () => [remainingObject]),
    );
    expect(state.quickGroups[10]).toEqual([
      deletedObject,
      remainingObject,
      deletedObject,
    ]);
    expect(state.canRepair).toBe(true);
    expect(state.canBeRepaired).toBe(true);
    expect(waypointCalls).toEqual(["remaining"]);
  });

  it("ports selection_info::GroupIsSelected as ordered quick-group comparison", () => {
    const first = { refId: 1 };
    const second = { refId: 2 };
    const state = {
      selectedList: [first, second],
      quickGroups: [[first, second], [second, first], [first]],
    };

    expect(isPlayerSelectionGroupSelected(state, 0)).toBe(true);
    expect(isPlayerSelectionGroupSelected(state, 1)).toBe(false);
    expect(isPlayerSelectionGroupSelected(state, 2)).toBe(false);
    expect(isPlayerSelectionGroupSelected(state, 3)).toBe(false);
    expect(
      isPlayerSelectionGroupSelected({ selectedList: [], quickGroups: [[]] }, 0),
    ).toBe(false);
  });

  it("ports ZPlayer LoadControlGroup as focus jump for already selected group", () => {
    const calls: Array<string | [number, number]> = [];
    const firstWaypoints = [{ x: 1 }];
    const first = {
      getObjectId: () => ({
        objectType: MapObjectType.Robot,
        objectId: RobotType.Grunt,
      }),
      hasExplosives: () => false,
      canAttack: () => true,
      canBeRepaired: () => false,
      canPickupGrenades: () => false,
      showWaypoints: () => calls.push("first-waypoints"),
      setGroup: (group: number) => calls.push(`first:${group}`),
      getCenterCoords: () => ({ x: 10, y: 20 }),
      getWayPointDevList: () => firstWaypoints,
    };
    const second = {
      ...first,
      showWaypoints: () => calls.push("second-waypoints"),
      setGroup: (group: number) => calls.push(`second:${group}`),
      getCenterCoords: () => ({ x: 30, y: 60 }),
      getWayPointDevList: () => [{ x: 2 }],
    };
    const state = {
      haveExplosives: false,
      canPickupGrenades: false,
      canMove: false,
      canEquip: false,
      canAttack: false,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [first, second],
      quickGroups: [[first, second]],
      hud: {
        setSelectedObject: () => calls.push("hud"),
      },
      focusCameraTo: (mapX: number, mapY: number) => calls.push([mapX, mapY]),
      determineCursor: () => calls.push("cursor"),
    };

    loadPlayerControlGroup(state, 0);

    expect(calls).toEqual([[20, 40]]);
    expect(firstWaypoints).toEqual([{ x: 1 }]);
  });

  it("ports ZPlayer LoadControlGroup as group restore and selection UI refresh", () => {
    const calls: Array<string | unknown> = [];
    const firstWaypoints = [{ x: 1 }];
    const first = {
      getObjectId: () => ({
        objectType: MapObjectType.Robot,
        objectId: RobotType.Grunt,
      }),
      hasExplosives: () => true,
      canAttack: () => false,
      canBeRepaired: () => false,
      canPickupGrenades: () => true,
      showWaypoints: () => calls.push("first-waypoints"),
      setGroup: (group: number) => calls.push(`first:${group}`),
      getCenterCoords: () => ({ x: 10, y: 20 }),
      getWayPointDevList: () => firstWaypoints,
    };
    const state = {
      haveExplosives: false,
      canPickupGrenades: false,
      canMove: false,
      canEquip: false,
      canAttack: true,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [],
      quickGroups: [[], [first]],
      hud: {
        setSelectedObject: (selectedObject: unknown | null) => {
          calls.push("hud", selectedObject);
        },
      },
      focusCameraTo: (mapX: number, mapY: number) => calls.push([mapX, mapY]),
      determineCursor: () => calls.push("cursor"),
    };

    loadPlayerControlGroup(state, 1);

    expect(state.selectedList).toEqual([first]);
    expect(firstWaypoints).toEqual([]);
    expect(state.haveExplosives).toBe(true);
    expect(state.canPickupGrenades).toBe(true);
    expect(state.canEquip).toBe(true);
    expect(state.canAttack).toBe(false);
    expect(calls).toEqual([
      "first:1",
      "first-waypoints",
      "cursor",
      "hud",
      first,
    ]);
  });

  it("ports ZPlayer LoadControlGroup invalid group bounds as no-ops", () => {
    const calls: string[] = [];
    const state = {
      haveExplosives: false,
      canPickupGrenades: false,
      canMove: false,
      canEquip: false,
      canAttack: false,
      canRepair: false,
      canBeRepaired: false,
      selectedList: [],
      quickGroups: [],
      hud: { setSelectedObject: () => calls.push("hud") },
      focusCameraTo: () => calls.push("focus"),
      determineCursor: () => calls.push("cursor"),
    };

    loadPlayerControlGroup(state, -1);
    loadPlayerControlGroup(state, 10);

    expect(calls).toEqual([]);
  });

  it("ports ZPlayer ClearDevWayPointsOfSelected as selected waypoint clearing", () => {
    const firstWaypoints = [{ x: 1 }, { x: 2 }];
    const secondWaypoints = [{ x: 3 }];
    const state = {
      selectedList: [
        { getWayPointDevList: () => firstWaypoints },
        { getWayPointDevList: () => secondWaypoints },
      ],
    };

    clearPlayerSelectedDevWaypoints(state);

    expect(firstWaypoints).toEqual([]);
    expect(secondWaypoints).toEqual([]);
  });

  it("ports ZPlayer DevWayPointsNoWay guard exits", () => {
    const attacker = createDevWaypointObject(
      MapObjectType.Robot,
      RobotType.Grunt,
      [{ mode: WaypointMode.Attack, refId: 7 }],
    );
    const state = {
      selectedList: [] as ReturnType<typeof createDevWaypointObject>[],
      unitCrossReferences: null,
    };

    expect(playerDevWaypointsNoWay(state, () => attacker)).toBe(false);

    state.selectedList = [attacker, attacker];
    expect(playerDevWaypointsNoWay(state, () => attacker)).toBe(false);

    state.selectedList = [
      createDevWaypointObject(MapObjectType.Robot, RobotType.Grunt, []),
    ];
    expect(playerDevWaypointsNoWay(state, () => attacker)).toBe(false);

    state.selectedList = [
      createDevWaypointObject(MapObjectType.Robot, RobotType.Grunt, [
        { mode: WaypointMode.Move, refId: 7 },
      ]),
    ];
    expect(playerDevWaypointsNoWay(state, () => attacker)).toBe(false);

    state.selectedList = [attacker];
    expect(playerDevWaypointsNoWay(state, () => null)).toBe(false);
  });

  it("ports ZPlayer DevWayPointsNoWay as losing attack waypoint rating", () => {
    const ratingState = { unitCrossReferences: null };
    initUnitCrossReferenceTable(ratingState);
    if (!ratingState.unitCrossReferences) {
      throw new Error("unit rating table should be initialized");
    }
    insertUnitCrossReference(
      { unitCrossReferences: ratingState.unitCrossReferences },
      MapObjectType.Robot,
      RobotType.Grunt,
      MapObjectType.Vehicle,
      VehicleType.Heavy,
      UnitCrossReference.WillDie,
    );
    const attacker = createDevWaypointObject(MapObjectType.Robot, RobotType.Grunt, [
      { mode: WaypointMode.Attack, refId: 7 },
    ]);
    const victim = createDevWaypointObject(MapObjectType.Vehicle, VehicleType.Heavy);

    expect(
      playerDevWaypointsNoWay(
        {
          selectedList: [attacker],
          unitCrossReferences: ratingState.unitCrossReferences,
        },
        (refId) => (refId === 7 ? victim : null),
      ),
    ).toBe(true);
  });

  it("ports ZPlayer DevWayPointsNoWay as false for non-losing attack waypoint rating", () => {
    const attacker = createDevWaypointObject(MapObjectType.Robot, RobotType.Grunt, [
      { mode: WaypointMode.Attack, refId: 7 },
    ]);
    const victim = createDevWaypointObject(MapObjectType.Vehicle, VehicleType.Jeep);

    expect(
      playerDevWaypointsNoWay(
        {
          selectedList: [attacker],
          unitCrossReferences: null,
        },
        () => victim,
      ),
    ).toBe(false);
  });

  it("ports ZPlayer UnitNearHostiles as false without a unit", () => {
    expect(
      unitNearPlayerHostiles({ passiveEngagableObjectList: [] }, null),
    ).toBe(false);
  });

  it("ports ZPlayer UnitNearHostiles as false when no valid hostile is near", () => {
    const unit = createPlayerUnit("unit", TeamType.Blue, 0, 0);
    const self = unit;
    const sameTeam = createPlayerUnit("same-team", TeamType.Blue, 1, 0);
    const nullTeam = createPlayerUnit("null-team", TeamType.Null, 1, 0);
    const destroyedHostile = createPlayerUnit("destroyed-hostile", TeamType.Red, 1, 0);
    const farHostile = createPlayerUnit("far-hostile", TeamType.Red, 20, 0);
    destroyedHostile.health = 0;

    expect(
      unitNearPlayerHostiles(
        {
          passiveEngagableObjectList: [
            self,
            sameTeam,
            nullTeam,
            destroyedHostile,
            farHostile,
          ],
        },
        unit,
      ),
    ).toBe(false);
  });

  it("ports ZPlayer UnitNearHostiles as true for a live hostile inside aggro radius", () => {
    const unit = createPlayerUnit("unit-near", TeamType.Blue, 0, 0);
    const hostile = createPlayerUnit("hostile-near", TeamType.Red, 8, 0);

    expect(
      unitNearPlayerHostiles(
        {
          passiveEngagableObjectList: [hostile],
        },
        unit,
      ),
    ).toBe(true);
  });
});

type SelectablePlayerTestObject = {
  showWaypointsCalls: number;
  groupLeader: SelectablePlayerTestObject | null;
  objectType: MapObjectType;
  objectId: number;
  owner: TeamType;
  selectableValue: boolean;
  canAttackValue: boolean;
  canPickupGrenadesValue: boolean;
  getGroupLeader(): SelectablePlayerTestObject | null;
  selectable(): boolean;
  getOwner(): number;
  getObjectId(): { objectType: number; objectId: number };
  hasExplosives(): boolean;
  canAttack(): boolean;
  canBeRepaired(): boolean;
  canPickupGrenades(): boolean;
  showWaypoints(): void;
};

function createSelectablePlayerObject(
  overrides: Partial<{
    groupLeader: SelectablePlayerTestObject | null;
    objectType: MapObjectType;
    objectId: number;
    owner: TeamType;
    selectable: boolean;
    canAttack: boolean;
    canPickupGrenades: boolean;
  }> = {},
): SelectablePlayerTestObject {
  return {
    showWaypointsCalls: 0,
    groupLeader: overrides.groupLeader ?? null,
    objectType: overrides.objectType ?? MapObjectType.Vehicle,
    objectId: overrides.objectId ?? VehicleType.Jeep,
    owner: overrides.owner ?? TeamType.Red,
    selectableValue: overrides.selectable ?? true,
    canAttackValue: overrides.canAttack ?? false,
    canPickupGrenadesValue: overrides.canPickupGrenades ?? false,
    getGroupLeader() {
      return this.groupLeader;
    },
    selectable() {
      return this.selectableValue;
    },
    getOwner() {
      return this.owner;
    },
    getObjectId() {
      return { objectType: this.objectType, objectId: this.objectId };
    },
    hasExplosives() {
      return false;
    },
    canAttack() {
      return this.canAttackValue;
    },
    canBeRepaired() {
      return false;
    },
    canPickupGrenades() {
      return this.canPickupGrenadesValue;
    },
    showWaypoints() {
      this.showWaypointsCalls += 1;
    },
  };
}

function createSelectZObjectState(
  selectedList: SelectablePlayerTestObject[],
): {
  calls: Array<string | ["hud", SelectablePlayerTestObject | null]>;
  ourTeam: TeamType;
  haveExplosives: boolean;
  canPickupGrenades: boolean;
  canMove: boolean;
  canEquip: boolean;
  canAttack: boolean;
  canRepair: boolean;
  canBeRepaired: boolean;
  selectedList: SelectablePlayerTestObject[];
  hud: { setSelectedObject(selectedObject: SelectablePlayerTestObject | null): void };
  determineCursor(): void;
  clearDevWaypointsOfSelected(): void;
} {
  const calls: Array<string | ["hud", SelectablePlayerTestObject | null]> = [];

  return {
    calls,
    ourTeam: TeamType.Red,
    haveExplosives: true,
    canPickupGrenades: true,
    canMove: true,
    canEquip: true,
    canAttack: true,
    canRepair: true,
    canBeRepaired: true,
    selectedList,
    hud: {
      setSelectedObject(selectedObject) {
        calls.push(["hud", selectedObject]);
      },
    },
    determineCursor() {
      calls.push("determine-cursor");
    },
    clearDevWaypointsOfSelected() {
      calls.push("clear-dev-waypoints");
    },
  };
}

function createFocusFortMap(calls: unknown[], loaded: boolean) {
  return {
    loaded() {
      calls.push("loaded");
      return loaded;
    },
    getViewShiftFull() {
      calls.push("view");
      return {
        x: 20,
        y: 30,
        viewWidth: 320,
        viewHeight: 240,
      };
    },
    setViewShift(x: number, y: number) {
      calls.push("set", x, y);
    },
  };
}

function createFocusFortObject(options: {
  owner: TeamType;
  objectType: MapObjectType;
  objectId: number;
  centerX: number;
  centerY: number;
}) {
  return {
    getOwner: () => options.owner,
    getObjectId: () => ({
      objectType: options.objectType,
      objectId: options.objectId,
    }),
    getCenterCoords: () => ({
      x: options.centerX,
      y: options.centerY,
    }),
  };
}

function createDevWaypointObject(
  objectType: MapObjectType,
  objectId: number,
  waypoints: Array<{ mode: number; refId: number }> = [],
): {
  getWayPointDevList(): Array<{ mode: number; refId: number }>;
  getObjectId(): { objectType: number; objectId: number };
} {
  return {
    getWayPointDevList() {
      return waypoints;
    },
    getObjectId() {
      return { objectType, objectId };
    },
  };
}

function createPlayerUnit(
  id: string,
  owner: TeamType,
  centerX: number,
  centerY: number,
): GameEntity {
  const entity = new GameEntity({
    id,
    kind: "unit",
    position: { x: centerX, y: centerY },
    owner,
  });
  entity.centerX = centerX;
  entity.centerY = centerY;
  entity.attackRadius = 10;
  entity.maxHealth = 100;
  entity.health = 100;
  return entity;
}

function createPlayerBuilding(
  id: string,
  owner: TeamType,
  objectId: BuildingType,
  refId: number,
): GameEntity {
  return new GameEntity({
    id,
    kind: "building",
    position: { x: 0, y: 0 },
    owner,
    refId,
    objectType: MapObjectType.Building,
    objectId,
  });
}
