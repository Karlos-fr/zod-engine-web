import { describe, expect, it } from "vitest";
import { TeamType } from "../src/simulation/SimulationConstants";
import {
  FactoryListWindow,
  FactoryListRenderEntry,
  ZGW_FACTORY_LIST_HEADER_GUARD_PORTED,
} from "../src/ui/FactoryListWindow";

describe("factory list window", () => {
  it("adapts the gwfactory_list.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/FactoryListWindow");
    const secondImport = await import("../src/ui/FactoryListWindow");

    expect(ZGW_FACTORY_LIST_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGW_FACTORY_LIST_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGW_FACTORY_LIST_HEADER_GUARD_PORTED,
    );
  });

  it("replaces gwfl_render_entry with a three-line render entry", () => {
    expect(new FactoryListRenderEntry()).toEqual({
      messageLeft: ["", "", ""],
      messageRight: ["", "", ""],
      colored: [false, false, false],
      percent: [0, 0, 0],
      refId: -1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  it("ports gwfl_render_entry clear geometry and color reset", () => {
    const entry = new FactoryListRenderEntry();
    entry.messageLeft[0] = "Robot";
    entry.messageRight[0] = "30s";
    entry.colored = [true, true, true];
    entry.percent[0] = 0.5;
    entry.refId = 9;
    entry.x = 1;
    entry.y = 2;
    entry.width = 3;
    entry.height = 4;

    entry.clear();

    expect(entry.messageLeft).toEqual(["Robot", "", ""]);
    expect(entry.messageRight).toEqual(["30s", "", ""]);
    expect(entry.percent).toEqual([0.5, 0, 0]);
    expect(entry.colored).toEqual([false, false, false]);
    expect(entry.refId).toBe(-1);
    expect({ x: entry.x, y: entry.y, width: entry.width, height: entry.height }).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  it("ports GWFactoryList SetTeam as a team assignment", () => {
    const window = new FactoryListWindow();

    window.setTeam(2);

    expect(window.team).toBe(2);
  });

  it("ports GWFactoryList Process guard exits before collecting entries", () => {
    class TestFactoryListWindow extends FactoryListWindow {
      collectCount = 0;

      override collectEntries(): void {
        this.collectCount++;
      }
    }
    const window = new TestFactoryListWindow();

    window.process();
    window.show = true;
    window.process();
    window.finishedInit = true;
    window.process();
    window.objectLists = {};
    window.team = TeamType.Null;
    window.process();

    expect(window.collectCount).toBe(0);
  });

  it("ports GWFactoryList Process as visible initialized entry collection", () => {
    class TestFactoryListWindow extends FactoryListWindow {
      collectCount = 0;

      override collectEntries(): void {
        this.collectCount++;
      }
    }
    const window = new TestFactoryListWindow();
    window.show = true;
    window.finishedInit = true;
    window.objectLists = {};
    window.team = TeamType.Red;

    window.process();

    expect(window.collectCount).toBe(1);
  });

  it("ports GWFactoryList DoUpButton as first visible entry decrement clamped to zero", () => {
    const window = new FactoryListWindow();
    window.showStartEntry = 2;

    window.doUpButton();

    expect(window.showStartEntry).toBe(1);

    window.doUpButton();
    window.doUpButton();

    expect(window.showStartEntry).toBe(0);
  });

  it("ports GWFactoryList DoDownButton as first visible entry increment", () => {
    const window = new FactoryListWindow();
    window.showStartEntry = 2;

    window.doDownButton();

    expect(window.showStartEntry).toBe(3);
  });

  it("ports GWFactoryList WheelUpButton as hidden no-op", () => {
    const window = new FactoryListWindow();
    window.show = false;
    window.showStartEntry = 2;

    expect(window.wheelUpButton()).toBe(false);
    expect(window.showStartEntry).toBe(2);
  });

  it("ports GWFactoryList WheelUpButton as visible list scroll", () => {
    const window = new FactoryListWindow();
    window.show = true;
    window.showStartEntry = 2;

    expect(window.wheelUpButton()).toBe(true);
    expect(window.showStartEntry).toBe(1);
  });

  it("ports GWFactoryList WheelDownButton as hidden no-op", () => {
    const window = new FactoryListWindow();
    window.show = false;
    window.showStartEntry = 2;

    expect(window.wheelDownButton()).toBe(false);
    expect(window.showStartEntry).toBe(2);
  });

  it("ports GWFactoryList WheelDownButton as visible list scroll", () => {
    const window = new FactoryListWindow();
    window.show = true;
    window.showStartEntry = 2;

    expect(window.wheelDownButton()).toBe(true);
    expect(window.showStartEntry).toBe(3);
  });
});
