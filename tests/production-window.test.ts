import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { RobotFactoryEntity } from "../src/simulation/entities/RobotFactoryEntity";
import { BuildingType } from "../src/simulation/SimulationConstants";
import { SimulationTime } from "../src/simulation/SimulationTime";
import { MapObjectType } from "../src/world/MapFormat";
import {
  appendProductionFullUnitSelectorButtonList,
  calculateProductionFullUnitSelectorXY,
  calculateProductionFullUnitSelectorWH,
  checkProductionQueueButtonList,
  clickProductionWindow,
  clickProductionFullUnitSelector,
  clickProductionUnitSelector,
  clearProductionFullUnitSelectorLists,
  clearProductionSelection,
  deleteProductionUnitSelectorDrawObject,
  doProductionCancelButton,
  doProductionCancelQueueItem,
  doProductionMinusButton,
  doProductionOkButton,
  doProductionPlaceButton,
  doProductionPlusButton,
  doProductionQueueButton,
  doProductionUnitSelectorDownButton,
  doProductionUnitSelectorUpButton,
  getProductionRefId,
  getProductionSelected,
  getProductionUnitSelectorCoords,
  getProductionUnitSelectorObjectRefId,
  getProductionUnitSelectorRefId,
  getProductionUnitSelectorSelectedId,
  initProductionWindow,
  initProductionUnitSelector,
  isProductionActive,
  loadProductionFullSelector,
  loadProductionFullUnitSelectorButtonList,
  loadProductionFullUnitSelectorLists,
  makeProductionQueueButtonList,
  processProductionSetExpanded,
  processProductionUnitSelector,
  renderProductionUnitSelector,
  renderProductionUnitSelectorPercentageBar,
  type ProductionBuildingReference,
  type ProductionBaseImageTarget,
  type ProductionObjectReference,
  type ProductionPlaceButtonState,
  type ProductionWindowClickState,
  type ProductionWindowInitState,
  type ProductionUnitSelectorRenderState,
  type ProductionUnitSelectorInitState,
  PRODUCTION_BASE_EXPANDED_IMAGE_PATH,
  PRODUCTION_BASE_IMAGE_PATH,
  PRODUCTION_BUILDING_LABEL_IMAGE_PATH,
  PRODUCTION_BUILDINGLESS_LABEL_IMAGE_PATH,
  PRODUCTION_COLLAPSED_HEIGHT_PIXELS,
  PRODUCTION_COLLAPSED_WIDTH_PIXELS,
  PRODUCTION_EXPANDED_HEIGHT_PIXELS,
  PRODUCTION_EXPANDED_WIDTH_PIXELS,
  PRODUCTION_FORT_FACTORY_LABEL_IMAGE_PATH,
  PRODUCTION_PAUSED_LABEL_IMAGE_PATH,
  PRODUCTION_PAUSEDLESS_LABEL_IMAGE_PATH,
  PRODUCTION_PLACE_LABEL_IMAGE_PATH,
  PRODUCTION_PLACELESS_LABEL_IMAGE_PATH,
  PRODUCTION_ROBOT_FACTORY_LABEL_IMAGE_PATH,
  PRODUCTION_SELECT_LABEL_IMAGE_PATH,
  PRODUCTION_SELECTLESS_LABEL_IMAGE_PATH,
  PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH,
  PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
  PRODUCTION_VEHICLE_FACTORY_LABEL_IMAGE_PATH,
  ProductionBuildingState,
  ProductionType,
  PRODUCTION_SELECTOR_CENTER_X_OFFSET_PIXELS,
  PRODUCTION_SELECTOR_CENTER_Y_OFFSET_PIXELS,
  PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS,
  PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
  PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
  PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS,
  recalcProductionShowTime,
  resetProductionShowTime,
  setProductionActive,
  setProductionBuildList,
  setProductionBuildingObject,
  setProductionBuildingState,
  setProductionBuildingType,
  setProductionCenterCoords,
  setProductionCoords,
  setProductionIsExpanded,
  setProductionIsOnlySelector,
  setProductionRefId,
  setProductionWindowCords,
  setProductionZTime,
  setProductionType,
  setProductionUnitSelectorActive,
  setProductionUnitSelectorBuildList,
  setProductionUnitSelectorCoords,
  setProductionUnitSelectorDrawObject,
  setProductionUnitSelectorRefId,
  setProductionUnitSelectorSelection,
  setProductionUnitSelectorZTime,
  shouldLoadProductionFullSelector,
  toggleProductionExpanded,
  unclickProductionFullUnitSelector,
  unclickProductionUnitSelector,
  withinProductionUnitSelectorPortrait,
  wheelDownProduction,
  wheelDownProductionUnitSelector,
  wheelUpProduction,
  wheelUpProductionUnitSelector,
  ZGW_PRODUCTION_HEADER_GUARD_PORTED,
} from "../src/ui/ProductionWindow";

