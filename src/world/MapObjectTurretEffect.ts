/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: emapobjectturrent.h
 * - Symbols: _EMAPOBJECTTURRENT_H_
 * - Ledger: MAC-9A9BA4
 *
 * Porting notes:
 * - C header guards for map object effects are represented by ES module
 *   boundaries.
 */

/**
 * Marker exported from the map object turret effect module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted
 *   `emapobjectturrent.h` include guard before the full `EMapObjectTurrent`
 *   effect class is ported.
 *
 * Ledger: MAC-9A9BA4
 * Upstream: emapobjectturrent.h:2
 *
 * Adaptation:
 * - Replaces the C `_EMAPOBJECTTURRENT_H_` header guard with TypeScript module
 *   loading.
 */
export const EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED = true;
