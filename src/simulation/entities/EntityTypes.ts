export enum UnitRepairWaypointStage {
  GoToEntrance = 0,
  EnterBuilding = 1,
  ExitBuilding = 2,
  Wait = 3,
}

export enum ObjectMode {
  Null = 0,
  JustPlaced = 1,
  Rotating = 2,
  Stationary = 3,
  RobotWalking = 4,
  RobotStanding = 5,
  RobotCigarette = 6,
  RobotFullScan = 7,
  RobotHeadStretch = 8,
  RobotBeer = 9,
  RobotAttacking = 10,
  RobotPickupUpGrenades = 11,
  RobotPickupDownGrenades = 12,
  CannonAttacking = 13,
  Max = 14,
}

export enum EnterFortWaypointStage {
  GoToEntrance = 0,
  EnterBuilding = 1,
  ExitBuilding = 2,
}

export enum AggroWaypointStage {
  Attack = 0,
  Return = 1,
}

export enum CraneRepairWaypointStage {
  GoToEntrance = 0,
  EnterBuilding = 1,
  ExitBuilding = 2,
}

export enum WaypointMode {
  Move = 0,
  Enter = 1,
  Attack = 2,
  ForceMove = 3,
  CraneRepair = 4,
  UnitRepair = 5,
  Aggro = 6,
  EnterFort = 7,
  Dodge = 8,
  PickupGrenades = 9,
  Max = 10,
}

export type DriverInfo = {
  health: number;
  nextAttackTime: number;
};

export type FireMissileInfo = {
  offsetTime: number;
  x: number;
  y: number;
};

export type ObjectLocation = {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
};