describe("production window", () => {
  const imageTarget = (
    name: string,
    loaded: Array<[string, string]>,
  ): ProductionBaseImageTarget => ({
    loadBaseImage: (filename: string): void => {
      loaded.push([name, filename]);
    },
  });

  const productionClickState = (
    calls: unknown[],
    overrides: Partial<ProductionWindowClickState> = {},
  ): ProductionWindowClickState => ({
    x: 10,
    y: 20,
    width: 100,
    height: 80,
    isExpanded: true,
    fullSelector: {
      click: (x: number, y: number) => {
        calls.push(["full", x, y]);
        return false;
      },
    },
    okButton: {
      click: (x: number, y: number) => calls.push(["ok", x, y]),
    },
    cancelButton: {
      click: (x: number, y: number) => calls.push(["cancel", x, y]),
    },
    placeButton: {
      click: (x: number, y: number) => calls.push(["place", x, y]),
    },
    smallPlusButton: {
      click: (x: number, y: number) => calls.push(["plus", x, y]),
    },
    smallMinusButton: {
      click: (x: number, y: number) => calls.push(["minus", x, y]),
    },
    queueButton: {
      click: (x: number, y: number) => calls.push(["queue", x, y]),
    },
    queueButtonList: [
      {
        offsetX: 1,
        offsetY: 2,
        ot: 3,
        oid: 4,
        objectButton: {
          click: (x: number, y: number) =>
            calls.push(["queue-item", x, y]),
        },
      },
    ],
    unitSelector: {
      click: (x: number, y: number) => {
        calls.push(["unit-selector", x, y]);
        return false;
      },
    },
    queueSelector: {
      click: (x: number, y: number) => {
        calls.push(["queue-selector", x, y]);
        return false;
      },
    },
    ...overrides,
  });

  const productionUnitSelectorProcessState = (
    calls: unknown[],
    overrides: Record<string, unknown> = {},
  ) => ({
    ztime: { ztime: 12.5 },
    buildingObject: {
      getBuildState: () => ProductionBuildingState.Select,
      getBuiltCannonList: () => [],
      isDestroyed: () => false,
      percentageProduced: (currentTime: number) => {
        calls.push(["percentage", currentTime]);
        return 0.4;
      },
    },
    buildState: ProductionBuildingState.Building,
    isOnlySelector: false,
    percentageProduced: 0,
    upButton: {
      setActive: (active: boolean) => calls.push(["up", active]),
    },
    downButton: {
      setActive: (active: boolean) => calls.push(["down", active]),
    },
    setDrawObject: () => calls.push("set-draw-object"),
    drawObject: {
      process: () => calls.push("draw-process"),
    },
    ...overrides,
  });

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

  it("ports GWProduction Init as static image loading and selector init", () => {
    const loadedImages: Array<[string, string]> = [];
    const loadedSurfaces: string[] = [];
    const percentageBarSurfaces: Array<{ filename: string } | null> = [];
    const yellowPercentageBarSurfaces: Array<{ filename: string } | null> = [];
    const state: ProductionWindowInitState<{ filename: string }> = {
      baseImage: imageTarget("base", loadedImages),
      baseExpandedImage: imageTarget("base-expanded", loadedImages),
      nameLabels: {
        [ProductionType.Robot]: imageTarget("robot-label", loadedImages),
        [ProductionType.Vehicle]: imageTarget("vehicle-label", loadedImages),
        [ProductionType.Fort]: imageTarget("fort-label", loadedImages),
      },
      percentageBarImage: imageTarget("percentage-bar", loadedImages),
      yellowPercentageBarImage: imageTarget("yellow-percentage-bar", loadedImages),
      stateLabels: {
        [ProductionBuildingState.Place]: [
          imageTarget("place-label", loadedImages),
          imageTarget("placeless-label", loadedImages),
        ],
        [ProductionBuildingState.Select]: [
          imageTarget("select-label", loadedImages),
          imageTarget("selectless-label", loadedImages),
        ],
        [ProductionBuildingState.Building]: [
          imageTarget("building-label", loadedImages),
          imageTarget("buildingless-label", loadedImages),
        ],
        [ProductionBuildingState.Paused]: [
          imageTarget("paused-label", loadedImages),
          imageTarget("pausedless-label", loadedImages),
        ],
      },
      unitSelector: {
        percentageBarImage: { imageFilename: "" },
        yellowPercentageBarImage: { imageFilename: "" },
        finishedInit: false,
      },
      fullSelector: {
        finishedInit: false,
      },
      loadImage: (filename: string) => {
        loadedSurfaces.push(filename);
        return { filename };
      },
      loadUnitSelectorPercentageBarImage: (surface) => {
        percentageBarSurfaces.push(surface);
      },
      loadUnitSelectorYellowPercentageBarImage: (surface) => {
        yellowPercentageBarSurfaces.push(surface);
      },
    };

    initProductionWindow(state);

    expect(loadedImages).toEqual([
      ["base", PRODUCTION_BASE_IMAGE_PATH],
      ["base-expanded", PRODUCTION_BASE_EXPANDED_IMAGE_PATH],
      ["robot-label", PRODUCTION_ROBOT_FACTORY_LABEL_IMAGE_PATH],
      ["fort-label", PRODUCTION_FORT_FACTORY_LABEL_IMAGE_PATH],
      ["vehicle-label", PRODUCTION_VEHICLE_FACTORY_LABEL_IMAGE_PATH],
      ["percentage-bar", PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH],
      [
        "yellow-percentage-bar",
        PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
      ],
      ["place-label", PRODUCTION_PLACE_LABEL_IMAGE_PATH],
      ["placeless-label", PRODUCTION_PLACELESS_LABEL_IMAGE_PATH],
      ["select-label", PRODUCTION_SELECT_LABEL_IMAGE_PATH],
      ["selectless-label", PRODUCTION_SELECTLESS_LABEL_IMAGE_PATH],
      ["building-label", PRODUCTION_BUILDING_LABEL_IMAGE_PATH],
      ["buildingless-label", PRODUCTION_BUILDINGLESS_LABEL_IMAGE_PATH],
      ["paused-label", PRODUCTION_PAUSED_LABEL_IMAGE_PATH],
      ["pausedless-label", PRODUCTION_PAUSEDLESS_LABEL_IMAGE_PATH],
    ]);
    expect(loadedSurfaces).toEqual([
      PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH,
      PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
      "assets/other/production_gui/fus_top_left.png",
      "assets/other/production_gui/fus_top_right.png",
      "assets/other/production_gui/fus_bottom_left.png",
      "assets/other/production_gui/fus_bottom_right.png",
      "assets/other/production_gui/fus_top.png",
      "assets/other/production_gui/fus_bottom.png",
      "assets/other/production_gui/fus_left.png",
      "assets/other/production_gui/fus_right.png",
      "assets/other/production_gui/object_back.png",
    ]);
    expect(state.unitSelector.finishedInit).toBe(true);
    expect(state.unitSelector.percentageBarImage.imageFilename).toBe(
      PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH,
    );
    expect(state.unitSelector.yellowPercentageBarImage.imageFilename).toBe(
      PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH,
    );
    expect(percentageBarSurfaces).toEqual([
      { filename: PRODUCTION_UNIT_SELECTOR_PERCENTAGE_BAR_IMAGE_PATH },
    ]);
    expect(yellowPercentageBarSurfaces).toEqual([
      { filename: PRODUCTION_UNIT_SELECTOR_YELLOW_PERCENTAGE_BAR_IMAGE_PATH },
    ]);
    expect(state.fullSelector.finishedInit).toBe(true);
    expect(state.fullSelector.images?.objectBack).toEqual({
      filename: "assets/other/production_gui/object_back.png",
    });
  });

  it("ports GWProduction SetState as no-op when the resolved state is unchanged", () => {
    const calls: unknown[] = [];
    const state = {
      state: ProductionBuildingState.Select,
      buildingObject: null,
      okButton: { setActive: (active: boolean) => calls.push(["ok", active]) },
      cancelButton: {
        setActive: (active: boolean) => calls.push(["cancel", active]),
      },
      placeButton: {
        setActive: (active: boolean) => calls.push(["place", active]),
      },
    };

    setProductionBuildingState(state, ProductionBuildingState.Select);

    expect(state.state).toBe(ProductionBuildingState.Select);
    expect(calls).toEqual([]);
  });

  it("ports GWProduction SetState place button activation", () => {
    const calls: unknown[] = [];
    const state = {
      state: ProductionBuildingState.Select,
      buildingObject: null,
      okButton: { setActive: (active: boolean) => calls.push(["ok", active]) },
      cancelButton: {
        setActive: (active: boolean) => calls.push(["cancel", active]),
      },
      placeButton: {
        setActive: (active: boolean) => calls.push(["place", active]),
      },
    };

    setProductionBuildingState(state, ProductionBuildingState.Place);

    expect(state.state).toBe(ProductionBuildingState.Place);
    expect(calls).toEqual([
      ["ok", false],
      ["cancel", true],
      ["place", true],
    ]);
  });

  it("ports GWProduction SetState non-place button activation", () => {
    const calls: unknown[] = [];
    const state = {
      state: ProductionBuildingState.Place,
      buildingObject: null,
      okButton: { setActive: (active: boolean) => calls.push(["ok", active]) },
      cancelButton: {
        setActive: (active: boolean) => calls.push(["cancel", active]),
      },
      placeButton: {
        setActive: (active: boolean) => calls.push(["place", active]),
      },
    };

    setProductionBuildingState(state, ProductionBuildingState.Building);

    expect(state.state).toBe(ProductionBuildingState.Building);
    expect(calls).toEqual([
      ["ok", true],
      ["cancel", true],
      ["place", false],
    ]);
  });

  it("ports GWProduction SetState as cannon placement override", () => {
    const calls: unknown[] = [];
    const state = {
      state: ProductionBuildingState.Select,
      buildingObject: {
        getBuiltCannonList: () => [4],
        isDestroyed: () => false,
      },
      okButton: { setActive: (active: boolean) => calls.push(["ok", active]) },
      cancelButton: {
        setActive: (active: boolean) => calls.push(["cancel", active]),
      },
      placeButton: {
        setActive: (active: boolean) => calls.push(["place", active]),
      },
    };

    setProductionBuildingState(state, ProductionBuildingState.Building);

    expect(state.state).toBe(ProductionBuildingState.Place);
    expect(calls).toEqual([
      ["ok", false],
      ["cancel", true],
      ["place", true],
    ]);
  });

  it("ports GWProduction SetState as destroyed building pause override", () => {
    const calls: unknown[] = [];
    const state = {
      state: ProductionBuildingState.Select,
      buildingObject: {
        getBuiltCannonList: () => [4],
        isDestroyed: () => true,
      },
      okButton: { setActive: (active: boolean) => calls.push(["ok", active]) },
      cancelButton: {
        setActive: (active: boolean) => calls.push(["cancel", active]),
      },
      placeButton: {
        setActive: (active: boolean) => calls.push(["place", active]),
      },
    };

    setProductionBuildingState(state, ProductionBuildingState.Building);

    expect(state.state).toBe(ProductionBuildingState.Paused);
    expect(calls).toEqual([
      ["ok", true],
      ["cancel", true],
      ["place", false],
    ]);
  });

  it("ports GWProduction ProcessSetExpanded as expanded queue controls", () => {
    const calls: Array<[string, boolean]> = [];
    const state = {
      isExpanded: true,
      width: 0,
      height: 0,
      smallPlusButton: {
        setActive: (active: boolean) => calls.push(["plus", active]),
      },
      smallMinusButton: {
        setActive: (active: boolean) => calls.push(["minus", active]),
      },
      queueButton: {
        setActive: (active: boolean) => calls.push(["queue", active]),
      },
      queueSelector: {
        setActive: (active: boolean) => calls.push(["selector", active]),
      },
    };

    processProductionSetExpanded(state);

    expect(state.width).toBe(PRODUCTION_EXPANDED_WIDTH_PIXELS);
    expect(state.height).toBe(PRODUCTION_EXPANDED_HEIGHT_PIXELS);
    expect(calls).toEqual([
      ["plus", false],
      ["minus", true],
      ["queue", true],
      ["selector", true],
    ]);
  });

  it("ports GWProduction ProcessSetExpanded as collapsed queue controls", () => {
    const calls: Array<[string, boolean]> = [];
    const state = {
      isExpanded: false,
      width: 0,
      height: 0,
      smallPlusButton: {
        setActive: (active: boolean) => calls.push(["plus", active]),
      },
      smallMinusButton: {
        setActive: (active: boolean) => calls.push(["minus", active]),
      },
      queueButton: {
        setActive: (active: boolean) => calls.push(["queue", active]),
      },
      queueSelector: {
        setActive: (active: boolean) => calls.push(["selector", active]),
      },
    };

    processProductionSetExpanded(state);

    expect(state.width).toBe(PRODUCTION_COLLAPSED_WIDTH_PIXELS);
    expect(state.height).toBe(PRODUCTION_COLLAPSED_HEIGHT_PIXELS);
    expect(calls).toEqual([
      ["plus", true],
      ["minus", false],
      ["queue", false],
      ["selector", false],
    ]);
  });

  it("ports SetIsExpanded as state assignment followed by layout refresh", () => {
    const calls: Array<[string, boolean]> = [];
    const state = {
      isExpanded: false,
      width: 0,
      height: 0,
      smallPlusButton: {
        setActive: (active: boolean) => calls.push(["plus", active]),
      },
      smallMinusButton: {
        setActive: (active: boolean) => calls.push(["minus", active]),
      },
      queueButton: {
        setActive: (active: boolean) => calls.push(["queue", active]),
      },
      queueSelector: {
        setActive: (active: boolean) => calls.push(["selector", active]),
      },
    };

    setProductionIsExpanded(state, true);

    expect(state.isExpanded).toBe(true);
    expect(state.width).toBe(PRODUCTION_EXPANDED_WIDTH_PIXELS);
    expect(state.height).toBe(PRODUCTION_EXPANDED_HEIGHT_PIXELS);
    expect(calls).toEqual([
      ["plus", false],
      ["minus", true],
      ["queue", true],
      ["selector", true],
    ]);
  });

  it("ports DoMinusButton as collapsed production layout action", () => {
    const calls: Array<[string, boolean]> = [];
    const state = {
      isExpanded: true,
      width: PRODUCTION_EXPANDED_WIDTH_PIXELS,
      height: PRODUCTION_EXPANDED_HEIGHT_PIXELS,
      smallPlusButton: {
        setActive: (active: boolean) => calls.push(["plus", active]),
      },
      smallMinusButton: {
        setActive: (active: boolean) => calls.push(["minus", active]),
      },
      queueButton: {
        setActive: (active: boolean) => calls.push(["queue", active]),
      },
      queueSelector: {
        setActive: (active: boolean) => calls.push(["selector", active]),
      },
    };

    doProductionMinusButton(state);

    expect(state.isExpanded).toBe(false);
    expect(state.width).toBe(PRODUCTION_COLLAPSED_WIDTH_PIXELS);
    expect(state.height).toBe(PRODUCTION_COLLAPSED_HEIGHT_PIXELS);
    expect(calls).toEqual([
      ["plus", true],
      ["minus", false],
      ["queue", false],
      ["selector", false],
    ]);
  });

  it("ports DoPlusButton as expanded production layout action", () => {
    const calls: Array<[string, boolean]> = [];
    const state = {
      isExpanded: false,
      width: PRODUCTION_COLLAPSED_WIDTH_PIXELS,
      height: PRODUCTION_COLLAPSED_HEIGHT_PIXELS,
      smallPlusButton: {
        setActive: (active: boolean) => calls.push(["plus", active]),
      },
      smallMinusButton: {
        setActive: (active: boolean) => calls.push(["minus", active]),
      },
      queueButton: {
        setActive: (active: boolean) => calls.push(["queue", active]),
      },
      queueSelector: {
        setActive: (active: boolean) => calls.push(["selector", active]),
      },
    };

    doProductionPlusButton(state);

    expect(state.isExpanded).toBe(true);
    expect(state.width).toBe(PRODUCTION_EXPANDED_WIDTH_PIXELS);
    expect(state.height).toBe(PRODUCTION_EXPANDED_HEIGHT_PIXELS);
    expect(calls).toEqual([
      ["plus", false],
      ["minus", true],
      ["queue", true],
      ["selector", true],
    ]);
  });

  it("ports ToggleExpanded as expansion inversion and layout refresh", () => {
    const calls: Array<[string, boolean]> = [];
    const state = {
      isExpanded: false,
      width: 0,
      height: 0,
      smallPlusButton: {
        setActive: (active: boolean) => calls.push(["plus", active]),
      },
      smallMinusButton: {
        setActive: (active: boolean) => calls.push(["minus", active]),
      },
      queueButton: {
        setActive: (active: boolean) => calls.push(["queue", active]),
      },
      queueSelector: {
        setActive: (active: boolean) => calls.push(["selector", active]),
      },
    };

    toggleProductionExpanded(state);
    expect(state.isExpanded).toBe(true);
    expect(state.width).toBe(PRODUCTION_EXPANDED_WIDTH_PIXELS);
    expect(state.height).toBe(PRODUCTION_EXPANDED_HEIGHT_PIXELS);

    toggleProductionExpanded(state);
    expect(state.isExpanded).toBe(false);
    expect(state.width).toBe(PRODUCTION_COLLAPSED_WIDTH_PIXELS);
    expect(state.height).toBe(PRODUCTION_COLLAPSED_HEIGHT_PIXELS);
    expect(calls).toEqual([
      ["plus", false],
      ["minus", true],
      ["queue", true],
      ["selector", true],
      ["plus", true],
      ["minus", false],
      ["queue", false],
      ["selector", false],
    ]);
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

  it("ports GWProduction SetCords as unexpanded initial placement", () => {
    const centers: Array<[number, number]> = [];
    const state = {
      x: 0,
      y: 0,
      zmap: null,
      fullSelector: {
        setCenterCoords: (centerX: number, centerY: number) => {
          centers.push([centerX, centerY]);
        },
      },
    };

    setProductionWindowCords(state, 200, 140);

    expect(state.x).toBe(144);
    expect(state.y).toBe(100);
    expect(centers).toEqual([[200, 140]]);
  });

  it("ports GWProduction SetCords lower map-edge padding clamp", () => {
    const centers: Array<[number, number]> = [];
    const state = {
      x: 0,
      y: 0,
      zmap: null,
      fullSelector: {
        setCenterCoords: (centerX: number, centerY: number) => {
          centers.push([centerX, centerY]);
        },
      },
    };

    setProductionWindowCords(state, 20, 20);

    expect(state.x).toBe(16);
    expect(state.y).toBe(16);
    expect(centers).toEqual([[20, 20]]);
  });

  it("ports GWProduction SetCords expanded map-boundary clamp", () => {
    const centers: Array<[number, number]> = [];
    const state = {
      x: 0,
      y: 0,
      zmap: {
        getMapBasics: () => ({ width: 20, height: 15 }),
      },
      fullSelector: {
        setCenterCoords: (centerX: number, centerY: number) => {
          centers.push([centerX, centerY]);
        },
      },
    };

    setProductionWindowCords(state, 300, 230);

    expect(state.x).toBe(76);
    expect(state.y).toBe(128);
    expect(centers).toEqual([[300, 230]]);
  });

  it("ports GWPFullUnitSelector SetZTime as simulation clock reference assignment", () => {
    const ztime = new SimulationTime();
    const state = { ztime: null };

    setProductionZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });

  it("ports GWProduction ResetShowTime as countdown text refresh", () => {
    const state = { showTime: 0, showTimeText: "" };

    resetProductionShowTime(state, 125);

    expect(state).toEqual({ showTime: 125, showTimeText: "2:05" });
  });

  it("ports GWProduction ResetShowTime minute wrapping", () => {
    const state = { showTime: 0, showTimeText: "" };

    resetProductionShowTime(state, 3_661);

    expect(state).toEqual({ showTime: 3_661, showTimeText: "1:01" });
  });

  it("ports GWProduction RecalcShowTime select state as selected unit build time", () => {
    const calls: unknown[] = [];
    const state = {
      state: ProductionBuildingState.Select,
      showTime: 0,
      showTimeText: "",
      ztime: { ztime: 12.5 },
      unitSelector: {
        getSelectedId: () => ({ selected: true, objectType: 3, objectId: 7 }),
      },
      buildingObject: {
        buildTimeModified(buildTime: number) {
          calls.push(["modified", buildTime]);
          return buildTime * 2 + 0.9;
        },
        productionTimeLeft(currentTime: number) {
          calls.push(["left", currentTime]);
          return 99;
        },
      },
      buildList: {
        unitBuildTime(objectType: number, objectId: number) {
          calls.push(["unit", objectType, objectId]);
          return 14;
        },
      },
    };

    recalcProductionShowTime(state);

    expect(state.showTime).toBe(28);
    expect(state.showTimeText).toBe("0:28");
    expect(calls).toEqual([
      ["unit", 3, 7],
      ["modified", 14],
    ]);
  });

  it("ports GWProduction RecalcShowTime select guards and unchanged value", () => {
    const noBuilding = {
      state: ProductionBuildingState.Select,
      showTime: 9,
      showTimeText: "0:09",
      ztime: { ztime: 12.5 },
      unitSelector: {
        getSelectedId: () => ({ selected: true, objectType: 3, objectId: 7 }),
      },
      buildingObject: null,
      buildList: { unitBuildTime: () => 14 },
    };
    const noBuildList = {
      ...noBuilding,
      buildingObject: {
        buildTimeModified: (buildTime: number) => buildTime,
        productionTimeLeft: () => 0,
      },
      buildList: null,
    };
    const unchanged = {
      ...noBuilding,
      showTime: -1,
      showTimeText: "old",
      buildingObject: {
        buildTimeModified: (buildTime: number) => buildTime,
        productionTimeLeft: () => 0,
      },
      buildList: { unitBuildTime: () => 14 },
      unitSelector: {
        getSelectedId: () => ({ selected: false, objectType: 3, objectId: 7 }),
      },
    };

    recalcProductionShowTime(noBuilding);
    recalcProductionShowTime(noBuildList);
    recalcProductionShowTime(unchanged);

    expect(noBuilding.showTimeText).toBe("0:09");
    expect(noBuildList.showTimeText).toBe("0:09");
    expect(unchanged.showTimeText).toBe("old");
  });

  it("ports GWProduction RecalcShowTime active production as remaining time", () => {
    const calls: unknown[] = [];
    const state = {
      state: ProductionBuildingState.Building,
      showTime: 7,
      showTimeText: "0:07",
      ztime: { ztime: 12.5 },
      unitSelector: {
        getSelectedId: () => ({ selected: false, objectType: 0, objectId: 0 }),
      },
      buildingObject: {
        buildTimeModified(buildTime: number) {
          calls.push(["modified", buildTime]);
          return buildTime;
        },
        productionTimeLeft(currentTime: number) {
          calls.push(["left", currentTime]);
          return 65.8;
        },
      },
      buildList: null,
    };

    recalcProductionShowTime(state);

    expect(state.showTime).toBe(65);
    expect(state.showTimeText).toBe("1:05");
    expect(calls).toEqual([["left", 12.5]]);
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
    const state: ProductionUnitSelectorInitState = {
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

  it("ports GWPUnitSelector Process as no-op without simulation time", () => {
    const calls: unknown[] = [];
    const state = productionUnitSelectorProcessState(calls, {
      ztime: null,
    });

    processProductionUnitSelector(state);

    expect(calls).toEqual([]);
    expect(state.buildState).toBe(ProductionBuildingState.Building);
  });

  it("ports GWPUnitSelector Process select state as button selector mode", () => {
    const calls: unknown[] = [];
    const state = productionUnitSelectorProcessState(calls);

    processProductionUnitSelector(state);

    expect(state.buildState).toBe(ProductionBuildingState.Select);
    expect(state.percentageProduced).toBe(0);
    expect(calls).toEqual([
      ["up", true],
      ["down", true],
      "set-draw-object",
      "draw-process",
    ]);
  });

  it("ports GWPUnitSelector Process active production as percentage mode", () => {
    const calls: unknown[] = [];
    const state = productionUnitSelectorProcessState(calls, {
      buildingObject: {
        getBuildState: () => ProductionBuildingState.Building,
        getBuiltCannonList: () => [],
        isDestroyed: () => false,
        percentageProduced: (currentTime: number) => {
          calls.push(["percentage", currentTime]);
          return 0.65;
        },
      },
    });

    processProductionUnitSelector(state);

    expect(state.buildState).toBe(ProductionBuildingState.Building);
    expect(state.percentageProduced).toBe(0.65);
    expect(calls).toEqual([
      ["percentage", 12.5],
      ["up", false],
      ["down", false],
      "set-draw-object",
      "draw-process",
    ]);
  });

  it("ports GWPUnitSelector Process as only-selector button mode", () => {
    const calls: unknown[] = [];
    const state = productionUnitSelectorProcessState(calls, {
      isOnlySelector: true,
      buildingObject: {
        getBuildState: () => ProductionBuildingState.Building,
        getBuiltCannonList: () => [],
        isDestroyed: () => false,
        percentageProduced: () => 0.25,
      },
    });

    processProductionUnitSelector(state);

    expect(state.buildState).toBe(ProductionBuildingState.Building);
    expect(state.percentageProduced).toBe(0.25);
    expect(calls).toEqual([
      ["up", true],
      ["down", true],
      "set-draw-object",
      "draw-process",
    ]);
  });

  it("ports GWPUnitSelector Process building overrides and missing draw object", () => {
    const calls: unknown[] = [];
    const state = productionUnitSelectorProcessState(calls, {
      buildingObject: {
        getBuildState: () => ProductionBuildingState.Building,
        getBuiltCannonList: () => [9],
        isDestroyed: () => true,
        percentageProduced: (currentTime: number) => {
          calls.push(["percentage", currentTime]);
          return 0.1;
        },
      },
      drawObject: null,
    });

    processProductionUnitSelector(state);

    expect(state.buildState).toBe(ProductionBuildingState.Paused);
    expect(state.percentageProduced).toBe(0.1);
    expect(calls).toEqual([
      ["percentage", 12.5],
      ["up", false],
      ["down", false],
      "set-draw-object",
    ]);
  });

  it("replaces GWPUnitSelector DrawPercentageBar with background and clipped yellow commands", () => {
    const percentageBarImage = { id: "percentage-bar" };
    const yellowSurface = { width: 8, height: 20 };
    const yellowPercentageBarImage = {
      id: "yellow-percentage-bar",
      getBaseSurface: () => yellowSurface,
    };
    const calls: unknown[] = [];

    const command = renderProductionUnitSelectorPercentageBar(
      {
        buildingObject: { id: "building" },
        buildState: ProductionBuildingState.Building,
        isOnlySelector: false,
        percentageProduced: 0.35,
        percentageBarImage,
        yellowPercentageBarImage,
      },
      {
        renderZSurface: (surface, x, y) => {
          calls.push(["background", surface, x, y]);
          return { surface, x: x - 100, y: y - 50 };
        },
        getBlitInfo: (surface, x, y) => {
          calls.push(["yellow", surface, x, y]);
          return {
            sourceX: 0,
            sourceY: 3,
            width: 8,
            height: 18,
            destinationX: 40,
            destinationY: 60,
          };
        },
      },
      12,
      30,
    );

    expect(command).toEqual({
      background: {
        surface: percentageBarImage,
        x: -38,
        y: -18,
      },
      yellow: {
        yellowPercentageBarImage,
        region: {
          sourceX: 0,
          sourceY: 3,
          width: 8,
          height: 13,
          destinationX: 40,
          destinationY: 60,
        },
      },
    });
    expect(calls).toEqual([
      ["background", percentageBarImage, 62, 32],
      ["yellow", yellowSurface, 62, 32],
    ]);
  });

  it("replaces GWPUnitSelector DrawPercentageBar as no command for selector modes", () => {
    const baseState = {
      buildingObject: { id: "building" },
      buildState: ProductionBuildingState.Building,
      isOnlySelector: false,
      percentageProduced: 0,
      percentageBarImage: {},
      yellowPercentageBarImage: {
        getBaseSurface: () => ({ width: 1, height: 1 }),
      },
    };
    const map = {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
      getBlitInfo: () => {
        throw new Error("getBlitInfo should not be called");
      },
    };

    expect(
      renderProductionUnitSelectorPercentageBar(
        { ...baseState, buildingObject: null },
        map,
        0,
        0,
      ),
    ).toBeNull();
    expect(
      renderProductionUnitSelectorPercentageBar(
        { ...baseState, buildState: ProductionBuildingState.Select },
        map,
        0,
        0,
      ),
    ).toBeNull();
    expect(
      renderProductionUnitSelectorPercentageBar(
        { ...baseState, isOnlySelector: true },
        map,
        0,
        0,
      ),
    ).toBeNull();
  });

  it("replaces GWPUnitSelector DrawPercentageBar with no yellow command without a visible overlay", () => {
    const percentageBarImage = { id: "percentage-bar" };
    const yellowPercentageBarImage = {
      getBaseSurface: () => null,
    };

    const command = renderProductionUnitSelectorPercentageBar(
      {
        buildingObject: { id: "building" },
        buildState: ProductionBuildingState.Building,
        isOnlySelector: false,
        percentageProduced: 0,
        percentageBarImage,
        yellowPercentageBarImage,
      },
      {
        renderZSurface: (surface, x, y) => ({ surface, x, y }),
        getBlitInfo: () => {
          throw new Error("getBlitInfo should not be called without a surface");
        },
      },
      0,
      0,
    );

    expect(command).toEqual({
      background: {
        surface: percentageBarImage,
        x: 50,
        y: 2,
      },
      yellow: null,
    });
  });

  it("replaces GWPUnitSelector DoRender guard exits", () => {
    const state = createUnitSelectorRenderState({ finishedInit: false });
    const inactive = createUnitSelectorRenderState({ isActive: false });

    expect(renderProductionUnitSelector(state, createUnitSelectorRenderMap(), 0, 0)).toEqual([]);
    expect(
      renderProductionUnitSelector(inactive, createUnitSelectorRenderMap(), 0, 0),
    ).toEqual([]);
  });

  it("replaces GWPUnitSelector DoRender as ordered selector commands", () => {
    const calls: unknown[] = [];
    const drawObjectSetCoords: Array<[number, number]> = [];
    const state = createUnitSelectorRenderState({
      x: 10,
      y: 20,
      drawObject: {
        getDimensionsPixel: () => ({ width: 12, height: 10 }),
        setCoords: (x, y) => drawObjectSetCoords.push([x, y]),
        render: () => "draw-object",
        getHoverNameImage: () => ({
          surface: { id: "hover-name" },
          baseSurface: { width: 30, height: 8 },
        }),
      },
    });

    const commands = renderProductionUnitSelector(
      state,
      createUnitSelectorRenderMap(calls),
      100,
      50,
    );

    expect(drawObjectSetCoords).toEqual([[128, 75]]);
    expect(calls).toEqual([
      ["up", 110, 70],
      ["down", 110, 70],
      ["bar", "percentage-bar", 160, 72],
      ["yellow", "yellow-surface", 160, 72],
      ["hover", "hover-name", 120, 112],
    ]);
    expect(commands).toEqual([
      { kind: "button", command: "up-button" },
      { kind: "button", command: "down-button" },
      {
        kind: "percentageBar",
        command: {
          background: "percentage-bar-command",
          yellow: {
            yellowPercentageBarImage: state.yellowPercentageBarImage,
            region: {
              sourceX: 0,
              sourceY: 0,
              width: 8,
              height: 12,
              destinationX: 160,
              destinationY: 72,
            },
          },
        },
      },
      { kind: "object", command: "draw-object" },
      { kind: "hoverName", command: "hover-name-command" },
    ]);
  });

  it("replaces GWPUnitSelector DoRender without draw object hover image", () => {
    const state = createUnitSelectorRenderState({
      drawObject: {
        getDimensionsPixel: () => ({ width: 12, height: 10 }),
        setCoords: () => undefined,
        render: () => null,
        getHoverNameImage: () => ({
          surface: { id: "hover-name" },
          baseSurface: null,
        }),
      },
    });

    expect(renderProductionUnitSelector(state, createUnitSelectorRenderMap(), 0, 0)).toEqual([
      { kind: "button", command: "up-button" },
      { kind: "button", command: "down-button" },
      {
        kind: "percentageBar",
        command: {
          background: "percentage-bar-command",
          yellow: {
            yellowPercentageBarImage: state.yellowPercentageBarImage,
            region: {
              sourceX: 0,
              sourceY: 0,
              width: 8,
              height: 12,
              destinationX: 60,
              destinationY: 22,
            },
          },
        },
      },
    ]);
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

  it("ports GWPFullUnitSelector LoadLists guard exits", () => {
    const calls: unknown[] = [];
    const baseState = {
      robotList: [],
      vehicleList: [],
      cannonList: [],
      listsBuildingType: -1,
      listsBuildingLevel: -1,
      buttonList: [],
      buildingType: BuildingType.RobotFactory,
      width: 0,
      height: 0,
      loadUnitToLists: (objectType: number, objectId: number) =>
        calls.push([objectType, objectId]),
    };
    const noBuildList = {
      ...baseState,
      buildingObject: { getLevel: () => 2 },
      buildList: null,
    };
    const noBuilding = {
      ...baseState,
      buildingObject: null,
      buildList: { getBuildList: () => [{ ot: 1, oid: 2 }] },
    };

    loadProductionFullUnitSelectorLists(noBuildList);
    loadProductionFullUnitSelectorLists(noBuilding);

    expect(calls).toEqual([]);
    expect(noBuildList.listsBuildingType).toBe(-1);
    expect(noBuilding.listsBuildingLevel).toBe(-1);
  });

  it("ports GWPFullUnitSelector LoadLists cache hit as no-op", () => {
    const calls: unknown[] = [];
    const state = {
      robotList: [{ getObjectId: () => ({ objectType: 1, objectId: 2 }) }],
      vehicleList: [],
      cannonList: [],
      listsBuildingType: BuildingType.RobotFactory,
      listsBuildingLevel: 2,
      buttonList: [],
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList: () => {
          calls.push("get-build-list");
          return [{ ot: 1, oid: 2 }];
        },
      },
      buildingType: BuildingType.RobotFactory,
      width: 0,
      height: 0,
      loadUnitToLists: (objectType: number, objectId: number) =>
        calls.push([objectType, objectId]),
    };

    loadProductionFullUnitSelectorLists(state);

    expect(calls).toEqual([]);
    expect(state.robotList).toHaveLength(1);
  });

  it("ports GWPFullUnitSelector LoadLists empty build-list as cleared cache", () => {
    const state = {
      robotList: [{ getObjectId: () => ({ objectType: 1, objectId: 2 }) }],
      vehicleList: [{ getObjectId: () => ({ objectType: 4, objectId: 3 }) }],
      cannonList: [],
      listsBuildingType: BuildingType.RobotFactory,
      listsBuildingLevel: 1,
      buttonList: [{ objectType: 1, objectId: 2, offsetX: 6, offsetY: 22 }],
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList: () => [],
      },
      buildingType: BuildingType.VehicleFactory,
      loadUnitToLists: () => undefined,
      width: 999,
      height: 999,
    };

    loadProductionFullUnitSelectorLists(state);

    expect(state.robotList).toEqual([]);
    expect(state.vehicleList).toEqual([]);
    expect(state.buttonList).toEqual([]);
    expect(state.listsBuildingType).toBe(-1);
    expect(state.listsBuildingLevel).toBe(-1);
    expect(state.width).toBe(999);
    expect(state.height).toBe(999);
  });

  it("ports GWPFullUnitSelector LoadLists as cache refresh and layout rebuild", () => {
    const calls: unknown[] = [];
    const state = {
      robotList: [] as Array<{ getObjectId(): { objectType: number; objectId: number } }>,
      vehicleList: [] as Array<{ getObjectId(): { objectType: number; objectId: number } }>,
      cannonList: [] as Array<{ getObjectId(): { objectType: number; objectId: number } }>,
      listsBuildingType: -1,
      listsBuildingLevel: -1,
      buttonList: [] as Array<{
        objectType: number;
        objectId: number;
        offsetX: number;
        offsetY: number;
      }>,
      buildingObject: { getLevel: () => 3 },
      buildList: {
        getBuildList(buildingType: number, buildingLevel: number) {
          calls.push(["get-build-list", buildingType, buildingLevel]);
          return [
            { ot: MapObjectType.Robot, oid: 2 },
            { ot: MapObjectType.Vehicle, oid: 4 },
            { ot: MapObjectType.Cannon, oid: 6 },
          ];
        },
      },
      buildingType: BuildingType.FortFront,
      loadUnitToLists(objectType: number, objectId: number) {
        calls.push(["load-unit", objectType, objectId]);
        const object = { getObjectId: () => ({ objectType, objectId }) };
        if (objectType === MapObjectType.Robot) state.robotList.push(object);
        if (objectType === MapObjectType.Vehicle) state.vehicleList.push(object);
        if (objectType === MapObjectType.Cannon) state.cannonList.push(object);
      },
      width: 0,
      height: 0,
    };

    loadProductionFullUnitSelectorLists(state);

    expect(calls).toEqual([
      ["get-build-list", BuildingType.FortFront, 3],
      ["load-unit", MapObjectType.Robot, 2],
      ["load-unit", MapObjectType.Vehicle, 4],
      ["load-unit", MapObjectType.Cannon, 6],
    ]);
    expect(state.listsBuildingType).toBe(BuildingType.FortFront);
    expect(state.listsBuildingLevel).toBe(3);
    expect(state.buttonList).toEqual([
      { objectType: MapObjectType.Robot, objectId: 2, offsetX: 6, offsetY: 22 },
      { objectType: MapObjectType.Vehicle, objectId: 4, offsetX: 6, offsetY: 75 },
      { objectType: MapObjectType.Cannon, objectId: 6, offsetX: 6, offsetY: 128 },
    ]);
    expect({ width: state.width, height: state.height }).toEqual({
      width: 104,
      height: 185,
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

  it("ports GWPFullUnitSelector AppendButtonList as button creation with horizontal offsets", () => {
    const state = {
      buttonList: [
        {
          objectType: 9,
          objectId: 9,
          offsetX: 1,
          offsetY: 2,
        },
      ],
    };
    const objectList = [
      { getObjectId: () => ({ objectType: 1, objectId: 4 }) },
      { getObjectId: () => ({ objectType: 2, objectId: 7 }) },
    ];

    appendProductionFullUnitSelectorButtonList(state, 6, 22, objectList);

    expect(state.buttonList).toEqual([
      {
        objectType: 9,
        objectId: 9,
        offsetX: 1,
        offsetY: 2,
      },
      {
        objectType: 1,
        objectId: 4,
        offsetX: 6,
        offsetY: 22,
      },
      {
        objectType: 2,
        objectId: 7,
        offsetX: 53,
        offsetY: 22,
      },
    ]);
  });

  it("ports GWPFullUnitSelector LoadButtonList as rebuilding buttons by populated rows", () => {
    const state = {
      robotList: [
        { getObjectId: () => ({ objectType: 1, objectId: 4 }) },
        { getObjectId: () => ({ objectType: 1, objectId: 5 }) },
      ],
      vehicleList: [],
      cannonList: [{ getObjectId: () => ({ objectType: 3, objectId: 8 }) }],
      listsBuildingType: 0,
      listsBuildingLevel: 0,
      buttonList: [
        {
          objectType: 9,
          objectId: 9,
          offsetX: 0,
          offsetY: 0,
        },
      ],
    };

    loadProductionFullUnitSelectorButtonList(state);

    expect(state.buttonList).toEqual([
      {
        objectType: 1,
        objectId: 4,
        offsetX: 6,
        offsetY: 22,
      },
      {
        objectType: 1,
        objectId: 5,
        offsetX: 53,
        offsetY: 22,
      },
      {
        objectType: 3,
        objectId: 8,
        offsetX: 6,
        offsetY: 75,
      },
    ]);
  });

  it("ports GWPUnitSelector GetCoords as a unit selector coordinate snapshot", () => {
    const state = { x: 30, y: 40 };

    const coords = getProductionUnitSelectorCoords(state);
    state.x = 0;

    expect(coords).toEqual({ x: 30, y: 40 });
  });

  it("ports GWPFullUnitSelector Click inactive selector as no-op", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: false,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      buttonList: [
        { objectButton: { click: () => calls.push("button") } },
      ],
    };

    expect(clickProductionFullUnitSelector(state, 35, 45)).toBe(false);
    expect(calls).toEqual([]);
  });

  it("ports GWPFullUnitSelector Click as local button routing and bounds hit testing", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: true,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      buttonList: [
        {
          objectButton: {
            click: (x: number, y: number) => calls.push(["first", x, y]),
          },
        },
        {
          objectButton: {
            click: (x: number, y: number) => calls.push(["second", x, y]),
          },
        },
      ],
    };

    expect(clickProductionFullUnitSelector(state, 35, 45)).toBe(true);
    expect(clickProductionFullUnitSelector(state, 29, 45)).toBe(false);
    expect(clickProductionFullUnitSelector(state, 35, 39)).toBe(false);
    expect(clickProductionFullUnitSelector(state, 80, 45)).toBe(false);
    expect(clickProductionFullUnitSelector(state, 35, 100)).toBe(false);
    expect(calls).toEqual([
      ["first", 5, 5],
      ["second", 5, 5],
      ["first", -1, 5],
      ["second", -1, 5],
      ["first", 5, -1],
      ["second", 5, -1],
      ["first", 50, 5],
      ["second", 50, 5],
      ["first", 5, 60],
      ["second", 5, 60],
    ]);
  });

  it("ports GWPFullUnitSelector UnClick inactive selector as no-op", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: false,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      buttonList: [
        {
          objectType: 1,
          objectId: 2,
          objectButton: { unclick: () => calls.push("button") === undefined },
        },
      ],
      objectSelected: false,
      selectedObjectType: 0,
      selectedObjectId: 0,
    };

    expect(unclickProductionFullUnitSelector(state, 35, 45)).toBe(false);
    expect(calls).toEqual([]);
    expect(state.objectSelected).toBe(false);
  });

  it("ports GWPFullUnitSelector UnClick as selection caching and bounds hit testing", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: true,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      buttonList: [
        {
          objectType: 1,
          objectId: 2,
          objectButton: {
            unclick: (x: number, y: number) => {
              calls.push(["first", x, y]);
              return false;
            },
          },
        },
        {
          objectType: 3,
          objectId: 4,
          objectButton: {
            unclick: (x: number, y: number) => {
              calls.push(["second", x, y]);
              return x === 5 && y === 5;
            },
          },
        },
      ],
      objectSelected: false,
      selectedObjectType: 0,
      selectedObjectId: 0,
    };

    expect(unclickProductionFullUnitSelector(state, 35, 45)).toBe(true);
    expect(state.objectSelected).toBe(true);
    expect(state.selectedObjectType).toBe(3);
    expect(state.selectedObjectId).toBe(4);

    expect(unclickProductionFullUnitSelector(state, 29, 45)).toBe(false);
    expect(unclickProductionFullUnitSelector(state, 35, 39)).toBe(false);
    expect(unclickProductionFullUnitSelector(state, 80, 45)).toBe(false);
    expect(unclickProductionFullUnitSelector(state, 35, 100)).toBe(false);
    expect(calls).toEqual([
      ["first", 5, 5],
      ["second", 5, 5],
      ["first", -1, 5],
      ["second", -1, 5],
      ["first", 5, -1],
      ["second", 5, -1],
      ["first", 50, 5],
      ["second", 50, 5],
      ["first", 5, 60],
      ["second", 5, 60],
    ]);
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

  it("ports GWPUnitSelector UnClick inactive selector as load reset only", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: false,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      upButton: { unclick: () => false },
      downButton: { unclick: () => false },
      isOnlySelector: true,
      buildState: ProductionBuildingState.Select,
      loadFullSelector: true,
      doUpButton: () => calls.push("up"),
      doDownButton: () => calls.push("down"),
    };

    expect(unclickProductionUnitSelector(state, 35, 45)).toBe(false);
    expect(state.loadFullSelector).toBe(false);
    expect(calls).toEqual([]);
  });

  it("ports GWPUnitSelector UnClick as button release routing and bounds hit testing", () => {
    const calls: unknown[] = [];
    const state = {
      isActive: true,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      upButton: {
        unclick: (x: number, y: number) => {
          calls.push(["up-button", x, y]);
          return true;
        },
      },
      downButton: {
        unclick: (x: number, y: number) => {
          calls.push(["down-button", x, y]);
          return false;
        },
      },
      isOnlySelector: false,
      buildState: ProductionBuildingState.Building,
      loadFullSelector: true,
      doUpButton: () => calls.push("up-action"),
      doDownButton: () => calls.push("down-action"),
    };

    expect(unclickProductionUnitSelector(state, 35, 45)).toBe(true);
    expect(state.loadFullSelector).toBe(false);
    expect(calls).toEqual([
      ["up-button", 5, 5],
      "up-action",
      ["down-button", 5, 5],
    ]);
    expect(unclickProductionUnitSelector(state, 29, 45)).toBe(false);
    expect(unclickProductionUnitSelector(state, 35, 39)).toBe(false);
    expect(unclickProductionUnitSelector(state, 80, 45)).toBe(false);
    expect(unclickProductionUnitSelector(state, 35, 100)).toBe(false);
  });

  it("ports GWPUnitSelector UnClick as portrait-triggered full selector load", () => {
    const state = {
      isActive: true,
      x: 30,
      y: 40,
      width: 50,
      height: 60,
      upButton: { unclick: () => false },
      downButton: { unclick: () => false },
      isOnlySelector: true,
      buildState: ProductionBuildingState.Building,
      loadFullSelector: false,
      doUpButton: () => undefined,
      doDownButton: () => undefined,
    };

    expect(unclickProductionUnitSelector(state, 32, 42)).toBe(true);
    expect(state.loadFullSelector).toBe(true);

    state.isOnlySelector = false;
    state.buildState = ProductionBuildingState.Select;
    expect(unclickProductionUnitSelector(state, 77, 92)).toBe(true);
    expect(state.loadFullSelector).toBe(false);
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

  it("ports GWPUnitSelector WheelUpButton inactive up button as no-op", () => {
    const calls: string[] = [];

    const handled = wheelUpProductionUnitSelector({
      upButton: { isActive: () => false },
      doUpButton: () => calls.push("up"),
    });

    expect(handled).toBe(false);
    expect(calls).toEqual([]);
  });

  it("ports GWPUnitSelector WheelUpButton active up button as up action", () => {
    const calls: string[] = [];

    const handled = wheelUpProductionUnitSelector({
      upButton: { isActive: () => true },
      doUpButton: () => calls.push("up"),
    });

    expect(handled).toBe(true);
    expect(calls).toEqual(["up"]);
  });

  it("ports GWPUnitSelector WheelDownButton inactive down button as no-op", () => {
    const calls: string[] = [];

    const handled = wheelDownProductionUnitSelector({
      downButton: { isActive: () => false },
      doDownButton: () => calls.push("down"),
    });

    expect(handled).toBe(false);
    expect(calls).toEqual([]);
  });

  it("ports GWPUnitSelector WheelDownButton active down button as down action", () => {
    const calls: string[] = [];

    const handled = wheelDownProductionUnitSelector({
      downButton: { isActive: () => true },
      doDownButton: () => calls.push("down"),
    });

    expect(handled).toBe(true);
    expect(calls).toEqual(["down"]);
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

  it("ports GWPUnitSelector SetBuildList as selector build-list assignment", () => {
    const buildList = {
      getBuildList: () => [{ ot: 1, oid: 2 }],
    };
    const state = {
      buildList: null as typeof buildList | null,
    };

    setProductionUnitSelectorBuildList(state, buildList);
    expect(state.buildList).toBe(buildList);

    setProductionUnitSelectorBuildList(state, null);
    expect(state.buildList).toBeNull();
  });

  it("ports GWPUnitSelector SetSelection as object type/id index selection", () => {
    const calls: Array<[number, number]> = [];
    let drawCalls = 0;
    const state = {
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList(buildingType: number, buildingLevel: number) {
          calls.push([buildingType, buildingLevel]);
          return [
            { ot: 1, oid: 7 },
            { ot: 3, oid: 4 },
            { ot: 3, oid: 9 },
          ];
        },
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
      setDrawObject() {
        drawCalls += 1;
      },
    };

    setProductionUnitSelectorSelection(state, 3, 9);

    expect(state.selectedIndex).toBe(2);
    expect(calls).toEqual([[BuildingType.RobotFactory, 2]]);
    expect(drawCalls).toBe(1);
  });

  it("ports GWPUnitSelector SetSelection guard exits before draw refresh", () => {
    let drawCalls = 0;
    const noBuildList = {
      buildingObject: { getLevel: () => 2 },
      buildList: null,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 1,
      setDrawObject() {
        drawCalls += 1;
      },
    };
    const noBuilding = {
      buildingObject: null,
      buildList: {
        getBuildList: () => [{ ot: 1, oid: 2 }],
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 1,
      setDrawObject() {
        drawCalls += 1;
      },
    };

    setProductionUnitSelectorSelection(noBuildList, 1, 2);
    setProductionUnitSelectorSelection(noBuilding, 1, 2);

    expect(noBuildList.selectedIndex).toBe(1);
    expect(noBuilding.selectedIndex).toBe(1);
    expect(drawCalls).toBe(0);
  });

  it("ports GWPUnitSelector SetSelection as draw refresh when no object matches", () => {
    let drawCalls = 0;
    const state = {
      buildingObject: { getLevel: () => 2 },
      buildList: {
        getBuildList: () => [
          { ot: 1, oid: 7 },
          { ot: 3, oid: 4 },
        ],
      },
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 1,
      setDrawObject() {
        drawCalls += 1;
      },
    };

    setProductionUnitSelectorSelection(state, 9, 9);

    expect(state.selectedIndex).toBe(1);
    expect(drawCalls).toBe(1);
  });

  it("ports GWPUnitSelector SetDrawObject guard exits", () => {
    const resets: Array<[number, number]> = [];
    const noBuilding = {
      buildingObject: null,
      buildList: {
        getBuildList: () => [{ ot: 1, oid: 2 }],
      },
      isOnlySelector: false,
      buildState: ProductionBuildingState.Select,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
      resetDrawObjectTo: (objectType: number, objectId: number) =>
        resets.push([objectType, objectId]),
    };
    const noBuildList = {
      buildingObject: {
        getLevel: () => 2,
        getBuiltCannonList: () => [],
        getBuildUnit: () => ({ hasUnit: true, objectType: 1, objectId: 2 }),
      },
      buildList: null,
      isOnlySelector: false,
      buildState: ProductionBuildingState.Select,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
      resetDrawObjectTo: (objectType: number, objectId: number) =>
        resets.push([objectType, objectId]),
    };
    const emptyList = {
      buildingObject: {
        getLevel: () => 2,
        getBuiltCannonList: () => [],
        getBuildUnit: () => ({ hasUnit: true, objectType: 1, objectId: 2 }),
      },
      buildList: {
        getBuildList: () => [],
      },
      isOnlySelector: false,
      buildState: ProductionBuildingState.Select,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
      resetDrawObjectTo: (objectType: number, objectId: number) =>
        resets.push([objectType, objectId]),
    };

    setProductionUnitSelectorDrawObject(noBuilding);
    setProductionUnitSelectorDrawObject(noBuildList);
    setProductionUnitSelectorDrawObject(emptyList);

    expect(resets).toEqual([]);
  });

  it("ports GWPUnitSelector SetDrawObject as selected build-list object", () => {
    const calls: Array<[number, number]> = [];
    const resets: Array<[number, number]> = [];
    const state = {
      buildingObject: {
        getLevel: () => 2,
        getBuiltCannonList: () => [],
        getBuildUnit: () => ({ hasUnit: false, objectType: 0, objectId: 0 }),
      },
      buildList: {
        getBuildList(buildingType: number, buildingLevel: number) {
          calls.push([buildingType, buildingLevel]);
          return [
            { ot: 1, oid: 7 },
            { ot: 3, oid: 4 },
          ];
        },
      },
      isOnlySelector: false,
      buildState: ProductionBuildingState.Select,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 1,
      resetDrawObjectTo: (objectType: number, objectId: number) =>
        resets.push([objectType, objectId]),
    };

    setProductionUnitSelectorDrawObject(state);

    expect(calls).toEqual([[BuildingType.RobotFactory, 2]]);
    expect(state.selectedIndex).toBe(1);
    expect(resets).toEqual([[3, 4]]);
  });

  it("ports GWPUnitSelector SetDrawObject selected index wrap", () => {
    const resets: Array<[number, number]> = [];
    const state = {
      buildingObject: {
        getLevel: () => 2,
        getBuiltCannonList: () => [],
        getBuildUnit: () => ({ hasUnit: false, objectType: 0, objectId: 0 }),
      },
      buildList: {
        getBuildList: () => [{ ot: 1, oid: 7 }],
      },
      isOnlySelector: true,
      buildState: ProductionBuildingState.Building,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 9,
      resetDrawObjectTo: (objectType: number, objectId: number) =>
        resets.push([objectType, objectId]),
    };

    setProductionUnitSelectorDrawObject(state);

    expect(state.selectedIndex).toBe(0);
    expect(resets).toEqual([[1, 7]]);
  });

  it("ports GWPUnitSelector SetDrawObject as built cannon draw object", () => {
    const resets: Array<[number, number]> = [];
    const state = {
      buildingObject: {
        getLevel: () => 2,
        getBuiltCannonList: () => [8, 9],
        getBuildUnit: () => ({ hasUnit: true, objectType: 1, objectId: 2 }),
      },
      buildList: {
        getBuildList: () => [{ ot: 1, oid: 7 }],
      },
      isOnlySelector: false,
      buildState: ProductionBuildingState.Building,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
      resetDrawObjectTo: (objectType: number, objectId: number) =>
        resets.push([objectType, objectId]),
    };

    setProductionUnitSelectorDrawObject(state);

    expect(resets).toEqual([[MapObjectType.Cannon, 8]]);
  });

  it("ports GWPUnitSelector SetDrawObject as current build unit fallback", () => {
    const resets: Array<[number, number]> = [];
    const state = {
      buildingObject: {
        getLevel: () => 2,
        getBuiltCannonList: () => [],
        getBuildUnit: () => ({ hasUnit: true, objectType: 4, objectId: 6 }),
      },
      buildList: {
        getBuildList: () => [{ ot: 1, oid: 7 }],
      },
      isOnlySelector: false,
      buildState: ProductionBuildingState.Building,
      buildingType: BuildingType.RobotFactory,
      selectedIndex: 0,
      resetDrawObjectTo: (objectType: number, objectId: number) =>
        resets.push([objectType, objectId]),
    };

    setProductionUnitSelectorDrawObject(state);

    expect(resets).toEqual([[4, 6]]);
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

  it("ports GWProduction LoadFullSelector from the unit selector origin", () => {
    const calls: string[] = [];
    const centers: Array<[number, number]> = [];
    const state = {
      x: 100,
      y: 40,
      width: 120,
      height: 80,
      fullSelector: {
        setActive: (isActive: boolean) => calls.push(`active:${isActive}`),
        setUnitSelectorRefId: (refId: number) => calls.push(`ref:${refId}`),
        clearSelected: () => calls.push("clear"),
        setCenterCoords: (centerX: number, centerY: number) => {
          centers.push([centerX, centerY]);
        },
      },
      unitSelector: { refId: 7, x: 10, y: 20 },
      queueSelector: { refId: 9, x: 30, y: 40 },
    };

    loadProductionFullSelector(state, 7);

    expect(calls).toEqual(["active:true", "ref:7", "clear"]);
    expect(centers).toEqual([[134, 81]]);
  });

  it("ports GWProduction LoadFullSelector queue and center fallbacks", () => {
    const centers: Array<[number, number]> = [];
    const state = {
      x: 100,
      y: 40,
      width: 121,
      height: 81,
      fullSelector: {
        setActive: () => undefined,
        setUnitSelectorRefId: () => undefined,
        clearSelected: () => undefined,
        setCenterCoords: (centerX: number, centerY: number) => {
          centers.push([centerX, centerY]);
        },
      },
      unitSelector: { refId: 7, x: 10, y: 20 },
      queueSelector: { refId: 9, x: 30, y: 40 },
    };

    loadProductionFullSelector(state, 9);
    loadProductionFullSelector(state, 12);

    expect(centers).toEqual([
      [154, 101],
      [184, 101],
    ]);
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

  it("ports GWProduction SetType as production type to building type mapping", () => {
    const calls: Array<[string, BuildingType]> = [];
    const state = {
      type: ProductionType.Robot,
      buildingType: BuildingType.RobotFactory,
      unitSelector: {
        setBuildingType(buildingType: BuildingType) {
          calls.push(["unit", buildingType]);
        },
      },
      queueSelector: {
        setBuildingType(buildingType: BuildingType) {
          calls.push(["queue", buildingType]);
        },
      },
      fullSelector: {
        setBuildingType(buildingType: BuildingType) {
          calls.push(["full", buildingType]);
        },
      },
    };

    setProductionType(state, ProductionType.Fort);
    expect(state.type).toBe(ProductionType.Fort);
    expect(state.buildingType).toBe(BuildingType.FortFront);

    setProductionType(state, ProductionType.Vehicle);
    expect(state.type).toBe(ProductionType.Vehicle);
    expect(state.buildingType).toBe(BuildingType.VehicleFactory);

    setProductionType(state, ProductionType.Robot);
    expect(state.type).toBe(ProductionType.Robot);
    expect(state.buildingType).toBe(BuildingType.RobotFactory);

    expect(calls).toEqual([
      ["unit", BuildingType.FortFront],
      ["queue", BuildingType.FortFront],
      ["full", BuildingType.FortFront],
      ["unit", BuildingType.VehicleFactory],
      ["queue", BuildingType.VehicleFactory],
      ["full", BuildingType.VehicleFactory],
      ["unit", BuildingType.RobotFactory],
      ["queue", BuildingType.RobotFactory],
      ["full", BuildingType.RobotFactory],
    ]);
  });

  it("ports GWProduction SetType default path as current building type propagation", () => {
    const calls: Array<[string, BuildingType]> = [];
    const state = {
      type: ProductionType.Robot,
      buildingType: BuildingType.FortFront,
      unitSelector: {
        setBuildingType(buildingType: BuildingType) {
          calls.push(["unit", buildingType]);
        },
      },
      queueSelector: {
        setBuildingType(buildingType: BuildingType) {
          calls.push(["queue", buildingType]);
        },
      },
      fullSelector: {
        setBuildingType(buildingType: BuildingType) {
          calls.push(["full", buildingType]);
        },
      },
    };

    setProductionType(state, ProductionType.TypesMax);

    expect(state.type).toBe(ProductionType.TypesMax);
    expect(state.buildingType).toBe(BuildingType.FortFront);
    expect(calls).toEqual([
      ["unit", BuildingType.FortFront],
      ["queue", BuildingType.FortFront],
      ["full", BuildingType.FortFront],
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

  it("ports GWProduction Click as full selector map-coordinate short circuit", () => {
    const calls: unknown[] = [];
    const state = productionClickState(calls, {
      fullSelector: {
        click: (x: number, y: number) => {
          calls.push(["full", x, y]);
          return true;
        },
      },
    });

    expect(clickProductionWindow(state, 35, 45)).toBe(true);
    expect(calls).toEqual([["full", 35, 45]]);
  });

  it("ports GWProduction Click as local control routing and bounds hit testing", () => {
    const calls: unknown[] = [];
    const state = productionClickState(calls);

    expect(clickProductionWindow(state, 35, 45)).toBe(true);
    expect(clickProductionWindow(state, 9, 45)).toBe(false);
    expect(clickProductionWindow(state, 35, 19)).toBe(false);
    expect(clickProductionWindow(state, 110, 45)).toBe(false);
    expect(clickProductionWindow(state, 35, 100)).toBe(false);

    expect(calls).toEqual([
      ["full", 35, 45],
      ["ok", 25, 25],
      ["cancel", 25, 25],
      ["place", 25, 25],
      ["plus", 25, 25],
      ["minus", 25, 25],
      ["queue", 25, 25],
      ["queue-item", 25, 25],
      ["unit-selector", 25, 25],
      ["queue-selector", 25, 25],
      ["full", 9, 45],
      ["ok", -1, 25],
      ["cancel", -1, 25],
      ["place", -1, 25],
      ["plus", -1, 25],
      ["minus", -1, 25],
      ["queue", -1, 25],
      ["queue-item", -1, 25],
      ["unit-selector", -1, 25],
      ["queue-selector", -1, 25],
      ["full", 35, 19],
      ["ok", 25, -1],
      ["cancel", 25, -1],
      ["place", 25, -1],
      ["plus", 25, -1],
      ["minus", 25, -1],
      ["queue", 25, -1],
      ["queue-item", 25, -1],
      ["unit-selector", 25, -1],
      ["queue-selector", 25, -1],
      ["full", 110, 45],
      ["ok", 100, 25],
      ["cancel", 100, 25],
      ["place", 100, 25],
      ["plus", 100, 25],
      ["minus", 100, 25],
      ["queue", 100, 25],
      ["queue-item", 100, 25],
      ["unit-selector", 100, 25],
      ["queue-selector", 100, 25],
      ["full", 35, 100],
      ["ok", 25, 80],
      ["cancel", 25, 80],
      ["place", 25, 80],
      ["plus", 25, 80],
      ["minus", 25, 80],
      ["queue", 25, 80],
      ["queue-item", 25, 80],
      ["unit-selector", 25, 80],
      ["queue-selector", 25, 80],
    ]);
  });

  it("ports GWProduction Click collapsed state without queue item routing", () => {
    const calls: unknown[] = [];
    const state = productionClickState(calls, { isExpanded: false });

    expect(clickProductionWindow(state, 35, 45)).toBe(true);

    expect(calls).toEqual([
      ["full", 35, 45],
      ["ok", 25, 25],
      ["cancel", 25, 25],
      ["place", 25, 25],
      ["plus", 25, 25],
      ["minus", 25, 25],
      ["queue", 25, 25],
      ["unit-selector", 25, 25],
      ["queue-selector", 25, 25],
    ]);
  });

  it("ports GWProduction MakeQueueButtonList as a no-op without a building", () => {
    const queueButtonList = [{ offsetX: 1, offsetY: 2, ot: 3, oid: 4 }];

    makeProductionQueueButtonList({
      buildingObject: null,
      queueButtonList,
    });

    expect(queueButtonList).toEqual([{ offsetX: 1, offsetY: 2, ot: 3, oid: 4 }]);
  });

  it("ports GWProduction MakeQueueButtonList as queued unit button layout", () => {
    const queueButtonList = [{ offsetX: 1, offsetY: 2, ot: 3, oid: 4 }];

    makeProductionQueueButtonList({
      buildingObject: {
        getQueueList: () => [
          { ot: 2, oid: 7 },
          { ot: 1, oid: 5 },
          { ot: 3, oid: 9 },
        ],
      },
      queueButtonList,
    });

    expect(queueButtonList).toEqual([
      {
        offsetX: PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
        offsetY: PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS,
        ot: 2,
        oid: 7,
      },
      {
        offsetX: PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
        offsetY:
          PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS +
          PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS +
          PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
        ot: 1,
        oid: 5,
      },
      {
        offsetX: PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
        offsetY:
          PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS +
          (PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS +
            PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS) *
            2,
        ot: 3,
        oid: 9,
      },
    ]);
  });

  it("ports GWProduction CheckQueueButtonList as a no-op without a building", () => {
    const queueButtonList = [{ offsetX: 1, offsetY: 2, ot: 3, oid: 4 }];

    checkProductionQueueButtonList({
      buildingObject: null,
      queueButtonList,
    });

    expect(queueButtonList).toEqual([{ offsetX: 1, offsetY: 2, ot: 3, oid: 4 }]);
  });

  it("ports GWProduction CheckQueueButtonList size refresh", () => {
    const queueButtonList = [{ offsetX: 1, offsetY: 2, ot: 3, oid: 4 }];

    checkProductionQueueButtonList({
      buildingObject: {
        getQueueList: () => [
          { ot: 2, oid: 7 },
          { ot: 1, oid: 5 },
        ],
      },
      queueButtonList,
    });

    expect(queueButtonList).toEqual([
      {
        offsetX: PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
        offsetY: PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS,
        ot: 2,
        oid: 7,
      },
      {
        offsetX: PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
        offsetY:
          PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS +
          PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS +
          PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
        ot: 1,
        oid: 5,
      },
    ]);
  });

  it("ports GWProduction CheckQueueButtonList item refresh", () => {
    const queueButtonList = [
      { offsetX: 99, offsetY: 88, ot: 2, oid: 7 },
      { offsetX: 77, offsetY: 66, ot: 1, oid: 4 },
    ];

    checkProductionQueueButtonList({
      buildingObject: {
        getQueueList: () => [
          { ot: 2, oid: 7 },
          { ot: 1, oid: 5 },
        ],
      },
      queueButtonList,
    });

    expect(queueButtonList).toEqual([
      {
        offsetX: PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
        offsetY: PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS,
        ot: 2,
        oid: 7,
      },
      {
        offsetX: PRODUCTION_QUEUE_BUTTON_START_X_PIXELS,
        offsetY:
          PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS +
          PRODUCTION_QUEUE_BUTTON_HEIGHT_PIXELS +
          PRODUCTION_QUEUE_BUTTON_MARGIN_PIXELS,
        ot: 1,
        oid: 5,
      },
    ]);
  });

  it("ports GWProduction CheckQueueButtonList unchanged queue as retained layout", () => {
    const queueButtonList = [
      { offsetX: 99, offsetY: 88, ot: 2, oid: 7 },
      { offsetX: 77, offsetY: 66, ot: 1, oid: 5 },
    ];

    checkProductionQueueButtonList({
      buildingObject: {
        getQueueList: () => [
          { ot: 2, oid: 7 },
          { ot: 1, oid: 5 },
        ],
      },
      queueButtonList,
    });

    expect(queueButtonList).toEqual([
      { offsetX: 99, offsetY: 88, ot: 2, oid: 7 },
      { offsetX: 77, offsetY: 66, ot: 1, oid: 5 },
    ]);
  });

  it("ports GWProduction DoOkButton select state as new production flag emission", () => {
    const flags = {
      sendNewProduction: false,
      pot: -1,
      poid: -1,
      prefId: 0,
    };
    const state = {
      state: ProductionBuildingState.Select,
      unitSelector: {
        getSelectedId: () => ({
          selected: true,
          objectType: 3,
          objectId: 7,
        }),
      },
      buildingObject: { getRefId: () => 42 },
      killme: false,
      flags,
    };

    doProductionOkButton(state);

    expect(state.killme).toBe(false);
    expect(flags).toEqual({
      sendNewProduction: true,
      pot: 3,
      poid: 7,
      prefId: 42,
    });
  });

  it("ports GWProduction DoOkButton select state without selection as a no-op", () => {
    const flags = {
      sendNewProduction: false,
      pot: -1,
      poid: -1,
      prefId: 0,
    };
    const state = {
      state: ProductionBuildingState.Select,
      unitSelector: {
        getSelectedId: () => ({
          selected: false,
          objectType: 3,
          objectId: 7,
        }),
      },
      buildingObject: { getRefId: () => 42 },
      killme: false,
      flags,
    };

    doProductionOkButton(state);

    expect(state.killme).toBe(false);
    expect(flags).toEqual({
      sendNewProduction: false,
      pot: -1,
      poid: -1,
      prefId: 0,
    });
  });

  it("ports GWProduction DoOkButton state branches", () => {
    const flags = {
      sendNewProduction: false,
      pot: -1,
      poid: -1,
      prefId: 0,
    };
    const baseState = {
      unitSelector: {
        getSelectedId: () => ({
          selected: true,
          objectType: 3,
          objectId: 7,
        }),
      },
      buildingObject: { getRefId: () => 42 },
      killme: false,
      flags,
    };

    const placeState = {
      ...baseState,
      state: ProductionBuildingState.Place,
    };
    doProductionOkButton(placeState);
    expect(placeState.killme).toBe(false);
    expect(flags.sendNewProduction).toBe(false);

    const pausedState = {
      ...baseState,
      state: ProductionBuildingState.Paused,
      killme: false,
    };
    doProductionOkButton(pausedState);
    expect(pausedState.killme).toBe(true);

    const buildingState = {
      ...baseState,
      state: ProductionBuildingState.Building,
      killme: false,
    };
    doProductionOkButton(buildingState);
    expect(buildingState.killme).toBe(true);
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
    const state: ProductionPlaceButtonState = {
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
    expect(PRODUCTION_QUEUE_BUTTON_START_X_PIXELS).toBe(177);
    expect(PRODUCTION_QUEUE_BUTTON_START_Y_PIXELS).toBe(22);
  });
});

type UnitSelectorRenderImage = { id: string };
type UnitSelectorRenderState = ProductionUnitSelectorRenderState<
  UnitSelectorRenderImage,
  { id: string; getBaseSurface: () => { width: number; height: number } | null },
  string,
  string,
  UnitSelectorRenderImage
>;

function createUnitSelectorRenderState(
  overrides: Partial<UnitSelectorRenderState> = {},
): UnitSelectorRenderState {
  const yellowPercentageBarImage = {
    id: "yellow-percentage-bar",
    getBaseSurface: () => ({ width: 8, height: 20 }),
  };

  return {
    finishedInit: true,
    isActive: true,
    x: 0,
    y: 0,
    buildingObject: { id: "building" },
    buildState: ProductionBuildingState.Building,
    isOnlySelector: false,
    percentageProduced: 0.4,
    percentageBarImage: { id: "percentage-bar" },
    yellowPercentageBarImage,
    upButton: {
      render: (_map, x, y) => {
        void _map;
        return x >= 0 && y >= 0 ? "up-button" : null;
      },
    },
    downButton: {
      render: (_map, x, y) => {
        void _map;
        return x >= 0 && y >= 0 ? "down-button" : null;
      },
    },
    drawObject: null,
    ...overrides,
  };
}

function createUnitSelectorRenderMap(calls: unknown[] = []) {
  return {
    renderZSurface(surface: UnitSelectorRenderImage, x: number, y: number) {
      if (surface.id === "percentage-bar") {
        calls.push(["bar", surface.id, x, y]);
        return "percentage-bar-command";
      }

      calls.push(["hover", surface.id, x, y]);
      return "hover-name-command";
    },
    getBlitInfo(
      surface: { width: number; height: number } | null,
      x: number,
      y: number,
    ) {
      calls.push(["yellow", surface ? "yellow-surface" : null, x, y]);
      if (!surface) return null;

      return {
        sourceX: 0,
        sourceY: 0,
        width: surface.width,
        height: surface.height,
        destinationX: x,
        destinationY: y,
      };
    },
  };
}
