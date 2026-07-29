import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { RobotFactoryEntity } from "../src/simulation/entities/RobotFactoryEntity";
import { BuildingType } from "../src/simulation/SimulationConstants";
import { SimulationTime } from "../src/simulation/SimulationTime";
import {
  calculateProductionFullUnitSelectorXY,
  calculateProductionFullUnitSelectorWH,
  clickProductionUnitSelector,
  clearProductionFullUnitSelectorLists,
  clearProductionSelection,
  deleteProductionUnitSelectorDrawObject,
  doProductionCancelButton,
  doProductionCancelQueueItem,
  doProductionPlaceButton,
  doProductionQueueButton,
  doProductionUnitSelectorDownButton,
  doProductionUnitSelectorUpButton,
  getProductionRefId,
  getProductionSelected,
  getProductionUnitSelectorCoords,
  getProductionUnitSelectorObjectRefId,
  getProductionUnitSelectorRefId,
  getProductionUnitSelectorSelectedId,
  initProductionUnitSelector,
  isProductionActive,
  type ProductionBuildingReference,
  type ProductionObjectReference,
  PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH,
  PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
  ProductionBuildingState,
  ProductionType,
  PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS,
  PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS,
  PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS,
  PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
  setProductionActive,
  setProductionBuildList,
  setProductionBuildingObject,
  setProductionBuildingType,
  setProductionCenterCoords,
  setProductionCoords,
  setProductionIsOnlySelector,
  setProductionRefId,
  setProductionZTime,
  setProductionUnitSelectorActive,
  setProductionUnitSelectorCoords,
  setProductionUnitSelectorRefId,
  setProductionUnitSelectorZTime,
  shouldLoadProductionFullSelector,
  withinProductionUnitSelectorPortrait,
  wheelDownProduction,
  wheelUpProduction,
  ZGW_PRODUCTION_HEADER_GUARD_PORTED,
} from "../src/ui/ProductionWindow";

