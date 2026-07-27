import { describe, expect, it } from "vitest";
import {
  freePointIndex,
  freeList,
  initPointIndex,
  manhattanHeuristic,
  removePoint,
} from "../src/world/navigation/AStar";

describe("A* navigation", () => {
  it("calculates the Manhattan heuristic", () => {
    expect(manhattanHeuristic(2, 3, 7, 11)).toBe(13);
    expect(manhattanHeuristic(7, 11, 2, 3)).toBe(13);
  });

  it("releases all point-index columns", () => {
    const firstColumn = [{ id: 1 }];
    const pointIndex = [firstColumn, [{ id: 2 }]];

    freePointIndex(pointIndex);

    expect(pointIndex).toEqual([]);
    expect(firstColumn).toEqual([]);
  });

  it("releases the A* point list", () => {
    const list = [{ id: 1 }, { id: 2 }];

    freeList(list);

    expect(list).toEqual([]);
  });

  it("initializes a width-major point index with empty sentinels", () => {
    expect(initPointIndex(3, 2)).toEqual([
      [-1, -1],
      [-1, -1],
      [-1, -1],
    ]);
  });

  it("removes a point and reindexes the moved tail point", () => {
    const list = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    const pointIndex = initPointIndex(3, 1);
    pointIndex[0][0] = 0;
    pointIndex[1][0] = 1;
    pointIndex[2][0] = 2;

    removePoint(list, pointIndex, 1, 0);

    expect(list).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ]);
    expect(pointIndex).toEqual([[0], [-1], [1]]);
  });
});
