import { describe, expect, it } from "vitest";
import {
  CURSOR_FRAME_INTERVAL_SECONDS,
  type CursorProcessState,
  CursorType,
  getCursor,
  processCursor,
  renderCursor,
  setCursor,
  setCursorTeam,
  setPlayerPreviewCursor,
} from "../src/input/CursorTiming";
import { TeamType } from "../src/simulation/SimulationConstants";

describe("cursor timing", () => {
  it("replaces the cursor header guard with module boundaries", async () => {
    const firstImport = await import("../src/input/CursorTiming");
    const secondImport = await import("../src/input/CursorTiming");

    expect(secondImport.CURSOR_FRAME_INTERVAL_SECONDS).toBe(
      firstImport.CURSOR_FRAME_INTERVAL_SECONDS,
    );
  });

  it("ports the cursor animation frame interval", () => {
    expect(CURSOR_FRAME_INTERVAL_SECONDS).toBe(0.2);
  });

  it("ports cursor interaction types", () => {
    expect(CursorType.Cursor).toBe(0);
    expect(CursorType.Attack).toBe(3);
    expect(CursorType.Grenaded).toBe(8);
    expect(CursorType.Cannon).toBe(12);
    expect(CursorType.Exited).toBe(17);
    expect(CursorType.MaxCursorTypes).toBe(18);
  });

  it("ports ZCursor::GetCursor as current cursor selection read", () => {
    expect(getCursor({ currentCursor: CursorType.Attack })).toBe(
      CursorType.Attack,
    );
  });

  it("ports ZCursor::SetCursor as cursor selection and surface refresh", () => {
    const attackSurface = { id: "attack-red-frame-0" };
    const surfaces = [] as Array<Array<Array<{ id: string }>>>;
    surfaces[CursorType.Attack] = [];
    surfaces[CursorType.Attack]![TeamType.Red] = [attackSurface];
    const state = {
      currentCursor: CursorType.Cursor,
      owner: TeamType.Red,
      cursorFrameIndex: 0,
      currentSurface: null as { id: string } | null,
    };

    setCursor(state, CursorType.Attack, surfaces);

    expect(state.currentCursor).toBe(CursorType.Attack);
    expect(state.currentSurface).toBe(attackSurface);
  });

  it("ports ZCursor::SetTeam as team palette and surface refresh", () => {
    const redSurface = { id: "attack-red-frame-0" };
    const blueSurface = { id: "attack-blue-frame-0" };
    const surfaces = [] as Array<Array<Array<{ id: string }>>>;
    surfaces[CursorType.Attack] = [];
    surfaces[CursorType.Attack]![TeamType.Red] = [redSurface];
    surfaces[CursorType.Attack]![TeamType.Blue] = [blueSurface];
    const state = {
      currentCursor: CursorType.Attack,
      owner: TeamType.Red,
      cursorFrameIndex: 0,
      currentSurface: redSurface as { id: string } | null,
    };

    setCursorTeam(state, TeamType.Blue, surfaces);

    expect(state.owner).toBe(TeamType.Blue);
    expect(state.currentSurface).toBe(blueSurface);

    setCursorTeam(state, TeamType.Green, surfaces);
    expect(state.currentSurface).toBeNull();
  });

  it("keeps ZCursor Process unchanged before the next process time", () => {
    const surface = { id: "cursor-red-frame-0" };
    const surfaces = [] as Array<Array<Array<{ id: string }>>>;
    surfaces[CursorType.Cursor] = [];
    surfaces[CursorType.Cursor]![TeamType.Red] = [surface];
    const state: CursorProcessState<{ id: string }> = {
      currentCursor: CursorType.Cursor,
      owner: TeamType.Red,
      cursorFrameIndex: 0,
      currentSurface: surface,
      nextProcessTime: 10,
    };

    processCursor(state, 9.99, surfaces);

    expect(state).toEqual({
      currentCursor: CursorType.Cursor,
      owner: TeamType.Red,
      cursorFrameIndex: 0,
      currentSurface: surface,
      nextProcessTime: 10,
    });
  });

  it("ports ZCursor Process as timed frame advance and surface refresh", () => {
    const surfaces = [] as Array<Array<Array<{ id: string }>>>;
    surfaces[CursorType.Attack] = [];
    surfaces[CursorType.Attack]![TeamType.Blue] = [
      { id: "attack-blue-frame-0" },
      { id: "attack-blue-frame-1" },
    ];
    const state: CursorProcessState<{ id: string }> = {
      currentCursor: CursorType.Attack,
      owner: TeamType.Blue,
      cursorFrameIndex: 0,
      currentSurface: surfaces[CursorType.Attack]![TeamType.Blue]![0]!,
      nextProcessTime: 10,
    };

    processCursor(state, 10, surfaces);

    expect(state.cursorFrameIndex).toBe(1);
    expect(state.nextProcessTime).toBe(10 + CURSOR_FRAME_INTERVAL_SECONDS);
    expect(state.currentSurface).toBe(
      surfaces[CursorType.Attack]![TeamType.Blue]![1],
    );
  });

  it("wraps ZCursor Process after the fourth animation frame", () => {
    const surfaces = [] as Array<Array<Array<{ id: string }>>>;
    surfaces[CursorType.Grab] = [];
    surfaces[CursorType.Grab]![TeamType.Green] = [
      { id: "grab-green-frame-0" },
      { id: "grab-green-frame-1" },
      { id: "grab-green-frame-2" },
      { id: "grab-green-frame-3" },
    ];
    const state: CursorProcessState<{ id: string }> = {
      currentCursor: CursorType.Grab,
      owner: TeamType.Green,
      cursorFrameIndex: 3,
      currentSurface: surfaces[CursorType.Grab]![TeamType.Green]![3]!,
      nextProcessTime: 10,
    };

    processCursor(state, 10, surfaces);

    expect(state.cursorFrameIndex).toBe(0);
    expect(state.currentSurface).toBe(
      surfaces[CursorType.Grab]![TeamType.Green]![0],
    );
  });

  it("ports ZPlayer SetPcursor as command cursor feedback mapping", () => {
    const surfaces = [] as Array<Array<Array<{ id: string }>>>;
    for (const cursor of [
      CursorType.Placed,
      CursorType.Attacked,
      CursorType.Grabbed,
      CursorType.Grenaded,
      CursorType.Repaired,
      CursorType.Entered,
      CursorType.Exited,
      CursorType.Cannoned,
    ]) {
      surfaces[cursor] = [];
      surfaces[cursor]![TeamType.Red] = [{ id: `surface-${cursor}` }];
    }
    const state = {
      cursor: { currentCursor: CursorType.Place },
      previewCursor: {
        currentCursor: CursorType.Cursor,
        owner: TeamType.Red,
        cursorFrameIndex: 0,
        currentSurface: null as { id: string } | null,
      },
    };

    const expectedMappings = [
      [CursorType.Place, CursorType.Placed],
      [CursorType.Attack, CursorType.Attacked],
      [CursorType.Grab, CursorType.Grabbed],
      [CursorType.Grenade, CursorType.Grenaded],
      [CursorType.Repair, CursorType.Repaired],
      [CursorType.Enter, CursorType.Entered],
      [CursorType.Exit, CursorType.Exited],
      [CursorType.Cannon, CursorType.Cannoned],
    ] as const;

    for (const [sourceCursor, previewCursor] of expectedMappings) {
      state.cursor.currentCursor = sourceCursor;

      setPlayerPreviewCursor(state, surfaces);

      expect(state.previewCursor.currentCursor).toBe(previewCursor);
      expect(state.previewCursor.currentSurface).toBe(
        surfaces[previewCursor]![TeamType.Red]![0],
      );
    }
  });

  it("ports ZPlayer SetPcursor default as placed feedback cursor", () => {
    const placedSurface = { id: "placed-red-frame-0" };
    const surfaces = [] as Array<Array<Array<{ id: string }>>>;
    surfaces[CursorType.Placed] = [];
    surfaces[CursorType.Placed]![TeamType.Red] = [placedSurface];
    const state = {
      cursor: { currentCursor: CursorType.Cursor },
      previewCursor: {
        currentCursor: CursorType.Attacked,
        owner: TeamType.Red,
        cursorFrameIndex: 0,
        currentSurface: null as { id: string } | null,
      },
    };

    setPlayerPreviewCursor(state, surfaces);

    expect(state.previewCursor.currentCursor).toBe(CursorType.Placed);
    expect(state.previewCursor.currentSurface).toBe(placedSurface);
  });

  it("replaces ZCursor Render as no command without a current surface", () => {
    expect(
      renderCursor(
        {
          currentCursor: CursorType.Cursor,
          owner: TeamType.Red,
          cursorFrameIndex: 0,
          currentSurface: null,
        },
        {
          getBlitInfo: () => {
            throw new Error("getBlitInfo should not be called");
          },
        },
        20,
        30,
      ),
    ).toBeNull();
  });

  it("replaces ZCursor Render as unrestricted cursor blit command", () => {
    const surface = {
      id: "cursor",
      getBaseSurface: () => ({ width: 16, height: 16 }),
    };

    expect(
      renderCursor(
        {
          currentCursor: CursorType.Cursor,
          owner: TeamType.Red,
          cursorFrameIndex: 0,
          currentSurface: surface,
        },
        {
          getBlitInfo: () => {
            throw new Error("getBlitInfo should not be called unrestricted");
          },
        },
        20,
        30,
      ),
    ).toEqual({
      kind: "unrestricted",
      surface,
      x: 20,
      y: 30,
    });
  });

  it("replaces ZCursor Render with attack cursor offset and map clipping", () => {
    const baseSurface = { width: 16, height: 16 };
    const surface = {
      id: "attack",
      getBaseSurface: () => baseSurface,
    };
    const calls: unknown[] = [];

    const command = renderCursor(
      {
        currentCursor: CursorType.Attack,
        owner: TeamType.Red,
        cursorFrameIndex: 0,
        currentSurface: surface,
      },
      {
        getBlitInfo: (surface_, x, y) => {
          calls.push([surface_, x, y]);
          return {
            sourceX: 1,
            sourceY: 2,
            width: 3,
            height: 4,
            destinationX: 12,
            destinationY: 22,
          };
        },
      },
      20,
      30,
      true,
    );

    expect(calls).toEqual([[baseSurface, 12, 22]]);
    expect(command).toEqual({
      kind: "restricted",
      surface,
      region: {
        sourceX: 1,
        sourceY: 2,
        width: 3,
        height: 4,
        destinationX: 12,
        destinationY: 22,
      },
    });
  });

  it("replaces ZCursor Render as no restricted command without a visible region", () => {
    const surface = {
      id: "attack",
      getBaseSurface: () => ({ width: 16, height: 16 }),
    };

    expect(
      renderCursor(
        {
          currentCursor: CursorType.Attack,
          owner: TeamType.Red,
          cursorFrameIndex: 0,
          currentSurface: surface,
        },
        {
          getBlitInfo: () => null,
        },
        20,
        30,
        true,
      ),
    ).toBeNull();
  });
});