describe("production window", () => {
  it("adapts the gwproduction.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/ProductionWindow");
    const secondImport = await import("../src/ui/ProductionWindow");

    expect(ZGW_PRODUCTION_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_PRODUCTION_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_PRODUCTION_HEADER_GUARD_PORTED,
    );
  });

  it("ports full selector center offsets with C++ integer division", () => {
    expect(PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS).toBe(24);
    expect(PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS).toBe(21);
  });

  it("ports gwprod_type as production selector categories", () => {
    expect(ProductionType.Robot).toBe(0);
    expect(ProductionType.Vehicle).toBe(1);
    expect(ProductionType.Fort).toBe(2);
    expect(ProductionType.TypesMax).toBe(3);
  });

  it("ports building_state as production building states", () => {
    expect(ProductionBuildingState.Place).toBe(0);
    expect(ProductionBuildingState.Select).toBe(1);
    expect(ProductionBuildingState.Building).toBe(2);
    expect(ProductionBuildingState.Paused).toBe(3);
    expect(ProductionBuildingState.MaxBuildingStates).toBe(4);
  });

  it("ports the production ZObject forward declaration as an entity reference", () => {
    const entity = new GameEntity({
      id: "production-object",
      kind: "robot",
      position: { x: 1, y: 2 },
    });
    const reference: ProductionObjectReference = entity;

    expect(reference).toBe(entity);
  });

  it("ports the production ZBuilding forward declaration as a building reference", () => {
    const factory = new RobotFactoryEntity({
      id: "production-building",
      kind: "building",
      position: { x: 3, y: 4 },
    });
    const reference: ProductionBuildingReference = factory;

    expect(reference).toBe(factory);
    expect(reference.producesUnits()).toBe(true);
  });

  it("ports ClearSelected as production selection state reset", () => {
    const state = {
      selectedObjectType: 2,
      selectedObjectId: 8,
      objectSelected: true,
    };

    clearProductionSelection(state);

    expect(state).toEqual({
      selectedObjectType: 0,
      selectedObjectId: 0,
      objectSelected: false,
    });
  });

  it("ports GetSelected as a production selection snapshot", () => {
    const state = {
      selectedObjectType: 2,
      selectedObjectId: 8,
      objectSelected: true,
    };

    const selected = getProductionSelected(state);
    state.selectedObjectType = 0;

    expect(selected).toEqual({
      selectedObjectType: 2,
      selectedObjectId: 8,
      objectSelected: true,
    });
  });

  it("ports IsActive as a production active-state read", () => {
    expect(isProductionActive({ isActive: true })).toBe(true);
    expect(isProductionActive({ isActive: false })).toBe(false);
  });

  it("ports GWProduction SetActive as production active-state assignment", () => {
    const state = { isActive: false };

    setProductionActive(state, true);
    expect(state.isActive).toBe(true);

    setProductionActive(state, false);
    expect(state.isActive).toBe(false);
  });

  it("ports GWPUnitSelector SetActive as selector active-state assignment", () => {
    const state = { isActive: false };

    setProductionUnitSelectorActive(state, true);
    expect(state.isActive).toBe(true);

    setProductionUnitSelectorActive(state, false);
    expect(state.isActive).toBe(false);
  });

  it("ports GWProduction SetCoords as production window coordinate assignment", () => {
    const state = { x: 0, y: 0 };

    setProductionCoords(state, 10, 20);

    expect(state).toEqual({ x: 10, y: 20 });
  });

  it("ports SetCenterCoords as production window center assignment", () => {
    const state = { centerX: 0, centerY: 0 };

    setProductionCenterCoords(state, 24, 21);

    expect(state).toEqual({ centerX: 24, centerY: 21 });
  });

  it("ports GWPFullUnitSelector SetZTime as simulation clock reference assignment", () => {
    const ztime = new SimulationTime();
    const state = { ztime: null };

    setProductionZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });

  it("ports GWPUnitSelector SetCoords as unit selector coordinate assignment", () => {
    const state = { x: 0, y: 0 };

    setProductionUnitSelectorCoords(state, 30, 40);

    expect(state).toEqual({ x: 30, y: 40 });
  });

  it("ports GWPUnitSelector SetZTime as simulation clock reference assignment", () => {
    const ztime = new SimulationTime();
    const state = { ztime: null };

    setProductionUnitSelectorZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });

  it("ports GWPUnitSelector Init as percentage bar image loading", () => {
    const loadedFilenames: string[] = [];
    const percentageBarSurfaces: string[] = [];
    const yellowPercentageBarSurfaces: string[] = [];
    const state = {
      percentageBarImage: { imageFilename: "" },
      yellowPercentageBarImage: { imageFilename: "" },
      finishedInit: false,
    };

    initProductionUnitSelector(
      state,
      (filename) => {
        loadedFilenames.push(filename);
        return `surface:${filename}`;
      },
      (surface) => {
        if (surface) {
          percentageBarSurfaces.push(surface);
        }
      },
      (surface) => {
        if (surface) {
          yellowPercentageBarSurfaces.push(surface);
        }
      },
    );

    expect(state.percentageBarImage.imageFilename).toBe(
      PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH,
    );
    expect(state.yellowPercentageBarImage.imageFilename).toBe(
      PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
    );
    expect(loadedFilenames).toEqual([
      PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH,
      PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
    ]);
    expect(percentageBarSurfaces).toEqual([
      `surface:${PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH}`,
    ]);
    expect(yellowPercentageBarSurfaces).toEqual([
      `surface:${PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH}`,
    ]);
    expect(state.finishedInit).toBe(true);
  });

  it("ports GWPUnitSelector DeleteDrawObject as transient draw object cleanup", () => {
    const state = { drawObject: { id: "draw-object" } as { id: string } | null };

    deleteProductionUnitSelectorDrawObject(state);
    expect(state.drawObject).toBeNull();

    deleteProductionUnitSelectorDrawObject(state);
    expect(state.drawObject).toBeNull();
  });

  it("ports GWPFullUnitSelector ClearLists as cached lists and metadata reset", () => {
    const robotList = [{ id: "robot" }];
    const vehicleList = [{ id: "vehicle" }];
    const cannonList = [{ id: "cannon" }];
    const buttonList = [{ id: "button" }];
    const state = {
      robotList,
      vehicleList,
      cannonList,
      listsBuildingType: BuildingType.RobotFactory,
      listsBuildingLevel: 2,
      buttonList,
    };

    clearProductionFullUnitSelectorLists(state);

    expect(state.robotList).toBe(robotList);
    expect(state.vehicleList).toBe(vehicleList);
    expect(state.cannonList).toBe(cannonList);
    expect(state.buttonList).toBe(buttonList);
    expect(state).toEqual({
      robotList: [],
      vehicleList: [],
      cannonList: [],
      listsBuildingType: -1,
      listsBuildingLevel: -1,
      buttonList: [],
    });
  });

  it("ports GWPFullUnitSelector CalculateXY as centered coordinates without a map", () => {
    const state = {
      x: 0,
      y: 0,
      width: 41,
      height: 21,
      centerX: 100,
      centerY: 80,
      zmap: null,
    };

    calculateProductionFullUnitSelectorXY(state);

    expect({ x: state.x, y: state.y }).toEqual({ x: 80, y: 70 });
  });

  it("ports GWPFullUnitSelector CalculateXY as lower-bound margin clamp", () => {
    const state = {
      x: 0,
      y: 0,
      width: 80,
      height: 60,
      centerX: 20,
      centerY: 20,
      zmap: null,
    };

    calculateProductionFullUnitSelectorXY(state);

    expect({ x: state.x, y: state.y }).toEqual({ x: 16, y: 16 });
  });

  it("ports GWPFullUnitSelector CalculateXY as map-boundary clamp", () => {
    const state = {
      x: 0,
      y: 0,
      width: 80,
      height: 60,
      centerX: 300,
      centerY: 250,
      zmap: {
        getMapBasics: () => ({ width: 20, height: 15 }),
      },
    };

    calculateProductionFullUnitSelectorXY(state);

    expect({ x: state.x, y: state.y }).toEqual({ x: 224, y: 164 });
  });

  it("ports GWPFullUnitSelector CalculateWH as empty two-column frame size", () => {
    const state = {
      width: 0,
      height: 0,
      robotList: [],
      vehicleList: [],
      cannonList: [],
    };

    calculateProductionFullUnitSelectorWH(state);

    expect({ width: state.width, height: state.height }).toEqual({
      width: 104,
      height: 26,
    });
  });

  it("ports GWPFullUnitSelector CalculateWH from populated rows and widest row", () => {
    const state = {
      width: 0,
      height: 0,
      robotList: [{ id: "r1" }, { id: "r2" }, { id: "r3" }],
      vehicleList: [{ id: "v1" }],
      cannonList: [{ id: "c1" }, { id: "c2" }],
    };

    calculateProductionFullUnitSelectorWH(state);

    expect({ width: state.width, height: state.height }).toEqual({
      width: 151,
      height: 185,
    });
  });

  it("ports GWPUnitSelector GetCoords as a unit selector coordinate snapshot", () => {
    const state = { x: 30, y: 40 };

    const coords = getProductionUnitSelectorCoords(state);
    state.x = 0;

    expect(coords).toEqual({ x: 30, y: 40 });
  });

  it("ports GWPUnitSelector Click inactive selector as no-op", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: false,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      upButton: { click: () => calls.push("up") },
      downButton: { click: () => calls.push("down") },
    };

    expect(clickProductionUnitSelector(state, 35, 45)).toBe(false);
    expect(calls).toEqual([]);
  });

  it("ports GWPUnitSelector Click as local button routing and bounds hit testing", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: true,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      upButton: { click: (x: number, y: number) => calls.push(["up", x, y]) },
      downButton: {
        click: (x: number, y: number) => calls.push(["down", x, y]),
      },
    };

    expect(clickProductionUnitSelector(state, 35, 45)).toBe(true);
    expect(clickProductionUnitSelector(state, 29, 45)).toBe(false);
    expect(clickProductionUnitSelector(state, 35, 39)).toBe(false);
    expect(clickProductionUnitSelector(state, 80, 45)).toBe(false);
    expect(clickProductionUnitSelector(state, 35, 100)).toBe(false);
    expect(calls).toEqual([
      ["up", 5, 5],
      ["down", 5, 5],
      ["up", -1, 5],
      ["down", -1, 5],
      ["up", 5, -1],
      ["down", 5, -1],
      ["up", 50, 5],
      ["down", 50, 5],
      ["up", 5, 60],
      ["down", 5, 60],
    ]);
  });

  it("ports GWPUnitSelector GetSelectedID as draw object id read", () => {
    const emptyState = { drawObject: null };
    expect(getProductionUnitSelectorSelectedId(emptyState)).toEqual({
      selected: false,
      objectType: 0,
      objectId: 0,
    });

    const selectedState = {
      drawObject: {
        getObjectId() {
          return { objectType: 3, objectId: 7 };
        },
      },
    };

    expect(getProductionUnitSelectorSelectedId(selectedState)).toEqual({
      selected: true,
      objectType: 3,
      objectId: 7,
    });
  });

  it("ports GWPUnitSelector WithinPortrait as inclusive portrait hit testing", () => {
    expect(withinProductionUnitSelectorPortrait(2, 2)).toBe(true);
    expect(withinProductionUnitSelectorPortrait(46, 52)).toBe(true);
    expect(withinProductionUnitSelectorPortrait(1, 2)).toBe(false);
    expect(withinProductionUnitSelectorPortrait(2, 1)).toBe(false);
    expect(withinProductionUnitSelectorPortrait(47, 52)).toBe(false);
    expect(withinProductionUnitSelectorPortrait(46, 53)).toBe(false);
  });

  it("ports GWPUnitSelector DoUpButton as selected index advance with wrap", () => {
    const calls: Array<[number, number]> = [];
    const state = {
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList(buildingType: number, buildingLevel: number) {
          calls.push([buildingType, buildingLevel]);
          return ["grunt", "sniper"];
        },
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
    };

    doProductionUnitSelectorUpButton(state);
    expect(state.selectedIndex).toBe(1);

    doProductionUnitSelectorUpButton(state);
    expect(state.selectedIndex).toBe(0);
    expect(calls).toEqual([
      [BuildingType.RobotFactory, 2],
      [BuildingType.RobotFactory, 2],
    ]);
  });

  it("ports GWPUnitSelector DoUpButton guard exits", () => {
    const noBuilding = {
      buildingObject: null,
      buildList: {
        getBuildList: () => ["grunt"],
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
    };
    const noBuildList = {
      buildingObject: { getLevel: () => 2 },
      buildList: null,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
    };
    const emptyBuildList = {
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList: () => [],
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
    };

    doProductionUnitSelectorUpButton(noBuilding);
    doProductionUnitSelectorUpButton(noBuildList);
    doProductionUnitSelectorUpButton(emptyBuildList);

    expect(noBuilding.selectedIndex).toBe(0);
    expect(noBuildList.selectedIndex).toBe(0);
    expect(emptyBuildList.selectedIndex).toBe(0);
  });

  it("ports GWPUnitSelector DoDownButton as selected index decrement with wrap", () => {
    const calls: Array<[number, number]> = [];
    const state = {
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList(buildingType: number, buildingLevel: number) {
          calls.push([buildingType, buildingLevel]);
          return ["grunt", "sniper"];
        },
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 1,
    };

    doProductionUnitSelectorDownButton(state);
    expect(state.selectedIndex).toBe(0);

    doProductionUnitSelectorDownButton(state);
    expect(state.selectedIndex).toBe(1);
    expect(calls).toEqual([
      [BuildingType.RobotFactory, 2],
      [BuildingType.RobotFactory, 2],
    ]);
  });

  it("ports GWPUnitSelector DoDownButton guard exits", () => {
    const noBuilding = {
      buildingObject: null,
      buildList: {
        getBuildList: () => ["grunt"],
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
    };
    const noBuildList = {
      buildingObject: { getLevel: () => 2 },
      buildList: null,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
    };
    const emptyBuildList = {
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList: () => [],
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
    };

    doProductionUnitSelectorDownButton(noBuilding);
    doProductionUnitSelectorDownButton(noBuildList);
    doProductionUnitSelectorDownButton(emptyBuildList);

    expect(noBuilding.selectedIndex).toBe(0);
    expect(noBuildList.selectedIndex).toBe(0);
    expect(emptyBuildList.selectedIndex).toBe(0);
  });

  it("ports SetIsOnlySelector as selector mode state update", () => {
    const state = { isOnlySelector: false };

    setProductionIsOnlySelector(state, true);
    expect(state.isOnlySelector).toBe(true);

    setProductionIsOnlySelector(state, false);
    expect(state.isOnlySelector).toBe(false);
  });

  it("ports SetBuildingType as production building type update", () => {
    const state = { buildingType: BuildingType.FortFront };

    setProductionBuildingType(state, BuildingType.VehicleFactory);

    expect(state.buildingType).toBe(BuildingType.VehicleFactory);
  });

  it("ports SetUnitSelectorRefID as unit selector reference update", () => {
    const state = { unitSelectorRefId: 0 };

    setProductionUnitSelectorRefId(state, 42);

    expect(state.unitSelectorRefId).toBe(42);
  });

  it("ports SetRefID as production reference update", () => {
    const state = { refId: 0 };

    setProductionRefId(state, 42);

    expect(state.refId).toBe(42);
  });

  it("ports GWProduction GetRefID as a production reference read", () => {
    const state = { refId: 42 };

    expect(getProductionRefId(state)).toBe(42);
  });

  it("ports GWPUnitSelector GetRefID as a unit selector object reference read", () => {
    const state = { refId: 88 };

    expect(getProductionUnitSelectorObjectRefId(state)).toBe(88);
  });

  it("ports GetUnitSelectorRefID as unit selector reference read", () => {
    const state = { unitSelectorRefId: 77 };

    expect(getProductionUnitSelectorRefId(state)).toBe(77);
  });

  it("ports GWPUnitSelector LoadFullSelector as a full-selector load flag read", () => {
    expect(shouldLoadProductionFullSelector({ loadFullSelector: true })).toBe(
      true,
    );
    expect(shouldLoadProductionFullSelector({ loadFullSelector: false })).toBe(
      false,
    );
  });

  it("ports GWProduction WheelUpButton as unit selector first, queue fallback", () => {
    const calls: string[] = [];
    const handledByUnit = wheelUpProduction({
      unitSelector: {
        wheelUpButton() {
          calls.push("unit-up");
          return true;
        },
        wheelDownButton: () => false,
      },
      queueSelector: {
        wheelUpButton() {
          calls.push("queue-up");
          return true;
        },
        wheelDownButton: () => false,
      },
    });

    expect(handledByUnit).toBe(true);
    expect(calls).toEqual(["unit-up"]);

    calls.length = 0;

    const handledByQueue = wheelUpProduction({
      unitSelector: {
        wheelUpButton() {
          calls.push("unit-up");
          return false;
        },
        wheelDownButton: () => false,
      },
      queueSelector: {
        wheelUpButton() {
          calls.push("queue-up");
          return true;
        },
        wheelDownButton: () => false,
      },
    });

    expect(handledByQueue).toBe(true);
    expect(calls).toEqual(["unit-up", "queue-up"]);
  });

  it("ports GWProduction WheelDownButton as unit selector first, queue fallback", () => {
    const calls: string[] = [];
    const handledByUnit = wheelDownProduction({
      unitSelector: {
        wheelUpButton: () => false,
        wheelDownButton() {
          calls.push("unit-down");
          return true;
        },
      },
      queueSelector: {
        wheelUpButton: () => false,
        wheelDownButton() {
          calls.push("queue-down");
          return true;
        },
      },
    });

    expect(handledByUnit).toBe(true);
    expect(calls).toEqual(["unit-down"]);

    calls.length = 0;

    const handledByQueue = wheelDownProduction({
      unitSelector: {
        wheelUpButton: () => false,
        wheelDownButton() {
          calls.push("unit-down");
          return false;
        },
      },
      queueSelector: {
        wheelUpButton: () => false,
        wheelDownButton() {
          calls.push("queue-down");
          return true;
        },
      },
    });

    expect(handledByQueue).toBe(true);
    expect(calls).toEqual(["unit-down", "queue-down"]);
  });

  it("ports GWProduction SetBuildList as shared selector build-list assignment", () => {
    const buildList = { id: "build-list" };
    const calls: Array<[string, typeof buildList | null]> = [];
    const state = {
      buildList: null as typeof buildList | null,
      unitSelector: {
        setBuildList(buildList_: typeof buildList | null) {
          calls.push(["unit", buildList_]);
        },
      },
      queueSelector: {
        setBuildList(buildList_: typeof buildList | null) {
          calls.push(["queue", buildList_]);
        },
      },
      fullSelector: {
        setBuildList(buildList_: typeof buildList | null) {
          calls.push(["full", buildList_]);
        },
      },
    };

    setProductionBuildList(state, buildList);

    expect(state.buildList).toBe(buildList);
    expect(calls).toEqual([
      ["unit", buildList],
      ["queue", buildList],
      ["full", buildList],
    ]);

    setProductionBuildList(state, null);

    expect(state.buildList).toBeNull();
    expect(calls.slice(3)).toEqual([
      ["unit", null],
      ["queue", null],
      ["full", null],
    ]);
  });

  it("ports GWProduction SetBuildingObj as shared selector building assignment", () => {
    const buildingObject = { refId: 42 };
    const calls: Array<[string, typeof buildingObject | null]> = [];
    const state = {
      buildingObject: null as typeof buildingObject | null,
      unitSelector: {
        setBuildingObject(buildingObject_: typeof buildingObject | null) {
          calls.push(["unit", buildingObject_]);
        },
      },
      queueSelector: {
        setBuildingObject(buildingObject_: typeof buildingObject | null) {
          calls.push(["queue", buildingObject_]);
        },
      },
      fullSelector: {
        setBuildingObject(buildingObject_: typeof buildingObject | null) {
          calls.push(["full", buildingObject_]);
        },
      },
    };

    setProductionBuildingObject(state, buildingObject);

    expect(state.buildingObject).toBe(buildingObject);
    expect(calls).toEqual([
      ["unit", buildingObject],
      ["queue", buildingObject],
      ["full", buildingObject],
    ]);

    setProductionBuildingObject(state, null);

    expect(state.buildingObject).toBeNull();
    expect(calls.slice(3)).toEqual([
      ["unit", null],
      ["queue", null],
      ["full", null],
    ]);
  });

  it("ports GWProduction DoQueueButton as new queue item flag emission", () => {
    const flags = {
      sendNewQueueItem: false,
      qot: -1,
      qoid: -1,
      qrefId: 0,
    };
    const state = {
      queueSelector: {
        getSelectedId: () => ({
          selected: true,
          objectType: 3,
          objectId: 7,
        }),
      },
      buildingObject: { getRefId: () => 42 },
      flags,
    };

    doProductionQueueButton(state);

    expect(flags).toEqual({
      sendNewQueueItem: true,
      qot: 3,
      qoid: 7,
      qrefId: 42,
    });
  });

  it("ports GWProduction DoQueueButton unselected queue as a no-op", () => {
    const flags = {
      sendNewQueueItem: false,
      qot: -1,
      qoid: -1,
      qrefId: 0,
    };
    const state = {
      queueSelector: {
        getSelectedId: () => ({
          selected: false,
          objectType: 3,
          objectId: 7,
        }),
      },
      buildingObject: { getRefId: () => 42 },
      flags,
    };

    doProductionQueueButton(state);

    expect(flags).toEqual({
      sendNewQueueItem: false,
      qot: -1,
      qoid: -1,
      qrefId: 0,
    });
  });

  it("ports GWProduction DoCancelQueueItem as queue cancellation flag emission", () => {
    const flags = {
      sendCancelQueueItem: false,
      qcrefId: 0,
      qcIndex: -1,
      qcot: -1,
      qcoid: -1,
    };
    const state = {
      buildingObject: { getRefId: () => 42 },
      queueButtonList: [
        { ot: 1, oid: 10 },
        { ot: 2, oid: 20 },
      ],
      flags,
    };

    doProductionCancelQueueItem(state, 1);

    expect(flags).toEqual({
      sendCancelQueueItem: true,
      qcrefId: 42,
      qcIndex: 1,
      qcot: 2,
      qcoid: 20,
    });
  });

  it("ports GWProduction DoCancelQueueItem bounds checks as no-op exits", () => {
    const flags = {
      sendCancelQueueItem: false,
      qcrefId: 0,
      qcIndex: -1,
      qcot: -1,
      qcoid: -1,
    };
    const state = {
      buildingObject: { getRefId: () => 42 },
      queueButtonList: [{ ot: 1, oid: 10 }],
      flags,
    };

    doProductionCancelQueueItem(state, -1);
    doProductionCancelQueueItem(state, 1);

    expect(flags).toEqual({
      sendCancelQueueItem: false,
      qcrefId: 0,
      qcIndex: -1,
      qcot: -1,
      qcoid: -1,
    });
  });

  it("ports GWProduction DoCancelButton as close for non-building states", () => {
    const flags = {
      sendStopProduction: false,
      prefId: 0,
    };
    const states = [
      ProductionBuildingState.Paused,
      ProductionBuildingState.Place,
      ProductionBuildingState.Select,
    ];

    for (const productionState of states) {
      const state = {
        state: productionState,
        buildingObject: { getRefId: () => 42 },
        killme: false,
        flags,
      };

      doProductionCancelButton(state);

      expect(state.killme).toBe(true);
    }

    expect(flags).toEqual({
      sendStopProduction: false,
      prefId: 0,
    });
  });

  it("ports GWProduction DoCancelButton as stop-production emission while building", () => {
    const flags = {
      sendStopProduction: false,
      prefId: 0,
    };
    const state = {
      state: ProductionBuildingState.Building,
      buildingObject: { getRefId: () => 42 },
      killme: false,
      flags,
    };

    doProductionCancelButton(state);

    expect(state.killme).toBe(false);
    expect(flags).toEqual({
      sendStopProduction: true,
      prefId: 42,
    });
  });

  it("ports GWProduction DoPlaceButton guard exits as no placement request", () => {
    const flags = {
      placeCannon: false,
      coid: 0,
      crefId: 0,
      cleft: 0,
      cright: 0,
      ctop: 0,
      cbottom: 0,
    };
    const state = {
      buildingObject: null,
      killme: false,
      flags,
    };

    doProductionPlaceButton(state);
    expect(state.killme).toBe(false);
    expect(flags.placeCannon).toBe(false);

    state.buildingObject = {
      getRefId: () => 42,
      getBuiltCannonList: () => [],
      getConnectedZone: () => ({ x: 1, y: 2, w: 3, h: 4 }),
    };
    doProductionPlaceButton(state);
    expect(state.killme).toBe(false);
    expect(flags.placeCannon).toBe(false);

    state.buildingObject = {
      getRefId: () => 42,
      getBuiltCannonList: () => [7],
      getConnectedZone: () => null,
    };
    doProductionPlaceButton(state);
    expect(state.killme).toBe(false);
    expect(flags.placeCannon).toBe(false);
  });

  it("ports GWProduction DoPlaceButton as cannon placement flag emission", () => {
    const flags = {
      placeCannon: false,
      coid: 0,
      crefId: 0,
      cleft: 0,
      cright: 0,
      ctop: 0,
      cbottom: 0,
    };
    const state = {
      buildingObject: {
        getRefId: () => 42,
        getBuiltCannonList: () => [9, 10],
        getConnectedZone: () => ({ x: 3, y: 5, w: 7, h: 11 }),
      },
      killme: false,
      flags,
    };

    doProductionPlaceButton(state);

    expect(state.killme).toBe(true);
    expect(flags).toEqual({
      placeCannon: true,
      coid: 9,
      crefId: 42,
      cleft: 3,
      cright: 10,
      ctop: 5,
      cbottom: 16,
    });
  });

  it("ports production queue button vertical layout constants", () => {
    expect(PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS).toBe(13);
    expect(PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS).toBe(1);
  });
});
