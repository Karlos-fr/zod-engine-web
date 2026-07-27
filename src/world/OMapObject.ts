/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: omapobject.h
 * - Symbols: _OMAPOBJECT_H_
 * - Ledger: MAC-56C8DF
 *
 * Porting notes:
 * - C header guards for map objects are represented by ES module boundaries.
 */

/**
 * Marker exported from the object map object module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `omapobject.h` include
 *   guard before the full `OMapObject` class is ported.
 *
 * Ledger: MAC-56C8DF
 * Upstream: omapobject.h:2
 *
 * Adaptation:
 * - Replaces the C `_OMAPOBJECT_H_` header guard with TypeScript module
 *   loading.
 */
export const OMAP_OBJECT_HEADER_GUARD_PORTED = true;
