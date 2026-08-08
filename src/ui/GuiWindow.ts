/**
 * Upstream: zgui_window.h
 */

/**
 * Port of upstream `ZGuiWindow::SetCords` mutable fields.
 * Role: Holds a GUI window origin and dimensions for centered placement.
 * Upstream: zgui_window.cpp:468-475
 */
export type GuiWindowCoordinateState = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Port of upstream `ZGuiWindow::SetCords`.
 * Role: Centers a GUI window on a point and clamps its origin to the playable viewport margin.
 * Upstream: zgui_window.cpp:468-475
 */
export function setGuiWindowCoords(
  state: GuiWindowCoordinateState,
  centerX: number,
  centerY: number,
): void {
  state.x = centerX - (state.width >> 1);
  state.y = centerY - (state.height >> 1);

  if (state.x < 16) state.x = 16;
  if (state.y < 16) state.y = 16;
}
