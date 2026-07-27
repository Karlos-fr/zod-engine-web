/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: map_merger.cpp
 * - Symbols: direction
 * - Ledger: ENU-EF1A8E
 *
 * Porting notes:
 * - Map merger command-line state is represented as typed data for future
 *   browser/editor tooling.
 */

/**
 * Port of upstream `direction`.
 *
 * Role:
 * - Identifies whether map merger operations combine maps vertically or
 *   horizontally.
 *
 * Ledger: ENU-EF1A8E
 * Upstream: map_merger.cpp:4-7
 */
export enum MapMergeDirection {
  Vertical = 0,
  Horizontal = 1,
}
