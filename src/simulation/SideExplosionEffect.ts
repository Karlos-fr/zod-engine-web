/**
 * Ported from Zod Engine.
 * Upstream: esideexplosion.h
 */

/**
 * Port of upstream `_ESIDEEXPLOSION_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-137C87
 * Upstream: esideexplosion.h:2
 */
export const ESIDE_EXPLOSION_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `side_explosion_type`.
 * Role: Identifies the side explosion effect variant.
 * Ledger: ENU-8BCD13
 * Upstream: esideexplosion.h:6-9
 */
export enum SideExplosionType {
  Normal = 0,
}
