import { describe, expect, it } from "vitest";
import { PlanetType, TeamType } from "../src/simulation/SimulationConstants";
import {
  HUD_HEALTH_BAR_MAX_FILL_PIXELS,
  HUD_HEIGHT_PIXELS,
  HUD_BUTTON_NAMES,
  HUD_PORTRAIT_X_PIXELS,
  HUD_PORTRAIT_Y_PIXELS,
  HUD_TIMER_HOURS_X_SHIFT_PIXELS,
  HUD_TIMER_MINUTES_X_SHIFT_PIXELS,
  HUD_TIMER_SECONDS_X_SHIFT_PIXELS,
  HUD_TIMER_Y_DOWN_SHIFT_PIXELS,
  HUD_WIDTH_PIXELS,
  HubButton,
  HudButton,
  HudButtonState,
  HudClickResponse,
  HudEndUnit,
  HudResponseType,
  ZHUD_HEADER_GUARD_PORTED,
  deleteHudObject,
  getHudARefId,
  giveHudSelectedCommand,
  overHudPortrait,
  resetHudGame,
  setHudARefId,
  setHudMaxUnits,
  setHudTerrainType,
  setHudTeam,
  setHudUnitAmount,
  setHudZTime,
  startHudEndAnimations,
} from "../src/ui/HudLayout";

