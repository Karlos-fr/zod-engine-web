/**
 * Upstream: ecraneconco.h
 */

/**
 * Replacement for upstream `ecraneconco_render_item`.
 * Role: Identifies crane construction overlay pieces for renderer ordering.
 * Upstream: ecraneconco.h:7-10
 */
export enum CraneConstructionRenderItem {
  Concrete = 0,
  ConeVariant0 = 1,
  ConeVariant1 = 2,
  Jack = 3,
  Paper = 4,
  Sign = 5,
  Count = 6,
}
