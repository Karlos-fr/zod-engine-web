/**
 * Ported from Zod Engine.
 * Upstream: zsdl.cpp
 * Symbols: ZSDL_Quit
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
 * Adaptation: Replaces `Mix_CloseAudio()` and `SDL_Quit()` with injected browser lifecycle hooks while preserving call order.
 */
export function quitZsdl(hooks: ZsdlQuitHooks): void {
  hooks.closeAudio();
  hooks.quitSdl();
}
