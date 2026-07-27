/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: cgatling.h / cgatling.cpp
 * - File: cgun.h / cgun.cpp
 * - File: chowitzer.h / chowitzer.cpp
 * - File: cmissilecannon.h / cmissilecannon.cpp
 * - Symbols: _CGATLING_H_, _CGUN_H_, _CHOWITZER_H_, _CMISSILECANNON_H_, unit_x, unit_y
 * - Ledger: MAC-EDD456, CON-035582, CON-8E48FD, CON-0EFFBA, CON-AE2BF0, MAC-DBCCD7, CON-1BE418, CON-D08D4C, MAC-897021, CON-681B9D, CON-D00D5D, MAC-3ABC2E
 *
 * Porting notes:
 * - C header guards are represented by TypeScript module boundaries.
 * - Cannon render offsets are represented as named constants.
 */

/**
 * Port of upstream `_CGATLING_H_`.
 *
 * Role:
 * - Marks that the CGatling header boundary has been adapted to this module.
 *
 * Ledger: MAC-EDD456
 * Upstream: cgatling.h:2
 *
 * Adaptation:
 * - Replaces the C `_CGATLING_H_` header guard with TypeScript module loading.
 */
export const CGATLING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CGUN_H_`.
 *
 * Role:
 * - Marks that the CGun header boundary has been adapted to this module.
 *
 * Ledger: MAC-DBCCD7
 * Upstream: cgun.h:2
 *
 * Adaptation:
 * - Replaces the C `_CGUN_H_` header guard with TypeScript module loading.
 */
export const CGUN_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CHOWITZER_H_`.
 *
 * Role:
 * - Marks that the CHowitzer header boundary has been adapted to this module.
 *
 * Ledger: MAC-897021
 * Upstream: chowitzer.h:2
 *
 * Adaptation:
 * - Replaces the C `_CHOWITZER_H_` header guard with TypeScript module loading.
 */
export const CHOWITZER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_CMISSILECANNON_H_`.
 *
 * Role:
 * - Marks that the CMissileCannon header boundary has been adapted to this module.
 *
 * Ledger: MAC-3ABC2E
 * Upstream: cmissilecannon.h:2
 *
 * Adaptation:
 * - Replaces the C `_CMISSILECANNON_H_` header guard with TypeScript module
 *   loading.
 */
export const CMISSILECANNON_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `unit_x` from `CGatling`.
 *
 * Role:
 * - Defines the x offset of the gatling cannon unit render source.
 *
 * Ledger: CON-035582
 * Upstream: cgatling.cpp:91, cgatling.cpp:202
 *
 * Notes:
 * - Unit is source image pixels.
 * - The same upstream local constant appears in both gatling cannon render and
 *   process code with the same value.
 */
export const GATLING_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_x` from `CHowitzer`.
 *
 * Role:
 * - Defines the x offset of the howitzer cannon unit render source.
 *
 * Ledger: CON-D08D4C
 * Upstream: chowitzer.cpp:90
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const HOWITZER_CANNON_UNIT_X_PIXELS = -2;

/**
 * Port of upstream `unit_y` from `CHowitzer`.
 *
 * Role:
 * - Defines the y offset of the howitzer cannon unit render source.
 *
 * Ledger: CON-1BE418
 * Upstream: chowitzer.cpp:91
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const HOWITZER_CANNON_UNIT_Y_PIXELS = -12;

/**
 * Port of upstream `unit_x` from `CMissileCannon`.
 *
 * Role:
 * - Defines the x offset of the missile cannon unit render source.
 *
 * Ledger: CON-681B9D
 * Upstream: cmissilecannon.cpp:98
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const MISSILE_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CMissileCannon`.
 *
 * Role:
 * - Defines the y offset of the missile cannon unit render source.
 *
 * Ledger: CON-D00D5D
 * Upstream: cmissilecannon.cpp:99
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const MISSILE_CANNON_UNIT_Y_PIXELS = -8;

/**
 * Port of upstream `unit_x` from `CGun`.
 *
 * Role:
 * - Defines the x offset of the gun cannon unit render source.
 *
 * Ledger: CON-AE2BF0
 * Upstream: cgun.cpp:84
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const GUN_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CGun`.
 *
 * Role:
 * - Defines the y offset of the gun cannon unit render source.
 *
 * Ledger: CON-0EFFBA
 * Upstream: cgun.cpp:85
 *
 * Notes:
 * - Unit is source image pixels.
 */
export const GUN_CANNON_UNIT_Y_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CGatling`.
 *
 * Role:
 * - Defines the y offset of the gatling cannon unit render source.
 *
 * Ledger: CON-8E48FD
 * Upstream: cgatling.cpp:92, cgatling.cpp:203
 *
 * Notes:
 * - Unit is source image pixels.
 * - The same upstream local constant appears in both gatling cannon render and
 *   process code with the same value.
 */
export const GATLING_CANNON_UNIT_Y_PIXELS = -7;
