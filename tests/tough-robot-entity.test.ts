import { describe, expect, it } from "vitest";
import {
  processToughRobot,
  renderToughRobot,
  ToughRobotEntity,
} from "../src/simulation/entities/ToughRobotEntity";
import { RobotObjectMode } from "../src/simulation/entities/RobotEntity";
import { ACTIVE_TEAM_TYPE_COUNT, TeamType } from "../src/simulation/SimulationConstants";

describe("tough robot entity", () => {
  it("ports RTough CanPickupGrenades as disabled grenade pickup", () => {
    const entity = new ToughRobotEntity({
      id: "tough-0",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canPickupGrenades()).toBe(false);
  });

  it("ports RTough CanHaveGrenades as disabled grenade inventory", () => {
    const entity = new ToughRobotEntity({
      id: "tough-1",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canHaveGrenades()).toBe(false);
  });

  it("ports RTough CanThrowGrenades as disabled grenade attacks", () => {
    const entity = new ToughRobotEntity({
      id: "tough-2",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canThrowGrenades()).toBe(false);
  });

  it("ports RTough Process as common processing without attack advancement", () => {
    const calls: number[] = [];
    const state = {
      mode: RobotObjectMode.Attacking,
      actionIndex: 1,
      nextAttackTime: 12,
    };

    expect(
      processToughRobot(state, 10, (currentTime) => calls.push(currentTime)),
    ).toBe(1);

    expect(calls).toEqual([10]);
    expect(state).toEqual({
      mode: RobotObjectMode.Attacking,
      actionIndex: 1,
      nextAttackTime: 12,
    });

    state.nextAttackTime = 9;
    state.actionIndex = 0;
    processToughRobot(state, 10, (currentTime) => calls.push(currentTime));
    expect(state.actionIndex).toBe(0);
    expect(state.nextAttackTime).toBe(9);
  });

  it("ports RTough Process as short attack frame timing", () => {
    const state = {
      mode: RobotObjectMode.Attacking,
      actionIndex: 1,
      nextAttackTime: 10,
    };

    processToughRobot(state, 10, () => undefined, () => 50);

    expect(state.actionIndex).toBe(2);
    expect(state.nextAttackTime).toBeCloseTo(10.065);
  });

  it("ports RTough Process as attack wrap and long cooldown timing", () => {
    const state = {
      mode: RobotObjectMode.Attacking,
      actionIndex: 2,
      nextAttackTime: 10,
    };

    processToughRobot(state, 10, () => undefined, () => 50);

    expect(state.actionIndex).toBe(0);
    expect(state.nextAttackTime).toBeCloseTo(10.85);
  });

  it("replaces RTough DoRender with a submerged clipped hit blit command", () => {
    const state = createToughRobotRenderState({
      mode: RobotObjectMode.Attacking,
      direction: 2,
      actionIndex: 1,
      doHitEffect: true,
    });
    const calls: unknown[] = [];

    expect(
      renderToughRobot(
        state,
        {
          submergeAmount: (x, y) => {
            calls.push({ submerge: [x, y] });
            return 4;
          },
          getBlitInfo: (x, y, width, height) => {
            calls.push({ blit: [x, y, width, height] });
            return {
              sourceX: 1,
              sourceY: 2,
              width: 10,
              height: 11,
              destinationX: 30,
              destinationY: 40,
            };
          },
        },
        -3,
        6,
      ),
    ).toEqual({
      surface: "fire-blue-2-1",
      region: {
        sourceX: 1,
        sourceY: 2,
        width: 10,
        height: 11,
        destinationX: 27,
        destinationY: 46,
      },
      renderHit: true,
    });
    expect(calls).toEqual([
      { submerge: [108, 208] },
      { blit: [100, 204, 16, 12] },
    ]);
    expect(state.submergeAmount).toBe(4);
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces RTough DoRender by selecting each tough action image table", () => {
    const zmap = createToughRenderMap();

    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.Walking,
          direction: 3,
          moveIndex: 2,
        }),
        zmap,
      )?.surface,
    ).toBe("walk-blue-3-2");
    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.Standing,
          direction: 4,
        }),
        zmap,
      )?.surface,
    ).toBe("stand-blue-4");
    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.Beer,
          actionIndex: 3,
        }),
        zmap,
      )?.surface,
    ).toBe("beer-blue-3");
    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.Cigarette,
          actionIndex: 4,
        }),
        zmap,
      )?.surface,
    ).toBe("cigarette-blue-4");
    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.FullScan,
          actionIndex: 5,
        }),
        zmap,
      )?.surface,
    ).toBe("full-blue-5");
    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.HeadStretch,
          actionIndex: 6,
        }),
        zmap,
      )?.surface,
    ).toBe("head-blue-6");
    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.PickupUpGrenades,
          actionIndex: 1,
        }),
        zmap,
      )?.surface,
    ).toBe("pickup-up-blue-1");
    expect(
      renderToughRobot(
        createToughRobotRenderState({
          mode: RobotObjectMode.PickupDownGrenades,
          actionIndex: 2,
        }),
        zmap,
      )?.surface,
    ).toBe("pickup-down-blue-2");
  });

  it("replaces RTough DoRender as null image or no command for hidden cases", () => {
    const zmap = createToughRenderMap();

    expect(
      renderToughRobot(
        createToughRobotRenderState({
          owner: TeamType.Null,
          mode: RobotObjectMode.Attacking,
        }),
        zmap,
      )?.surface,
    ).toBe("null-image");

    expect(
      renderToughRobot(
        createToughRobotRenderState({ nullImage: null, mode: 999 }),
        zmap,
      ),
    ).toBeNull();

    const submerged = createToughRobotRenderState({ doHitEffect: true });
    expect(
      renderToughRobot(submerged, {
        submergeAmount: () => 16,
        getBlitInfo: () => {
          throw new Error("getBlitInfo should not be called");
        },
      }),
    ).toBeNull();
    expect(submerged.doHitEffect).toBe(false);

    expect(
      renderToughRobot(createToughRobotRenderState(), {
        submergeAmount: () => 0,
        getBlitInfo: () => null,
      }),
    ).toBeNull();
  });
});

