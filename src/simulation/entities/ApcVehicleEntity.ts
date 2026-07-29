/**
 * Upstream: vapc.h / vapc.cpp
 */

import { VehicleEntity } from "./VehicleEntity";

/**
 * Browser simulation entity containing the subset of `VAPC` behavior already ported.
 * Role: Represents APC-specific vehicle behavior over the shared vehicle base.
 * Upstream: vapc.h
 */
export class ApcVehicleEntity extends VehicleEntity {
  /**
   * Port of upstream `VAPC::CanEjectDrivers`.
   * Role: Reports whether APC vehicles can eject drivers.
   * Upstream: vapc.cpp:261-264
   */
  override canEjectDrivers(): boolean {
    return true;
  }
}
