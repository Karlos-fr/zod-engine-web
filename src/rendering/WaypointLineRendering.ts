/**
 * Upstream: zobject.cpp
 */

export type WaypointLinePoint = {
  x: number;
  y: number;
  width: number;
  height: number;
  gray: number;
};

/**
 * Browser-side replacement for upstream `ZObject::RenderWaypointLine`.
 * Role: Builds clipped waypoint line marker rectangles for a renderer to draw.
 * Upstream: zobject.cpp:1368-1414
 */
export function createWaypointLineMarkers(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  viewHeight: number,
  viewWidth: number,
  waypointIndex = 0,
): WaypointLinePoint[] {
  const grayLevel = 170;
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance === 0) {
    return [];
  }

  const stepX = (4 * deltaX) / distance;
  const stepY = (4 * deltaY) / distance;
  let currentX = startX + stepX * (waypointIndex / 4.0);
  let currentY = startY + stepY * (waypointIndex / 4.0);
  let maxPoints = Math.trunc(distance / 4) + 1;

  if (waypointIndex) {
    maxPoints -= 1;
  }

  const markers: WaypointLinePoint[] = [];
  for (let pointIndex = 0; pointIndex < maxPoints; pointIndex += 1) {
    const x = Math.trunc(currentX);
    const y = Math.trunc(currentY);

    if (x < viewWidth && y < viewHeight) {
      markers.push({
        x,
        y,
        width: 2,
        height: 2,
        gray: grayLevel,
      });
    }

    currentX += stepX;
    currentY += stepY;
  }

  return markers;
}
