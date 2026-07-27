/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: gmm_select_map.h
 * - Symbols: _ZGMM_SELECT_MAP_H_
 * - Ledger: MAC-415C0D
 *
 * Porting notes:
 * - C header guards for map selection UI state are represented by ES module
 *   boundaries.
 */

/**
 * Marker exported from the map selection module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `gmm_select_map.h`
 *   include guard before the full `GMMSelectMap` menu class is ported.
 *
 * Ledger: MAC-415C0D
 * Upstream: gmm_select_map.h:2
 *
 * Adaptation:
 * - Replaces the C `_ZGMM_SELECT_MAP_H_` header guard with TypeScript module
 *   loading.
 */
export const GMM_SELECT_MAP_HEADER_GUARD_PORTED = true;
