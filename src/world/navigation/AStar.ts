export function manhattanHeuristic(
  startX: number,
  startY: number,
  finishX: number,
  finishY: number,
): number {
  return Math.abs(startX - finishX) + Math.abs(startY - finishY);
}

export function freePointIndex<T>(pointIndex: T[][]): void {
  for (const column of pointIndex) {
    column.length = 0;
  }
  pointIndex.length = 0;
}

export function freeList<T>(list: T[]): void {
  list.length = 0;
}

export function initPointIndex(width: number, height: number): number[][] {
  return Array.from({ length: width }, () => Array<number>(height).fill(-1));
}

export function removePoint<T extends { x: number; y: number }>(
  list: T[],
  pointIndex: number[][],
  x: number,
  y: number,
): void {
  const index = pointIndex[x][y];
  if (index === -1) {
    return;
  }

  pointIndex[x][y] = -1;
  const lastPoint = list.pop();
  if (lastPoint && index < list.length) {
    list[index] = lastPoint;
    pointIndex[lastPoint.x][lastPoint.y] = index;
  }
}
