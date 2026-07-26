import type { AssetManifest } from "./AssetManifest";

export class AssetLoader {
  constructor(private readonly manifest: AssetManifest) {}

  list(): string[] {
    return this.manifest.entries.map((entry) => entry.id);
  }
}
