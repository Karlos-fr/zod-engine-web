export type MapBasics = {
  width: number;
  height: number;
  name: string;
  playerCount: number;
  objectCount: number;
  terrainType: number;
  zoneCount: number;
};

export function createEmptyMapBasics(): MapBasics {
  return {
    width: 0,
    height: 0,
    name: "",
    playerCount: 0,
    objectCount: 0,
    terrainType: 0,
    zoneCount: 0,
  };
}

export function resetMapBasics(target: MapBasics): void {
  Object.assign(target, createEmptyMapBasics());
}
