/**
 * Upstream: zsdl.cpp
 */

/**
 * Browser-side shutdown hooks for the SDL compatibility layer.
 * Role: Carries the subsystem shutdown operations invoked by `ZSDL_Quit`.
 * Upstream: zsdl.cpp:758-762
 */
export type BrowserRuntimeShutdownHooks = {
  closeAudio(): void;
  shutdownRenderer(): void;
};

/**
 * Replacement for upstream `ZSDL_Quit`.
 * Role: Shuts down audio before shutting down the SDL/Web rendering layer.
 * Upstream: zsdl.cpp:758-762
 */
export function shutdownBrowserRuntime(hooks: BrowserRuntimeShutdownHooks): void {
  hooks.closeAudio();
  hooks.shutdownRenderer();
}
