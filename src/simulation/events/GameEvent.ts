export type GameEvent =
  | { type: "entity-selected"; entityId: string }
  | { type: "move-order"; entityId: string; x: number; y: number };
