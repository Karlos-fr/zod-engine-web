/**
 * Ported from Zod Engine.
 * Upstream: zsdl.cpp
 */

/**
 * Browser-side shutdown hooks for the SDL compatibility layer.
 * Role: Carries the subsystem shutdown operations invoked by `ZSDL_Quit`.
 * Ledger: FUN-5843FA
 * Upstream: zsdl.cpp:758-762
 */
export type ZsdlQuitHooks = {
  closeAudio(): void;
  quitSdl(): void;
};

/**
 * Replacement for upstream `ZSDL_Quit`.
 * Role: Shuts down audio before shutting down the SDL/Web rendering layer.
 * Ledger: FUN-5843FA
 * Upstream: zsdl.cpp:758-762
 */
export function quitZsdl(hooks: ZsdlQuitHooks): void {
  hooks.closeAudio();
  hooks.quitSdl();
}