function createToughRenderMap(): {
  submergeAmount(x: number, y: number): number;
  getBlitInfo(
    x: number,
    y: number,
    width: number,
    height: number,
  ): {
    sourceX: number;
    sourceY: number;
    width: number;
    height: number;
    destinationX: number;
    destinationY: number;
  };
} {
  return {
    submergeAmount: () => 0,
    getBlitInfo: () => ({
      sourceX: 0,
      sourceY: 0,
      width: 16,
      height: 16,
      destinationX: 100,
      destinationY: 200,
    }),
  };
}

function createToughRobotRenderState(
  overrides: Partial<{
    position: { x: number; y: number };
    owner: TeamType;
    direction: number;
    moveIndex: number;
    actionIndex: number;
    mode: RobotObjectMode | number;
    doHitEffect: boolean;
    submergeAmount: number;
    nullImage: string | null;
  }> = {},
): {
  position: { x: number; y: number };
  owner: TeamType;
  direction: number;
  moveIndex: number;
  actionIndex: number;
  mode: RobotObjectMode | number;
  doHitEffect: boolean;
  submergeAmount: number;
  nullImage: string | null;
  walkImages: string[][][];
  standImages: string[][];
  beerImages: string[][];
  cigaretteImages: string[][];
  fullAreaScanImages: string[][];
  headStretchImages: string[][];
  pickupUpImages: string[][];
  pickupDownImages: string[][];
  fireImages: string[][][];
} {
  const teamName = (team: number): string =>
    team === TeamType.Blue ? "blue" : team === TeamType.Null ? "null" : `${team}`;
  const actionImages = (prefix: string): string[][] =>
    Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: 8 }, (_, index) => `${prefix}-${teamName(team)}-${index}`),
    );
  const directionalImages = (prefix: string): string[][] =>
    Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: 8 }, (_, direction) => `${prefix}-${teamName(team)}-${direction}`),
    );
  const movingImages = (prefix: string): string[][][] =>
    Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: 8 }, (_, direction) =>
        Array.from(
          { length: 3 },
          (_, frame) => `${prefix}-${teamName(team)}-${direction}-${frame}`,
        ),
      ),
    );

  return {
    position: { x: 100, y: 200 },
    owner: TeamType.Blue,
    direction: 0,
    moveIndex: 0,
    actionIndex: 0,
    mode: RobotObjectMode.Standing,
    doHitEffect: false,
    submergeAmount: 0,
    nullImage: "null-image",
    walkImages: movingImages("walk"),
    standImages: directionalImages("stand"),
    beerImages: actionImages("beer"),
    cigaretteImages: actionImages("cigarette"),
    fullAreaScanImages: actionImages("full"),
    headStretchImages: actionImages("head"),
    pickupUpImages: actionImages("pickup-up"),
    pickupDownImages: actionImages("pickup-down"),
    fireImages: movingImages("fire"),
    ...overrides,
  };
}