describe("HUD layout", () => {
  it("adapts the zhud.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/HudLayout");
    const secondImport = await import("../src/ui/HudLayout");

    expect(ZHUD_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZHUD_HEADER_GUARD_PORTED).toBe(
      firstImport.ZHUD_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the upstream HUD viewport reservations", () => {
    expect(HUD_WIDTH_PIXELS).toBe(100);
    expect(HUD_HEIGHT_PIXELS).toBe(36);
  });

  it("ports HUD button identifiers", () => {
    expect(HudButton.A).toBe(0);
    expect(HudButton.B).toBe(1);
    expect(HudButton.D).toBe(2);
    expect(HudButton.G).toBe(3);
    expect(HudButton.R).toBe(4);
    expect(HudButton.T).toBe(5);
    expect(HudButton.V).toBe(6);
    expect(HudButton.Z).toBe(7);
    expect(HudButton.Menu).toBe(8);
    expect(HudButton.MaxHudButtons).toBe(9);
  });

  it("ports HUD button names", () => {
    expect(HUD_BUTTON_NAMES).toEqual([
      "a_button",
      "b_button",
      "d_button",
      "g_button",
      "r_button",
      "t_button",
      "v_button",
      "z_button",
      "menu_button",
    ]);
  });

  it("ports HUD button state identifiers", () => {
    expect(HudButtonState.Active).toBe(0);
    expect(HudButtonState.Inactive).toBe(1);
    expect(HudButtonState.Pressed).toBe(2);
    expect(HudButtonState.MaxHudButtonStates).toBe(3);
  });

  it("ports HubButton state and type accessors", () => {
    const button = new HubButton(HudButton.Menu, HudButtonState.Active);

    expect(button.getType()).toBe(HudButton.Menu);
    expect(button.name).toBe("menu_button");
    expect(button.currentState()).toBe(HudButtonState.Active);

    button.setState(HudButtonState.Pressed);
    expect(button.currentState()).toBe(HudButtonState.Pressed);

    button.setType(HudButton.G);
    expect(button.getType()).toBe(HudButton.G);
    expect(button.name).toBe("g_button");
  });

  it("ports HubButton SetShift as render and hit-test offsets", () => {
    const button = new HubButton();

    expect(button.shiftX).toBe(0);
    expect(button.shiftY).toBe(0);

    button.setShift(12, -4);

    expect(button.shiftX).toBe(12);
    expect(button.shiftY).toBe(-4);
  });

  it("ports HubButton WithinCords as shifted inclusive image hit testing", () => {
    const button = new HubButton();
    button.x = 10;
    button.y = 20;
    button.setShift(3, -2);
    const imageSize = { width: 12, height: 8 };

    expect(button.withinCords(13, 18, imageSize)).toBe(true);
    expect(button.withinCords(25, 26, imageSize)).toBe(true);
    expect(button.withinCords(12, 18, imageSize)).toBe(false);
    expect(button.withinCords(13, 17, imageSize)).toBe(false);
    expect(button.withinCords(26, 26, imageSize)).toBe(false);
    expect(button.withinCords(25, 27, imageSize)).toBe(false);
  });

  it("ports HUD response type identifiers", () => {
    expect(HudResponseType.Button).toBe(0);
    expect(HudResponseType.MiniMap).toBe(1);
    expect(HudResponseType.JumpToUnit).toBe(2);
  });

  it("ports hud_click_response construction through clear", () => {
    expect(new HudClickResponse()).toEqual({
      used: false,
      type: -1,
      button: 0,
      miniX: 0,
      miniY: 0,
      jumpRefId: -1,
    });
  });

  it("ports hud_click_response clear as partial response reset", () => {
    const response = new HudClickResponse();
    response.used = true;
    response.type = HudResponseType.MiniMap;
    response.button = HudButton.A;
    response.miniX = 4;
    response.miniY = 5;
    response.jumpRefId = 42;

    response.clear();

    expect(response).toEqual({
      used: false,
      type: -1,
      button: HudButton.A,
      miniX: 4,
      miniY: 5,
      jumpRefId: -1,
    });
  });

  it("ports HUD end-unit identifiers", () => {
    expect(new HudEndUnit()).toEqual({
      objectType: 0,
      objectId: 0,
      renderObjectId: 0,
    });
    expect(new HudEndUnit(1, 2, 3)).toEqual({
      objectType: 1,
      objectId: 2,
      renderObjectId: 3,
    });
  });

  it("ports ZHud::StartEndAnimations as end-animation state setup", () => {
    const source = [new HudEndUnit(1, 2, 3), new HudEndUnit(4, 5, 6)];
    const state = {
      doEndAnimations: false,
      doEndAnimationsWon: false,
      nextEndAnimTime: 42,
      endAnimations: [new HudEndUnit(9, 9, 9)],
    };

    startHudEndAnimations(state, source, true);

    expect(state).toEqual({
      doEndAnimations: true,
      doEndAnimationsWon: true,
      nextEndAnimTime: 0,
      endAnimations: [new HudEndUnit(1, 2, 3), new HudEndUnit(4, 5, 6)],
    });
    expect(state.endAnimations).not.toBe(source);
  });

  it("ports ZHud::GetARefID as active HUD reference accessor", () => {
    expect(getHudARefId({ activeRefId: 42 })).toBe(42);
  });

  it("ports ZHud::SetARefID as active reference assignment without timer state", () => {
    const state = {
      activeRefId: 1,
      ztime: null,
      nextACheckTime: 10,
      nextAFlashTime: 20,
      nextAAnimTime: 30,
    };

    setHudARefId(state, 7, () => 123);

    expect(state).toEqual({
      activeRefId: 7,
      ztime: null,
      nextACheckTime: 10,
      nextAFlashTime: 20,
      nextAAnimTime: 30,
    });
  });

  it("ports ZHud::SetARefID as active reference timer scheduling", () => {
    const state = {
      activeRefId: 1,
      ztime: { ztime: 42 },
      nextACheckTime: 0,
      nextAFlashTime: 0,
      nextAAnimTime: 0,
    };

    setHudARefId(state, 9, () => 451);

    expect(state).toEqual({
      activeRefId: 9,
      ztime: { ztime: 42 },
      nextACheckTime: 42.25,
      nextAFlashTime: 42.15,
      nextAAnimTime: 48.51,
    });
  });

  it("ports ZHud::DeleteObject as selected object cleanup", () => {
    const selectedObject = { refId: 42 };
    const calls: Array<typeof selectedObject | null> = [];
    const state = {
      selectedObject,
      setSelectedObject(selectedObject_: typeof selectedObject | null) {
        calls.push(selectedObject_);
        this.selectedObject = selectedObject_;
      },
    };

    deleteHudObject(state, selectedObject);

    expect(calls).toEqual([null]);
    expect(state.selectedObject).toBeNull();
  });

  it("keeps ZHud::DeleteObject unchanged for unselected objects", () => {
    const selectedObject = { refId: 42 };
    const deletedObject = { refId: 7 };
    const calls: Array<typeof selectedObject | null> = [];
    const state = {
      selectedObject,
      setSelectedObject(selectedObject_: typeof selectedObject | null) {
        calls.push(selectedObject_);
        this.selectedObject = selectedObject_;
      },
    };

    deleteHudObject(state, deletedObject);

    expect(calls).toEqual([]);
    expect(state.selectedObject).toBe(selectedObject);
  });

  it("ports ZHud::GiveSelectedCommand as selected object acknowledge animation", () => {
    const portrait = { id: "portrait" };
    const calls: unknown[][] = [];
    const state = {
      selectedObject: {
        playAcknowledgeAnim(portrait_: typeof portrait, noWay: boolean) {
          calls.push([portrait_, noWay]);
        },
      },
      portrait,
    };

    giveHudSelectedCommand(state, true);

    expect(calls).toEqual([[portrait, true]]);
  });

  it("keeps ZHud::GiveSelectedCommand unchanged without a selected object", () => {
    const state = {
      selectedObject: null,
      portrait: { id: "portrait" },
    };

    giveHudSelectedCommand(state, false);

    expect(state.selectedObject).toBeNull();
  });

  it("ports ZHud::ResetGame as transient HUD state cleanup", () => {
    const selectedObject = { refId: 42 };
    const calls: Array<typeof selectedObject | null | "unload"> = [];
    const state = {
      doEndAnimations: true,
      endAnimations: [new HudEndUnit(1, 2, 3)],
      activeRefId: 77,
      selectedObject,
      setSelectedObject(selectedObject_: typeof selectedObject | null) {
        calls.push(selectedObject_);
        this.selectedObject = selectedObject_;
      },
      unitAmount: 12,
      unitAmountText: {
        unload() {
          calls.push("unload");
        },
      },
    };

    resetHudGame(state);

    expect(state).toMatchObject({
      doEndAnimations: false,
      endAnimations: [],
      activeRefId: -1,
      selectedObject: null,
      unitAmount: -1,
    });
    expect(calls).toEqual([null, "unload"]);
  });

  it("ports ZHud::SetMaxUnits as max unit count assignment", () => {
    const state = { maxUnits: 0 };

    setHudMaxUnits(state, 70);

    expect(state.maxUnits).toBe(70);
  });

  it("ports ZHud::SetUnitAmount as changed unit count rerender invalidation", () => {
    const state = { unitAmount: 5, rerenderUnitAmount: false };

    setHudUnitAmount(state, 5);

    expect(state).toEqual({ unitAmount: 5, rerenderUnitAmount: false });

    setHudUnitAmount(state, 6);

    expect(state).toEqual({ unitAmount: 6, rerenderUnitAmount: true });
  });

  it("ports ZHud::SetZTime as timer clock reference assignment", () => {
    const state: { ztime: { now: number } | null } = { ztime: null };
    const ztime = { now: 42 };

    setHudZTime(state, ztime);
    expect(state.ztime).toBe(ztime);

    setHudZTime(state, null);
    expect(state.ztime).toBeNull();
  });

  it("ports ZHud::SetTerrainType as HUD and portrait terrain assignment", () => {
    const state = {
      terrain: PlanetType.Desert,
      portrait: { terrain: PlanetType.Desert },
      aportrait: { terrain: PlanetType.Desert },
    };

    setHudTerrainType(state, PlanetType.Arctic);

    expect(state).toEqual({
      terrain: PlanetType.Arctic,
      portrait: { terrain: PlanetType.Arctic },
      aportrait: { terrain: PlanetType.Arctic },
    });
  });

  it("ports ZHud::SetTeam as HUD and portrait team assignment", () => {
    const state = {
      team: TeamType.Null,
      portrait: { team: TeamType.Null },
      aportrait: { team: TeamType.Null },
    };

    setHudTeam(state, TeamType.Blue);

    expect(state).toEqual({
      team: TeamType.Blue,
      portrait: { team: TeamType.Blue },
      aportrait: { team: TeamType.Blue },
    });
  });

  it("ports the HUD portrait hit-test coordinates", () => {
    expect(HUD_PORTRAIT_X_PIXELS).toBe(556);
    expect(HUD_PORTRAIT_Y_PIXELS).toBe(44);
  });

  it("ports ZHud::OverPortrait as inclusive portrait hit testing", () => {
    expect(overHudPortrait(556, 44)).toBe(true);
    expect(overHudPortrait(556 + 86, 44 + 74)).toBe(true);
    expect(overHudPortrait(555, 44)).toBe(false);
    expect(overHudPortrait(556, 43)).toBe(false);
    expect(overHudPortrait(556 + 87, 44 + 74)).toBe(false);
    expect(overHudPortrait(556 + 86, 44 + 75)).toBe(false);
  });

  it("ports the HUD health-bar fill length", () => {
    expect(HUD_HEALTH_BAR_MAX_FILL_PIXELS).toBe(74);
  });

  it("ports the HUD timer offsets", () => {
    expect(HUD_TIMER_Y_DOWN_SHIFT_PIXELS).toBe(9);
    expect(HUD_TIMER_HOURS_X_SHIFT_PIXELS).toBe(38);
    expect(HUD_TIMER_MINUTES_X_SHIFT_PIXELS).toBe(38 + 14);
    expect(HUD_TIMER_SECONDS_X_SHIFT_PIXELS).toBe(38 + 14 + 23);
  });
});
