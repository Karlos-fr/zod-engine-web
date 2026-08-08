import { describe, expect, it } from "vitest";
import {
  CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER,
  CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE,
  CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX,
  CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE,
  CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
  CraneConstructionItem,
  ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED,
  beginCraneConstructionDeath,
  compareCraneConstructionRenderItemBottom,
  moveCraneConstructionItemToDestination,
  processCraneConstructionEffect,
  renderCraneConstructionEffect,
  setCraneConstructionBotInitialCoordinates,
  setCraneConstructionItemReturn,
  setCraneConstructionItemStart,
  setCraneConstructionTravelDistances,
  initCraneConstructionEffect,
  type CraneConstructionInitState,
} from "../src/simulation/CraneConstructionEffect";
import { CraneConstructionRenderItem } from "../src/rendering/EffectRenderTypes";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  TeamType,
} from "../src/simulation/SimulationConstants";

describe("crane construction effect", () => {
  it("adapts the ecraneconco.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/CraneConstructionEffect");
    const secondImport = await import("../src/simulation/CraneConstructionEffect");

    expect(ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED).toBe(
      firstImport.ECRANE_CONSTRUCTION_HEADER_GUARD_PORTED,
    );
  });

  it("ports travel_time_width as the travel animation window", () => {
    expect(CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH).toBe(0.8);
  });

  it("ports ECraneConcoItem default construction", () => {
    expect(new CraneConstructionItem()).toEqual({
      type: -1,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      destX: 0,
      destY: 0,
      width: 0,
      height: 0,
      widthDistance: 0,
      heightDistance: 0,
    });
  });

  it("ports ECraneConcoItem Init and Move", () => {
    const item = new CraneConstructionItem();

    item.init(3, 20, 30, 8, 12);
    item.destX = 45;
    item.destY = 50;
    item.setTravelDistances();
    item.move(0.5);

    expect(item).toEqual({
      type: 3,
      x: 32,
      y: 40,
      startX: 20,
      startY: 30,
      destX: 45,
      destY: 50,
      width: 8,
      height: 12,
      widthDistance: 25,
      heightDistance: 20,
    });
  });

  it("ports ECraneConcoItem SetStart, SetReturn, and MoveToDest", () => {
    const item = new CraneConstructionItem();
    item.init(2, 10, 20, 8, 12);

    item.setStart(50, 80);
    item.setReturn(100, 120);
    item.moveToDestination();

    expect(item).toEqual({
      type: 2,
      x: 96,
      y: 114,
      startX: 46,
      startY: 76,
      destX: 96,
      destY: 114,
      width: 8,
      height: 12,
      widthDistance: 50,
      heightDistance: 38,
    });
  });

  it("replaces ecc_render_item_comp as a strict bottom-edge comparison", () => {
    expect(
      compareCraneConstructionRenderItemBottom(
        { y: 10, height: 8 },
        { y: 12, height: 9 },
      ),
    ).toBe(true);
    expect(
      compareCraneConstructionRenderItemBottom(
        { y: 10, height: 8 },
        { y: 12, height: 6 },
      ),
    ).toBe(false);
    expect(
      compareCraneConstructionRenderItemBottom(
        { y: 10, height: 8 },
        { y: 5, height: 7 },
      ),
    ).toBe(false);
  });

  it("ports MoveToDest as a destination snap helper", () => {
    const item = {
      x: 10,
      y: 20,
      destX: 30,
      destY: 40,
    };

    moveCraneConstructionItemToDestination(item);

    expect(item).toEqual({
      x: 30,
      y: 40,
      destX: 30,
      destY: 40,
    });
  });

  it("ports SetTravelDistances as a travel delta helper", () => {
    const item = {
      x: 0,
      y: 0,
      startX: 8,
      startY: 12,
      destX: 28,
      destY: 4,
      height: 10,
      widthDistance: 99,
      heightDistance: 99,
    };

    setCraneConstructionTravelDistances(item);

    expect(item.widthDistance).toBe(20);
    expect(item.heightDistance).toBe(-8);
  });

  it("ports SetReturn as a centered return destination helper", () => {
    const item = {
      x: 10,
      y: 20,
      startX: 0,
      startY: 0,
      destX: 0,
      destY: 0,
      width: 8,
      height: 12,
      widthDistance: 0,
      heightDistance: 0,
    };

    setCraneConstructionItemReturn(item, 50, 80);

    expect(item).toEqual({
      x: 10,
      y: 20,
      startX: 10,
      startY: 20,
      destX: 46,
      destY: 74,
      width: 8,
      height: 12,
      widthDistance: 36,
      heightDistance: 54,
    });
  });

  it("ports SetStart as a centered start placement helper", () => {
    const item = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      width: 10,
    };

    setCraneConstructionItemStart(item, 50, 80);

    expect(item).toEqual({
      x: 45,
      y: 75,
      startX: 45,
      startY: 75,
      width: 10,
    });
  });

  it("ports ECraneConco BeginDeath as return travel setup", () => {
    const returns: Array<[number, number]> = [];
    const state = {
      travelBack: false,
      travelTimeStart: 0,
      travelTimeEnd: 0,
      travelTimeWidth: CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
      renderItems: [
        { setReturn: (x: number, y: number) => returns.push([x, y]) },
        { setReturn: (x: number, y: number) => returns.push([x, y]) },
      ],
    };

    beginCraneConstructionDeath(state, 40, 70, 12.5);

    expect(state).toEqual({
      travelBack: true,
      travelTimeStart: 12.5,
      travelTimeEnd: 13.3,
      travelTimeWidth: CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
      renderItems: state.renderItems,
    });
    expect(returns).toEqual([
      [56, 86],
      [56, 86],
    ]);
  });

  it("ports ECraneConco SetBotInitCords for regular buildings", () => {
    const randomInteger = createRandomIntegers([7, 11]);

    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: false,
          craneCenterX: 0,
          craneCenterY: 0,
          buildingX: 100,
          buildingY: 200,
          buildingWidth: 64,
          buildingHeight: 48,
        },
        randomInteger,
      ),
    ).toEqual({ x: 107, y: 275 });
  });

  it("ports ECraneConco SetBotInitCords for horizontal bridges", () => {
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: true,
          craneCenterX: 200,
          craneCenterY: 0,
          buildingX: 100,
          buildingY: 50,
          buildingWidth: 80,
          buildingHeight: 32,
        },
        createRandomIntegers([1, 5, 7]),
      ),
    ).toEqual({ x: 201, y: 57 });
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: true,
          craneCenterX: 90,
          craneCenterY: 0,
          buildingX: 100,
          buildingY: 50,
          buildingWidth: 80,
          buildingHeight: 32,
        },
        createRandomIntegers([1, 9, 3]),
      ),
    ).toEqual({ x: 75, y: 53 });
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: true,
          craneCenterX: 90,
          craneCenterY: 0,
          buildingX: 100,
          buildingY: 50,
          buildingWidth: 80,
          buildingHeight: 32,
        },
        createRandomIntegers([0, 12, 4]),
      ),
    ).toEqual({ x: 112, y: 70 });
  });

  it("ports ECraneConco SetBotInitCords for vertical bridges", () => {
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: true,
          craneCenterX: 0,
          craneCenterY: 40,
          buildingX: 30,
          buildingY: 100,
          buildingWidth: 32,
          buildingHeight: 80,
        },
        createRandomIntegers([1, 6, 10]),
      ),
    ).toEqual({ x: 36, y: 90 });
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: true,
          craneCenterX: 0,
          craneCenterY: 200,
          buildingX: 30,
          buildingY: 100,
          buildingWidth: 32,
          buildingHeight: 80,
        },
        createRandomIntegers([1, 8, 12]),
      ),
    ).toEqual({ x: 38, y: 208 });
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: true,
          craneCenterX: 0,
          craneCenterY: 200,
          buildingX: 30,
          buildingY: 100,
          buildingWidth: 32,
          buildingHeight: 80,
        },
        createRandomIntegers([0, 5, 14]),
      ),
    ).toEqual({ x: 51, y: 114 });
  });

  it("ports ECraneConco SetBotInitCords invalid bounds as no destination", () => {
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: false,
          craneCenterX: 0,
          craneCenterY: 0,
          buildingX: 100,
          buildingY: 200,
          buildingWidth: 16,
          buildingHeight: 48,
        },
        createRandomIntegers([]),
      ),
    ).toBeNull();
    expect(
      setCraneConstructionBotInitialCoordinates(
        {
          isBridge: false,
          craneCenterX: 0,
          craneCenterY: 0,
          buildingX: 100,
          buildingY: 200,
          buildingWidth: 64,
          buildingHeight: 16,
        },
        createRandomIntegers([]),
      ),
    ).toBeNull();
  });

  it("ports ECraneConco Process as robot frame timing", () => {
    const state = createCraneConstructionProcessState();

    processCraneConstructionEffect(state, 20, createRandomIntegers([5, 4, 0]));

    expect(state.nextJackbotTime).toBe(20.05);
    expect(state.jackbotIndex).toBe(1);
    expect(state.nextPaperBotTime).toBe(20.19);
    expect(state.paperBotIndex).toBe(0);
    expect(state.paperBotPointing).toBe(true);

    processCraneConstructionEffect(state, 21, createRandomIntegers([6]));

    expect(state.nextPaperBotTime).toBe(21.36);
    expect(state.paperBotIndex).toBe(1);
    expect(state.paperBotPointing).toBe(true);
  });

  it("ports ECraneConco Process travel-to movement and sorting", () => {
    const state = createCraneConstructionProcessState({
      travelTo: true,
      travelTimeStart: 10,
      travelTimeEnd: 14,
      travelTimeWidth: 4,
    });
    state.renderItems[0]?.moveToDestination();
    state.renderItems[1]?.moveToDestination();

    processCraneConstructionEffect(state, 12, createRandomIntegers([]));

    expect(state.concreteIndex).toBe(3);
    expect(state.signIndex).toBe(3);
    expect(getCraneConstructionProcessPositions(state)).toEqual([
      [15, 25],
      [10, 5],
    ]);
    expect(state.renderItemList.map((item) => item.type)).toEqual([2, 1]);
    expect(state.travelTo).toBe(true);
  });

  it("ports ECraneConco Process travel-to completion", () => {
    const state = createCraneConstructionProcessState({
      travelTo: true,
      travelTimeStart: 10,
      travelTimeEnd: 14,
      travelTimeWidth: 4,
      concreteIndex: 5,
      signIndex: 5,
    });

    processCraneConstructionEffect(state, 14, createRandomIntegers([]));

    expect(state.travelTo).toBe(false);
    expect(state.killMe).toBe(false);
    expect(state.concreteIndex).toBe(0);
    expect(state.signIndex).toBe(5);
    expect(getCraneConstructionProcessPositions(state)).toEqual([
      [30, 50],
      [20, 10],
    ]);
    expect(state.renderItemList.map((item) => item.type)).toEqual([2, 1]);
  });

  it("ports ECraneConco Process travel-back movement and completion", () => {
    const state = createCraneConstructionProcessState({
      travelBack: true,
      travelTimeStart: 10,
      travelTimeEnd: 14,
      travelTimeWidth: 4,
    });

    processCraneConstructionEffect(state, 12, createRandomIntegers([]));

    expect(state.travelBack).toBe(true);
    expect(state.killMe).toBe(false);
    expect(state.concreteIndex).toBe(3);
    expect(state.signIndex).toBe(3);
    expect(getCraneConstructionProcessPositions(state)).toEqual([
      [15, 25],
      [10, 5],
    ]);
    expect(state.renderItemList.map((item) => item.type)).toEqual([2, 1]);

    processCraneConstructionEffect(state, 14, createRandomIntegers([]));

    expect(state.travelBack).toBe(false);
    expect(state.killMe).toBe(true);
  });

  it("ports ECraneConco Process kill guard", () => {
    const state = createCraneConstructionProcessState({
      killMe: true,
      nextJackbotTime: 0,
      nextPaperBotTime: 0,
      travelTo: true,
    });

    processCraneConstructionEffect(state, 10, createRandomIntegers([1, 1, 1]));

    expect(state.jackbotIndex).toBe(0);
    expect(state.nextJackbotTime).toBe(0);
    expect(state.travelTo).toBe(true);
    expect(getCraneConstructionProcessPositions(state)).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("replaces ECraneConco DoRender with ordered render commands", () => {
    const commands = renderCraneConstructionEffect(
      createCraneConstructionRenderState(),
      createCraneConstructionRenderMap(),
    );

    expect(commands).toEqual([
      createRenderCommand("concrete-red-3", 10, 20),
      createRenderCommand("sign-red", 30, 40),
      createRenderCommand("cone-red", 50, 60),
      createRenderCommand("jack-red-1", 70, 80),
      createRenderCommand("paper-red-1", 90, 100),
    ]);
  });

  it("replaces ECraneConco DoRender with travel and pointing surface choices", () => {
    const state = createCraneConstructionRenderState({
      travelTo: true,
      paperBotPointing: true,
      paperBotIndex: 2,
      renderItemList: [
        { type: CraneConstructionRenderItem.Sign, x: 10, y: 20, widthDistance: 0 },
        {
          type: CraneConstructionRenderItem.ConeVariant1,
          x: 30,
          y: 40,
          widthDistance: 0,
        },
        { type: CraneConstructionRenderItem.Jack, x: 50, y: 60, widthDistance: 4 },
        { type: CraneConstructionRenderItem.Paper, x: 70, y: 80, widthDistance: -3 },
        { type: CraneConstructionRenderItem.Jack, x: 90, y: 100, widthDistance: 0 },
      ],
    });

    expect(
      renderCraneConstructionEffect(state, createCraneConstructionRenderMap()),
    ).toEqual([
      createRenderCommand("sign-flip-red-2", 10, 20),
      createRenderCommand("cone-no-shadow-red", 30, 40),
      createRenderCommand("travel-right-red", 50, 60),
      createRenderCommand("travel-left-red", 70, 80),
      createRenderCommand("travel-updown-red", 90, 100),
    ]);

    state.travelTo = false;

    expect(
      renderCraneConstructionEffect(state, createCraneConstructionRenderMap()).at(3),
    ).toEqual(createRenderCommand("point-red-2", 70, 80));
  });

  it("replaces ECraneConco DoRender kill and missing-surface cases", () => {
    expect(
      renderCraneConstructionEffect(
        createCraneConstructionRenderState({ killMe: true }),
        createCraneConstructionRenderMap(),
      ),
    ).toEqual([]);
    expect(
      renderCraneConstructionEffect(
        createCraneConstructionRenderState({
          concreteImages: [[], [null]],
          renderItemList: [
            {
              type: CraneConstructionRenderItem.Concrete,
              x: 10,
              y: 20,
              widthDistance: 0,
            },
            { type: 999, x: 30, y: 40, widthDistance: 0 },
          ],
        }),
        createCraneConstructionRenderMap(),
      ),
    ).toEqual([]);
  });

  it("ports ECraneConco Init as team-colored construction effect images", () => {
    type Surface = { id: string; width?: number; height?: number; w?: number; h?: number };
    type LoadedImage = {
      source: string | Surface | null;
      getBaseSurface(): Surface | null;
      loadBaseImage(source: string | Surface | null): void;
    };
    const madeSurfaces: Array<[number, Surface | null]> = [];
    const createImage = (): LoadedImage => ({
      source: null,
      getBaseSurface() {
        if (typeof this.source !== "string") return this.source;
        if (this.source.includes("/conco_red_n00.png")) {
          return { id: this.source, width: 24, height: 18 };
        }
        if (this.source.includes("/cone_red.png")) {
          return { id: this.source, w: 10, h: 12 };
        }
        if (this.source.includes("/sign_red.png")) {
          return { id: this.source, width: 14, height: 16 };
        }
        return { id: this.source };
      },
      loadBaseImage(source) {
        this.source = source;
      },
    });
    const state = {
      concoImages: createTeamFrames(8),
      signFlipImages: createTeamFrames(8),
      signImages: createTeamImages(),
      coneNoShadowImages: createTeamImages(),
      coneImages: createTeamImages(),
      robotJackhammerImages: createTeamFrames(2),
      robotPaperImages: createTeamFrames(2),
      robotPointImages: createTeamFrames(3),
      robotTravelLeftImages: createTeamImages(),
      robotTravelRightImages: createTeamImages(),
      robotTravelUpDownImages: createTeamImages(),
      concreteWidth: 0,
      concreteHeight: 0,
      coneWidth: 0,
      coneHeight: 0,
      signWidth: 0,
      signHeight: 0,
      finishedInit: false,
    } satisfies CraneConstructionInitState<Surface>;

    initCraneConstructionEffect(state, (team, surface) => {
      madeSurfaces.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(state.concoImages[TeamType.Red]?.[3]?.source).toBe(
      "assets/units/vehicles/crane/effects/conco_red_n03.png",
    );
    expect(state.concoImages[TeamType.Blue]?.[3]?.source).toEqual({
      id: "team-2-assets/units/vehicles/crane/effects/conco_red_n03.png",
    });
    expect(state.signFlipImages[TeamType.Red]?.[7]?.source).toBe(
      "assets/units/vehicles/crane/effects/sign_flip_red_n07.png",
    );
    expect(state.signImages[TeamType.Blue]?.source).toEqual({
      id: "team-2-assets/units/vehicles/crane/effects/sign_red.png",
    });
    expect(state.coneNoShadowImages[TeamType.Red]?.source).toBe(
      "assets/units/vehicles/crane/effects/cone_no_shadow_red.png",
    );
    expect(state.coneImages[TeamType.Blue]?.source).toEqual({
      id: "team-2-assets/units/vehicles/crane/effects/cone_red.png",
    });
    expect(state.robotJackhammerImages[TeamType.Red]?.[1]?.source).toBe(
      "assets/units/vehicles/crane/effects/robot_jackhammer_red_n01.png",
    );
    expect(state.robotPaperImages[TeamType.Blue]?.[1]?.source).toEqual({
      id: "team-2-assets/units/vehicles/crane/effects/robot_paper_red_n01.png",
    });
    expect(state.robotPointImages[TeamType.Red]?.[2]?.source).toBe(
      "assets/units/vehicles/crane/effects/robot_point_red_n02.png",
    );
    expect(state.robotTravelLeftImages[TeamType.Blue]?.source).toEqual({
      id: "team-2-assets/units/vehicles/crane/effects/robot_travel_left_red.png",
    });
    expect(state.robotTravelRightImages[TeamType.Red]?.source).toBe(
      "assets/units/vehicles/crane/effects/robot_travel_right_red.png",
    );
    expect(state.robotTravelUpDownImages[TeamType.Blue]?.source).toEqual({
      id: "team-2-assets/units/vehicles/crane/effects/robot_travel_updown_red.png",
    });
    expect(state.concreteWidth).toBe(24);
    expect(state.concreteHeight).toBe(18);
    expect(state.coneWidth).toBe(10);
    expect(state.coneHeight).toBe(12);
    expect(state.signWidth).toBe(14);
    expect(state.signHeight).toBe(16);
    expect(state.finishedInit).toBe(true);
    expect(madeSurfaces).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 29);

    function createTeamImages(): LoadedImage[] {
      return Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, createImage);
    }

    function createTeamFrames(frameCount: number): LoadedImage[][] {
      return Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: frameCount }, createImage),
      );
    }
  });

  it("ports construction object offsets from ecraneconco.cpp", () => {
    expect(CRANE_CONSTRUCTION_CONCRETE_DISTANCE_FROM_ENTRANCE).toBe(12);
    expect(CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_ENTRANCE).toBe(6);
    expect(CRANE_CONSTRUCTION_CONE_DISTANCE_FROM_CENTER).toBe(18);
    expect(CRANE_CONSTRUCTION_SIGN_DISTANCE_FROM_CONCRETE).toBe(6);
  });

  it("ports construction entrance offsets from ecraneconco.cpp", () => {
    expect(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE).toBe(16);
    expect(CRANE_CONSTRUCTION_DISTANCE_FROM_ENTRANCE_BOX).toBe(32);
  });
});

