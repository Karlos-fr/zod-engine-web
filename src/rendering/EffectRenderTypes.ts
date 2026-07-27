/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: ecraneconco.h
 * - Symbols: ecraneconco_render_item
 * - Ledger: ENU-623C57
 *
 * Porting notes:
 * - Native effect rendering is replaced by Web renderer identifiers.
 */

/**
 * Replacement for upstream `ecraneconco_render_item`.
 *
 * Role:
 * - Identifies crane construction overlay pieces for renderer ordering.
 *
 * Ledger: ENU-623C57
 * Upstream: ecraneconco.h:7-10
 *
 * Adaptation:
 * - Keeps numeric identifiers while using descriptive TypeScript names.
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