function createRandomIntegers(values: number[]): (maxExclusive: number) => number {
  return (maxExclusive) => {
    const value = values.shift();
    if (value === undefined) {
      throw new Error("missing test random integer");
    }
    return value % maxExclusive;
  };
}

function createCraneConstructionProcessState(
  overrides: Partial<Parameters<typeof processCraneConstructionEffect>[0]> = {},
): Parameters<typeof processCraneConstructionEffect>[0] {
  const first = new CraneConstructionItem();
  first.init(1, 0, 0, 10, 10);
  first.destX = 30;
  first.destY = 50;
  first.setTravelDistances();

  const second = new CraneConstructionItem();
  second.init(2, 0, 0, 10, 10);
  second.destX = 20;
  second.destY = 10;
  second.setTravelDistances();

  return {
    killMe: false,
    nextJackbotTime: 20,
    jackbotIndex: 0,
    nextPaperBotTime: 20,
    paperBotIndex: 1,
    paperBotPointing: false,
    travelTo: false,
    travelBack: false,
    travelTimeStart: 0,
    travelTimeEnd: 0,
    travelTimeWidth: CRANE_CONSTRUCTION_TRAVEL_TIME_WIDTH,
    concreteIndex: 0,
    signIndex: 0,
    renderItems: [first, second],
    renderItemList: [first, second],
    ...overrides,
  };
}

function getCraneConstructionProcessPositions(
  state: Parameters<typeof processCraneConstructionEffect>[0],
): number[][] {
  return (state.renderItems as CraneConstructionItem[]).map((item) => [
    item.x,
    item.y,
  ]);
}

function createCraneConstructionRenderState(
  overrides: Partial<Parameters<typeof renderCraneConstructionEffect<string>>[0]> = {},
): Parameters<typeof renderCraneConstructionEffect<string>>[0] {
  return {
    killMe: false,
    team: TeamType.Red,
    concreteImages: [[], createFrames("concrete-red", 8)],
    signFlipImages: [[], createFrames("sign-flip-red", 8)],
    signImages: [null, "sign-red"],
    coneNoShadowImages: [null, "cone-no-shadow-red"],
    coneImages: [null, "cone-red"],
    robotJackhammerImages: [[], createFrames("jack-red", 2)],
    robotPaperImages: [[], createFrames("paper-red", 3)],
    robotPointImages: [[], createFrames("point-red", 3)],
    robotTravelLeftImages: [null, "travel-left-red"],
    robotTravelRightImages: [null, "travel-right-red"],
    robotTravelUpDownImages: [null, "travel-updown-red"],
    concreteIndex: 3,
    signIndex: 2,
    jackbotIndex: 1,
    paperBotIndex: 1,
    paperBotPointing: false,
    travelTo: false,
    travelBack: false,
    renderItemList: [
      { type: CraneConstructionRenderItem.Concrete, x: 10, y: 20, widthDistance: 0 },
      { type: CraneConstructionRenderItem.Sign, x: 30, y: 40, widthDistance: 0 },
      { type: CraneConstructionRenderItem.ConeVariant0, x: 50, y: 60, widthDistance: 0 },
      { type: CraneConstructionRenderItem.Jack, x: 70, y: 80, widthDistance: 4 },
      { type: CraneConstructionRenderItem.Paper, x: 90, y: 100, widthDistance: -4 },
    ],
    ...overrides,
  };
}

function createFrames(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_value, index) => `${prefix}-${index}`);
}

function createCraneConstructionRenderMap(): {
  renderZSurface(
    surface: string,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): ReturnType<typeof createRenderCommand>;
} {
  return {
    renderZSurface(surface, x, y, renderHit, aboutCenter) {
      return { surface, x, y, renderHit, aboutCenter };
    },
  };
}

function createRenderCommand(surface: string, x: number, y: number): {
  surface: string;
  x: number;
  y: number;
  renderHit: boolean;
  aboutCenter: boolean;
} {
  return { surface, x, y, renderHit: false, aboutCenter: false };
}
